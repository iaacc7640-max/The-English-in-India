// CH14 · 1885: A VOICE FOR INDIA. Congress, petitions, the 1905 partition of Bengal, Swadeshi, 1911.
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
  const i = first(14);
  add({ id: '14.01', at: at(i), note: 'a hall in Bombay; delegates around a long table (1885)', draw: (lt, d, t) => K.congressHall({ t }) });
  add({ id: '14.02', at: at(i + 1), note: 'a petition scroll handed over a desk', draw: (lt, d, t) => { K.parchment(142); K.cut(K.P_rr(300, 600, 1300, 50, 8), '#5A3E2B', { shadow: 0.8, edge: 4 }); K.cast('naoroji', { x: 520, y: 800, h: 460, arm: 50, prop: 'scroll' }); K.cast('curzon', { x: 1400, y: 800, h: 460, dir: -1 }); K.slip('PETITION', 960, 300, eob(seg(lt, 0.2, 0.6)), -0.02, 56); } });
  { const s0 = at(i + 2), sp = wd('split', i + 2, s0);
    add({ id: '14.03', at: s0, note: 'map of Bengal: a crimson line cuts it in two (1905)', draw: (lt, d, t) => { const pr = map(t, { view: { lon: 88.5, lat: 24, k: 70 }, pins: [['calcutta', 1]] }); K.dashedRoute([[86.5, 26.8], [88.2, 25.5], [88.6, 24.2], [88.9, 22.6], [89.1, 21.6]].map(([a, b]) => pr(a, b)), eio(seg(lt, sp - 0.2, d))); K.cast('curzon', { x: 300, y: 800, h: 440, arm: 40 }); K.ribbon('1905', 960, 200, eob(seg(lt, 0.1, 0.5)), 80); } });
    cue(s0 + sp, 'slide', { dur: 1 }); }
  add({ id: '14.04', at: at(i + 3), note: 'a peaceful crowd with banners', draw: (lt, d, t) => K.crowdBanner('SWADESHI', { t, banner: seg(lt, 0.1, 0.5) }) });
  add({ id: '14.05', at: at(i + 4), note: "a 'BOYCOTT' stamp on a cloth bale; a spinning wheel", draw: (lt, d, t) => { K.parchment(145); K.cut(K.P_rr(260, 420, 520, 360, 20), '#EFE4CC', { shadow: 0.8, edge: 5 }); for (let r = 0; r < 5; r++) { ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(260, 460 + r * 70, 520, 6); } K.slip('BRITISH CLOTH', 520, 380, 1, -0.02, 40); K.stamp('BOYCOTT', 520, 600, seg(lt, 0.3, 0.6), 1); K.charkha(1300, 790, 1.4, t * (lt > 1 ? 1 : 0)); K.slip('SWADESHI', 1300, 380, eob(seg(lt, 1.2, 1.6)), 0.02, 50); } });
  cue(at(i + 4) + 0.3, 'seal');
  add({ id: '14.06', at: at(i + 5), note: "the line fades; a 'CAPITAL' slip hops from Calcutta to Delhi (1911)", draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india, pins: [['delhi', 1]] }); const a = pr(88.36, 22.57), b = pr(77.21, 28.61), p = eio(seg(lt, 0.6, d)); K.slip('CAPITAL', lerp(a[0], b[0], p), lerp(a[1], b[1], p) + 50 + Math.sin(p * Math.PI) * 60, 1, 0.03, 44); K.ribbon('1911', 1450, 640, eob(seg(lt, 0.1, 0.5)), 80); } });
}
