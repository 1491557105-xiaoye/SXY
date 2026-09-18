'use client';

import { useCallback, useRef } from 'react';

type BorderGlowProps = {
  children: React.ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowRadius?: number;
  glowIntensity?: number;
  borderRadius?: number;
  colors?: string[];
};

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 110,
  glowRadius = 34,
  glowIntensity = 1,
  borderRadius = 16,
  colors = ['#ff3b22', '#ffb329', '#ff6847'],
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distanceToEdge = Math.min(x, y, rect.width - x, rect.height - y);
    const proximity = Math.max(0, Math.min(1, 1 - distanceToEdge / edgeSensitivity));
    const angle = (Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180) / Math.PI + 90;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
    card.style.setProperty('--edge-proximity', `${proximity}`);
    card.style.setProperty('--cursor-angle', `${angle}deg`);
  }, [edgeSensitivity]);

  const handlePointerLeave = useCallback(() => {
    cardRef.current?.style.setProperty('--edge-proximity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--border-radius': `${borderRadius}px`,
        '--glow-radius': `${glowRadius}px`,
        '--glow-intensity': glowIntensity,
        '--glow-one': colors[0],
        '--glow-two': colors[1] ?? colors[0],
        '--glow-three': colors[2] ?? colors[0],
      } as React.CSSProperties}
    >
      <span className="border-glow-edge" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
