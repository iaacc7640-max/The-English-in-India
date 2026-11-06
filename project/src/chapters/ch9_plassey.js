// CH9 · 1757: BATTLE OF PLASSEY. The French, Siraj-ud-Daulah, Clive, Mir Jafar's betrayal (no battle shown).
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
const wd = (w, i, s0) => { try { return Wd(w, i) - s0; } catch { return 0.6; } };
const map = (t, o = {}) => K.realMap({ rings: ringsAt(t), ringLabels: false, compass: false, ...o });
const flyDoc = (add, cue, id, i, slot, kind, title) => {   // a document unrolls, stamps, flies to the stack within line i
  const s0 = at(i), d0 = at(i + 1) - s0, fly0 = Math.max(1.2, d0 - 0.8); G.stackLand[slot] = s0 + fly0 + 0.75;
  add({ id, at: s0, note: `${title}: unroll, stamp, fly to the stack`, draw: (lt) => { K.parchment(60 + slot); if (lt < fly0) K.farman(kind, 960, 470, 1000, 470, seg(lt, 0, 0.5), seg(lt, 0.7, 0.95), [{ text: title, y: 120, size: 60 }]); },
    overlay: (lt) => { if (lt >= fly0 && lt < fly0 + 0.75) K.farmanFly(slot, seg(lt, fly0, fly0 + 0.75), [960, 470], 4); } });
  cue(s0, 'scroll'); cue(s0 + 0.7, 'seal'); cue(s0 + fly0, 'whoosh');
};
/** the mango grove at Plassey: a green field, trees, two rows of flags facing each other; fall[k] lowers the Nawab's flags */
function grove(t, show = 1, fallFn = null) {
  K.parchment(98); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  K.cut(K.P_rr(-400, 480, W + 800, 800, 0), '#A9B48A', { shadow: 0.4, edge: 4 });
  for (let k = 0; k < 7; k++) { const x = 150 + k * 270; K.cut(K.P_rr(x - 10, 400, 20, 110, 4), '#5A3E2B', { shadow: 0.3, edge: 2 }); K.cut(K.P_circ(x, 380, 70), P.forest, { shadow: 0.4, edge: 3 }); }
  for (let k = 0; k < 5; k++) { K.flag('eic', 140 + k * 120, 780, 280, 0.6 * eob(clamp(show * 5 - k * 0.5)), t + k); K.flag('mughal', 1240 + k * 120, 780, 280, 0.6 * eob(clamp(show * 5 - k * 0.5)), t + k, fallFn ? fallFn(k) : 0); }
}
export function build(add, cue) {
  const i = first(9);
  add({ id: '9.01', at: at(i), note: 'Coromandel coast: Pondicherry (French) beside Madras', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.south, pins: [['pondicherry', seg(lt, 0.2, 0.5)]] }); const [x, y] = pr(79.81, 11.94); K.flag('france', x, y, 220, 0.8, t); const [mx, my] = pr(80.27, 13.08); K.flag('eic', mx, my, 220, 0.8, t); } });
  add({ id: '9.02', at: at(i + 1), note: 'the two flags push back and forth along the coast', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.south }); const sw = Math.sin(lt * 2.2) * 0.6; K.flag('france', ...pr(79.7, 12.4 + sw), 220, 0.8, t); K.flag('eic', ...pr(80.1, 13.4 + sw), 220, 0.8, t); } });
  cue(at(i + 1) + 0.3, 'cannon', { gain: 0.3 });
  add({ id: '9.03', at: at(i + 2), note: 'slip CARNATIC WARS', draw: (lt, d, t) => { map(t, { view: K.VIEWS.south, washes: null }); K.slip('THE CARNATIC WARS', 960, 300, eob(seg(lt, 0.05, 0.4)), -0.02, 64); } });
  { const s0 = at(i + 3), p0 = wd('pondi', i + 3, s0);
    add({ id: '9.04', at: s0, note: 'Wandiwash pin; the French flag falls at Pondicherry', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.south, pins: [['wandiwash', seg(lt, 0.2, 0.5)], ['pondicherry', 1]] }); const [x, y] = pr(79.81, 11.94); K.flag('france', x, y, 220, 0.8, t, eio(seg(lt, p0, p0 + 0.8))); } });
    cue(s0 + p0 + 0.3, 'thud', { gain: 0.5 }); }
  add({ id: '9.05', at: at(i + 4), note: 'Siraj-ud-Daulah on his throne in Murshidabad', draw: (lt, d, t) => { K.mughalCourt({ throne: 'siraj', pan: lerp(-60, 40, eio(clamp(lt / d))) }); K.courtForeground(40); } });
  { const s0 = at(i + 5);
    add({ id: '9.06', at: s0, note: 'stones added to Fort William; the Nawab frowns', draw: (lt, d, t) => { K.sutanuti({ t, walls: 1 }); K.fortRise(960, 790, 1.2, 0.5 + 0.5 * seg(lt, 0, d)); } });
    for (let k = 0; k < 4; k++) cue(s0 + 0.2 + k * 0.4, 'brick', { gain: 0.5 }); }
  { const s0 = at(i + 6), z0 = wd('seized', i + 6, s0);
    add({ id: '9.07', at: s0, note: '1756: the Company flag at Fort William comes down; a Mughal flag goes up', draw: (lt, d, t) => { K.sutanuti({ t, walls: 1 }); K.flag('mughal', 1340, 640, lerp(0, 230, eio(seg(lt, z0 + 0.4, z0 + 1.2))), 0.7, t); K.ribbon('1756', 380, 230, eob(seg(lt, 0.1, 0.5)), 70); } });
    cue(s0 + z0, 'thud', { gain: 0.4 }); }
  add({ id: '9.08', at: at(i + 7), note: 'Clive on deck; a crimson route Madras -> Calcutta', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india }); const r = [[80.4, 13.1], [82.5, 16.5], [86.5, 20], [88.3, 22.4]].map(([a, b]) => pr(a, b)); const h = K.dashedRoute(r, eio(seg(lt, 0.2, d))); K.eastIndiaman(h[0], h[1] - 10, 0.14, 0, t, 'eic'); K.cast('clive', { x: 360, y: 800, h: 460, arm: 40 }); } });
  { const s0 = at(i + 8), p0 = wd('plassey', i + 8, s0);
    add({ id: '9.09', at: s0, note: '23 June 1757: the mango grove at Plassey; two lines of flags (no fighting)', draw: (lt, d, t) => { grove(t, seg(lt, 0.3, 1.3)); K.ribbon('23 JUNE 1757', 960, 200, eob(seg(lt, 0.1, 0.5)), 72); } });
    cue(s0 + p0, 'gong', { gain: 0.3 }); }
  add({ id: '9.10', at: at(i + 9), note: 'Clive and Mir Jafar behind a tent flap; a folded letter passes', draw: (lt, d, t) => { K.parchment(99); K.cut(K.P_poly([[300, 820], [960, 120], [1620, 820]]), '#D9C49A', { shadow: 0.6, edge: 5 }); K.cut(K.P_poly([[960, 120], [1180, 820], [960, 820]]), '#C9B07A', { shadow: 0.3, edge: 3 }); K.cast('clive', { x: 760, y: 820, h: 420, arm: lerp(10, 45, eob(seg(lt, 0.6, 1.0))), prop: 'letter' }); K.cast('mirjafar', { x: 1160, y: 820, h: 420, dir: -1, arm: 30 }); } });
  cue(at(i + 9) + 0.6, 'cloth');
  add({ id: '9.11', at: at(i + 10), note: "half of the Nawab's flags lower, one by one", draw: (lt, d, t) => grove(t, 1, (k) => (k >= 2 ? eio(seg(lt, 0.4 + (k - 2) * 0.35, 0.9 + (k - 2) * 0.35)) : 0)) });
  { const s0 = at(i + 11), f0 = wd('fortune', i + 11, s0);
    add({ id: '9.12', at: s0, note: 'Mir Jafar on the Bengal cushion; coin chests pile up', draw: (lt, d, t) => { K.cushionScene(); K.cushion(820, 700, 1.1, false); K.cast('mirjafar', { x: 840, y: 700, h: 360, seated: 1 }); const n = Math.floor(30 * eo(seg(lt, f0 - 0.3, d))); ctx.save(); ctx.translate(1380, 760); ctx.scale(1.8, 1.8); K.coinStacks(-110, 0, n, 10, P.gold); ctx.restore(); } });
    cue(s0 + f0, 'coins'); }
}
