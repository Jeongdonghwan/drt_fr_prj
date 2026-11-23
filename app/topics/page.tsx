import type { Metadata } from 'next';
import Link from 'next/link';
import { X_PAGES, TOPICS, xPath, xEncPath, ogOf } from '../../lib/x';
import { BRAND } from '../../lib/site';
import { breadcrumbJsonLd, pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

export const metadata: Metadata = ogMeta(`주제별 창업 안내 | ${BRAND} 가맹 창업`, `주제별 창업 안내 — 펫샵창업·애견샵창업 허가 절차·상권 분석·점주 교육까지 ${TOPICS.length}가지. ${BRAND} 가맹 상담`, '/topics/', 'home');

// 주제별 허브 — 업종×주제 페이지 전체 (메인 → 여기 → 주제 페이지 → 지역별 주제)
export default function TopicsHub() {
  const list = X_PAGES.filter((x) => x.kind === 'wt');
  return (
    <main className="g">
      <JsonLd data={[breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '주제별 창업 안내', path: '/topics/' }]), pageListJsonLd(`${BRAND} 주제별 창업 안내`, list.map((x) => ({ name: x.kw, path: xEncPath(x), image: ogOf(x) })))]} />
      <section className="g-hero small"><div className="wrap g-hero-in"><p className="g-badge">TOPICS</p><h1 className="g-title">주제별 창업 안내</h1><p className="g-lead">창업을 준비하며 묻는 주제 {TOPICS.length}가지를 업종별로 정리했습니다. 궁금한 주제를 고르세요.</p></div></section>
      <section className="g-sec"><div className="wrap"><div className="dir g-dir">
        {TOPICS.map((t, i) => {
          const items = list.filter((x) => x.topic === t.id);
          return items.length ? (
            <details key={t.id} open={i < 3}><summary><b>{t.name}</b><span>{items.length}</span><i /></summary><ul>{items.map((x) => <li key={x.slug}><Link href={xPath(x)}>{x.kw}</Link></li>)}</ul></details>
          ) : null;
        })}
      </div></div></section>
    </main>
  );
}
