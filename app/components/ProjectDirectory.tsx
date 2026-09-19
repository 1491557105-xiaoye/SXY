'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LineSidebar from './LineSidebar';

const projects = [
  { number: '01', title: '网易游戏｜七日世界', en: 'ONCE HUMAN · GLOBAL MARKETING', href: '/projects/netease-once-human' },
  { number: '02', title: '理想汽车｜算力平台', en: 'LI AUTO · TECH COMMUNICATION', href: '/projects/li-auto' },
  { number: '03', title: '艺术村长｜乡村振兴', en: 'RURAL REVITALIZATION SERVICE DESIGN', href: '/projects/art-village' },
  { number: '04', title: '天网寻踪｜无人机搜寻系统', en: 'CIVILIAN DRONE SEARCH SERVICE', href: '/projects/skynet-search' },
];

const otherWorks = [
  { number: '05.01', title: 'AI+设计未来学术论坛', subtitle: '主视觉设计', href: '/projects/other-works#forum' },
  { number: '05.02', title: '国家级赛事-第十一届中国研究生未来飞行器创新大赛', subtitle: '主视觉设计', href: '/projects/other-works#aircraft' },
  { number: '05.03', title: '中国国家电影博物馆·小雪', subtitle: '数字动画设计', href: '/projects/other-works#xiaoxue' },
  { number: '05.04', title: 'IP形象设计练习', subtitle: '三维', href: '/projects/other-works#modeling' },
  { number: '05.05', title: '轨道交通机车涂装设计', subtitle: '视觉设计', href: '/projects/other-works#crrc' },
];

export default function ProjectDirectory() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className={`project-directory${open ? ' is-open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="project-directory-trigger" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        ALL PROJECTS ×
      </button>
      <aside className="project-directory-panel" aria-label="项目目录">
        <div className="project-directory-title">PROJECT INDEX <span>01—05</span></div>
        <LineSidebar items={projects.map((project) => project.title)} meta={projects.map((project) => project.en)} onItemClick={(index) => { try { sessionStorage.setItem('bgm-continue', '1'); } catch {} setOpen(false); router.push(projects[index].href); }} />
        <div className="project-directory-subtitle"><b>05</b><span>OTHER WORKS</span></div>
        <LineSidebar className="project-directory-sub" items={otherWorks.map((project) => project.title)} meta={otherWorks.map((project) => project.subtitle)} onItemClick={(index) => { try { sessionStorage.setItem('bgm-continue', '1'); } catch {} setOpen(false); router.push(otherWorks[index].href); }} />
      </aside>
    </div>
  );
}
