import { useState } from "react";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";

import RoleCard from "../../components/RoleCard/RoleCard";
import Button from "../../components/Button/Button";

import logo from "../../assets/branding/logo.svg";

export type UserRole = "tenant" | "landlord" | "agent";

type ChooseUserTypeProps = {
  onBack?: () => void;
  onContinue?: (role: UserRole) => void;
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

function ChooseUserType({ onBack, onContinue }: ChooseUserTypeProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("tenant");

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-8 pt-5">

      {/* Back */}
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      {/* Logo + tagline */}
      <div className="mt-4 flex flex-col items-center">
        <img src={logo} alt="My Ulo" className="h-24 w-24" />

        <p className="mt-3 text-center text-sm text-gray-500">
          Verified properties. Honest deals. Peace of mind
        </p>
      </div>

      {/* Heading */}
      <div className="mt-8 text-center">
        <h1 className="text-[28px] font-bold leading-9 text-gray-900">
          Choose User Type
        </h1>

        <p className="mt-1 text-base leading-6 text-gray-500">
          Select how you want to use My Ulo
        </p>
      </div>

      {/* Role cards */}
      <div className="mt-6 flex flex-col gap-5">
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

      {/* Verification note */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <ShieldCheck size={14} className="text-secondary-600" />
        <span>All users go through verification</span>
      </div>

      {/* Continue */}
      <div className="mt-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onContinue?.(selectedRole)}
        >
          Continue
        </Button>
      </div>

    </div>
  );
}

export default ChooseUserType;
