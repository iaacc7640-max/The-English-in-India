// Temporary shots for chapters not built yet (pilot stage): one plain map shot per line, so the full timeline renders.
import * as K from '../core/kit.js';
import { at, G } from './common.js';
export function build(ch) {
  return (add) => G.lines[ch].forEach((i) => add({ id: `${ch}.${i}`, at: at(i), note: `PLACEHOLDER ch${ch}`, draw: () => { K.realMap({ view: K.VIEWS.india }); K.slip(`CH${ch} · NOT BUILT YET`, 960, 300, 1, 0, 50); } }));
}
