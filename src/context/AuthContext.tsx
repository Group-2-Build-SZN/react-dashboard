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
