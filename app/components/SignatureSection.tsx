'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SignatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const signatureProgress = useTransform(scrollYProgress, [0.1, 0.58], [0, 1]);
  const underlineProgress = useTransform(scrollYProgress, [0.28, 0.7], [0, 1]);
  const signatureOpacity = useTransform(scrollYProgress, [0.08, 0.22, 0.72], [0, 1, 0.75]);
  const signatureDash = useTransform(scrollYProgress, [0.08, 0.56], [1500, 0]);
  const signatureFill = useTransform(scrollYProgress, [0.38, 0.64], [0, 0.94]);

  return (
    <section ref={sectionRef} className="signature-section" aria-label="签名动效">
      <div className="signature-meta"><span>01 / SIGNATURE TRACE</span><span>SCROLL TO DRAW</span></div>
      <div className="signature-stage">
        <svg className="signature-path" viewBox="0 0 1200 320" role="presentation">
          <defs>
            <filter id="signature-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <motion.text
            x="600"
            y="220"
            textAnchor="middle"
            className="signature-svg-word"
            strokeDasharray="1500"
            style={{ strokeDashoffset: signatureDash, fillOpacity: signatureFill, opacity: signatureOpacity }}
          >
            Xiaoye
          </motion.text>
          <motion.path
            d="M70 242 C135 118 196 113 224 207 C245 278 303 258 346 177 C382 110 431 93 447 170 C461 236 499 256 546 205 C586 162 616 106 646 133 C685 169 654 258 714 254 C779 250 826 119 865 139 C901 158 869 246 931 238 C1015 228 1038 111 1128 148"
            fill="none"
            pathLength={1}
            stroke="#ff3b22"
            strokeLinecap="round"
            strokeWidth="3"
            filter="url(#signature-glow)"
            style={{ pathLength: signatureProgress }}
          />
          <motion.path
            d="M74 250 C315 305 599 285 1124 157"
            fill="none"
            pathLength={1}
            stroke="#ffb329"
            strokeLinecap="round"
            strokeWidth="1.5"
            style={{ pathLength: underlineProgress }}
          />
        </svg>
      </div>
      <p className="signature-caption">把观察、内容与技术串成一条可交付的路径。</p>
    </section>
  );
}
