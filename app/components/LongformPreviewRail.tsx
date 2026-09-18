'use client';

type LongformItem = {
  src: string;
  alt: string;
  caption?: string;
};

export default function LongformPreviewRail({ items }: { items: LongformItem[] }) {
  return (
    <div className="li-longform-previews" aria-label="技术长图预览">
      {items.map((item) => (
        <figure className="li-longform-preview" key={item.src}>
          <div className="li-longform-preview-scroll" tabIndex={0} aria-label={item.caption || item.alt}>
            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
          </div>
        </figure>
      ))}
    </div>
  );
}
