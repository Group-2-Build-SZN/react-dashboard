import { ShieldCheck, Droplets, Zap, Shield } from "lucide-react";

type DetailTrustBarProps = {
  trustScore: number;
  trustRating: string;
  water: string;
  power: string;
  security: string;
};

function DetailTrustBar({
  trustScore,
  trustRating,
  water,
  power,
  security,
}: DetailTrustBarProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-secondary-50 px-4 py-4">

      {/* Trust Score */}
      <div className="flex flex-1 items-center gap-2">

        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary-600 text-white">
          <ShieldCheck size={18} />
        </span>

        <div>
          <p className="text-xs font-medium text-gray-500">
            Trust Score
          </p>

          <p className="text-base font-bold text-gray-900">
            {trustScore}%
          </p>

          <p className="text-xs font-medium text-secondary-700">
            {trustRating}
          </p>
        </div>

      </div>

      <span className="h-10 w-px bg-secondary-200" />

      {/* Water */}
      <div className="flex flex-col items-center gap-1 text-center">
        <Droplets size={18} className="text-primary-600" />
        <p className="text-xs font-medium text-gray-500">Water</p>
        <p className="text-xs font-semibold text-secondary-700">{water}</p>
      </div>

      <span className="h-10 w-px bg-secondary-200" />

      {/* Power */}
      <div className="flex flex-col items-center gap-1 text-center">
        <Zap size={18} className="text-accent-500" />
        <p className="text-xs font-medium text-gray-500">Power</p>
        <p className="text-xs font-semibold text-secondary-700">{power}</p>
      </div>

      <span className="h-10 w-px bg-secondary-200" />

      {/* Security */}
      <div className="flex flex-col items-center gap-1 text-center">
        <Shield size={18} className="text-secondary-600" />
        <p className="text-xs font-medium text-gray-500">Security</p>
        <p className="text-xs font-semibold text-secondary-700">{security}</p>
      </div>

    </div>
  );
}

export default DetailTrustBar;
