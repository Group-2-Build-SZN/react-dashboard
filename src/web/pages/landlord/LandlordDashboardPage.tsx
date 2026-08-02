import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircleQuestionMark, Eye, Search } from "lucide-react";
import { LandlordLayout } from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../lib/AuthContext";
import { getLandlordStats, getRecentInquiries, type ApiLandlordStats, type ApiLandlordInquiry } from "../../../api/landlord";
import { listMyProperties } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira } from "../../../api/adapters";
import type { Property } from "../../../types";

export function LandlordDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ApiLandlordStats | null>(null);
  const [inquiries, setInquiries] = useState<ApiLandlordInquiry[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    getLandlordStats()
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Couldn't load stats"));

    getRecentInquiries(1, 3)
      .then((result) => !cancelled && setInquiries(result.data))
      .catch(() => {});

    listMyProperties(user.id)
      .then((result) => !cancelled && setProperties(result.data.slice(0, 3).map(apiPropertyToProperty)))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user]);

  const statCards = [
    { label: "Total Properties", value: stats?.totalProperties ?? 0, icon: Heart, iconBg: "bg-secondary-50", iconColor: "text-secondary" },
    { label: "Active Listings", value: stats?.activeListings ?? 0, icon: MessageCircleQuestionMark, iconBg: "bg-accent-50", iconColor: "text-accent-600" },
    { label: "Total Views", value: stats?.totalViews ?? 0, icon: Eye, iconBg: "bg-primary-50", iconColor: "text-primary" },
    { label: "Recent Searches", value: stats?.recentSearches ?? 0, icon: Search, iconBg: "bg-primary-50", iconColor: "text-primary" },
  ];

  return (
    <LandlordLayout>
      <h1 className="text-h2 font-bold text-neutral">
        Welcome back, {user?.firstName ?? "there"} 👋
      </h1>
      <p className="mt-1 text-body text-neutral-500">
        Let's help you find a place.
      </p>

      {error && <p className="mt-4 text-small text-error">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-200 p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={18} />
            </span>
            <p className="mt-3 text-body text-neutral-500">{stat.label}</p>
            <p className="text-h3 font-bold text-neutral">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-bold text-neutral">Recent Inquiries</h2>
            <Link to="/landlord/inquiries" className="text-small font-medium text-primary">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {inquiries.length === 0 && (
              <p className="text-small text-neutral-500">No inquiries yet.</p>
            )}
            {inquiries.map((inq) => (
              <div key={inq.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-400">
                  {inq.tenantAvatarUrl ? (
                    <img src={inq.tenantAvatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    inq.tenantFirstName[0]
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-body font-medium text-neutral">
                    {inq.tenantFirstName} {inq.tenantLastName}
                  </p>
                  <p className="text-small text-neutral-500">{inq.propertyTitle}</p>
                </div>
                <span className="text-caption text-neutral-400">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-h4 font-bold text-neutral">Top Performing property</h2>
          {stats?.topPerformingProperty ? (
            <div className="mt-4 flex gap-4">
              <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {stats.topPerformingProperty.coverImageUrl && (
                  <img
                    src={stats.topPerformingProperty.coverImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-neutral">
                  {stats.topPerformingProperty.listingTitle}
                </p>
                <p className="text-small text-neutral-500">
                  {formatNaira(Number(stats.topPerformingProperty.price))}
                </p>
                <div className="mt-3">
                  <p className="text-caption text-neutral-400">Views</p>
                  <p className="text-body font-semibold text-neutral">
                    {stats.topPerformingProperty.viewCount}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-small text-neutral-500">
              Not enough data yet — this fills in once your listings start getting views.
            </p>
          )}
          <Link
            to="/landlord/properties"
            className="mt-4 block w-full rounded-lg border border-neutral-200 py-2 text-center text-small font-medium text-neutral-700 hover:bg-neutral-50"
          >
            View Performance
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h4 font-bold text-neutral">Your properties</h2>
          <Link to="/landlord/properties" className="text-small font-medium text-primary">
            View all
          </Link>
        </div>
        {properties.length === 0 ? (
          <p className="mt-4 text-small text-neutral-500">
            You haven't listed any properties yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="h-40 bg-neutral-100">
                  {p.coverImageUrl && (
                    <img src={p.coverImageUrl} alt={p.listingTitle} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-h4 font-semibold text-neutral">{p.listingTitle}</h3>
                  <p className="mt-1 text-small text-neutral-500">{p.address}</p>
                  <p className="mt-2 text-h4 font-bold text-primary">{formatNaira(p.price)}</p>
                  <div className="mt-3 flex gap-4 text-small text-neutral-500">
                    <span>{p.bedrooms} Bedrooms</span>
                    <span>{p.bathrooms} Bathrooms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LandlordLayout>
  );
}
