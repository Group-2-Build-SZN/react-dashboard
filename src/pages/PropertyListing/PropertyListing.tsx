import { useEffect, useState } from "react";

import ListingHeader from "../../components/ListingHeader/ListingHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterChip from "../../components/FilterChip/FilterChip";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import BottomNav from "../../components/BottomNav/BottomNav";
import type { BottomNavTab } from "../../components/BottomNav/BottomNav";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import type { PropertyFilters } from "../../components/FilterBottomSheet/FilterBottomSheet";

import { listProperties, saveProperty, unsaveProperty } from "../../api/properties";
import { ApiError } from "../../api/client";
import { apiPropertyToProperty, propertyFiltersToApiParams, toPropertyCardViewModel } from "../../api/adapters";
import type { Property } from "../../types";

const listingFilters = ["All", "Verified only", "1 Bedroom", "2 Bedroom"] as const;

type PropertyListingProps = {
  onSelectProperty?: (id: string) => void;
  onNavigate?: (tab: BottomNavTab) => void;
  onBack?: () => void;
};

function PropertyListing({ onSelectProperty, onNavigate, onBack }: PropertyListingProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof listingFilters)[number]>("All");
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilters | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    listProperties({
      verifiedOnly: activeFilter === "Verified only" || undefined,
      bedrooms: activeFilter === "1 Bedroom" ? 1 : activeFilter === "2 Bedroom" ? 2 : undefined,
      // Chip row and the full FilterBottomSheet are two separate controls
      // over the same list — advanced filters (from the sheet) win on
      // bedrooms/bathrooms if both happen to specify them.
      ...(advancedFilters ? propertyFiltersToApiParams(advancedFilters) : {}),
    })
      .then((res) => {
        if (cancelled) return;
        setProperties(res.data.map(apiPropertyToProperty));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load properties");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeFilter, advancedFilters]);

  async function handleToggleFavorite(property: Property) {
    const wasFavorited = property.isFavorited;
    // optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === property.id ? { ...p, isFavorited: !wasFavorited } : p))
    );
    try {
      if (wasFavorited) await unsaveProperty(property.id);
      else await saveProperty(property.id);
    } catch (err) {
      // revert on failure
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, isFavorited: wasFavorited } : p))
      );
      console.error('Failed to update saved status', err);
      setFavoriteError(
        err instanceof Error
          ? `Couldn't save: ${err.message}`
          : "Couldn't save this property — try again"
      );
      setTimeout(() => setFavoriteError(null), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <ListingHeader
        resultCount={isLoading ? undefined : properties.length}
        activeFilterCount={
          (activeFilter === "All" ? 0 : 1) +
          (advancedFilters
            ? (advancedFilters.propertyType !== "All" ? 1 : 0) +
              (advancedFilters.bedrooms !== "Any" ? 1 : 0) +
              (advancedFilters.bathrooms !== "Any" ? 1 : 0) +
              advancedFilters.amenities.length
            : 0)
        }
        onBack={onBack}
        onOpenMap={() => onNavigate?.("map")}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="mt-6 px-4">
        <SearchBar />
      </div>

      <div className="mt-5 flex gap-2.5 overflow-x-auto px-5 pb-2">
        {listingFilters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {isLoading && <p className="mt-6 px-4 text-sm text-muted">Loading properties…</p>}
      {error && <p className="mt-6 px-4 text-sm text-error-600">{error}</p>}
      {favoriteError && <p className="mt-2 px-4 text-sm text-error-600">{favoriteError}</p>}

      {!isLoading && !error && properties.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 px-8 text-center">
          <p className="text-base font-semibold text-gray-900">No properties yet</p>
          <p className="text-sm text-gray-500">
            Check back soon — new verified listings are added regularly.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-5 px-4">

        {properties.map((property) => {
          const card = toPropertyCardViewModel(property);
          return (
            <PropertyCard
              key={property.id}
              {...card}
              isFavorited={property.isFavorited}
              onToggleFavorite={() => handleToggleFavorite(property)}
              onClick={() => onSelectProperty?.(property.id)}
            />
          );
        })}

      </div>

      <BottomNav active="explore" onNavigate={onNavigate} />

      {isFilterOpen && (
        <FilterBottomSheet
          initialFilters={advancedFilters ?? undefined}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setAdvancedFilters(filters);
            setIsFilterOpen(false);
          }}
        />
      )}

    </div>
  );
}

export default PropertyListing;