import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { cn } from "../../lib/utils";

const settingsLinks = [
  { label: "Profile", to: "/dashboard/settings/profile" },
  { label: "Account", to: "/dashboard/settings/account" },
  { label: "Security", to: "/dashboard/settings/security" },
  { label: "Notifications", to: "/dashboard/settings/notifications" },
];

export function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 sm:flex-row">
        <nav className="flex shrink-0 flex-col gap-1 rounded-2xl bg-primary-50 p-3 sm:w-56">
          {settingsLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg border-l-4 px-4 py-2.5 text-body",
                  isActive
                    ? "border-primary bg-primary-100 font-semibold text-primary"
                    : "border-transparent text-neutral-700 hover:bg-primary-100/50"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </DashboardLayout>
  );
}
