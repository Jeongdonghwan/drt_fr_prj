"""dorothypet.co.kr 분양후기(네이버 리뷰 옮긴 목록) 1~2페이지 → data/reviews.json + public/images/rv/<id>.webp
사용자 허락(2026-10-29): 공식 사이트 후기를 가로 슬라이드로 사용. 분양·케어 후기만(서비스미용 제외)."""
import html, io, json, os, re, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://dorothypet.co.kr'
OUT = os.path.join(ROOT, 'public', 'images', 'rv')
UA = {'User-Agent': 'Mozilla/5.0'}
EMO = re.compile('[🌀-🫿☀-➿️‍♡♥❤]')  # 이모지는 빼고 글만


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    os.makedirs(OUT, exist_ok=True)
    items = []
    for page in (1, 2):
        raw = get(f'{BASE}/reviews?page={page}')
        h = raw.decode('utf-8', 'ignore') if b'charset=utf-8' in raw.lower() or b'\xea' in raw[:200000] else raw.decode('cp949', 'ignore')
        for m in re.finditer(r'<a href="/reviews/(\d+)" class="review-list-card">(.*?)</a>', h, re.S):
            rid, body = m.groups()
            img = re.search(r'<img src="([^"]+)"', body)
            title = re.search(r'review-list-title">(.*?)</h3>', body, re.S)
            text = re.search(r'review-list-preview">(.*?)</p>', body, re.S)
            date = re.search(r'<span>(\d{4}\.\d{2}\.\d{2})</span>', body)
            if not (img and text): continue
            items.append(dict(id=rid, kind=html.unescape(title[1].strip()) if title else '분양후기',
                              text=re.sub(r'\s{2,}', ' ', EMO.sub('', html.unescape(text[1]))).strip(), date=date[1] if date else '', img=img[1]))
    keep = []
    for it in items:
        if '미용' in it['kind']: continue
        dst = os.path.join(OUT, f"{it['id']}.webp")
        if not os.path.exists(dst):
            im = Image.open(io.BytesIO(get(BASE + it['img']))).convert('RGB')
            im.thumbnail((520, 520))
            im.save(dst, 'WEBP', quality=80)
        keep.append({k: it[k] for k in ('id', 'kind', 'text', 'date')})
    json.dump({'_source': 'dorothypet.co.kr/reviews 1~2페이지 (네이버 리뷰), 2026-10-29 수집', 'reviews': keep},
              open(os.path.join(ROOT, 'data', 'reviews.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'후기 {len(items)}개 중 {len(keep)}개 저장')


if __name__ == '__main__':
    main()
