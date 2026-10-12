import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
// Explicit storage keeps the DOM tests compatible with Node's experimental
// global localStorage as well as Node 20 used by CI.
function storage() {
  const values = new Map<string, string>();
  return { get length() { return values.size; }, clear: () => values.clear(), getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, String(value)), removeItem: (key: string) => values.delete(key), key: (index: number) => [...values.keys()][index] ?? null };
}
vi.stubGlobal('localStorage', storage());
vi.stubGlobal('sessionStorage', storage());
window.matchMedia = query => ({ matches: false, media: query, onchange: null, dispatchEvent: () => true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
