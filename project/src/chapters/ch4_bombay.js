// CH4 · 1668: TEN POUNDS FOR BOMBAY. The wedding, the dowry, the GBP 10 lease, Bombay replaces Surat.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
export function build(add, cue) {
  const i = first(4);   // 41
  add({ id: '4.01', at: at(i), note: 'a wedding garland swings in', draw: (lt, d, t) => K.weddingScene({ g: seg(lt, d * 0.4, d * 0.8) }) });
  { const s0 = at(i + 1), m0 = Wd('married', i + 1) - s0;
    add({ id: '4.02', at: s0, note: '1662: Charles II', camera: () => ({ x: 820, y: 520, zoom: 1.5 }), draw: (lt, d, t) => { K.weddingScene({ g: 1 }); } });
    add({ id: '4.02b', at: s0 + m0 - 0.1, note: 'the wedding pose: Charles and Catherine', draw: (lt, d, t) => { K.weddingScene({ g: 1 }); K.ribbon('1662', 960, 160, eob(seg(lt, 0.1, 0.5)), 70); } }); }
  add({ id: '4.03', at: at(i + 2), note: 'push in on Catherine of Braganza', camera: (lt, d) => ({ x: 1100, y: 520, zoom: lerp(1.3, 1.7, eio(clamp(lt / d))) }), draw: (lt, d, t) => K.weddingScene({ g: 1 }) });
  { const s0 = at(i + 3), b0 = Wd('bombay', i + 3) - s0;
    add({ id: '4.04', at: s0, note: 'the dowry chest opens; paper islands float out', draw: (lt, d, t) => { K.parchment(44); K.dowryChest(960, 780, seg(lt, 0, 0.5), seg(lt, 0.4, d), t); } });
    add({ id: '4.04b', at: s0 + b0 - 0.1, note: 'the seven islands of Bombay, traced from the 1843 map, appear one by one with names', draw: (lt, d, t) => K.bombaySeven(seg(lt, 0, 1.6), t, { title: seg(lt, 1.2, 1.6) }) });
    cue(s0, 'slide', { dur: 0.8 }); for (let k = 0; k < 7; k++) cue(s0 + b0 + k * 0.18, 'pop', { gain: 0.3 }); }
  add({ id: '4.05', at: at(i + 4), note: 'Charles shrugs', draw: (lt, d, t) => K.receiptDesk(0, eob(seg(lt, 0.2, 0.7))) });
  { const s0 = at(i + 5), r0 = Wd('rented', i + 5) - s0;
    add({ id: '4.06', at: s0, note: '1668', draw: (lt, d, t) => { K.receiptDesk(0, 1); K.ribbon('1668', 1060, 260, eob(seg(lt, 0.1, 0.5)), 90); } });
    add({ id: '4.06b', at: s0 + r0 - 0.1, note: 'he rents Bombay to the Company (receipt appears)', draw: (lt, d, t) => { K.receiptDesk(0, 0.5); K.receipt(lerp(700, 1150, eio(seg(lt, 0, d))), 560, 1.1, -0.04); } }); }
  add({ id: '4.07', at: at(i + 6), note: 'the GBP 10 receipt slides across the desk', camera: () => ({ x: 1150, y: 520, zoom: 1.35 }), draw: (lt, d, t) => { K.receiptDesk(0, 0.5); K.receipt(1150, 560, 1.1, -0.04); } });
  cue(at(i + 6) + 0.2, 'coins', { gain: 0.5 });
  // 7-8 · By 1687, Bombay had replaced Surat as the western headquarters — a close map of the Gujarat and Konkan coast
  { const s0 = at(i + 7), e0 = Le(i + 8), mv0 = Wd('replaced', i + 7) - s0; G.ringFill.bombay = at(i + 8) + 0.6;
    const V = { lon: 73.2, lat: 20.3, k: 210 };
    const hqMap = (lt, t, p) => { const pr = K.realMap({ view: V, rings: ringsAt(t), ringLabels: false, compass: false });
      const a = pr(72.83, 21.17), b = pr(72.88, 18.95);
      ctx.save(); ctx.globalAlpha = 1 - 0.45 * p; K.factoryIcon(a[0], a[1], 0.9, 1, { label: 'Surat', place: { lx: -150, ly: 10 } }); ctx.restore();
      K.factoryIcon(b[0] + 10, b[1], 0.9, 1, { label: 'Bombay', place: { lx: -170, ly: 40 } });
      const route = [a, pr(72.6, 20.6), pr(72.65, 19.8), b]; if (p > 0 && p < 1) K.dashedRoute(route, p);
      const q = route[Math.min(3, Math.floor(p * 3))], q2 = route[Math.min(3, Math.floor(p * 3) + 1)], f = (p * 3) % 1;
      const hx = p >= 1 ? b[0] : lerp(q[0], q2[0], f), hy = p >= 1 ? b[1] : lerp(q[1], q2[1], f);
      K.slip('HQ', hx + 110, hy - 70 - Math.sin(p * Math.PI) * 30, 1, 0.04, 50);
      K.label('ARABIAN SEA', 520, 700, 34, 'rgba(62,44,30,0.45)'); };
    add({ id: '4.08', at: s0, note: '1687: close map of the Gujarat and Konkan coast; the HQ sign travels from Surat to Bombay', draw: (lt, d, t) => { hqMap(lt, t, eio(seg(lt, mv0, e0 - s0 - 0.6))); K.ribbon('1687', 1060, 220, eob(seg(lt, 0.1, 0.5)), 80); } });
    cue(s0 + mv0, 'whoosh'); cue(G.ringFill.bombay, 'pop'); }
}
