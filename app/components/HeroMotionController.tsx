'use client';

import { useEffect } from 'react';

export default function HeroMotionController() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('#home');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let hasLeft = false;
    const play = () => {
      hero.classList.remove('hero-motion-active');
      requestAnimationFrame(() => hero.classList.add('hero-motion-active'));
    };
    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.62)));
      hero.style.setProperty('--hero-copy-opacity', String(1 - progress));
      if (progress > 0.96) hasLeft = true;
      if (hasLeft && progress < 0.06) {
        hasLeft = false;
        play();
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const replay = () => {
      window.setTimeout(() => {
        hero.style.setProperty('--hero-copy-opacity', '1');
        play();
      }, 560);
    };
    play();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('hero-motion-replay', replay);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hero-motion-replay', replay);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
