// 16:9 LAYOUT PROOF (temporary): one court shot with a lateral pan, the era bar overlay and a caption.
// Replaced by src/chapters/ch0..ch8 once the plan is approved.
import { ctx, W, H, clamp, seg, eio, eob } from './core/lib.js';
import * as K from './core/kit.js';
const YEARS = [1600, 1612, 1639, 1668, 1686, 1690, 1717, 1757];

function bowing(x, y, h, role, k, dir = 1) {   // a figure bowing low: rotate the body forward around the feet
  ctx.save(); ctx.translate(x, y); ctx.rotate(dir * 0.55 * k); K.figure({ x: 0, y: 0, h, role, dir, arm: 20 * k }); ctx.restore();
}
export function buildShots() {
  const S = [{ id: 'PROOF', at: 0, note: '16:9 layout proof: court two-shot, era bar, caption',
    camera: (lt, d) => ({ x: 900 + 120 * eio(clamp(lt / 6)), y: 520, zoom: 1.04 }),
    draw(lt, d, t) {
      K.hall();
      K.figure({ x: 960, y: 700, h: 300, role: 'king' });                 // throne figure (placeholder until the cast sheet)
      const k = eio(seg(lt, 0.5, 1.6));
      bowing(560, 800, 380, 'merchant', k); bowing(720, 800, 380, 'merchant', k);
      K.slip('THE MUGHAL COURT', 1360, 230, eob(seg(lt, 0.2, 0.6)), -0.03, 40);
    },
    overlay(lt) { K.eraBar(YEARS, 5, 0.71); } }];
  return { shots: S, cues: [] };
}
