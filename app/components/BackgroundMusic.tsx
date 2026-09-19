'use client';

import { useEffect, useRef, useState } from 'react';

// This module stays mounted across client-side navigation, but a full refresh resets it.
let manuallyPausedForThisPage = false;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.38;

    const tryPlay = () => { if (!manuallyPausedForThisPage) void audio.play().catch(() => setPlaying(false)); };
    tryPlay();

    // Browsers often require a visitor gesture before audio can start.
    const startAfterGesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.site-music-toggle')) return;
      if (audio.paused) tryPlay();
    };
    document.addEventListener('pointerdown', startAfterGesture, { passive: true });
    document.addEventListener('keydown', startAfterGesture);
    return () => {
      document.removeEventListener('pointerdown', startAfterGesture);
      document.removeEventListener('keydown', startAfterGesture);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      manuallyPausedForThisPage = false;
      void audio.play().catch(() => setPlaying(false));
    } else {
      manuallyPausedForThisPage = true;
      audio.pause();
    }
  };

  return <>
    <audio ref={audioRef} loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src="/media/audio/portfolio-music.mp3" type="audio/mpeg" />
    </audio>
    <button className={`site-music-toggle${playing ? ' is-playing' : ''}`} type="button" onClick={toggle} aria-label={playing ? '关闭背景音乐' : '播放背景音乐'} aria-pressed={playing} title={playing ? '关闭背景音乐' : '播放背景音乐'}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />{playing ? <><path d="M16 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M18 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></> : <path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}</svg>
    </button>
  </>;
}
