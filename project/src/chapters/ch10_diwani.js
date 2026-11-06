// CH10 · 1765: BUXAR AND THE DIWANI. Mir Qasim, Buxar, the Diwani, the 1770 famine (no people shown), 1773.
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
export function build(add, cue) {
  const i = first(10);
  add({ id: '10.01', at: at(i), note: 'Mir Qasim rules on his own; a door closes', draw: (lt, d, t) => { K.jharokha({ door: 1 - eio(seg(lt, d * 0.5, d)), who: 'mirqasim', arm: 20 }); K.cast('hastings', { x: 360, y: 800, h: 410 }); } });
  add({ id: '10.02', at: at(i + 1), note: 'three flags join on a map of the Ganges', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.gangetic, pins: [['allahabad', 1], ['patna', 1]] }); [[[88, 23.8], 'mughal'], [[81, 26.8], 'mughal'], [[79, 28], 'mughal']].forEach(([[lo, la], f], k) => { const [x, y] = pr(lo, la); K.flag(f, lerp(x, pr(84, 25.6)[0] + (k - 1) * 70, eio(seg(lt, 0.8, d))), lerp(y, pr(84, 25.6)[1], eio(seg(lt, 0.8, d))), 200, 0.6 * eob(seg(lt, 0.1 + k * 0.25, 0.5 + k * 0.25)), t + k); }); } });
  { const s0 = at(i + 2), b0 = wd('buxar', i + 2, s0);
    add({ id: '10.03', at: s0, note: '1764: the three flags fall back from Buxar', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.gangetic, pins: [['buxar', seg(lt, b0 - 0.2, b0 + 0.2)], ['allahabad', 1], ['patna', 1]] }); for (let k = 0; k < 3; k++) { const [x, y] = pr(84, 25.6); K.flag('mughal', x + (k - 1) * 70 - eio(seg(lt, b0, d)) * 260, y, 200, 0.6, t + k); } K.flag('eic', ...pr(85.2, 25.4), 240, 0.7 * eob(seg(lt, b0, b0 + 0.4)), t); K.ribbon('1764', 960, 200, eob(seg(lt, 0.1, 0.5)), 80); } });
    cue(s0 + b0, 'cannon', { gain: 0.4 }); }
  flyDoc(add, cue, '10.04', i + 3, 5, 'diwani', 'THE DIWANI · 1765');
  add({ id: '10.05', at: at(i + 4), note: 'map: Bengal, Bihar and Orissa glow gold; coins flow to Calcutta', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.bengal, washes: null }); K.washes(pr, [['biharorissa', eo(seg(lt, 0, 0.8)), 'rgba(200,149,47,0.6)']]); for (let k = 0; k < 6; k++) { const p = ((lt * 0.5 + k / 6) % 1); const a = pr(84 + (k % 3), 22 + (k % 2) * 2), b = pr(88.36, 22.57); K.coin(lerp(a[0], b[0], p), lerp(a[1], b[1], p), 18); } } });
  cue(at(i + 4) + 0.5, 'coins', { gain: 0.6 });
  add({ id: '10.06', at: at(i + 5), note: 'a ledger page fills with columns', draw: (lt, d, t) => { K.parchment(102); K.ledger(960, 470, 1.1, seg(lt, 0, d)); } });
  cue(at(i + 5) + 0.2, 'quill', { dur: 1.6 });
  add({ id: '10.07', at: at(i + 6), note: '1770: an empty field under a grey sky (famine; no people shown)', draw: (lt, d, t) => { K.emptyField({ pan: lerp(-40, 40, eio(clamp(lt / d))) }); K.ribbon('1770', 960, 230, eob(seg(lt, 0.1, 0.5)), 80); } });
  add({ id: '10.08', at: at(i + 7), note: 'slip 7-10 MILLION; the ledger still fills', draw: (lt, d, t) => { K.emptyField({ pan: 40 }); ctx.save(); ctx.fillStyle = 'rgba(40,30,20,0.35)'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); K.slip('7 TO 10 MILLION', 960, 300, eob(seg(lt, 0.3, 0.7)), -0.02, 70); if (lt > d * 0.55) K.ledger(960, 560, 0.55, seg(lt, d * 0.55, d)); } });
  add({ id: '10.09', at: at(i + 8), note: 'Parliament; Warren Hastings in his chair; 1773', draw: (lt, d, t) => { K.parliament(); K.cast('hastings', { x: 960, y: 800, h: 440, arm: 15 }); K.ribbon('1773', 1480, 300, eob(seg(lt, 0.1, 0.5)), 72); } });
}
