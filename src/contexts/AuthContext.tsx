import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let runtime: Promise<typeof import('../lib/auth')> | undefined;
const loadAuth = () => runtime ??= import('../lib/auth').catch(error => {
  runtime = undefined;
  throw error;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    const initialize = () => {
      loadAuth().then(({ observeAuth }) => {
        if (cancelled) return;
        unsubscribe = observeAuth(currentUser => {
          setUser(currentUser);
          setLoading(false);
        }, () => {
          setUser(null);
          setLoading(false);
        });
      }).catch(() => {
        // Public content remains usable if authentication cannot initialize.
        if (!cancelled) setLoading(false);
      });
    };
    // Let public content paint before downloading authentication code.
    const timer = window.setTimeout(initialize, 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { signIn } = await loadAuth();
    const currentUser = await signIn();
    setUser(currentUser);
    setLoading(false);
  };

  const logout = async () => {
    const { logOut } = await loadAuth();
    await logOut();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
