import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { DropboxProvider, useDropbox } from '../src/contexts/DropboxContext';

const sdk = vi.hoisted(() => ({ constructed: vi.fn(), auth: vi.fn().mockResolvedValue('https://www.dropbox.com/oauth2/authorize?client_id=test') }));
vi.mock('dropbox', () => ({
  Dropbox: class { constructor(options: unknown) { sdk.constructed(options); } },
  DropboxAuth: class { getAuthenticationUrl() { return sdk.auth(); } },
}));
function Account() {
  const { accessToken, dbx, login, logout } = useDropbox();
  return <><p>{accessToken || 'disconnected'}</p><p>{dbx ? 'SDK ready' : 'SDK not loaded'}</p><button onClick={login}>Connect</button><button onClick={logout}>Disconnect</button></>;
}
it('leaves the SDK unloaded for public visits without a Dropbox session', () => {
  sdk.constructed.mockClear();
  render(<DropboxProvider><Account /></DropboxProvider>);
  expect(sdk.constructed).not.toHaveBeenCalled();
});
it('restores sessions and clears the SDK on logout', async () => {
  sessionStorage.setItem('dropbox_token', 'local-test-token');
  render(<DropboxProvider><Account /></DropboxProvider>);
  await screen.findByText('SDK ready');
  fireEvent.click(screen.getByText('Disconnect'));
  expect(sessionStorage.getItem('dropbox_token')).toBeNull();
  expect(screen.getByText('disconnected')).toBeTruthy();
});
it('accepts only same-origin token messages', async () => {
  render(<DropboxProvider><Account /></DropboxProvider>);
  act(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://untrusted.example', data: { type: 'DROPBOX_TOKEN', token: 'rejected' } })));
  expect(sessionStorage.getItem('dropbox_token')).toBeNull();
  act(() => window.dispatchEvent(new MessageEvent('message', { origin: window.location.origin, data: { type: 'DROPBOX_TOKEN', token: 'local-test-token' } })));
  await screen.findByText('SDK ready');
  expect(sessionStorage.getItem('dropbox_token')).toBe('local-test-token');
});
it('opens the popup synchronously before loading the SDK and navigates after it loads', async () => {
  sdk.auth.mockResolvedValue('https://www.dropbox.com/oauth2/authorize?client_id=test');
  vi.stubEnv('VITE_DROPBOX_CLIENT_ID', 'test-client');
  // The module reads CLIENT_ID at evaluation; use a fresh import for the configured case.
  vi.resetModules();
  const { DropboxProvider: ConfiguredProvider, useDropbox: configuredDropbox } = await import('../src/contexts/DropboxContext');
  function Connect() { const { login } = configuredDropbox(); return <button onClick={login}>Connect configured</button>; }
  const popup = { closed: false, location: { href: 'about:blank' }, close: vi.fn() };
  const open = vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
  render(<ConfiguredProvider><Connect /></ConfiguredProvider>);
  fireEvent.click(screen.getByText('Connect configured'));
  expect(open).toHaveBeenCalledWith('about:blank', 'Dropbox Authentication', expect.any(String));
  await waitFor(() => expect(popup.location.href).toContain('dropbox.com/oauth2/authorize'));
  vi.unstubAllEnvs();
});
it('returns a callback token to its same-origin opener and closes the popup', () => {
  const opener = { postMessage: vi.fn() };
  const previousOpener = window.opener;
  Object.defineProperty(window, 'opener', { configurable: true, value: opener });
  window.location.hash = 'access_token=callback-test-token&token_type=bearer';
  const close = vi.spyOn(window, 'close').mockImplementation(() => {});
  render(<DropboxProvider><Account /></DropboxProvider>);
  expect(opener.postMessage).toHaveBeenCalledWith({ type: 'DROPBOX_TOKEN', token: 'callback-test-token' }, window.location.origin);
  expect(close).toHaveBeenCalledOnce();
  Object.defineProperty(window, 'opener', { configurable: true, value: previousOpener });
  window.location.hash = '';
});
