// 가맹 창업 사이트 시각 블록 — 사진 모자이크 히어로, 흐르는 분양 사진 띠, 본사·점주 역할 도식, 4구간 오픈 과정, 매장 3곳.
import { BRAND, BRANCHES, CONTACT, FR_STEPS, LINKS, tel } from '../lib/site';
import { Actions, IconArrow, IconMsg, IconPhone, IconPin } from './Common';

// 본사 분양 사진(dorothypet.co.kr 분양 목록) — 사진마다 실제 품종명
export const PUPPIES: [string, string][] = [
  ['pomeranian-2835', '포메라니안'], ['british-shorthair-2823', '브리티쉬숏헤어'], ['maltipoo-2813', '말티푸'], ['poodle-2810', '토이푸들'],
  ['ragdoll-41', '랙돌'], ['shiba-inu-21', '시바이누'], ['munchkin-35', '먼치킨'], ['maltese-166', '말티즈'],
  ['bichon-frise-105', '비숑프리제'], ['american-shorthair-32', '아메리칸숏헤어'], ['chihuahua-15', '치와와'], ['shih-tzu-2815', '시츄'],
  ['retriever-54', '골든리트리버'], ['abyssinian-152', '아비시니안'], ['welsh-corgi-37', '웰시코기'],
];

export function FrHero({ label, title, lead, crumbs, stats, photos }: {
  label: string; title: React.ReactNode; lead: string; crumbs?: React.ReactNode;
  stats?: { k: string; v: number; unit: string; note?: string }[]; photos: [string, string][];
}) {
  return (
    <section className="frh">
      <div className="wrap frh-in">
        <div className="frh-copy">
          {crumbs}
          <p className="frh-label">{label}</p>
          <h1 className="frh-title">{title}</h1>
          <p className="frh-lead">{lead}</p>
          <Actions franchise dark />
          {stats && (
            <dl className="frh-stats">
              {stats.map((x) => <div key={x.k}><dt>{x.k}</dt><dd><span data-count={String(x.v)}>{x.v.toLocaleString()}</span><small>{x.unit}</small></dd>{x.note && <p>{x.note}</p>}</div>)}
            </dl>
          )}
        </div>
        <div className="frh-photos">
          {photos.map(([src, alt], i) => <figure key={src} className={`p${i}`}><img src={src} alt={alt} fetchPriority={i === 0 ? 'high' : undefined} /></figure>)}
          <p className="frh-tag"><b>{BRANCHES.length}</b>개 매장 운영 · 부산 · 대구 · 광주</p>
        </div>
      </div>
    </section>
  );
}

export const PhotoStrip = ({ caption }: { caption: string }) => {
  const row = PUPPIES.map(([src, name]) => <figure key={src}><img src={`/images/b/${src}.webp`} alt={`${BRAND} 분양 ${name}`} loading="lazy" /><figcaption>{name}</figcaption></figure>);
  return (
    <section className="strip" aria-label={caption}>
      <p className="strip-cap wrap">{caption}</p>
      <div className="strip-track"><div className="strip-row">{row}</div><div className="strip-row" aria-hidden="true">{row}</div></div>
    </section>
  );
};

// 본사가 맡는 것 ↔ 점주가 준비하는 것 (공식 가맹 페이지 '핵심 경쟁력'·'왜 도로시펫' 내용)
export const HQ = ['분양 아이 공급망', '건강검진·병력·혈통 정보 관리', '블로그·인스타그램·유튜브 마케팅', '인테리어 가이드', '상담·계약·사후관리 매뉴얼', '오픈 전 교육 · 오픈 후 정기 점검'];
export const OWNER = ['상권 안 점포', '동물판매업 허가에 맞는 시설', '매장을 지킬 시간과 고객 응대'];
export const RoleSplit = ({ where }: { where?: string }) => (
  <div className="roles" data-reveal>
    <div className="roles-hq">
      <p className="roles-k">본사가 맡는 것</p>
      <ol>{HQ.map((x) => <li key={x}>{x}</li>)}</ol>
    </div>
    <div className="roles-mid" aria-hidden="true"><span /></div>
    <div className="roles-own">
      <p className="roles-k">{where ? `${where} 점주가 준비하는 것` : '점주가 준비하는 것'}</p>
      <ol>{OWNER.map((x) => <li key={x}>{x}</li>)}</ol>
      <p className="roles-note">인허가는 가맹 과정의 점검 단계에서 본사와 함께 확인합니다.</p>
    </div>
  </div>
);

// 11단계를 4구간으로
const PHASES: [string, number[]][] = [['상담', [0, 1, 2]], ['점포', [3, 4, 5, 6]], ['계약·공사', [7, 8]], ['교육·오픈', [9, 10]]];
export const StepTrack = ({ desc }: { desc?: string[] }) => (
  <div className="track reveal-group">
    {PHASES.map(([name, idx], pi) => (
      <section key={name} className={`phase ph${pi}`}>
        <h3><span>{String(pi + 1).padStart(2, '0')}</span>{name}</h3>
        <ol>{idx.map((i) => <li key={i}><b>{String(i + 1).padStart(2, '0')}</b><span>{FR_STEPS[i]}{desc?.[i] && <small>{desc[i]}</small>}</span></li>)}</ol>
      </section>
    ))}
  </div>
);

export const Branches = () => (
  <ul className="branches reveal-group">
    {BRANCHES.map((b, i) => (
      <li key={b.name}>
        <span className="br-no">{String(i + 1).padStart(2, '0')}</span>
        <strong>{b.name.replace(/점$/, '')}<small>{i === 0 ? '본점' : '지점'}</small></strong>
        <p><IconPin />{b.address}</p>
        <a href={`tel:${b.phone.replace(/[^0-9]/g, '')}`}><IconPhone />{b.phone}</a>
      </li>
    ))}
  </ul>
);

// 상담 방법 — 전화 예약 → 본사 매장 방문 → 맞춤 상담
export const VisitBand = ({ line }: { line: React.ReactNode }) => (
  <section className="visit" data-reveal>
    <div className="wrap visit-in">
      <p className="visit-line">{line}</p>
      <ol className="visit-flow">
        <li><IconPhone /><b>전화 예약</b><span>{CONTACT.phone}</span></li>
        <li><IconPin /><b>본사 매장 방문</b><span>부산 사상구 가야대로 336</span></li>
        <li><IconMsg /><b>맞춤 창업 상담</b><span>운영 시스템 직접 확인</span></li>
      </ol>
      <div className="visit-act">
        <a className="btn-primary" href={tel}><IconPhone /><span>미팅 예약 {CONTACT.phone}</span></a>
        <a className="btn-text" href={LINKS.kakao} target="_blank" rel="noopener"><span>카카오톡으로 문의</span><IconArrow /></a>
      </div>
    </div>
  </section>
);
