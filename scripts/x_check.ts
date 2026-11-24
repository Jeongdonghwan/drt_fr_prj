// 확장 페이지 점검: OPEN_X=4 npx tsx scripts/x_check.ts
// h1 중복, 본문 길이, 치환 안 된 자리표시자, 같은 문장 비율(무작위 쌍 / 같은 주제 쌍 / 같은 지역 쌍)
import { X_ALL, X_PAGES, composeX, XPage } from '../lib/x';
import { hash } from '../lib/data';

const pages = X_PAGES;
const sents = (p: XPage) => {
  const c = composeX(p);
  const body = [c.summary, ...c.sections.map((x) => x.p), ...c.faq.map((f) => f.a)].join(' ');
  return { c, len: body.replace(/\s/g, '').length, set: new Set(body.split(/(?<=[.?!])\s+/).map((x) => x.trim()).filter((x) => x.length > 12)) };
};
const cache = new Map<string, ReturnType<typeof sents>>();
const get = (p: XPage) => { if (!cache.has(p.slug)) cache.set(p.slug, sents(p)); return cache.get(p.slug)!; };
const share = (a: XPage, b: XPage) => { const A = get(a).set, B = get(b).set; let n = 0; A.forEach((x) => { if (B.has(x)) n++; }); return n / Math.min(A.size, B.size); };

const titles = new Map<string, number>(); let noSub = 0;
const h1 = new Map<string, number>(); let raw = 0; let lens: number[] = []; let kwH2 = 0; let longTitle = 0; let badDesc = 0;
for (const p of pages) {
  const g = get(p); const c = g.c;
  const h = `${p.kw} ${c.h1sub}`; h1.set(h, (h1.get(h) || 0) + 1);
  const all = JSON.stringify(c);
  if (/\{(L|short|where|BRAND|PHONE)/.test(all)) { raw++; if (raw < 4) console.log('자리표시자 남음:', p.kw); }
  lens.push(g.len); kwH2 += c.sections.filter((x) => x.h.includes(p.kw)).length;
  if (c.title.length > 60 || !c.title.startsWith(p.kw)) longTitle++;
  titles.set(c.title, (titles.get(c.title) || 0) + 1); if (c.title === `${p.kw} | 도로시펫`) noSub++;
  if (c.description.length < 45 || c.description.length > 80) badDesc++;
}
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const pct = (x: number) => `${Math.round(x * 100)}%`;
const sample = (pairs: [XPage, XPage][]) => { const v = pairs.map(([a, b]) => share(a, b)); return v.length ? `평균 ${pct(avg(v))} · 최대 ${pct(Math.max(...v))} (${v.length}쌍)` : '없음'; };
const rnd = (seed: string, n: number) => hash(seed) % n;
const randomPairs: [XPage, XPage][] = Array.from({ length: 400 }, (_, i) => [pages[rnd(`a${i}`, pages.length)], pages[rnd(`b${i}`, pages.length)]] as [XPage, XPage]).filter(([a, b]) => a !== b);
const group = (key: (x: XPage) => string | undefined) => { const m = new Map<string, XPage[]>(); for (const x of pages) { const k = key(x); if (!k) continue; if (!m.has(k)) m.set(k, []); m.get(k)!.push(x); } return [...m.values()].filter((v) => v.length > 1); };
const within = (gs: XPage[][], n: number) => Array.from({ length: n }, (_, i) => { const g = gs[rnd(`g${i}`, gs.length)]; return [g[rnd(`x${i}`, g.length)], g[rnd(`y${i}`, g.length)]] as [XPage, XPage]; }).filter(([a, b]) => a !== b);

const descs = new Set(pages.map((p) => get(p).c.description)); console.log(`설명 중복 ${pages.length - descs.size}`);
console.log(`확장 전체 ${X_ALL.length} · 열린 것 ${pages.length} (묶음별 ${[1, 2, 3, 4].map((w) => X_ALL.filter((x) => x.wave === w).length).join('/')})`);
console.log(`title 중복 ${[...titles.values()].filter((v) => v > 1).length} · 수식어 빠진 title ${noSub}`);
console.log(`h1 중복 ${[...h1.values()].filter((v) => v > 1).length} · 자리표시자 남은 페이지 ${raw} · 제목 60자 초과 ${longTitle} · 설명 길이 밖 ${badDesc}`);
console.log(`본문 글자(요약+절+FAQ답) 평균 ${Math.round(avg(lens))} · 최소 ${Math.min(...lens)} · 최대 ${Math.max(...lens)} · 키워드 든 h2 평균 ${(kwH2 / pages.length).toFixed(1)}개`);
console.log('같은 문장 — 무작위:', sample(randomPairs));
console.log('같은 문장 — 같은 주제:', sample(within(group((x) => x.topic), 400)));
console.log('같은 문장 — 같은 지역(주제 없음):', sample(within(group((x) => (x.topic ? undefined : x.place || x.region)), 400)));
console.log('같은 문장 — 같은 업종어(주제 없음):', sample(within(group((x) => (x.topic ? undefined : x.word)), 400)));
const show = [pages.find((x) => x.kind === 'wt'), pages.find((x) => x.kind === 'rwt'), pages.find((x) => x.kind === 'rw'), pages.find((x) => x.kind === 'gw')].filter(Boolean) as XPage[];
for (const p of show) { const c = get(p).c; console.log(`\n[${p.kind}] h1: ${p.kw} / ${c.h1sub}\n  title: ${c.title}\n  desc: ${c.description}\n  요약: ${c.summary}\n  h2: ${c.sections.map((x) => x.h).join(' | ')}\n  절1: ${c.sections[0].p}\n  FAQ: ${c.faq.map((f) => f.q).join(' | ')}`); }
