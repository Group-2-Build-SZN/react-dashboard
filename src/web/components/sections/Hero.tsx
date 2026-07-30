import { Search, FileText, ShieldCheck, CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import heroImage from "../../assets/images/Rectangle 3 (2).png";

const stats = [
  { label: "Verified Properties", value: "10K+" },
  { label: "Happy Tenants", value: "5K+" },
  { label: "Cities Covered", value: "50+" },
  { label: "Verified Listings", value: "100%" },
];

export function Hero() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-caption font-medium text-secondary-700">
            <CircleCheckBig size={14} />
            Trusted by thousands of Nigerians
          </span>

          <h1 className="mt-5 text-h1 font-bold leading-tight text-neutral">
            Know before you <span className="text-primary">go.</span>
          </h1>

          <p className="mt-4 max-w-md text-body text-neutral-500">
            My Ulo helps you find verified properties, real neighborhood
            insights, and trustworthy landlords - all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/search" className="w-full sm:w-auto">
              <Button size="lg" icon={<Search size={18} />} fullWidth>
                Find a Home
              </Button>
            </Link>
            <Button size="lg" variant="secondary" icon={<FileText size={18} />}>
              List of Property
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-h4 font-bold text-neutral">{stat.value}</p>
                <p className="text-small text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src={heroImage}
            alt="Verified modern property in Lekki, Lagos"
            className="w-full rounded-2xl object-cover shadow-lg"
          />

          <div className="absolute left-[4%] top-[13%] flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-50 text-secondary">
              <ShieldCheck size={14} />
            </span>
            <div>
              <p className="text-caption font-semibold text-neutral">
                Verified Property
              </p>
              <p className="text-caption text-neutral-500">ID: MU-LEK-23456</p>
            </div>
          </div>

          <div className="absolute bottom-[14%] left-0 w-[38%] min-w-[240px] rounded-xl bg-white px-4 py-3 shadow-md">
            <p className="text-small font-semibold text-neutral">
              Lekki, Phase 1, Lagos
            </p>
            <p className="text-caption text-accent-600">★★★★★ 4.8 (120 reviews)</p>
          </div>

          <div className="absolute bottom-[5%] right-[4%] flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-50 text-secondary">
              <ShieldCheck size={14} />
            </span>
            <div>
              <p className="text-caption font-semibold text-neutral">
                Safe Neighborhood
              </p>
              <p className="text-caption text-neutral-500">Low crime rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
