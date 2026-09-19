'use client';

import { useRouter } from 'next/navigation';

export default function NextProjectLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        try { sessionStorage.setItem('bgm-continue', '1'); } catch {}
        router.push(href);
      }}
    >
      {children}
    </a>
  );
}
