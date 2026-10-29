import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FR_PAGES, getFr, frPath, frEncPath, relatedFr, hash } from '../../lib/data';
import { composeFr } from '../../lib/compose-fr';
import { BRAND, FR_MOTTO } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, pageListJsonLd, ogMeta } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead } from '../../components/Common';
import { FrHero, PhotoStrip, StepTrack, VisitBand } from '../../components/Fr';

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

const ROOMS: [string, string][] = [['store-hotel', '애견호텔'], ['store-groom', '미용실'], ['store-dryer', '드라이룸']];

export default function FrPage({ params }: { params: { slug: string } }) {
  const p = getFr(params.slug);
  if (!p) notFound();
  const c = composeFr(p);
  const rel = relatedFr(p);
  const path = frEncPath(p);
  const r = p.region;
  const max = Math.max(...c.compare.map(([, x]) => x.per100), 1);
  const h = hash(p.slug);
  const room = (k: number) => ROOMS[(h + k) % ROOMS.length];
  let n = 0;
  const no = () => String(++n).padStart(2, '0');

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역별 창업', path: '/#regions' }, { name: p.kw, path }]),
        faqJsonLd(c.faq),
        pageListJsonLd(`${p.kw} 관련 안내`, [...rel.sameRegion, ...rel.sameWord, ...rel.wider].map((x) => ({ name: x.kw, path: frEncPath(x) }))),
      ]} />

      <FrHero
        crumbs={<nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/#regions">지역별 창업</Link><span>/</span>{p.kw}</nav>}
        label={c.eyebrow}
        title={<span>{p.kw}</span>}
        lead={c.lead}
        stats={r ? [
          { k: '주민등록 세대', v: r.households, unit: '세대', note: '2026.9' },
          { k: '반려견 등록', v: r.dogs, unit: '마리', note: '2022 누계' },
          { k: '세대 100곳당 반려견', v: r.per100, unit: '마리', note: `${r.rankOf}곳 중 ${r.rankPer100}위` },
        ] : undefined}
        photos={[[`/images/${c.heroImg}.webp`, `${p.kw} ${BRAND} 분양 사진`], [`/images/${room(0)[0]}.webp`, `${BRAND} 부산본점 ${room(0)[1]}`], [`/images/${room(1)[0]}.webp`, `${BRAND} 부산본점 ${room(1)[1]}`]]}
      />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no={no()} title={`${p.kw} 한눈에`} />
          <ol className="keys reveal-group">{c.summary.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><p>{t}</p></li>)}</ol>
        </section>

        <section className="sec alt">
          <SectionHead no={no()} title={c.factsHeading} sub={r ? '주민등록 세대: 행정안전부 2026.9 · 반려동물 등록: 농림축산검역본부 2022 누계' : undefined} />
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
      </div>

      <PhotoStrip caption={`${c.short} 가맹점도 같은 공급망으로 분양합니다 — ${BRAND} 부산본점 분양 사진`} />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no={no()} title={c.wordHeading} />
          <div className="side-photo">
            <div className="prose" data-reveal>{c.wordBody.map((t, i) => <p key={i}>{t}</p>)}</div>
            <figure data-reveal><img src={`/images/${room(2)[0]}.webp`} alt={`${p.kw} — ${BRAND} 부산본점 ${room(2)[1]}`} loading="lazy" /><figcaption>{BRAND} 부산본점 {room(2)[1]}</figcaption></figure>
          </div>
        </section>

        <section className="sec alt">
          <SectionHead no={no()} title={c.extra.heading} />
          <div className="prose" data-reveal>{c.extra.body.map((t, i) => <p key={i}>{t}</p>)}</div>
          {c.extra.steps && <ol className="timeline reveal-group" style={{ marginTop: 22 }}>{c.extra.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>}
          {c.extra.table && (
            <div className="price-wrap" data-reveal><table className="price-table">
              <thead><tr>{c.extra.table.head.map((x) => <th key={x} scope="col">{x}</th>)}</tr></thead>
              <tbody>{c.extra.table.rows.map((row) => <tr key={row[0]}>{row.map((x, i) => i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>)}</tr>)}</tbody>
            </table></div>
          )}
        </section>

        <section className="sec">
          <SectionHead no={no()} title="안정적인 운영을 위한 창업 시스템" sub={`'${FR_MOTTO}'는 철학으로 운영합니다.`} />
          <div className="core-tiles two reveal-group">
            {c.core.map((x, i) => (
              <article key={x.t} className={`ct ct${i}`}>
                <img src={`/images/${room(i + 1)[0]}.webp`} alt={`${BRAND} 부산본점 ${room(i + 1)[1]} — ${x.t}`} loading="lazy" />
                <div><span>{String(i + 1).padStart(2, '0')}</span><h3>{x.t}</h3><p>{x.d}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <VisitBand line={<>{c.short}에서 오셔도 <em>본사 매장을 직접 보고</em> 상담합니다.</>} />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no={no()} title={`왜 ${BRAND}인가`} />
          <ol className="why6 reveal-group">{c.why.map((x, i) => <li key={x.t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{x.t}</h3><p>{x.d}</p></li>)}</ol>
        </section>

        <section className="sec">
          <SectionHead no={no()} title="상담부터 오픈까지 11단계" />
          <StepTrack desc={c.steps.map((x) => x.d)} />
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
        <div className="wrap closing-in" data-reveal>
          <div>
            <h2>{c.closing}</h2>
            <p>본사 매장 방문 상담 · 부산 사상구 가야대로 336</p>
            <Actions franchise dark />
          </div>
          <img src={`/images/${room(0)[0]}.webp`} alt={`${p.kw} ${BRAND} 본사 매장`} loading="lazy" />
        </div>
      </section>
    </main>
  );
}
