import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { listSavedProperties, unsaveProperty } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira } from "../../../api/adapters";
import type { Property } from "../../../types";

interface SavedRow {
  savedAt: string;
  property: Property;
}

export function SavedPropertiesPage() {
  const [rows, setRows] = useState<SavedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listSavedProperties()
      .then((data) => {
        if (cancelled) return;
        setRows(
          data.map((row) => ({
            savedAt: row.savedAt,
            property: apiPropertyToProperty(row.property),
          }))
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load saved properties", err);
        setError("We couldn't load your saved properties. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRemove(propertyId: string) {
    setRemovingId(propertyId);
    try {
      await unsaveProperty(propertyId);
      setRows((prev) => prev.filter((r) => r.property.id !== propertyId));
    } catch (err) {
      console.error("Failed to unsave property", err);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-h2 font-bold text-neutral">Saved Properties</h1>
      <p className="mt-1 text-body text-neutral-500">
        Properties you've bookmarked to come back to.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-small text-neutral-500">Loading saved properties…</p>
        ) : error ? (
          <p className="text-small text-red-500">{error}</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
            <Heart size={28} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-body text-neutral-500">
              You haven't saved any properties yet.
            </p>
            <Link to="/search" className="mt-3 inline-block text-body font-medium text-primary">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ property }) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 hover:border-primary-200 hover:shadow-sm"
              >
                <Link to={`/property/${property.id}`}>
                  <img
                    src={property.coverImageUrl}
                    alt={property.listingTitle}
                    className="h-40 w-full object-cover bg-neutral-100"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/property/${property.id}`}>
                      <h3 className="text-h4 font-semibold text-neutral">
                        {property.listingTitle}
                      </h3>
                    </Link>
                    <button
                      onClick={() => handleRemove(property.id)}
                      disabled={removingId === property.id}
                      aria-label="Remove from saved"
                      className="shrink-0 text-secondary disabled:opacity-40"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  <p className="mt-1 text-small text-neutral-500">{property.address}</p>
                  <p className="mt-2 text-h4 font-bold text-primary">
                    {formatNaira(property.price)}
                    <span className="text-small font-normal text-neutral-500">
                      /{property.pricePeriod}
                    </span>
                  </p>
                  <p className="mt-1 text-small text-neutral-500">
                    {property.bedrooms} Bedrooms {property.bathrooms} Bathrooms
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
