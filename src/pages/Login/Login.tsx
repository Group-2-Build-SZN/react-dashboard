import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import GoogleIcon from "../../components/GoogleIcon/GoogleIcon";

import loginIllustration from "../../assets/branding/login-illustration.png";

type LoginProps = {
  onBack?: () => void;
  onContinueWithEmail?: (email: string) => void;
  onContinueWithGoogle?: () => void;
  onSignUp?: () => void;
};

function Login({
  onBack,
  onContinueWithEmail,
  onContinueWithGoogle,
  onSignUp,
}: LoginProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-blue-tint px-6 pb-8 pt-5">

      {/* Back */}
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      {/* Illustration */}
      <div className="mt-8 flex justify-center">
        <img
          src={loginIllustration}
          alt=""
          className="h-32 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Enter your email and we'll send you a code to log in
        </p>
      </div>

      {/* Email */}
      <div className="mt-8">
        <Input
          id="login-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4">
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

        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2"
          onClick={onContinueWithGoogle}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-xs leading-relaxed text-gray-500">
        <p>
          By continuing, you agree to our{" "}
          <span className="text-primary-800">Terms &amp; Conditions</span>{" "}
          and <span className="text-primary-800">Privacy Policy</span>.
        </p>

        <p>
          Don't have an account?{" "}
          <button onClick={onSignUp} className="font-medium text-primary-800">
            Sign up
          </button>
        </p>
      </div>

    </div>
  );
}

export default Login;
