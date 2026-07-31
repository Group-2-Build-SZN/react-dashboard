import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircleQuestionMark, Eye, Search, SlidersHorizontal } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/AuthContext";
import { getMyStats } from "../../../api/auth";
import { getRecommendedProperties, listSavedProperties } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira } from "../../../api/adapters";
import type { Property } from "../../../types";
import promoImage from "../../assets/images/ChatGPT Image Jul 14, 2026, 03_48_04 PM 1.png";
import phoneImage from "../../assets/images/ChatGPT Image Jul 15, 2026, 08_57_45 PM 1.png";

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ savedProperties: 0, viewedProperties: 0, inquiriesMade: 0 });
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getMyStats(), getRecommendedProperties(), listSavedProperties()])
      .then(([myStats, recommendedRes, savedRes]) => {
        if (cancelled) return;
        setStats(myStats);
        setRecommended(recommendedRes.map(apiPropertyToProperty).slice(0, 3));
        setSavedCount(savedRes.length);
      })
      .catch((err) => console.error("Failed to load dashboard data", err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    { label: "Saved Properties", value: savedCount, icon: Heart, iconBg: "bg-secondary-50", iconColor: "text-secondary", to: "/dashboard/settings/profile" },
    { label: "My Inquiries", value: stats.inquiriesMade, icon: MessageCircleQuestionMark, iconBg: "bg-accent-50", iconColor: "text-accent-600", to: "/dashboard/settings/profile" },
    { label: "Properties Viewed", value: stats.viewedProperties, icon: Eye, iconBg: "bg-primary-50", iconColor: "text-primary", to: "/dashboard/settings/profile" },
    { label: "Search Properties", value: undefined, icon: Search, iconBg: "bg-primary-100", iconColor: "text-primary-700", to: "/search" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-h2 font-bold text-neutral">
        Welcome back{user?.firstName ? `, ${user.firstName}` : ""} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1 text-body text-neutral-500">
        Let's help you find a place.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 p-5">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${s.iconBg} ${s.iconColor}`}
            >
              <s.icon size={18} />
            </span>
            <p className="mt-3 text-small text-neutral-500">{s.label}</p>
            <p className="text-h3 font-bold text-neutral">{s.value ?? "\u2014"}</p>
            <hr className="my-2 border-neutral-100" />
            <Link to={s.to} className="text-small font-medium text-primary">
              View all
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Find your next home</h2>
        <p className="mt-1 text-small text-neutral-500">
          Search verified properties with confidence
        </p>

        <Link to="/search" className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <span className="block w-full rounded-lg border border-neutral-300 py-2.5 pl-11 pr-4 text-body text-neutral-400">
              Search by location, estate or keyword
            </span>
          </div>
          <Button variant="secondary" icon={<SlidersHorizontal size={16} />}>
            Filters
          </Button>
        </Link>

        <Link to="/search">
          <Button fullWidth size="lg" icon={<Search size={18} />} className="mt-4">
            Search Properties
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-h4 font-bold text-neutral">Recommended for you</h2>
        <Link to="/search" className="text-body font-medium text-primary">
          View all
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-small text-neutral-500">Loading recommendations…</p>
        ) : recommended.length === 0 ? (
          <p className="text-small text-neutral-500">No recommended properties yet.</p>
        ) : (
          recommended.map((p) => (
            <Link
              key={p.id}
              to={`/property/${p.id}`}
              className="rounded-2xl border border-neutral-200 overflow-hidden hover:border-primary-200 hover:shadow-sm"
            >
              <img src={p.coverImageUrl} alt={p.listingTitle} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-h4 font-semibold text-neutral">{p.listingTitle}</h3>
                <p className="mt-1 text-small text-neutral-500">{p.address}</p>
                <p className="mt-2 text-h4 font-bold text-primary">
                  {formatNaira(p.price)}
                  <span className="text-small font-normal text-neutral-500">/{p.pricePeriod}</span>
                </p>
                <p className="mt-1 text-small text-neutral-500">
                  {p.bedrooms} Bedrooms {p.bathrooms} Bathrooms
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 items-center gap-6 rounded-2xl bg-neutral-50 p-6 sm:grid-cols-2">
        <div className="relative">
          <img src={promoImage} alt="A modern house" className="w-full rounded-xl object-cover" />
          <img
            src={phoneImage}
            alt="Hand holding a phone with the My Ulo app"
            className="absolute -right-4 bottom-0 h-[85%] w-auto drop-shadow-xl"
          />
        </div>
        <div>
          <h3 className="text-h3 font-bold text-primary">List your property on My Ulo</h3>
          <p className="mt-2 text-body text-neutral-500">
            Reach thousands of verified tenants and rent faster. Use the My Ulo mobile app to create a listing.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
