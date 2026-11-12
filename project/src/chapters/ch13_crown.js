// CH13 · 1858: THE CROWN TAKES OVER. The Act of 1858, the pardon, 1874, Empress 1877, the drain of wealth.
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
  const i = first(13);
  add({ id: '13.01', at: at(i), note: "the Company's ensign lowers; the Union flag rises", draw: (lt, d, t) => { K.redFort({ t }); K.flag('eic', 700, 800, lerp(500, 0, eio(seg(lt, 0.3, d * 0.6))), 0.9, t); K.flag('union', 1220, 800, lerp(0, 500, eio(seg(lt, d * 0.5, d))), 0.9, t); K.ribbon('1858', 420, 230, eob(seg(lt, 0.1, 0.5)), 70); } });
  flyDoc(add, cue, '13.02', i + 1, 6, 'act1858', 'GOVERNMENT OF INDIA ACT · 1858');
  add({ id: '13.03', at: at(i + 2), note: 'a pardon scroll over a quiet street', draw: (lt, d, t) => { K.riverPort({ t, night: 0.2, house: false }); K.farman('act1858', 960, 440, 800, 380, seg(lt, 0, 0.5), seg(lt, 0.6, 0.85), [{ text: 'PARDON', y: 100, size: 64 }]); } });
  cue(at(i + 2), 'scroll');
  add({ id: '13.04', at: at(i + 3), note: 'the 1600 charter tears quietly in two (1874)', draw: (lt, d, t) => { K.parchment(134); const k = eio(seg(lt, 0.5, d)); for (const sx of [-1, 1]) { ctx.save(); ctx.translate(960 + sx * 120 * k, 470 + 40 * k); ctx.rotate(sx * 0.15 * k); ctx.beginPath(); ctx.rect(sx < 0 ? -400 : 0, -400, 400, 800); ctx.clip(); K.cut(K.P_rr(-200, -300, 400, 560, 6), '#EFE4CC', { shadow: 0.7, edge: 4 }); for (let r = 0; r < 9; r++) { ctx.fillStyle = 'rgba(62,44,30,0.5)'; ctx.fillRect(-160, -230 + r * 44, 320, 6); } K.seal(0, 200, 0.5, 'E'); ctx.restore(); } K.ribbon('1874', 480, 240, eob(seg(lt, 0.1, 0.5)), 70); } });
  cue(at(i + 3) + 0.6, 'page');
  add({ id: '13.05', at: at(i + 4), note: 'a durbar: an elephant, flags, Victoria (1877)', draw: (lt, d, t) => { K.parchment(135); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900); K.cut(K.P_rr(-400, 800, W + 800, 400, 0), '#C9B48C', { shadow: 0, edge: 0 }); K.elephant(lerp(300, 520, eio(clamp(lt / d))), 800, 1.1); K.cast('victoria', { x: 1300, y: 800, h: 460, dir: -1, arm: 20 }); for (let k = 0; k < 4; k++) K.flag('union', 900 + k * 120, 800, 380, 0.4, t + k); K.ribbon('1877', 480, 240, eob(seg(lt, 0.1, 0.5)), 70); } });
  add({ id: '13.06', at: at(i + 5), note: 'Naoroji with a book; coins flow along an arrow from India to Britain', draw: (lt, d, t) => { const pr = K.realMap({ view: K.VIEWS.world, compass: false }); const a = pr(78, 21), b = pr(-1, 52); K.dashedRoute([a, [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5) - 120], b], eio(seg(lt, 0.3, 1.5))); for (let k = 0; k < 6; k++) { const p = (lt * 0.4 + k / 6) % 1; K.coin(lerp(a[0], b[0], p), lerp(a[1], b[1], p) - Math.sin(p * Math.PI) * 120, 16); } K.cast('naoroji', { x: 1500, y: 800, h: 460, dir: -1, arm: 40 }); K.slip('THE DRAIN OF WEALTH', 560, 250, eob(seg(lt, 0.6, 1)), -0.02, 48); } });
  cue(at(i + 5) + 0.5, 'coins', { gain: 0.5 });
}
