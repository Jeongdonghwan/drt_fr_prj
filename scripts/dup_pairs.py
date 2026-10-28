"""가장 겹치기 쉬운 쌍만 골라 '같은 문장 비율'을 잰다 (check_all 무작위 표본이 못 잡는 것).

  python -I scripts/dup_pairs.py
- 창업 표기 쌍: '포항시 X' vs '포항 X', '경기도 X' vs '경기 X' 등
- 창업 같은 지역 다른 유형: '강원도 소자본창업' vs '강원도 펫샵창업'
- 같은 견종 매장 페이지: 비숑 vs 비숑프리제 등 (견종당 앞 6개 조합)
비율 = 겹치는 줄 / 짧은 쪽 줄 수 (dup_measure와 같은 본문 추출, 12자 넘는 줄)
"""
import collections, html, itertools, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'out')


def text(path):
    t = open(path, encoding='utf-8').read()
    t = re.sub(r'<script.*?</script>|<style.*?</style>|<header.*?</header>|<footer.*?</footer>|<nav.*?</nav>', ' ', t, flags=re.S)
    m = re.search(r'<main[^>]*>(.*?)</main>', t, re.S)
    return {l.strip() for l in html.unescape(re.sub(r'<[^>]+>', '\n', m.group(1))).split('\n') if len(l.strip()) > 12}


def ratio(a, b): return len(a & b) / max(1, min(len(a), len(b)))


def report(name, pairs):
    v = [(ratio(text(os.path.join(OUT, *a.split('/'), 'index.html')), text(os.path.join(OUT, *b.split('/'), 'index.html'))), f'{a} vs {b}') for a, b in pairs]
    print(f'{name} {len(v)}쌍: 평균 {sum(x for x, _ in v) / len(v):.0%} · 최대 {max(v)[0]:.0%} ({max(v)[1]})')


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    P = json.load(open(os.path.join(ROOT, 'data', 'pages.json'), encoding='utf-8'))
    fr = {p['kw']: p['slug'] for p in P['franchise']}
    pairs = []
    for kw, sl in fr.items():
        m = re.match(r'(\S+?)(시|도|특별시|광역시|특별자치시) (\S+)$', kw)
        if m and f'{m[1]} {m[3]}' in fr: pairs.append((sl, fr[f'{m[1]} {m[3]}']))
    report('창업 표기 쌍', pairs)
    by_region = collections.defaultdict(list)
    for kw, sl in fr.items():
        if ' ' in kw: by_region[kw.split(' ')[0]].append(sl)
    report('창업 같은 지역 다른 유형', [x for sl in by_region.values() for x in itertools.combinations(sl[:4], 2)])


if __name__ == '__main__':
    main()
