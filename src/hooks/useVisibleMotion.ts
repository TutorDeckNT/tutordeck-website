import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useVisibleMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.toggleAttribute('data-motion-paused', !entry.isIntersecting);
      }
    });
    const sections = document.querySelectorAll('main > section, footer');
    sections.forEach(section => { section.setAttribute('data-motion-paused', ''); observer.observe(section); });
    return () => observer.disconnect();
  }, [pathname]);
}
