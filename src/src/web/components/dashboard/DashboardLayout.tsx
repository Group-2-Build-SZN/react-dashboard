import type { ReactNode } from "react";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
