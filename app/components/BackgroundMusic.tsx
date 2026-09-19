'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Persists across client-side navigation. A full page refresh resets it.
let manuallyPaused = false;

// Carry the playback position + pause state across a navigation into a subpage
// (some frameworks remount the audio element on dynamic routes), so the
// background track keeps playing from where it was instead of restarting.
const BGM_CONTINUE_KEY = 'bgm-continue';
const BGM_TIME_KEY = 'bgm-time';
const BGM_PAUSED_KEY = 'bgm-paused';

const saveState = (currentTime: number, paused: boolean) => {
  try {
    sessionStorage.setItem(BGM_TIME_KEY, String(currentTime));
    sessionStorage.setItem(BGM_PAUSED_KEY, paused ? '1' : '0');
  } catch {}
};

export default function BackgroundMusic() {
  const pathname = usePathname();
  // The "tap to play" overlay must ONLY appear on the first-level page. On any
  // subpage we keep quiet (no prompt) and just let the music keep playing.
  const isHomeRef = useRef(pathname === '/');
  useEffect(() => { isHomeRef.current = pathname === '/'; }, [pathname]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  // Shown only when the browser blocks silent autoplay on the FIRST-level page.
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.38;

    // Restore manual-pause state across a hard navigation (module-level reset).
    try { if (sessionStorage.getItem(BGM_PAUSED_KEY) === '1') manuallyPaused = true; } catch {}

    // Attempt to start playback. If the browser refuses (no prior gesture),
    // only surface the one-tap "enter" overlay on the first-level page. On
    // subpages we stay silent and let the music keep playing from its position.
    const tryPlay = () => {
      if (manuallyPaused) return;
      const p = audio.play() as Promise<void> | undefined;
      if (p && typeof p.then === 'function') {
        p.then(() => {
          setPlaying(true);
          setShowEnter(false);
        }).catch(() => {
          if (!manuallyPaused && isHomeRef.current) setShowEnter(true);
        });
      }
    };

    // If we arrived via a client-side navigation (e.g. clicking a project card),
    // resume from the saved position so the music continues seamlessly instead
    // of restarting from the beginning.
    const restore = () => {
      try {
        if (sessionStorage.getItem(BGM_CONTINUE_KEY) === '1' && audio.paused) {
          const t = parseFloat(sessionStorage.getItem(BGM_TIME_KEY) || '0');
          if (t > 0 && !Number.isNaN(t)) audio.currentTime = t;
        }
      } catch {}
      try { sessionStorage.removeItem(BGM_CONTINUE_KEY); } catch {}
    };

    // Persist the current position so it can be restored on the next page.
    const saveTime = () => saveState(audio.currentTime, manuallyPaused);

    // Fire as early as possible, then again once media is ready / page loaded.
    restore();
    tryPlay();
    const onReady = () => tryPlay();
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('loadeddata', onReady);
    audio.addEventListener('timeupdate', saveTime);
    window.addEventListener('load', onReady);

    // Any interaction also starts playback (and dismisses the overlay). Seamless
    // even if the overlay is missed.
    const startAfterGesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.site-music-toggle')) return;
      if (audio.paused) tryPlay();
      setShowEnter(false);
    };
    document.addEventListener('pointerdown', startAfterGesture, { passive: true });
    document.addEventListener('keydown', startAfterGesture);
    document.addEventListener('touchstart', startAfterGesture, { passive: true });

    return () => {
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('loadeddata', onReady);
      audio.removeEventListener('timeupdate', saveTime);
      window.removeEventListener('load', onReady);
      document.removeEventListener('pointerdown', startAfterGesture);
      document.removeEventListener('keydown', startAfterGesture);
      document.removeEventListener('touchstart', startAfterGesture);
    };
  }, []);

  // On client-side navigation, keep the music running (never pause just because
  // the route changed). Only resume if it was not manually stopped.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!manuallyPaused && audio.paused) {
      const p = audio.play() as Promise<void> | undefined;
      if (p && typeof p.then === 'function') {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }
  }, [pathname]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      manuallyPaused = false;
      const p = audio.play() as Promise<void> | undefined;
      if (p && typeof p.then === 'function') {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    } else {
      manuallyPaused = true;
      audio.pause();
    }
    saveState(audio.currentTime, manuallyPaused);
  };

  const enterAndPlay = () => {
    manuallyPaused = false;
    const audio = audioRef.current;
    if (!audio) return;
    const p = audio.play() as Promise<void> | undefined;
    if (p && typeof p.then === 'function') {
      p.then(() => {
        setPlaying(true);
        setShowEnter(false);
      }).catch(() => setShowEnter(true));
    } else {
      setShowEnter(false);
    }
    saveState(audio.currentTime, manuallyPaused);
  };

  return <>
    <audio
      ref={audioRef}
      autoPlay
      loop
      playsInline
      preload="auto"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      <source src="/media/audio/portfolio-music.mp3?v=2" type="audio/mpeg" />
    </audio>
    <button
      className={`site-music-toggle${playing ? ' is-playing' : ''}`}
      type="button"
      onClick={toggle}
      aria-label={playing ? '关闭背景音乐' : '播放背景音乐'}
      aria-pressed={playing}
      title={playing ? '关闭背景音乐' : '播放背景音乐'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        {playing ? (
          <>
            <path d="M16 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M18 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        )}
      </svg>
    </button>
    {showEnter && (
      <div
        className="site-music-enter"
        role="button"
        tabIndex={0}
        aria-label="轻触开启背景音乐"
        onClick={enterAndPlay}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') enterAndPlay(); }}
      >
        <div className="site-music-enter__card">
          <div className="site-music-enter__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </div>
          <div className="site-music-enter__title">轻触开启背景音乐</div>
          <div className="site-music-enter__hint">点击任意处进入</div>
        </div>
      </div>
    )}
  </>;
}
