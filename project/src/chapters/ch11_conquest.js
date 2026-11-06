// CH11 · 1799: THE COMPANY CONQUERS. Mysore, the subsidiary alliance, the Marathas, Punjab, the Doctrine of Lapse, the first train.
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
const RED = 'rgba(168,50,45,0.5)';
export function build(add, cue) {
  const i = first(11);
  add({ id: '11.01', at: at(i), note: 'map: a red wash spreads from Bengal', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india }); K.washes(pr, [['bengal', eo(seg(lt, 0, 0.6)), RED], ['biharorissa', eo(seg(lt, 0.5, 1.4)), RED], ['awadh', eo(seg(lt, 1.2, 2)), 'rgba(168,50,45,0.3)']]); } });
  add({ id: '11.02', at: at(i + 1), note: 'Tipu Sultan before the Seringapatam ramparts; tiger flag', draw: (lt, d, t) => { K.parchment(111); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900); K.cut(K.P_rr(-400, 360, W + 800, 440, 0), '#B9A07A', { shadow: 0.5, edge: 4 }); for (let x = -380; x < W + 380; x += 80) K.cut(K.P_rr(x, 330, 50, 40, 4), '#B9A07A', { shadow: 0.3, edge: 3 }); K.flag('tiger', 1300, 330, 220, 0.8, t); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cast('tipu', { x: 800, y: 800, h: 460, arm: 20 }); } });
  { const s0 = at(i + 2), y0 = wd('seventeen', i + 2, s0);
    add({ id: '11.03', at: s0, note: '1799: the tiger flag lowers; an empty throne', draw: (lt, d, t) => { K.parchment(112); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900); K.cut(K.P_rr(-400, 360, W + 800, 440, 0), '#B9A07A', { shadow: 0.5, edge: 4 }); K.flag('tiger', 1300, 330, 220, 0.8, t, eio(seg(lt, y0, y0 + 1))); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cut(K.P_rr(700, 560, 260, 240, 20), P.wine, { shadow: 0.7, edge: 4 }); K.cut(K.P_rr(680, 700, 300, 60, 12), P.gold, { shadow: 0.4, edge: 3 }); K.ribbon('1799', 960, 200, eob(seg(lt, 0.1, 0.5)), 80); } }); }
  add({ id: '11.04', at: at(i + 3), note: 'Wellesley holds out a treaty to a seated Raja', draw: (lt, d, t) => { K.palaceCourtyard(); K.cast('wellesley', { x: 760, y: 800, h: 440, arm: lerp(10, 55, eob(seg(lt, 0.2, 0.6))), prop: 'scroll' }); } });
  add({ id: '11.05', at: at(i + 4), note: 'Company soldiers march into the courtyard; a coin bag passes', draw: (lt, d, t) => { K.palaceCourtyard(); K.soldiersMarch(seg(lt, 0, d * 0.7), t); K.moneybag(1080, 780, 0.4 * eob(seg(lt, d * 0.5, d * 0.8))); } });
  cue(at(i + 4), 'steps', { dur: 1.6 });
  add({ id: '11.06', at: at(i + 5), note: 'map: the Maratha flag shrinks; the red wash grows (1818)', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india }); K.washes(pr, [['bengal', 1, RED], ['biharorissa', 1, RED], ['carnatic', 1, RED], ['mysore', 1, RED], ['maratha', eo(seg(lt, 0.6, d)), RED]]); const [x, y] = pr(75, 19.5); K.flag('maratha', x, y, 240, lerp(0.9, 0.2, eio(seg(lt, 0.4, d))), t); } });
  add({ id: '11.07', at: at(i + 6), note: 'map: Punjab turns red (1849)', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india }); K.washes(pr, [['bengal', 1, RED], ['biharorissa', 1, RED], ['carnatic', 1, RED], ['mysore', 1, RED], ['maratha', 1, RED], ['north', 1, 'rgba(168,50,45,0.3)'], ['punjab', eo(seg(lt, 0.4, d)), RED]]); const [x, y] = pr(74.5, 31.2); K.flag('sikh', x, y + 40, 110, lerp(0.7, 0.2, eio(seg(lt, 0.4, d))), t); } });
  add({ id: '11.08', at: at(i + 7), note: 'Dalhousie stamps LAPSE on three states', draw: (lt, d, t) => { K.parchment(118); K.cast('dalhousie', { x: 360, y: 800, h: 460, arm: 50 }); ['SATARA · 1848', 'JHANSI · 1853', 'NAGPUR · 1854'].forEach((n, k) => { K.slip(n, 1100, 260 + k * 190, 1, -0.02, 56); K.stamp('LAPSE', 1280, 270 + k * 190, seg(lt, 0.5 + k * 0.4, 0.8 + k * 0.4), 0.8); }); } });
  for (let k = 0; k < 3; k++) cue(at(i + 7) + 0.5 + k * 0.4, 'seal', { gain: 0.6 });
  add({ id: '11.09', at: at(i + 8), note: 'a crown slips off a cushion', draw: (lt, d, t) => { K.cushionScene(); K.cushion(960, 700, 1.1, false); ctx.save(); ctx.translate(960 + 260 * eio(seg(lt, 0.2, d)), 600 + 240 * eio(seg(lt, 0.2, d))); ctx.rotate(eio(seg(lt, 0.2, d)) * 1.2); K.cut(K.P_poly([[-90, 0], [-100, -110], [-50, -60], [0, -130], [50, -60], [100, -110], [90, 0]]), P.gold, { shadow: 0.6, edge: 4 }); ctx.restore(); } });
  { const s0 = at(i + 9), tr = wd('bombay', i + 9, s0);
    add({ id: '11.10', at: s0, note: 'a paper steam train crosses the frame (1853)', draw: (lt, d, t) => { K.londonDawn({ t, pan: 0 }); ctx.save(); ctx.fillStyle = 'rgba(233,220,188,0.6)'; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); K.cut(K.P_rr(-400, 740, W + 800, 20, 0), '#5A3E2B', { shadow: 0.3, edge: 2 }); K.train(lerp(-200, 2600, eio(seg(lt, 0, d + 0.5))), 760, 1, t); K.ribbon('1853', 960, 220, eob(seg(lt, tr, tr + 0.4)), 80); } });
    cue(s0 + 0.2, 'slide', { dur: 2 }); }
}
