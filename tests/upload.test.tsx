import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import DirectUploader from '../src/components/DirectUploader';

const fixture = vi.hoisted(() => ({ upload: vi.fn(), share: vi.fn() }));
vi.mock('../src/contexts/DropboxContext', () => ({ useDropbox: () => ({ isAuthenticated: true, login: vi.fn(), dbx: { filesUpload: fixture.upload, sharingCreateSharedLinkWithSettings: fixture.share } }) }));

it('uploads audio and returns the shared proof URL and duration without contacting Dropbox', async () => {
  fixture.upload.mockResolvedValue({ result: { path_display: '/proof.mp3' } });
  fixture.share.mockResolvedValue({ result: { url: 'https://www.dropbox.com/s/test/proof.mp3' } });
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:local-test') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
  vi.stubGlobal('Audio', class { duration = 120; onloadedmetadata: (() => void) | null = null; constructor() { queueMicrotask(() => this.onloadedmetadata?.()); } });
  const success = vi.fn();
  const { container } = render(<DirectUploader onUploadSuccess={success} />);
  const file = new File(['test audio'], 'proof.mp3', { type: 'audio/mpeg' });
  fireEvent.change(container.querySelector('input')!, { target: { files: [file] } });
  await waitFor(() => expect(success).toHaveBeenCalledWith('https://www.dropbox.com/s/test/proof.mp3', 120));
  expect(fixture.upload).toHaveBeenCalledWith({ path: expect.stringContaining('proof.mp3'), contents: file });
  expect(fixture.share).toHaveBeenCalledWith({ path: '/proof.mp3', settings: { requested_visibility: { '.tag': 'public' } } });
});
it('rejects non-audio files without sending an upload', async () => {
  fixture.upload.mockClear();
  const { container } = render(<DirectUploader onUploadSuccess={() => {}} />);
  fireEvent.change(container.querySelector('input')!, { target: { files: [new File(['test'], 'proof.txt')] } });
  expect(await screen.findByText(/Invalid file type/)).toBeTruthy();
  expect(fixture.upload).not.toHaveBeenCalled();
});
