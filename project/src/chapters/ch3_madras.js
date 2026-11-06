// CH3 · 1639: A FORT ON THE SAND. The Golden Farman, Francis Day and the Nayak, Fort St George, Madras.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
export function build(add, cue) {
  const i = first(3);   // 33
  add({ id: '3.01', at: at(i), note: 'map pans to the east coast; Masulipatnam + Golconda', draw: (lt, d, t) => K.realMap({ view: K.lerpView(K.VIEWS.india, K.VIEWS.east, eio(clamp(lt / d))), rings: ringsAt(t), ringLabels: false, pins: [['masulipatnam', seg(lt, 0.4, 0.7)], ['golconda', seg(lt, 0.6, 0.9)]] }) });
  { const s0 = at(i + 1), d0 = Le(i + 1) - s0, g0 = Wd('golden', i + 1) - s0;
    add({ id: '3.02', at: s0, note: 'the Sultan of Golconda: royal-blue flag over the map', draw: (lt, d, t) => { const pr = K.realMap({ view: K.VIEWS.east, rings: ringsAt(t), ringLabels: false, pins: [['masulipatnam', 1], ['golconda', 1]] }); const [x, y] = pr(78.4, 17.38); K.flag('golconda', x, y, 260, 0.9 * eob(seg(lt, 0.1, 0.5)), t); } });
    add({ id: '3.02b', at: s0 + g0 - 0.15, note: 'the golden farman unrolls (gold on royal), 1632', draw: (lt, d, t) => { K.parchment(34); cut0(); K.farman('golconda', 960, 470, 1000, 470, seg(lt, 0, 0.6), seg(lt, d - 0.6, d - 0.3)); K.ribbon('1632', 960, 170, eob(seg(lt, 0.3, 0.7)), 70); } });
    cue(s0 + g0, 'scroll'); }
  { const s0 = at(i + 2), d0 = at(i + 3) - s0, c0 = Wd('five', i + 2) - s0, fly0 = d0 - 0.8; G.stackLand[1] = s0 + fly0 + 0.75;
    add({ id: '3.03', at: s0, note: 'free trade in his ports', draw: (lt, d, t) => { K.parchment(34); K.farman('golconda', 960, 470, 1000, 470, 1, 1); } });
    add({ id: '3.03b', at: s0 + c0 - 0.15, note: 'gold pagodas counted to 500; the farman flies to the stack', draw: (lt, d, t) => {
      K.parchment(35); const n = Math.round(500 * eo(seg(lt, 0, fly0 - c0 - 0.2))); ctx.save(); ctx.translate(960, 760); ctx.scale(2, 2); K.coinStacks(-110, 0, Math.ceil(n / 25), 10, P.gold); ctx.restore();
      K.slip(`${n} PAGODAS A YEAR`, 960, 330, 1, -0.02, 60);
    }, overlay: (lt) => { const f = fly0 - c0 + 0.15; if (lt >= f && lt < f + 0.75) K.farmanFly(1, seg(lt, f, f + 0.75), [960, 470], 2.6); } });
    cue(s0 + c0, 'coins'); cue(s0 + c0 + 0.6, 'coins', { gain: 0.6 }); cue(s0 + fly0, 'whoosh'); }
  add({ id: '3.04', at: at(i + 3), note: '1639: the sandy coast', draw: (lt, d, t) => { K.madrasBeach({ t, pan: lerp(-80, 0, eio(clamp(lt / d))) }); K.ribbon('1639', 960, 250, eob(seg(lt, 0.1, 0.5)), 90); } });
  add({ id: '3.05', at: at(i + 4), note: 'Francis Day walks in from the left', draw: (lt, d, t) => { K.madrasBeach({ t }); K.cast('day', { x: lerp(-100, 640, eio(clamp(lt / (d * 0.9)))), y: 800, h: 420, walk: t * 7 }); } });
  { const s0 = at(i + 5), st0 = Wd('strip', i + 5) - s0;
    add({ id: '3.06', at: s0, note: 'two-shot: Day and the Nayak under a parasol', draw: (lt, d, t) => { K.madrasBeach({ t }); K.cast('day', { x: 700, y: 800, h: 420, bow: 0.25, arm: 30 }); K.parasol(1060, 330, 0.9); K.cast('nayak', { x: 1200, y: 800, h: 440, dir: -1, arm: 35 }); } });
    add({ id: '3.06b', at: s0 + st0 - 0.15, note: 'a strip of beach lights up between two rivers', camera: () => ({ x: 960, y: 520, zoom: 1.05 }), draw: (lt, d, t) => K.madrasBeach({ t, hl: seg(lt, 0, 0.6) }) });
    cue(s0 + st0, 'sparkle', { gain: 0.5 }); }
  add({ id: '3.07', at: at(i + 6), note: 'Fort St George: walls rise course by course', draw: (lt, d, t) => { K.madrasBeach({ t, hl: 0.3, fort: seg(lt, 0, d * 0.9) }); K.slip('FORT ST GEORGE', 1000, 220, eob(seg(lt, d * 0.6, d * 0.9)), -0.02, 52); } });
  for (let k = 0; k < 6; k++) cue(at(i + 6) + k * 0.3, 'brick', { gain: 0.6 });
  { const s0 = at(i + 7), m0 = Wd('madras', i + 7) - s0; G.ringFill.madras = s0 + m0 + 0.45;
    add({ id: '3.08', at: s0, note: 'roofs fill in around the fort', draw: (lt, d, t) => { K.madrasBeach({ t, fort: 1, town: seg(lt, 0, m0) }); } });
    add({ id: '3.08b', at: s0 + m0 + 0.1, note: 'map: the Madras ring fills', draw: (lt, d, t) => K.realMap({ view: K.VIEWS.east, rings: ringsAt(t), pins: [['masulipatnam', 1], ['golconda', 1]] }) });
    cue(G.ringFill.madras, 'pop'); }
}
function cut0() {}
