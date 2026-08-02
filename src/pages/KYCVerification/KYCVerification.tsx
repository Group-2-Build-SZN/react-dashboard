import { useState } from "react";
import { ArrowLeft, User, Building2, Lock, Calendar, IdCard } from "lucide-react";

import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export type VerificationType = "individual" | "business";

export interface KYCSubmission {
  type: VerificationType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ninNumber: string;
  companyName: string;
  rcNumber: string;
}

type KYCVerificationProps = {
  onBack?: () => void;
  onContinue?: (submission: KYCSubmission) => Promise<void> | void;
  error?: string | null;
  // Tenants verify via NIN, landlords/agents via CAC — this isn't a user
  // choice, it's determined by the role picked on the previous screen. When
  // set, the individual/business toggle is hidden entirely.
  lockedType?: VerificationType;
};

function KYCVerification({ onBack, onContinue, error, lockedType }: KYCVerificationProps) {
  const [type, setType] = useState<VerificationType>(lockedType ?? "individual");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!onContinue) return;
    setIsSubmitting(true);
    try {
      await onContinue({
        type,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dob,
        ninNumber: ninNumber.trim(),
        companyName: companyName.trim(),
        rcNumber: rcNumber.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-8 pt-5">

      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <div className="mt-4 text-center">
        <h1 className="text-[28px] font-bold leading-9 text-gray-900">
          KYC Verification
        </h1>

        <p className="mt-1 text-base leading-6 text-gray-500">
          To keep our community safe and secure, please provide your details
          for verification.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-gray-700">
          I am verifying as
        </p>

        {lockedType ? (
          <div className="flex items-center gap-2 rounded-xl border border-primary-800 bg-white px-4 py-2.5 text-sm font-semibold text-primary-800">
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-white">
              {lockedType === "individual" ? <User size={12} /> : <Building2 size={12} />}
            </span>
            {lockedType === "individual" ? "Individual (NIN)" : "Business (CAC)"}
          </div>
        ) : (
          <div className="flex rounded-xl border border-border-light p-1">

          <button
            onClick={() => setType("individual")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              type === "individual"
                ? "border border-primary-800 bg-white text-primary-800"
                : "border border-transparent text-gray-500"
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                type === "individual"
                  ? "bg-primary-800 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <User size={12} />
            </span>
            Individual (NIN)
          </button>

          <button
            onClick={() => setType("business")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              type === "business"
                ? "border border-primary-800 bg-white text-primary-800"
                : "border border-transparent text-gray-500"
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                type === "business"
                  ? "bg-primary-800 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Building2 size={12} />
            </span>
            Business (CAC)
          </button>

        </div>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-blue-tint p-4">

        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-white">
            <IdCard size={18} />
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {type === "individual" ? "Individual (NIN)" : "Business (CAC)"}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              {type === "individual"
                ? "Enter your personal details as they appear on your NIN."
                : "Enter your company details as they appear on your CAC registration."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">

          {type === "individual" ? (
            <>
              <Input
                id="first-name"
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />

              <Input
                id="last-name"
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />

              <Input
                id="dob"
                label="Date of Birth"
                placeholder="Select your date of birth"
                type="text"
                onFocus={(event) => (event.target.type = "date")}
                onBlur={(event) => {
                  if (!event.target.value) event.target.type = "text";
                }}
                icon={<Calendar size={18} />}
                iconPosition="right"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
              />

              <Input
                id="nin-number"
                label="NIN Number"
                placeholder="Enter your 11-digit NIN"
                value={ninNumber}
                onChange={(event) => setNinNumber(event.target.value)}
              />
            </>
          ) : (
            <>
              <Input
                id="company-name"
                label="Company Name"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />

              <Input
                id="rc-number"
                label="RC Number"
                placeholder="Enter your RC number"
                value={rcNumber}
                onChange={(event) => setRcNumber(event.target.value)}
              />
            </>
          )}

        </div>

      </div>

      <div className="mt-5 flex items-start gap-2 text-xs text-gray-500">
        <Lock size={14} className="mt-0.5 flex-shrink-0" />
        <span>
          Your information is encrypted and securely stored. We never share
          your data.
        </span>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-error-600">{error}</p>
      )}

      <div className="mt-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!canContinue || isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting ? "Verifying…" : "Continue"}
        </Button>
      </div>

    </div>
  );
}

export default KYCVerification;
