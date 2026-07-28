import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ApiUser } from '../api/types';
import { bootstrapSession } from '../api/auth';

interface AuthContextValue {
  user: ApiUser | null;
  setUser: (user: ApiUser | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app boot, try to exchange the refresh-token cookie (if any) for a
    // fresh access token + the logged-in user. If there's no valid cookie
    // (first-time visitor, logged out, etc.) this just resolves to null —
    // that's expected, not an error.
    bootstrapSession()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
