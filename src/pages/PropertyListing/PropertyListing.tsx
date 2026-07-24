import { useState } from "react";

import ListingHeader from "../../components/ListingHeader/ListingHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterChip from "../../components/FilterChip/FilterChip";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import BottomNav from "../../components/BottomNav/BottomNav";
import type { BottomNavTab } from "../../components/BottomNav/BottomNav";

import { properties } from "../../data/properties";

const listingFilters = ["All (1,248)", "Verified only", "1 Bedroom", "2 Bedroom"] as const;

type PropertyListingProps = {
  onSelectProperty?: (id: number) => void;
  onNavigate?: (tab: BottomNavTab) => void;
};

function PropertyListing({ onSelectProperty, onNavigate }: PropertyListingProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof listingFilters)[number]>("All (1,248)");

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <ListingHeader />

      {/* Search */}
      <div className="mt-5 px-4">
        <SearchBar />
      </div>

      {/* Filter Chips */}
      <div className="mt-4 flex gap-2.5 overflow-x-auto px-5 pb-2">
        {listingFilters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {/* Property Cards */}
      <div className="mt-5 flex flex-col gap-4 px-4">

        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            image={property.image}
            name={property.name}
            location={property.location}
            price={property.price}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            size={property.size}
            videoDuration={property.videoDuration}
            views={property.views}
            verified={property.verified}
            trustScore={property.trustScore}
            trustRating={property.trustRating}
            water={property.water}
            security={property.security}
            address={property.address}
            onClick={() => onSelectProperty?.(property.id)}
          />
        ))}

      </div>

      {/* Bottom Navigation */}
      <BottomNav active="explore" onNavigate={onNavigate} />

    </div>
  );
}

export default PropertyListing;