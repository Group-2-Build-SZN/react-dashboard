import MobileApp from './App';
import DesktopApp from './web/App';
import { useIsDesktop } from './hooks/useIsDesktop';

export default function RootApp() {
  const isDesktop = useIsDesktop();
  return isDesktop ? (
    <div style={{ maxWidth: 'auto 0' }} className="web-root">
      <DesktopApp />
    </div>
  ) : (
    <div style={{ maxWidth: 'auto 0' }} className="mobile-root">
      <MobileApp />
    </div>
  );
}
