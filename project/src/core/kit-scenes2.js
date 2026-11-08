// Paper Atlas · more SCENES (chapters 1-4, 6-8). Same rules: layers + o.pan parallax, o.night, ground at/above y 800.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ, parchment, label, slip, ribbon, seal, hall } from './kit.js';
import { person, cast, SKIN, horse, parasol } from './kit-cast.js';
import { flag, eastIndiaman, MUGHAL, coin, sun, fleur } from './kit-props.js';
import { layer, nightWash, sea, boat, mughalCourt } from './kit-scenes.js';
import { GEO as GEO_REF, tag } from './kit-map.js';

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
  // SURAT PORT: open sea on the left; the shore, river mouth and town on the right on solid ground; a stone quay with the domed customs house
  const pan = o.pan || 0, t = o.t || 0;
  parchment(43); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.1, () => cut(P_circ(700, 200, 64), '#EFC66A', { shadow: 0.3, edge: 4 }));
  for (let i = 0; i < 3; i++) layer(pan, 0.3 + i * 0.12, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 470 + i * 100; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.011 + t * 1.3 + i) * 10); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.5, edge: 4 }));
  layer(pan, 0.5, () => {   // the shore: land rising from the water on the right, with the town on it
    cut(() => { ctx.beginPath(); ctx.moveTo(900, H + 300); ctx.lineTo(980, 560); ctx.quadraticCurveTo(1060, 470, 1200, 440); ctx.lineTo(W + 400, 420); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, '#D9C49A', { shadow: 0.7, edge: 5 });
    for (let i = 0; i < 9; i++) house(1180 + i * 105, 452 - (i % 3) * 6, 92, 66 + rnd(i + 3) * 50, i % 2 ? '#E3D3B0' : '#CDB688', '#B98A55');
    for (const [x, y] of [[1090, 520], [1700, 450]]) { cut(P_rr(x - 8, y - 150, 16, 150, 4), '#6E5236', { shadow: 0.3, edge: 2 }); cut(P_circ(x, y - 160, 46), P.forest, { shadow: 0.3, edge: 3 }); }
  });
  layer(pan, 0.6, () => { const sx = o.shipX ?? 520, sy = 640 + Math.sin(t * 1.6) * 6;
    if (!o.steamer) { eastIndiaman(sx, sy, 0.55, Math.sin(t * 1.2) * 0.02, t, 'eic'); return; }
    // a 1910s passenger steamer: black hull, white deck house, two buff funnels with smoke (no sails)
    ctx.save(); ctx.translate(sx, sy);
    cut(P_poly([[-200, -40], [190, -40], [230, -70], [200, 30], [-180, 30], [-215, -55]]), '#2B2622', { shadow: 0.6, edge: 4 });
    ctx.fillStyle = '#B3392F'; ctx.fillRect(-190, 16, 385, 10);
    cut(P_rr(-130, -95, 250, 55, 4), '#F3EEE2', { shadow: 0.4, edge: 3 }); for (let k = 0; k < 8; k++) circle(-110 + k * 30, -68, 7, '#5A6B7A');
    for (const fx of [-50, 50]) { cut(P_rr(fx - 16, -170, 32, 78, 3), '#D9B36A', { shadow: 0.4, edge: 3 }); ctx.fillStyle = '#2B2622'; ctx.fillRect(fx - 16, -170, 32, 12);
      for (let j = 0; j < 3; j++) { const q = ((t * 0.5 + j / 3) % 1); ctx.save(); ctx.globalAlpha = 0.5 * (1 - q); circle(fx - 20 - q * 120, -190 - q * 60, 16 + q * 26, '#CFC8BC'); ctx.restore(); } }
    ctx.restore(); });
  layer(pan, 0.8, () => { // stone quay + the customs house standing on it
    cut(P_poly([[960, 820], [1010, 700], [W + 400, 700], [W + 400, 820]]), '#B9A98C', { shadow: 0.8, edge: 5 }); for (let x = 1020; x < W + 300; x += 70) { ctx.fillStyle = 'rgba(62,44,30,0.2)'; ctx.fillRect(x, 700, 3, 120); }
    cut(P_rr(1250, 500, 420, 200, 4), MARBLE, { shadow: 0.7, edge: 4 }); cut(() => { ctx.beginPath(); ctx.arc(1460, 500, 105, Math.PI, TAU); ctx.closePath(); }, MARBLE, { shadow: 0.5, edge: 4 }); circle(1460, 386, 12, P.gold);
    for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); const x = 1300 + i * 100; ctx.moveTo(x, 700); ctx.lineTo(x, 600); ctx.arc(x + 30, 600, 30, Math.PI, TAU); ctx.lineTo(x + 60, 700); ctx.closePath(); }, '#3E2C1E', { shadow: 0, edge: 2 });
    if (o.flag !== null) flag(o.flag || 'mughal', o.place ? 1640 : 1260, 500, 200, 0.6, t); slip(o.place || 'SURAT · CUSTOMS HOUSE', o.place ? 1330 : 1460, 330, 0.6, -0.02, 34);
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
  // English ships (left) fire: smoke puffs at their bows; the Portuguese ships (right) list and go down below the waves. No people.
  const t = o.t || 0, fire = o.fire || 0, sink = o.sink || 0;
  const goDown = (x, y, s, k, sk) => {   // a ship listing then sinking, clipped at its waterline
    const list = Math.min(1, sk * 2) * 0.28 * (k % 2 ? 1 : -1), drop = Math.max(0, sk - 0.35) / 0.65 * 720 * s;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 400, -2000, 800, 2000 + y + 30 * s); ctx.clip();
    eastIndiaman(x, y + drop, s, list, t, 'portugal', 0); ctx.restore();
  };
  sea({ t, pan: o.pan || 0 }, (i) => {
    if (i === 0) for (let k = 0; k < 4; k++) goDown(1180 + k * 170, 470 + (k % 2) * 14, 0.22, k, clamp(sink * 1.4 - 0.4 - k * 0.12));
    if (i === 1) for (let k = 0; k < 3; k++) goDown(1180 + k * 260, 580, 0.36, k, clamp(sink * 1.5 - k * 0.25));
    if (i === 2) for (let k = 0; k < 2; k++) {
      const x = 250 + k * 380, y = 690 + Math.sin(t * 1.5 + k) * 6; eastIndiaman(x, y, 0.46, 0.02 * Math.sin(t + k), t, 'eic');
      for (let j = 0; j < 3; j++) { const f = clamp(fire * 3 - k * 0.6 - j * 0.25); if (f <= 0 || f >= 1) continue;
        ctx.save(); ctx.globalAlpha = 0.75 * (1 - f); cut(P_circ(x + 150 + f * 90, y - 12 - f * 40, 20 + f * 40), '#D8D0C0', { shadow: 0.2, edge: 3 }); ctx.restore(); }
    }
    if (i === 3) for (let k = 0; k < 2; k++) eastIndiaman(80 + k * 400, 790 + Math.sin(t * 1.4 + k) * 5, 0.36, 0, t, 'eic');
  });
}
export function blankTreaty(x, y, p = 1, t = 0, strike = 0) {
  // Roe's draft treaty: written requests (scribbled lines, no invented wording) struck through one by one; "NO TREATY" stamp
  const w = 760 * eo(clamp(p)) + 40; cut(P_rr(x - w / 2, y - 220, w, 440, 6), CREAM, { shadow: 0.9, edge: 4 });
  for (const sx of [x - w / 2, x + w / 2]) cut(P_rr(sx - 20, y - 240, 40, 480, 20), '#D9C7A0', { shadow: 0.7, edge: 4 });
  if (p < 0.6) return;
  label("ROE'S TREATY", x, y - 160, 40, P.sepia);
  ctx.save(); ctx.globalAlpha = clamp((p - 0.6) * 4);
  for (let r = 0; r < 5; r++) { const ly = y - 90 + r * 54, lw = 520 - (r % 2) * 80; ctx.strokeStyle = 'rgba(62,44,30,0.75)'; ctx.lineWidth = 4; ctx.beginPath();
    for (let k = 0; k <= lw; k += 8) ctx.lineTo(x - 280 + k, ly + Math.sin(k * 0.21 + r * 3) * 6 + Math.sin(k * 0.05 + r) * 3); ctx.stroke();
    circle(x - 310, ly, 6, P.sepia);
    const s = clamp(strike * 5 - r * 0.9); if (s > 0) { ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 300, ly + 2); ctx.lineTo(x - 300 + (lw + 40) * s, ly - 4); ctx.stroke(); } }
  ctx.restore();
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
export function receiptDesk(p = 0, shrug = 0, officials = 1) {
  parchment(49); cut(P_rr(-400, -100, W + 800, 700, 0), '#8C6B4E', { shadow: 0, edge: 0 });
  cast('charles', { x: 380, y: 800, h: 520, arm: lerp(10, 60, shrug) });
  if (officials > 0) {   // two Company officials (sober coats, wigs) across the table from the king
    person({ x: 1440, y: 800, h: 480, dir: -1, legs: 'hose', coat: 'long', coatC: '#3B3A4A', trim: '#2B2019', buttons: 1, collar: 'band', hair: 'wig', hairC: '#BDB09A', arm: 25 });
    person({ x: 1640, y: 800, h: 470, dir: -1, legs: 'hose', coat: 'long', coatC: '#4A3426', trim: '#2B2019', buttons: 1, collar: 'band', hair: 'wig', hairC: '#7A6248', prop: 'ledger' });
  }
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

/** INDIAN TEXTILES (after Wikipedia "Clothing in India"): four lengths hang from a rod and unroll downward —
 *  chintz (painted calico), block print, fine muslin, a silk sari with a gold zari border. p = 0..1 unroll; labels from p > 0.7 */
export function indianTextiles(p = 1, t = 0) {
  parchment(44);
  const X = [300, 740, 1180, 1620], TOP = 150, FULL = 580, cw = 380;
  cut(P_rr(80, TOP - 22, W - 160, 26, 13), '#6B4A2E', { shadow: 0.7, edge: 3 });
  X.forEach((cx, k) => {
    const h = FULL * eio(clamp(p * 1.6 - k * 0.2)); if (h < 4) return;
    const x0 = cx - cw / 2, sway = Math.sin(t * 1.3 + k) * 3;
    ctx.save(); ctx.translate(sway, 0);
    const bg = ['#F4E8CF', '#E2B66B', '#FBF7EE', '#9E2032'][k];
    cut(P_rr(x0, TOP, cw, h, 4), bg, { shadow: 0.8, edge: 4 });
    ctx.save(); ctx.beginPath(); ctx.rect(x0, TOP, cw, h); ctx.clip();
    if (k === 0) {   // chintz: red flowers, green leaves on a winding stem
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { const fx = x0 + 70 + c * 120 + (r % 2) * 50, fy = TOP + 60 + r * 100;
        ctx.strokeStyle = '#4C6B3C'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(fx - 40, fy + 40); ctx.quadraticCurveTo(fx - 30, fy, fx, fy); ctx.stroke();
        ctx.fillStyle = '#4C6B3C'; ctx.beginPath(); ctx.ellipse(fx - 30, fy + 22, 16, 7, -0.6, 0, TAU); ctx.fill();
        for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circle(fx + Math.cos(a) * 13, fy + Math.sin(a) * 13, 11, '#B3392F'); } circle(fx, fy, 7, '#E3B341'); }
    } else if (k === 1) {   // block print: rows of indigo buta (small paisley) and dotted lines
      for (let r = 0; r < 10; r++) { const fy = TOP + 34 + r * 58; ctx.fillStyle = 'rgba(44,52,90,0.55)'; for (let x = x0 + 8; x < x0 + cw; x += 16) ctx.fillRect(x, fy + 24, 6, 4);
        for (let c = 0; c < 5; c++) { const fx = x0 + 40 + c * 76 + (r % 2) * 38; ctx.fillStyle = '#2C345A'; ctx.beginPath(); ctx.ellipse(fx, fy, 10, 15, 0.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(fx + 7, fy - 12, 5, 0, TAU); ctx.fill(); circle(fx, fy, 4, '#B3392F'); } }
    } else if (k === 2) {   // muslin: fine, light, almost see-through, faint woven stripes
      ctx.fillStyle = 'rgba(200,190,170,0.22)'; for (let x = x0 + 10; x < x0 + cw; x += 9) ctx.fillRect(x, TOP, 1.5, h); ctx.fillStyle = 'rgba(201,168,102,0.5)'; ctx.fillRect(x0, TOP + h - 40, cw, 6); ctx.fillRect(x0, TOP + h - 28, cw, 3);
            for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) circle(x0 + 50 + c * 95 + (r % 2) * 45, TOP + 50 + r * 82, 4, 'rgba(201,168,102,0.8)');
    } else {   // silk sari: red field, small gold butis, a broad gold zari border with temple (triangle) motifs
      for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) circle(x0 + 50 + c * 95 + (r % 2) * 45, TOP + 40 + r * 60, 6, '#E3B341');
      const by = TOP + FULL - 150; ctx.fillStyle = '#D9A441'; ctx.fillRect(x0, by, cw, 120); ctx.fillStyle = '#9E2032';
      for (let x = x0; x < x0 + cw; x += 40) { ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + 20, by + 34); ctx.lineTo(x + 40, by); ctx.fill(); }
      ctx.fillStyle = '#2E5A3A'; ctx.fillRect(x0, by + 56, cw, 10); ctx.fillStyle = '#9E2032'; ctx.fillRect(x0, by + 84, cw, 6);
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(62,44,30,0.15)'; ctx.fillRect(x0, TOP + h - 10, cw, 10);
    ctx.restore();
    const lp = eob(clamp((p - 0.7) * 4 - k * 0.15)); if (lp > 0) slip(['CHINTZ', 'BLOCK PRINT', 'MUSLIN', 'SILK SARI'][k], cx, 800, lp * 0.8, (k % 2 ? 0.02 : -0.02), 40);
  });
}

/** a TEAR-OFF WALL CALENDAR: "30 DECEMBER 1600" tears away (tear 0..1) to show "31 DECEMBER 1600" */
export function calendarPage(tear = 0, ring = 0) {
  parchment(45);
  const x = 960, y = 470, w = 520, h = 600;
  cut(P_rr(x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 60, 10), '#8C6A48', { shadow: 1, edge: 5 });
  const page = (day) => { cut(P_rr(x - w / 2, y - h / 2 + 40, w, h - 20, 4), '#F6EEDB', { shadow: 0.4, edge: 3 });
    ctx.fillStyle = P.crimson; ctx.fillRect(x - w / 2, y - h / 2 + 40, w, 96);
    label('DECEMBER', x, y - h / 2 + 90, 54, '#F6EEDB');
    ctx.font = `700 260px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.ink; ctx.fillText(String(day), x, y + 40);
    label('1600', x, y + 230, 56, P.sepia); };
  page(31);
  if (ring > 0) { ctx.save(); ctx.strokeStyle = P.crimson; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(x, y + 40, 190, 150, -0.1, -1.4, -1.4 + TAU * eio(clamp(ring))); ctx.stroke(); ctx.restore(); }
  if (tear < 1) { ctx.save(); const k = eio(clamp(tear)); ctx.translate(x - w / 2, y - h / 2 + 40); ctx.rotate(-k * 0.9); ctx.translate(-k * 200, k * 700); ctx.globalAlpha = 1 - k * 0.6; ctx.translate(-(x - w / 2), -(y - h / 2 + 40)); page(30); ctx.restore(); }
  cut(P_rr(x - w / 2 - 10, y - h / 2 - 10, w + 20, 60, 8), '#5A3E2B', { shadow: 0.6, edge: 4 });
  for (const dx of [-140, 140]) { circle(x + dx, y - h / 2 + 20, 16, '#C9B48A'); circle(x + dx, y - h / 2 + 20, 8, '#3E2C1E'); }
}

/** THE SEVEN ISLANDS OF BOMBAY, traced from the 1843 "Map of the Island of Bombay and Colaba" (north up).
 *  p 0..1: the islands appear one by one with their names. Coordinates are in the source map's pixels. */
const SEVEN = [
  ['Colaba', [[520,1660],[545,1652],[528,1700],[505,1740],[480,1800],[455,1870],[432,1930],[420,1880],[440,1800],[470,1730],[495,1690]], [-150, 0]],
  ["Old Woman's Island", [[528,1655],[562,1660],[556,1692],[528,1690]], [200, -10]],
  ['Bombay', [[190,1065],[250,1090],[275,1170],[300,1240],[400,1300],[460,1240],[490,1170],[525,1130],[560,1200],[580,1350],[600,1420],[625,1480],[595,1560],[560,1605],[520,1560],[470,1500],[420,1430],[330,1380],[250,1360],[200,1380],[170,1440],[140,1520],[120,1530],[100,1470],[110,1380],[140,1290],[130,1200],[150,1120]], [-270, 30]],
  ['Mazagaon', [[440,930],[520,915],[560,960],[600,915],[605,980],[590,1050],[600,1110],[560,1140],[490,1120],[440,1100],[425,1020]], [220, 0]],
  ['Parel', [[450,160],[500,130],[560,150],[580,200],[620,160],[650,240],[640,330],[560,280],[540,380],[620,390],[640,450],[600,470],[580,520],[570,600],[620,620],[660,700],[620,720],[580,800],[540,880],[470,890],[420,850],[400,750],[420,650],[470,560],[510,450],[520,330],[470,260],[440,200]], [210, 120]],
  ['Worli', [[100,520],[140,540],[190,640],[210,760],[200,830],[190,900],[185,960],[175,960],[165,900],[140,820],[130,700],[115,600]], [-170, 60]],
  ['Mahim', [[300,290],[370,260],[420,350],[430,450],[380,560],[320,640],[260,690],[230,680],[240,600],[300,500],[320,400]], [-200, -60]],
];
export function bombaySeven(p = 1, t = 0, o = {}) {
  parchment(46); ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  ctx.strokeStyle = 'rgba(62,44,30,0.12)'; ctx.lineWidth = 2; for (let y = 140; y < 880; y += 90) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  const S = 0.415, X = (mx) => 960 + (mx - 378) * S, Y = (my) => 112 + (my - 130) * S;
  SEVEN.forEach(([name, pts, [lx, ly]], k) => {
    const a = eob(clamp(p * 9 - k * 1.1)); if (a <= 0) return;
    let cx = 0, cy = 0; pts.forEach(([x, y]) => { cx += X(x); cy += Y(y); }); cx /= pts.length; cy /= pts.length;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(a, a); ctx.translate(-cx, -cy);
    cut(P_poly(pts.map(([x, y]) => [X(x), Y(y)])), k === 2 ? '#E9D7B0' : P.land, { shadow: 0.6, edge: 4 }); ctx.restore();
    if (o.labels !== false && a > 0.5) tag(name, cx + lx, Math.min(cy + ly, 830), 0.62 * clamp(a), cx, cy);
  });
  if (o.title) slip('SEVEN ISLANDS', 420, 200, eob(clamp(o.title)), -0.02, 54);
}

/** THE THREE VILLAGES, 1698, as on the old maps of Kolkata: the Hooghly runs north to south; on its east bank lie
 *  Sutanuti (north), Dihi Kalikata (middle) and Gobindapur (south). pop[k] 0..1 builds each village; name[k] 0..1 shows its tag. */
export function threeVillages(pop = [1, 1, 1], name = [1, 1, 1], t = 0, o = {}) {
  parchment(47); cut(P_rr(-300, -300, W + 600, H + 600, 0), '#D8C79A', { shadow: 0, edge: 0 });
  // fields and tree clumps
  for (let k = 0; k < 26; k++) { const x = 1000 + rnd(k * 3.1) * 900, y = 120 + rnd(k * 7.7) * 700; ctx.save(); ctx.globalAlpha = 0.5; circle(x, y, 18 + rnd(k) * 16, '#8FA06A'); ctx.restore(); }
  const rx = (y) => 640 + Math.sin(y * 0.004 + 0.6) * 70;   // the river's centreline
  cut(() => { ctx.beginPath(); for (let y = -100; y <= H + 100; y += 20) ctx.lineTo(rx(y) - 150, y); for (let y = H + 100; y >= -100; y -= 20) ctx.lineTo(rx(y) + 150, y); ctx.closePath(); }, P.sea, { shadow: 0.5, edge: 4 });
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; for (let k = 0; k < 6; k++) { const y0 = ((t * 30 + k * 190) % 1200) - 60; ctx.beginPath(); ctx.moveTo(rx(y0) - 40, y0); ctx.lineTo(rx(y0) - 10, y0 + 40); ctx.stroke(); }
  label('HOOGHLY', rx(560) - 10, 560, 34, 'rgba(255,255,255,0.75)');
  const V = [['SUTANUTI', 230], ['KALIKATA', 470], ['GOBINDAPUR', 710]];
  V.forEach(([n, vy], k) => {
    const a = eob(clamp(pop[k])); if (a <= 0) return;
    const bx = rx(vy) + 190;
    for (let j = 0; j < 9; j++) { const hx = bx + (j % 3) * 70 + (Math.floor(j / 3) % 2) * 30, hy = vy - 60 + Math.floor(j / 3) * 55;
      ctx.save(); ctx.translate(hx, hy); ctx.scale(a, a); cut(P_rr(-20, -16, 40, 32, 3), '#EFE2C2', { shadow: 0.5, edge: 3 }); cut(P_poly([[-24, -14], [0, -30], [24, -14]]), '#A8743E', { shadow: 0.2, edge: 2 }); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#B9A37A'; ctx.fillRect(rx(vy) + 145, vy - 8, 40, 16); ctx.restore();   // the ghat (steps to the river)
    const nm = eob(clamp(name[k])); if (nm > 0.02) tag(n, bx + 380, vy, 0.8 * nm, bx + 170, vy);
  });
  if (o.boat !== false) boat(rx(400 + Math.sin(t * 0.3) * 80) - 40, 400 + Math.sin(t * 0.3) * 80, 0.5, 'eic', t);
  // north arrow
  ctx.save(); ctx.translate(1780, 690); cut(P_poly([[0, -60], [22, 20], [0, 6], [-22, 20]]), P.ink, { shadow: 0.4, edge: 2 }); ctx.restore(); label('N', 1780, 740, 30, P.ink);
}
