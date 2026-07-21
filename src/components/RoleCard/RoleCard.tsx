import type { ReactNode } from "react";

type RoleCardProps = {
  icon: ReactNode;
  iconBgClassName: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
};

function RoleCard({
  icon,
  iconBgClassName,
  title,
  subtitle,
  selected,
  onClick,
}: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
        selected
          ? "border-primary-800 bg-primary-50"
          : "border-border-light bg-white"
      }`}
    >
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${iconBgClassName}`}
      >
        {icon}
      </span>

      <span>
        <span className="block text-sm font-semibold text-gray-900">
          {title}
        </span>

        <span className="block text-xs text-gray-500">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export default RoleCard;
