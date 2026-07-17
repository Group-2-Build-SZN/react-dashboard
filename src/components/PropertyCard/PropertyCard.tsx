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
};

function PropertyCard({
  image,
  name,
  location,
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
}: PropertyCardProps) {
  return (
    <div className="flex overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* Left Side */}
      <PropertyImage
        image={image}
        uploadCount={views}
        videoDuration={videoDuration}
      />

      {/* Right Side */}
      <div className="flex flex-1 flex-col p-4">

        {/* Top Row */}
        <div className="flex justify-between">

          <div>

            {verified && (
              <div className="mb-2">
                <VerifiedBadge />
              </div>
            )}

            <h2 className="text-base font-semibold text-gray-900">
              {name}
            </h2>

            {/* Address */}
            <div className="mt-2">

              <div className="flex items-center gap-1">

                <MapPin
                  size={14}
                  className="text-blue-600"
                />

                <span className="text-sm text-gray-700">
                  {location}
                </span>

              </div>

              <p className="ml-5 text-xs text-gray-400">
                New Haven Market
              </p>

            </div>

            {/* Price */}
            <p className="mt-3 text-xl font-bold text-[#2F4CD6]">

              {price}

              <span className="ml-1 text-sm font-medium text-gray-500">
                / year
              </span>

            </p>

          </div>

          {/* Favourite */}
          <button className="rounded-full p-2 hover:bg-gray-100">

            <Heart
              size={20}
              strokeWidth={2}
              className="text-gray-500"
            />

          </button>

        </div>

        {/* Property Details */}

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">

          <div className="flex items-center gap-1">

            <Bed size={14} />

            <span>{bedrooms} Beds</span>

          </div>

          <div className="flex items-center gap-1">

            <Bath size={14} />

            <span>{bathrooms} Baths</span>

          </div>

          <div className="flex items-center gap-1">

            <Ruler size={14} />

            <span>{size}</span>

          </div>

        </div>

        {/* Trust Section */}

        <div className="mt-4">

          <TrustScoreCard
            trustScore={trustScore}
            trustRating={trustRating}
            water={water}
            security={security}
          />

        </div>

      </div>

    </div>
  );
}

export default PropertyCard;