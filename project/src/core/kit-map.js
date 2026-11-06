// Paper Atlas · REAL MAP (16:9). Coastlines + rivers from data/geo.json (Natural Earth, public domain; tools/geo.py builds it).
// realMap({ view, rings, pins, ... }) draws India as cut paper on a sea page. Labels always sit above y 840 (caption zone below).
import { ctx, W, H, TAU, clamp, lerp, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_poly, P_rr, label, parchment, compass, slip } from './kit.js';

export const GEO = { data: null };
export async function loadGeo() { const r = await fetch('data/geo.json', { cache: 'no-store' }); if (!r.ok) throw new Error('missing data/geo.json: run tools/geo.py'); GEO.data = await r.json(); }

// lon, lat (approximate city positions) · lx, ly = label offset in px
export const PLACES = {
  surat: { n: 'Surat', lon: 72.83, lat: 21.17, lx: -78, ly: 4 },
  broach: { n: 'Broach', lon: 72.98, lat: 21.70, lx: -84, ly: -16 },
  ahmedabad: { n: 'Ahmedabad', lon: 72.57, lat: 23.02, lx: -40, ly: -30 },
  agra: { n: 'Agra', lon: 78.01, lat: 27.18, lx: 0, ly: 30 },
  delhi: { n: 'Delhi', lon: 77.21, lat: 28.61, lx: 0, ly: -30 },
  bombay: { n: 'Bombay', lon: 72.88, lat: 19.08, lx: -90, ly: 0 },
  masulipatnam: { n: 'Masulipatnam', lon: 81.13, lat: 16.17, lx: 108, ly: 4 },
  golconda: { n: 'Golconda', lon: 78.40, lat: 17.38, lx: -62, ly: -26 },
  madras: { n: 'Madras', lon: 80.27, lat: 13.08, lx: 82, ly: 0 },
  pondicherry: { n: 'Pondicherry', lon: 79.81, lat: 11.94, lx: 104, ly: 10 },
  balasore: { n: 'Balasore', lon: 86.93, lat: 21.49, lx: -84, ly: 6 },
  hooghly: { n: 'Hooghly', lon: 88.39, lat: 22.91, lx: 84, ly: -8 },
  calcutta: { n: 'Calcutta', lon: 88.36, lat: 22.57, lx: 84, ly: 22 },
  kasimbazar: { n: 'Kasimbazar', lon: 88.27, lat: 24.12, lx: 100, ly: -8 },
  plassey: { n: 'Plassey', lon: 88.25, lat: 23.80, lx: -76, ly: -4 },
  patna: { n: 'Patna', lon: 85.14, lat: 25.59, lx: 0, ly: -28 },
  spice: { n: 'Spice Islands', lon: 127.8, lat: -2.5, lx: 0, ly: -46 },
  wandiwash: { n: 'Wandiwash', lon: 79.6, lat: 12.5, lx: -100, ly: -10 }, murshidabad: { n: 'Murshidabad', lon: 88.27, lat: 24.18, lx: -110, ly: -20 },
  buxar: { n: 'Buxar', lon: 83.98, lat: 25.56, lx: 0, ly: -30 }, allahabad: { n: 'Allahabad', lon: 81.85, lat: 25.44, lx: 0, ly: 30 },
  seringapatam: { n: 'Seringapatam', lon: 76.68, lat: 12.42, lx: -120, ly: 0 }, thane: { n: 'Thane', lon: 72.98, lat: 19.2, lx: 80, ly: -20 },
  meerut: { n: 'Meerut', lon: 77.7, lat: 28.98, lx: 90, ly: -10 }, kanpur: { n: 'Kanpur', lon: 80.33, lat: 26.45, lx: 0, ly: 30 }, lucknow: { n: 'Lucknow', lon: 80.95, lat: 26.85, lx: 90, ly: -10 },
  jhansi: { n: 'Jhansi', lon: 78.57, lat: 25.45, lx: -80, ly: 10 }, amritsar: { n: 'Amritsar', lon: 74.87, lat: 31.63, lx: 0, ly: -30 }, sabarmati: { n: 'Sabarmati', lon: 72.58, lat: 23.06, lx: 110, ly: -10 },
  dandi: { n: 'Dandi', lon: 72.8, lat: 20.89, lx: -70, ly: 10 }, punjab: { n: 'Punjab', lon: 75, lat: 31, lx: 0, ly: 0 }, mysore: { n: 'Mysore', lon: 76.64, lat: 12.3, lx: 0, ly: 30 },
  london: { n: 'London', lon: -0.13, lat: 51.51, lx: 0, ly: -30 },
};
export const FORTS = ['madras', 'bombay', 'calcutta'];
/** standard views: centre lon/lat + px per degree. INDIA fits the subcontinent between y 130 and 840 */
export const VIEWS = {
  india: { lon: 80.5, lat: 20.2, k: 29 },
  west: { lon: 74.5, lat: 22.5, k: 62 }, east: { lon: 82, lat: 15.5, k: 52 }, bengal: { lon: 87.5, lat: 23.6, k: 92 },
  north: { lon: 76.5, lat: 25, k: 52 }, gangetic: { lon: 83, lat: 25.5, k: 58 }, south: { lon: 78, lat: 13.5, k: 62 }, gujarat: { lon: 72.6, lat: 22, k: 120 }, asia: { lon: 92, lat: 12, k: 11.5 }, world: { lon: 60, lat: 18, k: 6.4 },
};
const CX = 960, CY = 485, COS = Math.cos(20 * Math.PI / 180);
export const lerpView = (a, b, p) => ({ lon: lerp(a.lon, b.lon, p), lat: lerp(a.lat, b.lat, p), k: a.k * Math.pow(b.k / a.k, p) });
export function proj(v) { return (lon, lat) => [CX + (lon - v.lon) * v.k * COS, CY - (lat - v.lat) * v.k]; }
export const placeXY = (v, id) => { const p = PLACES[id]; return proj(v)(p.lon, p.lat); };

/** the map page. o = { view, seed, rivers (true), dim (0..1 darker page), tint: { region: 'bengal', a } , rings: { madras: p|null, ... } (null = hidden,
 *  0 = empty gold ring, 0..1 = fort pops in), pins: [[id, pop 0..1, opts]], glowRings 0..1, pillars 0..1, compass (true) } */
export function realMap(o = {}) {
  const v = o.view || VIEWS.india, pr = proj(v), d = GEO.data;
  parchment(o.seed ?? 3);
  ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  // graticule every 5 degrees
  ctx.strokeStyle = 'rgba(62,44,30,0.13)'; ctx.lineWidth = 2;
  for (let lon = -180; lon <= 180; lon += 5) { const [x] = pr(lon, 0); if (x < -50 || x > W + 50) continue; ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x, H + 300); ctx.stroke(); }
  for (let lat = -60; lat <= 70; lat += 5) { const [, y] = pr(0, lat); if (y < -50 || y > H + 50) continue; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  if (d) {
    const scale = v.k / 29;
    for (const ring of d.land) {
      let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9; const pts = ring.map(([lo, la]) => { const q = pr(lo, la); minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]); return q; });
      if (maxx < -300 || minx > W + 300 || maxy < -300 || miny > H + 300) continue;
      if ((maxx - minx) < 3 && (maxy - miny) < 3) continue;
      cut(P_poly(pts), P.land, { shadow: clamp(0.5 * scale, 0.3, 0.8), edge: 4 });
    }
    if (o.tint) tintRegion(o.tint, pr);
    if (o.rivers !== false) for (const [name, lines] of Object.entries(d.rivers)) for (const l of lines) line(l.map(([lo, la]) => pr(lo, la)), name === 'Ganges' ? P.seaDark : 'rgba(134,160,155,0.9)', name === 'Ganges' ? Math.max(3, v.k / 14) : Math.max(2, v.k / 22));
  }
  if (o.dim) { ctx.save(); ctx.globalAlpha = o.dim; ctx.fillStyle = '#2F3550'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
  if (o.compass !== false) compass(1760, 760, 0.42);
  // forts: rings + icons
  if (o.rings) for (const id of FORTS) { const st = o.rings[id]; if (st == null) continue; const [x, y] = pr(PLACES[id].lon, PLACES[id].lat); if (y > 845 || y < 100 || x < 60 || x > W - 60) continue; ctx.save(); ctx.translate(x, y); const rs = clamp(v.k / 29, 0.45, 1.6); ctx.scale(rs, rs); fortRing(0, 0, st, o.glowRings || 0, o.pillars || 0, o.ringLabels !== false ? PLACES[id] : null); ctx.restore(); }
  for (const [id, pop, po = {}] of o.pins || []) { if (pop <= 0) continue; const p = PLACES[id], [x, y] = pr(p.lon, p.lat); if (y > 840) continue; pin(x, y, p, pop, po); }
  return pr;
}
/** a city pin + its paper label (label kept above y 840) */
export function pin(x, y, p, pop = 1, o = {}) {
  const s = eobLocal(clamp(pop)); if (s <= 0) return;
  circle(x, y, 9 * s, o.color || P.ink); circle(x, y, 4 * s, P.edge);
  let lx = x + (o.lx ?? p.lx), ly = y + (o.ly ?? p.ly); if (ly > 830) ly = y - 30;
  if (o.label !== false) tag(o.text || p.n, lx, ly, s * (o.size || 0.8), x, y);
}
/** a plain paper map tag (no pushpin, so the ink dot stays the only marker) with a faint leader line to (px, py) */
export function tag(text, x, y, sc = 1, px = null, py = null) {
  if (sc <= 0) return; const size = 34;
  ctx.font = `700 ${size}px Caladea`; const w = (ctx.measureText(text).width + 40) * sc, h = size * 1.35 * sc;
  if (px != null) { const ex = clamp(px, x - w / 2, x + w / 2), ey = clamp(py, y - h / 2, y + h / 2); line([[px, py], [ex, ey]], 'rgba(62,44,30,0.55)', 2.5); }
  ctx.save(); ctx.translate(x, y); ctx.rotate((rnd(x) - 0.5) * 0.04); ctx.scale(sc, sc);
  cut(P_rr(-(w / sc) / 2, -size * 0.68, w / sc, size * 1.36, 4), P.edge, { shadow: 0.5, edge: 3 });
  ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 3); ctx.restore();
}
function eobLocal(t) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
/** gold ring at a fort site: st 0 = empty, 0..1 = the fort icon pops in; glow pulses; pillars rise */
export function fortRing(x, y, st, glow = 0, pillars = 0, place = null) {
  if (pillars > 0) { const ph = 170 * clamp(pillars); cut(P_rr(x - 20, y - ph, 40, ph, 4), P.stone, { shadow: 0.6, edge: 4 }); cut(P_rr(x - 30, y - ph - 14, 60, 16, 4), P.stoneDark, { shadow: 0.4, edge: 3 }); }
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; circle(x, y, 40 + 8 * glow, P.gold); ctx.restore(); }
  ctx.beginPath(); ctx.arc(x, y, 24, 0, TAU); ctx.fillStyle = 'rgba(233,220,188,0.55)'; ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 7; ctx.stroke();
  if (st > 0) { const s = eobLocal(clamp(st)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fortIcon(0, 2, 0.38); ctx.restore(); }
  if (place && st > 0.5) tag(place.n, place.lx, place.ly, 0.8, 0, 0);
}
/** small crenellated fort with the Company ensign */
export function fortIcon(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, 40); ctx.lineTo(-60, -30); for (let i = 0; i < 6; i++) { const x0 = -60 + i * 20; ctx.lineTo(x0, -42); ctx.lineTo(x0 + 10, -42); ctx.lineTo(x0 + 10, -30); ctx.lineTo(x0 + 20, -30); } ctx.lineTo(60, 40); ctx.closePath(); }, P.stone, { shadow: 0.6, edge: 4 });
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, 40, 16, Math.PI, TAU); ctx.fill();
  ctx.restore();
}
/** rough region centres for soft washes (lon, lat, radius lon, radius lat): simplified, not borders */
export const REGIONS = { bengal: [87.8, 23.6, 3.2, 2.6], india: [79, 22, 13, 12], gujarat: [72, 22.5, 3, 2.2], biharorissa: [85.5, 23, 4.5, 3.5],
  carnatic: [79.2, 12.5, 2.6, 3], mysore: [76.5, 13, 2.6, 2.4], maratha: [75.5, 19, 4.5, 3.5], punjab: [74.5, 31, 3, 2.4], awadh: [81, 26.8, 2.6, 1.8], north: [79, 27, 5, 3] };
/** washes: [[region, a 0..1, colour]] drawn in order */
export function washes(pr, list) { for (const [region, a, color] of list) if (a > 0) tintRegion({ region, a, color }, pr); }
/** PARTITION 1947: simplified dashed crimson lines (west and east), drawn on with p 0..1 */
export const PARTITION = { west: [[74.6, 36], [74.4, 32.6], [74.6, 31.1], [73.9, 30.1], [72.5, 28.5], [70.3, 27.6], [70.7, 25.2], [71.1, 24.4], [68.4, 23.6]],
  east: [[88.1, 26.5], [88.7, 25.2], [88.2, 24.2], [88.9, 22.9], [89.0, 21.7], [92.1, 21.2], [92.6, 23.7], [91.9, 24.4], [92.3, 25.1], [89.8, 25.9], [88.1, 26.5]] };
export function partitionLines(pr, p = 1) { for (const k of ['west', 'east']) { const pts = PARTITION[k].map(([lo, la]) => pr(lo, la)); dashedRouteLocal(pts, p); } }
function dashedRouteLocal(pts, p) { let tot = 0; const L = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; } let left = tot * clamp(p); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length && left > 0; i++) { const k = Math.min(1, left / L[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= L[i - 1]; } ctx.setLineDash([18, 12]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke(); ctx.setLineDash([]); }
/** a soft colour wash over a region (Bengal glow, Mughal green) */
function tintRegion(t, pr) {
  const R = REGIONS[t.region]; if (!R) return;
  const [x, y] = pr(R[0], R[1]), [x2] = pr(R[0] + R[2], R[1]), [, y2] = pr(R[0], R[1] + R[3]);
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(Math.abs(x2 - x), Math.abs(y2 - y)));
  g.addColorStop(0, t.color || 'rgba(200,149,47,0.55)'); g.addColorStop(1, 'rgba(200,149,47,0)');
  ctx.save(); ctx.globalAlpha = clamp(t.a ?? 1); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
}
