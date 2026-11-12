// CH0 · COLD OPEN (no card): 1690, the envoys before Aurangzeb; the race to 1757; the title.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, last, G } from './common.js';
const { P } = K;

/** the 1690 court two-shot: envoys at ex (walk-in done at k=1), bow 0..1; used again in CH5 */
export function courtShot(lt, t, o = {}) {
  const pan = o.pan ?? 0;
  K.mughalCourt({ pan, throne: 'aurangzeb', dim: o.dim || 0, courtiers: o.courtiers });
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
  // 8 · the same company would be choosing who ruled Bengal —
  //   A: the map of Bengal under the Nawab's (Bengal Subah) flag; B: Company officials take the Nawab off the throne and seat another
  { const c0 = Wd('choosing', 8) - at(8);
    add({ id: '0.09', at: at(8), note: 'map of Bengal: the Bengal Subah flag at Murshidabad', draw: (lt, d, t) => {
      const pr = K.realMap({ view: K.VIEWS.bengal, compass: false, tint: { region: 'bengal', a: eo(seg(lt, 0, 0.5)), color: 'rgba(63,107,69,0.4)' }, pins: [['murshidabad', seg(lt, 0.1, 0.4)]] });
      const [x, y] = pr(88.27, 24.18); K.flag('bengal', x + 40, y - 10, 220, 0.75 * eob(seg(lt, 0.2, 0.7)), t);
      K.slip('BENGAL', 760, 300, eob(seg(lt, 0.3, 0.7)), -0.02, 70);
    } });
    add({ id: '0.09b', at: at(8) + c0, note: 'Company officials lead the Nawab off the throne and seat another', draw: (lt, d, t) => {
      K.mughalCourt({ throne: '', courtiers: false, seat: 'takht' });
      const k = eio(seg(lt, 0.3, 1.1)), n = eio(seg(lt, 0.9, 1.6)), tx = 1380;
      K.layer(0, 0.6, () => {
        if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; K.cast('siraj', { x: tx - 10 - k * 260, y: 640 + k * 160, h: 300, seated: k < 0.2 ? 1 : 0, dir: -1 }); ctx.restore(); }
        if (n > 0) { ctx.save(); ctx.globalAlpha = n; K.cast('mirjafar', { x: tx - 10, y: 640 - (1 - n) * 50, h: 300, seated: 1, dir: -1 }); ctx.restore(); }
        K.envoy(0, { x: lerp(700, 1000, eo(seg(lt, 0, 0.5))), y: 800, h: 370, arm: 30 + 20 * k, walk: lt < 0.5 ? t * 7 : null });
        K.envoy(1, { x: 1790, y: 800, h: 370, dir: -1, arm: 40 * n });
      });
      K.courtForeground(0);
    } });
    cue(at(8) + 0.05, 'page'); cue(at(8) + c0 + 0.4, 'cloth'); }
  // 9 · So how did a group of traders on their knees — tiny kneeling silhouettes in a big dim hall
  add({ id: '0.10', at: at(9), note: 'wide dim hall: the envoys small, kneeling', camera: (lt, d) => ({ x: 960, y: 560, zoom: lerp(1.0, 0.92, eio(clamp(lt / d))) }),
    draw: (lt, d, t) => { K.mughalCourt({ pan: 40, throne: 'aurangzeb', dim: 0.35 }); K.layer(40, 0.6, () => { K.envoy(0, { x: 640, y: 800, h: 300, bow: 1 }); K.envoy(1, { x: 800, y: 800, h: 310, bow: 1 }); }); K.courtForeground(40); } });
  // 10 · end up making kings? — the subcontinent: each king's flag falls and a Company flag rises in its place; then the TITLE
  { const s0 = at(10), m1 = Le(10) + 0.5 - s0;
    const KINGS = [['mughal', 77.2, 28.6], ['sikh', 74.35, 31.55], ['oudh', 80.95, 26.85], ['bengal', 88.27, 24.18], ['maratha', 73.86, 18.52], ['tiger', 76.69, 12.42]];
    add({ id: '0.11', at: s0, note: "map: the kings' flags fall one by one; Company flags rise", draw: (lt, d, t) => {
      const pr = K.realMap({ view: { lon: 81, lat: 23.2, k: 27 }, compass: false }), y0 = K.FLAGS.year; K.FLAGS.year = 1801;
      KINGS.forEach(([kind, lo, la], j) => { const [x, y] = pr(lo, la), f = eio(seg(lt, 0.25 + j * 0.22, 0.65 + j * 0.22)), r = eob(seg(lt, 0.55 + j * 0.22, 0.95 + j * 0.22));
        if (f < 1) { ctx.save(); ctx.globalAlpha = 1 - f; K.flag(kind, x, y, 150, 0.6, t + j, f * 0.8); ctx.restore(); }
        if (r > 0) K.flag('eic', x, y, 150 * r, 0.6, t + j); });
      K.FLAGS.year = y0;
    } });
    for (let j = 0; j < 6; j++) cue(s0 + 0.55 + j * 0.22, 'cloth', { gain: 0.35 });
    add({ id: '0.12', at: s0 + m1, note: 'TITLE: 1600 -> 1947, FROM MERCHANTS TO MASTERS, THE ENGLISH IN INDIA', draw: (lt, d, t) => {
      K.parchment(12);
      const rs = eob(seg(lt, 0.1, 0.5)); K.ribbon('1600        1947', 960, 300, rs, 104); if (rs > 0) { ctx.save(); ctx.translate(960, 306); ctx.scale(rs, rs); K.cut(K.P_poly([[-60, -10], [30, -10], [30, -30], [70, 0], [30, 30], [30, 10], [-60, 10]]), P.ink, { shadow: 0, edge: 0 }); ctx.restore(); }
      K.slip('FROM MERCHANTS TO MASTERS', 960, 500, eob(seg(lt, 0.4, 0.8)), -0.015, 76);
      ctx.save(); ctx.globalAlpha = clamp(seg(lt, 0.8, 1.2)); K.label('THE ENGLISH IN INDIA', 960, 640, 46, P.sepia); ctx.restore();
      const ss = seg(lt, 1.1, 1.3); if (ss > 0) { ctx.save(); ctx.globalAlpha = clamp(ss * 3); K.seal(1420, 590, lerp(1.6, 0.7, eo(ss)), 'E'); ctx.restore(); }
    } });
    cue(s0 + m1 + 0.1, 'whoosh'); cue(s0 + m1 + 0.4, 'page'); cue(s0 + m1 + 1.15, 'seal'); }
}
/** a gold turban held by an English hand from the top right */
export function turbanInHand(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  K.cut(K.P_rr(60, -300, 70, 300, 30), P.crimson, { shadow: 0.7, edge: 4 }); K.cut(K.P_rr(52, -40, 86, 40, 12), '#F5EEDD', { shadow: 0.3, edge: 3 });
  K.turbanProp(0, 40, 1);
  ctx.restore();
}
