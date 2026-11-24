// 확장 페이지(2026-11-24, 약 4,000쪽) — 법률사무소 레이 모범 구조: 분류 줄 → h1(키워드+수식어) → 설명 → 핵심 요약 상자 → 번호 절 6개(한 문단) → FAQ → 관련 링크.
// 키워드: data/fr-extra.json (dorothypet_prj scripts/build_fr_expand.py), 주제 글: data/topics/*.json (지침 data/topics/_BRIEF.md, 검사 scripts/check_topics.py)
// 유형: wt=업종×주제 / rwt=시도×업종×주제 / rw=지역×새 업종어 / gw=구×업종어. 지역 페이지(rw·gw)는 주제 30개에서 절을 하나씩 뽑아 쓴다.
// 넣지 않는 것은 compose-fr.ts 와 같다(지역 통계·비용 숫자·수익·매장 손님용 안내).
import fs from 'fs';
import path from 'path';
import extra from '../data/fr-extra.json';
import drip from '../data/drip-x.json';
import { FR_PAGES, FrPage, REGIONS, hash } from './data';
import { BRAND, CONTACT, kwTitle } from './site';
import { josa } from './ko';
import { XW, FRAMES } from './x-words';

export interface Topic { id: string; name: string; h1sub: string[]; lead: string[]; summary: string[]; facts: [string, string][]; sections: { sub: string[]; p: string[] }[]; faq: { q: string; a: string }[] }
export interface XPage { set: 'x'; kw: string; slug: string; kind: 'wt' | 'rwt' | 'rw' | 'gw'; word: string; topic?: string; region?: string; place?: string; wave: number }

const TOPIC_DIR = path.join(process.cwd(), 'data', 'topics');
export const TOPICS: Topic[] = fs.readdirSync(TOPIC_DIR).filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(fs.readFileSync(path.join(TOPIC_DIR, f), 'utf8')));
const T_BY = new Map(TOPICS.map((t) => [t.id, t]));

// 묶음: 업종×주제(허브 역할)는 1번, 나머지는 해시로 1~4. 오픈일부터 2일마다 한 묶음(7일 안에 전부). env OPEN_X 로 덮어쓴다.
const today = () => process.env.BUILD_DATE || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const days = Math.floor((Date.parse(today()) - Date.parse(drip.launch)) / 864e5);
export const OPEN_X = process.env.OPEN_X !== undefined ? Number(process.env.OPEN_X) : days < 0 ? 0 : Math.min(4, Math.floor(days / drip.everyDays) + 1);
export const X_ALL: XPage[] = (extra as any[]).filter((x) => !x.topic || T_BY.has(x.topic)).map((x) => ({ ...x, set: 'x' as const, wave: x.kind === 'wt' ? 1 : 1 + (hash(x.slug + '::wave') % 4) }));
export const X_PAGES = X_ALL.filter((x) => x.wave <= OPEN_X);
const X_BY = new Map(X_PAGES.map((x) => [x.slug, x]));
const dec = (slug: string) => { try { return decodeURIComponent(slug); } catch { return slug; } };
export const getX = (slug: string) => X_BY.get(dec(slug));
export const xPath = (p: { slug: string }) => `/${p.slug}/`;
export const xEncPath = (p: { slug: string }) => `/${encodeURIComponent(p.slug)}/`;

const pick = <T,>(arr: T[], s: string, salt: string) => arr[hash(`${s}::${salt}`) % arr.length];
const rotate = <T,>(arr: T[], s: string, salt: string) => arr.map((x, i) => [hash(`${s}::${salt}::${i}`), x] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);

const BRANCH_SIDO: Record<string, string> = { 부산: '부산본점', 대구: '대구점', 광주: '광주점' };
const RFACTS: [string, string][] = [['본사가 맡는 것', '공급망·교육·마케팅·매뉴얼'], ['필요한 허가', '동물판매업 허가(지자체)'], ['오픈까지', '미팅 예약부터 11단계'], ['상권 원칙', '동일 상권 중복 가맹 제한'], ['비용 안내', '본사 상담에서 항목별로']];

export function composeX(p: XPage) {
  const s = p.slug;
  const w = XW[p.word];
  const L = w.label;
  const reg = p.region ? REGIONS[p.region] : undefined;
  const short = p.place || (reg ? p.region! : '전국');
  const city = short.split(' ')[0];
  const where = p.region ? `${short}에서` : '어느 지역에서든';
  const branch = reg && BRANCH_SIDO[reg.sido];
  const V: Record<string, string> = { L, short, where, BRAND, PHONE: CONTACT.phone };
  const fill = (t: string) => t.replace(/\{(L|short|where|BRAND|PHONE)(?::([가-힣]+))?\}/g, (_, k, jo) => V[k] + (jo ? josa(V[k], jo) : ''));
  const KW_AT = new Set([0, 1, 2, 5]); // 레이 페이지처럼 절 6개 중 4개 h2 에 키워드 전체
  const head = (i: number, sub: string) => (KW_AT.has(i) ? `${p.kw}${i % 2 ? ' — ' : ': '}${sub}` : sub);

  const T = p.topic ? T_BY.get(p.topic)! : undefined;
  let relNames: string[] = [];
  let sections: { h: string; p: string }[]; let summary: string; let facts: [string, string][]; let lead: string; let h1sub: string; let faq: { q: string; a: string }[]; let cat: string;
  if (T) {
    // 주제 절 7개 중 5개 + 업종어 절 1개(4번째 자리) — 같은 주제를 쓰는 다른 업종 페이지와 겹치는 문장을 줄인다
    const keep = rotate(T.sections.map((_, i) => i), s, 'keep').slice(0, 5).sort((a, b) => a - b);
    const body = keep.map((k) => T.sections[k]).map((x, k) => ({ sub: pick(x.sub, s, `sub${k}`), p: fill(pick(x.p, s, `p${k}`)) }));
    const wsec = { sub: pick([`${L}에서 먼저 볼 것`, `${L}, 본사와 점주가 나누는 일`, `${L} 준비의 큰 그림`], s, 'wsub'), p: fill(`${pick(w.angle, s, 'ang')} ${pick(FRAMES, s, 'frm')}`) };
    body.splice(3, 0, wsec);
    sections = body.map((x, i) => ({ h: head(i, x.sub), p: x.p }));
    summary = fill(pick(T.summary, s, 'sum')); facts = T.facts; lead = fill(pick(T.lead, s, 'lead')); h1sub = pick(T.h1sub, s, 'h1');
    faq = rotate(T.faq, s, 'faq').slice(0, 4).map((f) => ({ q: fill(f.q), a: fill(f.a) }));
    cat = `${p.region ? `${short} ${L}` : L} · ${T.name}`;
  } else {
    const ts = rotate(TOPICS, s, 'ts').slice(0, 6);
    relNames = ts.slice(0, 3).map((t) => t.name);
    sections = ts.map((t, i) => { const x = t.sections[hash(`${s}::sec${i}`) % t.sections.length]; return { h: KW_AT.has(i) ? head(i, t.name) : pick(x.sub, s, `sub${i}`), p: fill(pick(x.p, s, `p${i}`)) }; });
    summary = fill(`${pick(w.angle, s, 'ang')} ${pick(FRAMES, s, 'frm')}`) + (branch ? ` ${city}에는 ${BRAND} ${branch}이 있어 그 상권과 겹치지 않는 입지부터 검토합니다.` : '');
    facts = [['업종', L], ...rotate(RFACTS, s, 'rf').slice(0, 2), ['상담', `본사 방문 상담 · ${CONTACT.phone}`]];
    lead = fill(pick([
      `{where} {L:을} 알아보는 분께 준비 순서와 본사 지원, 허가와 상권까지 먼저 확인할 것을 정리했습니다.`,
      `{short} {L}, 무엇부터 확인하고 어떤 순서로 준비하는지 {BRAND} 가맹 기준으로 안내합니다.`,
      `{where} {L:을} 준비할 때 예비 점주님이 자주 묻는 내용을 주제별로 답했습니다.`], s, 'lead'));
    h1sub = pick(w.sub, s, 'h1');
    faq = [
      ...rotate([
        { q: `${short}에도 ${BRAND} 가맹이 되나요?`, a: `${branch ? `${city}에는 ${branch}이 있어 그 상권과 겹치지 않는 곳으로 검토합니다. ` : ''}입지별로 다릅니다. 동일 상권 중복 가맹을 제한하고 있어 후보지를 상담에서 함께 확인합니다.` },
        { q: `${short} ${L} 비용은 얼마인가요?`, a: `점포 조건에 따라 달라집니다. 점포 크기·입지·인테리어 범위를 보고 본사 방문 상담에서 항목별로 안내합니다.` },
        { q: `${short}에서 경험 없이 시작해도 되나요?`, a: `가능합니다. 오픈 전 교육에서 상담·계약·사후관리를 익히고, 오픈 뒤에도 정기 점검이 이어집니다.` },
        { q: `${L} 상담은 어떻게 받나요?`, a: `방문 상담입니다. 전화(${CONTACT.phone})로 미팅을 예약한 뒤 본사 매장에서 운영 시스템을 보고 상담합니다.` },
      ], s, 'rfaq').slice(0, 2),
      ...ts.slice(0, 2).map((t) => { const f = pick(t.faq, s, `tf${t.id}`); return { q: fill(f.q), a: fill(f.a) }; }),
    ];
    cat = `${reg ? `${reg.sido} · ` : ''}${L}`;
  }
  // description 45~80자: 키워드 + 수식어/관련 주제 2~3개 + 상담 (긴 것부터 맞는 것을 고른다)
  const tail = [`${BRAND} 가맹 방문 상담 ${CONTACT.phone}`, `${BRAND} 가맹 상담 ${CONTACT.phone}`, `${BRAND} 가맹 상담`];
  const rel = T ? rotate(TOPICS.filter((t) => t.id !== T.id), s, 'dr').slice(0, 2).map((t) => t.name) : relNames;
  const cands = T
    ? [...tail.map((e) => `${p.kw} — ${h1sub}. ${rel.join('·')}까지 ${e}`), ...tail.map((e) => `${p.kw} — ${h1sub}. ${e}`), ...tail.map((e) => `${p.kw} — ${rel.join('·')}까지 ${e}`)]
    : [...tail.map((e) => `${p.kw} — ${rel.join('·')} 안내. ${h1sub}, ${e}`), ...tail.map((e) => `${p.kw} — ${rel.join('·')} 안내. ${e}`), ...tail.map((e) => `${p.kw} — ${rel.slice(0, 2).join('·')} 안내. ${e}`)];
  const description = cands.find((d) => d.length <= 80) || `${p.kw} | ${BRAND} 가맹 상담`;
  return { L, short, where, cat, h1sub, lead, summary, facts, sections, faq, title: kwTitle(p.kw, h1sub), description, og: T ? `x-t-${T.id}` : `x-w-${p.word}`, topicName: T?.name };
}

// 관련 링크 3묶음 (열린 페이지만)
const by = <K,>(key: (x: XPage) => K | undefined) => { const m = new Map<K, XPage[]>(); for (const x of X_PAGES) { const k = key(x); if (k === undefined) continue; if (!m.has(k)) m.set(k, []); m.get(k)!.push(x); } return m; };
const BY_TOPIC = by((x) => x.topic);
const BY_WORD_R = by((x) => (x.topic ? `${x.word}|${x.region || ''}` : undefined));
const BY_PLACE = by((x) => (x.topic ? undefined : x.place || x.region));
const BY_WORD_SIDO = by((x) => (x.topic || !x.region ? undefined : `${x.word}|${REGIONS[x.region]?.sido}|${x.kind}`));
type Lk = { kw: string; slug: string };
// 관련 링크·목록의 썸네일(og) — 확장 페이지는 주제·업종어 공용 그림, 기존 창업 페이지는 페이지별 그림
export const ogOf = (x: any) => `/og/${x.set === 'x' ? (x.topic ? `x-t-${x.topic}` : `x-w-${x.word}`) : x.slug}.jpg`;
export function relatedX(p: XPage): { h: string; items: Lk[] }[] {
  const s = p.slug; const L = XW[p.word].label; const not = (x: Lk) => x.slug !== s;
  const out: { h: string; items: Lk[] }[] = [];
  if (p.topic) {
    const tn = T_BY.get(p.topic)!.name;
    const same = (BY_TOPIC.get(p.topic) || []).filter(not);
    out.push({ h: '같은 주제, 다른 업종·지역', items: rotate(same.filter((x) => (p.region ? x.word === p.word || x.region === p.region : !x.region)), s, 'ra').slice(0, 6) });
    out.push({ h: `${L}, 이어서 확인할 것`, items: rotate((BY_WORD_R.get(`${p.word}|${p.region || ''}`) || []).filter(not), s, 'rb').slice(0, 6) });
    const hub: Lk[] = p.region ? FR_PAGES.filter((x: FrPage) => x.regionKey === p.region && x.breakdown).slice(0, 4) : rotate(same.filter((x) => x.region && x.word === p.word), s, 'rc').slice(0, 4);
    out.push({ h: p.region ? `${p.region} 창업 안내` : `지역별 ${tn}`, items: hub.length ? hub : rotate(same.filter((x) => x.region), s, 'rc2').slice(0, 4) });
  } else {
    const here: Lk[] = [...(BY_PLACE.get(p.place || p.region!) || []).filter(not), ...(p.kind === 'rw' ? FR_PAGES.filter((x: FrPage) => x.regionKey === p.region && x.breakdown) : [])];
    out.push({ h: `${p.place || p.region} 다른 창업 안내`, items: rotate(here, s, 'ra').slice(0, 6) });
    out.push({ h: `가까운 지역 ${L}`, items: rotate((BY_WORD_SIDO.get(`${p.word}|${REGIONS[p.region!]?.sido}|${p.kind}`) || []).filter(not), s, 'rb').slice(0, 6) });
    const own = BY_WORD_R.get(`${p.word}|`);
    out.push({ h: `${own ? L : '펫샵 창업'}, 주제별로 보기`, items: rotate(own || BY_WORD_R.get('펫샵창업|') || [], s, 'rc').slice(0, 4) });
  }
  return out.filter((g) => g.items.length);
}
