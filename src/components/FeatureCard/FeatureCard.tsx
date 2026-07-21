import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
};

function FeatureCard({
  icon,
  title,
  value,
}: FeatureCardProps) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-xl bg-green-50 p-2">
      <div className="text-green-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-700">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {value}
        </p>
      </div>
    </div>
  );
}

export default FeatureCard;