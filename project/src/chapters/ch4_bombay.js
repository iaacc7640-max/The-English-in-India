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
  add({ id: '4.04', at: at(i + 3), note: 'the dowry chest opens; seven paper islands float out', draw: (lt, d, t) => { K.parchment(44); K.dowryChest(960, 780, seg(lt, 0, 0.5), seg(lt, 0.4, d), t); } });
  cue(at(i + 3), 'slide', { dur: 0.8 });
  add({ id: '4.05', at: at(i + 4), note: 'Charles shrugs', draw: (lt, d, t) => K.receiptDesk(0, eob(seg(lt, 0.2, 0.7))) });
  { const s0 = at(i + 5), r0 = Wd('rented', i + 5) - s0;
    add({ id: '4.06', at: s0, note: '1668', draw: (lt, d, t) => { K.receiptDesk(0, 1); K.ribbon('1668', 1060, 260, eob(seg(lt, 0.1, 0.5)), 90); } });
    add({ id: '4.06b', at: s0 + r0 - 0.1, note: 'he rents Bombay to the Company (receipt appears)', draw: (lt, d, t) => { K.receiptDesk(0, 0.5); K.receipt(lerp(700, 1150, eio(seg(lt, 0, d))), 560, 1.1, -0.04); } }); }
  add({ id: '4.07', at: at(i + 6), note: 'the GBP 10 receipt slides across the desk', camera: () => ({ x: 1150, y: 520, zoom: 1.35 }), draw: (lt, d, t) => { K.receiptDesk(0, 0.5); K.receipt(1150, 560, 1.1, -0.04); } });
  cue(at(i + 6) + 0.2, 'coins', { gain: 0.5 });
  { const s0 = at(i + 7), b0 = Wd('bombay', i + 7) - s0;
    add({ id: '4.08', at: s0, note: '1687: the seven islands drift together into one Bombay', draw: (lt, d, t) => { K.bombayIslands(eio(seg(lt, 0.1, d)), t); K.ribbon('1687', 960, 250, eob(seg(lt, 0.1, 0.5)), 80); } }); }
  { const s0 = at(i + 8), d0 = Le(i + 8) - s0; G.ringFill.bombay = s0 + d0 * 0.6;
    add({ id: '4.09', at: s0, note: 'map: an HQ sign hops from Surat to Bombay; the Bombay ring fills', draw: (lt, d, t) => {
      const pr = K.realMap({ view: K.VIEWS.west, rings: ringsAt(t), pins: [['surat', 1]] }); const a = pr(72.83, 21.17), b = pr(72.88, 19.08), p = eio(seg(lt, 0.1, d0 * 0.55));
      K.slip('HQ', lerp(a[0], b[0], p) + 70, lerp(a[1], b[1], p) - 60 - Math.sin(p * Math.PI) * 120, 1, 0.04, 50);
    } });
    cue(G.ringFill.bombay, 'pop'); }
}
