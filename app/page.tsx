import type { Metadata } from 'next';
import Link from 'next/link';
import { FR_PAGES, frPath, frEncPath } from '../lib/data';
import { BRAND, BRANCHES, CONTACT, FR_CORE, FR_WHY, FR_STEPS, FR_MOTTO, LINKS } from '../lib/site';
import { faqJsonLd, pageListJsonLd, ogMeta } from '../lib/jsonld';
import { Actions, JsonLd, SectionHead } from '../components/Common';

const TITLE = `${BRAND} 가맹 창업 | 강아지·고양이 분양샵 창업 상담`;
const DESC = `${BRAND} 가맹 창업 안내. 실전 운영 노하우, 본사 교육·마케팅 지원, 동일 상권 중복 가맹 제한, 상담부터 오픈까지 11단계. 본사 방문 상담 ${CONTACT.phone}.`;
const base = ogMeta(TITLE, DESC, '/', 'home');
export const metadata: Metadata = { ...base, alternates: { ...base.alternates, types: { 'application/rss+xml': [{ url: '/rss.xml', title: `${BRAND} 지역별 창업 안내` }] } } };

const FAQ = [
  { q: '창업 비용은 얼마인가요?', a: '점포 크기·입지·인테리어 범위에 따라 달라 본사 방문 상담에서 항목별로 안내합니다.' },
  { q: '전화로 바로 계약할 수 있나요?', a: '전화로는 미팅 일정만 잡고, 본사 매장을 직접 보신 뒤 상담하는 것을 원칙으로 합니다.' },
  { q: '같은 동네에 가맹점이 또 생기나요?', a: '상권 분석으로 동일 상권 안 중복 가맹을 막습니다.' },
  { q: '분양할 아이는 어떻게 들여오나요?', a: '본사의 전문 켄넬·캐터리 공급망과 건강검진·병력·혈통 정보 관리 방식을 그대로 씁니다.' },
];
const MARKET = [
  '인건비와 운영비가 오르면서 카페·편의점은 키오스크와 무인 운영으로 바뀌고, 배달·숙박 플랫폼 중심 구조에서 개인 자영업자가 높은 수익을 지키기 어려워졌습니다.',
  '반려동물 분양은 단순 판매가 아니라 상담과 신뢰, 고객과의 소통이 중요한 분야라 사람의 전문성과 경험이 여전히 중요합니다.',
  '다만 공급망, 개체 관리, 상담, 계약, 사후관리까지 직접 해야 할 일이 많아 혼자 시스템을 만들기에는 부담이 큽니다. 도로시펫은 이 부분을 본사가 지원합니다.',
  '퇴직금처럼 소중한 자금으로 시작한다면 단기 유행보다 오래 운영할 수 있는 구조인지 먼저 확인하세요. 그래서 전화만으로 결정하기보다 본사 방문 상담을 권합니다.',
];

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
      <section className="hero fr-hero">
        <img className="hero-bg" src="/images/hero-puppy.webp" alt={`${BRAND} 가맹 창업 — 분양 강아지 사진`} fetchPriority="high" />
        <div className="wrap">
          <div className="hero-copy">
            <p className="hero-label">DOROTHY PET FRANCHISE</p>
            <h1 className="hero-title"><span>{BRAND} 가맹 창업 안내</span></h1>
            <p className="hero-lead">검증된 운영 노하우로 함께 성장합니다. 예비 창업자부터 운영 중인 점주까지, 매장 운영에 필요한 공급망·교육·마케팅을 본사가 지원합니다.</p>
            <Actions franchise />
            <dl className="hero-specs"><div><dt>운영 매장</dt><dd>부산본점 · 대구점 · 광주점</dd></div><div><dt>오픈 과정</dt><dd>11단계</dd></div><div><dt>상담</dt><dd>전화 예약 후 본사 방문</dd></div></dl>
          </div>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title="안정적인 운영을 위한 체계적인 창업 시스템" />
          <div className="fr-intro">
            <div data-reveal>
              <p className="motto">‘<em>{FR_MOTTO}</em>’</p>
              <p>점주님께서 투자한 시간과 비용이 목표한 성과로 이어지도록, 가맹 이후에도 교육·마케팅 지원·현장 맞춤 컨설팅을 이어 갑니다. 동일 상권 내 중복 가맹 제한, 정기 소통, 점주 의견 반영으로 본사와 점주가 함께 성장합니다.</p>
            </div>
            <img src="/images/store-groom.webp" alt={`${BRAND} 부산본점 미용실 — 가맹점 인테리어 예시`} loading="lazy" data-reveal />
          </div>
          <ul className="promises reveal-group" style={{ marginTop: 34 }}>{FR_CORE.map((x) => <li key={x.t}><h3>{x.t}</h3><p>{x.d}</p></li>)}</ul>
        </section>

        <section className="sec alt">
          <SectionHead no="02" title="창업 시장은 지금 어떻게 변하고 있을까요" />
          <div className="cols">
            <div className="prose" data-reveal>{MARKET.map((t) => <p key={t}>{t}</p>)}</div>
            <div className="rooms-photo" style={{ marginTop: 0, gridTemplateColumns: '1fr 1fr' }}>
              <figure data-reveal style={{ gridColumn: 'span 2' }}><img src="/images/store-hotel.webp" alt={`${BRAND} 애견호텔 공간`} loading="lazy" /><figcaption>애견호텔</figcaption></figure>
              <figure data-reveal><img src="/images/store-dryer.webp" alt={`${BRAND} 미용 드라이룸`} loading="lazy" /><figcaption>드라이룸</figcaption></figure>
              <figure data-reveal><img src="/images/hero-cat.webp" alt={`${BRAND} 분양 고양이`} loading="lazy" /><figcaption>고양이 분양</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="sec">
          <SectionHead no="03" title={`왜 ${BRAND}인가`} />
          <dl className="types reveal-group">{FR_WHY.map((x) => <div key={x.t}><dt>{x.t}</dt><dd>{x.d}</dd></div>)}</dl>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>전화로 미팅 일정을 잡고 <em>본사 매장</em>을 직접 둘러보세요.</p>
          <Actions franchise />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec" id="steps">
          <SectionHead no="04" title="상담부터 오픈까지 11단계" sub="온라인·전화 미팅 예약 → 미팅 후 상담 → … → 점주 교육 → 오픈" />
          <ol className="steps11">{FR_STEPS.map((x) => <li key={x}>{x}</li>)}</ol>
        </section>

        <section className="sec alt">
          <SectionHead no="05" title="운영 중인 매장" />
          <dl className="info" data-reveal>{BRANCHES.map((b) => <div key={b.name}><dt>{b.name}</dt><dd>{b.address} · {b.phone}</dd></div>)}</dl>
          <p className="region-near">가맹 상담 {CONTACT.phone} · <a href={LINKS.kakao} target="_blank" rel="noopener">카카오톡</a> · <a href={LINKS.blog} target="_blank" rel="noopener">블로그</a></p>
        </section>

        <section className="sec" id="faq">
          <SectionHead no="06" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec" id="regions">
          <SectionHead no="07" title="지역별 창업 안내" sub={`${FR_PAGES.length.toLocaleString()}개 지역·유형 페이지. 지역마다 세대 수와 반려동물 등록 데이터를 함께 정리했습니다.`} />
          {Array.from(groups.entries()).map(([k, list]) => (
            <div key={k} className="area-block">
              <h3>{k}</h3>
              <ul className="area-list">{list.map((x) => <li key={x.slug}><Link href={frPath(x)}>{x.kw}</Link></li>)}</ul>
            </div>
          ))}
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>본사 방문 상담부터 시작하세요</h2>
          <p>부산 사상구 가야대로 336 · 미팅 예약 {CONTACT.phone}</p>
          <Actions franchise />
        </div>
      </section>
    </main>
  );
}
