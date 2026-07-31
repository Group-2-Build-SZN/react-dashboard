import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Heart,
  BedDouble,
  Bath,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { listProperties, saveProperty, unsaveProperty } from "../../api/properties";
import { listAmenities } from "../../api/amenities";
import { apiPropertyToProperty, formatNaira, propertyTypeLabel } from "../../api/adapters";
import type { Property, Amenity } from "../../types";

const propertyTypeOptions = [
  { label: "All Types", value: undefined },
  { label: "Duplex", value: "duplex" },
  { label: "Bungalow", value: "bungalow" },
];

const bedroomOptions = [
  { label: "Any", value: undefined },
  { label: "1 Bedroom", value: 1 },
  { label: "2 Bedrooms", value: 2 },
  { label: "3 Bedrooms", value: 3 },
  { label: "4+ Bedrooms", value: 4 },
];

// Enugu, Nigeria — matches the seed data's addresses ("Hilltop UNN", "New
// Haven", "Trans Ekulu", etc). Used only as a fallback center before any
// properties have loaded / if none have usable coordinates.
const DEFAULT_CENTER: [number, number] = [6.4413, 7.4988];

function priceMarkerIcon(price: number) {
  const label =
    price >= 1_000_000 ? `₦${(price / 1_000_000).toFixed(1)}M` : `₦${Math.round(price / 1000)}k`;
  return L.divIcon({
    className: "",
    html: `<div style="background:#1E40AF;color:white;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${label}</div>`,
    iconSize: [0, 0],
  });
}

function amenityMarkerIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="background:white;color:#16A34A;padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:500;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.2);border:1px solid #E2EBF0">●</div>`,
    iconSize: [0, 0],
  });
}

export function MapPage() {
  const [propertyType, setPropertyType] = useState<string | undefined>(undefined);
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);

  const [properties, setProperties] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      listProperties({ propertyType, bedrooms, limit: 50 }),
      listAmenities(),
    ])
      .then(([propRes, amenityRes]) => {
        if (cancelled) return;
        setProperties(propRes.data.map(apiPropertyToProperty));
        setTotal(propRes.pagination.total);
        setAmenities(amenityRes);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load the map");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyType, bedrooms]);

  const mappable = useMemo(
    () => properties.filter((p) => p.lat !== 0 || p.lng !== 0),
    [properties]
  );

  const center: [number, number] =
    mappable.length > 0 ? [mappable[0].lat, mappable[0].lng] : DEFAULT_CENTER;

  async function toggleSaved(p: Property) {
    setProperties((list) =>
      list.map((item) => (item.id === p.id ? { ...item, isFavorited: !item.isFavorited } : item))
    );
    try {
      if (p.isFavorited) {
        await unsaveProperty(p.id);
      } else {
        await saveProperty(p.id);
      }
    } catch (err) {
      console.error("Failed to update saved property", err);
      setProperties((list) =>
        list.map((item) => (item.id === p.id ? { ...item, isFavorited: p.isFavorited } : item))
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="text-center">
            <h1 className="text-h2 font-bold text-neutral">
              Explore Properties on the Map
            </h1>
            <p className="mt-2 text-body text-neutral-500">
              Search, filter, and secure real estate in your ideal
              neighborhood.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-neutral-200 p-4">
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1.5 block text-small font-medium text-neutral-700">
                Property Type
              </label>
              <div className="relative">
                <select
                  value={propertyType ?? ""}
                  onChange={(e) => setPropertyType(e.target.value || undefined)}
                  className="w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2.5 pr-9 text-body text-neutral"
                >
                  {propertyTypeOptions.map((opt) => (
                    <option key={opt.label} value={opt.value ?? ""}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1.5 block text-small font-medium text-neutral-700">
                Bedrooms
              </label>
              <div className="relative">
                <select
                  value={bedrooms ?? ""}
                  onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2.5 pr-9 text-body text-neutral"
                >
                  {bedroomOptions.map((opt) => (
                    <option key={opt.label} value={opt.value ?? ""}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <Link to="/search">
              <Button variant="secondary" icon={<SlidersHorizontal size={16} />}>
                More Filters
              </Button>
            </Link>
          </div>

          <div className="relative mt-6 h-[420px] w-full overflow-hidden rounded-2xl border border-neutral-200">
            {error ? (
              <div className="flex h-full items-center justify-center text-small text-error">
                {error}
              </div>
            ) : (
              <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappable.map((p) => (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={priceMarkerIcon(p.price)}>
                    <Popup>
                      <div style={{ minWidth: 160 }}>
                        <p style={{ fontWeight: 600, marginBottom: 2 }}>{p.listingTitle}</p>
                        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{p.address}</p>
                        <Link to={`/property/${p.id}`} style={{ color: "#1E40AF", fontSize: 12, fontWeight: 600 }}>
                          View details →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {amenities.map((a) => (
                  <Marker key={a.id} position={[a.lat, a.lng]} icon={amenityMarkerIcon()}>
                    <Popup>{a.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
          {!isLoading && !error && properties.length > mappable.length && (
            <p className="mt-2 text-caption text-neutral-400">
              {properties.length - mappable.length} of {properties.length} results don't have map
              coordinates on file and aren't shown as pins.
            </p>
          )}

          <div className="mt-8 flex items-center justify-between">
            <p className="text-body font-medium text-neutral">
              {isLoading ? "Loading…" : `${total} propert${total === 1 ? "y" : "ies"} found`}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {error ? null : isLoading ? (
              <p className="text-small text-neutral-500">Loading properties…</p>
            ) : properties.length === 0 ? (
              <p className="text-small text-neutral-500">No properties match your filters.</p>
            ) : (
              properties.map((p) => (
                <Link
                  key={p.id}
                  to={`/property/${p.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-3 hover:border-primary-200 hover:shadow-sm sm:flex-row"
                >
                  <img
                    src={p.coverImageUrl || undefined}
                    alt={p.listingTitle}
                    className="h-40 w-full rounded-xl bg-neutral-100 object-cover sm:h-28 sm:w-44"
                  />
                  <div className="flex flex-1 items-start justify-between">
                    <div>
                      <h3 className="text-h4 font-semibold text-neutral">{p.listingTitle}</h3>
                      <p className="mt-1 flex items-center gap-1 text-small text-neutral-500">
                        <MapPin size={14} /> {p.address}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-small text-neutral-500">
                        <span className="flex items-center gap-1">
                          <BedDouble size={14} /> {p.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={14} /> {p.bathrooms} Baths
                        </span>
                      </div>
                      <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-caption text-neutral-600">
                        {propertyTypeLabel(p.propertyType)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <button
                        aria-label="Save property"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSaved(p);
                        }}
                        className={p.isFavorited ? "text-error" : "text-accent"}
                      >
                        <Heart size={20} fill={p.isFavorited ? "currentColor" : "none"} />
                      </button>
                      <p className="text-h4 font-bold text-primary">
                        {formatNaira(p.price)}
                        <span className="text-small font-normal text-neutral-500">/{p.pricePeriod}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {!isLoading && !error && total > properties.length && (
            <div className="mt-8 flex justify-center">
              <Link to="/search">
                <Button variant="secondary">View More Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
