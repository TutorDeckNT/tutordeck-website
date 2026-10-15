import { StrictMode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import ChapterMap from '../src/components/home/ChapterMap';

it('mounts safely in StrictMode, supports chapter selection after tile failure, and remounts cleanly', async () => {
  vi.stubGlobal('IntersectionObserver', class {
    constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
    observe() { this.callback([{ isIntersecting: true }]); }
    disconnect() {}
  });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const mount = () => render(<StrictMode><MemoryRouter><ChapterMap /></MemoryRouter></StrictMode>);
  const first = mount();
  await waitFor(() => expect(document.querySelectorAll('.leaflet-marker-icon')).toHaveLength(8));
  const tile = document.querySelector('.leaflet-tile')!;
  fireEvent.error(tile);
  expect(screen.getByRole('status').textContent).toContain('could not load');
  fireEvent.change(screen.getByLabelText('Find a chapter'), { target: { value: '5' } });
  expect(document.querySelector('.leaflet-popup-content')?.textContent).toContain('Cypress, CA · Peak members: 71');
  fireEvent.change(screen.getByLabelText('Find a chapter'), { target: { value: '-1' } });
  expect(document.querySelector('.leaflet-popup-content')).toBeNull();
  first.unmount();
  expect(document.querySelector('.leaflet-container')).toBeNull();
  mount();
  await waitFor(() => expect(document.querySelectorAll('.leaflet-marker-icon')).toHaveLength(8));
});
