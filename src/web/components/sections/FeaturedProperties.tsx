import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyCard } from "../ui/PropertyCard";
import { getRecommendedProperties } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira, propertyTypeLabel } from "../../../api/adapters";
import type { Property } from "../../../types";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getRecommendedProperties()
      .then((data) => {
        if (cancelled) return;
        setProperties(data.map(apiPropertyToProperty).slice(0, 4));
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
  }, []);

  return (
    <section id="properties" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-h2 font-bold text-neutral">
              Featured Properties
            </h2>
            <p className="mt-2 text-body text-neutral-500">
              Hand picked verified properties for you.
            </p>
          </div>
          <Link
            to="/search"
            className="hidden items-center gap-1 text-body font-medium text-primary sm:flex"
          >
            View all properties <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <p className="col-span-full text-small text-neutral-500">Loading properties…</p>
          ) : error ? (
            <p className="col-span-full text-small text-error">{error}</p>
          ) : properties.length === 0 ? (
            <p className="col-span-full text-small text-neutral-500">No properties available yet.</p>
          ) : (
            properties.map((property) => (
              <Link key={property.id} to={`/property/${property.id}`}>
                <PropertyCard
                  image={property.coverImageUrl}
                  title={property.listingTitle}
                  location={property.address}
                  price={formatNaira(property.price)}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  type={propertyTypeLabel(property.propertyType)}
                  verified={property.isVerified}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
