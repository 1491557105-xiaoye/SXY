'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
};

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, style }: FadeInProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const capabilities = [
  {
    nameCn: 'AI 视觉制作', nameEn: 'AI VISUALS',
    description: '渠道 KV、主机商店图与 UA 钩子图的视觉延展、多尺寸适配及交付。',
  },
  {
    nameCn: '内容与动效', nameEn: 'CONTENT & MOTION',
    description: '将脚本与卖点转化为 AI 漫剧、投放视频及短视频内容。',
  },
  {
    nameCn: 'AI 工作流', nameEn: 'AI WORKFLOW',
    description: '运用生成式 AI 工具建立可复用的探索、制作与迭代流程。',
  },
  {
    nameCn: '系统与体验', nameEn: 'SYSTEM & UX',
    description: '从真实场景与任务流程出发，组织产品、服务与视觉系统。',
  },
  {
    nameCn: '品牌传播', nameEn: 'BRAND COMMUNICATION',
    description: '将技术与文化内容转译为清晰、可延展的品牌视觉语言。',
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="capabilities-section" aria-labelledby="capabilities-heading">
      <FadeIn className="capabilities-eyebrow">WHAT I DO / 能力</FadeIn>
      <FadeIn delay={0.05} className="capabilities-heading-wrap">
        <h2 id="capabilities-heading" className="capabilities-heading">设计能力<span>CAPABILITIES</span></h2>
      </FadeIn>
      <div className="capabilities-list">
        {capabilities.map((capability, index) => (
          <FadeIn key={capability.nameEn} delay={index * 0.1} className="capability-item">
            <span className="capability-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="capability-copy">
              <h3>{capability.nameCn}<small>{capability.nameEn}</small></h3>
              <p>{capability.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
