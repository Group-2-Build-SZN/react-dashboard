import ListingHeader from "../../components/ListingHeader/ListingHeader";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterChip from "../../components/FilterChip/FilterChip";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import BottomNav from "../../components/BottomNav/BottomNav";

import { properties } from "../../data/properties";

function PropertyListing() {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* Header */}
      <ListingHeader />

      {/* Search */}
      <div className="mt-5 px-4">
        <SearchBar />
      </div>

      {/* Filter Chips */}
<div className="mt-4 flex gap-3 overflow-x-auto px-5 pb-2">

  <FilterChip
    label="All (1,248)"
    active
  />

  <FilterChip
    label="Verified only"
  />

  <FilterChip
    label="1 Bedroom"
  />

  <FilterChip
    label="2 Bedroom"
  />

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
          />
        ))}

      </div>

      {/* Bottom Navigation */}
      <BottomNav />

    </div>
  );
}

export default PropertyListing;