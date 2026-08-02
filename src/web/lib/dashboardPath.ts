import type { ApiUser } from "../../api/types";

// Callers should check for an incomplete profile (no firstName / no role)
// themselves and send those to /choose-user-type — this only decides
// between the two dashboards for a user who has actually finished
// onboarding. See GoogleSignInButton.tsx and CheckEmail.tsx.
export function dashboardPathFor(user: ApiUser | null | undefined): string {
  if (user?.role === "landlord" || user?.role === "agent") {
    return "/landlord/dashboard";
  }
  return "/dashboard";
}
