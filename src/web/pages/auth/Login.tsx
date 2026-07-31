import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { GoogleSignInButton } from "../../../components/auth/GoogleSignInButton";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import logo from "../../assets/images/logo-icon.svg";
import loginImage from "../../assets/images/Rectangle 3 (2).png";
import { requestCode } from "../../../api/auth";

export function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await requestCode(email);
      navigate("/login/check-email", { state: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      image={loginImage}
      imageAlt="Modern verified property"
      panelTitle="Welcome Back"
      panelSubtitle="Log in to continue your property search journey."
      footer={
        <p className="text-body text-neutral-500">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-primary">
            Create an account
          </Link>
        </p>
      }
    >
      <Link to="/" className="mb-8 flex items-center gap-2">
        <img src={logo} alt="My Ulo" className="h-10 w-10" />
      </Link>

      <h2 className="text-h2 font-bold text-neutral">Log in to your account</h2>
      <p className="mt-2 text-body text-neutral-500">
        Enter your email to receive a 6-digit code.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" size="lg" fullWidth icon={<Send size={18} />} disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send me a code"}
        </Button>

        {error && <p className="text-small text-error">{error}</p>}

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-small text-neutral-500">or continue with</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <GoogleSignInButton fullWidth redirectTo="/dashboard" />

        <p className="flex items-center justify-center gap-1.5 text-small text-neutral-500">
          <ShieldCheck size={14} className="text-secondary" />
          We'll never share your email with anyone
        </p>

        <p className="text-center text-body text-neutral">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-primary">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
