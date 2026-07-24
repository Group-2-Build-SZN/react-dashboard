import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Ruler,
} from "lucide-react";

import PropertyImage from "../PropertyImage/PropertyImage";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import TrustScoreCard from "../TrustScoreCard/TrustScoreCard";

type PropertyCardProps = {
  image: string;
  name: string;
  location: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  videoDuration: string;
  views: number;
  verified: boolean;
  trustScore: number;
  trustRating: string;
  security: string;
  water: string;
  onClick?: () => void;
};

function PropertyCard({
  image,
  name,
  location,
  address,
  price,
  bedrooms,
  bathrooms,
  size,
  videoDuration,
  views,
  verified,
  trustScore,
  trustRating,
  security,
  water,
  onClick,
}: PropertyCardProps) {
  return (
    <div
      onClick={onClick}
      className="overflow-hidden rounded-3xl bg-white shadow-sm"
    >

      <div className="flex gap-3 p-4">

        {/* Image thumbnail */}
        <PropertyImage
          image={image}
          uploadCount={views}
          videoDuration={videoDuration}
          className="h-28 w-28 flex-shrink-0 rounded-xl"
          compact
        />

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Verified + Favourite Row */}
          <div className="flex items-center justify-between">

            {verified ? <VerifiedBadge /> : <span />}

            <button className="rounded-full p-1 hover:bg-gray-100">
              <Heart
                size={18}
                strokeWidth={2}
                className="text-gray-500"
              />
            </button>

          </div>

          {/* Title */}
          <h2 className="mt-1.5 truncate text-sm font-semibold text-gray-900">
            {name}
          </h2>

          {/* Address */}
          <div className="mt-1">

            <div className="flex items-center gap-1">

              <MapPin
                size={12}
                className="flex-shrink-0 text-primary-800"
              />

              <span className="truncate text-xs text-gray-700">
                {location}
              </span>

            </div>

            <p className="ml-4 truncate text-[11px] text-gray-400">
              {address}
            </p>

          </div>

          {/* Price */}
          <p className="mt-1.5 text-sm font-bold text-primary-800">

            {price}

            <span className="ml-1 text-xs font-medium text-gray-500">
              / year
            </span>

          </p>

          {/* Property Details */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-500">

            <div className="flex items-center gap-1">
              <Bed size={12} />
              <span>{bedrooms} Beds</span>
            </div>

            <div className="flex items-center gap-1">
              <Bath size={12} />
              <span>{bathrooms} Baths</span>
            </div>

            <div className="flex items-center gap-1">
              <Ruler size={12} />
              <span>{size}</span>
            </div>

          </div>

        </div>

      </div>

      {/* Trust Section*/}
      <TrustScoreCard
        trustScore={trustScore}
        trustRating={trustRating}
        water={water}
        security={security}
      />

    </div>
  );
}

export default PropertyCard;
