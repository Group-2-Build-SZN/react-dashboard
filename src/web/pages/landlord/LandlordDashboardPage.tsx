import { Link } from "react-router-dom";
import { Heart, MessageCircleQuestionMark, Video, Search } from "lucide-react";
import { LandlordLayout } from "../../components/landlord/LandlordLayout";
import { useAuth } from "../../lib/AuthContext";

const MOCK_STATS = [
  { label: "Total Properties", value: 12, delta: "+2 this month", icon: Heart, iconBg: "bg-secondary-50", iconColor: "text-secondary" },
  { label: "Active Listings", value: 8, delta: "+1 this week", icon: MessageCircleQuestionMark, iconBg: "bg-accent-50", iconColor: "text-accent-600" },
  { label: "Total Videos", value: 1248, delta: "1,248 this week", icon: Video, iconBg: "bg-primary-50", iconColor: "text-primary" },
  { label: "Recent Searches", value: 5, delta: "+5 this week", icon: Search, iconBg: "bg-primary-50", iconColor: "text-primary" },
];

const MOCK_INQUIRIES = [
  { name: "Chinedu Okafor", note: "Interested in 2 bedroom apartment", time: "2hr ago" },
  { name: "Amaka Nwaosu", note: "Interested in self-con", time: "10m ago" },
  { name: "Daniel Yusuf", note: "Interested in 3 bedroom duplex", time: "2hr ago" },
];

const MOCK_TOP_PROPERTY = {
  title: "2 Bedroom Apartment",
  location: "Independence Layout, Enugu",
  views: 532,
  properties: 18,
};

const MOCK_PROPERTIES = [
  { title: "3 Bedroom Apartment", location: "123 Nza street, Independence layout, Enugu", price: "₦2,500,000/year", beds: 3, baths: 3 },
  { title: "2 Bedroom Apartment", location: "123 Chamija, Trans Ekulu, Enugu.", price: "₦1,800,000/year", beds: 2, baths: 2 },
  { title: "1 Bedroom Apartment", location: "123 Ben Emeasoba St, Emene, Enugu", price: "₦800,000/year", beds: 1, baths: 1 },
];

export function LandlordDashboardPage() {
  const { user } = useAuth();

  return (
    <LandlordLayout>
      <h1 className="text-h2 font-bold text-neutral">
        Welcome back, {user?.firstName ?? "there"} 👋
      </h1>
      <p className="mt-1 text-body text-neutral-500">
        Let's help you find a place.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-200 p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={18} />
            </span>
            <p className="mt-3 text-body text-neutral-500">{stat.label}</p>
            <p className="text-h3 font-bold text-neutral">{stat.value.toLocaleString()}</p>
            <p className="mt-1 text-small text-secondary">{stat.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-bold text-neutral">Recent Inquiries</h2>
            <Link to="/landlord/inquiries" className="text-small font-medium text-primary">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {MOCK_INQUIRIES.map((inq) => (
              <div key={inq.name} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  {inq.name[0]}
                </span>
                <div className="flex-1">
                  <p className="text-body font-medium text-neutral">{inq.name}</p>
                  <p className="text-small text-neutral-500">{inq.note}</p>
                </div>
                <span className="text-caption text-neutral-400">{inq.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-h4 font-bold text-neutral">Top Performing property</h2>
          <div className="mt-4 flex gap-4">
            <div className="h-20 w-24 flex-shrink-0 rounded-xl bg-neutral-100" />
            <div className="flex-1">
              <p className="text-body font-semibold text-neutral">{MOCK_TOP_PROPERTY.title}</p>
              <p className="text-small text-neutral-500">{MOCK_TOP_PROPERTY.location}</p>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="text-caption text-neutral-400">Views</p>
                  <p className="text-body font-semibold text-neutral">{MOCK_TOP_PROPERTY.views}</p>
                </div>
                <div>
                  <p className="text-caption text-neutral-400">Properties</p>
                  <p className="text-body font-semibold text-neutral">{MOCK_TOP_PROPERTY.properties}</p>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/landlord/properties"
            className="mt-4 block w-full rounded-lg border border-neutral-200 py-2 text-center text-small font-medium text-neutral-700 hover:bg-neutral-50"
          >
            View Performance
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h4 font-bold text-neutral">Your properties</h2>
          <Link to="/landlord/properties" className="text-small font-medium text-primary">
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROPERTIES.map((p) => (
            <div key={p.title} className="overflow-hidden rounded-2xl border border-neutral-200">
              <div className="h-40 bg-neutral-100" />
              <div className="p-4">
                <h3 className="text-h4 font-semibold text-neutral">{p.title}</h3>
                <p className="mt-1 text-small text-neutral-500">{p.location}</p>
                <p className="mt-2 text-h4 font-bold text-primary">{p.price}</p>
                <div className="mt-3 flex gap-4 text-small text-neutral-500">
                  <span>{p.beds} Bedrooms</span>
                  <span>{p.baths} Bathrooms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandlordLayout>
  );
}
