// CH5 · 1686: THE WAR THEY LOST. Bengal, tolls, Child's war, Hooghly, the Bombay blockade, the price of peace.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G } from './common.js';
import { courtShot } from './ch0_hook.js';
const { P } = K;

export function build(add, cue) {
  const i0 = first(5);              // line 50
  // CH5 opens on the bright bed; the tension score starts when Child decides to fight
  G.musicExtra = [{ t: +(at(i0 + 5) - 0.3).toFixed(3), kind: 'tension' }];
  // 50 · Bengal was the richest prize of all — India -> Bengal, Bengal glows gold, pins
  add({ id: '5.01', at: at(i0), note: 'map: zoom to Bengal, it glows gold; pins', draw: (lt, d, t) => {
    const p = eio(seg(lt, 0, d * 0.8)), v = K.lerpView(K.VIEWS.india, { lon: 86.5, lat: 23.2, k: 62 }, p);
    K.realMap({ view: v, tint: { region: 'bengal', a: eo(seg(lt, 0.5, 1.4)) }, rings: { madras: 1, bombay: 1, calcutta: 0 }, ringLabels: false,
      pins: [['patna', seg(lt, 1.0, 1.3)], ['kasimbazar', seg(lt, 1.15, 1.45)], ['hooghly', seg(lt, 1.3, 1.6)], ['balasore', seg(lt, 1.45, 1.75)]] });
  } });
  cue(at(i0), 'page');
  // 51 · From 1651, the Company traded there — Shah Shuja's farman unrolls, stamps, flies to the stack (slot 2)
  { const s0 = at(i0 + 1), d0 = Le(i0 + 1) - s0, fly0 = d0 - 0.55; G.stackLand[2] = s0 + fly0 + 0.75;
    add({ id: '5.02', at: s0, note: "Shah Shuja's 1651 farman: unroll, stamp, fly to the stack", draw: (lt, d, t) => {
      K.parchment(51); K.label('SHAH SHUJA · 1651', 960, 200, 40, P.sepia);
      if (lt < fly0) K.farman('shuja', 960, 500, 1000, 480, seg(lt, 0, 0.6), seg(lt, 0.9, 1.15));
    }, overlay: (lt) => { if (lt >= fly0 && lt < fly0 + 0.75) K.farmanFly(2, seg(lt, fly0, fly0 + 0.75), [960, 500], 4); } });
    cue(s0 + 0.02, 'scroll'); cue(s0 + 0.9, 'seal'); cue(s0 + fly0, 'whoosh'); cue(G.stackLand[2], 'pop', { gain: 0.5 }); }
  // 52 · for a flat three thousand rupees a year — coins stack up, a slip
  { const s0 = at(i0 + 2);
    add({ id: '5.03', at: s0, note: 'coins stack up: Rs 3,000 a year', draw: (lt, d, t) => {
      K.parchment(52); const n = Math.floor(30 * eo(seg(lt, 0.1, d * 0.7))); ctx.save(); ctx.translate(960, 700); ctx.scale(2.2, 2.2); K.coinStacks(-74, 0, n, 10, '#D9D2C2'); ctx.restore();
      K.slip('Rs 3,000 a year', 960, 330, eob(seg(lt, 0.4, 0.8)), -0.02, 64);
    } });
    cue(s0 + 0.2, 'coins'); cue(s0 + 0.9, 'coins', { gain: 0.6 }); }
  // 53 · but local officials kept demanding tolls — toll posts pop up along the river
  add({ id: '5.04', at: at(i0 + 3), note: 'river: toll posts pop up one by one', draw: (lt, d, t) => K.riverPort({ t, pan: lerp(0, 120, eio(clamp(lt / d))), tolls: seg(lt, 0.2, d * 0.9), house: false }) });
  for (let k = 0; k < 4; k++) cue(at(i0 + 3) + 0.2 + k * (Le(i0 + 3) - at(i0 + 3)) * 0.7 / 4, 'pop', { gain: 0.5 });
  // 54 · In London, the Company's governor, Josiah Child — the office
  add({ id: '5.05', at: at(i0 + 4), note: 'London office: Josiah Child before his wall map', draw: (lt, d, t) => K.londonOffice({ pan: lerp(-80, 0, eio(clamp(lt / d))) }) });
  cue(at(i0 + 4), 'page');
  // 55 · decided to fight — he jabs a finger at the map (tension starts)
  { const f0 = Wd('fight', i0 + 5) - at(i0 + 5);
    add({ id: '5.06', at: at(i0 + 5), note: 'Child jabs at the map', camera: () => ({ x: 1000, y: 470, zoom: 1.3 }), draw: (lt, d, t) => K.londonOffice({ jab: eob(seg(lt, f0 - 0.25, f0 + 0.05)) }) });
    cue(at(i0 + 5) + f0, 'thud'); }
  // 56 · It was a disaster. — the map darkens, the Company flag wobbles
  add({ id: '5.07', at: at(i0 + 6), note: 'map darkens; the Company flag wobbles', draw: (lt, d, t) => {
    const pr = K.realMap({ view: K.VIEWS.bengal, dim: 0.35 * eo(seg(lt, 0, 0.8)), pins: [['hooghly', 1]] });
    const [x, y] = pr(88.39, 22.91); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(lt * 9) * 0.12 * seg(lt, 0.2, 0.5)); K.flag('eic', 0, 0, 240, 0.8, t); ctx.restore();
  } });
  // 57 · In 1686, fighting broke out at Hooghly — far flames at dusk (split at 'fighting')
  { const s0 = at(i0 + 7), f0 = Wd('fighting', i0 + 7) - s0;
    add({ id: '5.08', at: s0, note: 'Hooghly at dusk: the river port', draw: (lt, d, t) => K.riverPort({ t, night: 0.45, pan: lerp(0, 60, eio(clamp(lt / d))) }) });
    add({ id: '5.08b', at: s0 + f0 - 0.1, note: 'flames on the far bank', camera: (lt, d) => ({ x: lerp(1100, 1180, eio(clamp(lt / d))), y: 430, zoom: 1.35 }), draw: (lt, d, t) => K.riverPort({ t, night: 0.55, fire: seg(lt, 0, 1.2), pan: 60 }) });
    cue(s0 + f0, 'cannon', { gain: 0.45 }); }
  // 58 · and the English were driven out of the town — the Company flag falls, boats leave downriver
  { const s0 = at(i0 + 8), dr = Wd('driven', i0 + 8) - s0;
    add({ id: '5.09', at: s0, note: 'Company flag falls; boats pull away downriver', draw: (lt, d, t) => K.riverPort({ t, night: 0.55, fire: 1, pan: 60, flagFall: seg(lt, dr - 0.2, dr + 0.6), boatsOut: eio(seg(lt, dr, d + 0.6)) }) });
    cue(s0 + dr, 'thud', { gain: 0.5 }); }
  // 59 · Soon a Mughal admiral, Sidi Yaqub — on the prow of his flagship
  add({ id: '5.10', at: at(i0 + 9), note: 'Sidi Yaqub on the prow of his flagship', draw: (lt, d, t) => K.sidiOnProw({ t, pan: lerp(0, 90, eio(clamp(lt / d))) }) });
  cue(at(i0 + 9), 'waves', { dur: 2.4 });
  // 60 · blockaded Bombay — night: ships close the ring
  add({ id: '5.11', at: at(i0 + 10), note: 'night: Mughal ships ring Bombay fort', draw: (lt, d, t) => K.bombayBlockade({ t, ring: eio(seg(lt, 0, d + 0.4)) }) });
  // 61 · until famine forced the English to give in — the rice jar empties (split), then a white flag
  { const s0 = at(i0 + 11), g0 = Wd('forced', i0 + 11) - s0;
    add({ id: '5.12', at: s0, note: 'the rice jar empties', draw: (lt, d, t) => { K.parchment(61); K.nightWash(0.9, 6, 300); K.riceJar(960, 780, 1.6, lerp(0.85, 0.04, eio(seg(lt, 0.1, d)))); } });
    add({ id: '5.12b', at: s0 + g0 - 0.1, note: 'a white flag rises over the fort', draw: (lt, d, t) => K.bombayBlockade({ t, ring: 1, white: seg(lt, 0.1, 1.0) }) });
    cue(s0 + 0.2, 'rice', { dur: 1.2 }); }
  // 62 · Peace came at a price: — back to the cold-open court
  add({ id: '5.13', at: at(i0 + 12), note: 'back to the 1690 court (now we know why)', draw: (lt, d, t) => courtShot(lt, t, { pan: lerp(-60, 40, eio(clamp(lt / d))) }) });
  cue(at(i0 + 12), 'gong', { gain: 0.35 });
  // 63 · a fine of 1,50,000 rupees — the moneybag
  { const m0 = Wd('fine', i0 + 13) - at(i0 + 13);
    add({ id: '5.14', at: at(i0 + 13), note: 'moneybag 1,50,000 set down', camera: () => ({ x: 960, y: 600, zoom: 1.3 }), draw: (lt, d, t) => { courtShot(lt, t, { pan: 40, bow: 0.6, bag: seg(lt, m0 - 0.3, m0 + 0.2), bagText: '1,50,000' }); K.slip('Rs 1,50,000', 1000, 560, eob(seg(lt, m0, m0 + 0.35)), 0.03, 44); } });
    cue(at(i0 + 13) + m0, 'coins'); }
  // 64 · a public apology, and a promise to behave — apology scroll; envoys bow
  { const s0 = at(i0 + 14), b0 = Wd('promise', i0 + 14) - s0;
    add({ id: '5.15', at: s0, note: 'apology scroll; the envoys bow, dignified', draw: (lt, d, t) => {
      courtShot(lt, t, { pan: 40, bow: eio(seg(lt, b0 - 0.2, b0 + 0.8)), bag: 1, bagText: '1,50,000' });
      if (lt < b0) K.farman('aurangzeb', 960, 420, 760, 400, seg(lt, 0, 0.45), 0);
      K.slip('Rs 1,50,000', 1000, 560, 1, 0.03, 44);
    } });
    cue(s0, 'scroll'); }
}
