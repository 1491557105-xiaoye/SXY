'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import './Lanyard.css';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => <div className="lanyard-loading">LOADING IDENTITY…</div>
});

export default function HeroLanyard() {
  const [dropKey, setDropKey] = useState(1);

  useEffect(() => {
    const restartDrop = () => setDropKey((current) => current + 1);
    window.addEventListener('hero-lanyard-drop', restartDrop);
    return () => window.removeEventListener('hero-lanyard-drop', restartDrop);
  }, []);

  return (
    <div className="hero-lanyard-layer" aria-hidden="true">
      <motion.div
        key={dropKey}
        className="hero-lanyard-drop"
        initial={{ y: '-30%', rotate: -5, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ delay: dropKey === 1 ? 3.1 : 0, duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <Lanyard
          position={[0, 0, 28]}
          gravity={[0, -38, 0]}
          fov={16}
          frontImage="/media/lanyard/card-front-new.webp"
          backImage="/media/lanyard/card-back.svg"
          lanyardImage="/media/lanyard/lanyard.webp"
          imageFit="cover"
          lanyardWidth={1.2}
        />
      </motion.div>
    </div>
  );
}
