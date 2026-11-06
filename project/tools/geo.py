"""Build data/geo.json for realMap() from Natural Earth (public domain), downloaded from GitHub (nvkelso/natural-earth-vector).
   python3 tools/geo.py <dir with ne_50m_land.geojson + ne_10m_rivers_lake_centerlines.geojson>
Output: { land: [[[lon,lat],...], ...], rivers: { name: [[[lon,lat],...]] } } clipped to lon -20..145, lat -45..62, simplified."""
import json, sys, math
from pathlib import Path
SRC = Path(sys.argv[1]); OUT = Path(__file__).resolve().parent.parent / 'data/geo.json'
BB = (-20, -45, 145, 62)
def inbb(p, m=0): return BB[0] - m <= p[0] <= BB[2] + m and BB[1] - m <= p[1] <= BB[3] + m
def dp(pts, tol):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1e-9
    i, dmax = 0, 0
    for k in range(1, len(pts) - 1):
        d = abs(dy * pts[k][0] - dx * pts[k][1] + b[0] * a[1] - b[1] * a[0]) / L
        if d > dmax: i, dmax = k, d
    if dmax <= tol: return [a, b]
    return dp(pts[:i + 1], tol)[:-1] + dp(pts[i:], tol)
def rnd(p): return [round(p[0], 3), round(p[1], 3)]
land = []
for f in json.load(open(SRC / 'ne_50m_land.geojson'))['features']:
    g = f['geometry']; polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
    for poly in polys:
        ring = poly[0]
        if not any(inbb(p) for p in ring): continue
        # India region keeps detail; elsewhere coarser
        near = any(55 <= p[0] <= 100 and 0 <= p[1] <= 38 for p in ring)
        tol = 0.03 if near else 0.12; h = len(ring) // 2   # closed ring: simplify the two halves separately
        s = dp(ring[:h + 1], tol)[:-1] + dp(ring[h:], tol)
        if len(s) >= 4: land.append([rnd(p) for p in s])
KEEP = {'Ganges', 'Yamuna', 'Indus', 'Brahmaputra', 'Narmada', 'Tapi', 'Godävari', 'Krishna', 'Cauvery', 'Mahäna Nadï', 'Son', 'Chambal'}
rivers = {}
for f in json.load(open(SRC / 'ne_10m_rivers_lake_centerlines.geojson'))['features']:
    n = f['properties'].get('name') or ''
    if n not in KEEP: continue
    g = f['geometry']; lines = [g['coordinates']] if g['type'] == 'LineString' else g['coordinates']
    for l in lines:
        if any(60 < p[0] < 100 and 5 < p[1] < 35 for p in l): rivers.setdefault(n, []).append([rnd(p) for p in dp(l, 0.02)])
OUT.write_text(json.dumps({'source': 'Natural Earth 1:50m land + 1:10m rivers (public domain), naturalearthdata.com', 'land': land, 'rivers': rivers}, separators=(',', ':')))
print(OUT, OUT.stat().st_size, 'bytes,', len(land), 'land polygons,', {k: len(v) for k, v in rivers.items()})
# where does the Ganges end? (Hooghly check)
g = rivers.get('Ganges', [])
ends = sorted({tuple(l[-1]) for l in g} | {tuple(l[0]) for l in g}, key=lambda p: p[1])[:6]
print('southernmost Ganges ends:', ends)
