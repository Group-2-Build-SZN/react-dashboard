import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  MessageCircleQuestionMark,
  PlusSquare,
  User,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";

const links = [
  { label: "Dashboard", to: "/landlord/dashboard", icon: LayoutDashboard },
  { label: "My Properties", to: "/landlord/properties", icon: Heart },
  { label: "Inquiries / Bookings", to: "/landlord/inquiries", icon: MessageCircleQuestionMark },
  { label: "Add Property", to: "/landlord/properties/new", icon: PlusSquare },
  { label: "Profile", to: "/landlord/profile", icon: User },
];

export function LandlordSidebar() {
  const { user } = useAuth();
  const roleLabel =
    user?.role === "agent" ? "Agent" : "Landlord";

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 px-4 py-8">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-body text-neutral-700">
        {roleLabel}
        <ChevronDown size={16} className="text-neutral-400" />
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === "/landlord/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body",
                isActive
                  ? "bg-primary-50 font-medium text-primary"
                  : "text-neutral-600 hover:bg-neutral-50"
              )
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
