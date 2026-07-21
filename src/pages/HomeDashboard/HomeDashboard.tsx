import { Menu, ChevronDown, Bell, MapPin, Map as MapIcon, Heart, ShieldCheck } from "lucide-react";

import SearchBar from "../../components/SearchBar/SearchBar";
import RecommendedPropertyCard from "../../components/RecommendedPropertyCard/RecommendedPropertyCard";
import BottomNav from "../../components/BottomNav/BottomNav";
import type { BottomNavTab } from "../../components/BottomNav/BottomNav";

import { properties } from "../../data/properties";
import welcomeHouse from "../../assets/branding/welcome-screen-house.png";

type HomeDashboardProps = {
  userName?: string;
  onOpenMenu?: () => void;
  onSearch?: (query: string) => void;
  onOpenFilters?: () => void;
  onSelectProperty?: (propertyId: number) => void;
  onSeeAll?: () => void;
  onNavigate?: (tab: BottomNavTab) => void;
};

const quickActions = [
  { id: "nearby", label: "Nearby", icon: MapPin, colorClass: "text-primary-800" },
  { id: "map", label: "Map", icon: MapIcon, colorClass: "text-secondary-600" },
  { id: "saved", label: "Saved", icon: Heart, colorClass: "text-error-500" },
] as const;

function HomeDashboard({
  userName = "Chinazor",
  onOpenMenu,
  onSearch,
  onOpenFilters,
  onSelectProperty,
  onSeeAll,
  onNavigate,
}: HomeDashboardProps) {
  return (
    <div className="min-h-screen bg-white pb-24">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-5">

        <button onClick={onOpenMenu} aria-label="Menu">
          <Menu size={22} className="text-gray-700" />
        </button>

        <button className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <MapPin size={14} className="text-primary-800" />
          New Haven, Enugu
          <ChevronDown size={14} />
        </button>

        <button aria-label="Notifications">
          <Bell size={22} className="text-gray-700" />
        </button>

      </div>

      {/* Greeting */}
      <div className="mt-5 px-6">
        <p className="text-sm text-gray-500">
          Hello, {userName} 👋
        </p>

        <h1 className="mt-1 text-[22px] font-bold leading-8 text-gray-900">
          Find verified properties you can trust.
        </h1>
      </div>

      {/* Search */}
      <div className="mt-5 px-6">
        <SearchBar
          placeholder="Search by location, area or keyword"
          onChange={onSearch}
          onFilterClick={onOpenFilters}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex justify-around px-6">
        {quickActions.map(({ id, label, icon: Icon, colorClass }) => (
          <button key={id} className="flex flex-col items-center gap-2">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full border border-border-light ${colorClass}`}>
              <Icon size={20} />
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Verified banner */}
      <div className="relative mx-6 mt-5 flex items-center gap-3 overflow-hidden rounded-xl bg-blue-tint p-4">
        <span className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-600 text-white">
          <ShieldCheck size={20} />
        </span>

        <div className="z-10 max-w-[70%]">
          <p className="text-sm font-semibold text-gray-900">
            100% Verified Properties
          </p>
          <p className="text-xs text-gray-500">
            All properties on My Ulo are verified for your peace of mind
          </p>
        </div>

        <img
          src={welcomeHouse}
          alt=""
          className="absolute right-0 top-0 h-full w-24 object-cover opacity-90 [mask-image:linear-gradient(to_left,black_40%,transparent)]"
        />
      </div>

      {/* Recommended for you */}
      <div className="mt-6">

        <div className="flex items-center justify-between px-6">
          <h2 className="text-base font-semibold text-gray-900">
            Recommended for you
          </h2>

          <button onClick={onSeeAll} className="text-sm font-medium text-primary-800">
            See all
          </button>
        </div>

        <div className="mt-3 flex gap-4 overflow-x-auto px-6 pb-2">
          {properties.map((property) => (
            <RecommendedPropertyCard
              key={property.id}
              image={property.image}
              name={property.name}
              location={property.location}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              size={property.size}
              verified={property.verified}
              onClick={() => onSelectProperty?.(property.id)}
            />
          ))}
        </div>

      </div>

      <BottomNav active="home" onNavigate={onNavigate} />

    </div>
  );
}

export default HomeDashboard;
