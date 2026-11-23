import type { Metadata } from 'next';
import Link from 'next/link';
import { X_PAGES, xPath, xEncPath, ogOf } from '../../lib/x';
import { REGIONS } from '../../lib/data';
import { BRAND } from '../../lib/site';
import { breadcrumbJsonLd, pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

export const metadata: Metadata = ogMeta(`구·시별 창업 안내 | ${BRAND} 가맹 창업`, `구·시별 창업 안내 — 서울·부산·대구 등 구 단위 펫샵창업·애견샵창업·고양이분양창업. ${BRAND} 가맹 상담`, '/areas/', 'home');

// 구·시별 허브 — 지역×업종어, 시도×업종×주제 페이지를 시도별로
export default function AreasHub() {
  const list = X_PAGES.filter((x) => x.region);
  const groups = new Map<string, typeof list>();
  for (const x of list) { const k = REGIONS[x.region!]?.sidoName || '전국'; if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(x); }
  return (
    <main className="g">
      <JsonLd data={[breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '구·시별 창업 안내', path: '/areas/' }]), pageListJsonLd(`${BRAND} 구·시별 창업 안내`, list.slice(0, 300).map((x) => ({ name: x.kw, path: xEncPath(x), image: ogOf(x) })))]} />
      <section className="g-hero small"><div className="wrap g-hero-in"><p className="g-badge">AREAS</p><h1 className="g-title">구·시별 창업 안내</h1><p className="g-lead">{groups.size}개 시도 {list.length.toLocaleString()}개 안내. 지역을 펼쳐 구·시와 주제를 고르세요.</p></div></section>
      <section className="g-sec"><div className="wrap"><div className="dir g-dir">
        {Array.from(groups.entries()).map(([k, items], i) => (
          <details key={k} open={i < 1}><summary><b>{k}</b><span>{items.length}</span><i /></summary><ul>{items.map((x) => <li key={x.slug}><Link href={xPath(x)}>{x.kw}</Link></li>)}</ul></details>
        ))}
      </div></div></section>
    </main>
  );
}
