import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Calendar, ShieldCheck, HelpCircle, IdCard } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import logo from "../../assets/images/logo-icon.svg";
import kycIllustration from "../../assets/images/kyc-verify-illustration.png";
import { verifyNin, verifyCac } from "../../../api/kyc";

type VerificationType = "individual" | "business";

export function KYCVerification() {
  const navigate = useNavigate();
  const [type, setType] = useState<VerificationType>("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [ninNumber, setNinNumber] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [rcNumber, setRcNumber] = useState("");

  const canContinue =
    type === "individual"
      ? firstName.trim() !== "" && lastName.trim() !== "" && dob !== "" && ninNumber.trim().length === 11
      : companyName.trim() !== "" && rcNumber.trim() !== "";

  async function handleContinue() {
    setError(null);
    setIsSubmitting(true);
    try {
      const result =
        type === "individual"
          ? await verifyNin({
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              dateOfBirth: dob,
              ninNumber: ninNumber.trim(),
            })
          : await verifyCac({
              companyName: companyName.trim(),
              rcNumber: rcNumber.trim(),
            });

      if (result.status === "rejected") {
        setError("Verification was rejected — double-check your details and try again.");
        return;
      }
      navigate("/verification-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed — try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col bg-primary-50 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/choose-user-type")}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral"
          >
            <ArrowLeft size={20} />
          </button>
          <img src={logo} alt="My Ulo" className="h-10 w-10" />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <img
            src={kycIllustration}
            alt=""
            className="h-56 w-56 object-contain"
          />

          <h1 className="mt-8 text-h2 font-bold text-neutral">
            Let's verify your identity
          </h1>
          <p className="mt-3 max-w-xs text-body text-neutral-500">
            We use this to keep your account secure and build trust in our
            community.
          </p>

          <p className="mt-6 flex items-center gap-1.5 text-small font-medium text-secondary">
            <ShieldCheck size={16} />
            Your information is safe with us
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-end">
            <span className="flex items-center gap-1 text-small text-neutral-500">
              Need help? <HelpCircle size={14} />
            </span>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-body font-medium text-neutral">I am verifying as</p>

            <div className="flex rounded-xl border border-neutral-200 p-1">
              <button
                type="button"
                onClick={() => setType("individual")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-small font-semibold transition-colors ${
                  type === "individual"
                    ? "border border-primary bg-white text-primary"
                    : "border border-transparent text-neutral-500"
                }`}
              >
                <User size={14} />
                Individual (NIN)
              </button>

              <button
                type="button"
                onClick={() => setType("business")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-small font-semibold transition-colors ${
                  type === "business"
                    ? "border border-primary bg-white text-primary"
                    : "border border-transparent text-neutral-500"
                }`}
              >
                <Building2 size={14} />
                Business (CAC)
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary-50 p-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <IdCard size={18} />
            </span>
            <div>
              <p className="text-body font-semibold text-neutral">
                {type === "individual" ? "Individual (NIN)" : "Business (CAC)"}
              </p>
              <p className="mt-0.5 text-small text-neutral-500">
                {type === "individual"
                  ? "Enter your personal details as they appear on your NIN."
                  : "Enter your company details as they appear on your CAC registration."}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {type === "individual" ? (
              <>
                <Input
                  id="first-name"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  id="last-name"
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  icon={<Calendar size={18} />}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <Input
                  id="nin-number"
                  label="NIN Number"
                  placeholder="Enter your 11-digit NIN"
                  value={ninNumber}
                  onChange={(e) => setNinNumber(e.target.value)}
                />
              </>
            ) : (
              <>
                <Input
                  id="company-name"
                  label="Company Name"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  id="rc-number"
                  label="RC Number"
                  placeholder="Enter your RC number"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value)}
                />
              </>
            )}
          </div>

          {error && <p className="mt-3 text-center text-small text-error">{error}</p>}

          <div className="mt-6">
            <Button
              size="lg"
              fullWidth
              disabled={!canContinue || isSubmitting}
              onClick={handleContinue}
            >
              {isSubmitting ? "Verifying…" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
