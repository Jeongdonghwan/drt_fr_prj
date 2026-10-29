// 가맹 창업 사이트 시각 블록 (gopung 시안 톤: 밝은 슬레이트 · 둥근 카드 · 그라데이션 아이콘 타일, 색은 도로시펫 캐멀)
import reviewData from '../data/reviews.json';
import { BRAND, BRANCHES, CONTACT, FR_STEPS, LINKS, tel } from '../lib/site';
import { IconArrow, IconPhone } from './Common';

// 본사 분양 사진(dorothypet.co.kr 분양 목록) — 사진마다 실제 품종명
export const PUPPIES: [string, string][] = [
  ['pomeranian-2835', '포메라니안'], ['british-shorthair-2823', '브리티쉬숏헤어'], ['maltipoo-2813', '말티푸'], ['poodle-2810', '토이푸들'],
  ['ragdoll-41', '랙돌'], ['shiba-inu-21', '시바이누'], ['munchkin-35', '먼치킨'], ['maltese-166', '말티즈'],
  ['bichon-frise-105', '비숑프리제'], ['american-shorthair-32', '아메리칸숏헤어'], ['chihuahua-15', '치와와'], ['shih-tzu-2815', '시츄'],
  ['retriever-54', '골든리트리버'], ['abyssinian-152', '아비시니안'], ['welsh-corgi-37', '웰시코기'],
];

// 선 아이콘 (24 그리드)
const P: Record<string, string> = {
  support: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  health: 'M12 21s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 6C19 16.6 12 21 12 21zM12 10v5M9.5 12.5h5',
  megaphone: 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM17 9a4 4 0 0 1 0 6M7 14l1 5h3',
  map: 'M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5v1.5M12 16v1.5',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7M8 11h5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  school: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
  store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s2-1.3 2-3M10 20v-5h4v5',
  hands: 'M8 13l3 3 5-5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  check: 'M5 12.5l4.5 4.5L19 7',
};
export const Icon = ({ name }: { name: keyof typeof P | string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[name] || P.check} /></svg>
);
// FR_WHY / FR_CORE 순서에 맞춘 아이콘
export const WHY_ICON: Record<string, string> = { '전방위 창업 지원': 'support', '검증된 건강 분양 시스템': 'health', '통합 마케팅 대행': 'megaphone', '상권 보호': 'map', '부담을 줄인 창업 비용': 'coin', '표준화된 매뉴얼': 'book' };
export const WHY_EN: Record<string, string> = { '전방위 창업 지원': 'Full Support', '검증된 건강 분양 시스템': 'Health Check', '통합 마케팅 대행': 'Marketing', '상권 보호': 'Area Protection', '부담을 줄인 창업 비용': 'Lower Cost', '표준화된 매뉴얼': 'Manual' };
export const CORE_ICON: Record<string, string> = { '실전 기반 운영 노하우': 'chart', '지속적인 본사 지원·교육': 'school', '인테리어 가이드': 'store', '점주와 상생': 'hands' };

export const Badge = ({ children }: { children: React.ReactNode }) => <p className="g-badge">{children}</p>;

export function FrHero({ badge, title, lead, crumbs, stats, cards }: {
  badge: string; title: React.ReactNode; lead: string; crumbs?: React.ReactNode;
  stats?: { k: string; v: number; unit: string; note?: string }[]; cards?: boolean;
}) {
  return (
    <section className="g-hero">
      <div className="wrap g-hero-in">
        {crumbs}
        <Badge>{badge}</Badge>
        <h1 className="g-title">{title}</h1>
        <p className="g-lead">{lead}</p>
        <div className="g-actions">
          <a className="g-btn" href={tel}><IconPhone /><span>가맹 상담 {CONTACT.phone}</span></a>
          <a className="g-btn ghost" href={LINKS.kakao} target="_blank" rel="noopener"><span>카카오톡 상담</span><IconArrow /></a>
        </div>
        {stats && (
          <dl className="g-stats reveal-group">
            {stats.map((x) => <div key={x.k} className="g-stat"><dd><span data-count={String(x.v)}>{x.v.toLocaleString()}</span><small>{x.unit}</small></dd><dt>{x.k}</dt>{x.note && <p>{x.note}</p>}</div>)}
          </dl>
        )}
      </div>
      {cards && (
        <div className="g-cards" aria-hidden="false">
          {[PUPPIES[0], PUPPIES[1], PUPPIES[2]].map(([src, name], i) => (
            <figure key={src} className={`g-card c${i}`}>
              <img src={`/images/b/${src}.webp`} alt={`${BRAND} 분양 ${name}`} fetchPriority={i === 1 ? 'high' : undefined} />
              <figcaption><small>본사 분양</small>{name}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

export const PhotoStrip = ({ title, sub }: { title: string; sub: string }) => {
  const row = PUPPIES.map(([src, name]) => <figure key={src}><img src={`/images/b/${src}.webp`} alt={`${BRAND} 분양 ${name}`} loading="lazy" /><figcaption>{name}</figcaption></figure>);
  return (
    <section className="g-strip">
      <div className="wrap g-head"><h2>{title}</h2><p>{sub}</p></div>
      <div className="g-marquee"><div className="g-mtrack"><div className="g-row">{row}</div><div className="g-row" aria-hidden="true">{row}</div></div></div>
    </section>
  );
};

// 분양후기 (dorothypet.co.kr/reviews — 네이버 리뷰를 옮긴 목록)
type Review = { id: string; kind: string; text: string; date: string };
const REVIEWS = (reviewData.reviews as Review[]);
// count: 지역 페이지는 페이지마다 다른 8개만 (같은 후기 문장이 1,000쪽에 반복되지 않게)
export const Reviews = ({ title, offset = 0, count = REVIEWS.length }: { title: string; offset?: number; count?: number }) => {
  const list = [...REVIEWS.slice(offset % REVIEWS.length), ...REVIEWS.slice(0, offset % REVIEWS.length)].slice(0, count);
  const card = (r: Review) => (
    <figure key={r.id} className="g-review">
      <img src={`/images/rv/${r.id}.webp`} alt={`${BRAND} 부산본점 ${r.kind} 사진`} loading="lazy" />
      <blockquote><p className="rv-kind">{r.kind}</p><p>{r.text}</p><cite>네이버 리뷰 · {r.date}</cite></blockquote>
    </figure>
  );
  return (
    <section className="g-reviews">
      <div className="wrap g-head between">
        <div><h2>{title}</h2><p>{BRAND} 부산본점 고객이 남긴 네이버 리뷰입니다. 가맹점도 같은 분양·사후관리 방식을 씁니다.</p></div>
        <a className="g-more" href={`${LINKS.home}reviews`} target="_blank" rel="noopener">후기 전체 보기<IconArrow /></a>
      </div>
      <div className="g-marquee slow"><div className="g-mtrack"><div className="g-row">{list.map(card)}</div><div className="g-row" aria-hidden="true">{list.map(card)}</div></div></div>
    </section>
  );
};

// 본사 지원 체크리스트 일러스트 + 설명 (gopung '직접 책임지고' 패널)
export const HQ = ['분양 아이 공급망', '건강검진·병력·혈통 정보 관리', '블로그·인스타그램·유튜브 마케팅', '인테리어 가이드', '상담·계약·사후관리 매뉴얼', '오픈 전 교육 · 오픈 후 정기 점검'];
export const OWNER = ['상권 안 점포', '동물판매업 허가에 맞는 시설', '매장을 지킬 시간과 고객 응대'];
export const FeaturePanel = ({ title, body, side }: { title: React.ReactNode; body: React.ReactNode; side?: React.ReactNode }) => (
  <div className="g-panel" data-reveal>
    <div className="g-illu">
      {side || (
        <>
          <div className="g-sheet">
            <p className="g-sheet-h"><b>본사가 맡는 것</b><span>{HQ.length}</span></p>
            <ul>{HQ.map((x) => <li key={x}><i><Icon name="check" /></i>{x}</li>)}</ul>
          </div>
          <div className="g-float"><b>{BRAND} 본사 지원</b></div>
        </>
      )}
    </div>
    <div className="g-panel-text">
      <span className="g-ic small"><Icon name="support" /></span>
      <h3>{title}</h3>
      {body}
    </div>
  </div>
);

export const IconCards = ({ items, cols = 6 }: { items: { t: string; d: string }[]; cols?: number }) => (
  <ul className={`g-icons c${cols} reveal-group`}>
    {items.map((x, i) => (
      <li key={x.t}>
        <span className={`g-ic t${i % 6}`}><Icon name={WHY_ICON[x.t] || CORE_ICON[x.t] || 'check'} /></span>
        <b>{x.t}</b>
        {WHY_EN[x.t] && <small>{WHY_EN[x.t]}</small>}
        <p>{x.d}</p>
      </li>
    ))}
  </ul>
);

export const GradCards = ({ items, label }: { items: { t: string; d: string }[]; label: string }) => (
  <div className={`g-works n${items.length} reveal-group`}>
    {items.map((x, i) => (
      <article key={x.t} className="g-work">
        <div className={`g-thumb w${i % 4}`}>
          <span className="g-tag"><Icon name={CORE_ICON[x.t] || 'check'} />{String(i + 1).padStart(2, '0')}</span>
          <h3>{x.t}</h3>
        </div>
        <p className="g-work-k">{label}</p>
        <p className="g-work-d">{x.d}</p>
      </article>
    ))}
  </div>
);

// 11단계를 4구간으로
const PHASES: [string, number[]][] = [['상담', [0, 1, 2]], ['점포', [3, 4, 5, 6]], ['계약·공사', [7, 8]], ['교육·오픈', [9, 10]]];
export const StepTrack = ({ desc }: { desc?: string[] }) => (
  <div className="g-track reveal-group">
    {PHASES.map(([name, idx], pi) => (
      <section key={name} className={`g-phase p${pi}`}>
        <h3><span>STEP {pi + 1}</span>{name}</h3>
        <ol>{idx.map((i) => <li key={i}><b>{String(i + 1).padStart(2, '0')}</b><span>{FR_STEPS[i]}{desc?.[i] && <small>{desc[i]}</small>}</span></li>)}</ol>
      </section>
    ))}
  </div>
);

export const Branches = () => (
  <ul className="g-branches reveal-group">
    {BRANCHES.map((b, i) => (
      <li key={b.name}>
        <small>{i === 0 ? 'HEAD OFFICE' : 'BRANCH'}</small>
        <strong>{b.name}</strong>
        <p>{b.address}</p>
        <a href={`tel:${b.phone.replace(/[^0-9]/g, '')}`}><IconPhone />{b.phone}</a>
      </li>
    ))}
  </ul>
);

export const CtaBox = ({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub: string }) => (
  <section className="g-cta">
    <div className="wrap">
      <div className="g-cta-card" data-reveal>
        <p className="g-cta-eye">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{sub}</p>
        <div className="g-actions center">
          <a className="g-btn white" href={tel}><IconPhone /><span>미팅 예약하기</span></a>
          <a className="g-btn line" href={tel}>{CONTACT.phone}</a>
        </div>
      </div>
    </div>
  </section>
);
