import type { Metadata } from 'next';
import Link from 'next/link';
import { FR_PAGES, frPath, frEncPath } from '../lib/data';
import { BRAND, CONTACT, FR_CORE, FR_WHY, FR_MOTTO } from '../lib/site';
import { faqJsonLd, pageListJsonLd, ogMeta } from '../lib/jsonld';
import { Actions, JsonLd, SectionHead } from '../components/Common';
import { FrHero, PhotoStrip, RoleSplit, StepTrack, Branches, VisitBand } from '../components/Fr';

const TITLE = `${BRAND} 가맹 창업 | 강아지·고양이 분양샵 창업 상담`;
const DESC = `${BRAND} 가맹 창업 안내. 실전 운영 노하우, 본사 교육·마케팅 지원, 동일 상권 중복 가맹 제한, 상담부터 오픈까지 11단계. 본사 방문 상담 ${CONTACT.phone}.`;
const base = ogMeta(TITLE, DESC, '/', 'home');
export const metadata: Metadata = { ...base, alternates: { ...base.alternates, types: { 'application/rss+xml': [{ url: '/rss.xml', title: `${BRAND} 지역별 창업 안내` }] } } };

const FAQ = [
  { q: '창업 비용은 얼마인가요?', a: '점포 크기·입지·인테리어 범위에 따라 달라 본사 방문 상담에서 항목별로 안내합니다.' },
  { q: '전화로 바로 계약할 수 있나요?', a: '전화로는 미팅 일정만 잡고, 본사 매장을 직접 보신 뒤 상담하는 것을 원칙으로 합니다.' },
  { q: '같은 동네에 가맹점이 또 생기나요?', a: '상권 분석으로 동일 상권 안 중복 가맹을 막습니다.' },
  { q: '분양할 아이는 어떻게 들여오나요?', a: '본사의 전문 켄넬·캐터리 공급망과 건강검진·병력·혈통 정보 관리 방식을 그대로 씁니다.' },
  { q: '창업 경험이 없어도 되나요?', a: '상담 교육, 고객 응대, 계약 진행, 사후관리까지 운영 전반을 오픈 전에 교육하고, 오픈 후에도 정기 점검을 이어 갑니다.' },
];
// 공식 가맹 페이지 '창업 시장은 지금' 요약
const SHIFT: [string, string][] = [
  ['인건비·운영비 상승', '카페·편의점은 키오스크와 무인 운영으로 바뀌고 있습니다.'],
  ['플랫폼 중심 구조', '배달·숙박 플랫폼 아래에서 개인 자영업자가 수익을 지키기 어려워졌습니다.'],
  ['사람이 하는 일', '반려동물 분양은 상담·신뢰·소통이 중심이라 사람의 전문성과 경험이 여전히 중요합니다.'],
];
const CORE_IMG = ['/images/store-groom.webp', '/images/store-dryer.webp', '/images/store-hotel.webp', '/images/hero-puppy.webp'];
const CORE_ALT = ['미용실', '드라이룸', '애견호텔', '분양 강아지'];

export default function Franchise() {
  const groups = new Map<string, typeof FR_PAGES>();
  for (const p of FR_PAGES) {
    const k = p.region ? p.region.sidoName : '전국';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), pageListJsonLd(`${BRAND} 지역별 창업 안내`, FR_PAGES.map((x) => ({ name: x.kw, path: frEncPath(x) })))]} />

      <FrHero
        label="DOROTHY PET FRANCHISE"
        title={<><span>분양샵 창업,</span><span>공급부터 마케팅까지</span><span className="accent">본사가 함께합니다</span></>}
        lead={`${BRAND} 부산본점의 분양·미용·호텔 운영 방식을 그대로 가져갑니다. 전화로 미팅을 잡고 본사 매장을 직접 본 뒤 상담합니다.`}
        photos={[['/images/store-hotel.webp', `${BRAND} 부산본점 애견호텔`], ['/images/hero-puppy.webp', `${BRAND} 분양 강아지`], ['/images/store-groom.webp', `${BRAND} 부산본점 미용실`]]}
      />

      <PhotoStrip caption={`${BRAND} 본사 공급망으로 분양하는 아이들 — 부산본점 분양 목록 사진`} />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title="본사가 맡고, 점주는 매장에 집중합니다" sub="개인이 처음부터 만들기 어려운 공급망·관리·마케팅을 본사가 갖추고 있습니다." />
          <RoleSplit />
        </section>

        <section className="sec">
          <SectionHead no="02" title="안정적인 운영을 위한 창업 시스템" />
          <div className="core-tiles reveal-group">
            {FR_CORE.map((x, i) => (
              <article key={x.t} className={`ct ct${i}`}>
                <img src={CORE_IMG[i]} alt={`${BRAND} 부산본점 ${CORE_ALT[i]} — ${x.t}`} loading="lazy" />
                <div><span>{String(i + 1).padStart(2, '0')}</span><h3>{x.t}</h3><p>{x.d}</p></div>
              </article>
            ))}
          </div>
          <blockquote className="motto-q" data-reveal><p>‘{FR_MOTTO}’</p><cite>{BRAND} 운영 철학</cite></blockquote>
        </section>
      </div>

      <section className="shift">
        <div className="wrap">
          <p className="shift-k" data-reveal>MARKET INSIGHT</p>
          <h2 className="shift-h" data-reveal>창업 시장은 지금 어떻게 변하고 있을까요</h2>
          <ol className="shift-list reveal-group">{SHIFT.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
          <p className="shift-end" data-reveal>공급망, 개체 관리, 상담, 계약, 사후관리까지 혼자 시스템을 만들기에는 부담이 큽니다. {BRAND}은 이 부분을 본사가 지원하고, 무분별한 출점 대신 상권 분석으로 기존 점주와의 경쟁을 줄입니다.</p>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="03" title={`왜 ${BRAND}인가`} />
          <ol className="why6 reveal-group">{FR_WHY.map((x, i) => <li key={x.t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{x.t}</h3><p>{x.d}</p></li>)}</ol>
        </section>

        <section className="sec" id="steps">
          <SectionHead no="04" title="상담부터 오픈까지 11단계" sub="네 구간으로 나눠 진행합니다. 인허가 점검이 점포 계약보다 먼저입니다." />
          <StepTrack />
        </section>
      </div>

      <VisitBand line={<>창업은 적지 않은 자금이 드는 결정이라, <em>본사 매장을 직접 보고</em> 상담합니다.</>} />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="05" title="운영 중인 매장" />
          <Branches />
        </section>

        <section className="sec" id="faq">
          <SectionHead no="06" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec" id="regions">
          <SectionHead no="07" title="지역별 창업 안내" sub={`${groups.size}개 권역 ${FR_PAGES.length.toLocaleString()}개 페이지. 지역마다 주민등록 세대와 반려동물 등록 데이터를 함께 정리했습니다.`} />
          <div className="dir">
            {Array.from(groups.entries()).map(([k, list], i) => (
              <details key={k} open={i < 2}>
                <summary><b>{k}</b><span>{list.length}</span><i /></summary>
                <ul>{list.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}</Link></li>)}</ul>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap closing-in" data-reveal>
          <div>
            <h2>본사 방문 상담부터 시작하세요</h2>
            <p>부산 사상구 가야대로 336 · 미팅 예약 {CONTACT.phone}</p>
            <Actions franchise dark />
          </div>
          <img src="/images/store-dryer.webp" alt={`${BRAND} 부산본점 드라이룸`} loading="lazy" />
        </div>
      </section>
    </main>
  );
}
