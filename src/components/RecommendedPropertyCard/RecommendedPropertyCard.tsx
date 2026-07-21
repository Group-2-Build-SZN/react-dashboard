import { Bed, Bath, Ruler } from "lucide-react";

import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";

type RecommendedPropertyCardProps = {
  image: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  verified: boolean;
  onClick?: () => void;
};

function RecommendedPropertyCard({
  image,
  name,
  location,
  price,
  bedrooms,
  bathrooms,
  size,
  verified,
  onClick,
}: RecommendedPropertyCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-56 flex-shrink-0 overflow-hidden rounded-xl border border-border-light bg-white text-left"
    >

      <div className="relative h-32 w-full">
        <img src={image} alt={name} className="h-full w-full object-cover" />

        {verified && (
          <div className="absolute left-2 top-2">
            <VerifiedBadge text="Verified" />
          </div>
        )}
      </div>

      <div className="p-3">

        <p className="truncate text-sm font-semibold text-gray-900">
          {name}
        </p>

        <p className="truncate text-xs text-gray-500">
          {location}
        </p>

        <p className="mt-1 text-sm font-bold text-primary-800">
          {price}
          <span className="ml-1 text-xs font-medium text-gray-500">
            / year
          </span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bed size={12} />
            {bedrooms} Beds
          </span>

          <span className="flex items-center gap-1">
            <Bath size={12} />
            {bathrooms} Baths
          </span>

          <span className="flex items-center gap-1">
            <Ruler size={12} />
            {size}
          </span>
        </div>

      </div>

    </button>
  );
}

export default RecommendedPropertyCard;
