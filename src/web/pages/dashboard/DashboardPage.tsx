import { Heart, MessageCircleQuestionMark, Video, Search, SlidersHorizontal } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Button } from "../../components/ui/Button";
import promoImage from "../../assets/images/ChatGPT Image Jul 14, 2026, 03_48_04 PM 1.png";
import phoneImage from "../../assets/images/ChatGPT Image Jul 15, 2026, 08_57_45 PM 1.png";
import property1 from "../../assets/images/Frame 427318325.png";
import property2 from "../../assets/images/Frame 427318326.png";
import property3 from "../../assets/images/Frame 427318327.png";

const stats = [
  { label: "Saved Properties", value: 24, icon: Heart, iconBg: "bg-secondary-50", iconColor: "text-secondary" },
  { label: "My Inquiries", value: 8, icon: MessageCircleQuestionMark, iconBg: "bg-accent-50", iconColor: "text-accent-600" },
  { label: "Messages", value: 3, icon: Video, iconBg: "bg-primary-50", iconColor: "text-primary" },
  { label: "Recent Searches", value: 6, icon: Search, iconBg: "bg-primary-100", iconColor: "text-primary-700" },
];

const recommended = [
  {
    image: property1,
    title: "3 Bedroom Apartment",
    location: "123 Nza street, Independence layout, Enugu.",
    price: "\u20A62,500,000",
    beds: 3,
    baths: 3,
  },
  {
    image: property2,
    title: "2 Bedroom Apartment",
    location: "123 Dhamija, Trans Ekulu, Enugu.",
    price: "\u20A61,800,000",
    beds: 2,
    baths: 2,
  },
  {
    image: property3,
    title: "1 Bedroom Apartment",
    location: "123 Ben Emeasoba St, Emene, Enugu",
    price: "\u20A6800,000",
    beds: 1,
    baths: 1,
  },
];

const activity = [
  { activity: "Visited a flat in Emene", date: "10am, 18th of July 2026", status: "Completed", tone: "success" },
  { activity: "Saved a property in New Heaven", date: "2am, 14th of July 2026", status: "Successful", tone: "success" },
  { activity: "Reviewed a 2 bedroom apartment in Trans Ekulu", date: "4pm, 12th of July 2026", status: "Pending review", tone: "pending" },
];

export function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-h2 font-bold text-neutral">
        Welcome back, John <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1 text-body text-neutral-500">
        Let's help you find a place.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 p-5">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${s.iconBg} ${s.iconColor}`}
            >
              <s.icon size={18} />
            </span>
            <p className="mt-3 text-small text-neutral-500">{s.label}</p>
            <p className="text-h3 font-bold text-neutral">{s.value}</p>
            <hr className="my-2 border-neutral-100" />
            <a href="#" className="text-small font-medium text-primary">
              View all
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Find your next home</h2>
        <p className="mt-1 text-small text-neutral-500">
          Search verified properties with confidence
        </p>

        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by location, estate or keyword"
              className="w-full rounded-lg border border-neutral-300 py-2.5 pl-11 pr-4 text-body placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button variant="secondary" icon={<SlidersHorizontal size={16} />}>
            Filters
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["Property Type", "Min Price", "Max Price"].map((label) => (
            <button
              key={label}
              type="button"
              className="flex items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-left text-body text-neutral-500"
            >
              {label}
            </button>
          ))}
        </div>

        <Button fullWidth size="lg" icon={<Search size={18} />} className="mt-4">
          Search Properties
        </Button>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-h4 font-bold text-neutral">Recommended for you</h2>
        <a href="#" className="text-body font-medium text-primary">
          View all
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommended.map((p) => (
          <div key={p.title} className="rounded-2xl border border-neutral-200 overflow-hidden">
            <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-h4 font-semibold text-neutral">{p.title}</h3>
              <p className="mt-1 text-small text-neutral-500">{p.location}</p>
              <p className="mt-2 text-h4 font-bold text-primary">
                {p.price}
                <span className="text-small font-normal text-neutral-500">/year</span>
              </p>
              <p className="mt-1 text-small text-neutral-500">
                {p.beds} Bedrooms {p.baths} Bathrooms
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200">
        <table className="w-full text-left">
          <thead className="bg-primary-100">
            <tr>
              <th className="px-5 py-3 text-body font-semibold text-neutral">Activity</th>
              <th className="px-5 py-3 text-body font-semibold text-neutral">Date</th>
              <th className="px-5 py-3 text-body font-semibold text-neutral">Status</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a) => (
              <tr key={a.activity} className="border-t border-neutral-100">
                <td className="px-5 py-4 text-small font-medium text-neutral">{a.activity}</td>
                <td className="px-5 py-4 text-small text-neutral-500">{a.date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-caption font-medium ${
                      a.tone === "success"
                        ? "bg-secondary-50 text-secondary-700"
                        : "bg-accent-50 text-accent-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid grid-cols-1 items-center gap-6 rounded-2xl bg-neutral-50 p-6 sm:grid-cols-2">
        <div className="relative">
          <img src={promoImage} alt="A modern house" className="w-full rounded-xl object-cover" />
          <img
            src={phoneImage}
            alt="Hand holding a phone with the My Ulo app"
            className="absolute -right-4 bottom-0 h-[85%] w-auto drop-shadow-xl"
          />
        </div>
        <div>
          <h3 className="text-h3 font-bold text-primary">List your property on My Ulo</h3>
          <p className="mt-2 text-body text-neutral-500">
            Reach thousands of verified tenants and rent faster.
          </p>
          <Button size="lg" className="mt-4">
            List Property
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
