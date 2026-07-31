import type { ReactNode } from "react";

type TrustBadgeProps = {
  icon: ReactNode;
  label: string;
};

function TrustBadge({ icon, label }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-secondary-600">
      {icon}
      <span className="text-center text-[10px] font-medium leading-tight text-gray-500">
        {label}
      </span>
    </div>
  );
}

export default TrustBadge;
