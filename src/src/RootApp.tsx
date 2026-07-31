import MobileApp from './App';
import DesktopApp from './web/App';
import { useIsDesktop } from './hooks/useIsDesktop';

// Mobile and desktop are genuinely different information architectures, not
// the same routes resized — desktop's "/" is a marketing landing page,
// mobile's "/" is the app splash screen; desktop has "/dashboard/settings/*",
// mobile has "/profile" + "/settings". So this switches the WHOLE route
// tree by viewport rather than trying to force route-for-route parity.
// Both trees share the same BrowserRouter/AuthProvider/API layer (wired up
// in main.tsx, one level above this).
export default function RootApp() {
  const isDesktop = useIsDesktop();
  return isDesktop ? (
    <div className="web-root">
      <DesktopApp />
    </div>
  ) : (
    <div className="mobile-root">
      <MobileApp />
    </div>
  );
}
