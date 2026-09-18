'use client';

import { useState } from 'react';

type ModelingMedia = { src: string; alt: string; caption?: string; variant?: string };

export default function ModelingGallery({ items }: { items: ModelingMedia[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cover = items[0];
  const cards = items.slice(1);
  const active = activeIndex === null ? null : cards[activeIndex];

  return <>
    <div className="detail-gallery gallery-layout-modeling">
      <figure className={cover.variant ? `media-${cover.variant}` : undefined}>
        <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" />
        {cover.caption && <figcaption>{cover.caption}</figcaption>}
      </figure>
    </div>
    <div className="modeling-card-row" aria-label="三维建模作品浏览">
      {cards.map((item, index) => <figure key={item.src}>
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
        <figcaption><span>{item.caption}</span><button type="button" onClick={() => setActiveIndex(index)}>点击查看</button></figcaption>
      </figure>)}
    </div>
    {active && <div className="modeling-lightbox" role="dialog" aria-modal="true" aria-label={active.alt} onClick={() => setActiveIndex(null)}>
      <div className="modeling-lightbox-panel" onClick={(event) => event.stopPropagation()}>
        <button className="modeling-lightbox-close" type="button" aria-label="关闭查看" onClick={() => setActiveIndex(null)}>×</button>
        <img src={active.src} alt={active.alt} />
      </div>
    </div>}
  </>;
}
