import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, CircleCheckBig } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { OTPInput } from "../../components/ui/OTPInput";
import { useAuth } from "../../lib/AuthContext";
import { verifyCode, requestCode } from "../../../api/auth";
import loginCheckImage from "../../assets/images/unsplash_hE0nmTffKtM.png";
import signupCheckImage from "../../assets/images/unsplash_YI5vG37d-Ig.png";

interface CheckEmailProps {
  mode: "login" | "signup";
}

const copy = {
  login: {
    panelTitle: "Welcome to My Ulo",
    panelSubtitle: "We make accessing your account simple and safe.",
    image: loginCheckImage,
  },
  signup: {
    panelTitle: "Welcome to My Ulo",
    panelSubtitle: "Your journey to a better home starts here.",
    image: signupCheckImage,
  },
};

const RESEND_SECONDS = 45;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export function CheckEmail({ mode }: CheckEmailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const state = location.state as { email?: string; fullName?: string } | null;
  const email = state?.email || "example@gmail.com";
  const content = copy[mode];
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  async function handleOTPChange(code: string) {
    if (code.length !== 6) return;
    setError(null);
    setIsVerifying(true);

    try {
      const user = await verifyCode(email, code);
      setUser(user);

      if (mode === "signup" && !user.firstName) {
        navigate("/choose-user-type", { state: { fullName: state?.fullName } });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleResend() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    requestCode(email).catch((err) => setError(err instanceof Error ? err.message : "Failed to resend code"));
  }

  return (
    <AuthLayout
      image={content.image}
      imageAlt=""
      panelTitle={content.panelTitle}
      panelSubtitle={content.panelSubtitle}
    >
      <div className="flex flex-col items-center text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Mail size={26} className="text-primary" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <CircleCheckBig size={14} />
          </span>
        </span>

        <h2 className="mt-6 text-h2 font-bold text-neutral">Check your email</h2>
        <p className="mt-2 text-body text-neutral-500">
          We've sent a 6-digit code to
          <br />
          <span className="font-medium text-primary">{email}</span>
        </p>

        <div className="mt-8">
          <OTPInput onChange={handleOTPChange} />
        </div>

        {isVerifying && <p className="mt-3 text-small text-neutral-500">Verifying…</p>}
        {error && <p className="mt-3 text-small text-error">{error}</p>}

        <p className="mt-8 text-small text-neutral-500">
          {secondsLeft > 0 ? (
            <>
              Didn't receive the email? Check your spam folder or resend in{" "}
              <span className="font-medium text-primary">
                {formatTime(secondsLeft)}
              </span>
            </>
          ) : (
            <>
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-primary"
              >
                Resend code
              </button>
            </>
          )}
        </p>

        <Link
          to={mode === "login" ? "/login" : "/signup"}
          className="mt-4 text-small text-neutral-400 hover:text-neutral-600"
        >
          ← Back
        </Link>
      </div>
    </AuthLayout>
  );
}
