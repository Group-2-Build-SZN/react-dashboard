import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ChevronDown,
  Heart,
  LayoutGrid,
  List,
} from "lucide-react";
import { Footer } from "../../components/layout/Footer";
import {
  listProperties,
  saveProperty,
  unsaveProperty,
} from "../../../api/properties";
import {
  apiPropertyToProperty,
  formatNaira,
} from "../../../api/adapters";
import type { Property } from "../../../types";
import type { ApiPropertySearchParams } from "../../../api/types";

const propertyTypes = [
  "All Types",
  "Apartments",
  "Bungalow",
  "Duplex",
];

const bedroomOptions = [
  "All Types",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];

const bathroomOptions = [
  "All Types",
  "1 Bathroom",
  "2 Bathrooms",
  "3+ Bathrooms",
];

const sortOptions = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

// "Apartments" has no single matching backend enum.
// Leave it unmapped rather than guessing incorrectly.
const PROPERTY_TYPE_PARAM: Partial<Record<string, string>> = {
  Bungalow: "bungalow",
  Duplex: "duplex",
};

function parseCountOption(option: string): number | undefined {
  if (option === "All Types") return undefined;
  return parseInt(option, 10);
}

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
      <h3 className="text-body font-semibold text-neutral">
        {title}
      </h3>

      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-small text-neutral-600"
          >
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

const PRICE_MIN = 0;
const PRICE_MAX = 10000000;

export function SearchResultsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [bedroom, setBedroom] = useState("All Types");
  const [bathroom, setBathroom] = useState("All Types");
  const [propertyType, setPropertyType] = useState("All Types");

  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState(sortOptions[0]);
  const [page, setPage] = useState(1);

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [completedRequestKey, setCompletedRequestKey] = useState<
    string | null
  >(null);

  const [error, setError] = useState<string | null>(null);
  const [errorRequestKey, setErrorRequestKey] = useState<string | null>(
    null
  );

  const requestKey = JSON.stringify({
    page,
    search,
    bedroom,
    bathroom,
    propertyType,
    maxPrice,
    sort,
  });

  const isLoading = completedRequestKey !== requestKey;

  useEffect(() => {
    let cancelled = false;

    const params: ApiPropertySearchParams = {
      page,
      limit: 12,
      search: search || undefined,
      propertyType: PROPERTY_TYPE_PARAM[propertyType],
      bedrooms: parseCountOption(bedroom),
      bathrooms: parseCountOption(bathroom),
      maxPrice:
        maxPrice < PRICE_MAX ? maxPrice : undefined,
    };

    listProperties(params)
      .then((res) => {
        if (cancelled) return;

        let mapped = res.data.map(apiPropertyToProperty);

        if (sort === "Price: Low to High") {
          mapped = [...mapped].sort(
            (a, b) => a.price - b.price
          );
        }

        if (sort === "Price: High to Low") {
          mapped = [...mapped].sort(
            (a, b) => b.price - a.price
          );
        }

        setProperties(mapped);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);

        setError(null);
        setErrorRequestKey(null);
        setCompletedRequestKey(requestKey);
      })
      .catch((err) => {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load properties"
        );

        setErrorRequestKey(requestKey);
        setCompletedRequestKey(requestKey);
      });

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    bedroom,
    bathroom,
    propertyType,
    maxPrice,
    sort,
    requestKey,
  ]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleBedroomChange(value: string) {
    setPage(1);
    setBedroom(value);
  }

  function handleBathroomChange(value: string) {
    setPage(1);
    setBathroom(value);
  }

  function handlePropertyTypeChange(value: string) {
    setPage(1);
    setPropertyType(value);
  }

  function handleMaxPriceChange(value: number) {
    setPage(1);
    setMaxPrice(value);
  }

  function clearAll() {
    setPage(1);
    setSearchInput("");
    setSearch("");
    setBedroom("All Types");
    setBathroom("All Types");
    setPropertyType("All Types");
    setMaxPrice(PRICE_MAX);
  }

  async function toggleSaved(p: Property) {
    // Optimistic update — flip immediately.
    setProperties((list) =>
      list.map((item) =>
        item.id === p.id
          ? {
              ...item,
              isFavorited: !item.isFavorited,
            }
          : item
      )
    );

    try {
      if (p.isFavorited) {
        await unsaveProperty(p.id);
      } else {
        await saveProperty(p.id);
      }
    } catch (err) {
      console.error(
        "Failed to update saved property",
        err
      );

      // Roll back if the request fails.
      setProperties((list) =>
        list.map((item) =>
          item.id === p.id
            ? {
                ...item,
                isFavorited: p.isFavorited,
              }
            : item
        )
      );
    }
  }

  const currentError =
    errorRequestKey === requestKey ? error : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
          <a
            href="/"
            className="shrink-0 text-h4 font-bold text-primary"
          >
            My Ulo
          </a>

          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-xl flex-1"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              placeholder="Search by location, estate or keyword"
              className="w-full rounded-lg border border-neutral-300 py-2.5 pl-11 pr-10 text-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setPage(1);
                  setSearch("");
                }}
                aria-label="Clear search"
              >
                <X
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </button>
            )}
          </form>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-small text-neutral-500">
            Dashboard <span className="mx-1">›</span>{" "}
            Search
          </p>

          <h1 className="mt-2 text-h2 font-bold text-neutral">
            {search
              ? `Properties matching "${search}"`
              : "Browse Properties"}
          </h1>

          <p className="mt-1 text-body text-neutral-500">
            {isLoading
              ? "Searching…"
              : `${total} result${
                  total === 1 ? "" : "s"
                } found`}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <aside>
              <div className="flex items-center justify-between">
                <h2 className="text-h4 font-bold text-neutral">
                  Filters
                </h2>

                <button
                  onClick={clearAll}
                  className="text-small font-medium text-primary"
                >
                  Clear All
                </button>
              </div>

              <FilterCheckboxGroup
                title="Property Type"
                options={propertyTypes}
                selected={propertyType}
                onToggle={handlePropertyTypeChange}
              />

              <div className="mt-6">
                <h3 className="text-body font-semibold text-neutral">
                  Price Range (per year)
                </h3>

                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={100000}
                  value={maxPrice}
                  onChange={(e) =>
                    handleMaxPriceChange(
                      Number(e.target.value)
                    )
                  }
                  className="mt-4 w-full accent-primary"
                />

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 text-small text-neutral-600">
                    {formatNaira(PRICE_MIN)}
                  </span>

                  <span className="rounded-lg border border-neutral-300 px-3 py-2 text-small text-neutral-600">
                    up to {formatNaira(maxPrice)}
                  </span>
                </div>
              </div>

              <FilterCheckboxGroup
                title="Bedroom"
                options={bedroomOptions}
                selected={bedroom}
                onToggle={handleBedroomChange}
              />

              <FilterCheckboxGroup
                title="Bathroom"
                options={bathroomOptions}
                selected={bathroom}
                onToggle={handleBathroomChange}
              />
            </aside>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-body font-medium text-neutral">
                    Sort by
                  </span>

                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) =>
                        setSort(e.target.value)
                      }
                      className="appearance-none rounded-lg border border-neutral-300 py-2 pl-3 pr-8 text-body text-neutral"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-small">
                    View
                  </span>

                  <button className="text-neutral-600">
                    <LayoutGrid size={18} />
                  </button>

                  <button>
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {currentError ? (
                  <p className="text-small text-error">
                    {currentError}
                  </p>
                ) : isLoading ? (
                  <p className="text-small text-neutral-500">
                    Loading properties…
                  </p>
                ) : properties.length === 0 ? (
                  <p className="text-small text-neutral-500">
                    No properties match your filters.
                  </p>
                ) : (
                  properties.map((p) => (
                    <Link
                      key={p.id}
                      to={`/property/${p.id}`}
                      className="flex gap-4 rounded-2xl border border-neutral-200 p-3 hover:border-primary-200 hover:shadow-sm"
                    >
                      <img
                        src={p.coverImageUrl || undefined}
                        alt={p.listingTitle}
                        className="h-32 w-40 shrink-0 rounded-xl bg-neutral-100 object-cover"
                      />

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-h4 font-semibold text-neutral">
                              {p.listingTitle}
                            </h3>

                            <p className="text-small text-neutral-500">
                              {p.address}
                            </p>
                          </div>

                          <button
                            aria-label={
                              p.isFavorited
                                ? "Remove from saved"
                                : "Save property"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSaved(p);
                            }}
                            className={
                              p.isFavorited
                                ? "text-error"
                                : "text-accent"
                            }
                          >
                            <Heart
                              size={20}
                              fill={
                                p.isFavorited
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>

                        <p className="mt-1 text-h4 font-bold text-primary">
                          {formatNaira(p.price)}

                          <span className="text-small font-normal text-neutral-500">
                            /{p.pricePeriod}
                          </span>
                        </p>

                        <div className="mt-1 flex items-center gap-3 text-small text-neutral-500">
                          <span>
                            {p.bedrooms} Bedrooms
                          </span>

                          <span>
                            {p.bathrooms} Bathrooms
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex gap-2">
                            {p.features
                              .slice(0, 2)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-secondary-50 px-2.5 py-1 text-caption text-secondary-700"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>

                          {p.isVerified && (
                            <span className="text-caption font-medium text-secondary">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {!isLoading &&
                !currentError &&
                totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.max(1, p - 1)
                        )
                      }
                      disabled={page <= 1}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-small text-neutral-600 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="text-small text-neutral-500">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(totalPages, p + 1)
                        )
                      }
                      disabled={page >= totalPages}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-small text-neutral-600 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}