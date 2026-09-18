import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Grainient from '../../components/Grainient';
import Link from 'next/link';
import UaWeeklyRails from '../../components/UaWeeklyRails';
import LongformPreviewRail from '../../components/LongformPreviewRail';
import ModelingGallery from '../../components/ModelingGallery';

type ProjectMedia = { src: string; alt: string; caption?: string; variant?: 'feature' | 'wide' | 'tall' | 'compact' | 'transparent'; type?: 'image' | 'video'; poster?: string; mime?: string };

type ProjectSection = {
  id: string;
  label: string;
  title: string;
  body: string[];
  media?: ProjectMedia[];
  steps?: string[];
  facts?: { label: string; value: string; color?: string }[];
  layout?: 'wide' | 'research' | 'system' | 'people' | 'pairs' | 'mosaic' | 'li-feature' | 'longform' | 'longform-preview' | 'exhibit' | 'archive' | 'rail-design' | 'field-proof' | 'channel-grid' | 'ua-grid' | 'ua-rail' | 'netease-video' | 'netease-boards' | 'modeling' | 'skynet-intro' | 'skynet-spec' | 'skynet-process' | 'skynet-value' | 'skynet-app' | 'skynet-operations' | 'skynet-summary' | 'skynet-values' | 'skynet-problem' | 'skynet-logo' | 'skynet-experience' | 'skynet-boundary';
  strip?: { start: number; end: number };
};

type Project = {
  order: string;
  title: string;
  titleEn: string;
  subtitle: string;
  meta: string[];
  role: string;
  hero: string;
  heroVideo?: string;
  heroPosition?: string;
  introMedia?: ProjectMedia;
  accent: string;
  sections: ProjectSection[];
};

const projects: Record<string, Project> = {
  'netease-once-human': {
    order: '01', title: '网易游戏｜七日世界', titleEn: 'ONCE HUMAN · GLOBAL MARKETING',
    subtitle: '从既有核心视觉到全球渠道可上线资产，并探索面向北美用户的内容创意与 AI 漫剧生产。',
    meta: ['2026.04—07', 'H73 PROJECT TEAM', 'COMMERCIAL PROJECT'], role: 'AI 美术设计（市场营销方向）',
    hero: '/media/netease-overview-hero.webp', accent: '#ff5a45',
    sections: [
      { id:'overview', label:'01 / OVERVIEW', title:'一项真实的全球营销交付工作。', body:['参与《七日世界》全球渠道、主机平台、海外 UA 与 AI 漫剧内容生产。我的工作集中在既有核心视觉的字体延展、压字排版、规格适配与最终交付。','16 套宣传素材覆盖 20+ 海内外发行渠道及 11 种语言版本；核心 KV 由项目美术提供，不将底图创作归为个人成果。'], steps:['接收底图、文案与渠道需求','字体延展与信息排版','多尺寸 / 多语言重排','规范检查与最终交付'] },
      { id:'channel', label:'02 / CHANNEL ASSETS', title:'同一张底图，适配不同渠道的阅读重点。', body:['以工作模块图梳理我的角色范围，再通过 KV 合集呈现同一核心视觉在不同活动、渠道和规格中的延展。','字体方向由 AI 辅助探索，我负责筛选、去背、PS 微调、与底图融合及最终交付。'], media:[
        {src:'/media/projects/netease/layout-role-contribution.webp',alt:'七日世界工作模块与角色贡献',caption:'工作模块 · 从核心 KV 延展到多平台交付'},
        {src:'/media/projects/netease/layout-kv-collection.webp',alt:'七日世界渠道主视觉素材合集',caption:'渠道素材合集 · 多活动与多规格视觉延展'},
        {src:'/media/projects/netease/layout-channel-validation.webp',alt:'七日世界渠道视觉方案验证',caption:'视觉方案验证 · 多平台页面呈现'}
      ], layout:'netease-boards' },
      { id:'console', label:'03 / CONSOLE LAUNCH', title:'为主机商店与首曝内容完成规范化交付。', body:['围绕 PlayStation / Xbox 上线需求，基于礼包底图与单个素材完成商店图、预售礼包图和多语言版本排版；根据平台与地区要求适配评级标识、Logo 与落版信息。','礼包排版已应用于首曝 PV，并在 PlayStation、Xbox 公开页面中留下可核对的发布证明；另协助 Twitch 官方海外直播的前期调试与现场内容协同。'], media:[
        {src:'/media/projects/netease/layout-console-effect.webp',alt:'七日世界主机上线视觉方案',caption:'视觉方案展示 · 主机上线与渠道传播'},
        {src:'/media/projects/netease/layout-ai-workflow.webp',alt:'七日世界 AI 生成工作流',caption:'生成工作流 · 指令分析、图像生成与交付规范'},
        {src:'/media/projects/netease/layout-channel-process.webp',alt:'七日世界渠道资产制作过程',caption:'渠道资产制作 · 版式迭代与终稿交付'}
      ], layout:'netease-boards' },
      { id:'ua', label:'04 / NORTH AMERICA UA', title:'从热点梗到可测试的广告创意。', body:['持续追踪 TikTok、Instagram、YouTube 等平台的热点梗与 MEME 表达，每周形成一组钩子图，再将通过筛选的方向延展为不同广告规格，用于 UA 测试。','我负责热点调研、游戏化转化构思、AI 图像生成与 Figma 排版；投放数据与周报属于团队协作输入，页面只展示公开素材和定性迭代。'], media:[
        ...['5.5-5.9 meme钩子图-v1','5.5-5.9 meme钩子图-v2','5.5-5.9 meme钩子图-v3','5.5-5.9 meme钩子图-v4','5.11-5.16 meme钩子图-v1','5.11-5.16 meme钩子图-v2','5.11-5.16 meme钩子图-v3','5.11-5.16 meme钩子图-v4','5.11-5.16 meme钩子图-v5','5.18-5.22 meme钩子图-v1','5.18-5.22 meme钩子图-v2','5.18-5.22 meme钩子图-v3','5.18-5.22 meme钩子图-v4','5.18-5.22 meme钩子图-v5','5.25-5.29 meme钩子图-v1','5.25-5.29 meme钩子图-v2','5.25-5.29 meme钩子图-v3','6.1-6.5 meme钩子图-v1','6.1-6.5 meme钩子图-v2','6.1-6.5 meme钩子图-v3','6.8-6.15 meme钩子图-v1','6.8-6.15 meme钩子图-v2','6.8-6.15 meme钩子图-v3','6.8-6.15 meme钩子图-v4','6.22-6.26 meme钩子图-v1','6.22-6.26 meme钩子图-v2','6.22-6.26 meme钩子图-v3','6.22-6.26 meme钩子图-v4','6.22-6.26 meme钩子图-v5'].map((name,index)=>({src:`/media/projects/netease/meme-${String(index+1).padStart(2,'0')}.webp`,alt:name,caption:name,variant:'compact' as const})),
        ...[1,2,3,4,5].map((n)=>({src:`/media/projects/netease/ua-${n}-square.webp`,alt:`UA素材${n}`,caption:`UA 测试素材 ${n} · 1080×1080`,variant:'compact' as const}))
      ], layout:'ua-rail' },
      { id:'ai-video', label:'05 / AI VIDEO & EDITING', title:'从 AI 生成到商业化视频成片。', body:['覆盖 AI 漫剧、UA 测试、渠道上架与商业剪辑：从脚本拆解、要素绑定到生成、剪映包装和最终交付。'], steps:['脚本 / 热梗拆解','角色、场景、道具规划','Seedance 2 生成镜头','剪映剪辑与声音包装','成片输出与审核'], media:[
        {src:'/media/projects/netease/layout-ai-drama-workflow.webp',alt:'七日世界 AI 漫剧制作工作流',caption:'AI 漫剧工作流 · 从脚本拆解到发布复盘'},
        {src:'/media/projects/netease/layout-video-content.webp',alt:'七日世界视频制作内容总览',caption:'视频制作内容 · UA、AI 漫剧与商业剪辑'},
        {src:'/media/projects/netease/ai-episode-01.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ai-episode-01-poster.webp',alt:'明日之后AI漫剧第一集',caption:'《明日之后：尸潮》第一集 · 2′12″',variant:'feature'},
        {src:'/media/projects/netease/ai-episode-04.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ai-episode-04-poster.webp',alt:'明日之后AI漫剧第四集',caption:'第四集 · 2′47″'},
        {src:'/media/projects/netease/ai-episode-05.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ai-episode-05-poster.webp',alt:'明日之后AI漫剧第五集',caption:'第五集 · 2′46″'},
        {src:'/media/projects/netease/ua-video-01.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ua-1-square.webp',alt:'UA测试短视频一',caption:'UA 测试短视频 · 热梗联动 01'},
        {src:'/media/projects/netease/ua-video-02.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ua-2-square.webp',alt:'UA测试短视频二',caption:'UA 测试短视频 · 热梗联动 02'},
        {src:'/media/projects/netease/ua-video-03.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/ua-3-square.webp',alt:'UA测试短视频三',caption:'UA 测试短视频 · 热梗联动 03'},
        {src:'/media/projects/netease/channel-video-dream.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/channel-dream-final.webp',alt:'奇梦之旅渠道上架视频',caption:'渠道上架视频 · 奇梦之旅'},
        {src:'/media/projects/netease/channel-video-s4.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/netease/channel-s4-final.webp',alt:'S4渠道上架视频',caption:'渠道上架视频 · S4 引力之渊'},
      ], layout:'netease-boards' },
    ],
  },
  'li-auto': {
    order:'02', title:'理想汽车｜算力平台', titleEn:'LI AUTO · TECH COMMUNICATION',
    subtitle:'通过信息降维、视觉系统与 AI 辅助流程，把高门槛技术资料转化为清晰、易读且保持品牌一致性的传播体验。',
    meta:['2026.01—04','COMPUTING PLATFORM','COMMERCIAL PROJECT'], role:'运营设计 / 技术内容视觉化', hero:'/media/projects/li-auto/hero-reference.webp', heroPosition:'center', accent:'#00a89f',
    sections:[
      {
        id:'context', label:'01 / PROJECT BACKGROUND', title:'项目背景与设计目标',
        body:['面向高门槛技术内容，项目聚焦三个问题：理解门槛高、叙事表达弱、品牌表达分散。通过信息降维、视觉转译和规范化输出，让内容更易理解、更易阅读、保持统一。'],
        media:[
          {src:'/media/projects/li-auto/li-problem-positioning.webp',alt:'理想汽车技术传播的核心挑战与设计目标',caption:'项目背景 · 核心挑战与设计目标',variant:'feature'},
          {src:'/media/projects/li-auto/li-brand-positioning.webp',alt:'理想汽车媒体矩阵与品牌定位',caption:'品牌定位 · 媒体矩阵与用户画像',variant:'feature'}
        ], layout:'li-feature'
      },
      {
        id:'style', label:'02 / STYLE DIRECTION', title:'风格定位',
        body:['基于品牌定位与渠道观察，建立以深绿、暖金和磨砂玻璃为核心的科技视觉语言。'],
        media:[
          {src:'/media/projects/li-auto/li-design-spec.webp',alt:'理想汽车设计规范与视觉系统',caption:'设计规范 · 品牌、色彩与技术内容视觉系统',variant:'feature'},
          {src:'/media/projects/li-auto/li-style-direction.webp',alt:'理想汽车技术内容设计风格定位',caption:'风格定位 · 技术研究所视觉方向',variant:'feature'}
        ], layout:'li-feature'
      },
      {
        id:'workflow', label:'03 / AI WORKFLOW', title:'AI 视觉工作流',
        body:['AI 用于理解技术资料、探索视觉方向与整理提示词；最终由人工完成筛选、修复、信息编排与品牌审核。'],
        steps:['理解技术语义','筛选可视化意象','调用视觉规则组织 Prompt','生成多方向方案','人工修复与信息设计','内容 / 品牌审核'],
        media:[{src:'/media/projects/li-auto/li-ai-workflow.webp',alt:'理想汽车AI生图流程',caption:'AI 生图流程 · 从需求分析到设计交付',variant:'feature'}], layout:'li-feature'
      },
      {
        id:'brand', label:'04 / BRAND SYSTEM', title:'品牌视觉系统',
        body:['为“理想星环 OS”与“理想硅基研究所”建立统一的色彩、组件与信息层级，让不同技术主题持续更新时仍保持一致。'],
        facts:[
          {label:'DEEP GREEN',value:'#002D28',color:'#002D28'},
          {label:'UI GREEN',value:'#00726D',color:'#00726D'},
          {label:'SAND',value:'#CEA472',color:'#CEA472'},
          {label:'TYPE SCALE',value:'20PX MIN · ×4'},
          {label:'CANVAS',value:'1920 × N'},
          {label:'MARGIN',value:'60PX'}
        ],
        media:[
          {src:'/media/projects/li-auto/li-brand-applications.webp',alt:'理想汽车三维图标应用',caption:'三维图标应用',variant:'feature'},
          {src:'/media/projects/li-auto/li-page-display.webp',alt:'理想汽车技术内容界面展示',caption:'界面展示',variant:'feature'}
        ], layout:'li-feature'
      },
      {
        id:'applications', label:'05 / CONTENT APPLICATIONS', title:'内容应用',
        body:['将同一套视觉规则延展至文章首图、章节转场与信息卡片，适配不同技术主题。'],
        media:[
          {src:'/media/projects/li-auto/article-mockup.webp',alt:'理想汽车技术文章UI样机效果',caption:'公开文章 · UI 样机效果',variant:'feature'},
          {src:'/media/projects/li-auto/article-silicon-human.webp',alt:'如何打造硅基人技术文章视觉',caption:'如何打造硅基人 · 主题视觉'},
          {src:'/media/projects/li-auto/article-domain-control.webp',alt:'域控软件功能安全策略技术文章视觉',caption:'域控软件功能安全策略 · 主题视觉'},
          {src:'/media/projects/li-auto/content-05.webp',alt:'理想汽车技术内容海报：系统越权',caption:'系统越权 · 技术海报'},
          {src:'/media/projects/li-auto/content-01.webp',alt:'技术公众号图文应用一',caption:'内容应用 01'},
          {src:'/media/projects/li-auto/content-02.webp',alt:'技术公众号图文应用二',caption:'内容应用 02'},
          {src:'/media/projects/li-auto/content-03.webp',alt:'技术公众号图文应用三',caption:'内容应用 03'},
          {src:'/media/projects/li-auto/content-04.webp',alt:'技术公众号图文应用四',caption:'内容应用 04'},
          {src:'/media/projects/li-auto/content-05.webp',alt:'技术公众号图文应用五',caption:'内容应用 05'},
          {src:'/media/projects/li-auto/content-06.webp',alt:'技术公众号图文应用六',caption:'内容应用 06'}
        ], layout:'pairs', strip:{start:4,end:10}
      },
      {
        id:'longform', label:'06 / LONG-FORM READING', title:'技术长图',
        body:[],
        media:[
          {src:'/media/projects/li-auto/longform-os-quality.webp',alt:'理想星环OS质量效率探索实践长图',caption:'理想星环 OS · 质量效率实践'},
          {src:'/media/projects/li-auto/longform-imu.webp',alt:'IMU共享解决方案技术文章长图',caption:'IMU 共享解决方案'},
          {src:'/media/projects/li-auto/longform-rubrichub.webp',alt:'理想汽车RubricHub技术文章长图',caption:'RubricHub · 开源技术内容'},
          {src:'/media/projects/li-auto/longform-nl2sql.webp',alt:'大模型幻觉检测在NL2SQL任务中的应用实践长图',caption:'大模型幻觉检测 × NL2SQL'}
        ], layout:'longform-preview'
      },
      {
        id:'m100', label:'07 / M100 DUAL-SOC EXHIBIT', title:'M100 双 SOC 展具',
        body:['展具用于产品发布后的技术讲解。我负责 1:1 平面图的信息排版与视觉设计，确保架构标注、字体、色彩与留白符合品牌调性。落地修改包括删除定位线、检查版式合规性和删减次要配件内容。','直属 MT 负责内容审核，制作完成后通过工单进入品牌审核；实物结构、打板制作与现场讲解由其他成员及制作方负责。成品已落地，平面图纸也出现在理想汽车 CTO 谢炎的公开技术对话视频中。'],
        media:[
          {src:'/media/projects/li-auto/m100-layout-reference.webp',alt:'理想汽车M100双SOC架构展具排版参考',caption:'车规工艺双 SOC 架构 · 项目排版总览',variant:'feature'}
        ], layout:'exhibit'
      },
      {
        id:'result', label:'08 / RESULT & REFLECTION', title:'真实交付与复盘',
        body:['阶段成果包括技术公众号视觉、三维图标与长图模板，以及已经打样落地的 M100 双 SOC 架构讲解展具。页面以公开内容、实际交付与落地照片作为证据，不使用“效率提升 30%”“阅读量提升 20%”或“点击率提升 15%”等缺乏完整统计口径的数据。','这段经历让我形成一套可迁移的方法：先理解技术与业务目标，再把复杂信息组织成清晰体验，最后用品牌系统保证持续产出的质量与一致性。']
      },
    ],
  },
  'art-village': {
    order:'03', title:'艺术村长｜乡村振兴服务设计', titleEn:'ART VILLAGE LEAD · RURAL REVITALIZATION',
    subtitle:'以服务设计连接地方文化、真实人物与来访体验，把分散内容转化为可识别、可到达、可传播的文旅触点。',
    meta:['2023.12—2024.07','GRADUATION PROJECT','REAL-WORLD IMPLEMENTATION'], role:'主视觉设计 / 视觉系统与线下触点', hero:'/media/projects/art-village/cover.webp', heroVideo:'/media/projects/art-village/hero-showreel.webm', heroPosition:'center', introMedia:{src:'/media/projects/art-village/project-title-system.webp',alt:'艺术村长项目标题系统',caption:'项目标题系统'}, accent:'#0fbd91',
    sections:[
      {
        id:'context', label:'01 / CONTEXT & PROCESS', title:'项目背景',
        body:['五龙山资源丰富，但内容、路线与传播表达较为分散。项目通过调研和设计转译，提升地方内容的可见度与来访体验。'],
        media:[{src:'/media/projects/art-village/av-project-process.webp',alt:'艺术村长项目背景与五阶段设计过程',caption:'从调研到现场落地',variant:'feature'}], layout:'wide'
      },
      {
        id:'research', label:'02 / FIELD RESEARCH', title:'田野调研',
        body:['通过现场观察、访谈和拍摄记录，梳理村民、游客与协作方的内容及路线需求。'],
        steps:['现场观察与真实访谈','地方内容与原始路线梳理','三类真实用户需求归纳','服务定位与触点机会识别'],
        media:[
          {src:'/media/projects/art-village/research-workflow-01.gif',alt:'艺术村长前期服务设计研究过程一',caption:'用户画像、利益相关者与服务关系梳理',variant:'wide'},
          {src:'/media/projects/art-village/research-workflow-02.gif',alt:'艺术村长前期服务设计研究过程二',caption:'用户旅程与触点机会整理',variant:'wide'},
          {src:'/media/projects/art-village/av-research-profiles.webp',alt:'艺术村长用户画像与服务蓝图',caption:'用户画像与服务蓝图',variant:'feature'},
          {src:'/media/projects/art-village/field-research-01.webp',alt:'五龙山第一次现场调研',caption:'第一次现场调研'},
          {src:'/media/projects/art-village/field-research-02.webp',alt:'五龙山场域观察与记录',caption:'场域与路线观察'},
          {src:'/media/projects/art-village/field-research-villagers.webp',alt:'项目团队访谈当地村民',caption:'当地村民访谈'},
          {src:'/media/projects/art-village/field-research-students.webp',alt:'项目团队调研学生来访者',caption:'学生来访者调研'}
        ], layout:'research', strip:{start:3,end:7}
      },
      {
        id:'visual-system', label:'03 / VISUAL DIRECTION', title:'去山里',
        body:['我提出“去山里 / To the mountain”传播概念，主导主要视觉方案，并将团队形成的地方内容延展到人物系列海报、地图、导视、装置与现场应用。','本节展示的是既有识别体系在项目中的应用规范，以及由我主导的主视觉、色彩、版式和手写字延展；不把原始 Logo 设计归为个人成果。'],
        media:[
          {src:'/media/projects/art-village/visual-guideline-motion.gif',alt:'艺术村长动态视觉规范总览',caption:'视觉规范动态总览',variant:'feature'},
          {src:'/media/projects/art-village/av-logo-specifications.webp',alt:'去山里标识设计规范',caption:'标识设计规范',variant:'wide'},
          {src:'/media/projects/art-village/av-color-system.webp',alt:'艺术村长项目色彩系统',caption:'色彩系统',variant:'wide'},
          {src:'/media/projects/art-village/handwriting-01.webp',alt:'人物内容手写字样式一',caption:'人物语言视觉化 01',variant:'compact'},
          {src:'/media/projects/art-village/handwriting-02.webp',alt:'人物内容手写字样式二',caption:'人物语言视觉化 02',variant:'compact'},
          {src:'/media/projects/art-village/handwriting-03.webp',alt:'人物内容手写字样式三',caption:'人物语言视觉化 03',variant:'compact'},
          {src:'/media/projects/art-village/handwriting-04.webp',alt:'人物内容手写字样式四',caption:'人物语言视觉化 04',variant:'compact'}
        ], layout:'system', strip:{start:3,end:7}
      },
      {
        id:'people', label:'04 / PEOPLE STORIES', title:'人物故事',
        body:['以真实肖像、原话与经历构成人物海报，让村民成为地方文化的讲述者。'],
        media:[
          {src:'/media/projects/art-village/all-touchpoints.webm',type:'video',poster:'/media/projects/art-village/touchpoint-system.webp',alt:'艺术村长全部视觉物料动态展示',caption:'全部视觉物料设计 · 55 秒动态总览',variant:'feature'},
          {src:'/media/projects/art-village/people-poster-01.webp',alt:'艺术村长人物海报一',caption:'人物故事 01',variant:'tall'},
          {src:'/media/projects/art-village/people-poster-02.webp',alt:'艺术村长人物海报二',caption:'人物故事 02',variant:'tall'},
          {src:'/media/projects/art-village/people-poster-03.webp',alt:'艺术村长人物海报三',caption:'人物故事 03',variant:'tall'},
          {src:'/media/projects/art-village/people-poster-04.webp',alt:'艺术村长人物海报四',caption:'人物故事 04',variant:'tall'},
          {src:'/media/projects/art-village/people-poster-05.webp',alt:'艺术村长人物海报五',caption:'人物故事 05',variant:'tall'},
          {src:'/media/projects/art-village/people-mockup-01.webp',alt:'人物系列海报样机效果一',caption:'人物内容系统 · 样机效果 01',variant:'wide'},
          {src:'/media/projects/art-village/people-mockup-02.webp',alt:'人物系列海报样机效果二',caption:'人物内容系统 · 样机效果 02',variant:'wide'}
        ], layout:'people', strip:{start:1,end:6}
      },
      {
        id:'journey', label:'05 / MAP & WAYFINDING', title:'游览导览',
        body:['基于原始景区路线，重新梳理景点层级、地图信息与导视版式，并延展至现场装置。'],
        media:[
          {src:'/media/projects/art-village/route-map-design.webp',alt:'五龙山路线导览平面设计',caption:'路线导览 · 平面信息设计',variant:'feature'},
          {src:'/media/projects/art-village/route-map-installed-01.webp',alt:'五龙山路线导览落地效果一',caption:'路线导览 · 现场应用 01'},
          {src:'/media/projects/art-village/route-map-installed-02.webp',alt:'五龙山路线导览落地效果二',caption:'路线导览 · 现场应用 02'},
          {src:'/media/projects/art-village/wayfinding-design.webp',alt:'五龙山导视物平面设计',caption:'导视物 · 平面图'},
          {src:'/media/projects/art-village/wayfinding-views.webp',alt:'五龙山导视物三视图',caption:'导视物 · 三视图'},
          {src:'/media/projects/art-village/wayfinding-installed.webp',alt:'五龙山导视物落地效果',caption:'导视物 · 落地效果'}
        ], layout:'pairs'
      },
      {
        id:'on-site', label:'06 / ON-SITE EXPERIENCE', title:'线下触点',
        body:['将欢迎牌、地图、道旗与装置统一为同一套视觉语言，并呈现其现场应用。'],
        media:[
          {src:'/media/projects/art-village/av-material-derived.webp',alt:'艺术村长物料延展设计总览',caption:'物料延展设计',variant:'feature'},
          {src:'/media/projects/art-village/av-on-site-overview.webp',alt:'五龙山线下装置与地图导览',caption:'现场装置与地图导览'},
          {src:'/media/projects/art-village/on-site-flags.webp',alt:'五龙山景区道旗落地效果',caption:'林间道旗'},
          {src:'/media/projects/art-village/on-site-scaffold.webp',alt:'五龙山景区脚手架装置落地效果',caption:'脚手架装置'},
          {src:'/media/projects/art-village/on-site-rooftop.webp',alt:'五龙山景区屋顶气膜装置落地效果',caption:'屋顶气膜装置'},
          {src:'/media/projects/art-village/on-site-working.webp',alt:'邵歆晔在五龙山项目现场工作',caption:'现场安装与调整'},
          {src:'/media/projects/art-village/graduation-show-01.webp',alt:'艺术村长本科毕业设计展现场一',caption:'本科毕业设计展'},
          {src:'/media/projects/art-village/graduation-show-02.webp',alt:'艺术村长本科毕业设计展现场二',caption:'展馆现场'},
          {src:'/media/projects/art-village/graduation-show-group.webp',alt:'艺术村长毕业设计展合影',caption:'毕业设计展出合影'}
        ], layout:'mosaic', strip:{start:2,end:9}
      },
      {
        id:'result', label:'07 / OUTCOME & REFLECTION', title:'真实落地，也让视觉系统承担内容连接的责任。',
        body:['导视及相关装置在五龙山实际落地，项目随本科毕业设计展在鲁迅美术学院艺术馆展出；个人毕业设计获优秀毕业设计，项目后获“2025 全国高校乡村艺术建设年度优秀案例”。','这次实践让我认识到，主视觉设计的价值不只是统一外观，而是让真实人物、地方资源与空间信息在不同媒介中保持连贯。页面不使用未留存的满意度或社会影响数据，结果以真实落地、公开展示与荣誉为证据。']
      },
    ],
  },
  'skynet-search': {
    order:'04', title:'天网寻踪｜民用无人机搜寻服务系统', titleEn:'SKYNET SEARCH · CIVILIAN DRONE SERVICE',
    subtitle:'群翼织网，天翼寻踪。以公安协同为核心，连接民用无人机志愿者与专业搜救力量，探索更及时、可追踪且重视隐私的失踪人员搜寻流程。',
    meta:['2025.11','5-PERSON TEAM','NATIONAL THIRD PRIZE'], role:'独立负责 LOGO / UI 设计；参与服务系统与视觉物料', hero:'/media/projects/skynet/hero-project.webp', accent:'#2878f0',
    sections:[
      {
        id:'intro', label:'01 / PROJECT INTRODUCTION', title:'项目介绍',
        body:['连接公安、志愿者与专业搜救力量，统一任务、地图和线索回传。我负责 LOGO、移动端 UI/UX 与服务系统的视觉表达。'],
        facts:[{label:'ROLE',value:'LOGO / UI / SERVICE'},{label:'TEAM',value:'5 PERSONS'},{label:'RESULT',value:'NATIONAL THIRD PRIZE'}],
        media:[
          {src:'/media/projects/skynet/intro-video.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/skynet/cover.webp',alt:'天网寻踪项目介绍视频',caption:'视频介绍 · 服务概念与核心任务流',variant:'feature'},
          {src:'/media/projects/skynet/background-style.webp',alt:'天网寻踪项目背景与用户风格定位',caption:'项目背景 × 用户风格定位',variant:'feature'},
          {src:'/media/projects/skynet/scenario-storyboard.webp',alt:'天网寻踪典型任务故事板',caption:'典型任务情境故事板',variant:'feature'}
        ], layout:'skynet-intro'
      },
      {
        id:'design-system', label:'02 / DESIGN SYSTEM', title:'视觉系统',
        body:['以警徽蓝、圆角卡片与六边形标志，统一 APP、操纵柄和后台界面。'],
        facts:[{label:'PRIMARY BLUE',value:'#2878F0',color:'#2878F0'},{label:'SYSTEM',value:'六边形 × 网格'},{label:'TONE',value:'科技 / 公益 / 信任'}],
        media:[
          {src:'/media/projects/skynet/design-spec.webp',alt:'天网寻踪视觉设计规范',caption:'设计规范 · 色彩、字体、圆角与组件规则',variant:'feature'}
        ], layout:'skynet-spec'
      },
      {
        id:'search-process', label:'03 / SEARCH & RESCUE PROCESS', title:'搜救流程',
        body:['从信息确认到结果归档，流程图直接对应界面反馈；项目仍属于概念原型。'],
        media:[
          {src:'/media/projects/skynet/search-process.webp',alt:'天网寻踪搜救流程图',caption:'搜救流程 · 从任务发布到线索回传',variant:'feature'},
          {src:'/media/projects/skynet/search-process-video.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/skynet/search-process.webp',alt:'天网寻踪APP原型搜救流程演示',caption:'原型演示 · 任务流程交互'}
        ], layout:'skynet-process'
      },
      {
        id:'value-points', label:'04 / PROJECT VALUE', title:'项目价值',
        body:['连接社会力量、任务信息与专业调度，降低参与门槛并扩大搜寻覆盖。'],
        facts:[{label:'01',value:'扩大搜寻覆盖'},{label:'02',value:'降低参与门槛'},{label:'03',value:'保护信息与隐私'}],
        media:[
          {src:'/media/projects/skynet/value-points.webp',alt:'天网寻踪项目价值点',caption:'项目价值点 · 服务机制与用户收益',variant:'feature'}
        ], layout:'skynet-value'
      },
      {
        id:'mobile-ui', label:'05 / MOBILE APP UI', title:'移动端界面',
        body:['移动端原型覆盖任务接收、路线规划、失联者信息、无人机状态、搜寻进度、隐私协议与任务完成等关键节点。横向浏览可以快速比较同一套视觉语言在不同任务状态中的变化。'],
        media:[
          {src:'/media/projects/skynet/app-information-architecture.webp',alt:'天网寻踪APP信息架构',caption:'信息架构'},
          {src:'/media/projects/skynet/app-home.webp',alt:'天网寻踪任务首页',caption:'任务首页'},
          {src:'/media/projects/skynet/app-accept-task.webp',alt:'天网寻踪接受任务页面',caption:'接受任务'},
          {src:'/media/projects/skynet/route-planning.webp',alt:'天网寻踪路线规划',caption:'路线规划'},
          {src:'/media/projects/skynet/app-search-in-progress.webp',alt:'天网寻踪搜寻进行中页面',caption:'开始搜寻'},
          {src:'/media/projects/skynet/app-missing-person-card.webp',alt:'天网寻踪失联者信息卡',caption:'失联者信息'},
          {src:'/media/projects/skynet/background-ui-drone.webp',alt:'天网寻踪无人机状态页',caption:'无人机状态'},
          {src:'/media/projects/skynet/app-task-complete.webp',alt:'天网寻踪任务完成页面',caption:'任务完成'},
          {src:'/media/projects/skynet/app-privacy-agreement.webp',alt:'天网寻踪隐私保护协议页面',caption:'隐私协议'},
          {src:'/media/projects/skynet/app-store.webp',alt:'天网寻踪商城页面',caption:'商城页'}
        ], layout:'skynet-app', strip:{start:0,end:10}
      },
      {
        id:'operations', label:'06 / OPERATIONS INTERFACE', title:'协作流程',
        body:['操纵柄端与后台调度界面分别对应一线执行和统筹管理：前者聚焦飞行与任务操作，后者聚焦资源分发、搜寻进度和信息回传。','这些界面用于概念服务演示，不表述为已完成真实后端、数据接口或无人机控制系统。'],
        media:[
          {src:'/media/projects/skynet/interface-overview.webp',alt:'天网寻踪界面效果总览',caption:'界面效果图 · APP 多状态并置',variant:'feature'},
          {src:'/media/projects/skynet/controller-interface.webp',alt:'天网寻踪无人机操纵柄界面',caption:'操纵柄界面 · 执行端'},
          {src:'/media/projects/skynet/controller-interface.webp',alt:'天网寻踪无人机操纵柄界面高清稿',caption:'操纵柄界面 · 任务控制'},
          {src:'/media/projects/skynet/controller-recognition.webp',alt:'天网寻踪操纵柄人脸识别任务界面',caption:'操纵柄界面 · 识别反馈'},
          {src:'/media/projects/skynet/command-dashboard.webp',alt:'天网寻踪公安任务调度后台',caption:'调度后台 · 资源与状态总览'},
          {src:'/media/projects/skynet/drone-hero.webp',alt:'天网寻踪概念无人机',caption:'概念载体 · 无人机视觉设定'},
          {src:'/media/projects/skynet/drone-top-view.webp',alt:'天网寻踪概念无人机俯视图',caption:'概念载体 · 无人机俯视图'}
        ], layout:'skynet-operations'
      },
      {
        id:'boundary', label:'07 / PROJECT BOUNDARY', title:'设计边界',
        body:['项目未进行真实用户测试、专业人士评审、法律合规评审、真实无人机接入或实际搜救验证。禁飞区、天气、续航、弱网、操作者资质、保险责任与数据保存仅在概念层面考虑。','正式推进需要围绕真实用户可用性、公安协作流程、隐私与数据安全、无人机运营约束和极端环境可靠性继续验证。'],
        facts:[{label:'NOT TESTED',value:'真实搜救 / 后端接入'},{label:'NEXT',value:'可用性与合规验证'},{label:'BOUNDARY',value:'概念服务原型'}], layout:'skynet-boundary'
      },
    ],
  },
  'other-works': {
    order:'05', title:'Other Works｜跨媒介设计', titleEn:'VISUAL · MOTION · 3D · INDUSTRIAL',
    subtitle:'精选赛事、动画、三维与工业涂装作品。',
    meta:['2023—2025','SELECTED ARCHIVE','MULTI-MEDIA'], role:'视觉设计 / 动态设计 / 三维建模 / 工业涂装', hero:'/media/projects/other-works/future-aircraft-cover.webp', heroPosition:'center', accent:'#846bff',
    sections:[
      {
        id:'aircraft', label:'01 / OFFICIAL KEY VISUAL', title:'把“智驭空天”组织成一套可公开传播的赛事主视觉。',
        body:['面向第十一届中国研究生未来飞行器创新大赛，研究生院采用我的主视觉方向；我负责核心视觉定性与后续物料延展。','以 Midjourney、即梦完成前期意象探索，再使用 Photoshop 与 Illustrator 完成色彩、主题字、航迹图形和信息系统。方案获官方采用并公开发布。'],
        facts:[{label:'TIME',value:'2025.11'},{label:'ROLE',value:'主视觉设计'},{label:'STATUS',value:'官方采用 · 公开发布'}],
        media:[
          {src:'/media/projects/other-works/future-aircraft-cover.webp',alt:'第十一届中国研究生未来飞行器创新大赛主视觉场景',caption:'官方赛事主视觉 · 智驭空天',variant:'feature'},
          {src:'/media/projects/other-works/future-aircraft-assets.webp',alt:'未来飞行器创新大赛主视觉平面物料延展',caption:'从核心视觉到传播物料'},
          {src:'/media/projects/other-works/future-aircraft-on-site.webp',alt:'未来飞行器创新大赛现场视觉应用',caption:'赛事现场 · 多触点视觉统一'}
        ], layout:'archive'
      },
      {
        id:'xiaoxue', label:'03 / DIGITAL ANIMATION', title:'中国电影博物馆环形巨幕“二十四节气 · 小雪”。',
        body:['四人团队中，其他三名成员负责平面视觉，我负责将平面方案转化为 After Effects 动画，完成环形巨幕及多屏动效适配，并输出立屏平面效果。项目最终完成五种屏幕规格并在中国电影博物馆实际播放。','页面按“文化提取 → 动态语言 → 环幕适配 → 五种规格 → 现场播放”组织，并补入现场记录与立屏、地屏、环屏、卷轴屏的动效成片。'],
        facts:[{label:'TIME',value:'2024.10—12'},{label:'DELIVERY',value:'5 种屏幕规格'},{label:'MEDIA STATUS',value:'现场视频与动效已补'}],
        media:[
          {src:'/media/projects/other-works/xiaoxue-cover.webp',alt:'小雪多屏联动动画封面',caption:'小雪 · 多屏联动动画展示',variant:'feature'},
          {src:'/media/projects/other-works/xiaoxue-on-site-video.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪多屏联动动画现场拍摄',caption:'现场视频 · 多屏动画落地'},
          {src:'/media/projects/other-works/xiaoxue-portrait-screen.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪立屏动效',caption:'屏幕动效 · 立屏'},
          {src:'/media/projects/other-works/xiaoxue-floor-screen.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪地屏动效',caption:'屏幕动效 · 地屏'},
          {src:'/media/projects/other-works/xiaoxue-ring-screen.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪环屏动效',caption:'屏幕动效 · 环屏'},
          {src:'/media/projects/other-works/xiaoxue-scroll-screen.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪卷轴屏动效',caption:'屏幕动效 · 卷轴屏'},
          {src:'/media/projects/other-works/xiaoxue-on-site.webp',alt:'小雪多屏动画现场效果',caption:'现场落地 · 小雪主题'},
          {src:'/media/projects/other-works/xiaoxue-multiscreen-installation.webp',alt:'二十四节气多屏动画落地效果',caption:'现场落地 · 多屏联动'},
          {src:'/media/projects/other-works/xiaoxue-animation-debug.webp',alt:'小雪动画联屏修改与调试',caption:'设计调试 · 联屏预览'},
          {src:'/media/projects/other-works/xiaoxue-screen-calibration.webp',alt:'小雪项目屏幕精确尺寸核对',caption:'设计调试 · 屏幕尺寸核对'}
        ], layout:'xiaoxue'
      },
      {
        id:'modeling', label:'04 / 3D MODELING', title:'IP 设计 · 三维建模练习。',
        body:['三维部分精选本科阶段独立完成的建模与渲染练习，展示从造型语言、结构塑造到材质和场景氛围的完整视觉表达。当前素材以龙马 IP“绝尘”为主案例，并保留后续增加 3—5 件作品的扩展位置。','“绝尘”以河南龙马神兽为原型，将传统图形、祥云和现代 IP 比例结合，形成明亮、轻盈且具有祝愿意味的角色形象。'],
        media:[
          {src:'/media/projects/other-works/modeling-cover-main.webp',alt:'三维建模练习合集',caption:'3D Modeling · 练习合集',variant:'feature'},
          {src:'/media/projects/other-works/modeling-cover.webp',alt:'龙马IP绝尘三维建模作品',caption:'绝尘 JUECHEN · IP 设计、建模与渲染'},
          {src:'/media/projects/other-works/modeling-ip.webp',alt:'三维IP角色造型与渲染练习',caption:'角色造型与材质细节'},
          {src:'/media/projects/other-works/modeling-liquor-ip.webp',alt:'八旗酒集酒小旗IP与移动展卖一体车设计',caption:'酒小旗 IP · 三维建模与展卖设计'},
          {src:'/media/projects/other-works/modeling-longma-triple-view.webp',alt:'龙腾腾IP三视图',caption:'龙腾腾 IP · 三视图'},
          {src:'/media/projects/other-works/modeling-longma-showcase.webp',alt:'龙腾腾IP形象设计展示',caption:'龙腾腾 IP · 形象展示'}
        ], layout:'modeling'
      },
      {
        id:'crrc', label:'05 / INDUSTRIAL LIVERY', title:'让二维图形跨越真实工业结构。',
        body:['系列项目覆盖中国中车 QBAA1 型纯电动力机车、泰国 SRT QSGJC-120 轨检车和几内亚 CTG 设备。我负责涂装主视觉与平面效果图、三维效果预览，并根据车体结构、开孔、门窗与生产反馈持续调整图形落位。','三款方案均进入实际生产。以下不使用旧 PPT 版面，而是把设计说明、色彩、二维图形、三维视图与落地证据重新组织为适合网页浏览的连续档案。'],
        facts:[{label:'PERIOD',value:'2024.01—2025.12'},{label:'CARRIER',value:'3 类轨道交通载体'},{label:'STATUS',value:'均已生产应用'}],
        media:[
          {src:'/media/projects/other-works/crrc-cover-main.webp',alt:'轨道交通装备涂装设计封面',caption:'Rail transit · 涂装设计合集',variant:'feature'},
          {src:'/media/projects/other-works/crrc-three-vehicles.webp',alt:'中国中车三款轨道交通设备涂装设计总览',caption:'QBAA1 · QSGJC-120 · CTG',variant:'feature'},
          {src:'/media/projects/other-works/crrc-qbaa1-board.webp',alt:'QBAA1纯电动力机车涂装设计方案',caption:'QBAA1 · 纯电动力机车'},
          {src:'/media/projects/other-works/crrc-srt-board.webp',alt:'QSGJC-120轨检车涂装设计方案',caption:'QSGJC-120 · 轨检车'},
          {src:'/media/projects/other-works/crrc-ctg-board.webp',alt:'CTG设备涂装设计方案',caption:'CTG · 设备涂装'}
        ], layout:'crrc', strip:{start:2,end:5}
      },
      {
        id:'qbaa1', label:'04.1 / QBAA1 · SHAGANG', title:'把绿色转型与钢铁力量转化为车体图形。',
        body:['方案围绕沙钢集团“减量化、再利用、资源化”的循环经济理念，将品牌标识中的 S 元素与钢铁结构语言融合；蓝绿主色传达绿色化、智能化与高效化的工业方向。','我从二维纹样与关键识别面出发，对照车体尺寸与结构边界完成图形落位，再通过多视角三维渲染检查比例、转折和视觉重心。页面中的透明车辆 PNG 使用青绿工业渐变、柔和光晕与细线网格作为衬底。'],
        facts:[{label:'TIME',value:'2024.01'},{label:'PARTNER',value:'中国中车 × 沙钢集团'},{label:'PATENT',value:'外观设计专利 · 第二设计人'}],
        media:[
          {src:'/media/projects/other-works/qbaa1-hero.webp',alt:'QBAA1型纯电动力机车涂装设计主视觉',caption:'QBAA1 · 纯电动力机车',variant:'feature'},
          {src:'/media/projects/other-works/qbaa1-pattern.webp',alt:'QBAA1机车涂装纹样设计',caption:'S 元素与钢铁结构语言',variant:'transparent'},
          {src:'/media/projects/other-works/qbaa1-dimensions.webp',alt:'QBAA1机车外观尺寸规范图',caption:'车体尺寸与图形落位边界'},
          {src:'/media/projects/other-works/qbaa1-front.webp',alt:'QBAA1三维渲染前视图',caption:'三维检查 · 前视图',variant:'transparent'},
          {src:'/media/projects/other-works/qbaa1-side.webp',alt:'QBAA1三维渲染侧视图',caption:'三维检查 · 侧视图',variant:'transparent'},
          {src:'/media/projects/other-works/qbaa1-rear.webp',alt:'QBAA1三维渲染后视图',caption:'三维检查 · 后视图',variant:'transparent'},
          {src:'/media/projects/other-works/qbaa1-right.webp',alt:'QBAA1三维渲染右视图',caption:'三维检查 · 右视图',variant:'transparent'}
        ], layout:'rail-design'
      },
      {
        id:'qbaa1-production', label:'04.1B / PRODUCTION PROOF', title:'从三维预览到真实车辆与会展模型。',
        body:['落地视频清晰度有限，因此以较小画幅放在左侧，右侧连续呈现实车和会展模型照片。视频用于证明动态环境中的整体效果，照片用于查看涂装在真实材质、光线与展示尺度下的表现。'],
        media:[
          {src:'/media/projects/other-works/qbaa1-production.mp4',type:'video',mime:'video/mp4',poster:'/media/projects/other-works/qbaa1-production.webp',alt:'QBAA1机车涂装落地视频',caption:'落地视频 · 小画幅记录'},
          {src:'/media/projects/other-works/qbaa1-production.webp',alt:'QBAA1机车涂装实车落地效果',caption:'实车应用'},
          {src:'/media/projects/other-works/qbaa1-exhibition-01.webp',alt:'QBAA1机车会展模型展示一',caption:'会展模型 01'},
          {src:'/media/projects/other-works/qbaa1-exhibition-02.webp',alt:'QBAA1机车会展模型展示二',caption:'会展模型 02'}
        ], layout:'field-proof'
      },
      {
        id:'qsgjc', label:'04.2 / QSGJC-120 · THAILAND SRT', title:'用“翅膀”与盾牌构建速度、覆盖与守护感。',
        body:['设计提取泰国国家铁路局 SRT 标识中的“翅膀”元素：向前展开的斜线表达速度、自由与铁路网络的连接能力，盾牌式前脸强调轨检任务中的保护与安全。黄色建立远距离识别，橙红色强化方向与警示，几何折线连接不同车体表面。','页面按照平面三视图、结构对应视角、三维效果和实车落地顺序展开；透明 PNG 使用暖黄—橙红的发光展台底色，使车辆轮廓与网站深色环境形成清晰层次。'],
        facts:[{label:'TIME',value:'2024.07'},{label:'PARTNER',value:'中国中车 × 泰国 SRT'},{label:'CARRIER',value:'QSGJC-120 轨检车'}],
        media:[
          {src:'/media/projects/other-works/qsgjc-hero.webp',alt:'泰国SRT QSGJC-120轨检车涂装设计主视觉',caption:'QSGJC-120 · 轨检车',variant:'feature'},
          {src:'/media/projects/other-works/qsgjc-flat-overview.webp',alt:'QSGJC-120轨检车平面三视图总览',caption:'平面三视图 · 图形与结构对应'},
          {src:'/media/projects/other-works/qsgjc-flat-side.webp',alt:'QSGJC-120轨检车平面侧视图',caption:'平面图 · 侧视'},
          {src:'/media/projects/other-works/qsgjc-flat-top.webp',alt:'QSGJC-120轨检车平面俯视图',caption:'平面图 · 俯视'},
          {src:'/media/projects/other-works/qsgjc-three-quarter.webp',alt:'QSGJC-120轨检车三维半侧视图',caption:'三维渲染 · 半侧视',variant:'transparent'},
          {src:'/media/projects/other-works/qsgjc-side.webp',alt:'QSGJC-120轨检车三维侧视图',caption:'三维渲染 · 侧视',variant:'transparent'},
          {src:'/media/projects/other-works/qsgjc-top.webp',alt:'QSGJC-120轨检车三维俯视图',caption:'三维渲染 · 俯视',variant:'transparent'},
          {src:'/media/projects/other-works/qsgjc-rear.webp',alt:'QSGJC-120轨检车三维后视图',caption:'三维渲染 · 后视',variant:'transparent'}
        ], layout:'rail-design'
      },
      {
        id:'qsgjc-production', label:'04.2B / PRODUCTION PROOF', title:'设计最终进入真实轨检车。',
        body:['三张现场照片以相同高度连续展示，从半侧、正侧与正面验证涂装在车体尺度、结构转折和环境光线中的实际效果。'],
        media:[
          {src:'/media/projects/other-works/qsgjc-production-01.webp',alt:'QSGJC-120轨检车实拍半侧视图',caption:'落地实拍 · 半侧视'},
          {src:'/media/projects/other-works/qsgjc-production-02.webp',alt:'QSGJC-120轨检车实拍侧视图',caption:'落地实拍 · 侧视'},
          {src:'/media/projects/other-works/qsgjc-production-03.webp',alt:'QSGJC-120轨检车实拍正视图',caption:'落地实拍 · 正视'}
        ], layout:'archive'
      },
      {
        id:'ctg', label:'04.3 / CTG · GUINEA', title:'把品牌标识转译成连续跨越车身的运输图形。',
        body:['CTG 设备方案以品牌蓝与青绿色建立稳定、清晰的识别系统，将标识的几何转折延展为贯穿长车身的图形骨架。设计同时处理前脸、侧面和尾部的连续关系，使不同观看角度仍保持明确的品牌归属。','我负责平面涂装与三维预览，并根据设备结构继续调整落位；后续喷漆由工艺团队完成。透明车辆素材置于深海蓝—青绿色的层叠背景中，强调大型工业设备的尺度与可靠感。'],
        facts:[{label:'TIME',value:'2025.12'},{label:'PARTNER',value:'中国中车 × 几内亚 CTG'},{label:'STATUS',value:'生产应用'}],
        media:[
          {src:'/media/projects/other-works/ctg-hero.webp',alt:'几内亚CTG设备涂装设计主视觉',caption:'CTG · 设备涂装方案',variant:'feature'},
          {src:'/media/projects/other-works/ctg-design-source.webp',alt:'CTG设备涂装图形与颜色设计源稿',caption:'品牌色与图形基因'},
          {src:'/media/projects/other-works/ctg-flat-views.webp',alt:'CTG设备涂装平面四视图',caption:'平面四视图 · 连续落位'},
          {src:'/media/projects/other-works/ctg-render-overview.webp',alt:'CTG设备涂装三维效果总览',caption:'三维效果总览',variant:'transparent'},
          {src:'/media/projects/other-works/ctg-three-quarter.webp',alt:'CTG设备三维半侧视图',caption:'三维渲染 · 半侧视',variant:'transparent'},
          {src:'/media/projects/other-works/ctg-side.webp',alt:'CTG设备三维侧视图',caption:'三维渲染 · 侧视',variant:'transparent'},
          {src:'/media/projects/other-works/ctg-front.webp',alt:'CTG设备三维正视图',caption:'三维渲染 · 正视',variant:'transparent'}
        ], layout:'rail-design'
      },
      {
        id:'ctg-production', label:'04.3B / PRODUCTION PROOF', title:'平面方案、三维预览与喷漆成品形成闭环。',
        body:['现场图展示最终喷漆设备的多角度效果。网站只把涂装视觉与结构适配归为个人职责，不将工艺制造或设备工程设计写成个人成果。'],
        media:[
          {src:'/media/projects/other-works/ctg-production-01.webp',alt:'CTG设备涂装生产实拍一',caption:'生产应用 01'},
          {src:'/media/projects/other-works/ctg-production-02.webp',alt:'CTG设备涂装生产实拍二',caption:'生产应用 02'},
          {src:'/media/projects/other-works/ctg-production-03.webp',alt:'CTG设备涂装生产实拍三',caption:'生产应用 03'}
        ], layout:'archive'
      },
      {
        id:'patents', label:'05.4 / PATENTS & PUBLIC PROOF', title:'用公开证明收束项目，而不是放大职责。',
        body:['QBAA1 对应“智能电动轨道机车”外观设计专利，本人为第二设计人；相关结构实用新型专利属于多人团队成果，本人为第二发明人，但不以此暗示本人负责工程结构设计。QSGJC-120 与 QBAA1 的宣传册页面用于证明公开应用。','四份证明材料采用横向浏览，保持证书与页面完整比例，悬停时仅轻微放大。'],
        media:[
          {src:'/media/projects/other-works/proof-qsgjc.webp',alt:'轨道交通工程装备宣传册中的QSGJC-120轨检车',caption:'公开应用证明 · QSGJC-120'},
          {src:'/media/projects/other-works/proof-qbaa1.webp',alt:'轨道交通工程装备宣传册中的QBAA1型纯电动力机车',caption:'公开应用证明 · QBAA1'},
          {src:'/media/projects/other-works/patent-design-new.webp',alt:'智能电动轨道机车外观设计专利证书',caption:'外观设计专利 · 第二设计人'},
          {src:'/media/projects/other-works/patent-utility-new.webp',alt:'智能电动轨道机车结构实用新型专利证书',caption:'团队成果 · 实用新型专利'}
        ], strip:{start:0,end:4}
      },
      {
        id:'forum', label:'02 / VISUAL SYSTEM', title:'AI+ · 设计未来学术论坛：让一套视觉系统覆盖整场活动。',
        body:['围绕“AI × 设计未来”进行行业资料与竞品分析，并与主办方及项目成员确认活动定位、传播需求和应用场景。我负责主视觉方向，并将其延展至会议手册、宣传物料、导视与线下空间。','本节不重复讲解主视觉生成过程，而是重点展示同一套图形语言如何适配舞台大屏、桌面物料与现场导视，支持 400+ 线下参与者的完整活动体验。'],
        facts:[{label:'TIME',value:'2025.11—12'},{label:'ROLE',value:'主视觉设计'},{label:'SCALE',value:'400+ 线下参与者'}],
        media:[
          {src:'/media/projects/other-works/forum-cover.webp',alt:'AI设计未来学术论坛主视觉场景',caption:'学术年会主视觉 · 舞台应用',variant:'feature'},
          {src:'/media/projects/other-works/forum-assets.webp',alt:'AI设计未来学术论坛物料延展',caption:'会议手册、宣传物料与导视延展'},
          {src:'/media/projects/other-works/forum-on-site.webp',alt:'AI设计未来学术论坛现场视觉效果',caption:'线下空间与活动现场'}
        ], layout:'archive'
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return {};
  return {
    title: `${project.title}｜邵歆晔作品集`,
    description: project.subtitle,
    openGraph: { title: project.title, description: project.subtitle, images: [{ url: project.hero }] },
    twitter: { card: 'summary_large_image', title: project.title, description: project.subtitle, images: [project.hero] },
  };
}

function MediaFigure({ media }: { media: ProjectMedia }) {
  return <figure className={[media.variant ? `media-${media.variant}` : '',media.type === 'video' ? 'media-video' : ''].filter(Boolean).join(' ') || undefined}>{media.type === 'video' ? <video muted playsInline controls preload="metadata" poster={media.poster} aria-label={media.alt}><source src={media.src} type={media.mime || 'video/webm'} /></video> : <img src={media.src} alt={media.alt} loading="lazy" decoding="async"/>} {media.caption&&<figcaption>{media.caption}</figcaption>}</figure>;
}

function ProjectMediaGallery({ section }: { section: ProjectSection }) {
  if (!section.media) return null;
  const layout = section.layout || 'default';
  if (layout === 'ua-rail') return <UaWeeklyRails items={section.media} />;
  if (layout === 'longform-preview') return <LongformPreviewRail items={section.media} />;
  if (layout === 'modeling') return <ModelingGallery items={section.media} />;
  if (layout === 'xiaoxue') {
    const [cover, onSiteVideo, ...remainingMedia] = section.media;
    const screenVideos = remainingMedia.slice(0, 4);
    const processImages = remainingMedia.slice(4);
    return <>
      <div className="detail-gallery gallery-layout-xiaoxue"><MediaFigure media={cover} /></div>
      <div className="detail-gallery gallery-layout-xiaoxue"><MediaFigure media={onSiteVideo} /></div>
      <div className="xiaoxue-video-grid" aria-label="小雪各屏幕动效视频">
        {screenVideos.map((media) => <MediaFigure media={media} key={media.src} />)}
      </div>
      <div className="media-strip strip-xiaoxue" aria-label={`${section.title}横向作品浏览`}>
        {processImages.map((media) => <MediaFigure media={media} key={media.src} />)}
      </div>
    </>;
  }
  if (layout === 'netease-boards') {
    const boards = section.media.filter((media) => media.type !== 'video');
    const videos = section.media.filter((media) => media.type === 'video');
    return <>
      {boards.length > 0 && <div className="detail-gallery gallery-layout-netease-boards">{boards.map((media) => <MediaFigure media={media} key={media.src} />)}</div>}
      {videos.length > 0 && <div className="netease-video-output"><p>VIDEO OUTPUT / 视频成片</p><div className="detail-gallery netease-drama-row">{videos.slice(0, 3).map((media) => <MediaFigure media={media} key={media.src} />)}</div>{videos.length > 3 && <div className="detail-gallery netease-video-output-grid">{videos.slice(3).map((media) => <MediaFigure media={media} key={media.src} />)}</div>}</div>}
    </>;
  }
  if (!section.strip) return <div className={`detail-gallery gallery-${Math.min(section.media.length,3)} gallery-layout-${layout}`}>{section.media.map((media)=><MediaFigure media={media} key={media.src}/>)}</div>;
  const before = section.media.slice(0,section.strip.start);
  const strip = section.media.slice(section.strip.start,section.strip.end);
  const after = section.media.slice(section.strip.end);
  return <>
    {before.length>0&&<div className={`detail-gallery gallery-layout-${layout} gallery-before-strip`}>{before.map((media)=><MediaFigure media={media} key={media.src}/>)}</div>}
    <div className={`media-strip strip-${section.id}`} aria-label={`${section.title}横向作品浏览`}>{strip.map((media)=><MediaFigure media={media} key={media.src}/>)}</div>
    {after.length>0&&<div className={`detail-gallery gallery-layout-${layout} gallery-after-strip`}>{after.map((media)=><MediaFigure media={media} key={media.src}/>)}</div>}
  </>;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();
  const slugs = Object.keys(projects);
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const next = projects[nextSlug];
  const tocTranslations: Record<string, string> = {
    overview:'项目概览', channel:'渠道资产', console:'主机上线', ua:'北美 UA', 'ai-video':'AI 视频与剪辑',
    context:'项目背景', workflow:'工作流程', brand:'品牌内容系统', research:'调研', system:'设计系统', people:'服务对象',
    problem:'问题洞察', process:'设计过程', result:'成果展示', summary:'项目总结', visual:'视觉设计', strategy:'策略',
  };
  const hiddenSectionIds = slug === 'other-works'
    ? new Set(['qbaa1','qbaa1-production','qsgjc','qsgjc-production','ctg','ctg-production'])
    : new Set<string>();
  const visibleSections = project.sections.filter((section) => !hiddenSectionIds.has(section.id));
  if (slug === 'other-works') {
    const order = ['aircraft','forum','xiaoxue','modeling','crrc','patents'];
    visibleSections.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }
  const tocSections = slug === 'other-works'
    ? visibleSections.filter((section) => ['aircraft','forum','xiaoxue','modeling','crrc'].includes(section.id))
    : visibleSections;
  const otherWorksToc: Record<string, { capability: string; project: string }> = {
    aircraft: { capability: '主视觉设计 + 项目落地能力', project: '赛事主视觉 · 智驭空天' },
    forum: { capability: '主视觉设计 + 项目落地能力', project: 'AI+ · 设计未来学术论坛' },
    xiaoxue: { capability: '数字动画设计能力', project: '小雪 · 环幕多屏动画' },
    modeling: { capability: 'IP 设计 · 三维建模练习', project: '个人三维建模作品集' },
    crrc: { capability: '平面图形设计能力', project: '轨道交通装备涂装' },
  };

  return (
    <main className={`detail-page project-${slug}`} style={{ '--project-accent': project.accent } as CSSProperties}>
      {slug === 'netease-once-human' && <Grainient className="netease-grainient" color1="#102d62" color2="#4c1f54" color3="#03050b" timeSpeed={0.16} warpStrength={0.62} warpFrequency={3.4} warpSpeed={0.55} grainAmount={0.075} grainScale={1.6} contrast={1.4} saturation={0.9} zoom={1.05} />}
      <header className="detail-header">
        <Link href="/" className="wordmark">SHAO XINYE <span>PORTFOLIO · 2026</span></Link>
        <Link href="/#work">ALL PROJECTS ×</Link>
      </header>

      <section className="project-hero-detail">
        <div className="detail-title-row">
          <span className="detail-order">PROJECT {project.order}</span>
          <div><h1>{project.title}</h1><p>{project.titleEn}</p></div>
        </div>
        <div className="detail-hero-media">{project.heroVideo ? <video autoPlay muted loop playsInline controls poster={project.hero} aria-label={`${project.title}项目动态主视觉`}><source src={project.heroVideo} type="video/webm" /></video> : <img src={project.hero} alt={`${project.title}项目主视觉`} style={{ objectPosition: project.heroPosition || 'center' }} />}</div>
        <div className={`detail-intro${project.introMedia ? ' detail-intro-with-media' : ''}`}>
          {project.introMedia && <MediaFigure media={project.introMedia} />}
          <div className="detail-intro-copy"><p>{project.subtitle}</p></div>
          <dl><div><dt>ROLE</dt><dd>{project.role}</dd></div>{project.meta.map((item,index)=><div key={item}><dt>{index===0?'TIME':index===1?'TEAM / CONTEXT':'TYPE'}</dt><dd>{item}</dd></div>)}</dl>
        </div>
      </section>

      <div className="detail-layout">
        <aside className="detail-toc"><span>CONTENTS / 目录</span>{tocSections.map((section, index) => {
          const tocItem = slug === 'other-works' ? otherWorksToc[section.id] : undefined;
          return <a href={`#${section.id}`} key={section.id} className={tocItem ? 'toc-capability' : undefined}><strong>{String(index + 1).padStart(2,'0')} / {tocItem?.capability || tocTranslations[section.id] || section.title}</strong><small>{tocItem?.project || section.label.replace(/^\d+\s*\/\s*/, '')}</small></a>;
        })}</aside>
        <article id="summary" className="detail-sections">
          {visibleSections.map((section)=>(
            <section id={section.id} className="detail-section" key={section.id}>
              <span className="detail-label">{section.label}</span><h2>{section.title}</h2>
              <div className="detail-body">{section.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</div>
              {section.steps && <ol className="process-list">{section.steps.map((step,index)=><li key={step}><span>{String(index+1).padStart(2,'0')}</span>{step}</li>)}</ol>}
              {section.facts && <div className="detail-facts">{section.facts.map((fact)=><div className="detail-fact" key={fact.label} style={fact.color ? { '--fact-color': fact.color } as CSSProperties : undefined}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}</div>}
              <ProjectMediaGallery section={section}/>
            </section>
          ))}
        </article>
      </div>

      <Link className="next-project" href={`/projects/${nextSlug}`}>
        <span>NEXT PROJECT · {next.order}</span><strong>{next.title}</strong><i>↗</i>
      </Link>
    </main>
  );
}
