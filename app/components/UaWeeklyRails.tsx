'use client';

import { useEffect, useRef } from 'react';

type UaItem = { src: string; alt: string; caption?: string };
type UaWeek = { label: string; items: UaItem[] };

export default function UaWeeklyRails({ items }: { items: UaItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollOffsetRef = useRef<number[]>([]);
  const hoverOffsetRef = useRef<number[]>([]);
  const hoverDirectionRef = useRef<number[]>([]);
  const weeks = items.reduce<UaWeek[]>((groups, item) => {
    const label = item.caption?.match(/^(\d+\.\d+[-–]\d+\.\d+)/)?.[1] || 'UA TEST ASSETS';
    const existing = groups.find((group) => group.label === label);
    if (existing) existing.items.push(item);
    else groups.push({ label, items: [item] });
    return groups;
  }, []);
  const rows = Array.from({ length: Math.ceil(weeks.length / 2) }, (_, index) => weeks.slice(index * 2, index * 2 + 2));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const apply = () => {
      railsRef.current.forEach((rail, index) => {
        if (!rail) return;
        const viewport = rail.parentElement?.clientWidth || 0;
        const travel = Math.max(0, rail.scrollWidth - viewport);
        const position = Math.max(-travel, Math.min(0, (scrollOffsetRef.current[index] || 0) + (hoverOffsetRef.current[index] || 0)));
        rail.style.transform = `translate3d(${position}px,0,0)`;
      });
    };
    const update = () => {
      railsRef.current.forEach((rail, index) => {
        if (!rail) return;
        const viewport = rail.parentElement?.clientWidth || 0;
        const travel = Math.max(0, rail.scrollWidth - viewport);
        const progress = Math.max(0, Math.min(1, (window.innerHeight - section.getBoundingClientRect().top) / (section.clientHeight + window.innerHeight)));
        scrollOffsetRef.current[index] = -travel * (index % 2 ? 1 - progress : progress);
      });
      apply();
    };
    let frame = 0;
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    let hoverFrame = 0;
    const animateHover = () => {
      let changed = false;
      hoverDirectionRef.current.forEach((direction, index) => {
        if (!direction) return;
        hoverOffsetRef.current[index] = (hoverOffsetRef.current[index] || 0) + direction * 3;
        changed = true;
      });
      if (changed) apply();
      hoverFrame = requestAnimationFrame(animateHover);
    };
    update();
    hoverFrame = requestAnimationFrame(animateHover);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); cancelAnimationFrame(hoverFrame); };
  }, [rows.length]);

  const handlePointerMove = (weekIndex: number, event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const edge = Math.min(130, rect.width * .18);
    const x = event.clientX - rect.left;
    hoverDirectionRef.current[weekIndex] = x < edge ? 1 : x > rect.width - edge ? -1 : 0;
  };

  return <div ref={sectionRef} className="ua-weekly-rails">
    {rows.map((row, rowIndex) => <section className="ua-week" key={row.map((week) => week.label).join('-')}>
      <div className="ua-week-heading"><strong>WEEKS {String(rowIndex * 2 + 1).padStart(2, '0')}—{String(Math.min(rowIndex * 2 + 2, weeks.length)).padStart(2, '0')}</strong><span>{row.reduce((total, week) => total + week.items.length, 0)} ASSETS</span></div>
      <div className="ua-rail-shell" onPointerMove={(event) => handlePointerMove(rowIndex, event)} onPointerLeave={() => { hoverDirectionRef.current[rowIndex] = 0; }}>
        <div className="ua-rail" ref={(node) => { railsRef.current[rowIndex] = node; }}>
          {row.map((week, weekIndex) => <div className="ua-week-set" key={week.label}><span>{week.label} · {week.items.length} ASSETS</span>{week.items.map((item) => <figure className="ua-rail-card" key={item.src}>
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>)}</div>)}
        </div>
      </div>
    </section>)}
  </div>;
}
