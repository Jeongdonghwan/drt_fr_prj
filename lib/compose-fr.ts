// 창업 키워드 페이지 조합기 (1,000개).
// 사실 근거: data/regions.json(반려동물 등록 2022 누계·주민등록 세대 2026.9, 순위는 같은 단위 안에서 계산),
//           lib/site.ts(가맹 페이지 문구: 핵심 경쟁력·왜 도로시펫·11단계·상담 방법).
// 하지 않는 것: 창업 비용 숫자·수익률·'타 브랜드 1/3' 같은 비교 수치(사이트도 금액 미표기), 지점 수 부풀리기.
import { FrPage, FrWord, REGIONS, hash } from './data';
import { BRAND, CONTACT, BRANCHES, FR_CORE, FR_WHY, FR_STEPS, FR_MOTTO, ADOPT_STEPS, DELIVERY_STEPS, PROMISES } from './site';
import { j } from './ko';

const pick = <T,>(arr: T[], s: string, salt: string) => arr[hash(`${s}::${salt}`) % arr.length];
// 해시 뒤섞기 — 연속 묶음을 자르는 회전은 이웃 페이지끼리 대부분 겹쳐서 쓰지 않는다
const rotate = <T,>(arr: T[], s: string, salt: string) => arr.map((x, i) => [hash(`${s}::${salt}::${i}`), x] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const n = (x: number) => x.toLocaleString();

const WORD: Record<FrWord, { label: string; focus: string }> = {
  창업: { label: '창업', focus: '업종 선택' },
  소자본창업: { label: '소자본 창업', focus: '초기 부담' },
  강아지분양창업: { label: '강아지 분양 창업', focus: '분양 운영' },
  펫샵창업: { label: '펫샵 창업', focus: '매장 운영' },
  애견샵창업: { label: '애견샵 창업', focus: '매장 운영' },
  애견분양창업: { label: '애견 분양 창업', focus: '분양 운영' },
  애견분양샵창업: { label: '애견 분양샵 창업', focus: '분양샵 운영' },
  core: { label: '반려동물 분양 창업', focus: '전국' },
};
const BRANCH_SIDO: Record<string, string> = { 부산: '부산본점', 대구: '대구점', 광주: '광주점' };

export function composeFr(p: FrPage) {
  const s = p.slug;
  const r = p.region;
  const w = WORD[p.word];
  const place = r ? (r.level === 'sido' ? r.label : `${r.label}(${r.sidoName})`) : '전국';
  const short = r ? r.label.replace(/(특별자치시|특별자치도|특별시|광역시)$/, '') : '전국';
  const branch = r && BRANCH_SIDO[r.sido];
  const pairKey = `${p.regionKey || 'all'}|${p.word}`; // '포항시 X'와 '포항 X'가 같은 키
  const half = <T,>(arr: T[], k: number) => (p.breakdown ? arr.slice(k, k * 2) : arr.slice(0, k));
  const unit = r?.level === 'sido' ? '시도' : '도시';

  // ---- 지역 사실 — 측면 9개 중 유형마다 다른 3개 (같은 지역 7개 유형 페이지가 같은 문단을 쓰지 않게) ----
  const sidoAvg = r && r.level === 'city' ? REGIONS[r.sido] : undefined;
  const partWord = r?.level === 'sido' ? '시군구' : '행정동';
  const parts = r ? r.parts.filter((x) => x.name) : [];
  const catPct = r && r.dogs ? Math.round((r.cats / r.dogs) * 1000) / 10 : 0;
  const F: Record<string, string> = !r ? {} : {
    hh: pick([
      `${place}에는 주민등록 ${n(r.households)}세대가 살고(2026년 9월), 그중 1인 세대가 ${r.onePct}%입니다.`,
      `2026년 9월 주민등록 기준 ${short} 세대 수는 ${n(r.households)}세대, 1인 세대 비율은 ${r.onePct}%입니다.`,
    ], s, 'f1'),
    reg: pick([
      `농림축산검역본부 집계로 ${short}에 등록된 반려견은 ${n(r.dogs)}마리, 반려묘는 ${n(r.cats)}마리입니다(2022년 누계).`,
      `${short}의 동물등록 누계는 개 ${n(r.dogs)}마리, 고양이 ${n(r.cats)}마리입니다(2022년, 농림축산검역본부).`,
    ], s, 'f2'),
    rank: `세대 100곳당 등록 반려견은 ${r.per100}마리로, 이 안내에서 다루는 ${r.rankOf}개 ${unit} 중 등록 수 ${r.rankDogs}위, 세대 대비 ${r.rankPer100}위입니다.`,
    one: r.onePct >= 45 ? `1인 세대가 ${r.onePct}%로 많아 소형견·고양이 상담 비중을 높게 잡는 편이 맞습니다.`
      : r.onePct <= 35 ? `1인 세대가 ${r.onePct}%로 적고 가족 세대가 많아, 아이와 함께 키울 강아지를 찾는 가족 단위 상담이 많을 상권입니다.`
        : `1인 세대 ${r.onePct}%로 가족 세대와 1인 세대가 섞여 있어, 소형견부터 가족견까지 고르게 준비하는 구성이 맞습니다.`,
    dens: r.per100 >= 14 ? `${j(short, '은')} 세대 대비 반려견 등록이 많은 편(100세대당 ${r.per100}마리)이라 이미 반려견을 키우는 집의 소개·재방문 수요도 함께 볼 수 있습니다.`
      : r.per100 <= 10 ? `${j(short, '은')} 세대 대비 반려견 등록이 적은 편(100세대당 ${r.per100}마리)이라, 입지는 유동 인구가 모이는 상권 중심으로 보수적으로 고릅니다.`
        : `${short}의 세대 대비 반려견 등록(100세대당 ${r.per100}마리)은 중간 수준이라, 주변 주거 단지와 유동 인구를 함께 봅니다.`,
    cmp: sidoAvg ? `${sidoAvg.label} 평균(1인 세대 ${sidoAvg.onePct}%, 세대 100곳당 반려견 ${sidoAvg.per100}마리)과 비교하면 ${j(short, '은')} 1인 세대가 ${r.onePct > sidoAvg.onePct ? '많고' : r.onePct < sidoAvg.onePct ? '적고' : '비슷하고'}, 반려견 등록 밀도는 ${r.per100 > sidoAvg.per100 ? '높습니다' : r.per100 < sidoAvg.per100 ? '낮습니다' : '비슷합니다'}.`
      : `${short}의 반려견 등록 ${n(r.dogs)}마리는 ${r.rankOf}개 시도 가운데 ${r.rankDogs}번째로 많습니다.`,
    top: parts.length > 1 ? `${short}에서 세대가 가장 많은 ${partWord}은 ${parts.slice(0, 3).map((x) => `${x.name}(${n(x.households)}세대)`).join(', ')}입니다.` : `${short} 전체 ${n(r.households)}세대를 생활권별로 나눠 입지를 봅니다.`,
    cat: `반려묘 등록은 ${n(r.cats)}마리로 반려견의 ${catPct}% 수준입니다. 고양이는 동물등록 의무가 아니라 실제 키우는 수보다 적게 잡히므로, 고양이 분양 비중은 상담 문의로 가늠합니다.`,
    gu: r.gus && r.gus.length ? `구별로는 ${r.gus.map((g) => `${g.name.split(' ').slice(-1)[0]} ${n(g.households)}세대(1인 ${g.onePct}%)`).join(', ')}입니다.`
      : `${short}의 1인 세대 비율 ${r.onePct}%는 ${r.sidoName} ${sidoAvg ? `평균 ${sidoAvg.onePct}%` : '전체'}와 함께 봐야 입지 판단이 정확해집니다.`,
  };
  const FACETS: Record<FrWord, string[]> = {
    창업: ['hh', 'one', 'cmp'], 소자본창업: ['hh', 'dens', 'top'], 강아지분양창업: ['reg', 'rank', 'one'], 펫샵창업: ['reg', 'cat', 'dens'],
    애견샵창업: ['rank', 'cmp', 'top'], 애견분양창업: ['hh', 'reg', 'cat'], 애견분양샵창업: ['rank', 'one', 'gu'], core: [],
  };
  const partLines = parts.slice(0, 4).map((x, i) => pick([
    `${x.name}: ${n(x.households)}세대, 1인 세대 ${x.onePct}%${x.dogs ? `, 반려견 등록 ${n(x.dogs)}마리` : ''}.`,
    `${i === 0 ? `세대가 가장 많은 ${partWord}은 ${x.name}` : x.name}(${n(x.households)}세대)로 1인 세대 비율은 ${x.onePct}%입니다.`,
  ], s + x.name, 'pl') + (x.onePct >= 45 ? ' 1인 가구 중심이라 소형견·고양이 상담에 맞는 입지입니다.' : x.onePct <= 30 ? ' 가족 세대 중심이라 가족견 상담과 소개 재방문 수요를 함께 봅니다.' : ''));
  // 짧은 표기 페이지: 생활권 나눔 문장 + 유형별 측면 1개 / 정식 표기: 유형별 측면 3개
  const wordIdx = Object.keys(FACETS).indexOf(p.word);
  const facts: string[] = !r ? [
    `${BRAND}은 부산본점·대구점·광주점을 운영하며 가맹점을 모집하고 있습니다.`,
    `지역마다 반려동물 등록 수와 1인 세대 비율이 달라, 상권 분석에서 주거 형태와 유동 인구를 함께 봅니다.`,
  ] : p.breakdown ? [
    `${short} 안에서도 ${partWord}마다 세대 구성이 다릅니다. 2026년 9월 주민등록 기준으로 세대가 많은 곳부터 보면 다음과 같습니다.`,
    ...rotate(partLines, s, 'plr').slice(0, 3),
    F[['cat', 'gu', 'dens', 'rank', 'reg', 'cmp', 'one'][wordIdx % 7]],
  ] : FACETS[p.word].map((k) => F[k]);
  if (r && (r.sido === '광주' || r.sido === '전남') && wordIdx % 2 === 0) facts.push(`광주광역시와 전라남도는 2026년 7월 전남광주통합특별시로 통합됐습니다. 위 세대 수는 통합 뒤 행정구역에서 ${r.sido === '광주' ? '옛 광주 5개 구' : '옛 전라남도 지역'}만 더한 값입니다.`);
  if (branch && wordIdx % 2 === 1) facts.push(`${short}에는 이미 ${BRAND} ${branch}이 있어, 동일 상권 중복 가맹 제한 원칙에 따라 ${branch} 상권과 겹치지 않는 입지부터 검토합니다.`);

  // ---- 유형별 본문 ----
  const wordBody: Record<FrWord, string[]> = {
    창업: [
      `요즘 창업은 인건비와 운영비가 오르고 배달·숙박 같은 플랫폼 수수료가 커지면서, 지금 수익보다 오래 갈 구조인지가 더 중요해졌습니다.`,
      `반려동물 분양은 단순 판매가 아니라 상담과 신뢰, 사후관리가 핵심인 분야라 사람의 경험이 매출을 좌우합니다. ${short}에서 ${j(w.label, '을')} 고민한다면 이 점을 먼저 봅니다.`,
    ],
    소자본창업: [
      `소자본 창업에서 가장 큰 부담은 처음부터 공급망·운영 시스템을 혼자 만드는 비용입니다. ${BRAND}은 공급망과 운영 매뉴얼을 본사가 갖추고 있어 그 부담을 덜어 줍니다.`,
      `인테리어는 브랜드 가이드를 따르되 부담 없는 금액으로 진행하고, 블로그·인스타그램·유튜브 마케팅은 본사가 직접 기획·운영합니다. 정확한 창업 비용은 점포 조건에 따라 달라 본사 상담에서 안내합니다.`,
    ],
    강아지분양창업: [
      `강아지 분양 매장은 공급망 구축, 개체 관리, 상담, 계약, 사후관리까지 직접 해야 할 일이 많습니다. ${BRAND}은 이 과정을 교육과 매뉴얼로 나눠 처음 하는 분도 따라오게 합니다.`,
      `동물을 파는 영업은 동물보호법에 따라 지자체의 동물판매업 허가를 받아야 합니다. ${BRAND}은 가맹 과정에서 인허가 점검 단계를 따로 둡니다.`,
    ],
    애견분양창업: [
      `애견 분양은 건강한 아이를 데려오는 것만큼 분양 뒤 관리가 중요합니다. ${BRAND}은 건강검진·병력·혈통 정보를 투명하게 보여 주는 분양 관리 방식을 가맹점에도 그대로 씁니다.`,
      `동물판매업 허가(동물보호법)와 계약서 양식, 고객 응대 순서까지 오픈 전 교육에서 다룹니다.`,
    ],
    펫샵창업: [
      `펫샵은 분양 한 번으로 끝나지 않고, 사후관리와 소개로 다시 찾게 만드는 구조가 중요합니다. ${BRAND}은 분양 뒤 상담을 추가 비용 없이 이어 갑니다.`,
      `매장은 반려동물과 보호자가 모두 편한 따뜻한 공간으로 꾸미고, 인테리어 가이드는 본사가 제공합니다.`,
    ],
    애견샵창업: [
      `애견샵 창업은 입지와 첫 고객 신뢰가 매출을 좌우합니다. ${BRAND}은 상권 분석으로 기존 점주와 겹치지 않는 자리를 찾고, 오픈 뒤 정기 점검과 매월 프로모션을 지원합니다.`,
      `분양 상담·계약·사후관리 응대는 표준 매뉴얼로 교육해 직원이 바뀌어도 같은 품질을 유지합니다.`,
    ],
    애견분양샵창업: [
      `애견 분양샵은 '어디서 왔는지'와 '분양 뒤 어떻게 챙기는지'로 선택받습니다. ${BRAND}은 전문 켄넬·캐터리 공급망과 사후관리 시스템을 함께 넘겨 드립니다.`,
      `상권 분석·인허가 점검·점포 계약·인테리어·점주 교육까지 11단계로 오픈을 준비합니다.`,
    ],
    core: [
      `반려동물 분양 창업은 상담과 신뢰가 중요한 업종이라 혼자 시스템을 만들기보다 검증된 운영 구조를 가져오는 편이 안정적입니다.`,
      `${BRAND}은 공급망, 분양 관리, 마케팅, 운영 매뉴얼을 본사가 지원하고, 무분별한 출점 대신 상권 분석으로 점주끼리 겹치지 않게 합니다.`,
    ],
  };

  // 짧은 표기 페이지용 두 번째 문단 묶음 — 같은 지역 정식 표기 페이지와 문장이 겹치지 않게
  const top = parts[0]?.name || short;
  const wordBodyB: Record<FrWord, string[]> = {
    창업: [`${short} 창업 상담에서는 업종보다 먼저 ${top}처럼 세대가 몰린 생활권을 봅니다. 반려동물 분양은 동네 단골과 소개로 크는 업종이라 생활권 안 입지가 중요합니다.`,
      `${BRAND}은 ${short} 안 ${partWord}별 세대 구성과 1인 세대 비율을 놓고 소형견 중심으로 갈지, 가족견 중심으로 갈지 함께 정합니다.`],
    소자본창업: [`초기 부담을 줄이려면 ${short}에서도 임대료가 높은 대로변보다 ${top} 같은 주거 밀집 생활권의 이면 입지를 함께 검토합니다.`,
      `공급망·매뉴얼·마케팅을 본사가 맡으니 점주는 매장 운영과 상담에 집중합니다. 비용 항목은 점포 조건을 보고 본사에서 나눠 안내합니다.`],
    강아지분양창업: [`${short} 강아지 분양 매장은 ${top}처럼 세대가 많은 곳의 가족 수요와, 1인 세대가 많은 곳의 소형견 수요를 나눠 봐야 분양 구성이 맞습니다.`,
      `개체 관리와 건강 확인 안내, 계약서 작성, 분양 뒤 상담까지 본사 교육 순서대로 익힙니다. 동물판매업 허가는 인허가 점검 단계에서 확인합니다.`],
    애견분양창업: [`${short}의 ${partWord}별 1인 세대 비율 차이는 분양 품종 구성으로 이어집니다. 1인 세대가 많으면 소형견·고양이, 가족 세대가 많으면 중형견·가족견 상담이 늘어납니다.`,
      `분양 관리는 건강검진·병력·혈통 정보를 보여 주는 본사 방식 그대로이고, 사후관리 응대도 매뉴얼로 맞춥니다.`],
    펫샵창업: [`${short} 펫샵은 ${top} 같은 생활권 안에서 분양 고객의 소개와 재방문을 만들 수 있는지가 운영을 가릅니다.`,
      `${BRAND} 부산본점의 분양 공간·상담실 구성을 참고해 점포 크기에 맞게 공간을 나눕니다.`],
    애견샵창업: [`${short} 애견샵 입지는 ${partWord}별 세대 수와 유동 인구를 함께 봅니다. 기존 가맹점 상권과 겹치면 출점하지 않는 것이 원칙입니다.`,
      `오픈 뒤에는 정기 점검과 월별 프로모션으로 첫 해 운영을 함께 챙깁니다.`],
    애견분양샵창업: [`${short}에서 분양샵을 연다면 ${top} 생활권처럼 세대가 몰린 곳에서 출신이 확실한 아이와 사후관리로 신뢰를 쌓는 것이 먼저입니다.`,
      `전문 켄넬·캐터리 공급망, 계약서 양식, 사후관리 응대까지 본사 시스템을 그대로 씁니다.`],
    core: wordBody.core,
  };

  // ---- 유형별 운영 블록 (같은 지역 다른 유형 페이지가 서로 다른 실제 운영 내용을 갖게) ----
  const MARKET = [
    `인건비와 운영비가 오르면서 카페·편의점은 키오스크와 무인 운영으로 바뀌고 있고, 배달·숙박 플랫폼 중심 구조에서 개인 자영업자가 높은 수익을 지키기는 점점 어려워졌습니다.`,
    `반려동물 분양은 단순 판매가 아니라 상담과 신뢰, 고객과의 소통이 중요한 분야라 사람의 전문성과 경험이 여전히 중요합니다.`,
    `다만 공급망, 개체 관리, 상담, 계약, 사후관리까지 직접 해야 할 일이 많아 혼자 시스템을 만들기에는 부담이 큽니다.`,
    `퇴직금처럼 소중한 자금으로 시작한다면 단기 유행보다 오래 운영할 수 있는 구조인지 먼저 확인하세요. 그래서 ${BRAND}은 전화만으로 결정하기보다 본사 방문 상담을 권합니다.`,
  ];
  type Extra = { heading: string; body: string[]; steps?: { t: string; d: string }[]; table?: { head: string[]; rows: string[][] } };
  const extra: Extra = (() => {
    switch (p.word) {
      case '창업': case 'core':
        return { heading: pick(['창업 시장은 지금 어떻게 변하고 있을까요', `${short}에서 업종을 고를 때`, '오래 갈 업종인지부터'], s, 'xh'), body: rotate(MARKET, s, 'mk').slice(0, 3) };
      case '소자본창업':
        return { heading: pick(['본사가 맡는 것, 점주가 준비하는 것', `${short} 소자본 창업 준비물`, '초기 부담을 나누는 방법'], s, 'xh'), body: [
          `본사가 맡는 것: 분양 아이 공급망, 건강·혈통 정보 관리 방식, 블로그·인스타그램·유튜브 마케팅, 인테리어 가이드, 상담·계약·사후관리 매뉴얼, 오픈 전 교육과 오픈 후 정기 점검.`,
          `점주가 준비하는 것: ${short} 안 점포, 동물판매업 허가에 맞는 시설, 매장을 지킬 시간과 고객 응대. 인허가는 가맹 과정의 점검 단계에서 함께 확인합니다.`,
          MARKET[2],
        ] };
      case '강아지분양창업': case '애견분양창업':
        return { heading: pick([`${short} 가맹점도 이렇게 분양합니다`, '본사와 같은 분양 5단계', '분양 절차는 본점과 같습니다'], s, 'xh'), body: [`${BRAND} 부산본점의 분양 절차를 가맹점에서도 그대로 씁니다. 전화만으로 분양하지 않고, 건강 확인은 예비 보호자가 동물병원에서 직접 합니다.`], steps: ADOPT_STEPS };
      case '펫샵창업': case '애견샵창업':
        return { heading: pick(['분양 뒤에도 이어지는 관리', `${short} ${w.label}, 홈딜리버리까지`, '집까지 데려다주는 홈딜리버리'], s, 'xh'), body: [
          `직접 오기 어려운 고객은 매장 상담으로 분양을 정한 뒤 홈딜리버리로 집까지 데려다줍니다. 가맹점도 같은 순서로 운영합니다.`,
          `분양 뒤 궁금한 점은 전화·SNS로 상담하고, 사후관리는 추가 비용이 없습니다.`,
        ], steps: DELIVERY_STEPS.map((t, i) => ({ t: `${i + 1}단계`, d: t })) };
      default:
        return { heading: pick([`${short} 분양샵이 지키는 것`, '분양샵 신뢰는 사후관리에서', '홈딜리버리까지 같은 기준'], s, 'xh'), body: [
          ...rotate(PROMISES, s, 'pm').slice(0, 3).map((x) => `${x.t}: ${x.d}`),
          `직접 오기 어려운 고객은 홈딜리버리로 집까지 데려다줍니다. 순서는 ${DELIVERY_STEPS.join(' → ')}입니다.`,
        ] };
    }
  })();

  const title = pick([
    `${p.kw} | ${BRAND} 가맹 상담`,
    `${p.kw} — ${short} ${w.label} 상권 데이터 | ${BRAND}`,
    `${p.kw} | ${BRAND} 가맹 11단계`,
  ], s, 'title').slice(0, 60);
  const description = (r
    ? `${p.kw}. ${short} ${n(r.households)}세대, 반려견 등록 ${n(r.dogs)}마리(세대 100곳당 ${r.per100}마리). ${BRAND} 가맹 지원과 11단계 오픈 과정, 상담 ${CONTACT.phone}.`
    : `${p.kw}. ${BRAND} 가맹 핵심 경쟁력, 왜 도로시펫인가, 상담부터 오픈까지 11단계. 본사 방문 상담 ${CONTACT.phone}.`).slice(0, 158);

  const summary = [
    r && p.breakdown && r.parts[0]?.name ? `${short}에서 세대가 가장 많은 곳은 ${r.parts[0].name}(${n(r.parts[0].households)}세대, 1인 세대 ${r.parts[0].onePct}%)입니다.` : r ? `${short}: 주민등록 ${n(r.households)}세대 · 1인 세대 ${r.onePct}% · 반려견 등록 ${n(r.dogs)}마리(세대 100곳당 ${r.per100}마리).` : `${BRAND}: 부산본점·대구점·광주점 운영, 가맹점 모집 중.`,
    ...rotate(p.breakdown ? [
      `${short} 가맹 상담도 전화로 미팅을 잡고 본사 매장을 둘러본 뒤 진행합니다.`,
      `${short} 안 기존 가맹점 상권과 겹치는 자리는 출점하지 않습니다.`,
      `${short} 점포 비용은 크기·입지·인테리어 범위를 보고 항목별로 안내합니다.`,
    ] : [
      `${BRAND} 가맹은 전화로 미팅을 예약한 뒤 본사 매장을 직접 보고 상담하는 방식입니다. 전화만으로 결정하지 않기를 권합니다.`,
      `본사 지원: 창업 컨설팅·교육·오픈·운영관리, 통합 마케팅, 동일 상권 중복 가맹 제한.`,
      `정확한 창업 비용은 점포 크기·입지에 따라 달라 상담에서 안내합니다.`,
      `${short} ${j(w.label, '은')} 상권 분석 → 인허가 점검 → 점포 계약 → 인테리어 → 점주 교육 순서로 준비합니다.`,
      `${w.label}도 블로그·인스타그램·유튜브 마케팅은 본사가 직접 기획·운영합니다.`,
    ], s, 'sum').slice(0, 3),
  ];

  // 같은 시도 다른 지역 비교 (같은 단위끼리)
  const peers = r ? Object.entries(REGIONS).filter(([k, x]) => x.level === r.level && (r.level === 'sido' || x.sido === r.sido) && k !== p.regionKey)
    .sort((a, b) => b[1].per100 - a[1].per100).slice(0, 4) : [];
  const compare = r && !p.breakdown && ['창업', '애견샵창업', '강아지분양창업', '애견분양샵창업'].includes(p.word) ? [[short, r], ...peers.map(([, x]) => [x.label.replace(/(특별자치시|특별자치도|특별시|광역시)$/, ''), x])] as [string, typeof r][] : [];
  const partTable = r && (p.breakdown || !compare.length) ? (p.breakdown ? parts.slice(0, 8) : parts.slice(0, 5)) : [];

  return {
    title, description, summary, place, short, w,
    eyebrow: `${BRAND} 가맹 · ${r ? short : '전국'}`,
    lead: pick([
      `${short}에서 ${j(w.label, '을')} 알아보는 분께 지역 반려동물 데이터와 ${BRAND} 가맹 지원 내용을 정리했습니다.`,
      `${FR_MOTTO}는 생각으로 운영합니다. ${short} ${w.label} 상담은 본사 방문으로 시작합니다.`,
      `${short} ${w.label}, 상권 분석부터 인허가 점검·인테리어·점주 교육·오픈까지 11단계로 함께합니다.`,
    ], s, 'lead'),
    heroImg: pick(['hero-dog', 'hero-puppy', 'hero-cat'], s, 'hero'),
    facts, wordBody: (p.breakdown ? wordBodyB : wordBody)[p.word],
    factsHeading: r ? pick([`${short} 상권, 숫자로 보기`, `${short} 반려동물 데이터`, `${short}에서 ${j(w.label, '을')} 한다면`], s, 'fh') : '전국 가맹 안내',
    wordHeading: pick([`${w.label}, ${w.focus}부터`, `${w.label}에서 중요한 것`, `${BRAND}이 ${w.focus}을 돕는 방법`], s, 'wh'),
    dl: r && !p.breakdown ? rotate([['주민등록 세대', `${n(r.households)}세대 (2026.9)`], ['1인 세대', `${r.onePct}%`], ['반려견 등록', `${n(r.dogs)}마리 (2022 누계)`], ['반려묘 등록', `${n(r.cats)}마리`], ['세대 100곳당 반려견', `${r.per100}마리 · ${r.rankOf}개 ${unit} 중 ${r.rankPer100}위`]] as [string, string][], pairKey, 'dl').slice(0, 4) : r && p.breakdown ? [['기준', `${short} 전체 ${n(r.households)}세대`], ...r.parts.filter((x) => x.name).slice(0, 4).map((x) => [x.name, `${n(x.households)}세대 · 1인 ${x.onePct}%`])] as [string, string][] : r ? [['주민등록 세대', `${n(r.households)}세대 (2026.9)`], ['1인 세대', `${r.onePct}%`], ['반려견 등록', `${n(r.dogs)}마리 (2022 누계)`], ['반려묘 등록', `${n(r.cats)}마리`], ['세대 100곳당 반려견', `${r.per100}마리 · ${r.rankOf}개 ${unit} 중 ${r.rankPer100}위`]] as [string, string][] : [],
    compare,
    extra,
    compareCaption: r ? (r.level === 'sido' ? '시도별 세대 100곳당 반려견 등록' : `${r.sidoName} 도시별 세대 100곳당 반려견 등록`) : '',
    partTable, partWord,
    core: half(rotate(FR_CORE, pairKey, 'core'), 2).map((x, i) => ({ t: x.t, d: i === 0 ? `${short} 가맹점에도 같은 기준입니다. ${x.d}` : x.d })),
    why: half(rotate(FR_WHY, pairKey, 'why'), 3),
    steps: (() => {
      const D: [string, string][] = [
        [`전화로 본사 미팅 날짜를 잡습니다. ${short}에서 오시는 일정에 맞춰 조정합니다.`, '온라인이나 전화로 미팅 일정을 먼저 예약합니다.'],
        ['예비 점주님이 궁금한 점을 본사 매장에서 직접 묻고 운영 시스템을 봅니다.', '본사 매장을 둘러보며 분양·상담 운영을 직접 확인합니다.'],
        ['상담 내용을 바탕으로 가맹 신청서를 냅니다.', '운영 방식에 동의하면 가맹 신청을 진행합니다.'],
        [`${short} 안 후보 상권을 보고 기존 가맹점과 겹치지 않는 자리를 찾습니다.`, '세대 구성·유동 인구를 보고 동일 상권 중복이 없는 입지를 고릅니다.'],
        ['동물판매업 허가에 필요한 시설 기준을 점포에 맞춰 확인합니다.', '점포가 인허가 기준을 맞출 수 있는지 계약 전에 점검합니다.'],
        [`${short} 후보 점포 중 조건이 맞는 곳과 임대 계약을 합니다.`, '인허가 점검을 통과한 점포로 임대 계약을 맺습니다.'],
        ['점포를 실측하고 인테리어 도면을 협의합니다.', '실측 결과로 분양 공간·상담 공간 배치를 정합니다.'],
        ['가맹 계약서를 쓰고 지원 범위를 확정합니다.', '교육·마케팅·공급 지원 범위를 계약서에 담습니다.'],
        ['브랜드 인테리어 가이드에 맞춰 공사합니다.', '따뜻하고 편안한 매장 가이드대로 공사를 진행합니다.'],
        ['분양 상담·계약·사후관리·고객 응대를 교육받습니다.', '표준 매뉴얼로 상담부터 사후관리까지 실습합니다.'],
        [`${short} 매장을 열고, 오픈 뒤 정기 점검과 프로모션을 이어 갑니다.`, '오픈 후에도 정기 점검과 월별 프로모션이 이어집니다.'],
      ];
      const shown = new Set(rotate([...FR_STEPS.keys()], s, 'stp').slice(0, 6));
      return FR_STEPS.map((t, i) => ({ t, d: shown.has(i) ? pick(D[i], s, `sd${i}`) : '' }));
    })(),
    branches: BRANCHES,
    faq: rotate([
      { q: `${short}에도 가맹이 되나요?`, a: `${branch ? `${short}에는 ${branch}이 있어 그 상권과 겹치지 않는 곳으로 검토합니다. ` : ''}상권 분석으로 동일 상권 중복 가맹을 막고 있어, 입지별로 가능 여부를 상담에서 확인합니다.` },
      { q: `${short} ${w.label} 비용은 얼마인가요?`, a: `${short} 점포 크기·입지·인테리어 범위에 따라 달라 본사 방문 상담에서 항목별로 안내합니다.` },
      { q: `${short}에서 경험 없이 시작해도 되나요?`, a: `오픈 전 교육부터 오픈 후 정기 점검까지 지원하고, 상담·계약·사후관리 매뉴얼로 교육합니다. ${short} 상권 특성(1인 세대 ${r ? r.onePct + '%' : '지역별'})에 맞춘 분양 구성도 함께 정합니다.` },
      { q: '마케팅은 직접 해야 하나요?', a: '블로그·인스타그램·유튜브 마케팅을 본사가 직접 기획·운영합니다.' },
      { q: '상담은 어떻게 받나요?', a: `전화(${CONTACT.phone})로 미팅을 예약한 뒤 본사 매장을 방문해 운영 시스템을 보고 상담합니다.` },
      { q: '허가가 필요한가요?', a: '동물을 판매하는 영업은 동물보호법상 지자체 동물판매업 허가가 필요합니다. 가맹 과정의 인허가 점검 단계에서 함께 확인합니다.' },
    ], s, 'faq').slice(0, 3),
    closing: pick([`${short} ${w.label} 상담 예약`, '본사 방문 상담부터 시작하세요', `${short}에서 ${BRAND}을 열고 싶다면`], s, 'cl'),
  };
}
