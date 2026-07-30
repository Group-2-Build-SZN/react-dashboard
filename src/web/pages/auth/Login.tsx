import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import logo from "../../assets/images/logo-icon.svg";
import loginImage from "../../assets/images/Rectangle 3 (2).png";

export function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/login/check-email", { state: { email } });
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
        Enter your email to receive a secure sign-in link.
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

        <Button type="submit" size="lg" fullWidth icon={<Send size={18} />}>
          Send me a sign-in link
        </Button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-small text-neutral-500">or continue with</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <Button type="button" size="lg" variant="secondary" fullWidth>
          <svg width="18" height="18" viewBox="0 0 18 18" className="mr-1">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616Z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.706A5.4 5.4 0 0 1 3.68 9c0-.593.102-1.17.284-1.706V4.962H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z"
            />
          </svg>
          Continue with Google
        </Button>

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
