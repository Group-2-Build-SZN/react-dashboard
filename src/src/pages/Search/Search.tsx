import { useEffect, useState } from "react";
import { ArrowLeft, X, SlidersHorizontal } from "lucide-react";

import FilterChip from "../../components/FilterChip/FilterChip";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import type { PropertyFilters } from "../../components/FilterBottomSheet/FilterBottomSheet";

import { listProperties } from "../../api/properties";
import { apiPropertyToProperty, toPropertyCardViewModel } from "../../api/adapters";
import type { Property } from "../../types";

const propertyTypes = ["All", "Flats", "Self-Contain", "Duplex", "Bungalow"] as const;

// UI labels above don't match the API's actual propertyType enum values
// (self_contained, one_bedroom_flat, two_bedroom_flat, duplex, bungalow,
// shared_apartment) — this maps the closest ones. "Flats" and
// "Self-Contain" are broader than any single enum value, so they're left
// unmapped (== no propertyType filter applied) rather than guessing wrong.
const TYPE_FILTER_MAP: Partial<Record<(typeof propertyTypes)[number], string>> = {
  Duplex: "duplex",
  Bungalow: "bungalow",
};

type SearchProps = {
  initialQuery?: string;
  onBack?: () => void;
  onSelectProperty?: (propertyId: string) => void;
};

function Search({
  initialQuery = "New Haven, Enugu",
  onBack,
  onSelectProperty,
}: SearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<(typeof propertyTypes)[number]>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleApplyFilters = (filters: PropertyFilters) => {

    if (propertyTypes.includes(filters.propertyType as (typeof propertyTypes)[number])) {
      setActiveType(filters.propertyType as (typeof propertyTypes)[number]);
    }
    setIsFilterOpen(false);
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const handle = setTimeout(() => {
      listProperties({
        search: query || undefined,
        propertyType: TYPE_FILTER_MAP[activeType],
      })
        .then((res) => {
          if (!cancelled) setResults(res.data.map(apiPropertyToProperty));
        })
        .catch((err) => console.error("Search failed", err))
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 300); // debounce so it's not one request per keystroke

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, activeType]);

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
        {isLoading ? "Searching…" : `${results.length} propert${results.length === 1 ? "y" : "ies"} found`}
      </p>

      <div className="mt-3 flex flex-col gap-3 px-5">
        {!isLoading && results.length === 0 && (
          <p className="mt-6 text-center text-sm text-gray-500">
            No properties found. Try a different search or check back soon.
          </p>
        )}
        {results.map((property) => {
          const card = toPropertyCardViewModel(property);
          return (
            <SearchResultCard
              key={property.id}
              image={card.image}
              name={card.name}
              location={card.location}
              price={card.price}
              bedrooms={card.bedrooms}
              bathrooms={card.bathrooms}
              size={card.size}
              onClick={() => onSelectProperty?.(property.id)}
            />
          );
        })}
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
