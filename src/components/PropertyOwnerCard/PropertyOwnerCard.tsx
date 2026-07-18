import { Building2, BadgeCheck } from "lucide-react";

import Button from "../Button/Button";

type PropertyOwnerCardProps = {
  name: string;
  memberSince: string;
  idVerified: boolean;
  onViewProfile?: () => void;
};

function PropertyOwnerCard({
  name,
  memberSince,
  idVerified,
  onViewProfile,
}: PropertyOwnerCardProps) {
  return (
    <div>

      <h3 className="text-base font-semibold text-gray-900">
        Property Owner
      </h3>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-gray-100 p-3">

        <div className="flex items-center gap-3">

          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Building2 size={20} />
          </span>

          <div>

            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-gray-900">
                {name}
              </p>

              <BadgeCheck size={16} className="text-blue-600" />
            </div>

            <p className="text-xs text-gray-500">
              Member since {memberSince}
            </p>

          </div>

        </div>

        <div className="flex flex-shrink-0 items-center gap-2">

          {idVerified && (
            <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              ID Verified
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onViewProfile}
            className="whitespace-nowrap"
          >
            View Profile
          </Button>

        </div>

      </div>

    </div>
  );
}

export default PropertyOwnerCard;
