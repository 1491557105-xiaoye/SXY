import ProjectMarquee from './components/ProjectMarquee';
import CapabilitiesSection from './components/CapabilitiesSection';
import HeroCover from './components/HeroCover';
import SignatureSection from './components/SignatureSection';
import LanyardMenuTrigger from './components/lanyard/LanyardMenuTrigger';
import HeroLanyard from './components/lanyard/HeroLanyard';
import HeroMotionController from './components/HeroMotionController';

const projects = [
  { order: '01', title: '网易游戏｜七日世界', titleEn: 'ONCE HUMAN · GLOBAL MARKETING', summary: '全球渠道视觉、北美内容创意与 AI 漫剧生产。', meta: 'AI ART · MARKETING · 2026', image: '/media/netease-overview-hero.webp', slug: 'netease-once-human' },
  { order: '02', title: '理想汽车｜算力平台', titleEn: 'LI AUTO · TECH COMMUNICATION', summary: '把复杂研发信息转化为清晰、有品牌感的传播体验。', meta: 'AI WORKFLOW · VISUAL SYSTEM · 2026', image: '/media/projects/li-auto/cover.webp', slug: 'li-auto' },
  { order: '03', title: '艺术村长｜乡村振兴', titleEn: 'RURAL REVITALIZATION SERVICE DESIGN', summary: '从真实人物、地方内容到地图导视与现场触点。', meta: 'SERVICE DESIGN · VISUAL SYSTEM · 2023—2024', image: '/media/projects/art-village/cover-main.webp', slug: 'art-village' },
  { order: '04', title: '天网寻踪｜无人机搜寻系统', titleEn: 'CIVILIAN DRONE SEARCH SERVICE', summary: '连接求助、任务调度与公益无人机资源的概念服务系统。', meta: 'PRODUCT · UX · SYSTEM DESIGN · 2025', image: '/media/projects/skynet/cover-main.webp', slug: 'skynet-search' },
  { order: '05', title: 'Other Works｜跨媒介设计', titleEn: 'VISUAL · MOTION · 3D · INDUSTRIAL', summary: '赛事主视觉、数字动画、三维建模与轨道交通涂装。', meta: 'SELECTED WORKS · 2022—2025', image: '/media/future-aircraft-poster.webp', slug: 'other-works' },
];

const otherWorks = [
  { title:'AI+·设计未来学术论坛', titleEn:'ACADEMIC FORUM · KEY VISUAL', label:'05.01', image:'/media/projects/other-works/forum-cover-main.webp', href:'/projects/other-works#forum' },
  { title:'国家级赛事主视觉设计', titleEn:'OFFICIAL KEY VISUAL', label:'05.02', image:'/media/projects/other-works/future-aircraft-cover-main.webp', href:'/projects/other-works#aircraft' },
  { title:'小雪数字动画', titleEn:'DIGITAL ANIMATION', label:'05.03', image:'/media/projects/other-works/xiaoxue-cover.webp', href:'/projects/other-works#xiaoxue' },
  { title:'绝尘 IP 建模', titleEn:'3D MODELING', label:'05.04', image:'/media/projects/other-works/modeling-cover-main.webp', href:'/projects/other-works#modeling' },
  { title:'轨道交通涂装', titleEn:'CRRC · INDUSTRIAL LIVERY', label:'05.05', image:'/media/projects/other-works/crrc-cover-home.webp', href:'/projects/other-works#crrc' },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <LanyardMenuTrigger />
        <nav aria-label="主导航">
          <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
          <a className="resume-link" href="/resume-shao-xinye-2027.pdf" download>Résumé ↘</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <HeroMotionController />
        <div className="hero-kicker"><span>BASED IN SHANGHAI</span><span>2027 GRADUATE</span></div>
        <div className="hero-title">
          <span className="hero-discipline">AI PRODUCT · CONTENT OPERATIONS · VISUAL SYSTEMS</span>
          <h1>
            <em className="hero-wordmark">Portfolio</em>
            <span className="hero-statement" aria-label="用设计思维连接用户、内容与业务">
              {'用设计思维连接用户、内容与业务'.split('').map((letter, index) => <i key={`${letter}-${index}`} style={{ animationDelay: `${680 + index * 38}ms` }}>{letter}</i>)}
            </span>
          </h1>
        </div>
        <div className="hero-nameplate" aria-label="邵歆晔"><strong>邵歆晔</strong><span>SHAO XINYE</span></div>
        <div className="hero-bottom">
          <p>以设计为起点，向 AI 产品与内容运营拓展。擅长理解复杂信息、组织内容与协同需求，并通过产品思维、视觉表达和 AIGC 工具推动方案从概念走向真实交付。</p>
          <a className="round-cta" href="#work" aria-label="查看精选项目">VIEW<br />WORK ↓</a>
        </div>
        <HeroCover />
        <HeroLanyard />
      </section>

      <SignatureSection />

      <section className="about-section" id="about">
        <div className="about-intro">
          <span className="eyebrow">ABOUT / 关于我</span>
          <h2>Hi, I am <em>Xiaoye!</em></h2>
          <p>北京理工大学设计学硕士在读，2027 届。以设计思维连接用户、内容与业务，关注 AI 产品、内容运营、用户体验与智能汽车。</p>
          <div className="about-contact-strip"><span>BASED IN SHANGHAI</span><a href="mailto:1491557105@qq.com">1491557105@qq.com ↗</a></div>
        </div>
        <figure className="about-profile-card">
          <img src="/media/profile-card-hq.webp" alt="邵歆晔个人名片照片" />
          <figcaption><strong>SHAO XINYE</strong><span>邵歆晔 · AI &amp; VISUAL DESIGN</span></figcaption>
        </figure>
        <div className="about-info-grid">
          <article className="about-glass-card about-experience">
            <span className="about-card-label">WORK EXPERIENCES</span>
            <div className="about-record">
              <div className="about-record-heading">
                <strong>网易游戏 ·《七日世界》</strong>
                <span>2026.04—2026.07</span>
              </div>
              <p className="about-record-role">AI 美术设计 · 市场营销方向</p>
              <ul className="ability-points">
                <li><strong>全球发行</strong><span>16 套素材适配 20+ 渠道</span></li>
                <li><strong>海外创意</strong><span>连续 7 周交付北美 UA</span></li>
                <li><strong>AI 生产</strong><span>完成图像与短视频生产</span></li>
              </ul>
            </div>
            <div className="about-record">
              <div className="about-record-heading">
                <strong>理想汽车 · 算力平台</strong>
                <span>2026.01—2026.04</span>
              </div>
              <p className="about-record-role">运营设计</p>
              <ul className="ability-points">
                <li><strong>技术转译</strong><span>复杂研发信息可视化</span></li>
                <li><strong>品牌系统</strong><span>统一技术内容视觉规范</span></li>
                <li><strong>AI 工作流</strong><span>沉淀提示词与设计资产</span></li>
              </ul>
            </div>
          </article>
          <article className="about-glass-card about-education-card">
            <span className="about-card-label">EDUCATION</span>
            <div className="about-record education-record">
              <div className="about-record-heading">
                <strong>北京理工大学</strong><span>2024.09—至今</span>
              </div>
              <p className="about-record-role">硕士 · 设计｜预计 2027.06 毕业</p>
              <p className="education-direction"><strong>专业方向</strong>服务设计 · 智能产品 · 信息可视化</p>
            </div>
            <div className="about-record education-record">
              <div className="about-record-heading">
                <strong>鲁迅美术学院</strong><span>2020.09—2024.07</span>
              </div>
              <p className="about-record-role">本科 · 数字媒体艺术设计</p>
              <p className="education-direction"><strong>专业方向</strong>视觉设计 · 动态影像 · 交互设计</p>
            </div>
          </article>
          <article className="about-glass-card about-projects-card">
            <span className="about-card-label">CORE SKILLS</span>
            <div className="skills">{['产品思维 · Product Thinking','内容运营 · Content Operations','用户体验 · UX / Service Design','AIGC 工作流 · AIGC Workflow','全球营销 · Global Marketing','视觉系统 · Visual Systems'].map((skill) => <span key={skill}>{skill}</span>)}</div>
          </article>
          <article className="about-inline-stats">
            <div><strong>20+</strong><span>全球发行渠道</span></div>
            <div><strong>11</strong><span>语言版本</span></div>
            <div><strong>05</strong><span>精选项目</span></div>
          </article>
        </div>
      </section>

      <CapabilitiesSection />

      <section className="work-section" id="work">
        <div className="section-heading">
          <div><span className="eyebrow">SELECTED PROJECTS</span><h2>真实项目，完整交付。</h2></div>
          <p>从商业内容到公共服务，五个项目对应不同的问题尺度与协作场景。</p>
        </div>
        <ProjectMarquee primary={projects.slice(0, 4).map(({ title, titleEn, image, slug, order }) => ({ title, titleEn, image, label: order, href: `/projects/${slug}` }))} secondary={otherWorks} />
      </section>

      <footer id="contact">
        <span className="eyebrow">CONTACT / 联系我</span><h2>Let&apos;s make ideas tangible.</h2>
        <div className="contact-row"><a href="mailto:1491557105@qq.com">1491557105@qq.com</a><a href="tel:+8615913286830">+86 159 1328 6830</a><span>WECHAT · slp8300</span></div>
        <div className="footer-bottom"><span>© 2026 SHAO XINYE</span><a href="#home">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
