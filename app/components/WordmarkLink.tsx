'use client';

import { useRouter } from 'next/navigation';

export default function WordmarkLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <a
      href="/#home"
      className={className}
      onClick={(event) => {
        // Let middle-click / modifier-click fall back to native behavior
        // (open in new tab, etc.). Otherwise do client-side navigation so the
        // loading screen on the homepage is skipped and music keeps playing.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.push('/#home');
      }}
    >
      {children}
    </a>
  );
}
