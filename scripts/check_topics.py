"""주제 데이터 검사: python -I scripts/check_topics.py [파일...] (없으면 data/topics/*.json 전부)"""
import glob, json, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')
files = sys.argv[1:] or sorted(glob.glob('data/topics/*.json'))
BAD = re.compile(r'보장|획기적|완벽|무조건|최고|1위|고수익|하신가요\?|지금 바로|믿을 수 있는|\*\*|수익률|매출')
NUM = re.compile(r'\d')
PH = re.compile(r'\{(L|short|where|BRAND|PHONE)(:[가-힣]+)?\}')
errs = 0; allp = {}
def e(f, m):
    global errs; errs += 1; print(f'  {os.path.basename(f)}: {m}')
def plain(s): return PH.sub('가', s)
def chk(f, s, lo, hi, what, ph=None):
    n = len(plain(s))
    if not lo <= n <= hi: e(f, f'{what} 길이 {n} ({lo}~{hi}): {s[:30]}')
    for b in BAD.finditer(s): e(f, f'{what} 금지 표현 "{b.group(0)}"')
    t = s.replace('11단계', '').replace('{PHONE}', '')
    if NUM.search(t): e(f, f'{what} 숫자: {s[:40]}')
    for m in re.finditer(r'\{[^}]*\}', s):
        if not PH.fullmatch(m.group(0)): e(f, f'{what} 모르는 자리표시자 {m.group(0)}')
    if ph is True and not re.search(r'\{(L|short|where)', s): e(f, f'{what} 자리표시자 없음: {s[:30]}')
    if ph is False and '{' in s: e(f, f'{what} 자리표시자 금지: {s[:30]}')
for f in files:
    try: d = json.load(open(f, encoding='utf-8'))
    except Exception as x: e(f, f'JSON 오류 {x}'); continue
    if d.get('id') != os.path.basename(f)[:-5]: e(f, 'id≠파일명')
    if len(d.get('h1sub', [])) != 3: e(f, 'h1sub 3개')
    for s in d.get('h1sub', []): chk(f, s, 12, 24, 'h1sub', False)
    if len(d.get('lead', [])) != 2: e(f, 'lead 2개')
    for s in d.get('lead', []): chk(f, s, 60, 95, 'lead', True)
    if len(d.get('summary', [])) != 2: e(f, 'summary 2개')
    for s in d.get('summary', []): chk(f, s, 170, 220, 'summary', True)
    if len(d.get('facts', [])) != 4: e(f, 'facts 4개')
    for a in d.get('facts', []):
        chk(f, a[0], 2, 7, 'facts 라벨', False); chk(f, a[1], 8, 28, 'facts 값', False)
    if len(d.get('sections', [])) != 7: e(f, f"sections {len(d.get('sections', []))}개 (7)")
    for i, sec in enumerate(d.get('sections', [])):
        if len(sec.get('sub', [])) != 2: e(f, f'절{i+1} sub 2개')
        for s in sec.get('sub', []): chk(f, s, 8, 22, f'절{i+1} sub', False)
        if len(sec.get('p', [])) != 3: e(f, f'절{i+1} p 3벌')
        sents = []
        for s in sec.get('p', []):
            chk(f, s, 220, 270, f'절{i+1} 문단', True)
            if len(re.findall(r'\{(?:L|short|where)', s)) > 3: e(f, f'절{i+1} 자리표시자 3개 초과')
            if '\n' in s: e(f, f'절{i+1} 줄바꿈')
            ss = [x.strip() for x in re.split(r'(?<=[.?!])\s+', s) if len(x.strip()) > 12]
            for x in ss:
                if x in sents: e(f, f'절{i+1} 벌끼리 같은 문장: {x[:30]}')
                if x in allp and allp[x] != f: e(f, f'다른 파일과 같은 문장({os.path.basename(allp[x])}): {x[:30]}')
                allp[x] = f
            sents += ss
    if len(d.get('faq', [])) != 5: e(f, 'faq 5개')
    for q in d.get('faq', []):
        chk(f, q['q'], 14, 44, 'faq 질문'); chk(f, q['a'], 60, 130, 'faq 답')
print(f'파일 {len(files)}개 · 오류 {errs}')
sys.exit(1 if errs else 0)
