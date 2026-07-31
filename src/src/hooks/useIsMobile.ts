import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_PX = 768;

function getIsMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT_PX;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(getIsMobile());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
