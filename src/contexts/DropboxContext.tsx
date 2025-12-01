import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dropbox, DropboxAuth } from 'dropbox';

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

  // 1. Check for token in storage or URL hash on mount
  useEffect(() => {
    // Check URL hash for incoming OAuth redirect
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('token_type')) {
      const params = new URLSearchParams(hash.substring(1)); // remove the #
      const token = params.get('access_token');
      if (token) {
        sessionStorage.setItem('dropbox_token', token);
        setAccessToken(token);
        // Clean the URL so the router doesn't get confused
        window.location.hash = ''; 
      }
    } else {
      // Check storage
      const storedToken = sessionStorage.getItem('dropbox_token');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  // 2. Initialize Dropbox Client when token exists
  useEffect(() => {
    if (accessToken) {
      // The Dropbox class is used for making API calls (upload, share)
      const dropbox = new Dropbox({ accessToken });
      setDbx(dropbox);
    } else {
      setDbx(null);
    }
  }, [accessToken]);

  const login = () => {
    if (!CLIENT_ID) {
      console.error("Dropbox Client ID is missing in .env");
      return;
    }
    
    // Use DropboxAuth specifically for the authentication flow
    const dbxAuth = new DropboxAuth({ clientId: CLIENT_ID });
    
    // Redirect to Dropbox Auth page. 
    // We use the current window location as the redirect URI.
    const redirectUri = window.location.origin + window.location.pathname;
    
    dbxAuth.getAuthenticationUrl(redirectUri)
      .then((authUrl: any) => {
        // authUrl can be a string or an object depending on SDK version/options, 
        // but for this flow it is the URL string.
        window.location.href = authUrl;
      })
      .catch((error: any) => {
        console.error("Error getting Dropbox auth URL:", error);
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
