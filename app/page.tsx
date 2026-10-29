import type { Metadata } from 'next';
import Link from 'next/link';
import { FR_PAGES, frPath, frEncPath } from '../lib/data';
import { BRAND, CONTACT, FR_CORE, FR_WHY, FR_MOTTO } from '../lib/site';
import { faqJsonLd, pageListJsonLd, ogMeta } from '../lib/jsonld';
import { JsonLd } from '../components/Common';
import { Badge, FrHero, PhotoStrip, Reviews, FeaturePanel, IconCards, GradCards, StepTrack, Branches, CtaBox, OWNER } from '../components/Fr';

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

export default function Franchise() {
  const groups = new Map<string, typeof FR_PAGES>();
  for (const p of FR_PAGES) {
    const k = p.region ? p.region.sidoName : '전국';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  return (
    <main className="g">
      <JsonLd data={[faqJsonLd(FAQ), pageListJsonLd(`${BRAND} 지역별 창업 안내`, FR_PAGES.map((x) => ({ name: x.kw, path: frEncPath(x) })))]} />

      <FrHero
        badge="DOROTHY PET FRANCHISE"
        title={<>분양샵 창업,<br /><em>{BRAND}</em>과 함께 시작하세요</>}
        lead={`부산본점의 분양·미용·호텔 운영 방식을 그대로 가져갑니다. 공급망·교육·마케팅은 본사가 맡습니다.`}
        cards
      />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head center"><h2>공급부터 마케팅까지<br /><em>본사가 끝까지 함께</em>합니다</h2><p>개인이 처음부터 만들기 어려운 공급망·관리·마케팅을 본사가 갖추고 있습니다.</p></div>
          <FeaturePanel
            title={<>본사가 맡고,<br />점주는 매장에 집중합니다</>}
            body={<><p>예비 점주가 준비할 것은 세 가지입니다.</p><ol className="g-owner">{OWNER.map((x) => <li key={x}>{x}</li>)}</ol><p className="g-note">인허가는 가맹 과정의 점검 단계에서 본사와 함께 확인합니다.</p></>}
          />
        </div>
      </section>

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head"><h2>왜 {BRAND}인가</h2><p>공식 가맹 안내의 여섯 가지 기준입니다.</p></div>
          <IconCards items={FR_WHY} />
        </div>
      </section>

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head"><h2>안정적인 운영을 위한 창업 시스템</h2><p>‘{FR_MOTTO}’는 철학으로 운영합니다.</p></div>
          <GradCards items={FR_CORE} label={`${BRAND} 핵심 경쟁력`} />
        </div>
      </section>

      <Reviews title="부산본점 분양후기" />

      <section className="g-sec soft">
        <div className="wrap">
          <div className="g-head center"><Badge>MARKET INSIGHT</Badge><h2>창업 시장은 지금<br />어떻게 변하고 있을까요</h2></div>
          <ol className="g-shift reveal-group">{SHIFT.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><b>{t}</b><p>{d}</p></li>)}</ol>
          <p className="g-shift-end" data-reveal>공급망, 개체 관리, 상담, 계약, 사후관리까지 혼자 시스템을 만들기에는 부담이 큽니다. {BRAND}은 이 부분을 본사가 지원하고, 무분별한 출점 대신 상권 분석으로 기존 점주와의 경쟁을 줄입니다.</p>
        </div>
      </section>

      <section className="g-sec" id="steps">
        <div className="wrap">
          <div className="g-head"><h2>상담부터 오픈까지 11단계</h2><p>네 구간으로 나눠 진행합니다. 인허가 점검이 점포 계약보다 먼저입니다.</p></div>
          <StepTrack />
        </div>
      </section>

      <PhotoStrip title="본사 공급망으로 분양하는 아이들" sub="부산본점 분양 목록 사진입니다. 가맹점도 같은 공급망을 씁니다." />

      <section className="g-sec">
        <div className="wrap">
          <div className="g-head center"><Badge>STORES</Badge><h2>지금 운영 중인 매장</h2><p>본사 미팅은 부산본점에서 진행합니다.</p></div>
          <Branches />
        </div>
      </section>

      <CtaBox eyebrow="본사 방문 상담 · 전화로 미팅 예약" title={<>분양샵 창업,<br />어디서부터 시작할지 모르시겠다면</>} sub="창업은 적지 않은 자금이 드는 결정이라, 전화로 미팅을 잡고 본사 매장을 직접 본 뒤 상담합니다." />

      <section className="g-sec" id="faq">
        <div className="wrap">
          <div className="g-head"><h2>자주 묻는 질문</h2></div>
          <div className="faq g-faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="g-sec soft" id="regions">
        <div className="wrap">
          <div className="g-head"><h2>지역별 창업 안내</h2><p>{groups.size}개 권역 {FR_PAGES.length.toLocaleString()}개 페이지. 지역마다 주민등록 세대와 반려동물 등록 데이터를 함께 정리했습니다.</p></div>
          <div className="dir g-dir">
            {Array.from(groups.entries()).map(([k, list], i) => (
              <details key={k} open={i < 2}>
                <summary><b>{k}</b><span>{list.length}</span><i /></summary>
                <ul>{list.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}</Link></li>)}</ul>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
