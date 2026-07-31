import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Send, ShieldCheck } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import logo from "../../assets/images/logo-icon.svg";
import signupImage from "../../assets/images/ChatGPT Image Jul 14, 2026, 03_09_47 PM 2.png";
import { requestCode } from "../../../api/auth";

export function Signup() {
  const [fullName, setFullName] = useState("");
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
      navigate("/signup/check-email", { state: { email, fullName } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      image={signupImage}
      imageAlt="My Ulo mobile app"
      panelTitle="Create an account"
      panelSubtitle="Join thousands of people finding verified homes on My Ulo."
      footer={
        <p className="text-body text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </p>
      }
    >
      <Link to="/" className="mb-8 flex items-center gap-2">
        <img src={logo} alt="My Ulo" className="h-10 w-10" />
      </Link>

      <h2 className="text-h2 font-bold text-neutral">Sign up to get started</h2>
      <p className="mt-2 text-body text-neutral-500">
        Enter your email to get started. We'll send you a 6-digit code to
        create your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Input
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          icon={<User size={18} />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

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

        <GoogleSignInButton fullWidth />

        <p className="flex items-center justify-center gap-1.5 text-small text-neutral-500">
          <ShieldCheck size={14} className="text-secondary" />
          We'll never share your email with anyone
        </p>

        <p className="text-center text-body text-neutral">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
