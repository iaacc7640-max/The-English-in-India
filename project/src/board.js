// Kit boards (16:9): ?b=cast | props | map. Rendered with PAGE=board.html node tools/capture.mjs frames review/x "0"
import { W, H, setCtx, ctx } from './core/lib.js';
import * as K from './core/kit.js';
const cv = document.getElementById('cv'); setCtx(cv.getContext('2d'));
const b = new URLSearchParams(location.search).get('b') || 'cast';
const OP = (window.OP = { ready: false });
const YEARS = [1600, 1612, 1639, 1668, 1686, 1690, 1717, 1757];
const BOARDS = {
  map() {
    K.realMap({ view: K.VIEWS.india, rings: { madras: 1, bombay: 1, calcutta: 0 }, tint: { region: 'bengal', a: 0.8 },
      pins: ['surat', 'agra', 'ahmedabad', 'broach', 'masulipatnam', 'golconda', 'balasore', 'hooghly', 'kasimbazar', 'patna', 'delhi', 'plassey'].map((id) => [id, 1]) });
    K.eraBar(YEARS, 5, 0.714); K.farmanStack(4);
    K.captionStrip([{ txt: 'three' }, { txt: 'small' }, { txt: 'forts,', hi: 1 }], 960, K.CAPLOOK.y);
  },
  bengal() {
    K.realMap({ view: K.VIEWS.bengal, rings: { madras: 1, bombay: 1, calcutta: 1 }, pins: ['hooghly', 'kasimbazar', 'plassey', 'balasore', 'patna'].map((id) => [id, 1]) });
    K.eraBar(YEARS, 6, 0.857); K.farmanStack(5);
  },
  world() { K.realMap({ view: K.VIEWS.world, pins: [['london', 1], ['spice', 1]], rings: { madras: 0, bombay: 0, calcutta: 0 }, ringLabels: false }); K.eraBar(YEARS, 0, 0); },
  props() {
    K.parchment(30);
    K.farman('farrukhsiyar', 560, 330, 820, 420, 1, 1, null);
    K.label('FARMAN (UNROLL + STAMP)', 560, 580, 22);
    ['jahangir', 'golconda', 'shuja', 'aurangzeb', 'farrukhsiyar'].forEach((id, i) => K.rolledFarman(id, 1180, 160 + i * 40));
    K.label('THE STACK', 1180, 370, 22);
    ['eic', 'mughal', 'portugal', 'dutch', 'golconda', 'spain', 'france'].forEach((f, i) => { K.flag(f, 1340 + (i % 4) * 140, 230 + Math.floor(i / 4) * 270, 220, 0.62, 0.3); });
    K.eastIndiaman(330, 860, 0.5, 0, 0.4, 'eic'); K.eastIndiaman(760, 860, 0.5, 0, 0.4, 'portugal', 0.7);
    K.moneybag(1060, 850, 0.6, '1,50,000'); K.receipt(1330, 790, 0.7, -0.05); K.riceJar(1560, 860, 0.7, 0.2); K.cushion(1780, 860, 0.45, true, 0);
    K.royalSeal(1180, 520, 0.5, 'mughal'); K.royalSeal(1300, 520, 0.5, 'golconda'); K.seal(1420, 520, 0.5, 'E');
  },
  thumb() {
    K.mughalCourt({ pan: 40, throne: 'aurangzeb' });
    K.layer(40, 0.6, () => { K.envoy(0, { x: 560, y: 800, h: 430, bow: 1 }); K.envoy(1, { x: 760, y: 800, h: 440, bow: 0.95 }); K.moneybag(960, 800, 0.55, '1,50,000'); });
    ctx.save(); ctx.fillStyle = 'rgba(30,20,12,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    // the three-forts map on a paper card, right side
    ctx.save(); ctx.translate(1180, 120); ctx.rotate(0.03); K.cut(K.P_rr(0, 0, 680, 820, 8), '#E9DCBC', { shadow: 1.4, edge: 8 });
    ctx.beginPath(); ctx.rect(20, 20, 640, 780); ctx.clip(); ctx.translate(-570, -60); ctx.scale(0.95, 0.95);
    const tv = { lon: 80.5, lat: 20.5, k: 30 }, tp = K.realMap({ view: tv, rings: { madras: 1, bombay: 1, calcutta: 1 }, compass: false, glowRings: 0.8, ringLabels: false });
    for (const [id, dx, dy] of [['bombay', 110, 40], ['calcutta', -40, 70], ['madras', 100, 0]]) { const p = K.PLACES[id], [x, y] = tp(p.lon, p.lat); K.tag(p.n, x + dx, y + dy, 0.95, x, y); }
    ctx.restore();
    K.ribbon('1690', 420, 190, 1.25, 120);
    K.slip('FROM MERCHANTS TO MASTERS', 600, 930, 1.05, -0.02, 76);
  },
  card() { K.chapterCard(1.4, '1686', 'The War They Lost', 5); K.eraBar(YEARS, 4, 0.571); },
  cast() {
    K.parchment(21);
    K.label('THE CAST · FROM MERCHANTS TO MASTERS', 960, 52, 34);
    const ids = K.CAST_ORDER, perRow = 9;
    ids.forEach((id, i) => {
      const r = Math.floor(i / perRow), c = i % perRow, x = 120 + c * 210, y = 480 + r * 470;
      if (id === 'sobha') K.rider('sobha', x + 10, y, 0.55, 0.6);
      else if (id === 'nayak') { K.parasol(x - 70, y - 380, 0.5); K.cast(id, { x, y, h: 330 }); }
      else K.cast(id, { x, y, h: 330, arm: id === 'child' ? 70 : id === 'best' || id === 'sidi' ? 40 : 15 });
      const nm = K.CAST[id].name.toUpperCase().split(' '), half = Math.ceil(nm.length / 2); if (nm.join(' ').length > 13 && nm.length > 1) { K.label(nm.slice(0, half).join(' '), x, y + 30, 16); K.label(nm.slice(half).join(' '), x, y + 52, 16); } else K.label(nm.join(' '), x, y + 30, 16);
    });
  },
  poses() {
    K.parchment(22); K.label('POSES: BOW AT THE WAIST · WALK · POINT · SEATED', 960, 52, 34);
    [0, 0.35, 0.7, 1].forEach((bw, i) => { K.cast('merchant', { x: 200 + i * 230, y: 620, h: 380, bow: bw }); K.label('bow ' + bw, 200 + i * 230, 660, 20); });
    K.cast('hawkins', { x: 1150, y: 620, h: 380, walk: 1.2 }); K.label('walk', 1150, 660, 20);
    K.cast('child', { x: 1400, y: 620, h: 380, arm: 80 }); K.label('point', 1400, 660, 20);
    K.cast('aurangzeb', { x: 1680, y: 620, h: 380, seated: 1 }); K.label('seated', 1680, 660, 20);
  },
};
(async () => {
  await document.fonts.load('700 40px Caladea'); await document.fonts.load('900 40px Inter');
  if (K.loadGeo) await K.loadGeo();
  OP.duration = () => 1; OP.draw = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); BOARDS[b](); };
  OP.frame = (t, q = 0.92) => { OP.draw(t); return cv.toDataURL('image/jpeg', q); };
  OP.ready = true;
})().catch((e) => { OP.bootError = String(e.stack || e); });
