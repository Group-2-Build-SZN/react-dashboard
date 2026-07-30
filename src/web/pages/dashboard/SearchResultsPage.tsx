import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ChevronDown,
  Heart,
  LayoutGrid,
  List,
} from "lucide-react";
import { DashboardNavbar } from "../../components/dashboard/DashboardNavbar";
import { Footer } from "../../components/layout/Footer";
import property1 from "../../assets/images/ImageWithFallback.png";
import property2 from "../../assets/images/Rectangle 35.png";
import property3 from "../../assets/images/ImageWithFallback (1).png";
import property4 from "../../assets/images/Frame 427318325.png";

const propertyTypes = ["All Types", "Apartments", "Bungalow", "Duplex"];
const bedroomOptions = ["All Types", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"];
const bathroomOptions = ["All Types", "1 Bathroom", "2 Bathrooms", "3+ Bathrooms"];

const listings = [
  {
    image: property1,
    title: "2 Bedroom Apartment",
    location: "123 Dhamija, Trans Ekulu, Enugu.",
    price: "\u20A61,800,000",
    beds: 2,
    baths: 2,
    sqm: 50,
    tags: ["Furnished", "Security"],
    time: "2 minutes ago",
    saved: true,
  },
  {
    image: property2,
    title: "2 Bedroom Apartment",
    location: "123 Nza Street, Independence layout, Enugu.",
    price: "\u20A6800,000",
    beds: 3,
    baths: 2,
    sqm: 100,
    tags: ["Unfurnished", "Security"],
    time: "2 minutes ago",
    saved: false,
  },
  {
    image: property3,
    title: "2 Bedroom Apartment",
    location: "123 Ben Emeasoba St, Enugu.",
    price: "\u20A6800,000",
    beds: 1,
    baths: 1,
    sqm: 50,
    tags: ["Furnished", "Water"],
    time: "2 minutes ago",
    saved: false,
  },
  {
    image: property4,
    title: "2 Bedroom Apartment",
    location: "123 Nza Street, New Haven, Enugu.",
    price: "\u20A61,800,000",
    beds: 2,
    baths: 2,
    sqm: 50,
    tags: ["Unfurnished", "Security"],
    time: "2 minutes ago",
    saved: false,
  },
];

function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string;
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-body font-semibold text-neutral">{title}</h3>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-small text-neutral-600">
            <input
              type="checkbox"
              checked={selected === opt}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/30"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsPage() {
  const [bedroom, setBedroom] = useState("1 Bedroom");
  const [bathroom, setBathroom] = useState("2 Bathrooms");
  const [propertyType, setPropertyType] = useState("All Types");
  const [savedIds, setSavedIds] = useState<number[]>(
    listings.map((l, i) => (l.saved ? i : -1)).filter((i) => i >= 0)
  );

  function toggleSaved(i: number) {
    setSavedIds((ids) =>
      ids.includes(i) ? ids.filter((id) => id !== i) : [...ids, i]
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
          <a href="/" className="shrink-0 text-h4 font-bold text-primary">
            My Ulo
          </a>
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              defaultValue="Independence Layout"
              className="w-full rounded-lg border border-neutral-300 py-2.5 pl-11 pr-10 text-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <X size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-small text-neutral-500">
            Dashboard <span className="mx-1">›</span> Search{" "}
            <span className="mx-1">›</span> Enugu, Independence
          </p>
          <h1 className="mt-2 text-h2 font-bold text-neutral">
            Properties for rent in Independence Layout
          </h1>
          <p className="mt-1 text-body text-neutral-500">200 results found</p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <aside>
              <div className="flex items-center justify-between">
                <h2 className="text-h4 font-bold text-neutral">Filters</h2>
                <button className="text-small font-medium text-primary">
                  Clear All
                </button>
              </div>

              <div className="mt-5">
                <h3 className="text-body font-semibold text-neutral">Location</h3>
                <div className="relative mt-3">
                  <select
                    defaultValue="Independence Layout, Enugu."
                    className="w-full appearance-none rounded-lg border border-neutral-300 px-3 py-2.5 pr-9 text-small text-neutral"
                  >
                    <option>Independence Layout, Enugu.</option>
                    <option>Trans Ekulu, Enugu.</option>
                    <option>New Haven, Enugu.</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <FilterCheckboxGroup
                title="Property Type"
                options={propertyTypes}
                selected={propertyType}
                onToggle={setPropertyType}
              />

              <div className="mt-6">
                <h3 className="text-body font-semibold text-neutral">
                  Price Range (per year)
                </h3>
                <input
                  type="range"
                  min={800000}
                  max={10000000}
                  defaultValue={4000000}
                  className="mt-4 w-full accent-primary"
                />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 text-small text-neutral-600">
                    ₦800,000
                  </span>
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 text-small text-neutral-600">
                    ₦10,000,000
                  </span>
                </div>
              </div>

              <FilterCheckboxGroup
                title="Bedroom"
                options={bedroomOptions}
                selected={bedroom}
                onToggle={setBedroom}
              />
              <FilterCheckboxGroup
                title="Bathroom"
                options={bathroomOptions}
                selected={bathroom}
                onToggle={setBathroom}
              />
            </aside>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-body font-medium text-neutral">Sort by</span>
                  <div className="relative">
                    <select className="appearance-none rounded-lg border border-neutral-300 py-2 pl-3 pr-8 text-body text-neutral">
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-small">View</span>
                  <button className="text-neutral-600"><LayoutGrid size={18} /></button>
                  <button><List size={18} /></button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {listings.map((p, i) => (
                  <Link
                    key={i}
                    to={`/property/${i + 1}`}
                    className="flex gap-4 rounded-2xl border border-neutral-200 p-3 hover:border-primary-200 hover:shadow-sm"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-32 w-40 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-h4 font-semibold text-neutral">
                            {p.title}
                          </h3>
                          <p className="text-small text-neutral-500">{p.location}</p>
                        </div>
                        <button
                          aria-label="Save property"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaved(i);
                          }}
                          className={
                            savedIds.includes(i) ? "text-error" : "text-accent"
                          }
                        >
                          <Heart
                            size={20}
                            fill={savedIds.includes(i) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <p className="mt-1 text-h4 font-bold text-primary">
                        {p.price}
                        <span className="text-small font-normal text-neutral-500">/year</span>
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-small text-neutral-500">
                        <span>{p.beds} Bedrooms</span>
                        <span>{p.baths} Bathrooms</span>
                        <span>{p.sqm}m²</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary-50 px-2.5 py-1 text-caption text-secondary-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-caption text-neutral-400">{p.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
