import { useNavigate, Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/AuthContext";
import { dashboardPathFor } from "../../lib/dashboardPath";
import logo from "../../assets/images/logo-icon.svg";
import successBadge from "../../assets/images/verification-success-badge.png";

export function VerificationSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="flex items-center justify-between">
          <img src={logo} alt="My Ulo" className="h-10 w-10" />
          <span className="flex items-center gap-1 text-small text-neutral-500">
            Need help? <HelpCircle size={14} />
          </span>
        </div>

        <img
          src={successBadge}
          alt=""
          className="mx-auto mt-6 h-28 w-28 object-contain"
        />

        <h1 className="mt-6 text-h2 font-bold text-neutral">
          Verification Successful
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-body text-neutral-500">
          Your account has been verified. You can now explore verified
          properties and connect with trusted landlords and agents.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate(dashboardPathFor(user))}>
            Go to Dashboard
          </Button>
          <Link to="/search">
            <Button size="lg" variant="secondary" fullWidth>
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
