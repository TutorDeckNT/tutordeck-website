import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import LogActivityModal from '../src/components/LogActivityModal';
vi.mock('../src/contexts/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'test-user' } }) }));

it('initializes the date picker after the animated date step mounts, and cleans up on unmount', async () => {
  const portal = document.createElement('div');
  portal.id = 'modal-portal'; document.body.append(portal);
  const view = render(<LogActivityModal isOpen onClose={() => {}} onActivityAdded={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Peer Tutoring/ }));
  const input = await screen.findByLabelText('Volunteer date') as HTMLInputElement & { _flatpickr?: { setDate: (date: string, trigger: boolean) => void } };
  await waitFor(() => expect(input._flatpickr).toBeTruthy());
  expect(document.querySelectorAll('.flatpickr-calendar')).toHaveLength(1);
  view.unmount();
  expect(document.querySelector('.flatpickr-calendar')).toBeNull();
  portal.remove();
});
