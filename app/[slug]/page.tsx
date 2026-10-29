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
  const r = p.region;

  // 지역 카드 일러스트 — 그 지역 실제 데이터(행정안전부·농림축산검역본부)
  const regionCard = r ? (
    <div className="g-sheet">
      <p className="g-sheet-h"><b>{c.short} 상권 카드</b><span>공공데이터</span></p>
      <dl className="g-rc">
        <div><dt>주민등록 세대</dt><dd>{r.households.toLocaleString()}</dd></div>
        <div><dt>1인 세대</dt><dd>{r.onePct}%</dd></div>
        <div><dt>반려견 등록</dt><dd>{r.dogs.toLocaleString()}</dd></div>
        <div><dt>세대 100곳당 반려견</dt><dd>{r.per100}마리</dd></div>
      </dl>
      <p className="g-rc-bar"><span style={{ width: `${Math.min(100, (r.per100 / 20) * 100)}%` }} /></p>
      <p className="g-rc-note">주민등록 2026.9 · 반려동물 등록 2022 누계</p>
    </div>
  ) : undefined;

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
        title={r && p.kw.startsWith(c.short) ? <><em>{c.short}</em>{p.kw.slice(c.short.length)}</> : p.kw}
        lead={c.lead}
        stats={r ? [
          { k: '주민등록 세대', v: r.households, unit: '세대', note: '행정안전부 2026.9' },
          { k: '반려견 등록', v: r.dogs, unit: '마리', note: '농림축산검역본부 2022 누계' },
          { k: '세대 100곳당 반려견', v: r.per100, unit: '마리', note: '세대 2026.9 · 등록 2022' },
        ] : undefined}
        cards={!r}
      />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>{p.kw} 한눈에</h2></div>
          <ol className="g-keys reveal-group">{c.summary.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}</ol>
        </div>
      </section>

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head"><h2>{c.factsHeading}</h2>{r && <p>주민등록 세대: 행정안전부 2026.9 · 반려동물 등록: 농림축산검역본부 2022 누계</p>}</div>
          <div className="g-box">
            <div className="cols">
              <div className="prose" data-reveal>{c.facts.map((t, i) => <p key={i}>{t}</p>)}</div>
              {c.dl.length > 0 && <dl className="info" data-reveal>{c.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
            </div>
          </div>
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap">
          <FeaturePanel title={c.wordHeading} body={<div className="prose">{c.wordBody.map((t, i) => <p key={i}>{t}</p>)}</div>} side={regionCard} />
        </div>
      </section>

      <Reviews title={`${c.short} 가맹점도 같은 기준으로 분양합니다`} offset={hash(p.slug) % 41} count={8} />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>{c.extra.heading}</h2></div>
          <div className="g-box">
            <div className="prose" data-reveal>{c.extra.body.map((t, i) => <p key={i}>{t}</p>)}</div>
            {c.extra.steps && <ol className="timeline reveal-group" style={{ marginTop: 22 }}>{c.extra.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>}
            {c.extra.table && (
              <div className="price-wrap" data-reveal><table className="price-table">
                <thead><tr>{c.extra.table.head.map((x) => <th key={x} scope="col">{x}</th>)}</tr></thead>
                <tbody>{c.extra.table.rows.map((row) => <tr key={row[0]}>{row.map((x, i) => i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>)}</tr>)}</tbody>
              </table></div>
            )}
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
