// src/contexts/DropboxContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Dropbox } from 'dropbox';

interface DropboxContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  dbx: Dropbox | null;
  login: () => void;
  logout: () => void;
}

const DropboxContext = createContext<DropboxContextType | undefined>(undefined);

const CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;

export const DropboxProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dbx, setDbx] = useState<Dropbox | null>(null);

  useEffect(() => {
    // --- 1. POPUP HANDLING (If this window is the popup) ---
    const hash = window.location.hash;
    if (window.opener && hash.includes('access_token') && hash.includes('token_type')) {
        const params = new URLSearchParams(hash.substring(1)); // remove the #
        const token = params.get('access_token');
        if (token) {
            // Send token back to main window
            window.opener.postMessage({ type: 'DROPBOX_TOKEN', token }, window.location.origin);
            // Close this popup
            window.close();
        }
        return;
    }

    // --- 2. MAIN WINDOW HANDLING ---
    // Check local storage for existing session
    const storedToken = sessionStorage.getItem('dropbox_token');
    if (storedToken) {
        setAccessToken(storedToken);
    }

    // Listen for the token message from the popup
    const handleMessage = (event: MessageEvent) => {
        // Security check: ensure message comes from same origin
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'DROPBOX_TOKEN' && event.data.token) {
            const token = event.data.token;
            sessionStorage.setItem('dropbox_token', token);
            setAccessToken(token);
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Load the SDK only for a restored or newly connected Dropbox session.
  useEffect(() => {
    let cancelled = false;
    setDbx(null);
    if (accessToken) {
      import('dropbox').then(({ Dropbox }) => {
        if (!cancelled) setDbx(new Dropbox({ accessToken }));
      }).catch(error => console.error('Could not load Dropbox', error));
    }
    return () => { cancelled = true; };
  }, [accessToken]);

  const login = () => {
    if (!CLIENT_ID) {
      console.error('Dropbox Client ID is missing in .env');
      return;
    }
    // Open during the click, before an asynchronous SDK import can trigger a popup blocker.
    const width = 600;
    const height = 700;
    const popup = window.open('about:blank', 'Dropbox Authentication',
      `width=${width},height=${height},left=${window.screen.width / 2 - width / 2},top=${window.screen.height / 2 - height / 2}`);
    if (!popup) return;
    import('dropbox').then(async ({ DropboxAuth }) => {
      const dbxAuth = new DropboxAuth({ clientId: CLIENT_ID });
      const redirectUri = window.location.origin + window.location.pathname;
      const authUrl = await dbxAuth.getAuthenticationUrl(redirectUri);
      if (!popup.closed) popup.location.href = String(authUrl);
    }).catch(error => {
      popup.close();
      console.error('Error getting Dropbox auth URL:', error);
    });
  };

  const logout = () => {
    sessionStorage.removeItem('dropbox_token');
    setAccessToken(null);
  };

  return (
    <DropboxContext.Provider value={{ isAuthenticated: !!accessToken, accessToken, dbx, login, logout }}>
      {children}
    </DropboxContext.Provider>
  );
};

export const useDropbox = () => {
  const context = useContext(DropboxContext);
  if (context === undefined) {
    throw new Error('useDropbox must be used within a DropboxProvider');
  }
  return context;
};
