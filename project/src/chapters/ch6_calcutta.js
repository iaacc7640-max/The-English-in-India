// CH6 · 1690: THREE VILLAGES. Aurangzeb's 1691 farman, Charnock at Sutanuti, Sobha Singh, the three villages, Fort William, the 2003 ruling.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
export function build(add, cue) {
  const i = first(6);   // 65
  { const s0 = at(i), d0 = at(i + 1) - s0, fly0 = d0 - 0.8; G.stackLand[3] = s0 + fly0 + 0.75;
    add({ id: '6.01', at: s0, note: "Aurangzeb's 1691 farman: 'continue contentedly their trade' (the book's quoted line)", draw: (lt, d, t) => {
      K.parchment(65); if (lt < fly0) K.farman('aurangzeb', 960, 470, 1100, 460, seg(lt, 0, 0.5), seg(lt, 0.8, 1.05), [{ text: '“…continue contentedly', y: 160, size: 56 }, { text: 'their trade…”', y: 236, size: 56 }, { text: 'AURANGZEB · 1691', y: 340, size: 34 }]);
    }, overlay: (lt) => { if (lt >= fly0 && lt < fly0 + 0.75) K.farmanFly(3, seg(lt, fly0, fly0 + 0.75), [960, 470], 4); } });
    cue(s0, 'scroll'); cue(s0 + 0.8, 'seal'); cue(s0 + fly0, 'whoosh'); }
  { const s0 = at(i + 1);
    add({ id: '6.02', at: s0, note: 'August 1690: Charnock in a boat on the Hooghly', draw: (lt, d, t) => { K.sutanuti({ t, boatX: lerp(-200, 700, eio(clamp(lt / (d + 2)))), charnock: 1, pan: lerp(-60, 0, eio(clamp(lt / d))) }); K.ribbon('AUG 1690', 1320, 230, eob(seg(lt, 0.1, 0.5)), 76); } }); }
  add({ id: '6.03', at: at(i + 2), note: 'the boat drifts to the riverbank in monsoon light; Sutanuti', draw: (lt, d, t) => { K.sutanuti({ t, boatX: lerp(560, 760, eio(clamp(lt / d))), charnock: 1 }); K.slip('SUTANUTI', 960, 260, eob(seg(lt, d * 0.5, d * 0.5 + 0.4)), -0.02, 56); } });
  cue(at(i + 2), 'waves', { dur: 2.0, gain: 0.5 });
  { const s0 = at(i + 3), r0 = Wd('rebelled', i + 3) - s0;
    add({ id: '6.04', at: s0, note: 'a local zamindar, Sobha Singh, rides past far away', draw: (lt, d, t) => { K.sutanuti({ t, boatX: 760, rider: seg(lt, 0, d) }); } });
    add({ id: '6.04b', at: s0 + r0 + 0.2, note: 'push on the rider: 1696', camera: () => ({ x: 1180, y: 430, zoom: 1.8 }), draw: (lt, d, t) => { K.sutanuti({ t, boatX: 760, rider: lerp(0.62, 0.9, clamp(lt / d)) }); K.ribbon('1696', 1180, 280, eob(seg(lt, 0.1, 0.5)), 50); } }); }
  add({ id: '6.05', at: at(i + 4), note: 'the English start stacking bricks: walls', draw: (lt, d, t) => { K.sutanuti({ t, walls: 0 }); K.fortRise(960, 790, 1.2, seg(lt, 0.2, d)); } });
  for (let k = 0; k < 5; k++) cue(at(i + 4) + 0.2 + k * 0.32, 'brick', { gain: 0.6 });
  { const s0 = at(i + 5);
    add({ id: '6.06', at: s0, note: '1698: three villages, three signs', draw: (lt, d, t) => { K.sutanuti({ t, signs: [seg(lt, 0.4, 0.7), seg(lt, 0.6, 0.9), seg(lt, 0.8, 1.1)] }); } });
    for (let k = 0; k < 3; k++) cue(s0 + 0.4 + k * 0.2, 'pop', { gain: 0.45 }); }
  add({ id: '6.07', at: at(i + 6), note: 'each sign lights as it is named', camera: () => ({ x: 960, y: 560, zoom: 1.15 }), draw: (lt, d, t) => { K.sutanuti({ t, signs: [1, 1, 1] }); } });
  add({ id: '6.08', at: at(i + 7), note: 'coins counted: Rs 1,200', draw: (lt, d, t) => { K.parchment(72); const n = Math.floor(24 * eo(seg(lt, 0, d * 0.8))); ctx.save(); ctx.translate(960, 720); ctx.scale(2.2, 2.2); K.coinStacks(-74, 0, n, 8, '#D9D2C2'); ctx.restore(); K.slip('Rs 1,200', 960, 320, eob(seg(lt, 0.2, 0.6)), -0.02, 70); } });
  cue(at(i + 7), 'coins');
  { const s0 = at(i + 8), w0 = Wd('william', i + 8) - s0;
    add({ id: '6.09', at: s0, note: '1700: the walls close into Fort William', draw: (lt, d, t) => { K.sutanuti({ t, walls: seg(lt, 0, w0), fortName: seg(lt, w0 - 0.1, w0 + 0.3) }); K.ribbon('1700', 300, 230, eob(seg(lt, 0.1, 0.5)), 70); } });
    cue(s0 + w0 - 0.2, 'thud', { gain: 0.6 }); }
  { const s0 = at(i + 9), c0 = Wd('calcutta', i + 9) - s0; G.ringFill.calcutta = s0 + c0;
    add({ id: '6.10', at: s0, note: 'map: the Calcutta ring fills', draw: (lt, d, t) => K.realMap({ view: K.VIEWS.bengal, rings: ringsAt(t), pins: [['hooghly', 1], ['kasimbazar', 1], ['balasore', 1]] }) });
    cue(G.ringFill.calcutta, 'pop'); }
  add({ id: '6.11', at: at(i + 10), note: "Charnock with a 'FOUNDER?' slip", draw: (lt, d, t) => { K.sutanuti({ t, walls: 1 }); K.cast('charnock', { x: 520, y: 800, h: 480, arm: 10 }); K.slip('FOUNDER?', 760, 300, eob(seg(lt, 0.4, 0.8)), 0.05, 60); } });
  { const s0 = at(i + 11), h0 = Wd('ruled', i + 11) - s0;
    add({ id: '6.12', at: s0, note: "the judge's gavel slip: 2003", draw: (lt, d, t) => { K.parchment(76); K.gavel(960, 640, 1.4, seg(lt, h0 - 0.2, h0)); K.ribbon('2003', 960, 260, eob(seg(lt, 0.1, 0.5)), 90); K.slip('CALCUTTA HIGH COURT', 1360, 560, eob(seg(lt, 0.5, 0.9)), -0.02, 48); } });
    cue(s0 + h0, 'thud'); }
  add({ id: '6.13', at: at(i + 12), note: 'pull back: a busy market that was already there', camera: (lt, d) => ({ x: 960, y: 560, zoom: lerp(1.25, 1.0, eio(clamp(lt / d))) }), draw: (lt, d, t) => K.sutanuti({ t, market: seg(lt, 0, d * 0.7) }) });
}
