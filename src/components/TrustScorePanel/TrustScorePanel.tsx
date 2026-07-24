import { Droplets, Zap, Shield, Route } from "lucide-react";

type TrustScorePanelProps = {
  trustScore: number;
  water: string;
  power: string;
  security: string;
  road: string;
};

function TrustScorePanel({
  trustScore,
  water,
  power,
  security,
  road,
}: TrustScorePanelProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (trustScore / 100) * circumference;

  const items = [
    { icon: <Droplets size={16} className="text-primary-600" />, label: "Water", value: water },
    { icon: <Zap size={16} className="text-accent-500" />, label: "Power", value: power },
    { icon: <Shield size={16} className="text-secondary-600" />, label: "Security", value: security },
    { icon: <Route size={16} className="text-gray-500" />, label: "Road", value: road },
  ];

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border-light p-4 shadow-sm">

      {/* Circular Score */}
      <div className="flex flex-shrink-0 flex-col items-center">

        <div className="relative flex h-24 w-24 items-center justify-center">

          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="var(--color-border-light)"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="var(--color-secondary-600)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference}`}
            />
          </svg>

          <span className="absolute text-xl font-bold text-gray-900">
            {trustScore}%
          </span>

        </div>

        <p className="mt-2 text-xs font-medium text-gray-500">
          Trust Score
        </p>

        <button className="text-xs font-medium text-primary-800">
          What is this?
        </button>

      </div>

      {/* Divider */}
      <span className="h-24 w-px bg-border-light" />

      {/* Status List */}
      <div className="flex flex-1 flex-col gap-3">

        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>

            <span className="text-sm font-medium text-secondary-700">
              {item.value}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default TrustScorePanel;
