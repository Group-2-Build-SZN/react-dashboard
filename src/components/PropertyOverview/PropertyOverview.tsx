import { MapPin } from "lucide-react";

import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

type PropertyOverviewProps = {
  name: string;
  location: string;
  address: string;
  price: string;
  serviceCharge: string;
  verified: boolean;
};

function PropertyOverview({
  name,
  location,
  address,
  price,
  serviceCharge,
  verified,
}: PropertyOverviewProps) {
  return (
    <div>

      {verified && (
        <div className="mb-2">
          <VerifiedBadge text="Verified Property" />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {name}
          </h1>

          <div className="mt-2 flex items-center gap-1">
            <MapPin size={14} className="text-blue-600" />
            <span className="text-sm text-gray-700">
              {location}
            </span>
          </div>

          <p className="ml-5 text-xs text-gray-400">
            {address}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-[#2F4CD6]">
            {price}
            <span className="ml-1 text-sm font-medium text-gray-500">
              / year
            </span>
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Service charge: {serviceCharge}
          </p>
        </div>

      </div>

    </div>
  );
}

export default PropertyOverview;
