import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, BedDouble, Bath, Search } from "lucide-react";
import { LandlordLayout } from "../../components/landlord/LandlordLayout";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../lib/AuthContext";
import { listMyProperties, deleteProperty } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira } from "../../../api/adapters";
import type { Property } from "../../../types";

// The API has no single "status" field — it only exposes isVerified (really
// is_published under the hood) and availabilityStatus. This maps those two
// onto the four tabs the Figma calls for. Unconfirmed against a real account
// with actual drafts/pending listings — if a property lands in the wrong
// tab, this mapping is the first place to check.
type StatusTab = "All" | "Active" | "Pending" | "Draft" | "Inactive";

function statusOf(p: Property): Exclude<StatusTab, "All"> {
  if (!p.isVerified) return "Draft"; // never published
  if (p.availabilityStatus === "under_review") return "Pending";
  if (p.availabilityStatus === "taken") return "Inactive";
  return "Active"; // published + available
}

const STATUS_BADGE_CLASS: Record<Exclude<StatusTab, "All">, string> = {
  Active: "bg-secondary/10 text-secondary",
  Pending: "bg-amber-100 text-amber-700",
  Draft: "bg-neutral-200 text-neutral-600",
  Inactive: "bg-neutral-700/10 text-neutral-500",
};

export function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    listMyProperties(user.id)
      .then((result) => setProperties(result.data.map(apiPropertyToProperty)))
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load your properties"));
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this property? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev?.filter((p) => p.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete this property");
    } finally {
      setDeletingId(null);
    }
  }

  const counts = useMemo(() => {
    const base = { All: 0, Active: 0, Pending: 0, Draft: 0, Inactive: 0 };
    if (!properties) return base;
    for (const p of properties) {
      base.All++;
      base[statusOf(p)]++;
    }
    return base;
  }, [properties]);

  const visible = useMemo(() => {
    if (!properties) return [];
    return properties.filter((p) => {
      if (activeTab !== "All" && statusOf(p) !== activeTab) return false;
      if (search.trim() && !p.listingTitle.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [properties, activeTab, search]);

  return (
    <LandlordLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral">My Properties</h1>
          <p className="mt-1 text-body text-neutral-500">
            Manage the properties you've listed on My Ulo
          </p>
        </div>
        <Link to="/landlord/properties/new">
          <Button icon={<Plus size={18} />}>Add Property</Button>
        </Link>
      </div>

      <div className="mt-6">
        <Input
          icon={<Search size={18} />}
          placeholder="Search properties"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(["All", "Active", "Pending", "Draft", "Inactive"] as StatusTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-small font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-small text-error">{error}</p>}

      {properties === null && !error && (
        <p className="mt-8 text-body text-neutral-500">Loading your properties…</p>
      )}

      {properties && properties.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-body font-medium text-neutral">No properties yet</p>
          <p className="max-w-sm text-small text-neutral-500">
            List your first property to start receiving inquiries from verified tenants.
          </p>
          <Link to="/landlord/properties/new">
            <Button icon={<Plus size={18} />}>Add Property</Button>
          </Link>
        </div>
      )}

      {properties && properties.length > 0 && visible.length === 0 && (
        <p className="mt-8 text-body text-neutral-500">No properties match this filter.</p>
      )}

      {visible.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const status = statusOf(p);
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="relative h-40 bg-neutral-100">
                  {p.coverImageUrl && (
                    <img src={p.coverImageUrl} alt={p.listingTitle} className="h-full w-full object-cover" />
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-caption font-medium ${STATUS_BADGE_CLASS[status]}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-h4 font-semibold text-neutral">{p.listingTitle}</h3>
                  <p className="mt-1 text-small text-neutral-500">{p.address}</p>
                  <p className="mt-2 text-h4 font-bold text-primary">{formatNaira(p.price)}</p>
                  <div className="mt-3 flex items-center gap-4 text-small text-neutral-500">
                    <span className="flex items-center gap-1">
                      <BedDouble size={14} /> {p.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={14} /> {p.bathrooms}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/property/${p.id}`} className="flex-1">
                      <Button variant="outline" fullWidth>
                        View
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      aria-label="Delete property"
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-error hover:bg-error/5 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </LandlordLayout>
  );
}
