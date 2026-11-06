// CH2 · 1612: KNOCKING ON JAHANGIR'S DOOR. Hawkins, the Portuguese, Best at Swally, the Surat factory, Roe.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
const priest = (x, y, h, o = {}) => K.person({ x, y, h, legs: 'robe', coat: 'robe', coatC: '#2B2019', trim: '#2B2019', collar: null, hat: 'cap', hatC: '#2B2019', ...o });
export function build(add, cue) {
  const i = first(2);   // 22
  add({ id: '2.01', at: at(i), note: 'Surat harbour: an East Indiaman arrives; Mughal customs house', draw: (lt, d, t) => K.suratHarbour({ t, pan: lerp(-60, 60, eio(clamp(lt / d))), shipX: lerp(200, 560, eio(clamp(lt / d))) }) });
  cue(at(i), 'waves', { dur: 2.2, gain: 0.6 });
  { const s0 = at(i + 1), j0 = Wd('jahaangeer', i + 1) - s0;
    add({ id: '2.02', at: s0, note: 'Hawkins walks up with a sealed letter', draw: (lt, d, t) => { K.jharokha({ door: 1 }); K.cast('hawkins', { x: lerp(200, 640, eio(seg(lt, 0, j0 + 0.4))), y: 800, h: 420, walk: lt < j0 + 0.4 ? t * 7 : null }); } });
    add({ id: '2.02b', at: s0 + j0 + 0.5, note: 'Hawkins bows below Jahangir at the jharokha; 1609', draw: (lt, d, t) => { K.jharokha({ door: 1 }); K.cast('hawkins', { x: 640, y: 800, h: 420, bow: eio(seg(lt, 0, 0.6)) }); K.ribbon('1609', 520, 230, eob(seg(lt, 0.3, 0.7)), 80); } });
    cue(s0 + j0 + 0.6, 'cloth'); }
  add({ id: '2.03', at: at(i + 2), note: 'a Portuguese priest whispers to a courtier; the door swings shut', draw: (lt, d, t) => { K.jharokha({ door: 1 - eio(seg(lt, d * 0.5, d)) }); priest(360, 800, 400); K.person({ x: 520, y: 800, h: 410, dir: -1, skin: K.SKIN.in, legs: 'trousers', legC: '#EFE4CC', coat: 'jama', coatC: P.forest, patka: P.gold, beard: 'mous', hat: 'turban', hatC: '#EFE4CC', bow: 0.15 }); K.cast('hawkins', { x: 900, y: 800, h: 420 }); } });
  cue(Le(i + 2) - 0.1, 'thud', { gain: 0.5 });
  add({ id: '2.04', at: at(i + 3), note: 'Hawkins walks off left, letter still sealed', draw: (lt, d, t) => { K.jharokha({ door: 0 }); K.cast('hawkins', { x: lerp(820, 120, eio(clamp(lt / d))), y: 800, h: 420, dir: -1, walk: t * 7 }); } });
  cue(at(i + 3), 'steps', { dur: 1.4 });
  { const s0 = at(i + 4), b0 = Wd('best', i + 4) - s0, f0 = Wd('fleet', i + 4) - s0;
    add({ id: '2.05', at: s0, note: '1612: Thomas Best on deck', draw: (lt, d, t) => { K.sea({ t }, (k) => { if (k === 2) { const y = 720 + Math.sin(t * 1.5) * 6; K.cast('best', { x: 1060, y: y - 96, h: 300, arm: 50 }); K.eastIndiaman(860, y, 0.9, 0, t, 'eic'); } }); K.ribbon('1612', 520, 250, eob(seg(lt, 0.1, 0.5)), 90); } });
    add({ id: '2.05b', at: s0 + f0 - 0.4, note: 'two-shot at sea: English ships vs a larger Portuguese fleet; its sails tear', draw: (lt, d, t) => K.seaBattle({ t, tear: seg(lt, 0.8, d + 0.6), puffs: seg(lt, 0.3, 1.2) }) });
    cue(s0 + f0, 'cannon', { gain: 0.45 }); cue(s0 + f0 + 0.6, 'cannon', { gain: 0.35 }); }
  add({ id: '2.06', at: at(i + 5), note: 'Jahangir raises an eyebrow (impressed)', camera: () => ({ x: 1180, y: 330, zoom: 1.8 }), draw: (lt, d, t) => K.jharokha({ door: 0, arm: lerp(0, 40, eob(seg(lt, 0.3, 0.7))) }) });
  { const s0 = at(i + 6), d0 = at(i + 7) - s0, fly0 = Math.max(0.9, d0 - 0.8); G.stackLand[0] = s0 + fly0 + 0.75;
    add({ id: '2.07', at: s0, note: "Surat pin + factory; Jahangir's 1613 farman stamps and flies to the stack", draw: (lt, d, t) => {
      K.realMap({ view: K.VIEWS.west, pins: [['surat', seg(lt, 0, 0.3)]], rings: ringsAt(t), ringLabels: false });
      if (lt < fly0) K.farman('jahangir', 960, 470, 760, 380, seg(lt, 0.15, 0.55), seg(lt, 0.6, 0.85));
    }, overlay: (lt) => { if (lt >= fly0 && lt < fly0 + 0.75) K.farmanFly(0, seg(lt, fly0, fly0 + 0.75), [960, 470], 3.4); } });
    cue(s0 + 0.15, 'scroll'); cue(s0 + 0.6, 'seal'); cue(s0 + fly0, 'whoosh'); }
  { const s0 = at(i + 7), r0 = Wd('roe', i + 7) - s0;
    add({ id: '2.08', at: s0, note: '1615: King James sends an ambassador (ship leaves London)', draw: (lt, d, t) => { K.londonDawn({ t, pan: lerp(0, 120, eio(clamp(lt / d))) }); K.ribbon('1615', 960, 260, eob(seg(lt, 0.1, 0.5)), 90); } });
    add({ id: '2.08b', at: s0 + r0 - 1.0, note: 'Sir Thomas Roe arrives at court with gifts', draw: (lt, d, t) => { K.mughalCourt({ throne: 'jahangir', pan: 40 }); K.cast('roe', { x: lerp(300, 720, eio(seg(lt, 0, 1.0))), y: 800, h: 400, walk: lt < 1 ? t * 7 : null, arm: 30 }); K.courtForeground(40); } }); }
  add({ id: '2.09', at: at(i + 8), note: 'a treaty scroll unrolls ... and stays blank', draw: (lt, d, t) => { K.mughalCourt({ throne: 'jahangir', pan: 40, dim: 0.4 }); K.blankTreaty(960, 460, seg(lt, 0, 0.6), t); } });
  cue(at(i + 8), 'scroll');
  add({ id: '2.10', at: at(i + 9), note: 'map zooms to north and west India', draw: (lt, d, t) => K.realMap({ view: K.lerpView(K.VIEWS.india, K.VIEWS.north, eio(clamp(lt / d))), rings: ringsAt(t), ringLabels: false, pins: [['surat', 1]] }) });
  add({ id: '2.11', at: at(i + 10), note: 'three pins pop: Agra, Ahmedabad, Broach', draw: (lt, d, t) => {
    const w = (n) => { try { return Wd(n, i + 10) - at(i + 10); } catch { return 0.5; } };
    K.realMap({ view: K.VIEWS.north, rings: ringsAt(t), ringLabels: false, pins: [['surat', 1], ['agra', seg(lt, w('agra') - 0.1, w('agra') + 0.2)], ['ahmedabad', seg(lt, w('ah') - 0.1, w('ah') + 0.2)], ['broach', seg(lt, w('brohch') - 0.1, w('brohch') + 0.2)]] });
  } });
  for (const n of ['agra', 'ah', 'brohch']) { try { cue(Wd(n, i + 10), 'pop', { gain: 0.5 }); } catch {} }
}
