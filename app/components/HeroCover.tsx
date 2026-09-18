export default function HeroCover() {
  return (
    <div className="hero-cover" aria-hidden="true">
      <video className="hero-cover-video" autoPlay muted loop playsInline preload="auto">
        <source src="/media/hero/hero-main-visual.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
