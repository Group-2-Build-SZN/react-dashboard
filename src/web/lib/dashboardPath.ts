import type { ApiUser } from "../../api/types";

export function dashboardPathFor(user: ApiUser | null | undefined): string {
  if (user?.role === "landlord" || user?.role === "agent") {
    return "/landlord/dashboard";
  }
  return "/dashboard";
}
