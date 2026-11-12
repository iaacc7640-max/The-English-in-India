// CH7 · 1717: THE COMPANY'S MAGNA CARTA. The merger, Surman's mission, Hamilton, the 1717 farmans and their four perks.
import { ctx, W, H, clamp, lerp, seg, eo, eob, eio } from '../core/lib.js';
import * as K from '../core/kit.js';
import { L, Le, Wd, at, first, G, ringsAt } from './common.js';
const { P } = K;
export function build(add, cue) {
  const i = first(7);   // 78
  add({ id: '7.01', at: at(i), note: 'a second Company flag appears beside the first', draw: (lt, d, t) => K.flagsMerge(0, t) });
  { const s0 = at(i + 1), m0 = Wd('merged', i + 1) - s0;
    add({ id: '7.02', at: s0, note: 'the rival flag droops (it flopped)', draw: (lt, d, t) => { K.flagsMerge(0, t, eio(seg(lt, 0.2, 0.8))); } });
    add({ id: '7.02b', at: s0 + Wd('seventeen', i + 1) - s0 - 0.1, note: '1708: the flags slide together into one', draw: (lt, d, t) => K.flagsMerge(seg(lt, 0.3, d), t, 1) });
    cue(s0 + m0, 'cloth'); }
  { const s0 = at(i + 2), su = Wd('surman', i + 2) - s0;
    add({ id: '7.03', at: s0, note: '1715 ribbon over the road to Delhi', draw: (lt, d, t) => { K.realMap({ view: K.lerpView(K.VIEWS.bengal, K.VIEWS.north, eio(clamp(lt / d))), rings: ringsAt(t), ringLabels: false, pins: [['delhi', 1], ['calcutta', 0]] }); K.ribbon('1715', 960, 260, eob(seg(lt, 0.1, 0.5)), 90); } });
    add({ id: '7.03b', at: s0 + su - 0.6, note: "Surman's party walks into a Delhi court", draw: (lt, d, t) => { K.mughalCourt({ throne: 'farrukhsiyar', pan: 40 }); K.cast('surman', { x: lerp(100, 600, eio(seg(lt, 0, 1.2))), y: 800, h: 400, walk: lt < 1.2 ? t * 7 : null }); K.cast('hamilton', { x: lerp(-60, 430, eio(seg(lt, 0, 1.2))), y: 800, h: 390, walk: lt < 1.2 ? t * 7 + 1 : null }); K.courtForeground(40); } });
    cue(s0 + su - 0.5, 'steps', { dur: 1.2 }); }
  add({ id: '7.04', at: at(i + 3), note: 'Farrukhsiyar (jewelled turban) on the throne', camera: (lt, d) => ({ x: 1340, y: 480, zoom: lerp(1.4, 1.7, eio(clamp(lt / d))) }), draw: (lt, d, t) => { K.mughalCourt({ throne: 'farrukhsiyar', pan: 40 }); K.courtForeground(40); } });
  add({ id: '7.05', at: at(i + 4), note: 'Hamilton steps forward with a surgeon\'s bag', draw: (lt, d, t) => { K.mughalCourt({ throne: 'farrukhsiyar', pan: 40 }); K.cast('surman', { x: 520, y: 800, h: 400 }); K.cast('hamilton', { x: lerp(700, 880, eio(seg(lt, 0, 0.9))), y: 800, h: 390, walk: lt < 0.9 ? t * 7 : null, arm: 15 }); K.courtForeground(40); } });
  add({ id: '7.06', at: at(i + 5), note: 'he opens the bag; the emperor nods (no claim it won the farman)', camera: () => ({ x: 1080, y: 560, zoom: 1.35 }), draw: (lt, d, t) => { K.mughalCourt({ throne: 'farrukhsiyar', pan: 40, emperorArm: lerp(0, 25, eob(seg(lt, 0.6, 1.0))) }); K.cast('hamilton', { x: 880, y: 800, h: 390, bow: 0.3, arm: lerp(15, 50, eob(seg(lt, 0.1, 0.5))) }); K.courtForeground(40); } });
  { const s0 = at(i + 6), d0 = Le(i + 6) - s0, g0 = Wd('generous', i + 6) - s0;
    add({ id: '7.07', at: s0, note: '1717 ribbon; the emperor raises a hand', draw: (lt, d, t) => { K.mughalCourt({ throne: 'farrukhsiyar', pan: 40, emperorArm: 35 }); K.courtForeground(40); K.ribbon('1717', 960, 240, eob(seg(lt, 0.1, 0.5)), 100); } });
    add({ id: '7.07b', at: s0 + g0 - 0.6, note: 'the biggest scroll of all unrolls across the WHOLE frame', draw: (lt, d, t) => { K.parchment(84); K.farman('farrukhsiyar', 960, 460, 1840, 720, seg(lt, 0, 0.8), seg(lt, 0.9, 1.15)); } });
    cue(s0 + g0 - 0.5, 'scroll', { dur: 1.0 }); cue(s0 + g0 + 0.4, 'seal'); }
  const big = (lt, show) => { K.parchment(84); K.farman('farrukhsiyar', 960, 460, 1840, 720, 1, 1, [{ text: 'MAGNA CARTA', y: 120, size: 70 }]); for (let k = 0; k < 4; k++) K.perkIcon(k, 330 + k * 420, 450, 1.35 * (show[k] || 0)); };
  add({ id: '7.08', at: at(i + 7), note: "'MAGNA CARTA' on the scroll", draw: (lt) => big(lt, []) });
  { const icons = [i + 8, i + 9, i + 10, i + 11].map((li) => at(li) + 0.15);
    const lbl = ['NO DUTY IN BENGAL', 'TRANSIT PASSES', 'LAND AROUND CALCUTTA', 'COINS ACROSS THE EMPIRE'];
    for (let k = 0; k < 3; k++) {
      add({ id: `7.0${9 + k}`, at: at(i + 8 + k), note: `perk icon ${k + 1}: ${lbl[k]}`, draw: (lt, d, t) => { big(lt, icons.map((x) => eob(seg(t, x, x + 0.4)))); K.slip(lbl[k], 330 + k * 420, 650, eob(seg(lt, 0.2, 0.5)), 0, 40); } });
      cue(icons[k], 'pop');
    }
    const s0 = at(i + 11), d0 = Le(i + 11) - s0, fly0 = 0.9; G.stackLand[4] = s0 + fly0 + 0.75;
    add({ id: '7.12', at: s0, note: 'icon 4: the BOMBAY coin; the farman flies to the stack', draw: (lt, d, t) => { if (lt < fly0) { big(lt, icons.map((x) => eob(seg(t, x, x + 0.4)))); K.slip(lbl[3], 1590, 650, eob(seg(lt, 0.2, 0.5)), 0, 40); } else K.parchment(85); },
      overlay: (lt) => { if (lt >= fly0 && lt < fly0 + 0.75) K.farmanFly(4, seg(lt, fly0, fly0 + 0.75), [960, 460], 5); } });
    add({ id: '7.12b', at: s0 + fly0 + 0.5, note: 'a BOMBAY coin rolls across the map', draw: (lt, d, t) => {
      const pr = K.realMap({ view: K.VIEWS.india, rings: ringsAt(t), ringLabels: false, pins: [['delhi', 1]] }); const a = pr(72.88, 19.08), b = pr(88.36, 22.57), p = eio(seg(lt, 0, d));
      ctx.save(); ctx.translate(lerp(a[0], b[0], p), lerp(a[1], b[1], p) - 50); ctx.rotate(p * 8); K.coin(0, 0, 48, 'BOMBAY'); ctx.restore();
    } });
    cue(icons[3], 'pop'); cue(s0 + fly0, 'whoosh'); cue(s0 + fly0 + 0.6, 'coins', { gain: 0.6 }); }
}
