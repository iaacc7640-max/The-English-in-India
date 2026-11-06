// Shared timing helpers for the chapter files (no art here: shared art lives in core/kit*.js).
import { T, L, Le, Wd } from '../core/timing.js';
export { L, Le, Wd, T };
export const YEARS = [1600, 1612, 1639, 1668, 1686, 1690, 1717, 1757];
export const ERA_IDX = [5, 0, 1, 2, 3, 4, 5, 6, 7];          // chapter -> active era tick
export const CARDS = [null, ['1600', "A Queen's Charter"], ['1612', "Knocking on Jahangir's Door"], ['1639', 'A Fort on the Sand'], ['1668', 'Ten Pounds for Bombay'],
  ['1686', 'The War They Lost'], ['1690', 'Three Villages'], ['1717', "The Company's Magna Carta"], ['1757', 'Next, the French']];
/** G: the global state the overlay reads (era marker motion, farman stack landings), filled by the chapters */
export const G = { script: null, lines: {}, chStart: [], stackLand: [99999, 99999, 99999, 99999, 99999], eraRace: null, ringsShow: 99999, ringFill: { madras: 99999, bombay: 99999, calcutta: 99999 } };
/** the three-forts rings at time t (null = not shown yet; 0 = empty ring; 0..1 = the fort pops in) */
export function ringsAt(t) {
  if (t < G.ringsShow) return {};
  const r = {}; for (const id of ['madras', 'bombay', 'calcutta']) r[id] = t < G.ringFill[id] ? 0 : Math.min(1, (t - G.ringFill[id]) / 0.5) || 0.001; return r;
}
export function setup(script) {
  G.script = script; G.lines = {};
  script.lines.forEach((ln, i) => (G.lines[ln.chapter] ||= []).push(i));
  G.chStart = Object.keys(G.lines).map(Number).sort((a, b) => a - b).map((ch) => ch === 0 ? 0 : Le(G.lines[ch - 1].at(-1)) + 0.05);
}
/** first / last line index of a chapter */
export const first = (ch) => G.lines[ch][0], last = (ch) => G.lines[ch].at(-1);
/** the cut time for line i (just before its first word) */
export const at = (i) => (i === 0 ? 0 : L(i) - 0.08);
export const chapterOf = (t) => { let c = 0; G.chStart.forEach((s, k) => { if (t >= s) c = k; }); return c; };
