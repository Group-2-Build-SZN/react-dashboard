import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";

import loginIllustration from "../../assets/branding/login-illustration.png";

type LoginProps = {
  onBack?: () => void;
  onContinueWithEmail?: (email: string) => void;
  onSignUp?: () => void;
  error?: string | null;
};

function Login({
  onBack,
  onContinueWithEmail,
  onSignUp,
  error,
}: LoginProps) {
  const [email, setEmail] = useState("");

  return (
    <div style={{ padding: '10px 15px' }} className="flex min-h-screen flex-col bg-blue-tint px-6 pb-8 pt-5">

      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <div className="flex flex-1 flex-col justify-center gap-8">

        <div className="flex justify-center">
          <img
            src={loginIllustration}
            alt=""
            className="h-36 w-auto object-contain"
          />
        </div>

        <div>
          <h1 className="text-[28px] font-bold leading-9 text-gray-900">
            Welcome back
          </h1>

          <p className="mt-1 text-base leading-6 text-gray-500">
            Enter your email and we'll send you a code to log in
          </p>
        </div>

        <Input
          id="login-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ padding: '2px 10px' }}
        />

        {error && <p className="-mt-4 text-sm text-error-600">{error}</p>}

        <div className="flex flex-col gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onContinueWithEmail?.(email)}
          >
            Continue with Email
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-muted" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-muted" />
          </div>

          <GoogleSignInButton fullWidth redirectTo="/home" />
        </div>

        <div className="text-center text-xs leading-4 text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <span className="text-primary-800">Terms &amp; Conditions</span>{" "}
            and <span className="text-primary-800">Privacy Policy</span>.
          </p>

          <p className="mt-2">
            Don't have an account?{" "}
            <button onClick={onSignUp} className="font-medium text-primary-800">
              Sign up
            </button>
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;
