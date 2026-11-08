// CH9 · 1757: BATTLE OF PLASSEY. The French, Siraj-ud-Daulah, Clive, Mir Jafar's betrayal (no battle shown).
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
/** the mango grove at Plassey: a green field, trees, two rows of flags facing each other; fall[k] lowers the Nawab's flags */
function grove(t, show = 1, fallFn = null) {
  K.parchment(98); ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 900);
  K.cut(K.P_rr(-400, 480, W + 800, 800, 0), '#A9B48A', { shadow: 0.4, edge: 4 });
  for (let k = 0; k < 7; k++) { const x = 150 + k * 270; K.cut(K.P_rr(x - 10, 400, 20, 110, 4), '#5A3E2B', { shadow: 0.3, edge: 2 }); K.cut(K.P_circ(x, 380, 70), P.forest, { shadow: 0.4, edge: 3 }); }
  for (let k = 0; k < 5; k++) { K.flag('eic', 140 + k * 120, 780, 280, 0.6 * eob(clamp(show * 5 - k * 0.5)), t + k); K.flag('mughal', 1240 + k * 120, 780, 280, 0.6 * eob(clamp(show * 5 - k * 0.5)), t + k, fallFn ? fallFn(k) : 0); }
}
export function build(add, cue) {
  const i = first(9);
  // 0-3 · the Carnatic Wars on the map: Company and French armies and ships move along the coast (no people hurt)
  const CV = { lon: 79.3, lat: 12.5, k: 150 };
  const P_ = (pr, id) => { const p = K.PLACES[id] || { lon: 79.37, lat: 12.9 }; return pr(p.lon, p.lat); };
  add({ id: '9.01', at: at(i), note: 'Coromandel coast: Pondicherry (French) beside Madras (Company)', draw: (lt, d, t) => { const pr = map(t, { view: CV, pins: [['pondicherry', seg(lt, 0.2, 0.5)], ['madras', seg(lt, 0.3, 0.6)]] }); const [x, y] = pr(79.81, 11.94); K.flag('france', x + 20, y, 200, 0.7, t); const [mx, my] = pr(80.27, 13.08); K.flag('eic', mx + 20, my, 200, 0.7, t); } });
  { const s0 = at(i + 1), e0 = Le(i + 2);
    const war = (lt, t, extra) => { const pr = map(t, { view: CV, pins: [['pondicherry', 1], ['madras', 1]] }), q = (lt / (e0 - s0));
      const md = pr(80.27, 13.08), pd = pr(79.81, 11.94), ar = pr(79.37, 12.9);
      // French march north on Madras and fall back; Company troops march inland to Arcot and back to the coast
      const f = Math.sin(q * Math.PI * 2) * 0.5 + 0.5, e = Math.sin(q * Math.PI * 2 + 1.6) * 0.5 + 0.5;
      K.armyToken(lerp(pd[0] - 70, md[0] - 80, f), lerp(pd[1] - 10, md[1] + 80, f), 'france', 0.9, t);
      K.armyToken(lerp(md[0] - 110, ar[0] - 20, e), lerp(md[1] - 80, ar[1] - 60, e), 'eic', 0.9, t);
      // ships off the coast
      K.eastIndiaman(lerp(pd[0] + 260, md[0] + 220, f), lerp(pd[1], md[1] + 60, f), 0.14, 0, t, 'france');
      K.eastIndiaman(lerp(md[0] + 300, pd[0] + 330, e), lerp(md[1] - 40, pd[1] + 40, e), 0.14, 0, t, 'eic');
      if (extra) extra(pr); };
    add({ id: '9.02', at: s0, note: 'French and Company armies and ships move back and forth along the coast', draw: (lt, d, t) => war(lt, t) });
    add({ id: '9.03', at: at(i + 2), note: 'slip THE CARNATIC WARS over the moving armies', draw: (lt, d, t) => war(lt + (at(i + 2) - s0), t, () => K.slip('THE CARNATIC WARS', 960, 240, eob(seg(lt, 0.05, 0.4)), -0.02, 60)) });
    cue(s0 + 0.3, 'steps', { dur: 1.6, gain: 0.4 }); cue(s0 + 1.2, 'waves', { dur: 1.5, gain: 0.4 }); }
  { const s0 = at(i + 3), p0 = wd('pondicherry', i + 3, s0);
    add({ id: '9.04', at: s0, note: 'the Company army reaches Wandiwash; the French fall back; the French flag at Pondicherry comes down, the Company flag goes up', draw: (lt, d, t) => {
      const pr = map(t, { view: CV, pins: [['wandiwash', seg(lt, 0.1, 0.4)], ['pondicherry', 1], ['madras', 1]] });
      const md = pr(80.27, 13.08), wd2 = pr(79.6, 12.5), pd = pr(79.81, 11.94), m = eio(seg(lt, 0, p0 * 0.8));
      K.armyToken(lerp(md[0] - 110, wd2[0] + 40, m), lerp(md[1] - 80, wd2[1] - 50, m), 'eic', 0.9, t);
      K.armyToken(lerp(wd2[0] + 160, pd[0] - 80, m), lerp(wd2[1] + 20, pd[1] - 40, m), 'france', 0.9, t, 1 - seg(lt, p0, p0 + 0.6));
      const fl = eio(seg(lt, p0, p0 + 0.8)); K.flag('france', pd[0] + 30, pd[1] + 10, 170, 0.55, t, fl); if (fl > 0.6) K.flag('eic', pd[0] + 30, pd[1] + 10, 170 * eob(seg(lt, p0 + 0.5, p0 + 1.1)), 0.55, t);
      K.ribbon('1761', 1120, 230, eob(seg(lt, p0, p0 + 0.4)), 70);
    } });
    cue(s0 + 0.2, 'steps', { dur: 1.2, gain: 0.4 }); cue(s0 + p0 + 0.3, 'thud', { gain: 0.5 }); }
  add({ id: '9.05', at: at(i + 4), note: 'Siraj-ud-Daulah on his throne in Murshidabad', draw: (lt, d, t) => { K.mughalCourt({ throne: 'siraj', pan: lerp(-60, 40, eio(clamp(lt / d))) }); K.courtForeground(40); } });
  { const s0 = at(i + 5);
    add({ id: '9.06', at: s0, note: 'stones added to Fort William; the Nawab frowns', draw: (lt, d, t) => { K.sutanuti({ t, walls: 1 }); K.fortRise(960, 790, 1.2, 0.5 + 0.5 * seg(lt, 0, d)); } });
    for (let k = 0; k < 4; k++) cue(s0 + 0.2 + k * 0.4, 'brick', { gain: 0.5 }); }
  { const s0 = at(i + 6), z0 = wd('seized', i + 6, s0);
    add({ id: '9.07', at: s0, note: '1756: the Company flag at Fort William comes down; a Mughal flag goes up', draw: (lt, d, t) => { K.sutanuti({ t, walls: 1 }); K.flag('mughal', 1340, 640, lerp(0, 230, eio(seg(lt, z0 + 0.4, z0 + 1.2))), 0.7, t); K.ribbon('1756', 380, 230, eob(seg(lt, 0.1, 0.5)), 70); } });
    cue(s0 + z0, 'thud', { gain: 0.4 }); }
  add({ id: '9.08', at: at(i + 7), note: 'Clive on deck; a crimson route Madras -> Calcutta', draw: (lt, d, t) => { const pr = map(t, { view: K.VIEWS.india }); const r = [[80.4, 13.1], [82.5, 16.5], [86.5, 20], [88.3, 22.4]].map(([a, b]) => pr(a, b)); const h = K.dashedRoute(r, eio(seg(lt, 0.2, d))); K.eastIndiaman(h[0], h[1] - 10, 0.14, 0, t, 'eic'); K.cast('clive', { x: 360, y: 800, h: 460, arm: 40 }); } });
  { const s0 = at(i + 8), p0 = wd('plassey', i + 8, s0);
    add({ id: '9.09', at: s0, note: '23 June 1757, Plassey: two armies in formation face each other; the Nawab under the Bengal Subah flag (no fighting)', draw: (lt, d, t) => { K.armyField({ t, show: seg(lt, 0.2, 1.4) }); K.ribbon('23 JUNE 1757', 960, 200, eob(seg(lt, 0.1, 0.5)), 72); } });
    cue(s0 + p0, 'gong', { gain: 0.3 }); }
  add({ id: '9.10', at: at(i + 9), note: 'Clive and Mir Jafar behind a tent flap; a folded letter passes', draw: (lt, d, t) => { K.parchment(99); K.cut(K.P_poly([[300, 820], [960, 120], [1620, 820]]), '#D9C49A', { shadow: 0.6, edge: 5 }); K.cut(K.P_poly([[960, 120], [1180, 820], [960, 820]]), '#C9B07A', { shadow: 0.3, edge: 3 }); K.cast('clive', { x: 760, y: 820, h: 420, arm: lerp(10, 45, eob(seg(lt, 0.6, 1.0))), prop: 'letter' }); K.cast('mirjafar', { x: 1160, y: 820, h: 420, dir: -1, arm: 30 }); } });
  cue(at(i + 9) + 0.6, 'cloth');
  { const s0 = at(i + 10);
    add({ id: '9.11', at: s0, note: 'the banker Jagat Seth Mehtab Chand; money bags slide across to the Company', draw: (lt, d, t) => { K.bankerRoom(seg(lt, 0.4, d), t); K.slip('JAGAT SETH', 560, 220, eob(seg(lt, 0.2, 0.6)), -0.02, 54); } });
    cue(s0 + 0.6, 'coins', { gain: 0.5 }); }
  { const s0 = at(i + 11), a0 = wd('aside', i + 11, s0);
    add({ id: '9.11b', at: s0, note: "Plassey: Mir Jafar's division turns and marches off the field", draw: (lt, d, t) => K.armyField({ t, aside: eio(seg(lt, a0 - 0.6, d + 0.4)) }) });
    cue(s0 + a0 - 0.5, 'steps', { dur: 1.6, gain: 0.5 }); }
  { const s0 = at(i + 12), f0 = wd('fortune', i + 12, s0), sit = Math.max(0.9, f0 - 0.5);
    add({ id: '9.12', at: s0, note: 'Company officials offer the empty throne to Mir Jafar; he sits; then the fortune', draw: (lt, d, t) => {
      K.mughalCourt({ throne: '', courtiers: false, seat: 'takht' }); const w = eio(seg(lt, 0, sit - 0.2));
      K.layer(0, 0.6, () => {
        if (lt < sit) K.cast('mirjafar', { x: lerp(820, 1200, w), y: 800, h: 360, walk: w < 1 ? t * 7 : null });
        else { ctx.save(); ctx.globalAlpha = seg(lt, sit, sit + 0.3); K.cast('mirjafar', { x: 1370, y: 640, h: 300, seated: 1, dir: -1 }); ctx.restore(); }
        K.cast('clive', { x: 560, y: 800, h: 400, arm: 55 }); K.envoy(1, { x: 1790, y: 800, h: 380, dir: -1, bow: 0.3 });
      });
      K.courtForeground(0);
      if (lt > f0 - 0.3) { const n = Math.floor(30 * eo(seg(lt, f0 - 0.3, d))); ctx.save(); ctx.translate(330, 820); ctx.scale(1.2, 1.2); K.coinStacks(-110, 0, n, 10, P.gold); ctx.restore(); }
    } });
    cue(s0 + sit, 'cloth'); cue(s0 + f0, 'coins'); }
}
