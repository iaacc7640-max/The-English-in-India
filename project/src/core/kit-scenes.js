// Paper Atlas · SCENES for The English in India (16:9). Every scene is LAYERS that move on their own: o.pan (px) slides each layer by
// its depth (back slow, front fast) for a parallax camera; o.night (0 day, 0.5 dusk, 1 night) washes the page.
// Floor/ground lines sit at or above y 800 so nothing moving crosses the caption band (y 860-1010).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ, parchment, label, slip } from './kit.js';
import { person, cast, CAST, SKIN } from './kit-cast.js';
import { flag, eastIndiaman, MUGHAL, sun } from './kit-props.js';

const SAND = '#C98B67', SAND_D = '#A86A4E', SAND_DD = '#7A4A38', SAND_L = '#DDA683', MARBLE = '#F1E7D0', NAVY = '#2F3550';
/** run fn with the canvas shifted by a depth-scaled pan */
export function layer(pan, depth, fn) { ctx.save(); ctx.translate(-pan * depth, 0); fn(); ctx.restore(); }
/** night wash: 0 day · 0.5 dusk · 1 night (stars from 0.7) */
export function nightWash(night, seed = 1, starsY = 520) {
  if (night <= 0) return; const n = clamp(night);
  // multiply keeps the paper hues: dusk = warm violet, night = deep blue
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = n < 0.6 ? `rgba(214,184,186,${n / 0.6})` : '#4E5C86'; if (n >= 0.6) ctx.globalAlpha = 0.55 + 0.45 * (n - 0.6) / 0.4;
  ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
  if (n >= 0.7) { ctx.save(); ctx.globalAlpha = (n - 0.7) / 0.3; for (let i = 0; i < 46; i++) circle(rnd(i + seed) * W, 60 + rnd(i + 40 + seed) * starsY, 2.5 + rnd(i) * 2.5, '#E9DCBC'); ctx.restore(); }
}
/** a cusped Mughal arch opening (path) centred at x, springing at y, half-width r, bottom at yb */
function P_mughalArch(x, y, r, yb) {
  // a pointed (four-centred) Mughal arch: two arcs meeting at a peak, with a small finial notch
  return () => { ctx.beginPath(); ctx.moveTo(x - r, yb); ctx.lineTo(x - r, y);
    ctx.quadraticCurveTo(x - r, y - r * 0.95, x, y - r * 1.25); ctx.quadraticCurveTo(x + r, y - r * 0.95, x + r, y);
    ctx.lineTo(x + r, yb); ctx.closePath(); };
}
/** THE MUGHAL COURT (red sandstone): o = { pan, night, throne: 'aurangzeb'|'farrukhsiyar'|'jahangir'|null, courtiers, dim, emperorArm } floor y 800 */
export function mughalCourt(o = {}) {
  const pan = o.pan || 0, fl = 800;
  parchment(17);
  layer(pan, 0.35, () => {
    cut(P_rr(-400, -100, W + 800, fl + 100, 0), SAND, { shadow: 0, edge: 0 });
    ctx.fillStyle = SAND_D; ctx.fillRect(-400, 96, W + 800, 18); for (let x = -380; x < W + 380; x += 60) { ctx.save(); ctx.translate(x, 126); ctx.rotate(Math.PI / 4); ctx.fillStyle = P.gold; ctx.fillRect(-7, -7, 14, 14); ctx.restore(); }
    for (let i = -1; i < 6; i++) { const x = 140 + i * 380; cut(P_mughalArch(x, 330, 130, fl), SAND_D, { shadow: 0, edge: 0 }); cut(P_mughalArch(x, 350, 108, fl), SAND_DD, { shadow: 0, edge: 0 }); }
    for (let i = -1; i < 7; i++) { const x = -50 + i * 380; cut(P_rr(x - 34, 150, 68, fl - 150, 6), SAND_L, { shadow: 0.4, edge: 3 }); cut(P_rr(x - 46, 150, 92, 30, 6), SAND_L, { shadow: 0.3, edge: 3 }); }
  });
  layer(pan, 0.6, () => {
    cut(P_rr(-400, fl, W + 800, H - fl + 400, 0), '#B98A66', { shadow: 0, edge: 0 });
    cut(P_poly([[420, fl], [1500, fl], [1900, H + 60], [20, H + 60]]), P.wine, { shadow: 0, edge: 0 });
    ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(450, fl + 14); ctx.lineTo(1470, fl + 14); ctx.stroke();
    // the dais + throne (takht) under a canopy
    if (o.throne !== null) {
      const tx = 1380;
      cut(P_rr(tx - 260, 640, 520, 160, 6), MARBLE, { shadow: 0.7, edge: 4 }); ctx.fillStyle = 'rgba(62,44,30,0.15)'; for (let i = 0; i < 6; i++) ctx.fillRect(tx - 240 + i * 86, 660, 40, 120);
      for (const k of [-1, 1]) cut(P_rr(tx + k * 230 - 8, 250, 16, 400, 6), P.gold, { shadow: 0.5, edge: 3 });
      cut(() => { ctx.beginPath(); ctx.moveTo(tx - 270, 260); ctx.quadraticCurveTo(tx, 180, tx + 270, 260); for (let i = 0; i <= 10; i++) ctx.lineTo(tx + 270 - i * 54, 270 + (i % 2) * 22); ctx.closePath(); }, P.gold, { shadow: 0.7, edge: 4 });
      cut(P_rr(tx - 180, 560, 360, 84, 14), P.wine, { shadow: 0.6, edge: 4 }); cut(P_rr(tx + 70, 470, 80, 110, 34), P.wine, { shadow: 0.5, edge: 4 });
      if (o.throne) cast(o.throne, { x: tx - 10, y: 640, h: 300, seated: 1, dir: -1, arm: o.emperorArm || 0 });
    }
    if (o.courtiers !== false) {
      person({ x: 1700, y: fl, h: 330, dir: -1, skin: SKIN.in2, legs: 'trousers', legC: '#EFE4CC', coat: 'jama', coatC: '#EFE4CC', patka: MUGHAL, beard: 'full', hat: 'turban', hatC: '#EFE4CC' });
      person({ x: 1820, y: fl + 10, h: 340, dir: -1, skin: SKIN.in, legs: 'trousers', legC: '#EFE4CC', coat: 'jama', coatC: P.forest, patka: P.gold, beard: 'mous', hat: 'turban', hatC: P.gold });
    }
  });
  if (o.dim) { ctx.save(); ctx.globalAlpha = o.dim; ctx.fillStyle = '#2B2019'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); }
  nightWash(o.night || 0);
}
/** foreground pillars of the court (draw LAST, after the figures) */
export function courtForeground(pan = 0) {
  layer(pan, 1.25, () => { for (const x of [-60, W + 60]) { cut(P_rr(x - 80, -100, 160, H + 200, 8), SAND_L, { shadow: 1.2, edge: 5 }); cut(P_rr(x - 100, 760, 200, 60, 6), SAND_D, { shadow: 0.6, edge: 4 }); } });
}
/** the two English envoys of 1690 (wigs, sober coats) */
export const ENVOY = [
  { legs: 'hose', coat: 'long', coatC: '#3B3A4A', trim: '#2B2019', buttons: 1, collar: 'band', hair: 'wig', hairC: '#BDB09A', hat: null },
  { legs: 'hose', coat: 'long', coatC: '#4A3426', trim: '#2B2019', buttons: 1, collar: 'band', hair: 'wig', hairC: '#7A6248', hat: null },
];
export function envoy(k, o) { person({ ...ENVOY[k], ...o }); }

/** LONDON OFFICE (Child): panelled wall, window on the river, a big wall map of India. o = { pan, night, jab 0..1 } */
export function londonOffice(o = {}) {
  const pan = o.pan || 0;
  parchment(23);
  layer(pan, 0.3, () => {
    cut(P_rr(-400, -100, W + 800, 900, 0), '#8C6B4E', { shadow: 0, edge: 0 });
    for (let x = -360; x < W + 360; x += 240) { cut(P_rr(x, 140, 200, 300, 6), '#7A5A40', { shadow: 0.3, edge: 3 }); cut(P_rr(x, 480, 200, 260, 6), '#7A5A40', { shadow: 0.3, edge: 3 }); }
    cut(P_rr(160, 150, 300, 420, 10), '#3E2C1E', { shadow: 0.5, edge: 4 }); cut(P_rr(180, 170, 260, 380, 6), '#BFD1CC', { shadow: 0, edge: 0 });
    ctx.fillStyle = '#3E2C1E'; ctx.fillRect(305, 170, 10, 380); ctx.fillRect(180, 355, 260, 10);
    for (let i = 0; i < 4; i++) cut(P_rr(200 + i * 60, 470 - (i % 2) * 30, 40, 80 + (i % 2) * 30, 3), '#9C8C70', { shadow: 0, edge: 2 });
  });
  layer(pan, 0.55, () => {
    // wall map (simplified India on paper)
    cut(P_rr(860, 150, 700, 470, 6), '#EFE4CC', { shadow: 0.9, edge: 5 });
    ctx.save(); ctx.translate(1210, 395); ctx.scale(1.15, 1.15);
    cut(P_poly([[-150, -170], [-40, -190], [60, -150], [150, -120], [170, -60], [80, -20], [40, 60], [0, 160], [-30, 120], [-70, 20], [-140, -30], [-180, -90]]), P.land, { shadow: 0.4, edge: 3 });
    ctx.restore();
    for (const [x, y] of [[1105, 395], [1205, 520], [1345, 330]]) circle(x, y, 9, P.crimson);
    cut(P_rr(-400, 800, W + 800, 400, 0), '#5A3E2B', { shadow: 0, edge: 0 });
    cut(P_rr(460, 600, 560, 40, 6), '#4A3426', { shadow: 0.7, edge: 4 }); cut(P_rr(500, 640, 30, 160, 4), '#4A3426'); cut(P_rr(950, 640, 30, 160, 4), '#4A3426');
    cut(P_rr(560, 560, 140, 44, 4), '#EFE4CC', { shadow: 0.4, edge: 3 }); cut(P_rr(800, 548, 40, 52, 6), '#2B2019', { shadow: 0.3, edge: 2 });
  });
  layer(pan, 0.55, () => { const j = o.jab || 0; cast('child', { x: 790 + 20 * j, y: 800, h: 520, arm: lerp(30, 92, j), dir: 1 }); });
  nightWash(o.night || 0);
}

/** RIVER PORT (Hooghly): far bank, river, boats, near bank with a Company house. o = { pan, night, fire 0..1, flagFall 0..1, boatsOut 0..1, tolls 0..1 (n gates popped), t } */
export function riverPort(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(29); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 860);
  layer(pan, 0.15, () => { cut(P_circ(1500, 210, 60), '#EFC66A', { shadow: 0.3, edge: 4 }); });
  layer(pan, 0.3, () => {   // far bank with town
    cut(() => { ctx.beginPath(); ctx.moveTo(-400, 470); for (let x = -400; x <= W + 400; x += 60) ctx.lineTo(x, 440 + Math.sin(x * 0.01) * 10); ctx.lineTo(W + 400, 520); ctx.lineTo(-400, 520); ctx.closePath(); }, '#A9B48A', { shadow: 0.4, edge: 4 });
    for (let i = 0; i < 9; i++) { const x = 900 + i * 110; cut(P_rr(x, 380 - (i % 3) * 18, 80, 80 + (i % 3) * 18, 3), '#C9B48C', { shadow: 0.3, edge: 3 }); cut(P_poly([[x - 6, 384 - (i % 3) * 18], [x + 40, 350 - (i % 3) * 18], [x + 86, 384 - (i % 3) * 18]]), '#8C6B4E', { shadow: 0.2, edge: 2 }); }
    for (let i = 0; i < 6; i++) palm(150 + i * 120, 450, 0.55 + rnd(i) * 0.2);
    if (o.fire > 0) for (let i = 0; i < 3; i++) farFlame(1060 + i * 230 + rnd(i) * 40, 420, 0.28 * eob(clamp(o.fire * 1.6 - i * 0.15)), t, i);
  });
  // river layers
  for (let i = 0; i < 3; i++) layer(pan, 0.4 + i * 0.12, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 500 + i * 70; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 1.2 + i) * 8); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.4, edge: 4 }));
  layer(pan, 0.55, () => {
    const out = o.boatsOut || 0;
    boat(520 + out * 900, 640 + Math.sin(t * 2) * 5, 0.8, 'eic', t);
    boat(260 + out * 1100, 690 + Math.sin(t * 2 + 1) * 5, 0.7, 'eic', t);
    if (o.tolls > 0) for (let i = 0; i < 4; i++) { const k = eob(clamp(o.tolls * 4 - i)); if (k > 0) tollGate(330 + i * 400, 600, k * 1.1); }
  });
  layer(pan, 0.8, () => {   // near bank + Company house with its flag
    cut(() => { ctx.beginPath(); ctx.moveTo(-400, 760); for (let x = -400; x <= 640; x += 40) ctx.lineTo(x, 744 + Math.sin(x * 0.02) * 6); ctx.quadraticCurveTo(820, 760, 900, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#C9B48C', { shadow: 0.6, edge: 4 });
    if (o.house !== false) { cut(P_rr(-40, 520, 300, 250, 4), '#E3D3B0', { shadow: 0.7, edge: 4 }); cut(P_poly([[-60, 524], [110, 440], [280, 524]]), '#8C6B4E', { shadow: 0.5, edge: 4 }); for (let i = 0; i < 3; i++) cut(P_rr(10 + i * 85, 590, 46, 70, 4), '#3E2C1E', { shadow: 0, edge: 2 }); flag('eic', 230, 450, 260, 0.75, t, eio(clamp(o.flagFall || 0))); }
  });
  nightWash(o.night || 0);
}
function palm(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-8, 0], [8, 0], [14, -200], [0, -200]]), '#6E5236', { shadow: 0.3, edge: 2 }); for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(6, -200); ctx.rotate(-2.6 + i * 0.5); cut(() => { ctx.beginPath(); ctx.ellipse(50, 0, 60, 14, 0, 0, TAU); }, P.forest, { shadow: 0.2, edge: 2 }); ctx.restore(); } ctx.restore(); }
/** a small, far-off flame (the only fire allowed on screen: distant, no people) */
export function farFlame(x, y, s, t, seed = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + 0.08 * Math.sin(t * 9 + seed)));
  const f = (w, h, c) => cut(() => { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(-w * 1.1, -h * 0.5, -w * 0.2 + Math.sin(t * 6 + seed) * 8, -h); ctx.quadraticCurveTo(w * 0.2, -h * 0.55, w * 0.5, -h * 0.75 + Math.sin(t * 7 + seed) * 6); ctx.quadraticCurveTo(w * 1.1, -h * 0.4, w, 0); ctx.closePath(); }, c, { shadow: 0.3, edge: 3 });
  f(70, 190, P.crimson); f(50, 140, '#E0782E'); f(28, 90, '#F2C14E');
  ctx.save(); ctx.globalAlpha = 0.5; cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-30, -250, 50], [20, -300, 60], [60, -350, 50]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } }, '#8F8578', { shadow: 0, edge: 3 }); ctx.restore();
  ctx.restore();
}
/** a river boat (budgerow) with a small flag */
export function boat(x, y, s = 1, kind = 'eic', t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-180, -30], [180, -30], [140, 30], [-140, 30]]), '#7A5234', { shadow: 0.6, edge: 4 });
  cut(P_rr(-80, -110, 140, 80, 8), '#E3D3B0', { shadow: 0.4, edge: 3 }); cut(P_poly([[-90, -110], [-10, -150], [70, -110]]), '#8C6B4E', { shadow: 0.3, edge: 3 });
  if (kind) flag(kind, 150, -30, 160, 0.4, t);
  ctx.restore();
}
/** a Mughal toll post on the river bank: a little hut with a green pennant and a striped bar */
export function tollGate(x, y, s = 1) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-60, -120, 120, 120, 4), '#E3D3B0', { shadow: 0.6, edge: 4 }); cut(() => { ctx.beginPath(); ctx.arc(0, -120, 64, Math.PI, TAU); ctx.closePath(); }, MUGHAL, { shadow: 0.4, edge: 3 });
  cut(P_rr(60, -70, 170, 18, 8), P.ink, { shadow: 0.4, edge: 3 }); for (let i = 0; i < 4; i++) { ctx.fillStyle = P.gold; ctx.fillRect(80 + i * 40, -70, 18, 18); }
  flag('mughal', -50, -170, 120, 0.35, 0);
  ctx.restore();
}

/** SEA (open water, horizon at y 420) with layered waves; draws ships via the shipsFn between wave layers */
export function sea(o = {}, shipsFn = null) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(31); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 860);
  layer(pan, 0.1, () => cut(P_circ(1550, 180, 60), '#EFC66A', { shadow: 0.3, edge: 4 }));
  for (let i = 0; i < 4; i++) {
    layer(pan, 0.3 + i * 0.2, () => cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 300); const y = 430 + i * 105; ctx.lineTo(-400, y); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 1.4 + i * 1.7) * 14); ctx.lineTo(W + 400, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.6, edge: 5 }));
    if (shipsFn) shipsFn(i);
  }
  nightWash(o.night || 0, 4, 380);
}
/** BOMBAY FORT on its island at night, ringed by Mughal ships. o = { t, ring 0..1 (ships close in), white 0..1 (white flag rises), night } */
export function bombayBlockade(o = {}) {
  const t = o.t || 0, ring = clamp(o.ring ?? 1);
  sea({ t, night: o.night ?? 0.8, pan: o.pan || 0 }, (i) => {
    if (i === 0) for (let k = 0; k < 4; k++) eastIndiaman(260 + k * 470, 470 + Math.sin(t + k) * 6, 0.32, 0, t, 'mughal');
    if (i === 1) {   // the island + fort
      cut(() => { ctx.beginPath(); ctx.ellipse(960, 640, 420, 70, 0, 0, TAU); }, '#B9A07A', { shadow: 0.7, edge: 4 });
      ctx.save(); ctx.translate(960, 600); ctx.scale(2.4, 2.4);
      cut(() => { ctx.beginPath(); ctx.moveTo(-90, 40); ctx.lineTo(-90, -30); for (let i2 = 0; i2 < 9; i2++) { const x0 = -90 + i2 * 20; ctx.lineTo(x0, -42); ctx.lineTo(x0 + 10, -42); ctx.lineTo(x0 + 10, -30); ctx.lineTo(x0 + 20, -30); } ctx.lineTo(90, 40); ctx.closePath(); }, P.stone, { shadow: 0.6, edge: 3 });
      ctx.fillStyle = '#F2C14E'; for (const x of [-50, 0, 50]) ctx.fillRect(x - 6, -12, 12, 16);
      ctx.restore();
      const wf = clamp(o.white || 0);
      if (wf > 0) flag('white', 1040, 520, 60 + 140 * eo(wf), 0.6, t); else flag('eic', 1040, 520, 200, 0.6, t);
    }
    if (i === 2) for (let k = 0; k < 2; k++) eastIndiaman(lerp(k ? 2200 : -300, k ? 1640 : 280, ring), 720 + Math.sin(t * 1.3 + k) * 6, 0.42, 0.02 * Math.sin(t + k), t, 'mughal');
  });
}
/** SIDI YAQUB on the prow of his flagship */
export function sidiOnProw(o = {}) {
  const t = o.t || 0;
  sea({ t, pan: o.pan || 0, night: o.night || 0 }, (i) => {
    if (i === 0) for (let k = 0; k < 3; k++) eastIndiaman(300 + k * 520, 470, 0.28, 0, t, 'mughal');
    if (i === 2) {
      ctx.save(); ctx.translate(820, 720 + Math.sin(t * 1.5) * 8); ctx.rotate(Math.sin(t * 1.2) * 0.015);
      eastIndiaman(0, 0, 1.15, 0, t, 'mughal');
      cast('sidi', { x: 300, y: -150, h: 360, arm: 55 });
      ctx.restore();
    }
  });
}
/** BENGAL THRONE CUSHION scene (cold open + loop): a dark wine backdrop, gold border */
export function cushionScene(o = {}) {
  parchment(37); cut(P_rr(-400, -400, W + 800, H + 800, 0), '#5E2A33', { shadow: 0, edge: 0 });
  ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.strokeRect(120, 120, W - 240, 700);
  for (let i = 0; i < 12; i++) { ctx.save(); ctx.globalAlpha = 0.12; sun(200 + i * 140, 470, 34, P.gold); ctx.restore(); }
}
