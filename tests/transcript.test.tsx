import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import DashboardPage from '../src/pages/DashboardPage';
const fixture = vi.hoisted(() => ({ getIdToken: vi.fn().mockResolvedValue('local-test-token') }));
vi.mock('../src/contexts/AuthContext', () => { const user = { uid: 'test-user', displayName: 'Test Volunteer', email: 'test@example.com', getIdToken: fixture.getIdToken }; return { useAuth: () => ({ user }) }; });
vi.mock('../src/components/dashboard/ActivityChart', () => ({ default: () => <div>Activity chart</div> }));

it('preserves the authorized server request for PDF transcript generation', async () => {
  vi.stubEnv('VITE_RENDER_API_URL', 'https://api.example.test');
  localStorage.setItem('cachedActivities', JSON.stringify({ lastModified: null, activities: [{ id: '1', activityType: 'Peer Tutoring', activityDate: { _seconds: 1760000000, _nanoseconds: 0 }, hours: 1, proofLink: 'https://example.test/proof' }] }));
  localStorage.setItem('lastAutoSyncTimestamp', Date.now().toString());
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'Transcript queued' }) });
  vi.stubGlobal('fetch', fetch);
  render(<DashboardPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Email' }));
  expect(screen.getByLabelText('Email Address')).toHaveProperty('value', 'test@example.com');
  fireEvent.click(screen.getByRole('button', { name: 'Confirm & Send' }));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith('https://api.example.test/generate-transcript', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer local-test-token' }, body: JSON.stringify({ email: 'test@example.com' }) }));
  expect(await screen.findByText('Transcript queued')).toBeTruthy();
  vi.unstubAllEnvs();
});
