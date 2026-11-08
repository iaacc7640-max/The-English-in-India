// CH12 · 1857: THE GREAT REVOLT. Cartridges, Meerut, Zafar, the spread, the Rani, the end of the Mughals (no fighting shown).
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
/** a small gold crown at x, y (scale s), rotated rot, alpha a */
function crownAt(x, y, s, rot = 0, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  K.cut(K.P_poly([[-50, 20], [-50, -30], [-25, 0], [0, -40], [25, 0], [50, -30], [50, 20]]), P.gold, { shadow: 0.5, edge: 3 }); ctx.fillStyle = P.crimson; ctx.beginPath(); ctx.arc(0, 4, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
export function build(add, cue) {
  const i = first(12);
  // 0 · But anger had been building: | over lost kingdoms, | heavy taxes, | and new rifle cartridges — one picture per phrase
  { const s0 = at(i), kg = wd('kingdoms', i, s0), tx = wd('taxes', i, s0), ct = wd('cartridges', i, s0);
    const ANNEX = [['PUNJAB 1849', 74.3, 31.2], ['SATARA 1848', 74.0, 17.7], ['JHANSI 1853', 78.57, 25.45], ['NAGPUR 1854', 79.09, 21.15], ['AWADH 1856', 80.95, 26.85]];
    add({ id: '12.01', at: s0, note: 'ANGER: a red wash rises behind a slip', draw: (lt, d, t) => { K.parchment(121); const r = eio(seg(lt, 0, d)); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = P.crimson; ctx.fillRect(-400, H - r * 700, W + 800, 1400); ctx.restore(); K.slip('ANGER', 960, 440, eob(seg(lt, 0.1, 0.5)) * lerp(0.9, 1.2, r), -0.02, 90); } });
    add({ id: '12.01b', at: s0 + kg - 0.35, note: 'lost kingdoms: crowns fall off the states the Company annexed (Punjab, Satara, Jhansi, Nagpur, Awadh)', draw: (lt, d, t) => {
      const pr = map(t, { view: K.VIEWS.india });
      ANNEX.forEach(([n, lo, la], k) => { const [x, y] = pr(lo, la), f = eio(seg(lt, 0.1 + k * 0.13, 0.7 + k * 0.13)); K.pin(x, y, { n, lx: 0, ly: 46 }, 1, { size: 0.5 }); crownAt(x + f * 30, y - 40 + f * 30, 0.5, f * 1.6, 1 - 0.55 * f); });
    } });
    add({ id: '12.01c', at: s0 + tx - 0.3, note: 'heavy taxes: a tax ledger fills with red figures', draw: (lt, d, t) => { K.parchment(122); K.ledger(960, 520, 0.9, seg(lt, 0, d), true); K.slip('LAND TAX', 960, 200, eob(seg(lt, 0.1, 0.4)), -0.02, 50); } });
    add({ id: '12.01d', at: s0 + ct - 0.3, note: 'new rifle cartridges: a sepoy looks at one in his palm', draw: (lt, d, t) => { K.parchment(121); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cast('sepoy', { x: 760, y: 800, h: 520, arm: 55 }); ctx.save(); ctx.translate(1080, 470); ctx.rotate(-0.2); K.cut(K.P_rr(-110, -30, 220, 60, 28), '#D9C49A', { shadow: 0.7, edge: 4 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(-70, -30, 4, 60); ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(-100, -6, 200, 10); ctx.restore(); K.slip('NEW CARTRIDGES', 1180, 300, eob(seg(lt, 0.2, 0.5)), 0.03, 44); } });
    cue(s0 + kg, 'thud', { gain: 0.3 }); cue(s0 + tx, 'page'); }
  { const s0 = at(i + 1);
    add({ id: '12.02', at: s0, note: "rumoured to be greased with cow and pig fat: whispers ('RUMOUR'), two question tags", camera: () => ({ x: 1000, y: 470, zoom: 1.45 }), draw: (lt, d, t) => { K.parchment(121); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cast('sepoy', { x: lerp(760, 700, eio(seg(lt, 0.6, 1.2))), y: 800, h: 520, arm: 55 }); ctx.save(); ctx.translate(1080, 470); ctx.rotate(-0.2); K.cut(K.P_rr(-110, -30, 220, 60, 28), '#D9C49A', { shadow: 0.7, edge: 4 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(-70, -30, 4, 60); ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(-100, -6, 200, 10); ctx.restore(); K.slip('RUMOUR', 1100, 330, eob(seg(lt, 0.1, 0.4)), 0.05, 44); K.tag('COW FAT?', 960, 600, 0.7 * eob(seg(lt, 0.7, 1.0))); K.tag('PIG FAT?', 1230, 600, 0.7 * eob(seg(lt, 0.9, 1.2))); } }); }
  { const s0 = at(i + 2), dl = wd('delhi', i + 2, s0);
    add({ id: '12.03', at: s0, note: 'map: a crimson route Meerut -> Delhi (10 May 1857)', draw: (lt, d, t) => { const pr = map(t, { view: { lon: 78, lat: 28.6, k: 160 }, pins: [['meerut', seg(lt, 0.1, 0.4)], ['delhi', seg(lt, dl - 0.2, dl + 0.1)]] }); K.dashedRoute([[77.7, 28.98], [77.45, 28.8], [77.21, 28.61]].map(([a, b]) => pr(a, b)), eio(seg(lt, 0.5, dl))); K.ribbon('10 MAY 1857', 960, 220, eob(seg(lt, 0.1, 0.5)), 72); } });
    cue(s0 + 0.5, 'steps', { dur: 2 }); }
  add({ id: '12.04', at: at(i + 3), note: 'the Red Fort; the old emperor on a simple throne', draw: (lt, d, t) => { K.mughalCourt({ throne: 'zafar', pan: lerp(-40, 40, eio(clamp(lt / d))), courtiers: false }); K.layer(40, 0.6, () => { K.cast('sepoy', { x: 600, y: 800, h: 360, bow: 0.5 }); K.cast('sepoy', { x: 800, y: 800, h: 360, bow: 0.5 }); }); K.courtForeground(40); } });
  add({ id: '12.05', at: at(i + 4), note: 'map: pins pop at Kanpur, Lucknow, Jhansi', draw: (lt, d, t) => { map(t, { view: K.VIEWS.north, pins: [['delhi', 1], ['meerut', 1], ['kanpur', seg(lt, wd('kanpur', i + 4, at(i + 4)) - 0.1, wd('kanpur', i + 4, at(i + 4)) + 0.2)], ['lucknow', seg(lt, wd('lucknow', i + 4, at(i + 4)) - 0.1, wd('lucknow', i + 4, at(i + 4)) + 0.2)], ['jhansi', seg(lt, wd('jhansi', i + 4, at(i + 4)) - 0.1, wd('jhansi', i + 4, at(i + 4)) + 0.2)]] }); } });
  for (const n of ['kanpur', 'lucknow', 'jhansi']) { try { cue(Wd(n, i + 4), 'pop', { gain: 0.5 }); } catch {} }
  add({ id: '12.06', at: at(i + 5), note: 'Rani Lakshmibai on the ramparts of Jhansi beside her horse', draw: (lt, d, t) => { K.jhansiFort({ t, pan: lerp(-40, 40, eio(clamp(lt / d))) }); K.stamp('LAPSE', 1500, 230, lt < 0.1 ? 1 : 1 - seg(lt, 0.4, 1.0), 0.7); } });
  add({ id: '12.07', at: at(i + 6), note: 'an empty town street, smoke far off (no figures)', draw: (lt, d, t) => { K.riverPort({ t, night: 0.4, fire: 0.6, house: false, pan: lerp(0, 80, eio(clamp(lt / d))) }); K.slip('1857 – 1858', 960, 220, eob(seg(lt, 0.2, 0.6)), -0.02, 56); } });
  { const s0 = at(i + 7), r0 = wd('rangoon', i + 7, s0), e0 = wd('end', i + 7, s0);
    add({ id: '12.08', at: s0, note: 'the old emperor walks to a waiting boat', draw: (lt, d, t) => { K.sea({ t }, (k) => { if (k === 2) K.boat(1420, 720, 1.1, null, t); }); K.cut(K.P_poly([[-400, 760], [1180, 760], [1240, 800], [-400, 800]]), '#C9B48C', { shadow: 0.6, edge: 4 }); K.cut(K.P_rr(1100, 744, 260, 26, 4), '#7A5234', { shadow: 0.5, edge: 3 }); K.cast('zafar', { x: lerp(400, 1180, eio(seg(lt, 0, d))), y: 770, h: 400, walk: t * 4 }); } });
    add({ id: '12.08b', at: s0 + r0 - 0.4, note: 'map: exile route Delhi -> Allahabad -> Calcutta by land, then by sea to Rangoon; the Mughal flag at Delhi comes down', draw: (lt, d, t) => {
      const pr = map(t, { view: { lon: 86.5, lat: 22.5, k: 46 }, pins: [['delhi', 1, { lx: -90, ly: 20 }], ['calcutta', 1], ['rangoon', seg(lt, 0.9, 1.2), { lx: 120, ly: 20 }]] }), dd = e0 - r0 + 0.4;
      const land = [[77.21, 28.61], [79.5, 27.2], [81.85, 25.44], [85.1, 25.6], [87.3, 23.9], [88.36, 22.57]].map(([a, b]) => pr(a, b)), seaR = [[88.36, 22.57], [88.6, 21.3], [91, 19.5], [94.2, 17.2], [96.16, 16.84]].map(([a, b]) => pr(a, b));
      K.dashedRoute(land, eio(seg(lt, 0.05, dd * 0.45))); const h = K.dashedRoute(seaR, eio(seg(lt, dd * 0.45, dd * 0.9))); if (lt > dd * 0.45) K.boat(h[0], h[1], 0.3, null, t);
      const [x, y] = pr(77.21, 28.61); K.flag('mughal', x + 10, y, 180, 0.6, t, eio(seg(lt, dd - 0.1, dd + 0.8)));
      K.slip('EXILED · 1858', 1080, 230, eob(seg(lt, 0.2, 0.6)), 0.03, 48);
    } });
    cue(s0 + r0, 'waves', { dur: 1.6, gain: 0.4 }); cue(s0 + e0 + 0.3, 'thud', { gain: 0.4 }); }
}
