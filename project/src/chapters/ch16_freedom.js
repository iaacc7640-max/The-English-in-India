// CH16 · 1947: FREEDOM AT MIDNIGHT. Quit India, Bose, the Independence Act, Partition (dignified), midnight, the closing callback.
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
import { courtShot } from './ch0_hook.js';
export function build(add, cue) {
  const i = first(16);
  add({ id: '16.01', at: at(i), note: "a banner 'QUIT INDIA'; a crowd of cut-outs (1942)", draw: (lt, d, t) => { K.crowdBanner('QUIT INDIA', { t, banner: seg(lt, 0.4, 0.9), seed: 161 }); K.ribbon('1942', 300, 560, eob(seg(lt, 0.1, 0.5)), 64); } });
  { const s0 = at(i + 1), b0 = wd('subhas', i + 1, s0);
    add({ id: '16.02', at: s0, note: 'prison bars over Gandhi and Nehru', draw: (lt, d, t) => K.prison() });
    add({ id: '16.02b', at: s0 + b0 - 0.2, note: 'Bose in uniform beside a map of South-East Asia', draw: (lt, d, t) => { K.realMap({ view: { lon: 100, lat: 14, k: 22 }, compass: false }); K.cast('bose', { x: 520, y: 800, h: 480, arm: 30 }); K.slip('INDIAN NATIONAL ARMY', 1250, 260, eob(seg(lt, 0.2, 0.6)), -0.02, 46); } });
    cue(s0 + 0.1, 'thud', { gain: 0.5 }); }
  flyDoc(add, cue, '16.03', i + 2, 7, 'act1947', 'INDIAN INDEPENDENCE ACT · 1947');
  add({ id: '16.04', at: at(i + 3), note: 'the 1947 map: a crimson line divides it (west and east)', draw: (lt, d, t) => { const pr = K.realMap({ view: K.VIEWS.india, compass: false }); K.partitionLines(pr, eio(seg(lt, 0.2, d * 0.9))); K.tag('INDIA', ...pr(79, 22), eob(seg(lt, d * 0.6, d * 0.8))); K.tag('PAKISTAN', ...pr(69.5, 29.5), eob(seg(lt, d * 0.7, d * 0.9))); K.tag('PAKISTAN', ...pr(90.3, 24.2), eob(seg(lt, d * 0.75, d * 0.95))); } });
  cue(at(i + 3) + 0.3, 'slide', { dur: 1.4 });
  { const s0 = at(i + 4), f0 = wd('free', i + 4, s0);
    add({ id: '16.05', at: s0, note: 'midnight: the Union Jack lowers; the tricolour rises', draw: (lt, d, t) => K.midnightFlags(seg(lt, 0.2, f0 - 0.3), seg(lt, f0 - 0.4, f0 + 0.9), t) });
    cue(s0 + 0.1, 'gong', { gain: 0.45 }); cue(s0 + f0, 'cloth'); }
  add({ id: '16.06', at: at(i + 5), note: 'families walk with bundles across a paper landscape (dignified, no violence)', draw: (lt, d, t) => { K.refugees(lt * 0.5, t); K.slip('12 TO 20 MILLION', 960, 230, eob(seg(lt, 0.3, 0.7)), -0.02, 56); } });
  add({ id: '16.07', at: at(i + 6), note: 'the 1600 charter, aged, with its seal', draw: (lt, d, t) => { K.parchment(167); K.cut(K.P_rr(760, 150, 400, 620, 6), '#E3CFA0', { shadow: 0.9, edge: 5 }); for (let r = 0; r < 10; r++) { ctx.fillStyle = 'rgba(62,44,30,0.45)'; ctx.fillRect(800, 220 + r * 44, 320, 6); } K.seal(960, 690, 0.6, 'E'); K.ribbon('1600', 960, 120, eob(seg(lt, 0.1, 0.5)), 64); } });
  add({ id: '16.08', at: at(i + 7), note: 'callback: the 1690 envoys bowing in the court', draw: (lt, d, t) => courtShot(lt, t, { pan: 40, bow: 1, dim: 0.25, courtiers: false }) });
  { const s0 = at(i + 8), e0 = Le(i + 8) + 0.1;
    add({ id: '16.09', at: s0, note: 'the Bengal cushion, empty; the tricolour flies above', draw: (lt, d, t) => { K.cushionScene(); K.cushion(960, 700, 1.1, false); K.flag('india', 940, 640, 420, lerp(0.4, 1.1, eob(seg(lt, 0.2, 0.9))), t); } });
    add({ id: '16.10', at: e0, noCaption: true, noSplit: true, note: 'FINAL CARD 1600 -> 1947 (bottom-right kept clear)', draw: (lt) => K.finalCard(lt) });
    cue(e0, 'page'); }
}
