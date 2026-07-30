import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyCard } from "../ui/PropertyCard";
import img1 from "../../assets/images/Frame 427318325.png";
import img2 from "../../assets/images/Frame 427318326.png";
import img3 from "../../assets/images/Frame 427318327.png";
import img4 from "../../assets/images/Rectangle 18.png";

const properties = [
  {
    image: img1,
    title: "3 Bedroom Duplex",
    location: "Chevron Drive, Lekki",
    price: "\u20A64,500,000",
    beds: 3,
    baths: 3,
    type: "Duplex",
  },
  {
    image: img2,
    title: "Mini Flat",
    location: "New GRA, Enugu",
    price: "\u20A6650,000",
    beds: 1,
    baths: 1,
    type: "Mini Flat",
  },
  {
    image: img3,
    title: "2 Bedroom Apartment",
    location: "Jahi, Abuja",
    price: "\u20A62,500,000",
    beds: 2,
    baths: 2,
    type: "Apartment",
  },
  {
    image: img4,
    title: "4 Bedroom Terrace",
    location: "Ikoyi, Lagos",
    price: "\u20A66,500,000",
    beds: 4,
    baths: 4,
    type: "Terrace",
  },
];

export function FeaturedProperties() {
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
            to="/#properties"
            className="hidden items-center gap-1 text-body font-medium text-primary sm:flex"
          >
            View all properties <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.title} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}
