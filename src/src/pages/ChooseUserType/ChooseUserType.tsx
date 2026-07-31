import { useState } from "react";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";

import RoleCard from "../../components/RoleCard/RoleCard";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

import logo from "../../assets/branding/logo.svg";

export type UserRole = "tenant" | "landlord" | "agent";

export interface ChooseUserTypeSubmission {
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
}

type ChooseUserTypeProps = {
  onBack?: () => void;
  onContinue?: (submission: ChooseUserTypeSubmission) => void;
  error?: string | null;
};

const roles: { id: UserRole; title: string; subtitle: string; iconBg: string }[] = [
  {
    id: "tenant",
    title: "I am a Tenant",
    subtitle: "I want to find and rent a property",
    iconBg: "bg-primary-800",
  },
  {
    id: "landlord",
    title: "I am a Landlord",
    subtitle: "I want to list and manage properties",
    iconBg: "bg-secondary-600",
  },
  {
    id: "agent",
    title: "I am an Agent",
    subtitle: "I want to list properties for clients",
    iconBg: "bg-accent-500",
  },
];

function ChooseUserType({ onBack, onContinue, error }: ChooseUserTypeProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("tenant");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // The real POST /auth/complete-profile call requires all three of these —
  // this screen was previously the only step in the sign-up flow that never
  // collected them, so the API call would fail validation every time.
  const canContinue = firstName.trim() !== "" && lastName.trim() !== "" && phone.trim() !== "";

  return (
    <div className="flex min-h-screen flex-col bg-white px-5 pb-[60px] pt-[61px]">

      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <div className="mt-[14.08px] flex flex-col items-center">
        <img src={logo} alt="My Ulo" className="h-24 w-24" />

        <p className="mt-[13px] text-center text-sm font-medium leading-5 tracking-[0.01em] text-gray-500">
          Verified properties. Honest deals. Peace of mind
        </p>
      </div>

      <div className="mt-[45px] text-center">
        <h1 className="text-[20px] font-bold leading-none text-gray-900">
          Choose User Type
        </h1>

        <p className="mt-[3px] text-sm font-medium leading-5 tracking-[0.01em] text-gray-500">
          Select how you want to use My Ulo
        </p>
      </div>

      <div className="mt-[23px] flex flex-col gap-5">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            icon={<User size={20} />}
            iconBgClassName={role.iconBg}
            title={role.title}
            subtitle={role.subtitle}
            selected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="first-name"
              label="First Name"
              placeholder="e.g. Chinedu"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              id="last-name"
              label="Last Name"
              placeholder="e.g. Okafor"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>

        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="08012345678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <div className="mt-auto pt-6">

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-secondary-600" />
          <span>All users go through verification</span>
        </div>

        {error && <p className="mt-3 text-center text-sm text-error-600">{error}</p>}

        <div className="mt-[42px]">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!canContinue}
            onClick={() =>
              onContinue?.({ role: selectedRole, firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() })
            }
          >
            Continue
          </Button>
        </div>

      </div>

    </div>
  );
}

export default ChooseUserType;
