# 도로시펫 가맹 창업 SEO 사이트 — 메인 랜딩 + 창업 1,000

dorothypet.co.kr/franchise 를 바탕으로 한 가맹 창업 전용 사이트. Next.js 정적 export. 분양 매장 사이트(dorothypet_prj)와 도메인을 나눈다.

## 페이지
- `/` 가맹 랜딩: 핵심 경쟁력 → 시장 변화 → 왜 도로시펫 → 11단계(#steps) → 운영 매장 → FAQ → 지역별 창업 전체 목록(#regions)
- `/<키워드>/` 창업 1,000: 원본 `애견창업 - 도로시.xlsx` 914 + 추가 86 (엑셀은 dorothypet_prj `keywords/도로시펫_키워드_매장1050_창업1000.xlsx`의 창업 시트)
- 지역 데이터: 행정안전부 주민등록 세대 2026.9 + 농림축산검역본부 반려동물 등록 2022 누계 (`data/regions.json`)

```bash
python -I scripts/make_og.py --force    # 메인 + 창업 페이지 og → public/og
npx next build                          # → out/
python -I scripts/dup_pairs.py          # 표기 쌍·같은 지역 다른 유형 겹침
python -I ~/.claude/skills/site-launch/scripts/check_all.py C:/side_Prj/dorothypet_franchise_prj
```

## 연락처·링크 (`lib/site.ts`)
- 가맹 상담 010-2236-8276(대표전화와 같은지 확인 필요), 카카오 pf.kakao.com/_AxjExkb
- 헤더: 오픈 과정 · 지역별 창업 · 분양 매장(`STORE_SITE`) · 공식 가맹 페이지. 하단 고정 바: 가맹 상담 / 카카오톡 상담 / 지역별 창업

## 색인 지표 (2026-10-28)
| 항목 | 값 | 기준 |
|---|---|---|
| check_all | SEO 구조·중복 문서·AI 티·화면 버그 모두 통과, sitemap 1,001 | |
| 본문 (표본 40) | 평균 1,356자 · 최소 1,186 | 1,300+ |
| 같은 문장 (표본 40) | 평균 18% · 최대 78% | 30% 이하 |
| 표기 쌍 413 ('포항시 X' vs '포항 X') | 평균 31% · 최대 50% | |
| 같은 지역 다른 유형 846 | 평균 47% · 최대 68% | |

## 확인 필요
- [ ] 창업 사이트 도메인 (`SITE_URL`, 지금 dorothypet-franchise.example) — 분양 사이트 `FRANCHISE_SITE`도 같이 변경
- [ ] 서치어드바이저·서치콘솔 소유확인 코드
- [ ] 가맹 상담 전화가 대표전화와 같은지
