// CH8 · 1757: NEXT, THE FRENCH. Three forts, three pillars, the French teaser, Plassey, the loop back to the cushion, the end card.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
import { turbanInHand } from './ch0_hook.js';
const { P } = K;
export function build(add, cue) {
  const i = first(8);   // 90
  const names = ['madras', 'bombay', 'calcutta'];
  add({ id: '8.01', at: at(i), note: 'the three filled rings glow, one by one', draw: (lt, d, t) => K.realMap({ compass: false, view: K.VIEWS.india, rings: ringsAt(t), glowRings: 0.5 + 0.5 * Math.sin(lt * 4) }) });
  names.forEach((n, k) => { try { cue(Wd(n, i), 'pop', { gain: 0.4 }); } catch {} });
  add({ id: '8.02', at: at(i + 1), note: 'pull back to all of India', draw: (lt, d, t) => K.realMap({ compass: false, view: K.lerpView(K.VIEWS.india, { lon: 80.5, lat: 20.2, k: 24 }, eio(clamp(lt / d))), rings: ringsAt(t), glowRings: 0.6 }) });
  add({ id: '8.03', at: at(i + 2), note: 'paper pillars rise from the rings', draw: (lt, d, t) => K.realMap({ compass: false, view: { lon: 80.5, lat: 20.2, k: 24 }, rings: ringsAt(t), pillars: eob(seg(lt, 0.4, 1.2)), ringLabels: false }) });
  cue(at(i + 2) + 0.4, 'slide', { dur: 0.8 });
  add({ id: '8.04', at: at(i + 3), note: 'the map edge rustles: one more rival', draw: (lt, d, t) => { K.realMap({ compass: false, view: K.VIEWS.east, rings: ringsAt(t), ringLabels: false }); } });
  cue(at(i + 3), 'page');
  add({ id: '8.05', at: at(i + 4), note: 'a fleur-de-lis flag slides in at Pondicherry', draw: (lt, d, t) => { const pr = K.realMap({ compass: false, view: K.VIEWS.east, rings: ringsAt(t), ringLabels: false, pins: [['pondicherry', seg(lt, 0.1, 0.4)]] }); const [x, y] = pr(79.81, 11.94); K.flag('france', lerp(x + 600, x, eio(seg(lt, 0, 0.6))), y, 260, 0.9, t); } });
  cue(at(i + 4), 'whoosh');
  { const s0 = at(i + 5), p0 = Wd('pla', i + 5) - s0;
    add({ id: '8.06', at: s0, note: 'era bar to 1757; Plassey pin', draw: (lt, d, t) => { K.realMap({ compass: false, view: K.VIEWS.bengal, rings: ringsAt(t), pins: [['plassey', seg(lt, p0 - 0.1, p0 + 0.2)]] }); K.ribbon('1757', 960, 250, eob(seg(lt, 0.1, 0.5)), 100); } });
    cue(s0 + p0, 'pop'); }
  add({ id: '8.07', at: at(i + 6), note: 'callback: the kneeling envoys, small in the great hall', draw: (lt, d, t) => { K.mughalCourt({ pan: 40, throne: 'aurangzeb', dim: 0.4 }); K.layer(40, 0.6, () => { K.envoy(0, { x: 640, y: 800, h: 300, bow: 1 }); K.envoy(1, { x: 800, y: 800, h: 310, bow: 1 }); }); K.courtForeground(40); } });
  { const s0 = at(i + 7), d0 = Le(i + 7) - s0, end0 = Le(i + 7) + 0.1;
    add({ id: '8.08', at: s0, note: 'the cold-open cushion: this time the hand sets the turban down (loop)', draw: (lt, d, t) => { K.cushionScene(); K.cushion(900, 700, 1.1, false); turbanInHand(1010, lerp(520, 640, eio(seg(lt, 0, d0 * 0.8))), 1.1); } });
    add({ id: '8.09', at: end0, noCaption: true, noSplit: true, note: 'END CARD: NEXT: THE FRENCH IN INDIA (bottom-right kept clear)', draw: (lt) => K.endCard(lt) });
    cue(s0 + d0 * 0.8, 'thud', { gain: 0.5 }); cue(end0 + 0.1, 'page'); }
}
