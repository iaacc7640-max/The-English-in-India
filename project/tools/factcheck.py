"""Print the sentences of saved Wikipedia raw pages that match given patterns (fact-checking helper).
   python3 tools/factcheck.py <dir> "Page_name:pat1|pat2" ...   (pages saved as <dir>/<Page_name>.wiki)"""
import re, sys, os
D = sys.argv[1]
def clean(s):
    s = re.sub(r'<ref[^>]*/>', '', s); s = re.sub(r'<ref.*?</ref>', '', s, flags=re.S)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s); s = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', s); return s
for arg in sys.argv[2:]:
    f, pats = arg.split(':', 1)
    try: s = clean(open(os.path.join(D, f + '.wiki'), errors='ignore').read())
    except FileNotFoundError: print('MISSING', f); continue
    for p in pats.split('|'):
        hits = re.findall(r'[^.\n]*' + p + r'[^.\n]*\.', s, flags=re.I)[:2]
        for h in hits: print(f'[{f} :: {p}]', h.strip()[:300])
        if not hits: print(f'[{f} :: {p}] -- no hit')
