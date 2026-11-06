// From Merchants to Masters: the shot list. Each chapter lives in src/chapters/chN_*.js; shared art in src/core/kit*.js.
// This file adds the chapter cards and the screen-fixed overlay (era bar + farman stack) to every shot.
import * as K from './core/kit.js';
import { clamp, lerp, eio, seg } from './core/lib.js';
import { G, setup, YEARS, ERA_IDX, CARDS, chapterOf, first, last, at, L, Le, T } from './chapters/common.js';
import * as ch0 from './chapters/ch0_hook.js';
import * as ch5 from './chapters/ch5_war.js';
import * as ch1 from './chapters/ch1_charter.js';
import * as ch2 from './chapters/ch2_jahangir.js';
import * as ch3 from './chapters/ch3_madras.js';
import * as ch4 from './chapters/ch4_bombay.js';
import * as ch6 from './chapters/ch6_calcutta.js';
import * as ch7 from './chapters/ch7_farman.js';
import * as ch8 from './chapters/ch8_outro.js';
import * as PH from './chapters/placeholder.js';

const BUILT = { 0: ch0.build, 1: ch1.build, 2: ch2.build, 3: ch3.build, 4: ch4.build, 5: ch5.build, 6: ch6.build, 7: ch7.build, 8: ch8.build };
export function buildShots(script) {
  setup(script);
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  for (let ch = 0; ch <= 8; ch++) {
    (BUILT[ch] || PH.build(ch))(add, cue);
    if (ch > 0) {   // the chapter card sits in the pause before the chapter's first line
      const t0 = G.chStart[ch], [yr, title] = CARDS[ch];
      add({ id: `card${ch}`, at: t0, card: ch, note: `CARD ${yr}: ${title}`, draw: (lt) => K.chapterCard(lt, yr, title, ch) });
      cue(t0, 'page'); cue(t0 + 0.75, 'seal', { gain: 0.6 });
    }
  }
  // no cut over 3.5 s: split long shots at the word nearest their middle with a reframe (same action, tighter camera)
  S.sort((a, b) => a.at - b.at);
  for (let k = 0; k < S.length; k++) {
    const sh = S[k], end = k < S.length - 1 ? S[k + 1].at : T.dur, d = end - sh.at;
    if (sh.card || d <= 3.5 || sh.noSplit) continue;
    const mid = sh.at + d / 2, w = T.words.filter((x) => x.s > sh.at + 1.2 && x.s < end - 1.2).sort((a, b) => Math.abs(a.s - mid) - Math.abs(b.s - mid))[0];
    const off = (w ? w.s - 0.06 : mid) - sh.at, base = sh;
    const cam = (lt, dd) => { const c = base.camera ? base.camera(lt + off, d) : { x: base.cam?.[0] ?? 960, y: base.cam?.[1] ?? 500, zoom: 1 }; return { x: lerp(c.x, 960, 0.15), y: lerp(c.y, 470, 0.15), zoom: (c.zoom || 1) * 1.14 }; };
    S.splice(k + 1, 0, { id: sh.id + 'r', at: sh.at + off, note: '(reframe) ' + sh.note, camera: cam, draw: (lt, dd, t) => base.draw(lt + off, d, t), overlay: base.overlay ? (lt, dd, t) => base.overlay(lt + off, d, t) : null });
  }
  // music sections for mix.py: one per chapter (cold open starts at 0)
  G.music = G.chStart.map((t, ch) => ({ t: +t.toFixed(3), kind: script.chapters[ch][2] }));
  for (const m of G.musicExtra || []) G.music.push(m); G.music.sort((a, b) => a.t - b.t);
  // overlay on every shot: the era bar and the farman stack (screen-fixed, no camera)
  for (const sh of S) {
    const own = sh.overlay;
    sh.overlay = (lt, d, t) => {
      const ch = chapterOf(t); let active = ERA_IDX[ch], p = active / 7;
      if (ch === 0 && G.eraRace) { const k = eio(seg(t, G.eraRace.t0, G.eraRace.t1)); p = lerp(5 / 7, 1, k); active = k > 0.98 ? 7 : 5; }
      if (ch === 1 && t < G.chStart[1] + 0.4) p = lerp(1, 0, eio(seg(t, G.chStart[1], G.chStart[1] + 0.4)));
      K.eraBar(YEARS, active, p);
      K.farmanStack(G.stackLand.filter((x) => x <= t).length);
      if (own) own(lt, d, t);
    };
  }
  return { shots: S, cues: CUES, music: G.music, chStart: G.chStart };
}
