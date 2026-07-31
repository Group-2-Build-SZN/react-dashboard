import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle } from "../../api/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    if (document.getElementById("google-identity-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

interface GoogleSignInButtonProps {
  fullWidth?: boolean;
  redirectTo: string;
}

export function GoogleSignInButton({ fullWidth, redirectTo }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const google = (window as any).google;
        if (!google?.accounts?.id) return;

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            setError(null);
            try {
              const user = await signInWithGoogle(response.credential);
              setUser(user);
              navigate(redirectTo);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Google sign-in failed");
            }
          },
        });

        google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: containerRef.current.offsetWidth || 320,
          text: "continue_with",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Google sign-in unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo, setUser]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        title="Google sign-in isn't configured yet (missing VITE_GOOGLE_CLIENT_ID)"
        className={`flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-5 py-3.5 text-button text-neutral-400 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        Continue with Google (not configured)
      </button>
    );
  }

  return (
    <div>
      <div ref={containerRef} className={fullWidth ? "w-full" : ""} />
      {error && <p className="mt-2 text-small text-red-500">{error}</p>}
    </div>
  );
}
