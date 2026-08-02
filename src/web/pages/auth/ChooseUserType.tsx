import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/AuthContext";
import { completeProfile } from "../../../api/auth";
import logo from "../../assets/images/logo-icon.svg";
import tenantIcon from "../../assets/images/roles/tenant.png";
import landlordIcon from "../../assets/images/roles/landlord.png";
import agentIcon from "../../assets/images/roles/agent.png";

type UserRole = "tenant" | "landlord" | "agent";

const roles: { id: UserRole; title: string; description: string; icon: string }[] = [
  {
    id: "tenant",
    title: "Tenant",
    description: "I'm looking for a verified property to rent.",
    icon: tenantIcon,
  },
  {
    id: "landlord",
    title: "Landlord",
    description: "I own properties and want to list them for rent.",
    icon: landlordIcon,
  },
  {
    id: "agent",
    title: "Agent",
    description: "I help people find properties and earn commissions.",
    icon: agentIcon,
  },
];

export function ChooseUserType() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const state = location.state as { fullName?: string } | null;

  const [role, setRole] = useState<UserRole>("tenant");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const [firstName, ...rest] = (state?.fullName || "").trim().split(" ");
    const lastName = rest.join(" ") || firstName || "Ulo";

    if (!firstName) {
      setError("We're missing your name — please sign up again");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await completeProfile({
        firstName,
        lastName,
        phone: phone.trim(),
        role,
      });
      setUser(user);
      navigate("/kyc-verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your profile — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral"
          >
            <ArrowLeft size={20} />
          </button>
          <img src={logo} alt="My Ulo" className="h-10 w-10" />
          <span className="w-10" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-h2 font-bold text-neutral">
            How will you be using My Ulo
          </h1>
          <p className="mt-2 text-body text-neutral-500">
            Select the option that best describes you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center rounded-2xl border p-6 text-center transition-colors ${
                  role === r.id
                    ? "border-primary bg-primary-50/40"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                  <img src={r.icon} alt="" className="h-10 w-10 object-contain" />
                </span>
                <p className="mt-4 text-h4 font-semibold text-neutral">{r.title}</p>
                <p className="mt-1.5 text-small text-neutral-500">{r.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-sm mx-auto">
            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="e.g. 08012345678"
              icon={<Phone size={18} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error && <p className="mt-3 text-center text-small text-error">{error}</p>}

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-full max-w-sm">
              <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Continue"}
              </Button>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-small text-neutral-500">
              <ShieldCheck size={14} className="text-secondary" />
              All users go through verification
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
