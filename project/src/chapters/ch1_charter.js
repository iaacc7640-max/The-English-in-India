// CH1 · 1600: A QUEEN'S CHARTER. London, Drake, the Armada, Portuguese riches, the charter, the Dutch, India and cloth.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
export function build(add, cue) {
  const i = first(1);   // 11
  add({ id: '1.01', at: at(i), note: 'London river at dawn, parallax pan', draw: (lt, d, t) => K.londonDawn({ t, pan: lerp(-120, 80, eio(clamp(lt / d))) }) });
  cue(at(i) + 0.1, 'waves', { dur: 2.4, gain: 0.6 });
  add({ id: '1.02', at: at(i + 1), note: 'a tiny ship circles a paper globe', draw: (lt, d, t) => { K.parchment(14); K.globe(960, 460, 260, eio(seg(lt, 0.1, d)), t); K.slip('FRANCIS DRAKE', 1480, 220, eob(seg(lt, 0.2, 0.6)), 0.03, 44); } });
  { const s0 = at(i + 2), b0 = Wd('beaten', i + 2) - s0;
    add({ id: '1.03', at: s0, note: '1588: the Armada sails in under the ribbon', draw: (lt, d, t) => { K.armada(0, t); K.ribbon('1588', 960, 250, eob(seg(lt, 0.1, 0.5)), 100); } });
    add({ id: '1.03b', at: s0 + b0 - 0.1, note: 'the Armada sails tip over like paper cut-outs', draw: (lt, d, t) => K.armada(seg(lt, 0.1, d), t) });
    cue(s0 + b0 + 0.1, 'slide', { dur: 1.2 }); }
  { const s0 = at(i + 3), p0 = Wd('portuguese', i + 3) - s0;
    add({ id: '1.04', at: s0, note: 'London merchant hears the news (ledger)', draw: (lt, d, t) => { K.londonDawn({ t, pan: 60 }); K.cast('merchant', { x: 760, y: 800, h: 460, arm: 15 }); K.cast('merchant', { x: 1080, y: 800, h: 440, dir: -1, arm: 40, prop: 'letter' }); } });
    add({ id: '1.04b', at: s0 + p0 - 0.1, note: 'merchants peer at a pile of Portuguese coins', draw: (lt, d, t) => { K.parchment(15); K.coinPile(960, 720, 34, 1.1); K.flag('portugal', 1380, 760, 360, 0.9, t); K.cast('merchant', { x: 470, y: 800, h: 460, bow: 0.35 }); } });
    cue(s0 + p0, 'coins'); }
  add({ id: '1.05', at: at(i + 4), note: 'the ledger snaps open: wanted a share', camera: () => ({ x: 640, y: 560, zoom: 1.4 }), draw: (lt, d, t) => { K.parchment(15); K.coinPile(960, 720, 34, 1.1); K.cast('merchant', { x: 470, y: 800, h: 460, bow: 0.2, arm: lerp(15, 70, eob(seg(lt, 0.1, 0.4))) }); } });
  cue(at(i + 4) + 0.1, 'page');
  add({ id: '1.06', at: at(i + 5), note: 'ribbon 31 DEC 1600', draw: (lt, d, t) => { K.parchment(16); K.ribbon('31 DEC 1600', 960, 420, eob(seg(lt, 0.1, 0.5)), 110); } });
  cue(at(i + 5) + 0.1, 'whoosh');
  { const s0 = at(i + 6), d0 = Le(i + 6) - s0;
    add({ id: '1.07', at: s0, note: 'Elizabeth signs the charter (quill)', draw: (lt, d, t) => K.charterScene({ sign: seg(lt, 0.4, d0 * 0.55) }) });
    add({ id: '1.07b', at: s0 + d0 * 0.55, note: 'push in: the signature and the charter', camera: () => ({ x: 980, y: 560, zoom: 1.6 }), draw: (lt, d, t) => K.charterScene({ sign: 1 }) });
    cue(s0 + 0.4, 'quill', { dur: 1.2 }); }
  { const s0 = at(i + 7);
    add({ id: '1.08', at: s0, note: 'seal stamps; the Company ensign unfurls', draw: (lt, d, t) => { K.charterScene({ sign: 1, stamp: seg(lt, 0.15, 0.4) }); ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.8, 1.2)); K.parchment(18); K.flag('eic', 760, 780, 360, 1.5 * eob(seg(lt, 0.8, 1.4)), t); K.slip('THE EAST INDIA COMPANY', 1300, 600, eob(seg(lt, 1.2, 1.6)), 0.02, 48); ctx.restore(); } });
    cue(s0 + 0.15, 'seal'); cue(s0 + 0.9, 'cloth'); }
  add({ id: '1.09', at: at(i + 8), note: 'wide map: Dutch flags fill the Spice Islands', draw: (lt, d, t) => {
    const pr = K.realMap({ view: K.lerpView(K.VIEWS.world, K.VIEWS.asia, eio(seg(lt, 0, d))), pins: [['spice', seg(lt, 0.2, 0.5)]] });
    [[127.5, -3.5], [120.5, 2], [131.5, 0.5], [118, -8]].forEach(([lo, la], k) => { const [x, y] = pr(lo, la); K.flag('dutch', x, y, 110, 0.4 * eob(seg(lt, 0.4 + k * 0.2, 0.7 + k * 0.2)), t); });
  } });
  for (let k = 0; k < 4; k++) cue(at(i + 8) + 0.4 + k * 0.2, 'pop', { gain: 0.4 });
  add({ id: '1.10', at: at(i + 9), note: 'the real route: London, down the Atlantic, round the Cape of Good Hope, to Surat', draw: (lt, d, t) => {
    const v = { lon: 30, lat: 12, k: 7.2 }, pr = K.realMap({ view: v, compass: false, pins: [['london', 1], ['surat', seg(lt, d * 0.8, d)]] });
    const R = [[-0.1, 51.5], [-6, 48], [-14, 40], [-19, 28], [-24, 12], [-15, -5], [0, -22], [18.5, -36.5], [32, -32], [43, -18], [52, -2], [62, 12], [72.8, 21.2]].map(([a, b]) => pr(a, b));
    const h = K.dashedRoute(R, eio(seg(lt, 0.1, d))); K.eastIndiaman(h[0], h[1] - 12, 0.1, 0, t, 'eic');
    const [cx, cy] = pr(18.5, -36.5); K.tag('Cape of Good Hope', cx - 230, cy - 40, 0.7 * eob(seg(lt, 0.4, 0.8)), cx, cy);
  } });
  { const s0 = at(i + 10); G.ringsShow = s0 + 0.55;
    add({ id: '1.11', at: s0, note: 'a bolt of Indian cloth unrolls; then the three empty gold rings', draw: (lt, d, t) => {
      K.realMap({ view: K.VIEWS.india, rings: ringsAt(t), ringLabels: false }); if (lt < 0.85) K.clothBolt(lt < 0.5 ? seg(lt, 0, 0.4) : 1 - seg(lt, 0.5, 0.85), 470);
      for (const id of ['madras', 'bombay', 'calcutta']) { const p = K.PLACES[id], [x, y] = K.proj(K.VIEWS.india)(p.lon, p.lat); if (lt > 0.6) K.tag(p.n, x + p.lx, y + p.ly, 0.62 * eob(seg(lt, 0.6, 0.9)), x, y); }
    } });
    cue(s0, 'cloth'); cue(s0 + 0.55, 'pop', { gain: 0.5 }); }
}
