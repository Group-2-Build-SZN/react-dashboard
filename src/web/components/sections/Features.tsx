import { ShieldCheck, Video, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: ShieldCheck,
    iconBg: "bg-secondary-50",
    iconColor: "text-secondary",
    title: "Verified Listings",
    description: "Every property is authenticated and thoroughly verified.",
    href: "/search?verified=true",
  },
  {
    icon: Video,
    iconBg: "bg-primary-50",
    iconColor: "text-primary",
    title: "Video Walkthroughs",
    description: "See real conditions before you visit with our video walkthroughs.",
    href: "/search",
  },
  {
    icon: MapPin,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-700",
    title: "Smart Maps",
    description: "Explore neighborhoods with interactive maps and insights.",
    href: "/map",
  },
  {
    icon: Star,
    iconBg: "bg-accent-50",
    iconColor: "text-accent-600",
    title: "Community Reviews",
    description: "Read honest reviews from real tenants about real properties.",
    href: null,
  },
];

export function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold text-neutral">
            Everything you need for a{" "}
            <span className="text-primary">smarter</span> rental experience
          </h2>
          <p className="mt-3 text-body text-neutral-500">
            We bring transparency, technology, and trust to the Nigerian
            rental market.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const content = (
              <>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor}`}
                >
                  <feature.icon size={22} />
                </span>
                <h3 className="mt-5 text-h4 font-semibold text-neutral">
                  {feature.title}
                </h3>
                <p className="mt-2 text-body text-neutral-500">
                  {feature.description}
                </p>
              </>
            );

            const className =
              "rounded-2xl border border-neutral-200 p-6 transition-shadow hover:shadow-md";

            return feature.href ? (
              <Link key={feature.title} to={feature.href} className={className}>
                {content}
              </Link>
            ) : (
              <div key={feature.title} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
