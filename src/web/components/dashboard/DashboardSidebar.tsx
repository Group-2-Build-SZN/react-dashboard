import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  MessageCircleQuestionMark,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

const mainLinks = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Saved Properties", to: "/dashboard/saved", icon: Heart },
  { label: "My Inquiries", to: "/dashboard/inquiries", icon: MessageCircleQuestionMark },
];

const settingsLinks = [
  { label: "Profile", to: "/dashboard/settings/profile" },
  { label: "Account", to: "/dashboard/settings/account" },
  { label: "Security", to: "/dashboard/settings/security" },
  { label: "Notifications", to: "/dashboard/settings/notifications" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const inSettings = location.pathname.startsWith("/dashboard/settings");

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 px-4 py-8">
      <nav className="flex flex-col gap-1">
        {mainLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
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

        <NavLink
          to="/dashboard/settings/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body",
            inSettings
              ? "bg-primary-50 font-medium text-primary"
              : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      {inSettings && (
        <nav className="mt-3 ml-3 flex flex-col gap-1 border-l border-neutral-200 pl-3">
          {settingsLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-body",
                  isActive
                    ? "bg-primary-50 font-medium text-primary"
                    : "text-neutral-600 hover:bg-neutral-50"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </aside>
  );
}
