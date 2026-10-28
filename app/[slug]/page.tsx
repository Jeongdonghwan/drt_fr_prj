import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FR_PAGES, getFr, frPath, frEncPath, relatedFr } from '../../lib/data';
import { composeFr } from '../../lib/compose-fr';
import { BRAND, FR_MOTTO } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead } from '../../components/Common';

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
  const max = Math.max(...c.compare.map(([, x]) => x.per100), 1);
  let n = 0;
  const no = () => String(++n).padStart(2, '0');

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역별 창업', path: '/#regions' }, { name: p.kw, path }]),
        faqJsonLd(c.faq),
        pageListJsonLd(`${p.kw} 관련 안내`, [...rel.sameRegion, ...rel.sameWord, ...rel.wider].map((x) => ({ name: x.kw, path: frEncPath(x) }))),
      ]} />

      <section className="hero">
        <img className="hero-bg" src={`/images/${c.heroImg}.webp`} alt={`${p.kw} ${BRAND} 가맹 안내 사진`} fetchPriority="high" />
        <div className="wrap">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/#regions">지역별 창업</Link><span>/</span>{p.kw}</nav>
            <p className="hero-label">{c.eyebrow}</p>
            <h1 className="hero-title"><span>{p.kw}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions franchise />
          </div>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no={no()} title={`${p.kw} 한눈에`} />
          <ul className="summary" data-reveal>{c.summary.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className="sec alt">
          <SectionHead no={no()} title={c.factsHeading} sub={p.region ? '주민등록 세대: 행정안전부 2026.9 · 반려동물 등록: 농림축산검역본부 2022 누계' : undefined} />
          <div className="cols">
            <div className="prose" data-reveal>{c.facts.map((t, i) => <p key={i}>{t}</p>)}</div>
            {c.dl.length > 0 && <dl className="info" data-reveal>{c.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          </div>
          {c.partTable.length > 1 && (
            <div className="price-wrap" data-reveal><table className="compare in">
              <caption className="sr-only">{c.short} {c.partWord}별 세대</caption>
              <thead><tr><th scope="col">{c.partWord}</th><th scope="col">세대</th><th scope="col">1인 세대</th>{c.partTable.some((x) => x.dogs) && <th scope="col">반려견 등록</th>}</tr></thead>
              <tbody>{c.partTable.map((x) => <tr key={x.name}><th scope="row">{x.name}</th><td>{x.households.toLocaleString()}</td><td>{x.onePct}%</td>{c.partTable.some((y) => y.dogs) && <td>{x.dogs ? x.dogs.toLocaleString() : '-'}</td>}</tr>)}</tbody>
            </table></div>
          )}
          {c.compare.length > 1 && (
            <div className="price-wrap" data-reveal><table className="compare">
              <caption className="sr-only">{c.compareCaption}</caption>
              <thead><tr><th scope="col">지역</th><th scope="col">세대</th><th scope="col">반려견 등록</th><th scope="col">세대 100곳당</th><th scope="col" style={{ width: '30%' }}></th></tr></thead>
              <tbody>{c.compare.map(([name, x], i) => (
                <tr key={name} className={i === 0 ? 'me' : ''}><th scope="row">{name}</th><td>{x.households.toLocaleString()}</td><td>{x.dogs.toLocaleString()}</td><td>{x.per100}마리</td><td><span className="bar" style={{ width: `${(x.per100 / max) * 100}%` }} /></td></tr>
              ))}</tbody>
            </table></div>
          )}
        </section>

        <section className="sec">
          <SectionHead no={no()} title={c.wordHeading} />
          <div className="prose" data-reveal>{c.wordBody.map((t, i) => <p key={i}>{t}</p>)}</div>
        </section>

        <section className="sec alt">
          <SectionHead no={no()} title={c.extra.heading} />
          <div className="prose" data-reveal>{c.extra.body.map((t, i) => <p key={i}>{t}</p>)}</div>
          {c.extra.steps && <ol className="timeline reveal-group" style={{ marginTop: 22 }}>{c.extra.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>}
          {c.extra.table && (
            <div className="price-wrap" data-reveal><table className="price-table">
              <thead><tr>{c.extra.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{c.extra.table.rows.map((r) => <tr key={r[0]}>{r.map((x, i) => i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>)}</tr>)}</tbody>
            </table></div>
          )}
        </section>

        <section className="sec">
          <SectionHead no={no()} title="안정적인 운영을 위한 창업 시스템" sub={`'${FR_MOTTO}'는 철학으로 운영합니다.`} />
          <ul className="promises reveal-group">{c.core.map((x) => <li key={x.t}><h3>{x.t}</h3><p>{x.d}</p></li>)}</ul>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>전화로 미팅을 잡고 <em>본사 매장</em>을 직접 보세요.</p>
          <Actions franchise />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no={no()} title={`왜 ${BRAND}인가`} />
          <dl className="types reveal-group">{c.why.map((x) => <div key={x.t}><dt>{x.t}</dt><dd>{x.d}</dd></div>)}</dl>
        </section>

        <section className="sec">
          <SectionHead no={no()} title="상담부터 오픈까지 11단계" />
          <ol className="steps11 with-d">{c.steps.map((x) => <li key={x.t}>{x.t}{x.d && <span>{x.d}</span>}</li>)}</ol>
        </section>

        <section className="sec" id="faq">
          <SectionHead no={no()} title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec related">
          {rel.sameRegion.length > 0 && <div><h3>{c.short} 다른 창업 안내</h3><ul>{rel.sameRegion.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.sameWord.length > 0 && <div><h3>가까운 지역 {c.w.label}</h3><ul>{rel.sameWord.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.wider.length > 0 && <div><h3>다른 시도 {c.w.label}</h3><ul>{rel.wider.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing}</h2>
          <p>본사 매장 방문 상담 · 부산 사상구 가야대로 336</p>
          <Actions franchise />
        </div>
      </section>
    </main>
  );
}
