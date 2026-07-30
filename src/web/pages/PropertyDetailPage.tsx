import { useState } from "react";
import { Link } from "react-router-dom";
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

import mainImage from "../assets/images/Rectangle 3 (3).png";
import thumbBedroom from "../assets/images/Rectangle 4.png";
import thumbKitchen from "../assets/images/Rectangle 5.png";
import thumbBathroom from "../assets/images/Rectangle 6.png";
import mapImage from "../assets/images/Rectangle 52.png";

const gallery = [mainImage, thumbBedroom, thumbKitchen, thumbBathroom];

const tabs = ["Overview", "Amenities", "Reviews (120)", "Location", "Similar Properties", "Nearby"];

const aboutChecklist = [
  "All rooms ensuite",
  "Fitted kitchen with cabinets",
  "24/7 security",
  "24/7 electricity",
  "Ample packing space",
  "Good road network",
];

const propertyInfo = [
  { label: "Property ID", value: "MU-LEK-23456" },
  { label: "Property Type", value: "Apartment" },
  { label: "Purpose", value: "For Rent" },
  { label: "Furnishing", value: "Semi-Furnishing" },
  { label: "Tenure", value: "1 Year Minimum" },
  { label: "Availability", value: "Available" },
  { label: "Added on", value: "May 20, 2024" },
];

const verifiedChecklist = [
  "Property documents verified",
  "Agent identity verified",
  "Video walkthrough verified",
  "Location verified on map",
];

const nearby = [
  { name: "Roban Store", distance: "1.2 km" },
  { name: "Roots Restaurant", distance: "2.8 km" },
  { name: "Unity Park", distance: "3.5 km" },
  { name: "The Base Event Center", distance: "1.0 km" },
  { name: "Anns Place", distance: "0.8 km" },
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
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

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
              <h1 className="text-h2 font-bold text-neutral">2 Bedroom Apartment</h1>
              <p className="mt-1 text-body text-neutral-500">Independence Layout, Enugu</p>
            </div>
            <p className="text-h3 font-bold text-primary">
              ₦2,500,000<span className="text-small font-normal text-neutral-500">/year</span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption font-medium text-neutral-700">
              <ShieldCheck size={14} className="text-secondary" />
              Verified Property
            </span>
            <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-caption font-medium text-neutral-700">
              <Video size={14} className="text-primary" />
              Video Walkthrough
            </span>
          </div>

          <div className="mt-6">
            <img
              src={gallery[activeImage]}
              alt="2 Bedroom Apartment"
              className="h-96 w-full rounded-2xl object-cover"
            />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    activeImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-body text-neutral-600">
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} /> 2 Bedrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={16} /> 2 Bathrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Sofa size={16} /> 1 Living Room
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler size={16} /> 120m²
            </span>
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
                    Spacious 2 bedroom apartment with modern fittings in a
                    secure estate. All rooms ensuite with a fitted kitchen,
                    ample packing space and 24/7 electricity.
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
                <p className="text-small text-neutral-500">Independence Layout, Enugu</p>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <img
                    src={mapImage}
                    alt="Map showing the property in New Haven, Enugu"
                    className="h-72 w-full rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-body font-semibold text-neutral">
                      What's around?
                    </h3>
                    <div className="mt-3 flex flex-col gap-3">
                      {nearby.map((place) => (
                        <div
                          key={place.name}
                          className="flex items-center justify-between text-small"
                        >
                          <span className="flex items-center gap-2 text-neutral-600">
                            <MapPin size={14} className="text-neutral-400" />
                            {place.name}
                          </span>
                          <span className="text-neutral-400">{place.distance}</span>
                        </div>
                      ))}
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
