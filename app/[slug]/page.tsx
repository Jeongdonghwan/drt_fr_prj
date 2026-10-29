import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FR_PAGES, getFr, frPath, frEncPath, relatedFr, hash } from '../../lib/data';
import { composeFr } from '../../lib/compose-fr';
import { BRAND, FR_MOTTO } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { IconArrow, JsonLd } from '../../components/Common';
import { FrHero, PlaceGallery, Reviews, FeaturePanel, IconCards, GradCards, StepTrack, CtaBox, HQ } from '../../components/Fr';

export const dynamicParams = false;
export function generateStaticParams() {
  return FR_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getFr(params.slug);
  if (!p) return {};
  const c = composeFr(p);
  return ogMeta(c.title, c.description, frEncPath(p), p.slug);
}

export default function FrPage({ params }: { params: { slug: string } }) {
  const p = getFr(params.slug);
  if (!p) notFound();
  const c = composeFr(p);
  const rel = relatedFr(p);
  const path = frEncPath(p);


  return (
    <main className="g">
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역별 창업', path: '/#regions' }, { name: p.kw, path }]),
        faqJsonLd(c.faq),
        pageListJsonLd(`${p.kw} 관련 안내`, [...rel.sameRegion, ...rel.sameWord, ...rel.wider].map((x) => ({ name: x.kw, path: frEncPath(x) }))),
      ]} />

      <FrHero
        crumbs={<nav className="crumbs g-crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/#regions">지역별 창업</Link><span>/</span>{p.kw}</nav>}
        badge={c.eyebrow}
        title={p.region && p.kw.startsWith(c.short) ? <><em>{c.short}</em>{p.kw.slice(c.short.length)}</> : p.kw}
        lead={c.lead}
        cards
      />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>{p.kw} 한눈에</h2></div>
          <ol className="g-keys reveal-group">{c.summary.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}</ol>
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap">
          <article className="g-article">
            <h2>{c.article.heading}</h2>
            {c.article.sections.map((x, i) => (
              <section key={x.h} data-reveal>
                <h3><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h3>
                {x.p.map((t) => <p key={t}>{t}</p>)}
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head"><h2>{c.meritHeading}</h2><p>공식 가맹 안내 내용을 {c.short} 기준으로 정리했습니다.</p></div>
          <GradCards items={c.merits} label={`${c.short} 가맹점 지원`} />
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap">
          <FeaturePanel title={c.wordHeading} body={<div className="prose">{c.wordBody.map((t, i) => <p key={i}>{t}</p>)}</div>} />
        </div>
      </section>

      <Reviews title="부산본점 고객이 남긴 후기" offset={hash(p.slug) % 41} count={8} />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>{c.extra.heading}</h2></div>
          <div className="g-box">
            {c.extra.body.length > 0 && <div className="prose" data-reveal>{c.extra.body.map((t, i) => <p key={i}>{t}</p>)}</div>}
            {c.extra.items.length > 0 && <div className="g-split reveal-group">{c.extra.items.map((x, i) => <div key={x.t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{x.t}</h3><p>{x.d}</p></div>)}</div>}
          </div>
        </div>
      </section>

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head"><h2>안정적인 운영을 위한 창업 시스템</h2><p>‘{FR_MOTTO}’는 철학으로 운영합니다. 본사 지원: {HQ.slice(0, 3).join(' · ')}.</p></div>
          <GradCards items={c.core} label={`${c.short} 가맹점 지원`} />
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>왜 {BRAND}인가</h2></div>
          <IconCards items={c.why} cols={3} />
        </div>
      </section>

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head"><h2>상담부터 오픈까지 11단계</h2></div>
          <StepTrack desc={c.steps.map((x) => x.d)} />
        </div>
      </section>

      <PlaceGallery title={`${c.short}에서 오셔도 본사 매장에서 상담합니다`} sub="부산 사상구 가야대로 336 · 전화로 미팅 날짜를 먼저 잡습니다." pick={hash(p.slug) % 2 ? [0, 1, 3] : [0, 2, 4]} />

      <CtaBox eyebrow={`${c.short}에서도 본사 방문 상담`} title={c.closing} sub="전화로 미팅을 잡고 부산 사상구 본사 매장을 직접 본 뒤 상담합니다." />

      <section className="g-sec" id="faq">
        <div className="wrap">
          <div className="g-head"><h2>자주 묻는 질문</h2></div>
          <div className="faq g-faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap related">
          {rel.sameRegion.length > 0 && <div><h3>{c.short} 다른 창업 안내</h3><ul>{rel.sameRegion.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.sameWord.length > 0 && <div><h3>가까운 지역 {c.w.label}</h3><ul>{rel.sameWord.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.wider.length > 0 && <div><h3>다른 시도 {c.w.label}</h3><ul>{rel.wider.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
        </div>
      </section>
    </main>
  );
}
