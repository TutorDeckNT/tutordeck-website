import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import ProtectedRoute from '../src/components/ProtectedRoute';

const fixture = vi.hoisted(() => ({ observe: vi.fn(), unsubscribe: vi.fn(), signIn: vi.fn(), logOut: vi.fn(), onUser: undefined as undefined | ((user: any) => void) }));
vi.mock('../src/lib/auth', () => ({
  observeAuth: (...args: any[]) => { fixture.observe(...args); fixture.onUser = args[0]; return fixture.unsubscribe; },
  signIn: fixture.signIn,
  logOut: fixture.logOut,
}));
function Account() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  return <><p>{loading ? 'restoring' : user?.displayName || 'signed out'}</p><button onClick={signInWithGoogle}>Sign in</button><button onClick={logout}>Sign out</button></>;
}
const user = { uid: 'test-user', displayName: 'Test Volunteer' };
beforeEach(() => { vi.useFakeTimers(); vi.clearAllMocks(); fixture.onUser = undefined; });
const initialize = async () => { await act(async () => { await vi.advanceTimersByTimeAsync(1000); }); };

describe('authentication loading and restoration', () => {
  it('renders public content immediately while protected content waits for restored authentication', async () => {
    render(<MemoryRouter initialEntries={['/dashboard']}><AuthProvider><p>Public navigation</p><Routes><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<p>Private dashboard</p>} /></Route><Route path="/login" element={<p>Login page</p>} /></Routes></AuthProvider></MemoryRouter>);
    expect(screen.getByText('Public navigation')).toBeTruthy();
    expect(screen.queryByText('Private dashboard')).toBeNull();
    expect(fixture.observe).not.toHaveBeenCalled();
    await initialize();
    act(() => fixture.onUser?.(user));
    expect(screen.getByText('Private dashboard')).toBeTruthy();
  });
  it('redirects only after authentication resolves signed out and unsubscribes on unmount', async () => {
    const view = render(<MemoryRouter initialEntries={['/dashboard']}><AuthProvider><Routes><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<p>Private dashboard</p>} /></Route><Route path="/login" element={<p>Login page</p>} /></Routes></AuthProvider></MemoryRouter>);
    expect(screen.queryByText('Login page')).toBeNull();
    await initialize();
    act(() => fixture.onUser?.(null));
    expect(screen.getByText('Login page')).toBeTruthy();
    view.unmount();
    expect(fixture.unsubscribe).toHaveBeenCalledOnce();
  });
  it('signs in on demand before the restoration timer and signs out', async () => {
    fixture.signIn.mockResolvedValue(user);
    fixture.logOut.mockResolvedValue(undefined);
    render(<AuthProvider><Account /></AuthProvider>);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Sign in' })));
    expect(screen.getByText('Test Volunteer')).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Sign out' })));
    expect(screen.getByText('signed out')).toBeTruthy();
  });
  it('keeps public content usable on initialization error', async () => {
    render(<AuthProvider><Account /><p>Public content</p></AuthProvider>);
    await initialize();
    act(() => fixture.observe.mock.calls.at(-1)?.[1]());
    expect(screen.getByText('Public content')).toBeTruthy();
    expect(screen.getByText('signed out')).toBeTruthy();
  });
});
