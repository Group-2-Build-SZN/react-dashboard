import { Heart, Bed, Bath, Ruler } from "lucide-react";

type SearchResultCardProps = {
  image: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  onClick?: () => void;
};

function SearchResultCard({
  image,
  name,
  location,
  price,
  bedrooms,
  bathrooms,
  size,
  onClick,
}: SearchResultCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex cursor-pointer gap-3 rounded-2xl border border-border-light bg-white p-3"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        decoding="async"
        className="h-[92px] w-[92px] flex-shrink-0 rounded-xl object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate pr-6 text-sm font-semibold text-gray-900">
          {name}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-500">
          {location}
        </p>

        <p className="mt-1.5 text-sm font-bold text-primary-800">
          {price}
          <span className="ml-1 text-xs font-medium text-gray-500">
            / year
          </span>
        </p>

        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
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

      <button
        onClick={(event) => event.stopPropagation()}
        aria-label="Save property"
        className="absolute right-3 top-3 rounded-full p-1"
      >
        <Heart size={18} className="text-gray-400" />
      </button>
    </div>
  );
}

export default SearchResultCard;
