// From Merchants to Masters: the shot list. Each chapter lives in src/chapters/chN_*.js; shared art in src/core/kit*.js.
// This file adds the chapter cards and the screen-fixed overlay (era bar + farman stack) to every shot.
import * as K from './core/kit.js';
import { clamp, lerp, eio, seg } from './core/lib.js';
import { G, setup, YEARS, ERA_IDX, CARDS, chapterOf, first, last, at, L, Le } from './chapters/common.js';
import * as ch0 from './chapters/ch0_hook.js';
import * as ch5 from './chapters/ch5_war.js';
import * as PH from './chapters/placeholder.js';

const BUILT = { 0: ch0.build, 5: ch5.build };
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
