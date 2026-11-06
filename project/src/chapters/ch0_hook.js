// CH0 · COLD OPEN (no card): 1690, the envoys before Aurangzeb; the race to 1757; the title.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, last, G } from './common.js';
const { P } = K;

/** the 1690 court two-shot: envoys at ex (walk-in done at k=1), bow 0..1; used again in CH5 */
export function courtShot(lt, t, o = {}) {
  const pan = o.pan ?? 0;
  K.mughalCourt({ pan, throne: 'aurangzeb', dim: o.dim || 0 });
  K.layer(pan, 0.6, () => {
    const walk = o.walkK ?? 1, bow = o.bow || 0;
    K.envoy(0, { x: lerp(-200, 640, walk), y: 800, h: 360, bow, walk: walk < 1 ? t * 7 : null, arm: bow ? 10 : 0 });
    K.envoy(1, { x: lerp(-380, 820, walk), y: 800, h: 370, bow: bow * 0.95, walk: walk < 1 ? t * 7 + 1.3 : null });
    if (o.bag) K.moneybag(1000, 800 - 40 * (1 - eo(clamp(o.bag))), 0.5 * clamp(o.bag * 3), o.bagText || '');
  });
  K.courtForeground(pan);
}
export function build(add, cue) {
  // 0 · In 1690 — wide court, slow lateral pan, soft gong
  add({ id: '0.01', at: 0, note: 'wide Mughal court, pan right', draw: (lt, d, t) => { const pan = lerp(-160, 40, eio(clamp(lt / d))); K.mughalCourt({ pan, throne: 'aurangzeb' }); K.courtForeground(pan); } });
  cue(0.05, 'gong', { gain: 0.55 });
  // 1 · envoys of the English East India Company — they walk in from the left
  add({ id: '0.02', at: at(1), note: 'two envoys walk in from the left', draw: (lt, d, t) => courtShot(lt, t, { pan: 40, walkK: eo(clamp(lt / (d * 0.9))) }) });
  cue(at(1) + 0.2, 'steps', { dur: 1.8 });
  // 2 · before Emperor Aurangzeb — push toward the throne
  add({ id: '0.03', at: at(2), note: 'push in on Aurangzeb', camera: (lt, d) => ({ x: lerp(1150, 1330, eio(clamp(lt / d))), y: lerp(520, 470, eio(clamp(lt / d))), zoom: lerp(1.25, 1.6, eio(clamp(lt / d))) }),
    draw: (lt, d, t) => courtShot(lt, t, { pan: 40 }) });
  // 3 · bowed to the ground
  { const b0 = Wd('bowed', 3) - at(3);
    add({ id: '0.04', at: at(3), note: 'envoys bow low', camera: () => ({ x: 900, y: 560, zoom: 1.12 }), draw: (lt, d, t) => courtShot(lt, t, { pan: 40, bow: eio(seg(lt, b0, b0 + 0.9)) }) });
    cue(at(3) + b0, 'cloth'); }
  // 4 · paid a heavy fine — the moneybag is set down
  { const f0 = Wd('fine', 4) - at(4);
    add({ id: '0.05', at: at(4), note: 'moneybag set down before the throne', camera: () => ({ x: 960, y: 600, zoom: 1.3 }), draw: (lt, d, t) => courtShot(lt, t, { pan: 40, bow: 1, bag: seg(lt, f0 - 0.4, f0 + 0.1) }) });
    cue(at(4) + f0, 'coins'); }
  // 5 · and begged for a pardon — pardon scroll + green seal
  { const p0 = Wd('pardon', 5) - at(5);
    add({ id: '0.06', at: at(5), note: 'pardon scroll unrolls, green seal stamps', draw: (lt, d, t) => { courtShot(lt, t, { pan: 40, bow: 1, bag: 1, dim: 0.45 }); K.farman('aurangzeb', 960, 440, 980, 520, seg(lt, 0, 0.5), seg(lt, p0, p0 + 0.25)); } });
    cue(at(5) + 0.02, 'scroll'); cue(at(5) + p0, 'seal'); }
  // 6 · They had just lost a war against the Mughal Empire — map flash, Mughal green; a tiny Company flag shrinks
  add({ id: '0.07', at: at(6), note: 'map: India in Mughal green, the Company flag shrinks', draw: (lt, d, t) => {
    const pr = K.realMap({ view: K.VIEWS.india, tint: { region: 'india', a: eo(seg(lt, 0, 0.6)), color: 'rgba(63,107,69,0.55)' } });
    const [x, y] = pr(72.88, 19.08); K.flag('eic', x, y, 150, lerp(0.9, 0.25, eio(seg(lt, 0.8, d))), t);
    const [mx, my] = pr(77.2, 26); K.flag('mughal', mx, my, 220, eob(seg(lt, 0.2, 0.6)) * 1.0, t);
  } });
  cue(at(6), 'page');
  // 7 · Yet less than seventy years later — the era marker races 1690 -> 1757 (big timeline + the bar)
  { const s0 = at(7); G.eraRace = { t0: s0 + 0.15, t1: Le(7) };
    add({ id: '0.08', at: s0, note: 'big timeline: the marker races 1690 -> 1757', draw: (lt, d, t) => {
      K.parchment(8); const p = lerp(5 / 7, 1, eio(seg(t, G.eraRace.t0, G.eraRace.t1)));
      K.timeline([1600, 1612, 1639, 1668, 1686, 1690, 1717, 1757], 260, 480, 1400, p, p > 0.98 ? 7 : 5);
      K.ribbon(String(Math.round(lerp(1690, 1757, eio(seg(t, G.eraRace.t0, G.eraRace.t1))))), 960, 300, 1, 96);
    } });
    cue(s0 + 0.15, 'whoosh', { dur: 1.2 }); }
  // 8 · the same company would be choosing who ruled Bengal — cushion; the English hand lowers a turban, stops short
  { const b0 = Wd('bengal', 8) - at(8);
    add({ id: '0.09', at: at(8), note: 'Bengal throne cushion; an English hand lowers a turban (stops short)', draw: (lt, d, t) => {
      K.cushionScene(); const hy = lerp(-260, 0, eio(seg(lt, 0, b0 + 0.3)));
      K.cushion(900, 700, 1.1, false); turbanInHand(1010, 520 + hy, 1.1);
    } }); }
  // 9 · So how did a group of traders on their knees — tiny kneeling silhouettes in a big dim hall
  add({ id: '0.10', at: at(9), note: 'wide dim hall: the envoys small, kneeling', camera: (lt, d) => ({ x: 960, y: 560, zoom: lerp(1.0, 0.92, eio(clamp(lt / d))) }),
    draw: (lt, d, t) => { K.mughalCourt({ pan: 40, throne: 'aurangzeb', dim: 0.35 }); K.layer(40, 0.6, () => { K.envoy(0, { x: 640, y: 800, h: 300, bow: 1 }); K.envoy(1, { x: 800, y: 800, h: 310, bow: 1 }); }); K.courtForeground(40); } });
  // 10 · end up making kings? — TITLE: ribbon 1600 -> 1717, slip FROM MERCHANTS TO MASTERS, wax seal (holds into the gap)
  { const s0 = at(10);
    add({ id: '0.11', at: s0, note: 'TITLE: 1600 -> 1717, FROM MERCHANTS TO MASTERS', draw: (lt, d, t) => {
      K.parchment(12); K.cushion(960, 790, 0.62, true, 0); ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = P.ink; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
      const rs = eob(seg(lt, 0.15, 0.55)); K.ribbon('1600        1717', 960, 300, rs, 104); if (rs > 0) { ctx.save(); ctx.translate(960, 306); ctx.scale(rs, rs); K.cut(K.P_poly([[-60, -10], [30, -10], [30, -30], [70, 0], [30, 30], [30, 10], [-60, 10]]), P.ink, { shadow: 0, edge: 0 }); ctx.restore(); }
      K.slip('FROM MERCHANTS TO MASTERS', 960, 500, eob(seg(lt, 0.5, 0.9)), -0.015, 76);
      const ss = seg(lt, 0.95, 1.15); if (ss > 0) { ctx.save(); ctx.globalAlpha = clamp(ss * 3); K.seal(1420, 590, lerp(1.6, 0.7, eo(ss)), 'E'); ctx.restore(); }
      K.label('THE ENGLISH IN INDIA', 960, 640, 40, P.sepia);
    } });
    cue(s0 + 0.15, 'whoosh'); cue(s0 + 0.5, 'page'); cue(s0 + 1.0, 'seal'); }
}
/** a gold turban held by an English hand from the top right */
export function turbanInHand(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.cut(K.P_rr(60, -300, 70, 300, 30), P.crimson, { shadow: 0.7, edge: 4 }); K.cut(K.P_rr(52, -40, 86, 40, 12), '#F5EEDD', { shadow: 0.3, edge: 3 });
  K.turbanProp(0, 40, 1);
  ctx.restore();
}
