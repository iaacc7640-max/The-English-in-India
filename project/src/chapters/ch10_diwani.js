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
  // 1-2 · the three allies march to Buxar under their own flags (Bengal, Awadh, Mughal); the Company army meets them; they fall back
  const BX = [84.0, 25.56], ALLY = [['bengal', [87.9, 24.2], 'he'], ['oudh', [80.95, 26.85], 'awadh'], ['mughal', [81.85, 25.45], 'shah']];
  { const s0 = at(i + 1);
    add({ id: '10.02', at: s0, note: 'Bengal Subah, Oudh and Mughal armies set off and converge on Buxar', draw: (lt, d, t) => {
      const pr = map(t, { view: K.VIEWS.gangetic, pins: [['allahabad', 1], ['patna', 1], ['lucknow', 1]] }), bx = pr(...BX);
      ALLY.forEach(([kind, ll, w], k) => { const st = k === 0 ? 0.1 : wd(w, i + 1, s0) - 0.1, q = eio(seg(lt, st + 0.3, d + 0.6)), [x, y] = pr(...ll);
        K.armyToken(lerp(x, bx[0] - 120 - k * 20, q), lerp(y, bx[1] - 90 + k * 75, q), kind, 0.85, t + k, eob(seg(lt, st, st + 0.3))); });
    } });
    cue(s0 + 0.3, 'steps', { dur: 2.0, gain: 0.45 }); }
  { const s0 = at(i + 2), b0 = wd('buxar', i + 2, s0);
    add({ id: '10.03', at: s0, note: '1764: at Buxar the allied armies face the Company army, then fall back west; the Company flag goes up', draw: (lt, d, t) => {
      const pr = map(t, { view: K.VIEWS.gangetic, pins: [['buxar', seg(lt, b0 - 0.2, b0 + 0.2)], ['allahabad', 1], ['patna', 1]] }), bx = pr(...BX), back = eio(seg(lt, b0 + 0.3, d + 0.3));
      ALLY.forEach(([kind], k) => K.armyToken(bx[0] - 120 - k * 20 - back * 330, bx[1] - 90 + k * 75 + back * 20 * (k - 1), kind, 0.85, t + k, 1 - 0.5 * back));
      K.armyToken(lerp(bx[0] + 360, bx[0] + 90, eio(seg(lt, 0, b0))), bx[1], 'eic', 0.9, t);
      K.flag('eic', bx[0] + 10, bx[1] - 10, 200 * eob(seg(lt, b0 + 0.6, b0 + 1.2)), 0.6, t);
      K.ribbon('1764', 1150, 220, eob(seg(lt, 0.1, 0.5)), 70);
    } });
    cue(s0 + 0.2, 'steps', { dur: 1.0, gain: 0.4 }); cue(s0 + b0, 'cannon', { gain: 0.35 }); }
  flyDoc(add, cue, '10.04', i + 3, 5, 'diwani', 'THE DIWANI · 1765');
  add({ id: '10.05', at: at(i + 4), note: 'map: Bengal, Bihar and Orissa glow gold; coins flow to Calcutta', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.bengal, washes: null }); K.washes(pr, [['biharorissa', eo(seg(lt, 0, 0.8)), 'rgba(200,149,47,0.6)']]); for (let k = 0; k < 6; k++) { const p = ((lt * 0.5 + k / 6) % 1); const a = pr(84 + (k % 3), 22 + (k % 2) * 2), b = pr(88.36, 22.57); K.coin(lerp(a[0], b[0], p), lerp(a[1], b[1], p), 18); } } });
  cue(at(i + 4) + 0.5, 'coins', { gain: 0.6 });
  add({ id: '10.06', at: at(i + 5), note: 'a ledger page fills with columns', draw: (lt, d, t) => { K.parchment(102); K.ledger(960, 470, 1.1, seg(lt, 0, d)); } });
  cue(at(i + 5) + 0.2, 'quill', { dur: 1.6 });
  add({ id: '10.07', at: at(i + 6), note: '1770: an empty field under a grey sky (famine; no people shown)', draw: (lt, d, t) => { K.emptyField({ pan: lerp(-40, 40, eio(clamp(lt / d))) }); K.ribbon('1770', 960, 230, eob(seg(lt, 0.1, 0.5)), 80); } });
  add({ id: '10.08', at: at(i + 7), note: 'slip 7-10 MILLION; the ledger still fills', draw: (lt, d, t) => { K.emptyField({ pan: 40 }); ctx.save(); ctx.fillStyle = 'rgba(40,30,20,0.35)'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); K.slip('7 TO 10 MILLION', 960, 300, eob(seg(lt, 0.3, 0.7)), -0.02, 70); if (lt > d * 0.55) K.ledger(960, 560, 0.55, seg(lt, d * 0.55, d)); } });
  add({ id: '10.09', at: at(i + 8), note: 'Parliament; Warren Hastings in his chair; 1773', draw: (lt, d, t) => { K.parliament(); K.cast('hastings', { x: 960, y: 800, h: 440, arm: 15 }); K.ribbon('1773', 1480, 300, eob(seg(lt, 0.1, 0.5)), 72); } });
}
