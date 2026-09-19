'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './LineSidebar.css';

type LineSidebarProps = {
  items: string[];
  meta?: string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  className?: string;
  onItemClick?: (index: number, label: string) => void;
};

export default function LineSidebar({ items, meta = [], accentColor = '#f01800', textColor = '#e3e3e3', markerColor = '#647078', className = '', onItemClick }: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    let moving = false;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const target = Math.max(targetRef.current[index] || 0, activeIndex === index ? 1 : 0);
      const current = currentRef.current[index] || 0;
      const next = current + (target - current) * (1 - Math.exp(-dt / 0.1));
      currentRef.current[index] = Math.abs(target - next) < 0.0015 ? target : next;
      item.style.setProperty('--effect', currentRef.current[index].toFixed(4));
      if (Math.abs(target - currentRef.current[index]) >= 0.0015) moving = true;
    });
    frameRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, [activeIndex]);

  const startFrame = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    lastRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    const pointerY = event.clientY - rect.top;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const distance = Math.abs(pointerY - (item.offsetTop + item.offsetHeight / 2));
      targetRef.current[index] = Math.max(0, 1 - distance / 100);
      targetRef.current[index] = targetRef.current[index] * targetRef.current[index] * (3 - 2 * targetRef.current[index]);
    });
    startFrame();
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onItemClick?.(index, items[index]);
  };

  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, []);

  return <nav className={`line-sidebar ${className}`.trim()} style={{ '--accent-color': accentColor, '--text-color': textColor, '--marker-color': markerColor } as React.CSSProperties}>
    <ul ref={listRef} onPointerMove={handlePointerMove} onPointerLeave={() => { targetRef.current = targetRef.current.map(() => 0); startFrame(); }}>
      {items.map((label, index) => <li key={`${label}-${index}`} ref={(element) => { itemRefs.current[index] = element; }} className={activeIndex === index ? 'is-active' : ''} tabIndex={0} role="link" onClick={() => handleClick(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleClick(index); }}><span className="line-sidebar-marker" aria-hidden="true" /><span className="line-sidebar-copy"><b>{String(index + 1).padStart(2, '0')}</b><strong>{label}</strong>{meta[index] && <small>{meta[index]}</small>}</span></li>)}
    </ul>
  </nav>;
}
