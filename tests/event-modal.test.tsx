import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import EventModal from '../src/components/EventModal';
import { StaticPageContext } from '../src/seo/StaticPageContext';

it('does not mount hidden interactive controls while closed', () => {
  render(<MemoryRouter><EventModal isOpen={false} onClose={() => {}} /></MemoryRouter>);
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('dialog')).toBeNull();
});
it('focuses the close button, traps Tab, dismisses with Escape, and restores focus', () => {
  const onClose = vi.fn();
  const trigger = document.createElement('button');
  trigger.textContent = 'Open referral program';
  document.body.append(trigger); trigger.focus();
  const view = render(<MemoryRouter><EventModal isOpen onClose={onClose} /></MemoryRouter>);
  const close = screen.getByRole('button', { name: 'Close referral program' });
  expect(document.activeElement).toBe(close);
  const controls = screen.getByRole('dialog').querySelectorAll('a, button');
  const first = controls[0] as HTMLElement;
  const last = controls[controls.length - 1] as HTMLElement;
  last.focus(); fireEvent.keyDown(last, { key: 'Tab' });
  expect(document.activeElement).toBe(first);
  fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(close, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledOnce();
  view.unmount(); expect(document.activeElement).toBe(trigger);
  trigger.remove();
});
it('has a named dialog and passes automatic semantic accessibility checks', async () => {
  render(<MemoryRouter><EventModal isOpen onClose={() => {}} /></MemoryRouter>);
  const dialog = screen.getByRole('dialog', { name: 'Refer & Earn' });
  const results = await axe.run(dialog, { rules: { 'color-contrast': { enabled: false } } });
  expect(results.violations.map(item => item.id)).toEqual([]);
});
it('renders the static referral content without dialog controls', () => {
  render(<MemoryRouter><StaticPageContext.Provider value><EventModal isOpen={false} onClose={() => {}} /></StaticPageContext.Provider></MemoryRouter>);
  expect(screen.getByText('Refer & Earn')).toBeTruthy();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('dialog')).toBeNull();
});
