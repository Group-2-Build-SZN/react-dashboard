import MobileApp from './App';
import DesktopApp from './web/App';
import { useIsDesktop } from './hooks/useIsDesktop';

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
