import { Impasto, Strokes } from './engine/impasto.js';
import { Ref, paintRef } from './engine/plate.js';
import { person, face } from './scenes/people.js';
import { P, lin } from './scenes/common.js';
let E, b, tex, fs = [], dyn;
export async function setup(cv) {
  E = new Impasto(cv, { W: 1080, H: 1920 }); dyn = new Strokes(2000);
  const R = new Ref(1080, 1920, 1);
  R.fill(P([[0,0],[1080,0],[1080,1920],[0,1920]]), lin(0,0,0,1920,[[0,'#3a4a6a'],[1,'#6a5040']]), { maxR: 40, dir: 90 });
  const t0 = performance.now();
  fs.push(person(R, 280, 420, 260, 'nik19', { light: -1 }));
  fs.push(person(R, 800, 420, 260, 'jithin', { light: 1, turn: -.3 }));
  fs.push(person(R, 280, 1300, 260, 'amma', { light: -1, turn: .3 }));
  fs.push(person(R, 800, 1300, 260, 'achan', { light: 1 }));
  const st = paintRef(R, { R: [40, 20, 10, 5, 2.6], T: 13, seed: 3 });
  window.BUILD_MS = performance.now() - t0; console.log('build ms', window.BUILD_MS, st.n);
  b = E.batch(st.data()); tex = E.texture(R.ctx.canvas);
  window.DUR = 3;
  return t => { E.begin(); E.under(tex, 1080, 1920, { grey: 0 }); E.draw(b, { grey: 0, t }); 
    fs.forEach((f, i) => face(dyn, f, { mouth: i == 1 ? .6 : 0, smile: i == 1 ? .5 : 0, brow: i == 2 ? -1 : 0, look: [i==0?1:0,0] }));
    E.drawNow(dyn.data(), { grey: 0, run: 0 }); dyn.clear(); E.finish({}); };
}
