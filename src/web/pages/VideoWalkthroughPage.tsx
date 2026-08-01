import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { getProperty } from "../../api/properties";
import { apiPropertyToProperty, propertyTypeLabel } from "../../api/adapters";
import type { Property } from "../../api/adapters";

export function VideoWalkthroughPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);

    getProperty(id)
      .then((apiProperty) => {
        if (cancelled) return;
        setProperty(apiPropertyToProperty(apiProperty));
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load this video.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const thumbnails = property
    ? [property.videoUrls[0] ? "video" : null, ...property.photoUrls]
        .filter((v): v is string => Boolean(v))
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            to={id ? `/property/${id}` : "/search"}
            className="flex items-center gap-1 text-body text-primary hover:underline"
          >
            <ChevronLeft size={16} />
            Back to search results
          </Link>

          {isLoading ? (
            <p className="mt-8 text-body text-neutral-500">Loading video…</p>
          ) : error || !property ? (
            <p className="mt-8 text-body text-error">
              {error ?? "Video not found."}
            </p>
          ) : (
            <>
              <h1 className="mt-4 text-h2 font-bold text-neutral">
                Video Walkthrough
              </h1>
              <p className="mt-1 text-body text-neutral-600">
                {property.bedrooms} Bedroom {propertyTypeLabel(property.propertyType)}
              </p>
              <p className="text-body text-neutral-500">{property.address}</p>

              <div className="mt-6">
                {activeMedia === 0 && property.videoUrls[0] ? (
                  <video
                    key={property.videoUrls[0]}
                    src={property.videoUrls[0]}
                    controls
                    className="h-96 w-full rounded-2xl bg-black object-contain"
                  />
                ) : (
                  <img
                    src={property.photoUrls[activeMedia - 1] || property.photoUrls[0]}
                    alt=""
                    className="h-96 w-full rounded-2xl object-cover"
                  />
                )}

                {thumbnails.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {thumbnails.map((thumb, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveMedia(i)}
                        className={`overflow-hidden rounded-xl border-2 ${
                          activeMedia === i
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={thumb === "video" ? property.photoUrls[0] : thumb}
                          alt=""
                          className="h-20 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Link
                  to={`/property/${id}`}
                  className="text-body font-medium text-primary hover:underline"
                >
                  View full property details →
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
