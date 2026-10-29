# 도로시펫 가맹 창업 SEO 사이트 — 메인 랜딩 + 창업 1,000

dorothypet.co.kr/franchise 를 바탕으로 한 가맹 창업 전용 사이트. Next.js 정적 export. 분양 매장 사이트(dorothypet_prj)와 도메인을 나눈다.

## 페이지
- `/` 가맹 랜딩: 핵심 경쟁력 → 시장 변화 → 왜 도로시펫 → 11단계(#steps) → 운영 매장 → FAQ → 지역별 창업 전체 목록(#regions)
- `/<키워드>/` 창업 1,000: 원본 `애견창업 - 도로시.xlsx` 914 + 추가 86 (엑셀은 dorothypet_prj `keywords/도로시펫_키워드_매장1050_창업1000.xlsx`의 창업 시트)
- 지역 통계(세대·반려동물 등록·순위)는 쓰지 않는다(사용자 요청 2026-10-29: 나중에 문제 소지). `data/regions.json`은 지역 이름·시도 구분에만 씀
- 지역 페이지 본문: 공식 가맹 페이지의 장점 주제 12개(노하우·본사 지원·인테리어·상생·건강 분양·공급망·마케팅·상권 보호·부담 줄인 구조·매뉴얼·방문 상담·인허가)를 지역명·유형을 넣은 표현으로 해시 선택. 분양 절차·홈딜리버리·미용·호텔 같은 매장 운영 안내는 넣지 않음

```bash
python -I scripts/make_og.py --force    # 메인 + 창업 페이지 og → public/og
npx next build                          # → out/
python -I scripts/dup_pairs.py          # 표기 쌍·같은 지역 다른 유형 겹침
python -I ~/.claude/skills/site-launch/scripts/check_all.py C:/side_Prj/dorothypet_franchise_prj
```

## 연락처·링크 (`lib/site.ts`)
- 가맹 상담 010-2236-8276(대표전화와 같은지 확인 필요), 카카오 pf.kakao.com/_AxjExkb
- 헤더: 오픈 과정 · 지역별 창업 · 분양 매장(`STORE_SITE`) · 공식 가맹 페이지. 하단 고정 바: 가맹 상담 / 카카오톡 상담 / 지역별 창업

## 지역 페이지 안내글·창업 가이드(블로그) (2026-10-29)
- 지역 페이지마다 소제목 5개 안내글(`lib/article-fr.ts`, 약 1,500자): 업종 고민 → 혼자 준비할 때 막히는 것 → 본사·점주 역할 → 입지 → 11단계 → 오픈 뒤 → 상담 전 준비. 유형마다 순서, 짧은 표기 페이지는 가운데 세 단락이 다름
- 창업 가이드 `/blog/`: `content/blog/*.md`(프런트매터 slug·title·description·keyword·date), 공개일이 지난 글만 보임(`lib/blog.ts`, env BUILD_DATE). 사이트맵·RSS·og(blog-<slug>.jpg)·BlogPosting 연결
- 키워드 큐 50개 `content/blog/_data/keywordQueue.json` (지역명 없는 창업 질문형만). 견본 `content/blog/_example.md`(목록에 안 나옴)
- 오픈일이 정해지면: 45편 작성 → `python -I scripts/schedule_posts.py <오픈일>` 로 하루 1·2편 공개일 배정 → post-launch 스킬(7일 안 나눠 열기, 매일 deploy)

## 디자인 (2026-10-29 사용자 요청으로 변경)
- `C:\side_Prj\gopung\gopung_main_design_v6 (1).html` 시안 톤: 밝은 슬레이트 바탕 · 둥근 카드(12~36px) · 색 아이콘 타일 · 가운데 정렬 큰 제목 · 큰 상담 박스. 색은 파랑 대신 도로시펫 캐멀(#8d5f3a 계열)
- 매장 사진(미용실·드라이룸·호텔)은 "보잘것없어 보인다"는 피드백으로 빼고, 분양 아이 사진(본사 분양 목록) + 코드로 그린 체크리스트·상권 카드로 대체
- 분양후기: dorothypet.co.kr/reviews 1~2페이지 네이버 리뷰 41개(`scripts/fetch_reviews.py` → `data/reviews.json`, 사진 121×158 작아서 작은 카드로). 메인은 전부, 지역 페이지는 페이지마다 8개(같은 문장 비율 때문)
- design_lint 때문에 장식 그라데이션은 4곳 이하 — 아이콘 타일·카드·상담 박스는 단색

## 색인 지표 (2026-10-28)
| 항목 | 값 | 기준 |
|---|---|---|
| check_all | SEO 구조·중복 문서·AI 티·화면 버그 모두 통과, sitemap 1,001 | |
| 본문 (표본 40) | 평균 2,624자 · 최소 2,439 | 1,300+ |
| 같은 문장 (표본 40) | 평균 23% · 최대 61% | 30% 이하 |
| 표기 쌍 413 ('포항시 X' vs '포항 X') | 평균 31% · 최대 50% | |
| 같은 지역 다른 유형 846 | 평균 43% · 최대 59% | |

## 확인 필요
- [ ] 창업 사이트 도메인 (`SITE_URL`, 지금 dorothypet-franchise.example) — 분양 사이트 `FRANCHISE_SITE`도 같이 변경
- [ ] 서치어드바이저·서치콘솔 소유확인 코드
- [ ] 가맹 상담 전화가 대표전화와 같은지
