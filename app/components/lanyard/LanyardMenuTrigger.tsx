'use client';

import './Lanyard.css';

export default function LanyardMenuTrigger() {
  const dropLanyard = () => {
    document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.dispatchEvent(new Event('hero-lanyard-drop'));
    window.dispatchEvent(new Event('hero-motion-replay'));
  };

  return (
    <>
      <button
        className="wordmark wordmark-button"
        type="button"
        onClick={dropLanyard}
        aria-label="重新投放邵歆晔个人工牌"
      >
        <span className="site-logo-slot"><img src="/media/brand/logo.svg" alt="" /></span>
        <strong>SHAO XINYE</strong>
        <span className="wordmark-meta">PORTFOLIO · 2026</span>
      </button>
    </>
  );
}
