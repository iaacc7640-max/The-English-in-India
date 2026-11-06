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
export function build(add, cue) {
  const i = first(12);
  add({ id: '12.01', at: at(i), note: 'a sepoy looks at a cartridge in his palm', draw: (lt, d, t) => { K.parchment(121); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cast('sepoy', { x: 760, y: 800, h: 520, arm: 55 }); ctx.save(); ctx.translate(1080, 470); ctx.rotate(-0.2); K.cut(K.P_rr(-110, -30, 220, 60, 28), '#D9C49A', { shadow: 0.7, edge: 4 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(-70, -30, 4, 60); ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(-100, -6, 200, 10); ctx.restore(); } });
  add({ id: '12.02', at: at(i + 1), note: "close-up on the cartridge; slip 'RUMOUR'", camera: () => ({ x: 1000, y: 470, zoom: 1.6 }), draw: (lt, d, t) => { K.parchment(121); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.cast('sepoy', { x: lerp(760, 700, eio(seg(lt, 0.6, 1.2))), y: 800, h: 520, arm: 55 }); ctx.save(); ctx.translate(1080, 470); ctx.rotate(-0.2); K.cut(K.P_rr(-110, -30, 220, 60, 28), '#D9C49A', { shadow: 0.7, edge: 4 }); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(-70, -30, 4, 60); ctx.fillStyle = 'rgba(62,44,30,0.25)'; ctx.fillRect(-100, -6, 200, 10); ctx.restore(); K.slip('RUMOUR', 1130, 360, eob(seg(lt, 0.2, 0.5)), 0.05, 44); } });
  { const s0 = at(i + 2), dl = wd('delhi', i + 2, s0);
    add({ id: '12.03', at: s0, note: 'map: a crimson route Meerut -> Delhi (10 May 1857)', draw: (lt, d, t) => { const pr = map(t, { view: { lon: 78, lat: 28.6, k: 160 }, pins: [['meerut', seg(lt, 0.1, 0.4)], ['delhi', seg(lt, dl - 0.2, dl + 0.1)]] }); K.dashedRoute([[77.7, 28.98], [77.45, 28.8], [77.21, 28.61]].map(([a, b]) => pr(a, b)), eio(seg(lt, 0.5, dl))); K.ribbon('10 MAY 1857', 960, 220, eob(seg(lt, 0.1, 0.5)), 72); } });
    cue(s0 + 0.5, 'steps', { dur: 2 }); }
  add({ id: '12.04', at: at(i + 3), note: 'the Red Fort; the old emperor on a simple throne', draw: (lt, d, t) => { K.mughalCourt({ throne: 'zafar', pan: lerp(-40, 40, eio(clamp(lt / d))), courtiers: false }); K.layer(40, 0.6, () => { K.cast('sepoy', { x: 600, y: 800, h: 360, bow: 0.5 }); K.cast('sepoy', { x: 800, y: 800, h: 360, bow: 0.5 }); }); K.courtForeground(40); } });
  add({ id: '12.05', at: at(i + 4), note: 'map: pins pop at Kanpur, Lucknow, Jhansi', draw: (lt, d, t) => { map(t, { view: K.VIEWS.north, pins: [['delhi', 1], ['meerut', 1], ['kanpur', seg(lt, wd('kanpur', i + 4, at(i + 4)) - 0.1, wd('kanpur', i + 4, at(i + 4)) + 0.2)], ['lucknow', seg(lt, wd('lucknow', i + 4, at(i + 4)) - 0.1, wd('lucknow', i + 4, at(i + 4)) + 0.2)], ['jhansi', seg(lt, wd('jhansi', i + 4, at(i + 4)) - 0.1, wd('jhansi', i + 4, at(i + 4)) + 0.2)]] }); } });
  for (const n of ['kanpur', 'lucknow', 'jhansi']) { try { cue(Wd(n, i + 4), 'pop', { gain: 0.5 }); } catch {} }
  add({ id: '12.06', at: at(i + 5), note: 'Rani Lakshmibai on the ramparts of Jhansi beside her horse', draw: (lt, d, t) => { K.jhansiFort({ t, pan: lerp(-40, 40, eio(clamp(lt / d))) }); K.stamp('LAPSE', 1500, 230, lt < 0.1 ? 1 : 1 - seg(lt, 0.4, 1.0), 0.7); } });
  add({ id: '12.07', at: at(i + 6), note: 'an empty town street, smoke far off (no figures)', draw: (lt, d, t) => { K.riverPort({ t, night: 0.4, fire: 0.6, house: false, pan: lerp(0, 80, eio(clamp(lt / d))) }); K.slip('1857 – 1858', 960, 220, eob(seg(lt, 0.2, 0.6)), -0.02, 56); } });
  add({ id: '12.08', at: at(i + 7), note: 'the emperor walks to a boat; the green Mughal flag is folded', draw: (lt, d, t) => { K.sea({ t }, (k) => { if (k === 2) K.boat(1420, 720, 1.1, null, t); }); K.cut(K.P_poly([[-400, 760], [1180, 760], [1240, 800], [-400, 800]]), '#C9B48C', { shadow: 0.6, edge: 4 }); K.cut(K.P_rr(1100, 744, 260, 26, 4), '#7A5234', { shadow: 0.5, edge: 3 }); K.cast('zafar', { x: lerp(400, 1180, eio(seg(lt, 0, d * 0.8))), y: 770, h: 400, walk: t * 4 }); K.flag('mughal', 200, 770, 300, 0.8, t, eio(seg(lt, d * 0.5, d))); K.slip('RANGOON', 1460, 260, eob(seg(lt, 0.3, 0.7)), 0.03, 50); } });
}
