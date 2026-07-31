import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ShieldCheck,
  Video,
  BedDouble,
  Bath,
  Sofa,
  Ruler,
  MapPin,
  Link2,
  CircleCheckBig,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../components/ui/SocialIcons";
import { getProperty } from "../../api/properties";
import { apiPropertyToProperty, formatNaira, propertyTypeLabel } from "../../api/adapters";
import type { Property } from "../../types";

import mainImage from "../assets/images/Rectangle 3 (3).png";
import mapImage from "../assets/images/Rectangle 52.png";

const FALLBACK_IMAGE = mainImage;

const tabs = ["Overview", "Amenities", "Reviews", "Location", "Similar Properties", "Nearby"];

const aboutChecklist = [
  "All rooms ensuite",
  "Fitted kitchen with cabinets",
  "24/7 security",
  "24/7 electricity",
  "Ample packing space",
  "Good road network",
];

const verifiedChecklist = [
  "Property documents verified",
  "Agent identity verified",
  "Video walkthrough verified",
  "Location verified on map",
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "Trusted & Verified",
    description: "Every property is authenticated and thoroughly verified.",
  },
  {
    icon: Video,
    title: "Video Before You Go",
    description: "See real conditions before you visit with our video walkthroughs.",
  },
  {
    icon: MapPin,
    title: "Know Your Environment",
    description: "Explore neighborhoods with interactive maps and insights.",
  },
];

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [nearby, setNearby] = useState<{ type: string; name: string; distance_metres: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getProperty(id)
      .then((detail) => {
        if (cancelled) return;
        setProperty(apiPropertyToProperty(detail));
        setNearby(detail.trekCheck ?? []);
        setActiveImage(0);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load property", err);
        setError("We couldn't load this property. It may have been removed.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const gallery = property?.photoUrls.length ? property.photoUrls : [FALLBACK_IMAGE];

  const propertyInfo = property
    ? [
        { label: "Property Type", value: propertyTypeLabel(property.propertyType) },
        { label: "Purpose", value: property.listingCategory === "for_rent" ? "For Rent" : "For Sale" },
        { label: "Bedrooms", value: String(property.bedrooms) },
        { label: "Bathrooms", value: String(property.bathrooms) },
        { label: "Availability", value: property.isVerified ? "Verified Listing" : "Unverified Listing" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center text-body text-neutral-500">
            Loading property…
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <p className="text-body text-neutral-500">{error ?? "Property not found."}</p>
            <Link to="/search" className="mt-4 inline-block text-body font-medium text-primary">
              Back to search results
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link
            to="/search"
            className="flex items-center gap-1 text-body text-neutral-500 hover:text-neutral-700"
          >
            <ChevronLeft size={16} />
            Back to search results
          </Link>

          <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-h2 font-bold text-neutral">{property.listingTitle}</h1>
              <p className="mt-1 text-body text-neutral-500">{property.address}</p>
            </div>
            <p className="text-h3 font-bold text-primary">
              {formatNaira(property.price)}
              <span className="text-small font-normal text-neutral-500">/{property.pricePeriod}</span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            {property.isVerified && (
              <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption font-medium text-neutral-700">
                <ShieldCheck size={14} className="text-secondary" />
                Verified Property
              </span>
            )}
            {property.videoUrls.length > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption font-medium text-neutral-700">
                <Video size={14} className="text-primary" />
                Video Walkthrough
              </span>
            )}
          </div>

          <div className="mt-6">
            <img
              src={gallery[activeImage]}
              alt={property.listingTitle}
              className="h-96 w-full rounded-2xl object-cover"
            />
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden rounded-xl border-2 ${
                      activeImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-body text-neutral-600">
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} /> {property.bedrooms} Bedrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={16} /> {property.bathrooms} Bathrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Sofa size={16} /> {propertyTypeLabel(property.propertyType)}
            </span>
            {property.features.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Ruler size={16} /> {property.features.length} amenities
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" fullWidth>
              Unlock Contact
            </Button>
            <Button size="lg" variant="outline" fullWidth>
              Schedule Inspection
            </Button>
          </div>

          <div className="mt-8 flex gap-6 overflow-x-auto border-b border-neutral-200">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap border-b-2 pb-3 text-body ${
                  activeTab === i
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-neutral-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h2 className="text-h4 font-bold text-neutral">About this property</h2>
                  <p className="mt-2 text-body text-neutral-500">
                    {property.description || "No description provided for this property."}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {aboutChecklist.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-2 text-small text-neutral-600"
                      >
                        <CircleCheckBig size={14} className="text-secondary" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="text-body font-semibold text-neutral">
                      Property Information
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {propertyInfo.map((row) => (
                        <div key={row.label} className="flex justify-between text-small">
                          <span className="text-neutral-500">{row.label}</span>
                          <span className="font-medium text-neutral">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="text-body font-semibold text-primary">
                      Verified by My Ulo
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {verifiedChecklist.map((item) => (
                        <span
                          key={item}
                          className="flex items-center gap-2 text-small text-neutral-600"
                        >
                          <CircleCheckBig size={14} className="text-secondary" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="text-body font-semibold text-neutral">
                      Share this property
                    </h3>
                    <div className="mt-3 flex gap-2">
                      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500">
                        <Link2 size={16} />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white">
                        <FacebookIcon size={16} />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DA1F2] text-white">
                        <TwitterIcon size={16} />
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                        <WhatsappIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-h4 font-bold text-neutral">Location</h2>
                <p className="text-small text-neutral-500">{property.address}</p>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <img
                    src={mapImage}
                    alt={`Map showing ${property.listingTitle}`}
                    className="h-72 w-full rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-body font-semibold text-neutral">
                      What's around?
                    </h3>
                    <div className="mt-3 flex flex-col gap-3">
                      {nearby.length === 0 ? (
                        <p className="text-small text-neutral-400">No nearby amenities found yet.</p>
                      ) : (
                        nearby.map((place, i) => (
                          <div
                            key={`${place.name}-${i}`}
                            className="flex items-center justify-between text-small"
                          >
                            <span className="flex items-center gap-2 text-neutral-600">
                              <MapPin size={14} className="text-neutral-400" />
                              {place.name}
                            </span>
                            <span className="text-neutral-400">
                              {(place.distance_metres / 1000).toFixed(1)} km
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {trustBadges.map((badge) => (
                  <div key={badge.title} className="rounded-2xl border border-neutral-200 p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <badge.icon size={20} />
                    </span>
                    <h3 className="mt-3 text-body font-semibold text-neutral">
                      {badge.title}
                    </h3>
                    <p className="mt-1 text-small text-neutral-500">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-body text-neutral-400">
              {tabs[activeTab]} content coming soon.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
