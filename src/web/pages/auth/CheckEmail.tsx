import { Link, useLocation } from "react-router-dom";
import { Mail, Link as LinkIcon, ShieldCheck, CircleCheckBig } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { useAuth } from "../../lib/AuthContext";
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
    linkLabel: "sign-in link",
    steps: [
      {
        title: "Check your inbox",
        description: "Look for an email from My Ulo (it may take a few seconds).",
      },
      {
        title: "Click the secure link",
        description: "The link will log you in instantly and securely.",
      },
      {
        title: "You're in!",
        description: "No passwords. No stress. Just secure access.",
      },
    ],
  },
  signup: {
    panelTitle: "Welcome to My Ulo",
    panelSubtitle: "Your journey to a better home starts here.",
    image: signupCheckImage,
    linkLabel: "sign-up link",
    steps: [
      {
        title: "Check your inbox",
        description: "Look for an email from My Ulo (it may take a few seconds).",
      },
      {
        title: "Click the secure link",
        description: "The link will confirm your email and create your account.",
      },
      {
        title: "Start your journey",
        description: "Explore verified properties and find your perfect home.",
      },
    ],
  },
};

const stepIcons = [Mail, LinkIcon, ShieldCheck];

export function CheckEmail({ mode }: CheckEmailProps) {
  const location = useLocation();
  const { login } = useAuth();
  const email = (location.state as { email?: string } | null)?.email || "example@gmail.com";
  const content = copy[mode];

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
          We've sent a secure {content.linkLabel} to
          <br />
          <span className="font-medium text-primary">{email}</span>
        </p>

        <div className="relative mt-10 flex w-full flex-col gap-8 text-left">
          <div className="pointer-events-none absolute left-[22px] top-[22px] bottom-[22px] w-px bg-neutral-200" />
          {content.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={step.title} className="relative flex gap-4">
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-h4 font-semibold text-neutral">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-body text-neutral-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-small text-neutral-500">
          Didn't receive the email? Check your spam folder or{" "}
          <button type="button" className="font-semibold text-primary">
            Resend link
          </button>
        </p>

        <Link
          to={mode === "login" ? "/login" : "/signup"}
          className="mt-4 text-small text-neutral-400 hover:text-neutral-600"
        >
          ← Back
        </Link>

        <Link
          to="/dashboard"
          onClick={login}
          className="mt-6 rounded-lg border border-dashed border-neutral-300 px-4 py-2 text-small text-neutral-500 hover:border-primary hover:text-primary"
        >
          [Dev only] Skip to Dashboard →
        </Link>
      </div>
    </AuthLayout>
  );
}
