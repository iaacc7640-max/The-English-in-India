// CH15 · 1919: GANDHI'S INDIA. Return 1915, Jallianwala Bagh (empty garden, no figures), non-cooperation, the Salt March.
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
  const i = first(15);
  add({ id: '15.01', at: at(i), note: 'a ship docks at Bombay; Gandhi steps down (1915)', draw: (lt, d, t) => { K.suratHarbour({ t, place: 'BOMBAY · APOLLO BUNDER', flag: 'union', steamer: 1, shipX: lerp(200, 520, eio(seg(lt, 0, d * 0.6))) }); K.cast('gandhi', { x: lerp(1130, 1320, eio(seg(lt, d * 0.4, d))), y: 800, h: 360, walk: t * 4 }); K.ribbon('1915', 600, 220, eob(seg(lt, 0.1, 0.5)), 70); } });
  add({ id: '15.02', at: at(i + 1), note: 'the walled garden at dusk, empty; its narrow entrance', draw: (lt, d, t) => K.jallianwala({ t, pan: lerp(-40, 40, eio(clamp(lt / d))), exit: eob(seg(lt, 0.8, 1.2)) }) });
  add({ id: '15.03', at: at(i + 2), note: 'the empty wall; a small memorial flame (no figures, no gunfire)', draw: (lt, d, t) => { K.jallianwala({ t, pan: 40, exit: 1, m: seg(lt, 0.3, 0.9), night: 0.6 }); K.slip('13 APRIL 1919', 960, 230, eob(seg(lt, 0.2, 0.6)), -0.02, 52); } });
  cue(at(i + 2) + 0.2, 'gong', { gain: 0.3 });
  add({ id: '15.04', at: at(i + 3), note: 'Gandhi at a spinning wheel (1920)', draw: (lt, d, t) => { K.parchment(154); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.charkha(1180, 800, 1.3, t); K.cast('gandhi', { x: 640, y: 800, h: 480, seated: 1 }); K.ribbon('1920', 960, 200, eob(seg(lt, 0.1, 0.5)), 70); } });
  add({ id: '15.05', at: at(i + 4), note: 'three slips stamped one by one: cloth, a medal, a desk name-plate', draw: (lt, d, t) => { K.parchment(155); ['FOREIGN CLOTH', 'BRITISH TITLE', 'GOVERNMENT POST'].forEach((n, k) => { K.slip(n, 400 + k * 560, 470, 1, (k - 1) * 0.03, 46); K.stamp('GIVEN UP', 400 + k * 560, 600, seg(lt, 0.3 + k * 0.6, 0.6 + k * 0.6), 0.6); }); } });
  for (let k = 0; k < 3; k++) cue(at(i + 4) + 0.3 + k * 0.6, 'seal', { gain: 0.5 });
  { const s0 = at(i + 5), d0 = at(i + 6) - s0, sl = wd('salt', i + 5, s0);
    add({ id: '15.06', at: s0, note: 'map: the dashed route Sabarmati -> Dandi; Gandhi walking (1930)', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.gujarat, pins: [['sabarmati', 1], ['dandi', seg(lt, d * 0.7, d * 0.8)]] }); const h = K.dashedRoute([[72.58, 23.06], [72.7, 22.3], [72.95, 21.6], [72.9, 21.2], [72.8, 20.89]].map(([a, b]) => pr(a, b)), eio(seg(lt, 0.3, d * 0.8))); K.cast('gandhi', { x: h[0], y: h[1] + 20, h: 150, walk: t * 5 }); K.ribbon('1930', 1250, 320, eob(seg(lt, 0.1, 0.5)), 70); } });
    add({ id: '15.06b', at: s0 + sl - 0.4, note: 'at the shore he lifts a pinch of salt', draw: (lt, d, t) => { K.madrasBeach({ t }); K.cast('gandhi', { x: 900, y: 800, h: 440, arm: lerp(0, 80, eob(seg(lt, 0.2, 0.7))) }); K.slip('SALT', 1200, 330, eob(seg(lt, 0.5, 0.9)), 0.04, 56); } });
    cue(s0 + 0.3, 'steps', { dur: 2.4 }); }
  add({ id: '15.07', at: at(i + 6), note: 'newspapers from many countries flutter in', draw: (lt, d, t) => K.newspapers(seg(lt, 0, d * 0.8), t) });
  cue(at(i + 6), 'page'); cue(at(i + 6) + 0.6, 'page', { gain: 0.6 });
}
