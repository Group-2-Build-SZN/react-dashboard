import type { ReactNode } from "react";
import { DashboardNavbar } from "../dashboard/DashboardNavbar";
import { LandlordSidebar } from "./LandlordSidebar";

export function LandlordLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <LandlordSidebar />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
