// Paper Atlas · PROPS for The English in India: flags, farman scrolls + the farman stack, chapter card, ships, money, small objects.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ, ribbon, slip, seal, label, parchment } from './kit.js';

export const MUGHAL = '#3F6B45';   // deep green (derived from forest), Mughal flags + seals
const CREAM = '#F3E9D2', SERIF = 'Caladea';

// ═════════ FLAGS (fixed for the whole video) ═════════
/** a flag on a pole. kind: 'eic' | 'mughal' | 'portugal' | 'dutch' | 'golconda' | 'spain' | 'france' | 'white'. x, y = pole foot; h = pole height; wave = time */
export function flag(kind, x, y, h = 300, s = 1, wave = 0, fall = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-fall * 1.35); ctx.scale(s, s);
  cut(P_rr(-6, -h, 12, h, 5), P.sepia, { shadow: 0.5, edge: 3 });
  const fw = 190, fh = 120; ctx.save(); ctx.translate(6, -h + 8);
  const shape = () => { ctx.beginPath(); ctx.moveTo(0, 0); for (let i = 0; i <= 10; i++) ctx.lineTo(i / 10 * fw, Math.sin(i * 0.7 + wave * 4) * 6 * i / 10); for (let i = 10; i >= 0; i--) ctx.lineTo(i / 10 * fw, fh + Math.sin(i * 0.7 + wave * 4) * 6 * i / 10); ctx.closePath(); };
  cut(shape, '#FFFFFF', { shadow: 0.5, edge: 3 });
  ctx.save(); shape(); ctx.clip(); flagFace(kind, fw, fh, wave); ctx.restore();
  ctx.restore(); ctx.restore();
}
function flagFace(kind, fw, fh) {
  const f = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y - 10, w, h + 20); };
  if (kind === 'eic') { for (let i = 0; i < 9; i++) f(i % 2 ? CREAM : P.crimson, 0, i * fh / 9, fw, fh / 9); f(CREAM, 0, 0, fw * 0.4, fh * 0.45); ctx.fillStyle = P.crimson; ctx.fillRect(fw * 0.17, -10, fw * 0.07, fh * 0.45 + 10); ctx.fillRect(0, fh * 0.19, fw * 0.4, fh * 0.07); }
  if (kind === 'mughal') { f(MUGHAL, 0, 0, fw, fh); sun(fw * 0.5, fh * 0.5, fh * 0.26, P.gold); }
  if (kind === 'portugal') { f(CREAM, 0, 0, fw, fh); ctx.fillStyle = P.royal; ctx.fillRect(fw * 0.42, -10, fw * 0.14, fh + 20); ctx.fillRect(0, fh * 0.42, fw, fh * 0.16); }
  if (kind === 'dutch') { f('#D9822B', 0, 0, fw, fh / 3); f(CREAM, 0, fh / 3, fw, fh / 3); f(P.royal, 0, 2 * fh / 3, fw, fh / 3); }
  if (kind === 'golconda') { f(P.royal, 0, 0, fw, fh); sun(fw * 0.5, fh * 0.5, fh * 0.24, P.gold, 8); }
  if (kind === 'spain') { f(P.crimson, 0, 0, fw, fh); ctx.strokeStyle = P.gold; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(fw * 0.2, fh * 0.1); ctx.lineTo(fw * 0.8, fh * 0.9); ctx.moveTo(fw * 0.8, fh * 0.1); ctx.lineTo(fw * 0.2, fh * 0.9); ctx.stroke(); }
  if (kind === 'france') { f(CREAM, 0, 0, fw, fh); fleur(fw * 0.5, fh * 0.52, 0.9, P.gold); }
  if (kind === 'white') f(CREAM, 0, 0, fw, fh);
  if (kind === 'union') { f(P.royal, 0, 0, fw, fh); ctx.strokeStyle = CREAM; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fw, fh); ctx.moveTo(fw, 0); ctx.lineTo(0, fh); ctx.stroke(); ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = CREAM; ctx.fillRect(fw * 0.42, -10, fw * 0.16, fh + 20); ctx.fillRect(0, fh * 0.36, fw, fh * 0.28); ctx.fillStyle = P.crimson; ctx.fillRect(fw * 0.46, -10, fw * 0.08, fh + 20); ctx.fillRect(0, fh * 0.42, fw, fh * 0.16); }
  if (kind === 'india') { f('#D9822B', 0, 0, fw, fh / 3); f(CREAM, 0, fh / 3, fw, fh / 3); f('#3F7A3A', 0, 2 * fh / 3, fw, fh / 3); ctx.strokeStyle = P.royal; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fw / 2, fh / 2, fh * 0.13, 0, TAU); for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; ctx.moveTo(fw / 2, fh / 2); ctx.lineTo(fw / 2 + Math.cos(a) * fh * 0.13, fh / 2 + Math.sin(a) * fh * 0.13); } ctx.stroke(); }
  if (kind === 'maratha') { f('#D9822B', 0, 0, fw, fh); }
  if (kind === 'tiger') { f(P.gold, 0, 0, fw, fh); ctx.fillStyle = P.ink; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(20 + i * 32, fh / 2 + (i % 2 ? -14 : 14), 8, 30, 0.3, 0, TAU); ctx.fill(); } }
  if (kind === 'sikh') { f('#D9822B', 0, 0, fw, fh); ctx.fillStyle = P.royal; ctx.beginPath(); ctx.arc(fw / 2, fh / 2, fh * 0.2, 0, TAU); ctx.fill(); }
}
/** gold sun disc with rays (the Mughal seal motif) */
export function sun(x, y, r, c = P.gold, n = 12) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = c; ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rr = i % 2 ? r * 0.72 : r * 1.25; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill(); circle(0, 0, r * 0.62, c); ctx.restore();
}
export function fleur(x, y, s = 1, c = P.gold) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c; ctx.beginPath();
  ctx.moveTo(0, -40); ctx.quadraticCurveTo(16, -20, 0, 10); ctx.quadraticCurveTo(-16, -20, 0, -40);
  ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-40, -30, -36, 4); ctx.quadraticCurveTo(-30, 18, -6, 10);
  ctx.moveTo(6, 0); ctx.quadraticCurveTo(40, -30, 36, 4); ctx.quadraticCurveTo(30, 18, 6, 10); ctx.fill();
  ctx.fillRect(-24, 10, 48, 8); ctx.beginPath(); ctx.moveTo(-10, 18); ctx.lineTo(0, 36); ctx.lineTo(10, 18); ctx.fill(); ctx.restore();
}

// ═════════ SEALS ═════════
/** a royal seal. style: 'mughal' (green wax, gold sun) | 'golconda' (royal, gold) | 'english' (red wax) */
export function royalSeal(x, y, s = 1, style = 'mughal', letter = '') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const base = style === 'mughal' ? MUGHAL : style === 'golconda' ? P.royal : P.crimson;
  cut(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = 90 + Math.sin(a * 9) * 7; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); }, base, { shadow: 0.7, edge: 0 });
  if (style === 'english') { ctx.restore(); seal(x, y, s, letter || 'R'); return; }
  ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.strokeStyle = P.gold; ctx.lineWidth = 6; ctx.stroke(); sun(0, 0, 34, P.gold);
  ctx.restore();
}

// ═════════ FARMANS ═════════
/** the five farmans of the video (seal style, scroll colour, year label) */
export const FARMANS = {
  jahangir: { year: '1613', by: 'JAHANGIR', seal: 'mughal', paper: CREAM },
  golconda: { year: '1632', by: 'GOLCONDA', seal: 'golconda', paper: '#EBCB7E' },
  shuja: { year: '1651', by: 'SHAH SHUJA', seal: 'mughal', paper: CREAM },
  aurangzeb: { year: '1691', by: 'AURANGZEB', seal: 'mughal', paper: CREAM },
  farrukhsiyar: { year: '1717', by: 'FARRUKHSIYAR', seal: 'mughal', paper: '#EBCB7E' },
};
FARMANS.diwani = { year: '1765', by: 'DIWANI', seal: 'mughal', paper: '#EBCB7E' };
FARMANS.act1858 = { year: '1858', by: 'ACT 1858', seal: 'english', paper: '#F3E9D2' };
FARMANS.act1947 = { year: '1947', by: 'ACT 1947', seal: 'english', paper: '#F3E9D2' };
export const FARMAN_ORDER = ['jahangir', 'golconda', 'shuja', 'aurangzeb', 'farrukhsiyar', 'diwani', 'act1858', 'act1947'];
/** an open farman: centred at (x, y), full width w, height h. p = unroll 0..1, stamp = 0..1 (seal drops in), lines = text lines (optional) */
export function farman(id, x, y, w, h, p = 1, stamp = 0, lines = null) {
  const F = FARMANS[id], ww = Math.max(40, w * eo(clamp(p)));
  ctx.save(); ctx.translate(x, y);
  cut(P_rr(-ww / 2, -h / 2, ww, h, 6), F.paper, { shadow: 0.9, edge: 4 });
  ctx.save(); ctx.beginPath(); ctx.rect(-ww / 2 + 30, -h / 2, ww - 60, h); ctx.clip();
  // calligraphy: ink lines that look like flowing script (not real words), or given text lines
  if (lines && lines.length < 2) { ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = 'rgba(62,44,30,0.7)'; ctx.lineWidth = 5; const rows = Math.floor((h - 160) / 46); for (let r = 0; r < rows; r++) { const yy = -h / 2 + 170 + r * 46; ctx.beginPath(); for (let xx = -w / 2 + 70; xx < w / 2 - 70; xx += 8) { const k = xx * 0.08 + r * 3.1; ctx.lineTo(xx, yy + Math.sin(k) * 7 + Math.sin(k * 2.7) * 4); } ctx.stroke(); } ctx.restore(); }
  if (lines) { ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((t, i) => { ctx.font = `700 ${t.size || 44}px ${SERIF}`; ctx.fillText(t.text, t.x || 0, -h / 2 + (t.y ?? 80 + i * 64)); }); }
  else { ctx.strokeStyle = 'rgba(62,44,30,0.7)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; const rows = Math.floor((h - 120) / 46); for (let r = 0; r < rows; r++) { const yy = -h / 2 + 70 + r * 46; ctx.beginPath(); for (let xx = -w / 2 + 70; xx < w / 2 - 70; xx += 8) { const k = xx * 0.08 + r * 3.1; ctx.lineTo(xx, yy + Math.sin(k) * 7 + Math.sin(k * 2.7) * 4 - (rnd(Math.floor(xx / 40) + r * 50) > 0.85 ? 14 : 0)); } ctx.stroke(); } }
  ctx.restore();
  for (const sx of [-ww / 2, ww / 2]) cut(P_rr(sx - 22, -h / 2 - 22, 44, h + 44, 22), F.paper === CREAM ? '#D9C7A0' : '#C8952F', { shadow: 0.7, edge: 4 });
  if (stamp > 0) { const k = stamp < 1 ? lerp(2.2, 1, eo(stamp)) : 1; ctx.save(); ctx.globalAlpha = clamp(stamp * 3); royalSeal(w / 2 - 150, h / 2 - 110, 0.7 * k, F.seal); ctx.restore(); }
  ctx.restore();
}
/** a rolled farman (for the stack): centred at (x, y), length L */
export function rolledFarman(id, x, y, L = 170, s = 1, rot = 0) {
  const F = FARMANS[id]; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_rr(-L / 2, -16, L, 32, 16), F.paper, { shadow: 0.6, edge: 3 });
  ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(-L / 2 + 14, -3, L - 28, 3);
  ctx.save(); ctx.translate(-L / 2 + 34, 0); ctx.scale(0.24, 0.24); royalSeal(0, 0, 1, F.seal); ctx.restore();
  ctx.font = `700 22px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(F.year, 22, 2);
  ctx.restore();
}
/** THE FARMAN STACK, screen-fixed top right below the era bar. n = how many farmans are on it (may be fractional while one lands) */
export const STACK = { x: 1712, y: 152, dy: 38 };
export function farmanStack(n) {
  const full = Math.floor(n + 1e-6);
  if (full <= 0) return;
  for (let i = 0; i < Math.min(full, 8); i++) rolledFarman(FARMAN_ORDER[i], STACK.x, STACK.y + i * STACK.dy, 170, 1, (rnd(i + 3) - 0.5) * 0.06);
}
/** a farman flying from an open position to its slot on the stack: p 0..1 */
export function farmanFly(idx, p, from = [960, 470], fromScale = 3.5) {
  const e = eio(clamp(p)), x = lerp(from[0], STACK.x, e), y = lerp(from[1], STACK.y + idx * STACK.dy, e) - Math.sin(e * Math.PI) * 120;
  rolledFarman(FARMAN_ORDER[idx], x, y, 170, lerp(fromScale, 1, e), (1 - e) * 0.4);
}

// ═════════ CHAPTER CARD (~1.6 s) ═════════
/** page turn, gold YEAR ribbon, hook-title slip, wax seal. lt = time into the card */
export function chapterCard(lt, year, title, n = 1) {
  parchment(40 + n);
  ctx.save(); ctx.strokeStyle = 'rgba(62,44,30,0.25)'; ctx.lineWidth = 3; ctx.strokeRect(70, 60, W - 140, H - 120); ctx.restore();
  label('CHAPTER ' + ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN'][n - 1], 960, 250, 34, P.sepia);
  ribbon(year, 960, 380, eob(seg(lt, 0.1, 0.45)), 120);
  const ts = eob(seg(lt, 0.35, 0.7)); if (ts > 0) slip(title, 960, 580, ts, -0.02, 72);
  const ss = seg(lt, 0.7, 0.85); if (ss > 0) { ctx.save(); ctx.globalAlpha = clamp(ss * 3); seal(1340, 650, lerp(1.6, 0.62, eo(ss)), 'E'); ctx.restore(); }
  // the page turn: a paper sheet sweeping away to the left over the first 0.35 s
  const pt = seg(lt, 0, 0.35); if (pt < 1) { const x = lerp(0, -W - 200, eio(pt)); ctx.save(); cut(P_poly([[x, -20], [x + W + 120, -20], [x + W - 60 + 200 * pt, H + 20], [x, H + 20]]), P.parch, { shadow: 1.2, edge: 6 }); ctx.restore(); }
}

// ═════════ SHIPS ═════════
/** an English East Indiaman: three masts, square sails, the Company ensign at the stern. tear 0..1 rips the sails (for the Portuguese fleet use kind) */
export function eastIndiaman(x, y, s = 1, rot = 0, t = 0, kind = 'eic', tear = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_poly([[-300, -70], [-250, -120], [260, -110], [320, -150], [300, -60], [220, 50], [-230, 50]]), '#7A5234');
  ctx.fillStyle = '#5A3E2B'; ctx.fillRect(-250, -40, 480, 16); for (let i = 0; i < 7; i++) { rr0(-200 + i * 62, -18, 22, 18); }
  const sailC = kind === 'portugal' ? CREAM : kind === 'spain' ? CREAM : '#F1E7D0';
  for (const [mx, mh, sw] of [[-150, 430, 150], [40, 520, 180], [210, 380, 130]]) {
    cut(P_rr(mx - 7, -70 - mh, 14, mh, 5), '#4A3426', { shadow: 0.4, edge: 3 });
    for (const [sy, k] of [[-70 - mh * 0.92, 0.75], [-70 - mh * 0.55, 1]]) {
      const w2 = sw * k, hh = mh * 0.3, bulge = 14 + Math.sin(t * 2 + mx) * 4;
      cut(() => { ctx.beginPath(); ctx.moveTo(mx - w2 / 2, sy); ctx.lineTo(mx + w2 / 2, sy); ctx.quadraticCurveTo(mx + w2 / 2 + bulge, sy + hh / 2, mx + w2 / 2 - 6, sy + hh); ctx.lineTo(mx - w2 / 2 + 6, sy + hh); ctx.quadraticCurveTo(mx - w2 / 2 - bulge, sy + hh / 2, mx - w2 / 2, sy); ctx.closePath(); }, sailC, { shadow: 0.5, edge: 3 });
      if (kind === 'portugal' && k === 1) { ctx.fillStyle = P.royal; ctx.fillRect(mx - 9, sy + 10, 18, hh - 20); ctx.fillRect(mx - w2 * 0.3, sy + hh * 0.42, w2 * 0.6, 16); }
      if (kind === 'spain' && k === 1) { ctx.strokeStyle = P.crimson; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(mx - w2 * 0.3, sy + 12); ctx.lineTo(mx + w2 * 0.3, sy + hh - 12); ctx.moveTo(mx + w2 * 0.3, sy + 12); ctx.lineTo(mx - w2 * 0.3, sy + hh - 12); ctx.stroke(); }
      if (tear > 0 && k === 1) { ctx.save(); ctx.fillStyle = P.sky; const tw = w2 * 0.5 * clamp(tear); ctx.beginPath(); ctx.moveTo(mx - tw / 2, sy + hh); for (let i = 0; i <= 6; i++) ctx.lineTo(mx - tw / 2 + i * tw / 6, sy + hh - (i % 2 ? hh * 0.6 : hh * 0.25) * clamp(tear)); ctx.closePath(); ctx.fill(); ctx.restore(); }
    }
  }
  if (kind === 'eic') flag('eic', 285, -140, 170, 0.55, t);
  if (kind === 'portugal') flag('portugal', 285, -140, 170, 0.55, t);
  if (kind === 'dutch') flag('dutch', 285, -140, 170, 0.55, t);
  if (kind === 'mughal') flag('mughal', 285, -140, 170, 0.55, t);
  if (kind === 'spain') flag('spain', 285, -140, 170, 0.55, t);
  ctx.restore();
}
function rr0(x, y, w, h) { ctx.fillStyle = '#2B2019'; ctx.fillRect(x, y, w, h); }

// ═════════ MONEY + SMALL THINGS ═════════
export function coin(x, y, r = 26, text = '', c = P.gold) { cut(P_circ(x, y, r), c, { shadow: 0.5, edge: 3 }); ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, TAU); ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; ctx.stroke(); if (text) { ctx.font = `700 ${r * 0.42}px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 2); } }
/** n coins in neat stacks starting at (x, y) */
export function coinStacks(x, y, n, per = 10, c = P.gold) { for (let i = 0; i < n; i++) { const st = Math.floor(i / per), k = i % per; cut(() => { ctx.beginPath(); ctx.ellipse(x + st * 74, y - k * 12, 32, 10, 0, 0, TAU); }, c, { shadow: 0.3, edge: 2 }); } }
export function moneybag(x, y, s = 1, text = '') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-40, -170); ctx.quadraticCurveTo(-170, -40, -120, 40); ctx.quadraticCurveTo(0, 90, 120, 40); ctx.quadraticCurveTo(170, -40, 40, -170); ctx.closePath(); }, '#B98A55');
  cut(P_poly([[-60, -170], [-80, -230], [-20, -200], [0, -240], [20, -200], [80, -230], [60, -170]]), '#B98A55', { shadow: 0.4, edge: 4 });
  cut(P_rr(-56, -182, 112, 22, 10), P.crimson, { shadow: 0.3, edge: 3 });
  if (text) { ctx.font = `700 58px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -20); }
  ctx.restore();
}
export function receipt(x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_rr(-170, -110, 340, 220, 6), CREAM, { shadow: 0.8, edge: 4 });
  ctx.font = `700 34px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText('RENT · BOMBAY', 0, -54);
  ctx.font = `700 96px ${SERIF}`; ctx.fillStyle = P.crimson; ctx.fillText('£10', 0, 40);
  ctx.font = `700 26px ${SERIF}`; ctx.fillStyle = P.sepia; ctx.fillText('per annum · 1668', 0, 86);
  ctx.restore();
}
/** rice jar: level 0..1 */
export function riceJar(x, y, s = 1, level = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, -200); ctx.quadraticCurveTo(-140, -120, -110, 0); ctx.lineTo(110, 0); ctx.quadraticCurveTo(140, -120, 60, -200); ctx.closePath(); }, '#A86F45');
  if (level > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(-60, -200); ctx.quadraticCurveTo(-140, -120, -110, 0); ctx.lineTo(110, 0); ctx.quadraticCurveTo(140, -120, 60, -200); ctx.clip(); ctx.fillStyle = 'rgba(245,238,221,0.9)'; ctx.fillRect(-150, -190 * level, 300, 200); ctx.restore(); }
  cut(P_rr(-70, -222, 140, 26, 10), '#8C5A38', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** the Bengal throne cushion (cold open + loop) with a turban; turbanY = how far above the cushion the turban hangs (0 = set down) */
export function cushion(x, y, s = 1, turban = true, turbanY = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-220, -40, 440, 90, 40), P.wine); ctx.fillStyle = P.gold; for (let i = 0; i < 9; i++) circle(-200 + i * 50, 50, 8, P.gold);
  cut(P_rr(-180, -150, 70, 120, 30), P.wine, { shadow: 0.5, edge: 4 });
  if (turban) turbanProp(30, -80 - turbanY, 1);
  ctx.restore();
}
/** the royal turban (a prop): centred at x, y */
export function turbanProp(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 100, 60, 0, Math.PI, TAU); ctx.lineTo(100, 30); ctx.lineTo(-100, 30); ctx.closePath(); }, P.gold); ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-90, 20 - i * 18); ctx.quadraticCurveTo(0, -10 - i * 20, 90, 20 - i * 18); ctx.stroke(); } cut(P_poly([[20, -60], [36, -36], [20, -12], [4, -36]]), P.crimson, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** an English hand/cuff reaching in from the right (holding something at its fingertips at (x, y)) */
export function englishHand(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(40, -30, 700, 70, 30), P.crimson, { shadow: 0.7, edge: 4 }); cut(P_rr(20, -40, 60, 90, 14), '#F5EEDD', { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(-10, 6, 52, 34, 0, 0, TAU); }, '#E3B98F');
  ctx.restore();
}
