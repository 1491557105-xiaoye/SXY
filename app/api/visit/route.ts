import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

type DayStat = { pv: number; visitors: string[] };
type GeoInfo = { loc: string; isp: string; at: number };
type VisitRecord = {
  id: string;
  t: string; // visit time, Asia/Shanghai "YYYY-MM-DD HH:mm:ss"
  ip: string;
  loc: string; // "中国 广东省 深圳市"
  isp: string; // carrier / network operator
  path: string;
  ref: string; // referrer host
  dev: string; // "手机 · Chrome · iOS"
  vid: string; // anonymous visitor id
};
type Store = {
  v: number;
  days: Record<string, DayStat>;
  visits: VisitRecord[];
  geo: Record<string, GeoInfo>;
};

const DATA_DIR = path.join(process.cwd(), '.visit-data');
const DATA_FILE = path.join(DATA_DIR, 'visits.json');
const STATS_TOKEN = process.env.VISIT_STATS_TOKEN || 'sx-stats-2026';
const MAX_VISITS = 3000;
const MAX_GEO = 3000;

let memory: Store | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function emptyStore(): Store {
  return { v: 2, days: {}, visits: [], geo: {} };
}

function load(): Store {
  if (memory) return memory;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Store>;
    if (parsed && typeof parsed === 'object' && parsed.days && typeof parsed.days === 'object') {
      memory = {
        v: 2,
        days: parsed.days,
        visits: Array.isArray(parsed.visits) ? parsed.visits : [],
        geo: parsed.geo && typeof parsed.geo === 'object' ? parsed.geo : {},
      };
      return memory;
    }
  } catch {
    /* first run or unreadable: fall through */
  }
  memory = emptyStore();
  return memory;
}

function saveNow(store: Store): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store), 'utf8');
  } catch {
    /* keep in-memory copy even if disk write fails */
  }
}

// Coalesce bursts of visits into one disk write.
function saveSoon(store: Store): void {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveNow(store);
  }, 400);
}

function nowCST(): string {
  const d = new Date(Date.now() + 8 * 3600 * 1000);
  return d.toISOString().slice(0, 10) + ' ' + d.toISOString().slice(11, 19);
}

function todayKey(): string {
  // Fixed CST (UTC+8) so a "day" matches the owner's calendar day.
  return nowCST().slice(0, 10);
}

function isPrivate(ip: string): boolean {
  return (
    !ip ||
    ip === 'unknown' ||
    ip === '::1' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^f[cd]/i.test(ip)
  );
}

function normalizeIp(raw: string): string {
  let ip = (raw || '').trim();
  if (!ip) return '';
  // "ip:port" / "[v6]:port"
  const bracketed = ip.match(/^\[([^\]]+)\]/);
  if (bracketed) ip = bracketed[1];
  else if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.split(':')[0];
  ip = ip.replace(/^::ffff:/i, '');
  return ip;
}

function clientIp(request: Request): string {
  const h = request.headers;
  const candidates = [
    h.get('cf-connecting-ip'),
    h.get('true-client-ip'),
    h.get('x-real-ip'),
    h.get('x-client-ip'),
    h.get('fastly-client-ip'),
    h.get('x-cluster-client-ip'),
  ];
  for (const value of candidates) {
    const ip = normalizeIp(value || '');
    if (ip && !isPrivate(ip)) return ip;
  }
  const xff = h.get('x-forwarded-for');
  if (xff) {
    for (const part of xff.split(',')) {
      const ip = normalizeIp(part);
      if (ip && !isPrivate(ip)) return ip;
    }
  }
  const fwd = h.get('forwarded');
  if (fwd) {
    const m = fwd.match(/for="?\[?([^;,"\]]+)/i);
    if (m) {
      const ip = normalizeIp(m[1]);
      if (ip && !isPrivate(ip)) return ip;
    }
  }
  const raw = h.get('x-forwarded-for');
  return raw ? normalizeIp(raw.split(',')[0]) || 'unknown' : 'unknown';
}

function classifyUA(ua: string): string {
  if (!ua) return '未知';
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobile|iPhone|iPod|Android|HarmonyOS|MiuiBrowser|MicroMessenger/i.test(ua);
  const device = isTablet ? '平板' : isMobile ? '手机' : '电脑';
  const os = /iPhone|iPad|iPod/i.test(ua)
    ? 'iOS'
    : /HarmonyOS/i.test(ua)
      ? 'HarmonyOS'
      : /Android/i.test(ua)
        ? 'Android'
        : /Mac OS X/i.test(ua)
          ? 'macOS'
          : /Windows/i.test(ua)
            ? 'Windows'
            : /Linux/i.test(ua)
              ? 'Linux'
              : '';
  const browser = /MicroMessenger/i.test(ua)
    ? '微信'
    : /Edg\//i.test(ua)
      ? 'Edge'
      : /OPR\/|Opera/i.test(ua)
        ? 'Opera'
        : /Firefox\//i.test(ua)
          ? 'Firefox'
          : /Chrome\//i.test(ua)
            ? 'Chrome'
            : /Safari\//i.test(ua)
              ? 'Safari'
              : '';
  return [device, browser, os].filter(Boolean).join(' · ');
}

function refHost(ref: string): string {
  if (!ref) return '直接访问';
  try {
    const u = new URL(ref);
    if (u.origin === 'null' || !u.hostname) return '直接访问';
    return u.hostname;
  } catch {
    return '直接访问';
  }
}

// Mask the host part of an IP for exports that leave this server ("125.94.*.*"),
// keeping the region meaningful while dropping identifying detail.
function maskIp(ip: string): string {
  if (!ip || ip === 'unknown') return ip || 'unknown';
  if (ip.includes(':')) {
    const groups = ip.split(':').filter(Boolean);
    return groups.slice(0, 2).join(':') + '::*';
  }
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip;
}

async function fetchJson(url: string, ms = 2500): Promise<Record<string, unknown> | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-visit-stats/1.0)' },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Candidate free, key-less geolocation services. Chinese-capable ones first.
const GEO_PROVIDERS: { name: string; url: (ip: string) => string }[] = [
  { name: 'ip-api.com', url: (ip) => `http://ip-api.com/json/${encodeURIComponent(ip)}?lang=zh-CN&fields=status,country,regionName,city,isp` },
  { name: 'pconline', url: (ip) => `https://whois.pconline.com.cn/ipJson.jsp?ip=${encodeURIComponent(ip)}&json=true` },
  { name: 'vore.top', url: (ip) => `https://api.vore.top/api/IPdata?ip=${encodeURIComponent(ip)}` },
  { name: 'baidu-qifu', url: (ip) => `https://qifu-api.baidubce.com/ip/geo/v1/district?ip=${encodeURIComponent(ip)}` },
  { name: 'ipwho.is', url: (ip) => `https://ipwho.is/${encodeURIComponent(ip)}?lang=zh` },
  { name: 'ipapi.co', url: (ip) => `https://ipapi.co/${encodeURIComponent(ip)}/json/` },
  { name: 'ip.sb', url: (ip) => `https://api.ip.sb/geoip/${encodeURIComponent(ip)}` },
  { name: 'ipinfo.io', url: (ip) => `https://ipinfo.io/${encodeURIComponent(ip)}/json` },
];

// Decode a GBK-encoded response body (some Chinese services still ship GBK).
async function fetchGbk(url: string, ms = 4000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    try {
      return new TextDecoder('gbk').decode(buf);
    } catch {
      return new TextDecoder('utf-8').decode(buf);
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Free, key-less IP geolocation. Order: fast Chinese source, then a slower
// Chinese source, then English ones (their romanised regions get translated).
async function lookupGeo(ip: string): Promise<{ loc: string; isp: string; provider: string }> {
  // 1) pconline — Chinese, ~0.2s.
  const p = await fetchGbk(`https://whois.pconline.com.cn/ipJson.jsp?ip=${encodeURIComponent(ip)}&json=true`);
  if (p) {
    try {
      const j = JSON.parse(p) as { pro?: string; city?: string; addr?: string };
      const pro = (j.pro || '').trim();
      if (pro && !/局域网|未知/.test(pro)) {
        const loc = cleanLoc(['中国', pro, (j.city || '').trim()]);
        if (loc) {
          const isp = (j.addr || '').trim().split(/\s+/).slice(1).join(' ');
          return { loc, isp, provider: 'pconline' };
        }
      }
    } catch {
      /* fall through to next provider */
    }
  }

  // 2) ip-api.com — proper Chinese names, but ~2.4s (hence the long timeout).
  const a = (await fetchJson(`http://ip-api.com/json/${encodeURIComponent(ip)}?lang=zh-CN&fields=status,country,regionName,city,isp`, 6000)) as
    | { status?: string; country?: string; regionName?: string; city?: string; isp?: string }
    | null;
  if (a && a.status === 'success') {
    return {
      loc: cleanLoc([a.country, a.regionName, a.city]),
      isp: a.isp || '',
      provider: 'ip-api.com',
    };
  }

  // 3) ipwho.is — HTTPS, English place names.
  const b = (await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}?lang=zh`)) as
    | { success?: boolean; country?: string; region?: string; city?: string; connection?: { isp?: string; org?: string } }
    | null;
  if (b && b.success !== false && (b.country || b.city)) {
    return {
      loc: cleanLoc([b.country, b.region, b.city]),
      isp: b.connection?.isp || b.connection?.org || '',
      provider: 'ipwho.is',
    };
  }

  // 4) ip.sb — HTTPS, English place names.
  const c = (await fetchJson(`https://api.ip.sb/geoip/${encodeURIComponent(ip)}`)) as
    | { country?: string; region?: string; city?: string; isp?: string; organization?: string }
    | null;
  if (c && (c.country || c.city)) {
    return {
      loc: cleanLoc([c.country, c.region, c.city]),
      isp: c.isp || c.organization || '',
      provider: 'ip.sb',
    };
  }

  return { loc: '', isp: '', provider: '' };
}

// Normalise provider output into a compact "中国 广东省 广州市" style string.
const CN_COUNTRY: Record<string, string> = {
  china: '中国',
  'hong kong': '中国香港',
  macao: '中国澳门',
  macau: '中国澳门',
  taiwan: '中国台湾',
};

// English providers romanise Chinese regions ("Guangdong Sheng"); map the ones
// that actually show up in traffic back to Chinese so the log stays readable.
const PINYIN_REGION: Record<string, string> = {
  'beijing shi': '北京市',
  'tianjin shi': '天津市',
  'shanghai shi': '上海市',
  'chongqing shi': '重庆市',
  'guangdong sheng': '广东省',
  'zhejiang sheng': '浙江省',
  'jiangsu sheng': '江苏省',
  'shandong sheng': '山东省',
  'henan sheng': '河南省',
  'sichuan sheng': '四川省',
  'hubei sheng': '湖北省',
  'hunan sheng': '湖南省',
  'fujian sheng': '福建省',
  'anhui sheng': '安徽省',
  'hebei sheng': '河北省',
  'shanxi sheng': '山西省',
  'liaoning sheng': '辽宁省',
  'jilin sheng': '吉林省',
  'heilongjiang sheng': '黑龙江省',
  'jiangxi sheng': '江西省',
  'shaanxi sheng': '陕西省',
  'gansu sheng': '甘肃省',
  'yunnan sheng': '云南省',
  'guizhou sheng': '贵州省',
  'guangxi zhuangzu zizhiqu': '广西壮族自治区',
  'hainan sheng': '海南省',
  'ningxia huizu zizhiqu': '宁夏回族自治区',
  'qinghai sheng': '青海省',
  'xinjiang uygur zizhiqu': '新疆维吾尔自治区',
  'xizang zizhiqu': '西藏自治区',
  tibet: '西藏自治区',
  'nei mongol zizhiqu': '内蒙古自治区',
  'inner mongolia': '内蒙古自治区',
};

function cleanLoc(parts: (string | undefined)[]): string {
  const out: string[] = [];
  const country = (parts[0] || '').trim().toLowerCase();
  for (const raw of parts) {
    let value = (raw || '').trim();
    if (!value) continue;
    if (out.length === 0) {
      out.push(CN_COUNTRY[value.toLowerCase()] || value);
      continue;
    }
    // Drop a duplicated country name ("中国 中国 广东") or a repeated segment.
    if (value.toLowerCase() === country) continue;
    if (out[out.length - 1] === value) continue;
    const mapped = PINYIN_REGION[value.toLowerCase()];
    if (mapped) value = mapped;
    if (out[out.length - 1] === value) continue;
    out.push(value);
  }
  return out.slice(0, 3).join(' ');
}

async function enrich(ip: string, visitId: string): Promise<void> {
  const info = await lookupGeo(ip);
  if (!info.loc && !info.isp) return;
  const store = load();
  const keys = Object.keys(store.geo);
  if (keys.length >= MAX_GEO) {
    keys
      .sort((a, b) => (store.geo[a].at || 0) - (store.geo[b].at || 0))
      .slice(0, Math.ceil(MAX_GEO / 4))
      .forEach((k) => delete store.geo[k]);
  }
  store.geo[ip] = { loc: info.loc, isp: info.isp, at: Date.now() };
  // Backfill the record that triggered this lookup, plus any earlier gaps from the same IP.
  for (const v of store.visits) {
    if (v.ip === ip && !v.loc) {
      v.loc = info.loc;
      v.isp = v.isp || info.isp;
    }
  }
  void visitId;
  saveNow(store);
}

function geoFor(request: Request): void {
  const store = load();
  const ip = clientIp(request);
  if (isPrivate(ip) || store.geo[ip]) return;
  void enrich(ip, '');
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const store = load();
  const mode = url.searchParams.get('mode');

  // ---- read-only endpoints (token protected) ----
  if (mode === 'stats' || mode === 'visits' || mode === 'diag' || mode === 'geotest' || mode === 'geoclear' || mode === 'recount') {
    if (url.searchParams.get('token') !== STATS_TOKEN) {
      return new Response('forbidden', { status: 403 });
    }

    if (mode === 'recount') {
      // Drop internal health-check rows and manual probes, then rebuild the
      // per-day PV/UV aggregates from what is left.
      const before = store.visits.length;
      store.visits = store.visits.filter((v) => v.ip !== 'unknown' && !v.path.startsWith('/probe'));
      const days: Record<string, DayStat> = {};
      for (const v of store.visits) {
        const d = v.t.slice(0, 10);
        const rec = days[d] || { pv: 0, visitors: [] };
        rec.pv += 1;
        if (v.vid && !rec.visitors.includes(v.vid) && rec.visitors.length < 50000) {
          rec.visitors.push(v.vid);
        }
        days[d] = rec;
      }
      store.days = days;
      saveNow(store);
      return Response.json({
        ok: true,
        purgedVisits: before - store.visits.length,
        days: Object.keys(days)
          .sort()
          .map((d) => ({ date: d, pv: days[d].pv, uv: days[d].visitors.length })),
      });
    }

    if (mode === 'geoclear') {
      // Drop the IP→location cache and reset records that only hold a
      // romanised location, so they get re-resolved in Chinese next time.
      const cleared = Object.keys(store.geo).length;
      store.geo = {};
      let reset = 0;
      for (const v of store.visits) {
        if (v.loc && !/[\u4e00-\u9fa5]/.test(v.loc)) {
          v.loc = '';
          v.isp = '';
          reset += 1;
        }
      }
      saveNow(store);
      return Response.json({ ok: true, cleared, reset });
    }

    if (mode === 'geotest') {
      const ip = url.searchParams.get('ip') || clientIp(request);
      const probes = GEO_PROVIDERS.map((p) => ({ name: p.name, url: p.url(ip) }));
      const results = [];
      for (const probe of probes) {
        const started = Date.now();
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        try {
          const res = await fetch(probe.url, { signal: ctrl.signal });
          const text = await res.text();
          results.push({
            name: probe.name,
            status: res.status,
            ms: Date.now() - started,
            sample: text.slice(0, 400),
          });
        } catch (err) {
          results.push({ name: probe.name, status: 0, ms: Date.now() - started, error: String(err) });
        } finally {
          clearTimeout(timer);
        }
      }
      return Response.json({ ok: true, ip, results });
    }

    if (mode === 'diag') {
      const ip = clientIp(request);
      const geo = isPrivate(ip) ? { loc: '', isp: '', provider: 'skipped' } : await lookupGeo(ip);
      return Response.json({
        ok: true,
        detectedIp: ip,
        privateIp: isPrivate(ip),
        geo,
        serverTimeCST: nowCST(),
      });
    }

    if (mode === 'visits') {
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 200, 1), MAX_VISITS);
      const since = url.searchParams.get('since') || '';
      const wantMask = url.searchParams.get('mask') === '1';
      const includeRaw = url.searchParams.get('raw') === '1';
      const all = store.visits.filter((v) => {
        if (since && v.t <= since) return false;
        // Keep health checks and manual probes out of the exported report.
        if (!includeRaw && (v.ip === 'unknown' || v.path.startsWith('/probe'))) return false;
        return true;
      });
      const visits = all
        .slice(-limit)
        .map((v) => (wantMask ? { ...v, ip: maskIp(v.ip) } : v));
      return Response.json({
        ok: true,
        total: store.visits.length,
        returned: visits.length,
        masked: wantMask,
        visits,
        generatedAt: new Date().toISOString(),
      });
    }

    const days = Object.keys(store.days)
      .sort()
      .map((date) => ({
        date,
        pv: store.days[date].pv,
        uv: store.days[date].visitors.length,
      }));
    const byLoc = new Map<string, number>();
    for (const v of store.visits) {
      const key = v.loc || '未知';
      byLoc.set(key, (byLoc.get(key) || 0) + 1);
    }
    const topLocations = [...byLoc.entries()]
      .map(([loc, pv]) => ({ loc, pv }))
      .sort((a, b) => b.pv - a.pv)
      .slice(0, 20);
    return Response.json({
      ok: true,
      days,
      topLocations,
      recentVisits: store.visits
        .slice(-50)
        .map((v) => (url.searchParams.get('mask') === '1' ? { ...v, ip: maskIp(v.ip) } : v)),
      generatedAt: new Date().toISOString(),
    });
  }

  // ---- default: record one page view ----
  const ip = clientIp(request);
  // Requests with no resolvable client IP are internal health checks / the
  // hosting platform's own page verification, not real visitors — ignore them
  // so PV and UV stay truthful.
  if (isPrivate(ip)) {
    return new Response(null, { status: 204 });
  }

  const day = todayKey();
  const vid = (url.searchParams.get('v') || '').slice(0, 64);
  const rec = store.days[day] || { pv: 0, visitors: [] };
  rec.pv += 1;
  if (vid && !rec.visitors.includes(vid) && rec.visitors.length < 50000) {
    rec.visitors.push(vid);
  }
  store.days[day] = rec;

  const cached = store.geo[ip];
  const record: VisitRecord = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    t: nowCST(),
    ip,
    loc: cached?.loc || '',
    isp: cached?.isp || '',
    path: (url.searchParams.get('p') || '/').slice(0, 200),
    ref: refHost(url.searchParams.get('r') || ''),
    dev: classifyUA(request.headers.get('user-agent') || ''),
    vid,
  };
  store.visits.push(record);
  if (store.visits.length > MAX_VISITS) {
    store.visits.splice(0, store.visits.length - MAX_VISITS);
  }
  saveSoon(store);

  // Resolve location in the background so the beacon stays instant.
  geoFor(request);

  return new Response(null, { status: 204 });
}
