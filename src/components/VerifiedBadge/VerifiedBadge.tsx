import { BadgeCheck } from "lucide-react";

type VerifiedBadgeProps = {
  text?: string;
};

function VerifiedBadge({
  text = "Verified",
}: VerifiedBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-1 text-xs font-medium text-secondary-700">
      <BadgeCheck size={14} />
      {text}
    </span>
  );
}

export default VerifiedBadge;