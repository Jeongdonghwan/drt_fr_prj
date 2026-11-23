// 확장 페이지 화면 — 레이 모범 구조(분류 줄 → h1 → 설명 → 핵심 요약 상자 → 번호 절 6개 → FAQ → 관련 링크). lib/x.ts 참고.
import Link from 'next/link';
import { XPage, composeX, relatedX, xPath, xEncPath, ogOf } from '../lib/x';
import { CONTACT, LINKS, tel } from '../lib/site';
import { breadcrumbJsonLd, faqJsonLd, pageListJsonLd } from '../lib/jsonld';
import { IconArrow, IconPhone, JsonLd } from './Common';
import { CtaBox } from './Fr';

export function XView({ p }: { p: XPage }) {
  const c = composeX(p);
  const rel = relatedX(p);
  const path = xEncPath(p);
  const hub = p.topic ? { name: '주제별 창업 안내', path: '/topics/' } : { name: '구·시별 창업 안내', path: '/areas/' };
  return (
    <main className="g x">
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, hub, { name: p.kw, path }]),
        faqJsonLd(c.faq),
        pageListJsonLd(`${p.kw} 관련 안내`, rel.flatMap((g) => g.items).map((x) => ({ name: x.kw, path: xEncPath(x), image: ogOf(x) }))),
      ]} />
      <section className="g-hero small x-hero">
        <div className="wrap g-hero-in">
          <nav className="crumbs g-crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href={hub.path}>{hub.name}</Link><span>/</span>{p.kw}</nav>
          <p className="g-badge">{c.cat}</p>
          <h1 className="g-title"><span>{p.kw}</span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
          <p className="g-lead">{c.lead}</p>
        </div>
      </section>
      <section className="g-sec x-body">
        <div className="wrap x-grid">
          <div className="x-main">
            <section className="x-sum" data-reveal>
              <h2>{p.kw} 핵심 요약</h2>
              <p>{c.summary}</p>
              <dl>{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </section>
            <article className="x-article">
              {c.sections.map((x, i) => (
                <section key={i}>
                  <h2><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
                  <p>{x.p}</p>
                </section>
              ))}
            </article>
            <section className="x-faq" id="faq">
              <h2>{p.kw} 자주 묻는 질문</h2>
              <div className="faq g-faq">{c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
            </section>
          </div>
          <aside className="x-side">
            <h3>바로 확인</h3>
            <dl>{c.facts.slice(1, 3).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <a className="g-btn" href={tel}><IconPhone /><span>전화 {CONTACT.phone}</span></a>
            <a className="g-btn ghost" href={LINKS.kakao} target="_blank" rel="noopener"><span>카카오톡 상담</span><IconArrow /></a>
          </aside>
        </div>
      </section>
      <section className="g-sec soft">
        <div className="wrap related">
          {rel.map((g) => <div key={g.h}><h3>{g.h}</h3><ul>{g.items.map((x) => <li key={x.slug}><Link href={xPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>)}
        </div>
      </section>
      <CtaBox eyebrow={`${c.short === '전국' ? '어느 지역' : c.short}에서도 본사 방문 상담`} title={`${p.kw} 상담 예약`} sub="전화로 미팅을 잡고 부산 사상구 본사 매장을 직접 본 뒤 상담합니다." />
    </main>
  );
}
