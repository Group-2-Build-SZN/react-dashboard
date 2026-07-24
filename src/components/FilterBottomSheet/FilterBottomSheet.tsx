import { useState } from "react";
import { ChevronDown } from "lucide-react";

import FilterChip from "../FilterChip/FilterChip";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import Button from "../Button/Button";

const propertyTypes = ["All", "Flats", "Self-Contain", "Duplex", "Bungalow"] as const;
const bedroomOptions = ["Any", "1", "2", "3", "4", "5+"] as const;
const bathroomOptions = ["Any", "1", "2", "3", "4+"] as const;

const visibleAmenities = ["Parking", "Security", "Generator", "Water Supply"] as const;
const moreAmenities = ["Pop Ceiling", "Kitchen Cabinets"] as const;

export type PropertyFilters = {
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
};

const defaultFilters: PropertyFilters = {
  propertyType: "All",
  priceRange: [100000, 5000000],
  bedrooms: "Any",
  bathrooms: "Any",
  amenities: [],
};

type FilterBottomSheetProps = {
  initialFilters?: PropertyFilters;
  onClose?: () => void;
  onApply?: (filters: PropertyFilters) => void;
};

function FilterBottomSheet({
  initialFilters = defaultFilters,
  onClose,
  onApply,
}: FilterBottomSheetProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const amenitiesToShow = showMoreAmenities
    ? [...visibleAmenities, ...moreAmenities]
    : visibleAmenities;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">

      {/* Backdrop */}
      <button
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet */}
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-white">

        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-border-light" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-3">
          <h2 className="text-lg font-bold text-gray-900">
            Filter Properties
          </h2>

          <button
            onClick={() => setFilters(defaultFilters)}
            className="text-sm font-semibold text-error-500"
          >
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4">

          {/* Property Type */}
          <div>
            <p className="mb-2.5 text-sm font-semibold text-gray-900">
              Property Type
            </p>

            <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-1">
              {propertyTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  active={filters.propertyType === type}
                  onClick={() => setFilters((prev) => ({ ...prev, propertyType: type }))}
                />
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Price Range (per year)
            </p>

            <PriceRangeSlider
              min={100000}
              max={5000000}
              value={filters.priceRange}
              onChange={(priceRange) => setFilters((prev) => ({ ...prev, priceRange }))}
            />
          </div>

          {/* Bedrooms */}
          <div className="mt-6">
            <p className="mb-2.5 text-sm font-semibold text-gray-900">
              Bedrooms
            </p>

            <div className="flex flex-wrap gap-3">
              {bedroomOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  shape={option === "Any" ? "pill" : "circle"}
                  active={filters.bedrooms === option}
                  onClick={() => setFilters((prev) => ({ ...prev, bedrooms: option }))}
                />
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="mt-6">
            <p className="mb-2.5 text-sm font-semibold text-gray-900">
              Bathrooms
            </p>

            <div className="flex flex-wrap gap-3">
              {bathroomOptions.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  shape={option === "Any" ? "pill" : "circle"}
                  active={filters.bathrooms === option}
                  onClick={() => setFilters((prev) => ({ ...prev, bathrooms: option }))}
                />
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <p className="mb-2.5 text-sm font-semibold text-gray-900">
              Amenities
            </p>

            <div className="flex flex-wrap gap-2.5">
              {amenitiesToShow.map((amenity) => (
                <FilterChip
                  key={amenity}
                  label={amenity}
                  active={filters.amenities.includes(amenity)}
                  onClick={() => toggleAmenity(amenity)}
                />
              ))}
            </div>

            <button
              onClick={() => setShowMoreAmenities((prev) => !prev)}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-primary-800"
            >
              {showMoreAmenities ? "See less" : "See more"}
              <ChevronDown
                size={16}
                className={`transition-transform ${showMoreAmenities ? "rotate-180" : ""}`}
              />
            </button>
          </div>

        </div>

        {/* Apply */}
        <div className="border-t border-border-light px-5 py-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onApply?.(filters)}
          >
            Apply Filters
          </Button>
        </div>

      </div>
    </div>
  );
}

export default FilterBottomSheet;
