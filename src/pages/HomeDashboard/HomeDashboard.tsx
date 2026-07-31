import { useEffect, useState } from "react";
import { ChevronDown, MapPin, Map as MapIcon, Heart, ShieldCheck } from "lucide-react";

import SearchBar from "../../components/SearchBar/SearchBar";
import RecommendedPropertyCard from "../../components/RecommendedPropertyCard/RecommendedPropertyCard";
import BottomNav from "../../components/BottomNav/BottomNav";
import type { BottomNavTab } from "../../components/BottomNav/BottomNav";

import { getRecommendedProperties, listProperties } from "../../api/properties";
import { apiPropertyToProperty, toPropertyCardViewModel } from "../../api/adapters";
import type { Property } from "../../types";
import verifiedBannerImage from "../../assets/images/unsplash_DI3MlpRdYeE (1).png";

type HomeDashboardProps = {
  userName?: string;
  onSearch?: (query: string) => void;
  onOpenSearch?: (query?: string) => void;
  onOpenFilters?: () => void;
  onSelectProperty?: (propertyId: string) => void;
  onSeeAll?: () => void;
  onNavigate?: (tab: BottomNavTab) => void;
};

function HomeDashboard({
  userName = "there",
  onSearch,
  onOpenSearch,
  onOpenFilters,
  onSelectProperty,
  onSeeAll,
  onNavigate,
}: HomeDashboardProps) {
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [originalRecommended, setOriginalRecommended] = useState<Property[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Recommended for you");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRecommendedProperties()
      .then((items) => {
        if (cancelled) return;
        const mapped = items.map(apiPropertyToProperty);
        setRecommended(mapped);
        setOriginalRecommended(mapped);
      })
      .catch((err) => console.error("Failed to load recommended properties", err));
    return () => {
      cancelled = true;
    };
  }, []);

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location isn't available in this browser");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        listProperties({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: 10,
        })
          .then((res) => {
            setRecommended(res.data.map(apiPropertyToProperty));
            setSectionTitle("Near you");
          })
          .catch((err) => setLocationError(err instanceof Error ? err.message : "Failed to load nearby properties"))
          .finally(() => setIsLocating(false));
      },
      (err) => {
        setLocationError(err.message || "Location access was denied");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleShowAllRecommended() {
    setRecommended(originalRecommended);
    setSectionTitle("Recommended for you");
    setLocationError(null);
  }

  const quickActions = [

    { id: "nearby", label: "Nearby", icon: MapPin, colorClass: "text-primary-800", onClick: () => onOpenSearch?.() },
    { id: "map", label: "Map", icon: MapIcon, colorClass: "text-secondary-600", onClick: () => onNavigate?.("map") },
    { id: "saved", label: "Saved", icon: Heart, colorClass: "text-error-500", onClick: () => onNavigate?.("saved") },
  ] as const;

  return (
    <div className="min-h-screen bg-white pb-24">

      <div className="flex items-center justify-center px-5 pt-8">

        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="flex items-center gap-1 text-sm font-medium text-gray-700"
        >
          <MapPin size={14} className="text-primary-800" />
          {isLocating ? "Finding you…" : sectionTitle === "Near you" ? "Using your location" : "Use my location"}
          <ChevronDown size={14} />
        </button>

      </div>

      {locationError && (
        <p className="mt-2 px-5 text-center text-sm text-error-600">{locationError}</p>
      )}

      <div className="mt-8 px-5">
        <p className="text-sm text-gray-500">
          Hello, {userName} 👋
        </p>

        <h1 className="mt-2 text-[24px] font-bold leading-8 text-gray-900">
          Find verified properties you can trust.
        </h1>
      </div>

      <div className="mt-8 px-5">
        <SearchBar
          placeholder="Search by location, area or keyword"
          onChange={onSearch}
          onFocus={() => onOpenSearch?.()}
          onFilterClick={onOpenFilters}
        />
      </div>

      <div className="mt-14 flex justify-around px-5">
        {quickActions.map(({ id, label, icon: Icon, colorClass, onClick }) => (
          <button key={id} onClick={onClick} className="flex flex-col items-center gap-2">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full border border-border-light ${colorClass}`}>
              <Icon size={20} />
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      <div className="relative mx-5 mt-10 flex h-40 items-center gap-4 overflow-hidden rounded-2xl bg-blue-tint p-5">
        <span className="z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-600 text-white">
          <ShieldCheck size={24} />
        </span>

        <div className="z-10 max-w-[55%]">
          <p className="text-base font-semibold text-gray-900">
            100% Verified Properties
          </p>
          <p className="mt-1 text-sm text-gray-500">
            All properties on My Ulo are verified for your peace of mind
          </p>
        </div>

        <img
          src={verifiedBannerImage}
          alt=""
          className="absolute right-0 top-0 h-full w-44 object-cover opacity-90 [mask-image:linear-gradient(to_left,black_40%,transparent)]"
        />
      </div>

      <div className="mt-10">

        <div className="flex items-center justify-between px-5">
          <h2 className="text-base font-semibold text-gray-900">
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-3">
            {sectionTitle === "Near you" && (
              <button onClick={handleShowAllRecommended} className="text-sm font-medium text-gray-500">
                Reset
              </button>
            )}
            <button onClick={onSeeAll} className="text-sm font-medium text-primary-800">
              See all
            </button>
          </div>
        </div>

        <div className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto px-5 pb-2">
          {recommended.length === 0 ? (
            <div className="px-1">
              <p className="text-sm text-gray-500">
                {sectionTitle === "Near you"
                  ? "No properties found near you right now."
                  : "No recommended properties yet — check back soon."}
              </p>
              {sectionTitle === "Near you" && (
                <button onClick={handleShowAllRecommended} className="mt-1 text-sm font-medium text-primary-800">
                  Show recommended properties instead
                </button>
              )}
            </div>
          ) : (
            recommended.map((property) => {
              const card = toPropertyCardViewModel(property);
              return (
                <RecommendedPropertyCard
                  key={property.id}
                  image={card.image}
                  name={card.name}
                  location={card.location}
                  price={card.price}
                  bedrooms={card.bedrooms}
                  bathrooms={card.bathrooms}
                  size={card.size}
                  verified={card.verified}
                  onClick={() => onSelectProperty?.(property.id)}
                />
              );
            })
          )}
        </div>

      </div>

      <BottomNav active="home" onNavigate={onNavigate} />

    </div>
  );
}

export default HomeDashboard;
