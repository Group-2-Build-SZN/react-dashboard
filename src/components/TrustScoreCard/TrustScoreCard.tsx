import { Droplets, Shield } from "lucide-react";

type TrustScoreCardProps = {
  trustScore: number;
  trustRating: string;
  water: string;
  security: string;
};

function TrustScoreCard({
  trustScore,
  trustRating,
  water,
  security,
}: TrustScoreCardProps) {
  return (
    <div className="flex items-center justify-between bg-secondary-50 px-4 py-3">

      {/* Trust Score */}
      <div className="flex items-center gap-3 flex-1">

        <div className="rounded-lg bg-secondary-600 px-3 py-2 text-sm font-bold text-white">
          {trustScore}%
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700">
            Trust Score
          </p>

          <p className="text-xs font-medium text-secondary-700">
            {trustRating}
          </p>
        </div>

      </div>

      <div className="mx-4 h-10 w-px bg-secondary-200"></div>

      {/* Water */}

      <div className="flex flex-1 items-center gap-2">

        <Droplets
          size={18}
          className="text-primary-600"
        />

        <div>

          <p className="text-xs font-semibold text-gray-700">
            Water
          </p>

          <p className="text-xs font-medium text-secondary-700">
            {water}
          </p>

        </div>

      </div>

      <div className="mx-4 h-10 w-px bg-secondary-200"></div>

      {/* Security */}

      <div className="flex flex-1 items-center gap-2">

        <Shield
          size={18}
          className="text-secondary-600"
        />

        <div>

          <p className="text-xs font-semibold text-gray-700">
            Security
          </p>

          <p className="text-xs font-medium text-secondary-700">
            {security}
          </p>

        </div>

      </div>

    </div>
  );
}

export default TrustScoreCard;