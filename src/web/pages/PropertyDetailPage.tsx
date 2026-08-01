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
  X,
  Phone,
  Mail,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../components/ui/SocialIcons";
import { getProperty, submitInquiry } from "../../api/properties";
import { apiPropertyToProperty, formatNaira, propertyTypeLabel } from "../../api/adapters";
import { getReviews, type ApiReview } from "../../api/reviews";
import { initSubscription } from "../../api/payments";
import { useAuth } from "../lib/AuthContext";
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
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [nearby, setNearby] = useState<{ type: string; name: string; distance_metres: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [inspectionMessage, setInspectionMessage] = useState(
    "Hi, I'd like to schedule an inspection for this property. Please let me know your availability."
  );
  const [isSubmittingInspection, setIsSubmittingInspection] = useState(false);
  const [inspectionSent, setInspectionSent] = useState(false);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState<{ verified: ApiReview[]; community: ApiReview[] } | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 2 || !id || reviews || reviewsLoading) return;
    let cancelled = false;
    setReviewsLoading(true);
    setReviewsError(null);

    getReviews(id)
      .then((res) => {
        if (cancelled) return;
        setReviews({ verified: res.verifiedResident, community: res.communityTip });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load reviews", err);
        setReviewsError("We couldn't load reviews for this property.");
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, id, reviews, reviewsLoading]);

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

  async function handleUnlockContact() {
    setUnlockError(null);
    setIsUnlocking(true);
    try {
      const { authorization_url } = await initSubscription();
      window.location.href = authorization_url;
    } catch (err) {
      console.error("Failed to start subscription checkout", err);
      setUnlockError("Couldn't start checkout. Please try again.");
      setIsUnlocking(false);
    }
  }

  async function handleSendInspectionRequest() {
    if (!id) return;
    setInspectionError(null);
    setIsSubmittingInspection(true);
    try {
      await submitInquiry(id, inspectionMessage);
      setInspectionSent(true);
    } catch (err) {
      console.error("Failed to send inspection request", err);
      setInspectionError("Couldn't send your request. Please try again.");
    } finally {
      setIsSubmittingInspection(false);
    }
  }

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
              <Link
                to={`/property/${id}/video`}
                className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Video size={14} className="text-primary" />
                Video Walkthrough
              </Link>
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
            {user?.isPremium && property.owner?.phone ? (
              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                <p className="text-small font-medium text-neutral">Contact unlocked</p>
                <a href={`tel:${property.owner.phone}`} className="flex items-center gap-2 text-body text-neutral">
                  <Phone size={16} /> {property.owner.phone}
                </a>
                {property.owner.email && (
                  <a href={`mailto:${property.owner.email}`} className="flex items-center gap-2 text-body text-neutral">
                    <Mail size={16} /> {property.owner.email}
                  </a>
                )}
              </div>
            ) : (
              <Button size="lg" fullWidth onClick={handleUnlockContact} disabled={isUnlocking}>
                {isUnlocking ? "Redirecting…" : "Unlock Contact"}
              </Button>
            )}
            <Button size="lg" variant="outline" fullWidth onClick={() => setIsInspectionOpen(true)}>
              Schedule Inspection
            </Button>
          </div>
          {unlockError && <p className="mt-2 text-small text-red-500">{unlockError}</p>}

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
          ) : activeTab === 2 ? (
            <div className="mt-6">
              {reviewsLoading ? (
                <p className="text-small text-neutral-500">Loading reviews…</p>
              ) : reviewsError ? (
                <p className="text-small text-red-500">{reviewsError}</p>
              ) : !reviews || (reviews.verified.length === 0 && reviews.community.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-body text-neutral-400">
                  No reviews yet for this property.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...reviews.verified, ...reviews.community].map((review) => (
                    <div key={review.id} className="rounded-2xl border border-neutral-200 p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-body font-semibold text-neutral">
                          {review.reviewer_first_name || review.reviewer_last_name
                            ? `${review.reviewer_first_name ?? ""} ${review.reviewer_last_name ?? ""}`.trim()
                            : "Anonymous"}
                        </p>
                        <span className="text-caption font-medium text-neutral-400">
                          {review.reviewType === "verified_resident" ? "Verified Resident" : "Community Tip"}
                        </span>
                      </div>
                      {review.reviewText && (
                        <p className="mt-2 text-small text-neutral-600">{review.reviewText}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-neutral-500">
                        <span>Water: {review.waterRating}/5</span>
                        <span>Power: {review.electricityRating}/5</span>
                        <span>Security: {review.securityRating}/5</span>
                        <span>Roads: {review.roadAccessibilityRating}/5</span>
                        <span>Cleanliness: {review.cleanlinessRating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-body text-neutral-400">
              {tabs[activeTab]} content coming soon.
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isInspectionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsInspectionOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-h4 font-bold text-neutral">Schedule Inspection</h3>
              <button
                onClick={() => setIsInspectionOpen(false)}
                aria-label="Close"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={20} />
              </button>
            </div>

            {inspectionSent ? (
              <div className="mt-4">
                <p className="text-body text-neutral-600">
                  Your request has been sent to the property owner. They'll reach out to confirm a
                  time.
                </p>
                <Button
                  className="mt-4"
                  fullWidth
                  onClick={() => {
                    setIsInspectionOpen(false);
                    setInspectionSent(false);
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-small text-neutral-500">
                  There's no dedicated booking calendar yet — this sends your request directly to
                  the owner as an inquiry.
                </p>
                <textarea
                  value={inspectionMessage}
                  onChange={(e) => setInspectionMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="mt-3 w-full rounded-lg border border-neutral-300 p-3 text-body text-neutral-700"
                />
                {inspectionError && (
                  <p className="mt-2 text-small text-red-500">{inspectionError}</p>
                )}
                <Button
                  className="mt-3"
                  fullWidth
                  onClick={handleSendInspectionRequest}
                  disabled={isSubmittingInspection || !inspectionMessage.trim()}
                >
                  {isSubmittingInspection ? "Sending…" : "Send Request"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
