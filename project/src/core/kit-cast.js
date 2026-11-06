// Paper Atlas · THE CAST (English in India). Period figures as cut paper; caricature by costume and props, never by face.
// person(o) draws any figure; CAST holds the 16 fixed designs so everyone stays on model:  K.cast('roe', { x, y, h, bow, arm, walk, dir }).
// Units: a figure is 640 tall standing on (0, 0); the hip pivot is at y -250, so a bow bends at the WAIST (legs stay planted).
import { ctx, TAU, clamp, lerp, rnd, circle } from './lib.js';
import { P } from './palette.js';
import { cut, P_rr, P_poly, P_circ } from './kit.js';

const rad = (d) => d * Math.PI / 180;
export const SKIN = { eu: '#E3B98F', in: '#B98256', in2: '#A86F45', af: '#6E4A33' };
const CREAM = '#EFE4CC', BLACK = '#2B2019', GREY = '#9A9184', WIGC = '#7A6248', WHITE = '#F5EEDD';

function arm(x, rot, colour, len = 220, cuff = null) {
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(x, -440); ctx.rotate(rot); ctx.roundRect(-19, 0, 38, len, 19); ctx.restore(); }, colour, { shadow: 0.5, edge: 4 });
  ctx.save(); ctx.translate(x, -440); ctx.rotate(rot); if (cuff) { ctx.fillStyle = cuff; ctx.fillRect(-19, len - 40, 38, 14); } circle(0, len - 6, 17, ctx._skin); ctx.restore();
}
/** where the front hand is (in figure units, before the figure transform) */
function handAt(rot, len = 220) { return [30 - Math.sin(rot) * (len - 6), -440 + Math.cos(rot) * (len - 6)]; }

/** person: o = { x, y, h, dir, skin, legs: 'hose'|'trousers'|'robe'|'gown', legC, coat: 'doublet'|'long'|'jama'|'gown'|'robe', coatC, trim, sash, collar: 'ruff'|'band'|null,
 *  hair, beard: 'full'|'goatee'|'mous'|'grey'|null, hat, hatC, plume, jewel, prop, bow 0..1, arm (deg), walk (phase), seated } */
export function person(o) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640, wk = o.walk != null ? Math.sin(o.walk) : 0, bow = clamp(o.bow || 0);
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * d, s); ctx._skin = o.skin || SKIN.eu;
  const coatC = o.coatC || P.wine, trim = o.trim || P.gold, legC = o.legC || BLACK;
  // ── legs (stay planted) ──
  if (o.seated) {
    // cross-legged: knees as a wide lens, the whole upper body lowered so the hip sits on the folded legs
    cut(() => { ctx.beginPath(); ctx.ellipse(0, -60, 150, 58, 0, 0, TAU); }, o.legC || CREAM, { shadow: 0.6, edge: 4 });
    cut(() => { ctx.beginPath(); ctx.ellipse(118, -40, 34, 18, 0, 0, TAU); }, ctx._skin, { shadow: 0.3, edge: 3 });
    ctx.translate(0, 170);
  } else if (o.legs === 'gown') {
    cut(P_poly([[-80, -300], [80, -300], [150, 0], [-150, 0]]), coatC); ctx.fillStyle = trim; ctx.fillRect(-150, -16, 300, 16);
  } else if (o.legs === 'robe') {
    cut(P_poly([[-72, -300], [72, -300], [105, 0], [-105, 0]]), coatC);
  } else {
    const w = o.legs === 'trousers' ? 24 : 17;
    for (const k of [-1, 1]) cut(P_poly([[k * 24 - w, -260], [k * 24 + w, -260], [k * 24 + w - 2 + k * wk * 30, -14], [k * 24 - w + 2 + k * wk * 30, -14]]), legC, { shadow: 0.6, edge: 4 });
    for (const k of [-1, 1]) cut(P_rr(k * 24 - 22 + k * wk * 30, -22, 52, 22, 10), BLACK, { shadow: 0.3, edge: 3 });     // shoes
  }
  // coat skirts hang from the hip and do NOT rotate with a bow
  if (o.coat === 'long' && !o.seated) cut(P_poly([[-80, -280], [80, -280], [92, -120], [-92, -120]]), coatC);
  if (o.coat === 'jama' && !o.seated) cut(P_poly([[-80, -280], [80, -280], [118, -90], [-118, -90]]), coatC);
  if (o.coat === 'jama' && o.seated) cut(P_poly([[-80, -280], [80, -280], [130, -200], [-130, -200]]), coatC);
  // ── upper body pivots at the hip ──
  ctx.save(); ctx.translate(0, -250); ctx.rotate(rad(62) * bow); ctx.translate(0, 250);
  const fr = rad(-(o.arm || 0) - 8 + wk * 16) - rad(40) * bow, br = rad(10 - wk * 16) - rad(30) * bow;
  arm(-30, br, coatC, 220, o.cuff);
  // torso
  if (o.coat === 'long') cut(P_poly([[-72, -470], [72, -470], [80, -262], [-80, -262]]), coatC);
  else if (o.coat === 'jama') cut(P_poly([[-70, -470], [70, -470], [80, -262], [-80, -262]]), coatC);
  else if (o.coat === 'gown') cut(P_poly([[-66, -470], [66, -470], [80, -290], [-80, -290]]), coatC);
  else if (o.coat === 'robe') cut(P_poly([[-70, -470], [70, -470], [72, -290], [-72, -290]]), coatC);
  else cut(P_rr(-74, -470, 148, 230, 36), coatC);                                                          // doublet
  if (o.buttons) for (let i = 0; i < 5; i++) circle(0, -440 + i * 40, 6, trim);
  if (o.coat === 'jama' || o.patka) { ctx.fillStyle = o.patka || trim; ctx.fillRect(-78, -290, 156, 26); cut(P_poly([[30, -270], [52, -270], [60, -200], [36, -204]]), o.patka || trim, { shadow: 0.3, edge: 2 }); }
  else { ctx.fillStyle = trim; ctx.fillRect(-74, -268, 148, 18); }
  if (o.sash) { ctx.save(); ctx.beginPath(); ctx.moveTo(-70, -460); ctx.lineTo(-30, -470); ctx.lineTo(72, -290); ctx.lineTo(40, -270); ctx.closePath(); ctx.fillStyle = o.sash; ctx.fill(); ctx.restore(); }
  if (o.pearls) for (let i = 0; i < 9; i++) circle(-40 + i * 10, -455 + Math.sin(i / 8 * Math.PI) * 30, 6, WHITE);
  // collar + head
  if (o.collar === 'ruff') { cut(() => { ctx.beginPath(); for (let i = 0; i <= 36; i++) { const a = i / 36 * TAU, r = 66 + (i % 2) * 8; ctx.lineTo(Math.cos(a) * r * 1.15, -478 + Math.sin(a) * r * 0.42); } ctx.closePath(); }, WHITE, { shadow: 0.4, edge: 3 }); }
  if (o.hair === 'wig') cut(() => { ctx.beginPath(); for (const [cx, cy, r] of [[-60, -590, 34], [-30, -612, 34], [10, -614, 32], [-74, -550, 34], [-76, -508, 34], [-66, -466, 32], [-40, -452, 28]]) { ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU); } }, o.hairC || WIGC, { shadow: 0.5, edge: 4 });
  if (o.hair === 'long') cut(() => { ctx.beginPath(); ctx.moveTo(-62, -580); ctx.quadraticCurveTo(-20, -630, 40, -600); ctx.lineTo(10, -560); ctx.quadraticCurveTo(-30, -520, -20, -440); ctx.lineTo(-80, -440); ctx.quadraticCurveTo(-96, -520, -62, -580); ctx.closePath(); }, o.hairC || '#4A3426', { shadow: 0.4, edge: 4 });
  cut(P_circ(0, -540, 64), ctx._skin);
  if (o.hair === 'red') cut(() => { ctx.beginPath(); ctx.arc(0, -548, 66, Math.PI * 1.05, TAU * 0.99); ctx.closePath(); }, '#B4602F', { shadow: 0, edge: 3 });
  if (o.collar === 'band') cut(P_poly([[-50, -478], [50, -478], [36, -440], [0, -452], [-36, -440]]), WHITE, { shadow: 0.3, edge: 3 });
  // face hints (side view: we face +x): an eye dot, a nose bump; beards by style
  circle(30, -550, 6, BLACK); cut(P_poly([[60, -548], [76, -528], [58, -522]]), ctx._skin, { shadow: 0, edge: 0 });
  const bc = o.beardC || (o.beard === 'grey' ? GREY : BLACK);
  if (o.beard === 'full' || o.beard === 'grey') cut(() => { ctx.beginPath(); ctx.moveTo(-30, -530); ctx.quadraticCurveTo(-20, -455, 30, -462); ctx.quadraticCurveTo(70, -470, 64, -515); ctx.lineTo(-30, -530); ctx.closePath(); }, bc, { shadow: 0, edge: 3 });
  if (o.beard === 'goatee') cut(P_poly([[30, -505], [62, -508], [52, -470], [38, -470]]), bc, { shadow: 0, edge: 2 });
  if (o.beard === 'mous' || o.beard === 'goatee') cut(P_poly([[34, -522], [72, -522], [80, -512], [40, -514]]), bc, { shadow: 0, edge: 2 });
  if (o.hair === 'short') cut(() => { ctx.beginPath(); ctx.arc(0, -552, 66, Math.PI * 1.02, TAU * 0.98); ctx.closePath(); }, o.hairC || '#4A3426', { shadow: 0, edge: 3 });
  if (o.hair === 'bald') { ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.beginPath(); ctx.arc(-30, -540, 26, Math.PI * 0.6, Math.PI * 1.4); ctx.fill(); }
  if (o.specs) { ctx.strokeStyle = BLACK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(32, -550, 14, 0, TAU); ctx.moveTo(18, -552); ctx.lineTo(-20, -556); ctx.stroke(); }
  if (o.shawl) cut(P_poly([[-70, -470], [60, -470], [80, -380], [-40, -300], [-78, -330]]), '#EFE4CC', { shadow: 0.4, edge: 3 });
  if (o.stripes) { ctx.save(); ctx.fillStyle = 'rgba(43,32,25,0.75)'; for (let i = 0; i < 5; i++) ctx.fillRect(-60, -450 + i * 36, 50 + (i % 2) * 30, 9); ctx.restore(); }
  if (o.rose) circle(36, -430, 12, P.crimson);
  hat(o);
  // front arm + prop in hand
  arm(30, fr, coatC, 220, o.cuff);
  if (o.prop) { const [hx, hy] = handAt(fr); prop(o.prop, hx, hy, o); }
  ctx.restore();
  ctx.restore();
}

function hat(o) {
  const c = o.hatC || BLACK, t = o.hat;
  if (t === 'tall') { cut(P_poly([[-46, -598], [46, -598], [40, -690], [-40, -690]]), c, { shadow: 0.5, edge: 4 }); cut(P_rr(-86, -606, 172, 18, 9), c, { shadow: 0, edge: 4 }); ctx.fillStyle = P.gold; ctx.fillRect(-45, -622, 90, 10); }
  if (t === 'brim') { cut(() => { ctx.beginPath(); ctx.ellipse(0, -598, 110, 22, -0.06, 0, TAU); }, c, { shadow: 0.5, edge: 4 }); cut(P_rr(-52, -660, 104, 66, 24), c, { shadow: 0, edge: 4 }); if (o.plume) cut(() => { ctx.beginPath(); ctx.moveTo(-40, -640); ctx.quadraticCurveTo(-130, -700, -100, -610); ctx.quadraticCurveTo(-70, -640, -40, -620); ctx.closePath(); }, o.plume, { shadow: 0.3, edge: 3 }); }
  if (t === 'tricorne') { cut(P_poly([[-100, -590], [100, -590], [70, -650], [0, -630], [-70, -650]]), c, { shadow: 0.5, edge: 4 }); ctx.fillStyle = P.gold; ctx.fillRect(-90, -596, 180, 7); }
  if (t === 'crown') cut(P_poly([[-56, -592], [-66, -664], [-32, -622], [0, -680], [32, -622], [66, -664], [56, -592]]), P.gold, { shadow: 0.5, edge: 4 });
  if (t === 'cap') cut(() => { ctx.beginPath(); ctx.ellipse(0, -598, 74, 34, 0, Math.PI, TAU); ctx.closePath(); }, c, { shadow: 0.4, edge: 4 });
  if (t === 'turban') {
    cut(() => { ctx.beginPath(); ctx.ellipse(0, -600, 84, 56, 0, Math.PI * 0.95, TAU * 1.0); ctx.lineTo(80, -585); ctx.lineTo(-80, -585); ctx.closePath(); }, c, { shadow: 0.5, edge: 4 });
    ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-76, -598 - i * 16); ctx.quadraticCurveTo(0, -620 - i * 20, 76, -600 - i * 14); ctx.stroke(); }
    if (o.band) { ctx.fillStyle = o.band; ctx.fillRect(-80, -598, 160, 12); }
    if (o.jewel) { cut(P_poly([[30, -650], [44, -630], [30, -610], [16, -630]]), o.jewel, { shadow: 0.3, edge: 3 }); }
    if (o.plume) cut(() => { ctx.beginPath(); ctx.moveTo(28, -640); ctx.quadraticCurveTo(10, -730, 70, -740); ctx.quadraticCurveTo(50, -700, 40, -636); ctx.closePath(); }, o.plume, { shadow: 0.3, edge: 3 });
  }
  if (t === 'nayak') { cut(P_poly([[-58, -590], [58, -590], [44, -700], [0, -720], [-44, -700]]), WHITE, { shadow: 0.5, edge: 4 }); ctx.fillStyle = P.gold; ctx.fillRect(-56, -612, 112, 14); circle(0, -665, 12, P.gold); }
}

function prop(k, x, y, o) {
  ctx.save(); ctx.translate(x, y);
  if (k === 'ledger') { cut(P_rr(-6, -20, 90, 120, 6), BLACK, { shadow: 0.5, edge: 3 }); ctx.fillStyle = P.gold; ctx.fillRect(4, 0, 70, 6); }
  if (k === 'letter') { cut(P_rr(-4, -30, 110, 74, 4), CREAM, { shadow: 0.5, edge: 3 }); circle(50, 8, 15, P.crimson); }
  if (k === 'charter') { cut(P_rr(0, -110, 70, 200, 8), CREAM, { shadow: 0.5, edge: 3 }); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(62,44,30,0.5)'; ctx.fillRect(12, -90 + i * 22, 46, 5); } circle(35, 70, 16, P.crimson); }
  if (k === 'spyglass') { ctx.rotate(-0.9); cut(P_rr(-10, -14, 160, 28, 8), P.gold, { shadow: 0.5, edge: 3 }); cut(P_rr(130, -18, 40, 36, 6), BLACK, { shadow: 0, edge: 3 }); }
  if (k === 'gift') { cut(P_rr(-10, -40, 110, 90, 6), P.royal, { shadow: 0.6, edge: 3 }); ctx.fillStyle = P.gold; ctx.fillRect(38, -40, 14, 90); ctx.fillRect(-10, -2, 110, 14); }
  if (k === 'map') { cut(P_rr(-10, -30, 130, 60, 22), P.land, { shadow: 0.5, edge: 3 }); ctx.strokeStyle = P.crimson; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(100, -8); ctx.stroke(); ctx.setLineDash([]); }
  if (k === 'stick') { cut(P_rr(-6, -80, 14, 300, 6), P.sepia, { shadow: 0.4, edge: 3 }); }
  if (k === 'bag') { cut(() => { ctx.beginPath(); ctx.moveTo(-20, 20); ctx.lineTo(110, 20); ctx.lineTo(100, 110); ctx.lineTo(-10, 110); ctx.closePath(); }, '#4A3426', { shadow: 0.6, edge: 3 }); cut(() => { ctx.beginPath(); ctx.arc(45, 20, 34, Math.PI, TAU); }, '#4A3426', { shadow: 0, edge: 3 }); ctx.fillStyle = P.gold; ctx.fillRect(-14, 22, 118, 8); ctx.fillRect(36, 30, 18, 16); }
  if (k === 'scroll') { cut(P_rr(-6, -18, 120, 36, 18), CREAM, { shadow: 0.5, edge: 3 }); circle(54, 0, 12, '#3F6B45'); }
  if (k === 'beads') { for (let i = 0; i < 9; i++) circle(Math.sin(i * 0.7) * 22, i * 12, 6, P.sepia); }
  if (k === 'pointer') { cut(P_rr(-4, -6, 150, 12, 6), P.sepia, { shadow: 0.4, edge: 2 }); }
  ctx.restore();
}

/** a parasol held over someone: x, y = top of the pole */
export function parasol(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-6, 0, 12, 420, 6), P.sepia, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-190, 40); ctx.quadraticCurveTo(0, -110, 190, 40); for (let i = 0; i <= 8; i++) ctx.lineTo(190 - i * 47.5, 40 + (i % 2) * 18); ctx.closePath(); }, P.crimson, { shadow: 0.6, edge: 4 });
  ctx.fillStyle = P.gold; for (let i = 0; i < 8; i++) circle(-170 + i * 48, 50, 7, P.gold);
  ctx.restore();
}
/** a paper horse (side view) standing on (x, y); rider drawn separately at (x, y - 300) */
export function horse(x, y, s = 1, walk = 0, colour = P.sepia) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const w = Math.sin(walk);
  for (const [lx, k] of [[-110, 1], [-70, -1], [90, -1], [130, 1]]) cut(P_rr(lx - 13 + k * w * 18, -210, 26, 210, 10), '#5A3E2B', { shadow: 0.5, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(10, -250, 170, 75, 0, 0, TAU); }, colour);
  cut(P_poly([[110, -300], [160, -430], [205, -470], [282, -430], [290, -395], [222, -392], [190, -300]]), colour);
  cut(P_poly([[120, -320], [158, -440], [196, -470], [150, -330]]), '#3E2C1E', { shadow: 0, edge: 2 });
  circle(232, -440, 7, '#2B2019'); cut(P_poly([[196, -468], [206, -500], [218, -464]]), colour, { shadow: 0, edge: 2 });
  cut(P_poly([[-160, -270], [-230, -170], [-205, -165], [-150, -240]]), '#3E2C1E', { shadow: 0.3, edge: 2 });
  cut(P_rr(-40, -330, 110, 30, 10), P.crimson, { shadow: 0.3, edge: 3 });
  ctx.restore();
}

// ═════════ THE 16: fixed designs (costume + props), always drawn through cast() ═════════
const EIC_RED = P.crimson;
export const CAST = {
  elizabeth: { name: 'Elizabeth I', legs: 'gown', coat: 'gown', coatC: P.wine, trim: P.gold, collar: 'ruff', hair: 'red', hat: 'crown', pearls: 1, prop: 'charter' },
  merchant: { name: 'London merchant', legs: 'hose', coat: 'long', coatC: BLACK, trim: '#4A3426', collar: 'band', beard: 'goatee', hat: 'tall', prop: 'ledger' },
  hawkins: { name: 'William Hawkins', legs: 'hose', legC: '#4A3426', coat: 'doublet', coatC: P.sepia, trim: BLACK, collar: 'band', beard: 'full', hat: 'brim', plume: WHITE, prop: 'letter' },
  best: { name: 'Thomas Best', legs: 'hose', coat: 'long', coatC: '#2C3E5A', trim: P.gold, buttons: 1, collar: 'band', beard: 'goatee', hat: 'brim', hatC: '#2C3E5A', prop: 'spyglass' },
  jahangir: { name: 'Jahangir', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: '#E9CF8E', patka: '#3F6B45', beard: 'mous', hat: 'turban', hatC: P.gold, plume: WHITE, jewel: P.crimson, pearls: 1 },
  roe: { name: 'Sir Thomas Roe', legs: 'hose', coat: 'doublet', coatC: BLACK, trim: P.gold, sash: P.royal, collar: 'ruff', beard: 'goatee', hat: 'brim', plume: P.gold, prop: 'gift' },
  day: { name: 'Francis Day', legs: 'hose', legC: '#4A3426', coat: 'long', coatC: P.forest, trim: '#4A3426', collar: 'band', beard: 'mous', hat: 'brim', hatC: '#4A3426', prop: 'map' },
  nayak: { name: 'The Nayak', skin: SKIN.in2, legs: 'robe', coatC: WHITE, coat: 'robe', trim: P.gold, sash: P.gold, beard: 'mous', hat: 'nayak', pearls: 1 },
  charles: { name: 'Charles II', legs: 'hose', coat: 'long', coatC: P.wine, trim: P.gold, buttons: 1, collar: 'band', hair: 'wig', hairC: '#2E2018', beard: 'mous', hat: 'crown' },
  catherine: { name: 'Catherine of Braganza', legs: 'gown', coat: 'gown', coatC: P.royal, trim: P.gold, hair: 'long', hairC: '#2E2018', pearls: 1 },
  child: { name: 'Josiah Child', legs: 'hose', coat: 'long', coatC: '#4A3426', trim: P.gold, buttons: 1, collar: 'band', hair: 'wig', hairC: '#CDBFA6', prop: 'pointer' },
  aurangzeb: { name: 'Aurangzeb', skin: SKIN.in, legs: 'trousers', legC: WHITE, coat: 'jama', coatC: WHITE, patka: '#3F6B45', beard: 'grey', hat: 'turban', hatC: WHITE, prop: 'beads' },
  sidi: { name: 'Sidi Yaqub', skin: SKIN.af, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: '#3F6B45', patka: P.gold, beard: 'full', hat: 'turban', hatC: WHITE, band: '#3F6B45', prop: 'spyglass' },
  charnock: { name: 'Job Charnock', legs: 'hose', legC: '#4A3426', coat: 'long', coatC: '#8C7356', trim: '#4A3426', collar: 'band', hair: 'long', hairC: GREY, hat: 'brim', hatC: '#5A4632', prop: 'stick' },
  sobha: { name: 'Sobha Singh', skin: SKIN.in2, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: P.forest, patka: P.gold, beard: 'full', hat: 'turban', hatC: '#D9A441' },
  surman: { name: 'John Surman', legs: 'hose', coat: 'long', coatC: P.royal, trim: P.gold, buttons: 1, collar: 'band', hair: 'wig', hairC: '#CDBFA6', hat: 'tricorne', prop: 'scroll' },
  hamilton: { name: 'William Hamilton', legs: 'hose', coat: 'long', coatC: BLACK, trim: '#4A3426', buttons: 1, collar: 'band', hair: 'wig', hairC: '#BDB09A', hat: 'tricorne', prop: 'bag' },
  farrukhsiyar: { name: 'Farrukhsiyar', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: P.wine, trim: P.gold, patka: P.gold, beard: 'mous', hat: 'turban', hatC: P.gold, jewel: P.crimson, plume: WHITE, pearls: 1 },
};
Object.assign(CAST, {
  clive: { name: 'Robert Clive', legs: 'hose', legC: '#F5EEDD', coat: 'long', coatC: P.crimson, trim: P.gold, buttons: 1, collar: 'band', hair: 'wig', hairC: '#E9E2D2', hat: 'tricorne' },
  siraj: { name: 'Siraj-ud-Daulah', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: '#E9CF8E', patka: P.crimson, beard: 'mous', hat: 'turban', hatC: P.wine, jewel: P.gold, plume: WHITE, pearls: 1 },
  mirjafar: { name: 'Mir Jafar', skin: SKIN.in2, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: '#3F6B45', patka: P.gold, beard: 'grey', hat: 'turban', hatC: WHITE },
  mirqasim: { name: 'Mir Qasim', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: P.royal, patka: P.gold, beard: 'full', hat: 'turban', hatC: '#E9CF8E' },
  shahalam: { name: 'Shah Alam II', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: P.wine, patka: P.gold, beard: 'full', hat: 'turban', hatC: P.gold, jewel: P.crimson, plume: WHITE, pearls: 1 },
  hastings: { name: 'Warren Hastings', legs: 'hose', coat: 'long', coatC: BLACK, trim: '#4A3426', buttons: 1, collar: 'band', hair: 'wig', hairC: '#E9E2D2' },
  tipu: { name: 'Tipu Sultan', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: '#D9A441', patka: P.ink, beard: 'mous', hat: 'turban', hatC: '#D9A441', band: P.ink, stripes: 1 },
  wellesley: { name: 'Lord Wellesley', legs: 'hose', legC: '#F5EEDD', coat: 'long', coatC: P.crimson, trim: P.gold, buttons: 1, collar: 'band', hair: 'short', hairC: '#7A6248', sash: P.royal },
  dalhousie: { name: 'Lord Dalhousie', legs: 'hose', legC: BLACK, coat: 'long', coatC: '#2C3E5A', trim: P.gold, buttons: 1, collar: 'band', hair: 'short', hairC: '#4A3426' },
  sepoy: { name: 'A sepoy', skin: SKIN.in2, legs: 'trousers', legC: '#F5EEDD', coat: 'doublet', coatC: P.crimson, trim: '#F5EEDD', beard: 'mous', hat: 'turban', hatC: '#F5EEDD' },
  zafar: { name: 'Bahadur Shah Zafar', skin: SKIN.in, legs: 'trousers', legC: CREAM, coat: 'jama', coatC: WHITE, patka: P.gold, beard: 'grey', hat: 'turban', hatC: WHITE, jewel: P.gold },
  lakshmibai: { name: 'Rani Lakshmibai', skin: SKIN.in, legs: 'trousers', legC: '#F5EEDD', coat: 'jama', coatC: P.wine, patka: P.gold, hat: 'turban', hatC: '#D9822B' },
  victoria: { name: 'Queen Victoria', legs: 'gown', coat: 'gown', coatC: BLACK, trim: P.gold, hair: 'long', hairC: '#7A6248', hat: 'crown', pearls: 1, sash: P.royal },
  naoroji: { name: 'Dadabhai Naoroji', skin: SKIN.in, legs: 'trousers', legC: '#F5EEDD', coat: 'long', coatC: BLACK, trim: BLACK, beard: 'grey', hat: 'cap', hatC: BLACK, prop: 'ledger' },
  curzon: { name: 'Lord Curzon', legs: 'hose', coat: 'long', coatC: BLACK, trim: P.gold, buttons: 1, collar: 'band', hair: 'short', hairC: '#7A6248' },
  gandhi: { name: 'Mohandas Gandhi', skin: SKIN.in2, legs: 'robe', coat: 'robe', coatC: WHITE, trim: WHITE, shawl: 1, hair: 'bald', specs: 1, prop: 'stick' },
  bose: { name: 'Subhas Chandra Bose', skin: SKIN.in, legs: 'trousers', legC: '#7A7A5A', coat: 'doublet', coatC: '#7A7A5A', trim: '#4A3426', buttons: 1, hat: 'cap', hatC: '#7A7A5A', specs: 1 },
  nehru: { name: 'Jawaharlal Nehru', skin: SKIN.in, legs: 'trousers', legC: WHITE, coat: 'long', coatC: '#E9DCC0', trim: '#E9DCC0', buttons: 1, hat: 'cap', hatC: WHITE, rose: 1 },
});
export const CAST_ORDER2 = ['clive', 'siraj', 'mirjafar', 'mirqasim', 'shahalam', 'hastings', 'tipu', 'wellesley', 'dalhousie', 'sepoy', 'zafar', 'lakshmibai', 'victoria', 'naoroji', 'curzon', 'gandhi', 'bose', 'nehru'];
export const CAST_ORDER = ['elizabeth', 'merchant', 'hawkins', 'best', 'jahangir', 'roe', 'day', 'nayak', 'charles', 'catherine', 'child', 'aurangzeb', 'sidi', 'charnock', 'sobha', 'surman', 'hamilton', 'farrukhsiyar'];
/** draw a cast member on model: cast('roe', { x, y, h, dir, bow, arm, walk, seated, prop }) (o overrides the pose, never the costume colours) */
export function cast(id, o) { const c = CAST[id]; if (!c) throw new Error('no cast member ' + id); person({ ...c, ...o }); }

/** a cast member riding a horse: horse stands on (x, y); s = horse scale; rider h follows */
export function rider(id, x, y, s = 1, walk = 0, o = {}) {
  cast(id, { x: x - 10 * s, y: y - 150 * s, h: 520 * s, ...o });           // legs end inside the barrel
  horse(x, y, s, walk);
  ctx.save(); ctx.translate(x - 10 * s, y - 250 * s); ctx.scale(s, s);     // near leg + boot over the barrel
  cut(P_rr(-22, 0, 40, 150, 14), CREAM, { shadow: 0.5, edge: 3 }); cut(P_rr(-26, 140, 58, 26, 10), '#2B2019', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
