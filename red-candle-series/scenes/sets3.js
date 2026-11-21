// Series additions: the Kerala home the night before he leaves, the Onam sadya, the MeowXTrader brand card.
import { Ref, paintRef } from '../engine/plate.js';
import { P, E, RR, lin, rad } from './common.js';
import { person, limb, hand, shiftC } from './people.js';
import { SW, SH } from './sets.js';

const RECT = (x, y, w, h) => P([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const R_STD = [44, 22, 11, 5.5, 2.8];
const glow = (R, x, y, r, col, a = .45) => R.tint(E(x, y, r, r), rad(x, y, 4, r, [[0, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]));
const done = (R, f = {}, a = {}, seed = 1) => ({ strokes: paintRef(R, { R: R_STD, T: 13, seed }), ref: R, f, a });

// Kerala home, night before the flight: Amma packs pickle jars into the open suitcase, Nikhil (19) laughs.
export function buildHome() {
  const R = new Ref(SW, SH, 1);
  R.fill(RECT(0, 0, SW, SH), lin(0, 0, 0, SH, [[0, '#4a2a18'], [.5, '#6a3e22'], [1, '#2a180e']]), { maxR: 44, dir: 90 });
  // lime-washed wall with a wooden window (night outside), a calendar, a hanging lamp
  R.fill(RECT(0, 0, SW, 1200), lin(0, 0, 0, 1200, [[0, '#c8a878'], [1, '#a07a50']]), { maxR: 40, dir: 90, detail: 1.6 });
  R.fill(RECT(720, 180, 380, 460), '#14202a', { maxR: 20, dir: 90 });
  R.line(c => { c.rect(720, 180, 380, 460); c.moveTo(910, 180); c.lineTo(910, 640); }, '#5a3418', 26, { maxR: 6 });
  R.fill(RECT(160, 220, 200, 260), '#efe6d2', { maxR: 10, dir: 0 }); R.fill(RECT(160, 220, 200, 70), '#b8341e', { maxR: 6, dir: 0 });
  R.fill(P([[540, 0], [560, 0], [560, 140], [540, 140]]), '#2a1a10', { maxR: 4 }); R.fill(E(550, 190, 70, 50), '#ffd890', { maxR: 6, hgt: 1.3 });
  glow(R, 550, 220, 760, '255,190,110', .45);
  R.fill(RECT(0, 1200, SW, 934), lin(0, 1200, 0, SH, [[0, '#8a3a22'], [1, '#4a1e12']]), { maxR: 34, dir: 0 });   // red-oxide floor
  const amma = person(R, 360, 860, 260, 'amma', { light: 1, turn: .35, tint: '#ffc078', tintA: .22, body: 3.2 });
  const nik = person(R, 880, 980, 240, 'nik19', { light: -1, turn: -.4, tint: '#ffc078', tintA: .2, body: 2.6 });
  // open suitcase on the floor, clothes folded, glass pickle jars
  R.fill(P([[160, 1560], [1000, 1560], [1060, 1980], [100, 1980]]), lin(0, 1560, 0, 1980, [[0, '#1e3050'], [1, '#121c30']]), { maxR: 14, dir: 0, hgt: 1.2 });
  R.fill(P([[200, 1600], [960, 1600], [1000, 1920], [160, 1920]]), '#d8c8a8', { maxR: 16, dir: 0 });
  R.fill(P([[160, 1560], [1000, 1560], [940, 1260], [220, 1260]]), lin(0, 1260, 0, 1560, [[0, '#2a4068'], [1, '#1a2a48']]), { maxR: 14, dir: 90, hgt: 1.1 });   // lid
  for (const [x, w, c] of [[300, 140, '#c8a040'], [470, 130, '#b8541e'], [640, 150, '#8a2a14']]) { R.fill(RR(x, 1620, w, 200, 22), c, { maxR: 8, dir: 90, hgt: 1.4 }); R.fill(RR(x - 6, 1600, w + 12, 40, 10), '#e8e4dc', { maxR: 4, dir: 0 }); }
  limb(R, [[240, 1260], [300, 1450], [420, 1600]], 70, '#e8dcc0'); hand(R, 440, 1620, 40, 'amma', .6);
  return done(R, { amma, nik }, {}, 71);
}

// Onam sadya in a UK living room: friends on the floor, banana leaves, Anoop's hand on Nikhil's, Jithin among them.
export function buildSadya() {
  const R = new Ref(SW, SH, 1);
  R.fill(RECT(0, 0, SW, SH), lin(0, 0, 0, SH, [[0, '#e8c890'], [.45, '#d8a860'], [1, '#6a4428']]), { maxR: 44, dir: 90 });
  R.fill(RECT(0, 0, SW, 700), lin(0, 0, 0, 700, [[0, '#f2dcb0'], [1, '#e0c088']]), { maxR: 40, dir: 90, detail: 1.8 });
  for (let i = 0; i < 9; i++) R.fill(E(80 + i * 130, 90 + (i % 2) * 30, 40, 40), ['#f4c430', '#e8742a', '#f4e8c8'][i % 3], { maxR: 10 });   // pookalam-colour garland
  glow(R, 600, 300, 800, '255,220,150', .35);
  // friends in kasavu shirts, seated in a row
  const fr = [];
  for (const [x, y, who] of [[130, 760, 'nik24'], [1080, 760, 'anoop']]) {}   // (placeholders for layout)
  const ano = person(R, 300, 980, 240, 'anoop', { light: 1, turn: .45, body: 2.2 });
  const jit = person(R, 640, 900, 210, 'jithin', { light: 0, turn: -.1, body: 2.4 });
  const nik = person(R, 930, 980, 240, 'nik24', { light: -1, turn: -.45, body: 2.2 });
  for (const x of [80, 1150]) R.fill(E(x, 860, 70, 90), '#4a3020', { maxR: 20, detail: 2 });   // friends at the frame edges
  // banana leaves on the floor with rice, curries, payasam
  R.fill(RECT(0, 1460, SW, 674), lin(0, 1460, 0, SH, [[0, '#8a6040'], [1, '#4a3020']]), { maxR: 30, dir: 0 });
  for (const [x, y, w] of [[60, 1560, 520], [620, 1580, 520]]) {
    R.fill(E(x + w / 2, y + 120, w / 2, 120, -.04), lin(x, y, x + w, y + 240, [[0, '#3a8a3a'], [1, '#2a6a2a']]), { maxR: 14, dir: 'edge' });
    R.fill(E(x + w * .45, y + 130, 90, 55), '#f6f2e6', { maxR: 6 });
    [['#e8a030', .2, 60], ['#c84a1e', .7, 80], ['#f0e0a0', .82, 150], ['#6a8a2a', .3, 180], ['#d8642a', .62, 190]].forEach(([c, u, dy]) => R.fill(E(x + w * u, y + dy, 34, 22), c, { maxR: 4 }));
  }
  // Anoop's hand reaching over Nikhil's
  limb(R, [[420, 1260], [640, 1330], [760, 1360]], 70, '#f2e8cc'); hand(R, 780, 1360, 38, 'anoop', 0);
  return done(R, { ano, jit, nik }, {}, 72);
}

// MeowXTrader brand card: a cat's-eye green candle and the name, laid in with the knife.
export function buildBrand() {
  const R = new Ref(1000, 700, 1);
  R.fill(RR(470, 60, 60, 300, 8), lin(470, 0, 530, 0, [[0, '#2fb46a'], [1, '#1e8a4e']]), { maxR: 6, dir: 90, hgt: 1.3 });
  R.line(c => { c.moveTo(500, 10); c.lineTo(500, 410); }, '#5ae08e', 8, { maxR: 2 });
  R.fill(P([[440, 70], [470, 20], [480, 70]]), '#2fb46a', { maxR: 3 }); R.fill(P([[520, 70], [530, 20], [560, 70]]), '#2fb46a', { maxR: 3 });   // cat ears on the candle
  R.text('MeowXTrader', 500, 560, '700 130px "Cormorant Garamond"', '#efe2c4', { maxR: 6, dir: 0 });
  R.text('trade with rules', 500, 650, 'italic 600 56px "Cormorant Garamond"', '#5ae08e', { maxR: 4, dir: 0 });
  return { strokes: paintRef(R, { R: [10, 5, 2.5], T: 10, seed: 73 }), ref: R };
}
