import { useEffect, useState } from 'react';

// 1024px matches Tailwind's `lg:` breakpoint, so any web components already
// using `lg:` classes internally will visually agree with this switch.
const DESKTOP_BREAKPOINT_QUERY = '(min-width: 1024px)';

/** True when the viewport is desktop-sized. Updates live on resize (e.g. dragging a browser window wider). */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_BREAKPOINT_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}
