import { Heart, BedDouble, Bath, Maximize, SlidersHorizontal, ChevronDown, Plus, Minus, MapPin } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import property1 from "../assets/images/Rectangle 35.png";
import property2 from "../assets/images/ImageWithFallback.png";
import property3 from "../assets/images/ImageWithFallback (1).png";

const filters = [
  { label: "Location", value: "Enugu, Nigeria" },
  { label: "Property Type", value: "All Types" },
  { label: "Price Range", value: "Any Price" },
  { label: "Bedrooms", value: "Any" },
];

const pins = [
  { label: "₦2.2M", top: "38%", left: "18%" },
  { label: "₦1.5M", top: "22%", left: "48%" },
  { label: "₦1.7M", top: "28%", left: "78%" },
  { label: "₦2.5M", top: "72%", left: "20%" },
  { label: "₦1.7M", top: "80%", left: "62%" },
];

const pois = [
  { label: "Presidential Estate", top: "20%", left: "12%" },
  { label: "Christ Embassy Enugu", top: "18%", left: "62%" },
  { label: "TotalEnergies Filling Station", top: "22%", left: "88%" },
  { label: "Pukka Eats", top: "55%", left: "90%" },
  { label: "New Haven Baptist Church", top: "62%", left: "42%" },
  { label: "ShopRite New Haven", top: "80%", left: "78%" },
  { label: "Enugu International School", top: "88%", left: "22%" },
];

const properties = [
  {
    image: property1,
    title: "Luxury 3 Bedroom Apartment",
    location: "Independence Layout, Enugu",
    beds: 3,
    baths: 3,
    sqm: 120,
    price: "\u20A62,500,000",
    tag: "Apartment",
  },
  {
    image: property2,
    title: "Modern 2 Bedroom Duplex",
    location: "Independence Layout, Enugu",
    beds: 2,
    baths: 2,
    sqm: 100,
    price: "\u20A61,800,000",
    tag: "Duplex",
  },
  {
    image: property3,
    title: "4 Bedroom Terrace",
    location: "Emene, Enugu",
    beds: 4,
    baths: 4,
    sqm: 160,
    price: "\u20A63,200,000",
    tag: "Terrace",
  },
];

export function MapPage() {
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
            {filters.map((f) => (
              <div key={f.label} className="flex-1 min-w-[140px]">
                <label className="mb-1.5 block text-small font-medium text-neutral-700">
                  {f.label}
                </label>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-left text-body text-neutral"
                >
                  {f.value}
                  <ChevronDown size={16} className="text-neutral-400" />
                </button>
              </div>
            ))}
            <Button variant="secondary" icon={<SlidersHorizontal size={16} />}>
              More Filters
            </Button>
          </div>

          <div className="relative mt-6 h-[420px] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-[#eaf0e3]">
            <div className="absolute inset-0 [background-image:linear-gradient(#d7e0cc_1px,transparent_1px),linear-gradient(90deg,#d7e0cc_1px,transparent_1px)] [background-size:60px_60px]" />

            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-200/40" />
            <div className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary ring-4 ring-white">
              <span className="h-2 w-2 rounded-full bg-white" />
            </div>
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-6 text-body font-semibold text-neutral-700">
              NEW HAVEN
            </p>

            {pins.map((pin, i) => (
              <span
                key={i}
                style={{ top: pin.top, left: pin.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-2.5 py-1 text-caption font-semibold text-white shadow-md"
              >
                {pin.label}
              </span>
            ))}

            {pois.map((poi, i) => (
              <span
                key={i}
                style={{ top: poi.top, left: poi.left }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white px-2 py-1 text-caption text-neutral-700 shadow"
              >
                <MapPin size={10} className="text-secondary" />
                {poi.label}
              </span>
            ))}

            <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow">
              <button className="flex h-8 w-8 items-center justify-center border-b border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                <Plus size={16} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50">
                <Minus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-body font-medium text-neutral">
              32 properties found
            </p>
            <button className="flex items-center gap-1 text-body text-neutral-600">
              Sort by Recommendation
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {properties.map((p) => (
              <div
                key={p.title}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-3 sm:flex-row"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-44"
                />
                <div className="flex flex-1 items-start justify-between">
                  <div>
                    <h3 className="text-h4 font-semibold text-neutral">
                      {p.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-small text-neutral-500">
                      <MapPin size={14} /> {p.location}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-small text-neutral-500">
                      <span className="flex items-center gap-1">
                        <BedDouble size={14} /> {p.beds} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={14} /> {p.baths} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize size={14} /> {p.sqm} sqm
                      </span>
                    </div>
                    <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-caption text-neutral-600">
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button aria-label="Save property" className="text-error">
                      <Heart size={20} fill="currentColor" />
                    </button>
                    <p className="text-h4 font-bold text-primary">
                      {p.price}
                      <span className="text-small font-normal text-neutral-500">
                        /year
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="secondary">View More Properties</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
