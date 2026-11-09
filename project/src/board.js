// Kit boards (16:9): ?b=cast | props | map. Rendered with PAGE=board.html node tools/capture.mjs frames review/x "0"
import { W, H, setCtx, ctx } from './core/lib.js';
import * as K from './core/kit.js';
import { turbanInHand } from './chapters/ch0_hook.js';
const cv = document.getElementById('cv'); setCtx(cv.getContext('2d'));
const b = new URLSearchParams(location.search).get('b') || 'cast';
const OP = (window.OP = { ready: false });
const YEARS = [1600, 1612, 1639, 1668, 1686, 1690, 1717, 1757];

/** thumbnail text: heavy serif, thick dark outline, optional shadow */
function bigText(t, x, y, size, fill = '#F6EEDB', align = 'center', stroke = '#2B1A10') {
  ctx.save(); ctx.font = `700 ${size}px Caladea`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillText(t, x + 8, y + 10);
  ctx.strokeStyle = stroke; ctx.lineWidth = size * 0.16; ctx.strokeText(t, x, y); ctx.fillStyle = fill; ctx.fillText(t, x, y); ctx.restore();
}
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
  cast2() {
    K.parchment(23); K.label('THE CAST · PART TWO (1717–1947)', 960, 52, 34);
    K.CAST_ORDER2.forEach((id, i) => { const r = Math.floor(i / 9), c = i % 9, x = 120 + c * 210, y = 480 + r * 470; K.cast(id, { x, y, h: 330, arm: 15 }); const nm = K.CAST[id].name.toUpperCase().split(' '), half = Math.ceil(nm.length / 2); if (nm.join(' ').length > 13 && nm.length > 1) { K.label(nm.slice(0, half).join(' '), x, y + 30, 16); K.label(nm.slice(half).join(' '), x, y + 52, 16); } else K.label(nm.join(' '), x, y + 30, 16); });
  },
  flags() {
    K.parchment(31); K.label('FLAGS (ROUND 2)', 960, 52, 34);
    const L = [['eic', 1650, 'COMPANY 1600–1706'], ['eic', 1750, 'COMPANY 1707–1800'], ['eic', 1858, 'COMPANY FROM 1801'], ['mughal', 1700, 'MUGHAL'], ['spain', 1600, 'SPAIN (ARMADA)'], ['portugal', 1600, 'PORTUGAL (1600s)'], ['golconda', 1632, 'GOLCONDA'], ['bengal', 1757, 'BENGAL SUBAH'], ['oudh', 1764, 'OUDH'], ['tiger', 1799, 'MYSORE'], ['maratha', 1818, 'MARATHA'], ['sikh', 1849, 'SIKH'], ['union', 1858, 'UNION'], ['india', 1947, 'INDIA'], ['france', 1757, 'FRANCE'], ['dutch', 1600, 'DUTCH']];
    L.forEach(([k, y, n], i) => { const x = 170 + (i % 6) * 300, yy = 380 + Math.floor(i / 6) * 330; K.FLAGS.year = y; K.flag(k, x, yy, 260, 1, 0); K.label(n, x + 100, yy + 30, 18); });
  },
  thumbA() {
    // TRADERS -> RULERS: left, a merchant bowing in a dark court; right, a Company officer standing tall by the throne in gold light
    K.mughalCourt({ pan: 0, throne: '', courtiers: false, seat: 'takht' });
    K.layer(0, 0.6, () => { K.envoy(0, { x: 330, y: 800, h: 520, bow: 1 }); K.cast('clive', { x: 1300, y: 800, h: 600, arm: 70 }); });
    ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(880, 0); ctx.lineTo(760, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = 'rgba(20,12,8,0.55)'; ctx.fill(); ctx.restore();
    ctx.save(); const g = ctx.createRadialGradient(1380, 380, 50, 1380, 380, 700); g.addColorStop(0, 'rgba(255,214,120,0.45)'); g.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = g; ctx.fillRect(820, 0, W, H); ctx.restore();
    K.cut(K.P_poly([[870, -20], [910, -20], [790, H + 20], [750, H + 20]]), '#B3392F', { shadow: 0.8, edge: 4 });
    bigText('TRADERS', 390, 930, 170, '#E9DCC0'); bigText('RULERS', 1420, 930, 190, '#F2C14E');
    ctx.save(); ctx.translate(890, 935); K.cut(K.P_poly([[-50, -16], [20, -16], [20, -44], [70, 0], [20, 44], [20, 16], [-50, 16]]), '#F6EEDB', { shadow: 0.6, edge: 3 }); ctx.restore();
    K.ribbon('1600 – 1947', 400, 150, 0.9, 90);
  },
  thumbB() {
    // HOW A COMPANY TOOK INDIA: India glowing red on a dark sea, one giant Company flag planted in it, a tiny ship arriving
    K.parchment(3); ctx.fillStyle = '#1E2A3A'; ctx.fillRect(0, 0, W, H);
    const pr = K.realMap({ view: { lon: 72, lat: 21, k: 38 }, compass: false, rivers: false });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5B6E8C'; ctx.fillRect(0, 0, W, H); ctx.restore();
    K.washes(pr, [['india', 1, 'rgba(214,60,45,0.85)']]);
    const y0 = K.FLAGS.year; K.FLAGS.year = 1801; const [fx, fy] = pr(79, 22); K.flag('eic', fx - 40, fy + 200, 300, 1.45, 0.7); K.FLAGS.year = y0;
    K.eastIndiaman(1640, 930, 0.3, 0, 0, 'eic');
    bigText('HOW A', 60, 190, 150, '#F6EEDB', 'left'); bigText('COMPANY', 60, 360, 170, '#F2C14E', 'left'); bigText('TOOK', 60, 540, 150, '#F6EEDB', 'left'); bigText('INDIA', 60, 720, 190, '#F6EEDB', 'left');
    K.ribbon('1600 – 1947', 400, 940, 0.85, 84);
  },
  thumbC() {
    // MERCHANTS MADE KINGS: close-up of the Bengal throne cushion; a Company hand lowers the crown-turban onto it
    K.parchment(37); ctx.fillStyle = '#5E2A33'; ctx.fillRect(0, 0, W, H); ctx.save(); const g = ctx.createRadialGradient(1250, 620, 40, 1250, 620, 620); g.addColorStop(0, 'rgba(255,214,120,0.5)'); g.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    K.cushion(1380, 900, 1.9, false); turbanInHand(1530, 420, 1.9);
    bigText('THEY CAME', 70, 260, 150, '#F6EEDB', 'left'); bigText('TO TRADE.', 70, 430, 150, '#F6EEDB', 'left');
    bigText('THEY STAYED', 70, 650, 130, '#F2C14E', 'left'); bigText('TO RULE.', 70, 800, 170, '#F2C14E', 'left');
  },
  thumb2() {
    // LEFT: the merchants on their knees (1690). RIGHT: the map of India under Company flags. Big title strip at the bottom.
    K.mughalCourt({ pan: 40, throne: 'aurangzeb', courtiers: false });
    K.layer(40, 0.6, () => { K.envoy(0, { x: 520, y: 800, h: 460, bow: 1 }); K.envoy(1, { x: 730, y: 800, h: 470, bow: 0.95 }); });
    ctx.save(); ctx.fillStyle = 'rgba(30,20,12,0.38)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); ctx.translate(1060, 70); ctx.rotate(0.025); K.cut(K.P_rr(0, 0, 800, 760, 8), '#E9DCBC', { shadow: 1.6, edge: 8 });
    ctx.beginPath(); ctx.rect(18, 18, 764, 724); ctx.clip(); ctx.translate(-626, -140); ctx.scale(1.05, 1.05);
    const tp = K.realMap({ view: { lon: 81, lat: 21.5, k: 24 }, compass: false });
    K.washes(tp, [['india', 0.9, 'rgba(179,57,47,0.30)']]);
    const y0 = K.FLAGS.year; K.FLAGS.year = 1801;
    for (const [lo, la, s] of [[74.35, 31.55, 0.55], [77.2, 28.6, 0.6], [80.95, 26.85, 0.5], [88.36, 22.57, 0.6], [72.88, 19.08, 0.6], [79.09, 21.15, 0.5], [76.69, 12.42, 0.5], [80.27, 13.08, 0.55]]) { const [x, y] = tp(lo, la); K.flag('eic', x, y, 190, s, lo); }
    K.FLAGS.year = y0;
    ctx.restore();
    K.ribbon('1600        1947', 470, 170, 1.15, 112); ctx.save(); ctx.translate(470, 176); ctx.scale(1.15, 1.15); K.cut(K.P_poly([[-60, -10], [30, -10], [30, -30], [70, 0], [30, 30], [30, 10], [-60, 10]]), K.P.ink, { shadow: 0, edge: 0 }); ctx.restore();
    K.slip('FROM MERCHANTS TO MASTERS', 960, 940, 1.18, -0.015, 86);
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
