'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BorderGlow from './BorderGlow';

type Row = 'primary' | 'secondary';
type MarqueeItem = { title: string; titleEn: string; image?: string; href: string; label: string };

function MarqueeRow({ items, row, trackRef, sliderRef, onPointerMove, onPointerLeave, onSliderChange }: {
  items: MarqueeItem[]; row: Row; trackRef: React.RefObject<HTMLDivElement | null>; sliderRef: React.RefObject<HTMLInputElement | null>;
  onPointerMove: (row: Row, event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (row: Row) => void;
  onSliderChange: (row: Row, event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const router = useRouter();
  const handleCardClick = (event: React.MouseEvent, href: string) => {
    // Middle-click / modifier-click / right-click: let the browser handle it
    // natively (open in new tab, etc.). Otherwise do a client-side navigation
    // so the background music keeps playing across the route change.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try { sessionStorage.setItem('bgm-continue', '1'); } catch {}
    router.push(href);
  };
  return (
    <>
      <div className={`project-marquee-row-shell project-marquee-row-${row}`} onPointerMove={(event) => onPointerMove(row, event)} onPointerLeave={() => onPointerLeave(row)}>
        <div ref={trackRef} className="project-marquee-row" data-marquee-row={row}>
          {items.map((item, index) => (
            <BorderGlow key={item.href} className={`project-marquee-glow project-marquee-card-${index + 1}`} borderRadius={16}>
              <a className="project-marquee-card" href={item.href} onClick={(event) => handleCardClick(event, item.href)}>
                {item.image ? <img src={item.image} alt="" loading="lazy" /> : <div className="project-marquee-placeholder"><span>ASSET<br />TO COME</span></div>}
                <div className="project-marquee-caption"><span>{item.label}</span><strong>{item.title}</strong><small>{item.titleEn}</small></div>
              </a>
            </BorderGlow>
          ))}
        </div>
      </div>
      <div className="project-marquee-slider">
        <span aria-hidden="true">←</span>
        <input ref={sliderRef} type="range" min="0" max="1000" defaultValue="0" aria-label={row === 'primary' ? '滑动浏览核心项目' : '滑动浏览其他作品'} onChange={(event) => onSliderChange(row, event)} />
        <span aria-hidden="true">→</span>
      </div>
    </>
  );
}

export default function ProjectMarquee({ primary, secondary }: { primary: MarqueeItem[]; secondary: MarqueeItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryTrackRef = useRef<HTMLDivElement>(null);
  const secondaryTrackRef = useRef<HTMLDivElement>(null);
  const primarySliderRef = useRef<HTMLInputElement>(null);
  const secondarySliderRef = useRef<HTMLInputElement>(null);
  const applyTransformsRef = useRef<() => void>(() => {});
  const scrollOffset = useRef<Record<Row, number>>({ primary: -200, secondary: 200 });
  const hoverOffset = useRef<Record<Row, number>>({ primary: 0, secondary: 0 });
  const hoverDirection = useRef<Record<Row, number>>({ primary: 0, secondary: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const primaryTrack = primaryTrackRef.current;
    const secondaryTrack = secondaryTrackRef.current;
    if (!section || !primaryTrack || !secondaryTrack) return;

    const applyTransforms = () => {
      const setTrackPosition = (row: Row, track: HTMLDivElement, slider: HTMLInputElement | null) => {
        const viewportWidth = track.parentElement?.clientWidth ?? section.clientWidth;
        const travel = Math.max(0, track.scrollWidth - viewportWidth);
        const position = Math.max(-travel, Math.min(0, scrollOffset.current[row] + hoverOffset.current[row]));
        track.style.transform = `translate3d(${position}px,0,0)`;
        if (slider) slider.value = String(travel ? Math.round((-position / travel) * 1000) : 0);
      };
      setTrackPosition('primary', primaryTrack, primarySliderRef.current);
      setTrackPosition('secondary', secondaryTrack, secondarySliderRef.current);
    };
    applyTransformsRef.current = applyTransforms;
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
      applyTransformsRef.current = () => {};
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
  const handleSliderChange = (row: Row, event: React.ChangeEvent<HTMLInputElement>) => {
    const track = row === 'primary' ? primaryTrackRef.current : secondaryTrackRef.current;
    if (!track) return;
    const travel = Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? 0));
    scrollOffset.current[row] = -travel * (Number(event.currentTarget.value) / 1000);
    hoverOffset.current[row] = 0;
    hoverDirection.current[row] = 0;
    applyTransformsRef.current();
  };

  return (
    <section className="project-marquee" ref={sectionRef} aria-label="项目目录">
      <div className="project-marquee-head"><span>PROJECT INDEX / 01—05</span><span>SCROLL / HOVER TO EXPLORE</span></div>
      <MarqueeRow items={primary} row="primary" trackRef={primaryTrackRef} sliderRef={primarySliderRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onSliderChange={handleSliderChange} />
      <MarqueeRow items={secondary} row="secondary" trackRef={secondaryTrackRef} sliderRef={secondarySliderRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onSliderChange={handleSliderChange} />
      <div className="project-marquee-footer"><span>01—04 / CORE PROJECTS</span><span>05 / OTHER WORKS · SELECTED SUBPROJECTS</span></div>
    </section>
  );
}
