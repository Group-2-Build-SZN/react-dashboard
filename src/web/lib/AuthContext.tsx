// Desktop pages were built against a mock AuthContext (`{ isLoggedIn, login,
// logout }`, backed by a localStorage boolean, no real backend). Mobile's
// AuthContext (src/context/AuthContext.tsx) is the real one — it calls
// /auth/refresh + /users/me on boot and holds the actual logged-in user.
//
// Rather than maintain two separate auth states (which would desync the
// moment someone resizes their window across the breakpoint), this file
// re-exports the SAME shared context, reshaped into the interface desktop
// pages already call — so none of the ~9 desktop files that call useAuth()
// needed rewriting for the structural merge.
//
// One thing this can't paper over: `login()` used to just flip a boolean.
// There's no way to "fake log in" against a real backend — actually
// authenticating requires a real request-code + verify-code round trip.
// login() is kept as a no-op (with a dev warning) purely so existing call
// sites still compile; the "[Dev only] Skip to Dashboard" button that calls
// it should be removed once real auth is wired into these pages, since it
// currently does nothing.
import { useAuth as useSharedAuth } from '../../context/AuthContext';
import { logout as apiLogout } from '../../api/auth';

export function useAuth() {
  const { user, setUser, isLoading } = useSharedAuth();

  return {
    isLoggedIn: !!user,
    isLoading,
    user,
    login: () => {
      console.warn(
        '[web/lib/AuthContext] login() is a no-op — desktop auth pages still use the old magic-link mock flow, not the real OTP-based backend. See the auth-flow mismatch flagged separately.'
      );
    },
    logout: async () => {
      await apiLogout();
      setUser(null);
    },
  };
}
