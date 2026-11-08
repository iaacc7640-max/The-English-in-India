// Paper Atlas · more SCENES (chapters 1-4, 6-8). Same rules: layers + o.pan parallax, o.night, ground at/above y 800.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ, parchment, label, slip, ribbon, seal, hall } from './kit.js';
import { person, cast, SKIN, horse, parasol } from './kit-cast.js';
import { flag, eastIndiaman, MUGHAL, coin, sun, fleur } from './kit-props.js';
import { layer, nightWash, sea, boat, mughalCourt } from './kit-scenes.js';
import { GEO as GEO_REF } from './kit-map.js';

const CREAM = '#F3E9D2', SAND = '#C98B67', SAND_D = '#A86A4E', MARBLE = '#F1E7D0';
const house = (x, y, w, h, wall, roof) => { cut(P_rr(x - w / 2, y - h, w, h, 3), wall, { shadow: 0.5, edge: 4 }); cut(P_poly([[x - w / 2 - 10, y - h + 2], [x, y - h - w * 0.5], [x + w / 2 + 10, y - h + 2]]), roof, { shadow: 0.4, edge: 4 }); };

/** LONDON RIVER AT DAWN: the Thames, timber skyline with a church spire, ships at the wharf. o = { pan, t, ships 0..1 } */
export function londonDawn(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(41); const g = ctx.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#E8C9A0'); g.addColorStop(1, '#F1DFC0'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, 1000);
  layer(pan, 0.08, () => cut(P_circ(1450, 470, 90), '#EFC66A', { shadow: 0.2, edge: 4 }));
  layer(pan, 0.25, () => { for (let i = 0; i < 16; i++) house(-200 + i * 150, 520, 120, 90 + rnd(i) * 70, i % 2 ? '#B9A07A' : '#A88E6A', '#7A5A40'); cut(P_rr(860, 260, 70, 260, 4), '#9C8C70', { shadow: 0.4, edge: 3 }); cut(P_poly([[850, 262], [895, 120], [940, 262]]), '#7A6A55', { shadow: 0.4, edge: 3 }); });
  for (let i = 0; i < 3; i++) layer(pan, 0.4 + i * 0.15, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 540 + i * 90; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t + i) * 7); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.4, edge: 4 }));
  layer(pan, 0.6, () => { eastIndiaman(600, 640 + Math.sin(t * 1.5) * 5, 0.42, 0, t, null); eastIndiaman(1150, 660 + Math.sin(t * 1.5 + 1) * 5, 0.5, 0, t, null); });
  layer(pan, 0.9, () => { cut(P_rr(-400, 740, 1100, 70, 0), '#7A5A40', { shadow: 0.6, edge: 4 }); for (let x = -380; x < 700; x += 110) cut(P_rr(x, 740, 22, 100, 3), '#5A3E2B', { shadow: 0.3, edge: 2 }); });
  nightWash(o.night || 0);
}
/** a paper globe with a little ship circling on a crimson route: p 0..1 */
/** Drake's voyage (1577-80), approximate waypoints (lon, lat): Plymouth, Canaries, Brazil, Strait of Magellan, Chile, California, Pacific, Moluccas, Java, Cape, home */
export const DRAKE = [[-4.1, 50.4], [-15, 28], [-35, -8], [-55, -35], [-68, -52.5], [-75, -35], [-80, -10], [-110, 20], [-123, 38], [-150, 20], [-175, 5], [150, 3], [127, -1], [110, -7], [80, -20], [40, -35], [18.5, -35], [0, -20], [-15, 15], [-4.1, 50.4]];
function routeAt(R, p) { const seg = R.length - 1, f = Math.min(seg - 1e-6, Math.max(0, p * seg)), k = Math.floor(f), u = f - k; let a = R[k][0], b = R[k + 1][0]; if (b - a > 180) b -= 360; if (a - b > 180) b += 360; return [a + (b - a) * u, R[k][1] + (R[k + 1][1] - R[k][1]) * u]; }
/** a globe with real coastlines (Natural Earth 1:110m, orthographic); a ship sails Drake's route, p 0..1, and the globe turns to follow it */
export function globe(x, y, r, p = 1, t = 0, route = DRAKE) {
  const [slon] = routeAt(route, p), lon0 = slon, lat0 = 10 * Math.PI / 180;
  const pr = (lon, lat) => { const d = (lon - lon0) * Math.PI / 180, la = lat * Math.PI / 180; const c = Math.sin(lat0) * Math.sin(la) + Math.cos(lat0) * Math.cos(la) * Math.cos(d);
    let px = Math.cos(la) * Math.sin(d), py = -(Math.cos(lat0) * Math.sin(la) - Math.sin(lat0) * Math.cos(la) * Math.cos(d)); if (c < 0) { const m = Math.hypot(px, py) || 1; px /= m; py /= m; } return [x + px * r, y + py * r, c >= 0]; };
  cut(P_circ(x, y, r), P.sea, { shadow: 0.9, edge: 6 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  const world = (GEO_REF.data && GEO_REF.data.world) || [];
  for (const ring of world) { const pts = ring.map(([lo, la]) => pr(lo, la)); if (!pts.some((q) => q[2])) continue; cut(P_poly(pts.map((q) => [q[0], q[1]])), P.land, { shadow: 0.15, edge: 2 }); }
  ctx.strokeStyle = 'rgba(62,44,30,0.2)'; ctx.lineWidth = 1.5;
  for (let lo = -180; lo < 180; lo += 30) { ctx.beginPath(); let st = false; for (let la = -90; la <= 90; la += 5) { const q = pr(lo, la); if (q[2]) { st ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); st = true; } else st = false; } ctx.stroke(); }
  for (let la = -60; la <= 60; la += 30) { ctx.beginPath(); let st = false; for (let lo = -180; lo <= 180; lo += 5) { const q = pr(lo, la); if (q[2]) { st ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); st = true; } else st = false; } ctx.stroke(); }
  // the route sailed so far (front side only)
  ctx.setLineDash([12, 9]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 6; ctx.beginPath(); let st = false;
  for (let k = 0; k <= 200; k++) { const pp = k / 200 * p, [lo, la] = routeAt(route, pp), q = pr(lo, la); if (q[2]) { st ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); st = true; } else st = false; }
  ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.25; const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(62,44,30,0.5)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
  const [lo, la] = routeAt(route, p), q = pr(lo, la); eastIndiaman(q[0], q[1] - 14, 0.14, 0, t, null);
}
/** the Spanish Armada: a row of ships whose sails tip over like paper cut-outs (k 0..1) */
export function armada(k, t = 0) {
  sea({ t, pan: 0 }, (i) => { if (i === 1) for (let s = 0; s < 4; s++) { const kk = clamp(k * 1.6 - s * 0.18); ctx.save(); ctx.translate(250 + s * 470, 640); ctx.rotate(eio(kk) * 1.45); ctx.translate(0, 0); eastIndiaman(0, 0, 0.5, 0, t, 'spain'); ctx.restore(); } });
}
/** a heap of Portuguese gold coins (cross-marked) */
export function coinPile(x, y, n = 30, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < n; i++) { const r = 34, a = rnd(i) * TAU, d = Math.sqrt(rnd(i + 9)) * 160, cx = Math.cos(a) * d * 1.4, cy = -Math.abs(Math.sin(a) * d) * 0.6 - i * 2; coin(cx, cy, r, ''); ctx.fillStyle = P.royal; ctx.fillRect(cx - 4, cy - 14, 8, 28); ctx.fillRect(cx - 14, cy - 4, 28, 8); } ctx.restore(); }
/** ELIZABETH'S CHAMBER: the stone hall, a desk, the queen signing. o = { sign 0..1, stamp 0..1 } */
export function charterScene(o = {}) {
  hall();
  cut(P_rr(520, 610, 880, 40, 6), '#7A5234', { shadow: 0.7, edge: 4 }); cut(P_rr(560, 650, 30, 150, 4), '#5A3E2B'); cut(P_rr(1330, 650, 30, 150, 4), '#5A3E2B');
  cast('elizabeth', { x: 600, y: 800, h: 430, arm: 55 });
  cut(P_rr(820, 520, 340, 96, 4), CREAM, { shadow: 0.5, edge: 3 });
  ctx.save(); ctx.beginPath(); ctx.rect(840, 530, 300 * clamp(o.sign || 0), 80); ctx.clip(); ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 850; x < 1130; x += 6) ctx.lineTo(x, 570 + Math.sin(x * 0.15) * 10 + Math.sin(x * 0.05) * 6); ctx.stroke(); ctx.restore();
  if (o.stamp > 0) { const k = lerp(2, 1, eo(clamp(o.stamp))); ctx.save(); ctx.globalAlpha = clamp(o.stamp * 3); seal(1110, 590, 0.45 * k, 'E'); ctx.restore(); }
  cast('merchant', { x: 1520, y: 800, h: 400, dir: -1, bow: 0.25 });
}
/** a bolt of Indian cloth unrolling across the frame: p 0..1 */
export function clothBolt(p, y = 520) {
  const w = (W + 200) * eio(clamp(p)); ctx.save(); ctx.translate(-100, y);
  cut(P_rr(0, -110, w, 220, 4), '#E9D3A0', { shadow: 0.9, edge: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(0, -110, w, 220); ctx.clip();
  for (let x = 30; x < w; x += 120) { ctx.save(); ctx.translate(x, 0); for (const [dy, c] of [[-60, P.crimson], [0, P.royal], [60, P.forest]]) { cut(() => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.moveTo(0, dy); ctx.ellipse(Math.cos(a) * 14, dy + Math.sin(a) * 14, 12, 7, a, 0, TAU); } }, c, { shadow: 0, edge: 0 }); circle(0, dy, 6, P.gold); } ctx.restore(); }
  ctx.fillStyle = P.crimson; ctx.fillRect(0, -110, w, 16); ctx.fillRect(0, 94, w, 16); ctx.restore();
  cut(P_rr(w - 40, -126, 80, 252, 40), '#D9BF84', { shadow: 0.7, edge: 4 }); ctx.restore();
}

/** SURAT HARBOUR with the Mughal customs house. o = { pan, t, shipX } */
export function suratHarbour(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(43); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.1, () => cut(P_circ(1380, 220, 64), '#EFC66A', { shadow: 0.3, edge: 4 }));
  layer(pan, 0.3, () => { for (let i = 0; i < 12; i++) house(980 + i * 110, 470, 96, 70 + rnd(i + 3) * 60, i % 2 ? '#E3D3B0' : '#D9C49A', '#B98A55'); });
  for (let i = 0; i < 3; i++) layer(pan, 0.4 + i * 0.14, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 480 + i * 90; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.011 + t * 1.3 + i) * 10); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.5, edge: 4 }));
  layer(pan, 0.55, () => eastIndiaman(o.shipX ?? 520, 600 + Math.sin(t * 1.6) * 6, 0.55, Math.sin(t * 1.2) * 0.02, t, 'eic'));
  layer(pan, 0.8, () => { // the customs house on the quay (domed, Mughal flag)
    cut(P_rr(1080, 690, 1200, 120, 0), '#C9B48C', { shadow: 0.6, edge: 4 });
    cut(P_rr(1200, 470, 420, 220, 4), MARBLE, { shadow: 0.7, edge: 4 }); cut(() => { ctx.beginPath(); ctx.arc(1410, 470, 110, Math.PI, TAU); ctx.closePath(); }, MARBLE, { shadow: 0.5, edge: 4 }); circle(1410, 352, 12, P.gold);
    for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); const x = 1250 + i * 100; ctx.moveTo(x, 690); ctx.lineTo(x, 580); ctx.arc(x + 30, 580, 30, Math.PI, TAU); ctx.lineTo(x + 60, 690); ctx.closePath(); }, '#3E2C1E', { shadow: 0, edge: 2 });
    flag('mughal', 1210, 480, 220, 0.6, t); slip('CUSTOMS HOUSE', 1410, 300, 0.6, -0.02, 36);
  });
}
/** JHAROKHA: Jahangir at a carved balcony window high on a red sandstone wall; a figure below. o = { open 0..1, door 0..1 (a side door swings shut) } */
export function jharokha(o = {}) {
  const pan = o.pan || 0;
  parchment(45);
  layer(pan, 0.35, () => { cut(P_rr(-400, -100, W + 800, 900, 0), SAND, { shadow: 0, edge: 0 }); for (let y = 140; y < 800; y += 70) { ctx.fillStyle = 'rgba(122,74,56,0.18)'; ctx.fillRect(-400, y, W + 800, 4); } });
  layer(pan, 0.5, () => {
    const x = 1180, y = 420;
    cut(P_poly([[x - 220, y + 120], [x + 220, y + 120], [x + 180, y + 170], [x - 180, y + 170]]), SAND_D, { shadow: 0.7, edge: 4 });
    cut(P_rr(x - 200, y - 200, 400, 320, 6), '#B5765A', { shadow: 0.7, edge: 4 });
    cut(() => { ctx.beginPath(); ctx.moveTo(x - 230, y - 200); ctx.quadraticCurveTo(x, y - 330, x + 230, y - 200); ctx.closePath(); }, MARBLE, { shadow: 0.6, edge: 4 }); circle(x, y - 285, 14, P.gold);
    cut(P_rr(x - 160, y - 170, 320, 270, 4), '#5A3226', { shadow: 0, edge: 3 });
    if (o.who !== null) cast(o.who || 'jahangir', { x: x + 10, y: y + 310, h: 420, dir: -1, arm: o.arm || 0 });
    cut(P_rr(x - 200, y + 40, 400, 80, 4), MARBLE, { shadow: 0.6, edge: 4 }); for (let i = 0; i < 7; i++) cut(P_rr(x - 180 + i * 55, y + 52, 30, 56, 12), '#D9C9A6', { shadow: 0, edge: 2 });
    // the side door
    const dx = 360; cut(P_rr(dx - 90, 520, 180, 280, 6), '#3E2C1E', { shadow: 0.3, edge: 3 });
    ctx.save(); ctx.translate(dx - 90, 520); ctx.scale(lerp(0.15, 1, eio(clamp(o.door ?? 0))), 1); cut(P_rr(0, 0, 180, 280, 6), '#7A5234', { shadow: 0.5, edge: 3 }); ctx.restore();
  });
  cut(P_rr(-400, 800, W + 800, 400, 0), '#B98A66', { shadow: 0, edge: 0 });
}
/** NAVAL TWO-SHOT: four English ships (left) vs a bigger Portuguese fleet (right); tear 0..1 rips the Portuguese sails; puffs = distant smoke */
export function seaBattle(o = {}) {
  const t = o.t || 0, tear = o.tear || 0;
  sea({ t, pan: o.pan || 0 }, (i) => {
    if (i === 0) for (let k = 0; k < 6; k++) eastIndiaman(1080 + k * 150, 470 + (k % 2) * 14, 0.22, 0, t, 'portugal', tear);
    if (i === 1) for (let k = 0; k < 3; k++) eastIndiaman(1140 + k * 260, 580, 0.36, 0, t, 'portugal', tear);
    if (i === 2) for (let k = 0; k < 2; k++) eastIndiaman(250 + k * 380, 690 + Math.sin(t * 1.5 + k) * 6, 0.46, 0.02 * Math.sin(t + k), t, 'eic');
    if (i === 3) for (let k = 0; k < 2; k++) eastIndiaman(80 + k * 400, 790 + Math.sin(t * 1.4 + k) * 5, 0.36, 0, t, 'eic');
    if (i === 1 && o.puffs > 0) for (let k = 0; k < 4; k++) { ctx.save(); ctx.globalAlpha = 0.55 * clamp(o.puffs * 2 - k * 0.3); cut(P_circ(800 + k * 60, 560 - k * 14, 34 + k * 6), '#C9C0B0', { shadow: 0.2, edge: 3 }); ctx.restore(); }
  });
}
/** a blank treaty scroll (stays empty), with a quill hovering */
export function blankTreaty(x, y, p = 1, t = 0) {
  const w = 760 * eo(clamp(p)) + 40; cut(P_rr(x - w / 2, y - 200, w, 400, 6), CREAM, { shadow: 0.9, edge: 4 });
  for (const sx of [x - w / 2, x + w / 2]) cut(P_rr(sx - 20, y - 220, 40, 440, 20), '#D9C7A0', { shadow: 0.7, edge: 4 });
  label('TREATY', x, y - 140, 40, P.sepia);
  ctx.save(); ctx.translate(x + 200, y + 40 + Math.sin(t * 3) * 10); ctx.rotate(-0.6); cut(P_poly([[0, 0], [12, -150], [40, -190], [20, -120], [6, 0]]), '#EFE4CC', { shadow: 0.5, edge: 3 }); ctx.restore();
}

/** COROMANDEL BEACH: a strip between two rivers lights up (hl 0..1); fort rises (fort 0..1); town roofs fill (town 0..1); figures optional */
export function madrasBeach(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(47); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.08, () => cut(P_circ(1380, 220, 60), '#EFC66A', { shadow: 0.3, edge: 4 }));
  for (let i = 0; i < 3; i++) layer(pan, 0.15 + i * 0.08, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, 640); const y = 380 + i * 45; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 1.3 + i) * 6); ctx.lineTo(W + 400, 640); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.3, edge: 4 }));
  layer(pan, 0.35, () => {
    cut(() => { ctx.beginPath(); ctx.moveTo(-400, 520); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, 510 + Math.sin(x * 0.02 + t) * 5); ctx.lineTo(W + 400, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#E3CFA0', { shadow: 0.4, edge: 4 });
    for (const rx of [470, 1490]) cut(() => { ctx.beginPath(); ctx.moveTo(rx - 30, 505); ctx.quadraticCurveTo(rx - 90, 700, rx - 150, H + 300); ctx.lineTo(rx + 90, H + 300); ctx.quadraticCurveTo(rx + 50, 700, rx + 30, 505); ctx.closePath(); }, P.sea, { shadow: 0.2, edge: 3 });
    for (const [x, sc] of [[120, 0.7], [260, 0.55], [1680, 0.6], [1820, 0.75]]) { ctx.save(); ctx.translate(x, 700); ctx.scale(sc, sc); cut(P_poly([[-8, 0], [8, 0], [14, -260], [0, -260]]), '#6E5236', { shadow: 0.2, edge: 2 }); for (let k = 0; k < 6; k++) { ctx.save(); ctx.translate(6, -260); ctx.rotate(-2.6 + k * 0.5); cut(() => { ctx.beginPath(); ctx.ellipse(55, 0, 66, 15, 0, 0, TAU); }, P.forest, { shadow: 0.2, edge: 2 }); ctx.restore(); } ctx.restore(); }
    if (o.hl > 0) { const R = () => { ctx.beginPath(); ctx.moveTo(560, 520); ctx.lineTo(1400, 520); ctx.lineTo(1440, 800); ctx.lineTo(520, 800); ctx.closePath(); }; ctx.save(); ctx.globalAlpha = 0.5 * clamp(o.hl); R(); ctx.fillStyle = P.gold; ctx.fill(); ctx.restore(); ctx.save(); ctx.globalAlpha = clamp(o.hl); ctx.setLineDash([16, 10]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 6; R(); ctx.stroke(); ctx.restore(); }
    if (o.town > 0) for (let i = 0; i < 12; i++) { const k = eob(clamp(o.town * 12 - i)); if (k <= 0) continue; const x = 640 + (i % 6) * 130 + (i >= 6 ? 60 : 0), y = i < 6 ? 600 : 800; if (i < 6 && x > 820 && x < 1180) continue; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); house(0, 0, 70, 50, '#E3D3B0', '#B98A55'); ctx.restore(); }
    if (o.fort > 0) fortRise(1000, 760, 1, o.fort);
  });
}
/** a fort whose walls rise course by course: p 0..1 */
export function fortRise(x, y, s = 1, p = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const courses = 6, shown = clamp(p) * courses;
  for (let c = 0; c < courses; c++) { const k = clamp(shown - c); if (k <= 0) break; const cy = -c * 26; for (let b = 0; b < 12; b++) { const bx = -240 + b * 40 + (c % 2) * 20; if (bx > 220) continue; ctx.save(); ctx.globalAlpha = k; cut(P_rr(bx, cy - 26 - (1 - k) * 30, 38, 24, 3), P.stone, { shadow: 0.3, edge: 2 }); ctx.restore(); } }
  if (p >= 1) { for (let b = 0; b < 12; b += 2) cut(P_rr(-240 + b * 40, -180, 30, 26, 3), P.stone, { shadow: 0.3, edge: 2 }); for (const bx of [-260, 230]) cut(P_rr(bx - 20, -230, 70, 230, 6), P.stoneDark, { shadow: 0.5, edge: 3 }); }
  ctx.restore();
}

/** WEDDING: a garland frames Charles II and Catherine; o = { g 0..1 garland drop, zoom on Catherine via camera } */
export function weddingScene(o = {}) {
  hall(); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = P.wine; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
  cast('charles', { x: 820, y: 800, h: 470, arm: 20 }); cast('catherine', { x: 1100, y: 800, h: 440, dir: -1, arm: 25 });
  const g = eob(clamp(o.g ?? 1)); if (g > 0) { ctx.save(); ctx.translate(960, -120 + 190 * g); for (let i = 0; i <= 26; i++) { const a = Math.PI * (0.05 + 0.9 * i / 26), x = -520 * Math.cos(a), y = 240 * Math.sin(a); cut(P_circ(x, y, 26), i % 3 === 0 ? P.crimson : i % 3 === 1 ? '#F2C14E' : '#F5EEDD', { shadow: 0.4, edge: 3 }); } ctx.restore(); }
}
/** the dowry chest; open 0..1 lifts the lid; islands float out (k 0..1) as seven paper pieces */
export function dowryChest(x, y, open = 0, k = 0, t = 0) {
  if (k > 0) { ctx.save(); ctx.globalAlpha = clamp(k * 3); cut(P_rr(200, 170, 1520, 380, 40), P.sea, { shadow: 0.5, edge: 5 }); ctx.restore(); }
  cut(P_rr(x - 220, y - 180, 440, 180, 10), '#7A5234', { shadow: 0.8, edge: 5 }); ctx.fillStyle = P.gold; ctx.fillRect(x - 220, y - 120, 440, 16); circle(x, y - 100, 18, P.gold);
  ctx.save(); ctx.translate(x - 220, y - 180); ctx.rotate(-1.2 * eio(clamp(open))); cut(P_rr(0, -80, 440, 80, 30), '#8C6240', { shadow: 0.6, edge: 5 }); ctx.restore();
  ISLANDS.forEach(([dx, dy, rx, ry], i) => { const kk = eio(clamp(k * 1.5 - i * 0.07)); if (kk <= 0) return; const ix = lerp(x, x + dx, kk), iy = lerp(y - 160, y - 300 + dy, kk) + Math.sin(t * 2 + i) * 6; island(ix, iy, rx * lerp(0.3, 1, kk), ry * lerp(0.3, 1, kk), i); });
}
const ISLANDS = [[-560, -120, 70, 40], [-360, -200, 60, 34], [-160, -150, 90, 46], [40, -230, 60, 30], [240, -150, 80, 44], [440, -210, 66, 36], [600, -110, 70, 40]];
function island(x, y, rx, ry, i) { cut(() => { ctx.beginPath(); for (let a = 0; a <= 24; a++) { const th = a / 24 * TAU, r = 1 + 0.15 * Math.sin(th * 3 + i); ctx.lineTo(x + Math.cos(th) * rx * r, y + Math.sin(th) * ry * r); } ctx.closePath(); }, P.land, { shadow: 0.5, edge: 4 }); }
/** the seven islands drifting together (m 0..1) into one Bombay */
export function bombayIslands(m, t = 0) {
  sea({ t }, (i) => { if (i !== 1) return; const cx = 960, cy = 600;
    ISLANDS.forEach(([dx, dy, rx, ry], k) => { const tx = cx + (k - 3) * 90 * (1 - 0.5 * m), ty = cy + Math.sin(k * 1.3) * 40 * (1 - m); const x = lerp(cx + dx * 1.2, tx, eio(m)), y = lerp(cy + dy * 0.8 + 60, ty, eio(m)); island(x, y, rx * 1.3, ry * 1.3, k); });
    if (m > 0.95) slip('BOMBAY', cx, cy - 150, eob(seg(m, 0.95, 1)), -0.02, 56);
  });
}
/** a desk with Charles sliding the receipt: p 0..1 slide */
export function receiptDesk(p = 0, shrug = 0) {
  parchment(49); cut(P_rr(-400, -100, W + 800, 700, 0), '#8C6B4E', { shadow: 0, edge: 0 });
  cast('charles', { x: 380, y: 800, h: 520, arm: lerp(10, 60, shrug) });
  cut(P_rr(300, 600, 1400, 50, 8), '#5A3E2B', { shadow: 0.8, edge: 4 }); cut(P_rr(320, 650, 1360, 200, 0), '#6E4A33', { shadow: 0.3, edge: 3 });
}

/** HOOGHLY RIVERBANK in monsoon light: a village of huts; o = { boatX, signs [k0,k1,k2], market 0..1, walls 0..1, fortName 0..1, rider 0..1 (Sobha Singh rides past far away) } */
export function sutanuti(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(53); const g = ctx.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#B9B8A6'); g.addColorStop(1, '#DCD3B8'); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, 1000);
  layer(pan, 0.1, () => { for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); ctx.ellipse(200 + i * 520, 170 + (i % 2) * 40, 220, 60, 0, 0, TAU); }, '#C9C3B4', { shadow: 0.2, edge: 3 }); });
  layer(pan, 0.25, () => { cut(() => { ctx.beginPath(); ctx.moveTo(-400, 470); for (let x = -400; x <= W + 400; x += 60) ctx.lineTo(x, 450 + Math.sin(x * 0.008) * 12); ctx.lineTo(W + 400, 520); ctx.lineTo(-400, 520); ctx.closePath(); }, '#9DAA7E', { shadow: 0.3, edge: 3 }); });
  if (o.rider > 0) layer(pan, 0.25, () => { const rx = lerp(1760, 1080, clamp(o.rider)); ctx.save(); ctx.translate(rx, 466); ctx.scale(-1, 1); ctx.translate(-rx, -466); horse(rx, 466, 0.24, t * 6); cast('sobha', { x: rx - 4, y: 466 - 36, h: 125 }); ctx.restore(); });
  for (let i = 0; i < 2; i++) layer(pan, 0.35 + i * 0.12, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 500 + i * 60; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t + i) * 6); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.4, edge: 4 }));
  layer(pan, 0.55, () => { if (o.boatX != null) { if (o.charnock) cast('charnock', { x: o.boatX - 40, y: 600 + Math.sin(t * 2) * 4, h: 250, dir: 1 }); boat(o.boatX, 630 + Math.sin(t * 2) * 4, 1.05, 'eic', t); } });
  layer(pan, 0.75, () => {   // near bank: huts, signs, market, walls
    cut(() => { ctx.beginPath(); ctx.moveTo(-400, 690); for (let x = -400; x <= W + 400; x += 50) ctx.lineTo(x, 680 + Math.sin(x * 0.015) * 8); ctx.lineTo(W + 400, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#C9B48C', { shadow: 0.6, edge: 4 });
    for (let i = 0; i < 6; i++) { const x = 160 + i * 320; cut(P_rr(x - 80, 700, 160, 100, 4), '#D9C49A', { shadow: 0.5, edge: 4 }); cut(P_poly([[x - 104, 706], [x, 630], [x + 104, 706]]), '#A88A55', { shadow: 0.4, edge: 4 }); cut(P_rr(x - 20, 740, 40, 60, 3), '#5A3E2B', { shadow: 0, edge: 2 }); }
    if (o.market > 0) for (let i = 0; i < 10; i++) { const k = eob(clamp(o.market * 10 - i)); if (k <= 0) continue; const x = 120 + i * 190; ctx.save(); ctx.translate(x, 800); ctx.scale(k * 1.5, k * 1.5); cut(P_poly([[-60, -60], [60, -60], [70, -30], [-70, -30]]), [P.crimson, P.gold, P.forest, P.royal][i % 4], { shadow: 0.4, edge: 3 }); cut(P_rr(-50, -30, 100, 30, 3), '#B98A55', { shadow: 0.3, edge: 2 }); for (let c = 0; c < 4; c++) circle(-30 + c * 20, -38, 8, [P.gold, P.crimson, P.forest][c % 3]); ctx.restore(); }
    if (o.signs) ['SUTANUTI', 'GOBINDAPUR', 'KALIKATA'].forEach((n, i) => { const k = eob(clamp(o.signs[i] || 0)); if (k <= 0) return; ctx.save(); ctx.translate(420 + i * 540, 700); ctx.scale(k, k); cut(P_rr(-6, -170, 12, 170, 4), '#5A3E2B', { shadow: 0.4, edge: 2 }); ctx.restore(); slip(n, 420 + i * 540, 540, 0.62 * k, (i - 1) * 0.03, 44); });
    if (o.walls > 0) fortWilliam(960, 790, clamp(o.walls), o.fortName || 0, t);
  });
}
/** Fort William: walls close from both sides (p 0..1); name slip (n 0..1) */
export function fortWilliam(x, y, p, n = 0, t = 0) {
  const half = 460 * eio(p);
  for (const sgn of [-1, 1]) { ctx.save(); ctx.translate(x + sgn * (520 - half / 2) - (sgn < 0 ? 0 : 0), y); for (let b = 0; b < Math.floor(half / 46); b++) cut(P_rr(sgn * b * 46 - (sgn < 0 ? 40 : 0), -150, 42, 150, 3), P.stone, { shadow: 0.4, edge: 3 }); ctx.restore(); }
  if (p >= 1) { cut(P_rr(x - 470, y - 190, 940, 40, 4), P.stoneDark, { shadow: 0.5, edge: 3 }); for (let b = 0; b < 12; b++) cut(P_rr(x - 460 + b * 80, y - 222, 40, 32, 3), P.stoneDark, { shadow: 0.3, edge: 2 }); cut(P_rr(x - 60, y - 120, 120, 120, 50), '#3E2C1E', { shadow: 0, edge: 3 }); flag('eic', x + 380, y - 190, 220, 0.6, t); }
  if (n > 0) slip('FORT WILLIAM', x, y - 300, eob(clamp(n)), -0.02, 52);
}
/** two flags sliding together into one (m 0..1) */
export function flagsMerge(m, t = 0, droop = 0) {
  parchment(57); ctx.save(); ctx.globalAlpha = 1 - clamp(m * 2.5); label('OLD COMPANY', lerp(600, 960, eio(m)), 300, 34, P.sepia); label('NEW COMPANY', lerp(1320, 960, eio(m)), 300, 34, P.sepia); ctx.restore();
  ctx.save(); ctx.globalAlpha = 1 - clamp((m - 0.85) * 6); flag('eic', lerp(560, 880, eio(m)), 760, 380, 1.1, t); flag('eic', lerp(1260, 900, eio(m)), 760, 380, 1.1, t + 1, 0.3 * clamp(droop) * (1 - eio(m))); ctx.restore();
  if (m > 0.85) { flag('eic', 880, 760, 420, 1.3 * eob(seg(m, 0.85, 1)), t); slip('UNITED COMPANY · 1708', 960, 220, eob(seg(m, 0.9, 1)), -0.02, 48); }
}
/** a judge's gavel slip "2003" */
export function gavel(x, y, s = 1, hit = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-150, 20, 300, 40, 8), '#5A3E2B', { shadow: 0.6, edge: 4 });
  ctx.save(); ctx.translate(60, 0); ctx.rotate(-0.9 * (1 - eob(clamp(hit)))); cut(P_rr(-14, -200, 28, 200, 8), '#7A5234', { shadow: 0.5, edge: 3 }); cut(P_rr(-70, -250, 140, 70, 14), '#5A3E2B', { shadow: 0.6, edge: 4 }); ctx.restore();
  ctx.restore();
}
/** the four 1717 perk icons: 0 no-duty stamp, 1 dastak pass, 2 land plot, 3 coin */
export function perkIcon(k, x, y, s = 1) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_circ(0, 0, 90), CREAM, { shadow: 0.7, edge: 5 });
  if (k === 0) { ctx.save(); ctx.rotate(-0.2); ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.strokeRect(-62, -30, 124, 60); ctx.font = '700 30px Caladea'; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NO DUTY', 0, 2); ctx.restore(); }
  if (k === 1) { cut(P_rr(-50, -60, 100, 120, 6), '#EBCB7E', { shadow: 0.4, edge: 3 }); for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(62,44,30,0.5)'; ctx.fillRect(-34, -40 + i * 18, 68, 5); } circle(0, 36, 14, MUGHAL); }
  if (k === 2) { ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.setLineDash([10, 7]); ctx.strokeRect(-55, -45, 110, 90); ctx.setLineDash([]); for (let i = 0; i < 3; i++) cut(P_poly([[-34 + i * 34, 10], [-20 + i * 34, -16], [-6 + i * 34, 10]]), P.forest, { shadow: 0, edge: 2 }); }
  if (k === 3) { coin(0, 0, 56, 'BOMBAY'); }
  ctx.restore();
}
/** the END CARD: "NEXT: THE FRENCH IN INDIA"; bottom-right 420x260 kept clear for YouTube end-screen elements */
export function endCard(lt) {
  parchment(61);
  ribbon('NEXT', 700, 300, eob(seg(lt, 0, 0.4)), 90);
  slip('THE FRENCH IN INDIA', 700, 470, eob(seg(lt, 0.25, 0.65)), -0.02, 70);
  const f = eob(seg(lt, 0.4, 0.9)); if (f > 0) { ctx.save(); ctx.translate(700, 650); ctx.scale(f, f); fleur(0, 0, 1.6, P.gold); ctx.restore(); }
  label('FROM MERCHANTS TO MASTERS · PART OF A SERIES', 700, 790, 26, P.sepia);
}
export { CREAM as CREAM2 };
