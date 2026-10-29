# 도로시펫 가맹 창업 SEO 사이트 — 이어서 작업하는 Claude에게

먼저 `SITE.md`를 읽는다.

## 현재 상태 (2026-10-28)
- 메인 = 가맹 랜딩(공식 가맹 페이지 순서) + 창업 키워드 1,000페이지(`/<키워드>/`). check_all 전부 통과.
- 분양 매장 사이트(`C:\side_Prj\dorothypet_prj`)에서 분리. 사용자 요청: 창업은 별도 랜딩 사이트.
- 로컬: `npx next build` 후 `python -I -m http.server 18941 --bind 127.0.0.1 --directory out` (18939는 다른 프로젝트가 씀)

## 규칙
- 대답과 중간 안내는 한국어.
- 키워드·지역 데이터는 dorothypet_prj에서 만들고(`select_keywords.py`·`build_regions.py`) `data/`로 복사해 온다. 이 폴더에서 따로 고치지 않는다.
- 지역 인구·반려동물 통계·순위, 분양 절차·홈딜리버리·미용·호텔 같은 매장 운영 안내는 넣지 않는다(사용자 요청 2026-10-29). 가맹 장점만.
- 창업 비용 숫자, 할인, 비교 수치('타 브랜드 대비 1/3') 넣지 않기. 사실은 공식 사이트·공공데이터에 있는 것만.
- 디자인 AI 티 금지(`~/.claude/skills/web-design`), 대량 페이지는 `~/.claude/skills/programmatic-seo`, 출시 전 `~/.claude/skills/site-launch` check_all 통과.
- 커튼명장 등 다른 업체 프로젝트와 섞지 않는다.
