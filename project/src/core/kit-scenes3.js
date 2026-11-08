// Paper Atlas · PART TWO scenes (1717-1947). Same rules: cut paper, layers, ground at or above y 800, no violence on screen.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ, parchment, label, slip, ribbon, seal } from './kit.js';
import { person, cast, SKIN, horse } from './kit-cast.js';
import { flag, coin, sun, MUGHAL, moneybag } from './kit-props.js';
import { layer, nightWash } from './kit-scenes.js';

const CREAM = '#F3E9D2', RED_SAND = '#B5654A', RED_D = '#8E4A36';
const crowdFigure = (x, y, h, k, o = {}) => person({ x, y, h, skin: [SKIN.in, SKIN.in2, SKIN.eu][k % 3 === 2 ? 0 : k % 2], legs: k % 3 ? 'trousers' : 'robe', legC: '#EFE4CC', coat: k % 3 ? 'jama' : 'robe', coatC: ['#EFE4CC', '#D9C49A', P.forest, P.royal, '#B98A55'][k % 5], patka: P.gold, beard: k % 2 ? 'mous' : null, hat: k % 4 === 3 ? null : 'turban', hatC: ['#EFE4CC', '#D9822B', P.gold, P.crimson][k % 4], ...o });

/** PARLIAMENT: green benches, a mace table, the Speaker's chair */
export function parliament(o = {}) {
  parchment(71); cut(P_rr(-400, -100, W + 800, 900, 0), '#8C6B4E', { shadow: 0, edge: 0 });
  for (let i = 0; i < 9; i++) cut(P_rr(-200 + i * 280, 150, 200, 380, 100), '#7A5A40', { shadow: 0.3, edge: 3 });
  cut(P_rr(860, 260, 200, 420, 20), '#5A3E2B', { shadow: 0.7, edge: 4 }); cut(P_poly([[840, 270], [960, 180], [1080, 270]]), '#5A3E2B', { shadow: 0.5, edge: 4 });
  for (const [y, w] of [[620, 1]]) for (const sx of [-1, 1]) for (let r = 0; r < 3; r++) cut(P_rr(sx < 0 ? 40 : 1180, y + r * 50 - 60, 700, 36, 10), '#4F6D4A', { shadow: 0.5, edge: 3 });
  cut(P_rr(-400, 800, W + 800, 400, 0), '#5A3E2B', { shadow: 0, edge: 0 });
  cut(P_rr(800, 690, 320, 50, 6), '#7A5234', { shadow: 0.6, edge: 3 });
}
/** an open ledger whose columns fill as p goes 0..1 */
export function ledger(x, y, s = 1, p = 1, red = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-420, -260, 840, 520, 12), '#4A3426', { shadow: 0.9, edge: 5 });
  for (const sx of [-1, 1]) cut(P_rr(sx < 0 ? -400 : 10, -240, 390, 480, 6), CREAM, { shadow: 0, edge: 3 });
  const rows = 12, n = Math.floor(rows * 2 * clamp(p));
  for (let k = 0; k < n; k++) { const col = k < rows ? -1 : 1, r = k % rows, yy = -210 + r * 36; ctx.fillStyle = 'rgba(62,44,30,0.6)'; ctx.fillRect(col < 0 ? -370 : 40, yy, 200, 6); ctx.fillStyle = red ? P.crimson : 'rgba(62,44,30,0.8)'; ctx.fillRect(col < 0 ? -110 : 300, yy - 4, 70, 10); }
  ctx.restore();
}
/** EMPTY FIELD under a grey sky: cracked earth, a dry tree, an empty pot (the famine, no people) */
export function emptyField(o = {}) {
  const pan = o.pan || 0;
  parchment(73); ctx.fillStyle = '#C9C3B4'; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.2, () => { for (let i = 0; i < 5; i++) cut(() => { ctx.beginPath(); ctx.ellipse(100 + i * 440, 180 + (i % 2) * 50, 240, 60, 0, 0, TAU); }, '#B6AFA0', { shadow: 0.2, edge: 3 }); });
  layer(pan, 0.4, () => { cut(() => { ctx.beginPath(); ctx.moveTo(-400, 520); for (let x = -400; x <= W + 400; x += 60) ctx.lineTo(x, 510 + Math.sin(x * 0.006) * 14); ctx.lineTo(W + 400, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#C8AE7E', { shadow: 0.4, edge: 4 });
    ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = 560 + rnd(i + 3) * 240; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30 + rnd(i + 5) * 40, y + (rnd(i + 7) - 0.5) * 30); ctx.lineTo(x + 50, y + 20); ctx.stroke(); } });
  layer(pan, 0.7, () => { // dry tree + pot
    cut(P_poly([[1380, 800], [1400, 520], [1420, 800]]), '#5A3E2B', { shadow: 0.5, edge: 3 });
    for (const [a, l] of [[-0.9, 160], [-0.4, 200], [0.5, 150], [0.95, 120]]) { ctx.save(); ctx.translate(1400, 600); ctx.rotate(a); cut(P_rr(-6, -l, 12, l, 6), '#5A3E2B', { shadow: 0.3, edge: 2 }); ctx.restore(); }
    cut(() => { ctx.beginPath(); ctx.moveTo(470, 800); ctx.quadraticCurveTo(390, 730, 440, 660); ctx.lineTo(560, 660); ctx.quadraticCurveTo(610, 730, 530, 800); ctx.closePath(); }, '#A86F45', { shadow: 0.6, edge: 4 });
    line([[470, 690], [500, 720], [490, 760]], '#3E2C1E', 3);
  });
}
/** a paper steam train crossing the frame (x = engine front), with puffs */
export function train(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let c = 1; c <= 4; c++) { const cx = -c * 270; cut(P_rr(cx - 120, -150, 240, 130, 8), c % 2 ? '#7A2E3A' : '#5A3E2B', { shadow: 0.6, edge: 4 }); for (let w = 0; w < 3; w++) cut(P_rr(cx - 95 + w * 70, -125, 44, 40, 4), '#E9DCBC', { shadow: 0, edge: 2 }); for (const wx of [-70, 70]) cut(P_circ(cx + wx, -10, 26), '#2B2019', { shadow: 0.3, edge: 3 }); }
  cut(P_rr(-160, -170, 260, 150, 10), '#2B2019', { shadow: 0.7, edge: 4 }); cut(P_rr(20, -260, 50, 100, 6), '#2B2019', { shadow: 0.5, edge: 3 }); cut(P_rr(-160, -230, 110, 80, 6), '#3E2C1E', { shadow: 0.4, edge: 3 });
  cut(P_poly([[100, -40], [160, -10], [100, -10]]), P.crimson, { shadow: 0.3, edge: 3 });
  for (const wx of [-110, -30, 50]) { cut(P_circ(wx, -10, 34), '#2B2019', { shadow: 0.3, edge: 3 }); circle(wx, -10, 10, P.gold); }
  for (let k = 0; k < 4; k++) { const py = -300 - k * 70, px = 45 - k * 90 - (t * 60 % 90); ctx.save(); ctx.globalAlpha = 0.7 - k * 0.15; cut(P_circ(px, py, 40 + k * 14), '#E9E2D2', { shadow: 0.2, edge: 3 }); ctx.restore(); }
  ctx.restore();
}
/** RED FORT gate (Delhi): red sandstone wall, a gate with an arch, two kiosks */
export function redFort(o = {}) {
  const pan = o.pan || 0;
  parchment(77); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.4, () => {
    cut(P_rr(-400, 360, W + 800, 440, 0), RED_SAND, { shadow: 0.5, edge: 4 }); for (let x = -380; x < W + 380; x += 80) cut(P_rr(x, 330, 50, 40, 4), RED_SAND, { shadow: 0.3, edge: 3 });
    cut(P_rr(760, 220, 400, 580, 6), RED_D, { shadow: 0.7, edge: 4 }); cut(() => { ctx.beginPath(); ctx.moveTo(870, 800); ctx.lineTo(870, 520); ctx.quadraticCurveTo(960, 400, 1050, 520); ctx.lineTo(1050, 800); ctx.closePath(); }, '#3E2C1E', { shadow: 0, edge: 3 });
    for (const kx of [800, 1120]) { cut(P_rr(kx - 40, 150, 80, 80, 4), '#F1E7D0', { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.arc(kx, 150, 46, Math.PI, TAU); ctx.closePath(); }, '#F1E7D0', { shadow: 0.4, edge: 3 }); }
    if (o.flagKind) flag(o.flagKind, 960, 150, 200, 0.7, o.t || 0, o.flagFall || 0);
  });
  cut(P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 });
  nightWash(o.night || 0);
}
/** JHANSI FORT ramparts on a hill, the Rani beside her horse, sword sheathed */
export function jhansiFort(o = {}) {
  const pan = o.pan || 0, t = o.t || 0;
  parchment(79); ctx.fillStyle = '#E7D2A8'; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.3, () => { cut(() => { ctx.beginPath(); ctx.moveTo(-400, 620); ctx.quadraticCurveTo(700, 320, 1700, 560); ctx.lineTo(W + 400, 620); ctx.lineTo(W + 400, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#B9A07A', { shadow: 0.5, edge: 4 });
    cut(P_rr(300, 300, 1100, 200, 4), P.stone, { shadow: 0.6, edge: 4 }); for (let x = 300; x < 1400; x += 60) cut(P_rr(x, 270, 36, 36, 3), P.stone, { shadow: 0.3, edge: 2 });
    for (const bx of [300, 860, 1360]) cut(P_rr(bx - 40, 230, 120, 270, 8), P.stoneDark, { shadow: 0.5, edge: 3 });
    flag('maratha', 900, 230, 200, 0.6, t);
  });
  layer(pan, 0.7, () => { cut(P_rr(-400, 760, W + 800, 400, 0), '#C9B48C', { shadow: 0.5, edge: 4 }); horse(760, 800, 0.62, 0); cast('lakshmibai', { x: 1060, y: 800, h: 430, dir: -1, arm: 15 }); });
}
/** a seated Raja receiving a treaty (subsidiary alliance) */
export function palaceCourtyard(o = {}) {
  parchment(81); cut(P_rr(-400, -100, W + 800, 900, 0), '#D9B98A', { shadow: 0, edge: 0 });
  for (let i = 0; i < 6; i++) cut(() => { const x = 100 + i * 340; ctx.beginPath(); ctx.moveTo(x - 110, 800); ctx.lineTo(x - 110, 380); ctx.quadraticCurveTo(x, 250, x + 110, 380); ctx.lineTo(x + 110, 800); ctx.closePath(); }, '#B98A55', { shadow: 0, edge: 0 });
  cut(P_rr(-400, 800, W + 800, 400, 0), '#A88A55', { shadow: 0, edge: 0 });
  person({ x: 1300, y: 760, h: 300, dir: -1, seated: 1, skin: SKIN.in, legs: 'trousers', legC: '#EFE4CC', coat: 'jama', coatC: '#E9CF8E', patka: P.crimson, beard: 'full', hat: 'turban', hatC: P.crimson, jewel: P.gold, pearls: 1 });
  cut(P_rr(1150, 760, 300, 40, 8), P.wine, { shadow: 0.5, edge: 3 });
}
/** a column of Company soldiers marching in (k 0..1 how far) */
export function soldiersMarch(k, t = 0, n = 5, x0 = -300, x1 = 820) {
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, eio(clamp(k))) - i * 120; person({ x, y: 800, h: 300, legs: 'trousers', legC: '#F5EEDD', coat: 'doublet', coatC: P.crimson, trim: '#F5EEDD', hat: 'tall', hatC: '#2B2019', walk: k < 1 ? t * 7 + i : null }); }
}
/** a rubber-stamp coming down on a word (p 0..1) */
export function stamp(text, x, y, p = 1, s = 1, color = P.crimson) {
  if (p <= 0) return; const k = p < 1 ? lerp(2.2, 1, eo(p)) : 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.12); ctx.scale(s * k, s * k); ctx.globalAlpha = clamp(p * 3);
  ctx.font = '700 64px Caladea'; const w = ctx.measureText(text).width + 60; ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.strokeRect(-w / 2, -50, w, 100); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  ctx.restore();
}
/** a simple paper elephant (durbar) */
export function elephant(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-90, -40, 50, 100]) cut(P_rr(lx - 24, -170, 48, 170, 16), '#8F8578', { shadow: 0.5, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -220, 170, 110, 0, 0, TAU); }, '#9C9284', { shadow: 0.7, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(170, -250, 70, 80, 0, 0, TAU); }, '#9C9284', { shadow: 0.4, edge: 4 });
  cut(P_poly([[220, -230], [250, -100], [230, -40], [210, -40], [215, -110], [195, -220]]), '#9C9284', { shadow: 0.4, edge: 3 });
  cut(P_rr(-120, -360, 200, 90, 10), P.crimson, { shadow: 0.4, edge: 3 }); ctx.fillStyle = P.gold; ctx.fillRect(-120, -290, 200, 12);
  ctx.restore();
}
/** CONGRESS HALL 1885: a long table, delegates seated on both sides */
export function congressHall(o = {}) {
  parchment(83); cut(P_rr(-400, -100, W + 800, 900, 0), '#C9B48C', { shadow: 0, edge: 0 });
  for (let i = 0; i < 5; i++) cut(P_rr(80 + i * 380, 140, 200, 360, 100), '#E3D3B0', { shadow: 0.3, edge: 3 });
  slip('1885 · BOMBAY', 960, 230, 0.8, -0.02, 44);
  cut(P_rr(-400, 800, W + 800, 400, 0), '#8C6B4E', { shadow: 0, edge: 0 });
  for (let i = 0; i < 6; i++) crowdFigure(330 + i * 250, 800, 400, i, { dir: i % 2 ? -1 : 1, legs: 'trousers', coat: i % 2 ? 'long' : 'jama', coatC: i % 2 ? '#2B2019' : '#EFE4CC' });
  cut(P_rr(240, 640, 1440, 46, 8), '#5A3E2B', { shadow: 0.7, edge: 4 }); cut(P_rr(260, 686, 1400, 120, 0), '#6E4A33', { shadow: 0.3, edge: 3 });
  for (let i = 0; i < 6; i++) cut(P_rr(320 + i * 230, 610, 90, 30, 3), CREAM, { shadow: 0.3, edge: 2 });
}
/** a spinning wheel (charkha), turning with t */
export function charkha(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-200, -20, 400, 30, 8), '#7A5234', { shadow: 0.6, edge: 3 }); cut(P_rr(-110, -200, 20, 190, 6), '#7A5234', { shadow: 0.4, edge: 3 });
  ctx.save(); ctx.translate(-100, -200); ctx.rotate(t * 2); ctx.strokeStyle = '#5A3E2B'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.stroke(); for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * TAU / 8) * 120, Math.sin(i * TAU / 8) * 120); ctx.stroke(); } ctx.restore();
  line([[-100, -320], [150, -60]], '#EFE4CC', 3); cut(P_rr(130, -80, 60, 40, 6), '#EFE4CC', { shadow: 0.3, edge: 2 });
  ctx.restore();
}
/** JALLIANWALA BAGH: the walled garden, empty, at dusk; one narrow entrance; the well; a small memorial flame (m 0..1) */
export function jallianwala(o = {}) {
  const pan = o.pan || 0;
  parchment(85); ctx.fillStyle = '#D8C3B4'; ctx.fillRect(-400, -400, W + 800, 900);
  layer(pan, 0.3, () => { for (let i = 0; i < 9; i++) cut(P_rr(-200 + i * 260, 230 - (i % 3) * 40, 220, 300 + (i % 3) * 40, 3), '#B9A07A', { shadow: 0.3, edge: 3 }); });
  layer(pan, 0.5, () => {
    cut(P_rr(-400, 470, W + 800, 330, 0), '#A88A55', { shadow: 0.5, edge: 4 });
    cut(P_rr(880, 560, 90, 240, 4), '#3E2C1E', { shadow: 0, edge: 3 }); slip('THE ONLY WAY OUT', 925, 520, o.exit || 0, -0.02, 30);
    for (const tx of [300, 1500, 1700]) { cut(P_rr(tx - 10, 520, 20, 120, 4), '#5A3E2B', { shadow: 0.3, edge: 2 }); cut(P_circ(tx, 500, 70), P.forest, { shadow: 0.4, edge: 3 }); }
  });
  layer(pan, 0.8, () => { cut(P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 });
    cut(() => { ctx.beginPath(); ctx.ellipse(560, 770, 110, 34, 0, 0, TAU); }, P.stone, { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(560, 770, 80, 20, 0, 0, TAU); }, '#3E2C1E', { shadow: 0, edge: 2 });
    if (o.m > 0) { const k = eob(clamp(o.m)); ctx.save(); ctx.translate(1240, 800); ctx.scale(k, k); cut(P_rr(-60, -60, 120, 60, 4), P.stone, { shadow: 0.5, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(-14, -60); ctx.quadraticCurveTo(-20, -100, 0, -130 + Math.sin((o.t || 0) * 6) * 4); ctx.quadraticCurveTo(20, -100, 14, -60); ctx.closePath(); }, '#F2C14E', { shadow: 0.3, edge: 2 }); ctx.restore(); }
  });
  nightWash(o.night ?? 0.45);
}
/** newspapers fluttering in (generic mastheads: no real paper names) */
export function newspapers(p, t = 0) {
  parchment(87); const names = ['DAILY NEWS', 'THE GAZETTE', 'LE JOURNAL', 'MORNING POST', 'THE CHRONICLE', 'EVENING STAR'];
  names.forEach((n, i) => { const k = eob(clamp(p * 6 - i * 0.8)); if (k <= 0) return; const x = 300 + (i % 3) * 540, y = 290 + Math.floor(i / 3) * 320; ctx.save(); ctx.translate(x, y); ctx.rotate((rnd(i) - 0.5) * 0.3 + Math.sin(t * 2 + i) * 0.02); ctx.scale(k * 0.85, k * 0.85);
    cut(P_rr(-250, -150, 500, 300, 4), CREAM, { shadow: 0.8, edge: 4 }); ctx.font = '700 40px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText(n, 0, -100); ctx.fillRect(-220, -80, 440, 4);
    ctx.font = '700 34px Caladea'; ctx.fillStyle = P.crimson; ctx.fillText('GANDHI MARCHES TO THE SEA', 0, -30, 460); for (let r = 0; r < 4; r++) { ctx.fillStyle = 'rgba(62,44,30,0.4)'; ctx.fillRect(-220, 10 + r * 30, 440, 6); } ctx.restore(); });
}
/** a crowd of cut-out figures with a banner (peaceful) */
export function crowdBanner(text, o = {}) {
  parchment(o.seed || 89); ctx.fillStyle = o.sky || P.sky; ctx.fillRect(-400, -400, W + 800, 900); cut(P_rr(-400, 760, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 });
  for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) crowdFigure(80 + i * 220 + r * 110, 780 + r * 20, 260 + r * 30, i + r * 3, { arm: (i + r) % 3 === 0 ? 70 : 0, walk: o.walk ? (o.t || 0) * 5 + i : null });
  const k = eob(clamp(o.banner ?? 1)); if (k > 0) { ctx.save(); ctx.translate(960, 330); ctx.scale(k, k); cut(P_rr(-460, -80, 920, 160, 6), CREAM, { shadow: 0.8, edge: 5 }); ctx.font = '700 96px Caladea'; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); for (const sx of [-420, 420]) cut(P_rr(sx - 8, -80, 16, 420, 4), '#5A3E2B', { shadow: 0.4, edge: 2 }); ctx.restore(); }
}
/** prison bars over a dark cell with silhouettes */
export function prison(o = {}) {
  parchment(91); cut(P_rr(-400, -400, W + 800, H + 800, 0), '#5A5048', { shadow: 0, edge: 0 });
  cast('gandhi', { x: 760, y: 800, h: 420, seated: 1 }); cast('nehru', { x: 1120, y: 800, h: 430, dir: -1 });
  ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#1E1A16'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
  for (let x = 120; x < W; x += 140) cut(P_rr(x, -40, 26, 900, 10), '#2B2019', { shadow: 0.6, edge: 3 });
  cut(P_rr(-40, 150, W + 80, 26, 10), '#2B2019', { shadow: 0.5, edge: 3 }); cut(P_rr(-40, 640, W + 80, 26, 10), '#2B2019', { shadow: 0.5, edge: 3 });
}
/** families walking with bundles across a paper landscape (Partition; dignified, no violence). k = scroll */
export function refugees(k = 0, t = 0) {
  parchment(93); ctx.fillStyle = '#E3CFA8'; ctx.fillRect(-400, -400, W + 800, 900);
  cut(() => { ctx.beginPath(); ctx.moveTo(-400, 560); for (let x = -400; x <= W + 400; x += 80) ctx.lineTo(x, 540 + Math.sin(x * 0.004) * 30); ctx.lineTo(W + 400, H + 300); ctx.lineTo(-400, H + 300); ctx.closePath(); }, '#C9B48C', { shadow: 0.4, edge: 4 });
  for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const x = ((i * 260 + r * 130 + k * 260) % (W + 520)) - 260, y = 690 + r * 70, h = 220 + r * 40; if (x > 1330) continue;
    crowdFigure(x, y, h, i + r * 4, { walk: t * 4 + i, arm: 30 }); cut(() => { ctx.beginPath(); ctx.ellipse(x + 10, y - h * 0.95, h * 0.16, h * 0.11, 0, 0, TAU); }, ['#B98A55', '#EFE4CC', '#8C6B4E'][i % 3], { shadow: 0.4, edge: 3 }); }
}
/** MIDNIGHT: night sky, a pole; the Union flag lowers (d 0..1) and the Indian flag rises (u 0..1); a clock at 12 */
export function midnightFlags(d = 0, u = 0, t = 0) {
  parchment(95); cut(P_rr(-400, -400, W + 800, H + 800, 0), '#2F3550', { shadow: 0, edge: 0 });
  for (let i = 0; i < 60; i++) circle(rnd(i + 3) * W, rnd(i + 70) * 640, 2 + rnd(i) * 3, '#E9DCBC');
  cut(P_rr(-400, 760, W + 800, 400, 0), '#3E3A48', { shadow: 0, edge: 0 }); cut(P_rr(940, 140, 22, 640, 6), '#C9B48C', { shadow: 0.6, edge: 3 });
  if (d < 1) { ctx.save(); ctx.globalAlpha = 1 - clamp((d - 0.8) * 5); flag('union', 950, lerp(320, 760, eio(d)), 0, 1.1, t); ctx.restore(); }
  if (u > 0) flag('india', 950, lerp(760, 320, eio(u)), 0, 1.1, t);
  ctx.save(); ctx.translate(1340, 330); cut(P_circ(0, 0, 130), CREAM, { shadow: 0.8, edge: 5 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -95); ctx.moveTo(0, 0); ctx.lineTo(0, -70); ctx.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circle(Math.sin(a) * 108, -Math.cos(a) * 108, 6, P.ink); } ctx.restore();
}
/** the FINAL card: 1600 -> 1947 (bottom-right kept clear) */
export function finalCard(lt) {
  parchment(97);
  const rs = eob(seg(lt, 0, 0.4)); ribbon('1600        1947', 760, 300, rs, 100); if (rs > 0) { ctx.save(); ctx.translate(760, 306); ctx.scale(rs, rs); cut(P_poly([[-60, -10], [30, -10], [30, -30], [70, 0], [30, 30], [30, 10], [-60, 10]]), P.ink, { shadow: 0, edge: 0 }); ctx.restore(); }
  slip('FROM MERCHANTS TO MASTERS', 760, 480, eob(seg(lt, 0.3, 0.7)), -0.02, 64);
  label('THE ENGLISH IN INDIA', 760, 620, 36, P.sepia);
  const f = eob(seg(lt, 0.6, 1.0)); if (f > 0) { flag('india', 560, 800, 120, 0.7 * f, lt); flag('eic', 900, 800, 120, 0.5 * f, lt); }
}

/** a small army TOKEN for maps: a flag over two rows of tiny soldiers. kind 'eic' (red coats) | 'france' (blue) | others */
export function armyToken(x, y, kind, s = 1, t = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s);
  const coat = kind === 'eic' ? P.crimson : kind === 'france' ? '#2C4A8A' : kind === 'bengal' ? '#2E5A3A' : kind === 'oudh' ? '#2C3E5A' : '#E9DCC0';
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const sx = -48 + c * 30 + r * 14, sy = r * 22; cut(P_rr(sx - 8, sy - 22, 16, 26, 4), coat, { shadow: 0.3, edge: 2 }); circle(sx, sy - 30, 7, '#E8C9A0'); }
  flag(kind, 40, 10, 110, 0.45, t);
  ctx.restore();
}

/** PLASSEY, 23 June 1757: two armies drawn up in formation, facing each other across the field by the mango grove (no fighting).
 *  o = { t, show 0..1 (the armies form up), aside 0..1 (Mir Jafar's division turns and marches away), nawab: flag kind } */
export function armyField(o = {}) {
  const t = o.t || 0, show = o.show ?? 1, aside = o.aside || 0, nf = o.nawab || 'bengal';
  parchment(98); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  cut(P_rr(-400, 470, W + 800, 800, 0), '#A9B48A', { shadow: 0.4, edge: 4 });
  for (let k = 0; k < 9; k++) { const x = 60 + k * 230; cut(P_rr(x - 9, 400, 18, 90, 4), '#5A3E2B', { shadow: 0.3, edge: 2 }); cut(P_circ(x, 385, 62), P.forest, { shadow: 0.4, edge: 3 }); }
  const sold = (x, y, dir, coatC, hatC, hat, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); person({ x, y, h: 170, dir, legs: 'trousers', legC: '#F5EEDD', coat: hat === 'tall' ? 'doublet' : 'jama', coatC, trim: '#F5EEDD', hat, hatC, beard: hat === 'tall' ? null : 'mous' }); ctx.restore(); };
  // the Nawab's army (right): elephants behind, three ranks; the right-hand division (Mir Jafar's) marches off when aside > 0
  for (const [ex, ey] of [[1330, 640], [1640, 650]]) { ctx.save(); ctx.globalAlpha = clamp(show * 2); elephant(ex, ey, 0.42); ctx.restore(); }
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
    const x0 = 1080 + c * 110 + r * 30, y = 680 + r * 60, jaf = c >= 4, a = clamp(show * 4 - (6 - c) * 0.3);
    const dx = jaf ? aside * 900 : 0;
    sold(x0 + dx, y, jaf && aside > 0.05 ? 1 : -1, r % 2 ? '#2E5A3A' : '#EFE4CC', r % 2 ? '#EFE4CC' : '#D9A441', 'turban', a);
  }
  for (const [fx, jaf] of [[1150, 0], [1400, 0], [1650, 1]]) flag(nf, fx + (jaf ? aside * 900 : 0), 700, 300, 0.55 * eob(clamp(show * 3)), t + fx);
  // the Company's army (left): fewer, red coats, three ranks, two cannon (silent)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) sold(160 + c * 110 + r * 30, 680 + r * 60, 1, P.crimson, '#2B2019', 'tall', clamp(show * 4 - c * 0.3));
  for (const cx of [760, 860]) { cut(P_rr(cx - 40, 790, 90, 22, 8), '#3E2C1E', { shadow: 0.4, edge: 2 }); circle(cx - 10, 820, 18, '#5A3E2B'); }
  for (const fx of [200, 520]) flag('eic', fx, 700, 300, 0.55 * eob(clamp(show * 3)), t + fx);
}

/** the BANKER's room: Jagat Seth on a white gaddi with his ledger; money bags slide across to a Company official. p 0..1 */
export function bankerRoom(p = 0, t = 0) {
  parchment(97); cut(P_rr(-400, -400, W + 800, 1200, 0), '#E6D2A8', { shadow: 0, edge: 0 });
  for (let i = 0; i < 5; i++) { const x = 220 + i * 370; cut(() => { ctx.beginPath(); ctx.moveTo(x - 110, 700); ctx.lineTo(x - 110, 330); ctx.quadraticCurveTo(x, 200, x + 110, 330); ctx.lineTo(x + 110, 700); ctx.closePath(); }, '#C9A97A', { shadow: 0.3, edge: 3 }); }
  cut(P_rr(-400, 800, W + 800, 400, 0), '#B98A66', { shadow: 0, edge: 0 });
  cut(P_rr(260, 680, 640, 120, 14), '#F7F1E3', { shadow: 0.7, edge: 4 }); cut(P_rr(270, 600, 90, 110, 40), P.crimson, { shadow: 0.5, edge: 3 });
  cast('jagatseth', { x: 520, y: 700, h: 330, seated: 1, arm: 30 * eio(clamp(p * 2)) });
  for (let k = 0; k < 4; k++) { const q = eio(clamp(p * 2.2 - k * 0.3)); moneybag(lerp(720, 1180 + k * 70, q), 800 - Math.sin(q * Math.PI) * 60, 0.42, ''); }
  person({ x: 1500, y: 800, h: 430, dir: -1, legs: 'hose', legC: '#F5EEDD', coat: 'long', coatC: P.crimson, trim: P.gold, buttons: 1, collar: 'band', hair: 'wig', hairC: '#E9E2D2', hat: 'tricorne', arm: 35 });
}
