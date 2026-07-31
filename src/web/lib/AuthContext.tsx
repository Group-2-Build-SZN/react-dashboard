import { useAuth as useSharedAuth } from '../../context/AuthContext';
import { logout as apiLogout } from '../../api/auth';

export function useAuth() {
  const { user, setUser, isLoading } = useSharedAuth();

  return {
    isLoggedIn: !!user,
    isLoading,
    user,
    setUser,
    logout: async () => {
      await apiLogout();
      setUser(null);
    },
  };
}
