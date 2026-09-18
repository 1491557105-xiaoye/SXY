'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname !== '/') return <div className="app-content">{children}</div>;

  return <HomeWrapper>{children}</HomeWrapper>;
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
