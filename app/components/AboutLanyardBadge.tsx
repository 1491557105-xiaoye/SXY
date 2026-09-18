'use client';

import dynamic from 'next/dynamic';
import './lanyard/Lanyard.css';

const Lanyard = dynamic(() => import('./lanyard/Lanyard'), {
  ssr: false,
  loading: () => <div className="lanyard-loading">LOADING IDENTITY…</div>
});

export default function AboutLanyardBadge() {
  return (
    <div className="about-badge-stage">
      <div className="about-lanyard-drop" aria-label="可拖拽的个人胸牌">
        <Lanyard
          position={[0, 0, 23]}
          gravity={[0, -38, 0]}
          fov={12}
          frontImage="/media/lanyard/about-card-front.svg"
          backImage="/media/lanyard/about-card-back.svg"
          lanyardImage="/media/lanyard/lanyard.webp"
          imageFit="cover"
          lanyardWidth={1.18}
        />
      </div>
      <span className="about-badge-tip">DRAG THE BADGE</span>
    </div>
  );
}
