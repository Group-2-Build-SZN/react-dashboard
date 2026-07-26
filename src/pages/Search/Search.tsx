import { useState } from "react";
import { ArrowLeft, X, SlidersHorizontal } from "lucide-react";

import FilterChip from "../../components/FilterChip/FilterChip";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import type { PropertyFilters } from "../../components/FilterBottomSheet/FilterBottomSheet";

import { properties } from "../../data/properties";

const propertyTypes = ["All", "Flats", "Self-Contain", "Duplex", "Bungalow"] as const;

type SearchProps = {
  initialQuery?: string;
  onBack?: () => void;
  onSelectProperty?: (propertyId: number) => void;
};

function Search({
  initialQuery = "New Haven, Enugu",
  onBack,
  onSelectProperty,
}: SearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<(typeof propertyTypes)[number]>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = (filters: PropertyFilters) => {

    if (propertyTypes.includes(filters.propertyType as (typeof propertyTypes)[number])) {
      setActiveType(filters.propertyType as (typeof propertyTypes)[number]);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-8">

      <div className="flex items-center gap-3 px-5 pt-5">

        <button
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-light"
        >
          <ArrowLeft size={20} strokeWidth={2} className="text-gray-700" />
        </button>

        <div className="flex h-[50px] flex-1 items-center gap-2 rounded-full border border-border-light bg-white px-4">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-muted"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex-shrink-0 text-muted"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          aria-label="Filters"
          className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full border border-border-light"
        >
          <SlidersHorizontal size={18} className="text-gray-700" />
        </button>

      </div>

      <div className="scrollbar-hide mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {propertyTypes.map((type) => (
          <FilterChip
            key={type}
            label={type}
            active={activeType === type}
            onClick={() => setActiveType(type)}
          />
        ))}
      </div>

      <p className="mt-4 px-5 text-sm text-gray-500">
        346 properties found
      </p>

      <div className="mt-3 flex flex-col gap-3 px-5">
        {properties.map((property) => (
          <SearchResultCard
            key={property.id}
            image={property.image}
            name={property.name}
            location={property.location}
            price={property.price}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            size={property.size}
            onClick={() => onSelectProperty?.(property.id)}
          />
        ))}
      </div>

      {isFilterOpen && (
        <FilterBottomSheet
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      )}

    </div>
  );
}

export default Search;
