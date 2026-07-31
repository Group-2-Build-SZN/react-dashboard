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
      className={`flex h-[76px] w-full items-center gap-[10.5px] rounded-xl border px-4 text-left transition-colors ${
        selected
          ? "border-[#1E40AF] bg-[#E2EAFC]"
          : "border-transparent bg-[#E2E8F0]/60"
      }`}
    >
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white ${iconBgClassName}`}
      >
        {icon}
      </span>

      <span className="flex flex-col gap-[5px]">
        <span className="block text-base font-medium leading-5 tracking-[0.01em] text-[#0C1323]">
          {title}
        </span>

        <span className="block text-xs font-medium leading-5 tracking-[0.01em] text-[#878B94]">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export default RoleCard;
