// src/components/Portal.tsx

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  const portalRoot = document.getElementById('modal-portal');
  if (!portalRoot) {
    // This should ideally never happen if index.html is set up correctly.
    console.error("The modal-portal element was not found in the DOM.");
    return null;
  }

  return createPortal(children, portalRoot);
};

export default Portal;
