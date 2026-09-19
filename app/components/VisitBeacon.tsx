'use client';

import { useEffect } from 'react';

// Fire-and-forget page-view beacon. Runs once per page load (including
// sub-pages), sends a random persistent visitor id so unique visitors can be
// counted, plus the referrer so traffic sources can be attributed.
// The visitor's IP / location / visit time are captured server-side from the
// request itself — the browser never reads or sends the IP.
export default function VisitBeacon() {
  useEffect(() => {
    try {
      let vid = window.localStorage.getItem('sv_vid');
      if (!vid) {
        vid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        window.localStorage.setItem('sv_vid', vid);
      }
      const params = new URLSearchParams({
        v: vid,
        p: window.location.pathname,
        r: document.referrer || '',
      });
      fetch('/api/visit?' + params.toString(), {
        method: 'GET',
        cache: 'no-store',
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* storage or network unavailable: ignore */
    }
  }, []);

  return null;
}
