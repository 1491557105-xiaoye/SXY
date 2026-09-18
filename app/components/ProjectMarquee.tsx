'use client';

import { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';

type Row = 'primary' | 'secondary';
type MarqueeItem = { title: string; titleEn: string; image?: string; href: string; label: string };

function MarqueeRow({ items, row, trackRef, onPointerMove, onPointerLeave }: {
  items: MarqueeItem[]; row: Row; trackRef: React.RefObject<HTMLDivElement | null>;
  onPointerMove: (row: Row, event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (row: Row) => void;
}) {
  return (
    <div className={`project-marquee-row-shell project-marquee-row-${row}`} onPointerMove={(event) => onPointerMove(row, event)} onPointerLeave={() => onPointerLeave(row)}>
      <div ref={trackRef} className="project-marquee-row" data-marquee-row={row}>
        {items.map((item, index) => (
          <BorderGlow key={item.href} className={`project-marquee-glow project-marquee-card-${index + 1}`} borderRadius={16}>
            <a className="project-marquee-card" href={item.href}>
              {item.image ? <img src={item.image} alt="" loading="lazy" /> : <div className="project-marquee-placeholder"><span>ASSET<br />TO COME</span></div>}
              <div className="project-marquee-caption"><span>{item.label}</span><strong>{item.title}</strong><small>{item.titleEn}</small></div>
            </a>
          </BorderGlow>
        ))}
      </div>
    </div>
  );
}

export default function ProjectMarquee({ primary, secondary }: { primary: MarqueeItem[]; secondary: MarqueeItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryTrackRef = useRef<HTMLDivElement>(null);
  const secondaryTrackRef = useRef<HTMLDivElement>(null);
  const scrollOffset = useRef<Record<Row, number>>({ primary: -200, secondary: 200 });
  const hoverOffset = useRef<Record<Row, number>>({ primary: 0, secondary: 0 });
  const hoverDirection = useRef<Record<Row, number>>({ primary: 0, secondary: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const primaryTrack = primaryTrackRef.current;
    const secondaryTrack = secondaryTrackRef.current;
    if (!section || !primaryTrack || !secondaryTrack) return;

    const applyTransforms = () => {
      const clampToTrack = (track: HTMLDivElement, position: number) => {
        const viewportWidth = track.parentElement?.clientWidth ?? section.clientWidth;
        const minPosition = Math.min(0, viewportWidth - track.scrollWidth);
        return Math.max(minPosition, Math.min(0, position));
      };
      const primaryPosition = clampToTrack(primaryTrack, scrollOffset.current.primary + hoverOffset.current.primary);
      const secondaryPosition = clampToTrack(secondaryTrack, scrollOffset.current.secondary + hoverOffset.current.secondary);
      primaryTrack.style.transform = `translate3d(${primaryPosition}px,0,0)`;
      secondaryTrack.style.transform = `translate3d(${secondaryPosition}px,0,0)`;
    };
    const updateScrollOffset = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      const primaryViewportWidth = primaryTrack.parentElement?.clientWidth ?? section.clientWidth;
      const secondaryViewportWidth = secondaryTrack.parentElement?.clientWidth ?? section.clientWidth;
      const travelPrimary = Math.max(0, primaryTrack.scrollWidth - primaryViewportWidth);
      const travelSecondary = Math.max(0, secondaryTrack.scrollWidth - secondaryViewportWidth);
      const travelWindow = section.clientHeight + window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / travelWindow));
      // Row one enters from the left and moves right; row two starts at the
      // left edge and moves left. Both stop at their real final card.
      scrollOffset.current.primary = -travelPrimary * (1 - progress);
      scrollOffset.current.secondary = -travelSecondary * progress;
      applyTransforms();
    };
    let scrollFrame = 0;
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; updateScrollOffset(); });
    };
    let hoverFrame = 0;
    const animateHover = () => {
      const { primary: primaryDirection, secondary: secondaryDirection } = hoverDirection.current;
      if (primaryDirection || secondaryDirection) {
        hoverOffset.current.primary += primaryDirection * 3.2;
        hoverOffset.current.secondary += secondaryDirection * 3.2;
        applyTransforms();
      }
      hoverFrame = window.requestAnimationFrame(animateHover);
    };

    updateScrollOffset();
    hoverFrame = window.requestAnimationFrame(animateHover);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(hoverFrame);
    };
  }, []);

  const handlePointerMove = (row: Row, event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const edgeWidth = Math.min(180, rect.width * 0.18);
    const x = event.clientX - rect.left;
    // Hovering at the left edge moves the rail right; hovering at the right
    // edge moves it left, exposing the neighbouring project cards.
    hoverDirection.current[row] = x <= edgeWidth ? 1 : x >= rect.width - edgeWidth ? -1 : 0;
  };
  const handlePointerLeave = (row: Row) => { hoverDirection.current[row] = 0; };

  return (
    <section className="project-marquee" ref={sectionRef} aria-label="项目目录">
      <div className="project-marquee-head"><span>PROJECT INDEX / 01—05</span><span>SCROLL / HOVER TO EXPLORE</span></div>
      <MarqueeRow items={primary} row="primary" trackRef={primaryTrackRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} />
      <MarqueeRow items={secondary} row="secondary" trackRef={secondaryTrackRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} />
      <div className="project-marquee-footer"><span>01—04 / CORE PROJECTS</span><span>05 / OTHER WORKS · SELECTED SUBPROJECTS</span></div>
    </section>
  );
}
