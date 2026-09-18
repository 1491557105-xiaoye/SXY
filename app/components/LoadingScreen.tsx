'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const WORDS = ['Design', 'Create', 'Inspire'];
const EASE = [0.4, 0, 0.2, 1] as const;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const completeRef = useRef(onComplete);
  const finishedRef = useRef(false);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordIndex((current) => Math.min(current + 1, WORDS.length - 1));
    }, 900);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    let completionTimer = 0;

    const tick = (now: number) => {
      const nextProgress = Math.min(100, ((now - startedAt) / 2700) * 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          completionTimer = window.setTimeout(() => completeRef.current(), 400);
        }
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(completionTimer);
    };
  }, []);

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      aria-label="正在加载作品集"
      role="status"
    >
      <motion.div
        className="loading-label"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        Portfolio
      </motion.div>

      <div className="loading-word-stage">
        <AnimatePresence mode="wait">
          <motion.span
            className="loading-word font-display"
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        className="loading-counter font-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </motion.div>

      <div className="loading-track" aria-hidden="true">
        <motion.div
          className="loading-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
