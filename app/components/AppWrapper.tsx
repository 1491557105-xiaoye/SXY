'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';
import BackgroundMusic from './BackgroundMusic';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstMountRef = useRef(true);

  useEffect(() => {
    if (!firstMountRef.current) return;
    firstMountRef.current = false;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isHardRefresh = navigation?.type === 'reload';
    if (pathname !== '/' && isHardRefresh) {
      window.location.replace('/#home');
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return <>
    {pathname !== '/' ? <div className="app-content">{children}</div> : <HomeWrapper>{children}</HomeWrapper>}
    <BackgroundMusic />
  </>;
}

function HomeWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={() => setIsVisible(true)}>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <div
        className="app-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        {children}
      </div>
    </>
  );
}
