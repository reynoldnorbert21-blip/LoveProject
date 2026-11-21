// Sets for Episodes 2 and 3 (same conventions as sets.js: SW x SH scene units, reference illustration -> knife strokes).
import { Ref, paintRef } from '../engine/plate.js';
import { P, E, RR, lin, rad } from './common.js';
import { person, limb, hand, shiftC } from './people.js';
import { SW, SH } from './sets.js';

const RECT = (x, y, w, h) => P([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const R_STD = [44, 22, 11, 5.5, 2.8];
const bg = (R, stops, o = {}) => R.fill(RECT(0, 0, SW, SH), lin(0, 0, 0, SH, stops), { maxR: 44, dir: o.dir ?? 90, fallback: 90, detail: 1.6, ...o });
const done = (R, f = {}, a = {}, seed = 1) => ({ strokes: paintRef(R, { R: R_STD, T: 13, seed }), ref: R, f, a });
const glow = (R, x, y, r, col, a = .45) => R.tint(E(x, y, r, r), rad(x, y, 4, r, [[0, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]));

// ---------- a phone held in two hands, screen to camera (live texture) ----------
export function buildPhone(o = {}) {
  const R = new Ref(SW, SH, 1), who = o.who || 'nik24';
  bg(R, o.bg || [[0, '#151820'], [1, '#0a0b10']]);
  if (o.warm) glow(R, 300, 500, 700, '255,170,90', .3);
  if (o.cold) glow(R, 900, 400, 700, '120,160,230', .25);
  if (o.rain) for (let i = 0; i < 6; i++) glow(R, 150 + i * 190, 300 + (i % 2) * 200, 90, '255,190,110', .35);
  R.fill(RR(300, 360, 600, 1160, 60), '#0c0c10', { maxR: 6, hgt: 1.2 });
  R.fill(c => { c.moveTo(80, SH); c.quadraticCurveTo(120, 1500, 310, 1380); c.lineTo(330, 1560); c.quadraticCurveTo(260, 1700, 300, SH); c.closePath(); }, shiftC(o.sleeve || '#24324f', 1), { maxR: 14, dir: 80 });
  R.fill(c => { c.moveTo(1120, SH); c.quadraticCurveTo(1080, 1500, 890, 1380); c.lineTo(870, 1560); c.quadraticCurveTo(940, 1700, 900, SH); c.closePath(); }, shiftC(o.sleeve || '#24324f', .8), { maxR: 14, dir: 100 });
  hand(R, 320, 1440, 70, who, -.3); hand(R, 880, 1440, 70, who, 3.4);
  return done(R, {}, { screen: [328, 390, 544, 1100] }, o.seed || 31);
}

// ---------- close-up portrait (reaction shots), any light ----------
export function buildFaceCU(who, o = {}) {
  const R = new Ref(SW, SH, 1);
  bg(R, o.bg || [[0, '#14141c'], [1, '#08080c']]);
  if (o.window) { R.fill(RECT(80, 140, 500, 760), lin(0, 140, 0, 900, o.window), { maxR: 24, dir: 92 }); R.line(c => { c.rect(80, 140, 500, 760); c.moveTo(330, 140); c.lineTo(330, 900); }, '#0a0a10', 20, { maxR: 6 }); }
  if (o.lamps) o.lamps.forEach(([x, y]) => glow(R, x, y, 60, '255,190,110', .6));
  const f = person(R, o.x ?? 620, o.y ?? 1240, o.s ?? 500, who, { light: o.light ?? 1, tint: o.tint, tintA: o.tintA ?? .4, body: 2.0, turn: o.turn ?? 0 });
  if (o.fg) R.fill(P([[260, 1980], [1200, 1880], [1200, SH], [260, SH]]), '#121318', { maxR: 10, dir: 0 });
  if (o.fgLine) R.line(c => { c.moveTo(260, 1978); c.lineTo(1200, 1878); }, o.fgLine, 10, { maxR: 3, hgt: 1.3 });
  return done(R, { p: f }, {}, o.seed || 32);
}

// ---------- Episode 2 ----------
export function buildOnam() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#5a3a20'], [.5, '#8a5a2a'], [1, '#3a2414']]);
  glow(R, 200, 500, 700, '255,200,110', .35);
  // doorway to the party: warm blur of people
  R.fill(RECT(700, 200, 500, 1200), lin(0, 200, 0, 1400, [[0, '#e8b860'], [1, '#c88840']]), { maxR: 44, dir: 90, detail: 2.4 });
  for (let i = 0; i < 4; i++) R.fill(E(780 + i * 110, 820 + (i % 2) * 40, 50, 64), ['#f2e6c8', '#e8d8b0', '#f6ecd6', '#e2d0a8'][i], { maxR: 30, detail: 2.4 });
  // counter with steel vessels (sambar, payasam)
  R.fill(RECT(0, 1640, SW, 494), lin(0, 1640, 0, SH, [[0, '#6a4a30'], [1, '#2a1a10']]), { maxR: 26, dir: 0 });
  for (const [x, w] of [[140, 200], [420, 170], [880, 230]]) { R.fill(RR(x, 1500, w, 160, 30), lin(x, 0, x + w, 0, [[0, '#e8ecf0'], [.4, '#a8b0b8'], [1, '#6a7078']]), { maxR: 8, dir: 90, hgt: 1.3 }); R.fill(E(x + w / 2, 1500, w / 2, 18), x === 420 ? '#e8c890' : '#c87a3a', { maxR: 5 }); }
  const nik = person(R, 380, 980, 280, 'nik24', { light: -1, turn: .2, tint: '#ffc070', tintA: .2, body: 2.6 });
  const jit = person(R, 760, 900, 270, 'jithin', { light: 1, turn: -.6, tint: '#ffc070', tintA: .22, body: 2.8 });
  hand(R, 590, 830, 40, 'jithin', 3.6);                                   // hand cupped to whisper
  return done(R, { nik, jit }, {}, 33);
}
export function buildRevenge() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#14060a'], [.5, '#1c0a10'], [1, '#08040a']]);
  const nik = person(R, 600, 1260, 330, 'nik24', { light: 0, tint: '#ff5040', tintA: .35, body: 2.4 });
  // three monitors arranged around him (live red charts), seen from behind the desk
  for (const [x, y, w, h] of [[30, 260, 380, 300], [420, 160, 360, 290], [790, 260, 380, 300]]) R.fill(RECT(x - 14, y - 14, w + 28, h + 28), '#0c0c10', { maxR: 6 });
  R.fill(E(1000, 1000, 80, 80), '#e8e2d0', { maxR: 8 }); R.line(c => c.ellipse(1000, 1000, 80, 80, 0, 0, 7), '#2a2a30', 12, { maxR: 3 });
  hand(R, 380, 1760, 56, 'nik24', 0); hand(R, 820, 1760, 56, 'nik24', 3.1);
  R.fill(RR(300, 1780, 600, 90, 10), '#26262c', { maxR: 6, dir: 0 });
  return done(R, { nik }, { mons: [[30, 260, 380, 300], [420, 160, 360, 290], [790, 260, 380, 300]], clock: [1000, 1000] }, 34);
}
export function buildSplit() {
  const R = new Ref(SW, SH, 1);
  // top half: Nikhil in a dark messy room; bottom half: Jithin in a bright sunny office
  R.fill(RECT(0, 0, SW, SH / 2), lin(0, 0, 0, SH / 2, [[0, '#101018'], [1, '#1a1418']]), { maxR: 40, dir: 90, group: 'top' });
  R.fill(RECT(0, SH / 2, SW, SH / 2), lin(0, SH / 2, 0, SH, [[0, '#f0e6c8'], [1, '#c8d4d8']]), { maxR: 40, dir: 90, group: 'bot' });
  R.fill(RECT(700, SH / 2 + 60, 460, 600), '#fff4d0', { maxR: 30, dir: 90 });
  const nik = person(R, 520, 600, 240, 'nik24', { light: 1, turn: .3, tint: '#7a8aff', tintA: .18, body: 1.8 });
  hand(R, 690, 520, 44, 'nik24', -1.8);                      // phone to ear
  R.fill(RR(680, 390, 60, 140, 10), '#0c0c10', { maxR: 4 });
  const jit = person(R, 560, 1560, 250, 'jithin', { light: -1, turn: -.3, body: 2.2 });
  hand(R, 360, 1480, 44, 'jithin', -1.3);
  R.fill(RR(320, 1340, 60, 140, 10), '#0c0c10', { maxR: 4 });
  R.fill(RECT(0, SH / 2 - 8, SW, 16), '#000000', { maxR: 4 });
  return done(R, { nik, jit }, {}, 35);
}
export function buildConfront() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#4a4e56'], [.6, '#3a3c44'], [1, '#1e1e24']]);
  R.fill(RECT(820, 200, 300, 900), '#6a7078', { maxR: 30, dir: 90 });             // grey window light
  const nik = person(R, 300, 1220, 270, 'nikBroken', { light: 1, turn: .4, body: 3.0 });
  const jit = person(R, 1000, 900, 190, 'jithin', { light: -1, turn: -.7, body: 3.6 });
  const ano = person(R, 760, 1080, 290, 'anoop', { light: -1, turn: -.5, body: 3.4 });
  limb(R, [[560, 1460], [430, 1340], [330, 1310]], 84, '#6e2232');               // pointing arm
  hand(R, 320, 1306, 40, 'anoop', 3.2);
  return done(R, { nik, jit, ano }, {}, 36);
}
export function buildLeave() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#3a3a40'], [1, '#18181c']]);
  R.fill(RECT(780, 300, 360, 1500), lin(0, 300, 0, 1800, [[0, '#d8d0b8'], [1, '#8a826e']]), { maxR: 30, dir: 90 });   // open door, light outside
  R.fill(RECT(780, 300, 40, 1500), '#2a2420', { maxR: 6, dir: 90 });
  for (let i = 0; i < 2; i++) R.fill(c => { c.ellipse(900 + i * 120, 900, 60, 70, 0, 0, 7); }, '#4a4450', { maxR: 20 });   // friends leaving, silhouettes
  const jit = person(R, 640, 980, 230, 'jithin', { light: 1, turn: -.4, body: 3.4 });
  const nik = person(R, 300, 1180, 270, 'nikBroken', { light: 1, turn: .2, body: 3.2 });
  limb(R, [[560, 1250], [480, 1300], [430, 1310]], 70, '#a9c8e6'); hand(R, 420, 1310, 36, 'jithin', 3.4);
  return done(R, { nik, jit }, {}, 37);
}
export function buildBusStop() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#0c1020'], [.6, '#141a2c'], [1, '#0a0c14']]);
  R.fill(RECT(840, 120, 24, 1700), '#1a1c22', { maxR: 4 }); R.fill(E(852, 130, 60, 40), '#ffd890', { maxR: 6, hgt: 1.3 });
  glow(R, 852, 160, 520, '255,210,140', .45);
  R.fill(RECT(80, 300, 1040, 30), '#2a2e38', { maxR: 6, dir: 0 });                 // shelter roof
  R.fill(RECT(100, 330, 20, 1400), '#2a2e38', { maxR: 4 });
  R.fill(RECT(160, 1420, 800, 50), '#3a3e48', { maxR: 8, dir: 0 });                // bench
  R.fill(RECT(0, 1700, SW, 434), lin(0, 1700, 0, SH, [[0, '#2a2e3c'], [1, '#0e1016']]), { maxR: 30, dir: 0 });
  for (let k = 0; k < 7; k++) R.fill(RECT(852 - (60 - k * 6), 1760 + k * 40, (120 - k * 12), 10), '#e8c088', { maxR: 4, dir: 0, alpha: .8 });
  const nik = person(R, 500, 1000, 270, 'nikBroken', { light: 1, turn: .2, tint: '#ffd8a0', tintA: .15, body: 1.6 });
  hand(R, 690, 940, 44, 'nikBroken', -1.9); R.fill(RR(680, 800, 60, 140, 10), '#0c0c10', { maxR: 4 });
  R.fill(c => { c.moveTo(200, 1300); c.lineTo(800, 1300); c.lineTo(880, 1700); c.lineTo(160, 1700); c.closePath(); }, '#24242a', { maxR: 20, dir: 90 });
  return done(R, { nik }, {}, 38);
}
export function buildNotebook(o = {}) {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#3a2618'], [1, '#1a100a']], { dir: 0 });
  glow(R, 300, 300, 900, '255,190,110', .35);
  R.fill(P([[120, 220], [1080, 180], [1110, 1480], [140, 1520]]), lin(0, 200, 0, 1500, [[0, '#f2ead6'], [1, '#d8ccb0']]), { maxR: 20, dir: 0 });
  R.fill(P([[100, 210], [130, 210], [150, 1530], [118, 1530]]), '#141214', { maxR: 4 });
  if (o.watch) { const [x, y] = [760, 1800]; limb(R, [[1200, 2000], [900, 1830], [700, 1790]], 120, '#2a2a2e'); R.line(c => c.ellipse(x, y, 70, 46, .2, 0, 7), '#9a9ea6', 22, { maxR: 5, hgt: 1.4 }); R.fill(E(x, y, 44, 38, .2), lin(x - 40, y - 30, x + 40, y + 30, [[0, '#e8ecf2'], [1, '#7a7e88']]), { maxR: 4, hgt: 1.4 }); hand(R, 620, 1780, 60, 'nikBroken', 3.3); }
  return done(R, {}, { page: [180, 240, 880, 1240] }, o.seed || 39);
}

// ---------- Episode 3 ----------
export function buildWarehouse() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#1a1410'], [.5, '#3a2a18'], [1, '#14100c']]);
  for (let i = 0; i < 3; i++) glow(R, 200 + i * 400, 160, 260, '255,170,70', .6);
  for (const x of [0, 900]) for (let y = 300; y < 1600; y += 240) { R.fill(RECT(x, y, 300, 20), '#6a4a2a', { maxR: 6, dir: 0 }); for (let k = 0; k < 2; k++) R.fill(RECT(x + 20 + k * 140, y - 150, 120, 150), ['#b88a50', '#a07440', '#c89a5a'][(y / 240 + k) % 3 | 0], { maxR: 14, dir: 90 }); }
  R.fill(RECT(0, 1700, SW, 434), lin(0, 1700, 0, SH, [[0, '#4a3a28'], [1, '#1a140e']]), { maxR: 30, dir: 0 });
  const nik = person(R, 560, 960, 260, 'nikHivis', { light: -1, turn: .3, tint: '#ffb050', tintA: .25, body: 3.0 });
  limb(R, [[760, 1260], [860, 1150], [900, 1050]], 72, '#2a2a2e');
  R.fill(RR(860, 940, 90, 160, 14), '#e8c020', { maxR: 4, hgt: 1.2 }); hand(R, 900, 1060, 40, 'nikHivis', -1.6);
  R.fill(RR(700, 1300, 400, 300, 10), '#c89a5a', { maxR: 12, dir: 90 });
  return done(R, { nik }, { beam: [930, 950] }, 40);
}
export function buildClass() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#e8dcc0'], [.5, '#c8b890'], [1, '#5a4a38']]);
  R.fill(RECT(120, 160, 960, 560), '#f8f6f0', { maxR: 30, dir: 0 });                 // whiteboard
  R.line(c => c.rect(120, 160, 960, 560), '#8a8a90', 18, { maxR: 4 });
  R.text('RISK 1%', 600, 520, '700 200px "Cormorant Garamond"', '#c8241c', { maxR: 4 });
  const men = person(R, 900, 760, 190, 'mentor', { light: -1, turn: -.4, body: 2.2 });
  for (let i = 0; i < 4; i++) person(R, 150 + i * 300, 1240, 150, ['nik24', 'anoop', 'jithin', 'nik24'][i], { light: 0, turn: 0, body: 1.2 });   // heads of students (from behind is too costly: we see them three-quarter)
  R.fill(RECT(0, 1420, SW, 714), lin(0, 1420, 0, SH, [[0, '#6a5038'], [1, '#2a1e14']]), { maxR: 26, dir: 0 });
  const nik = person(R, 600, 1700, 230, 'nikBroken', { light: 1, turn: 0, body: 1.8 });
  R.fill(P([[380, 1960], [700, 1940], [720, 2120], [390, 2134]]), '#141214', { maxR: 6 }); hand(R, 700, 1990, 40, 'nikBroken', 0);
  return done(R, { men, nik }, {}, 41);
}
export function buildFloor() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#1a2030'], [.5, '#141824'], [1, '#0c0e14']]);
  R.fill(RECT(0, 0, SW, 1000), lin(0, 0, 0, 1000, [[0, '#2a3040'], [1, '#202634']]), { maxR: 34, dir: 90 });     // cabinets
  for (let i = 0; i < 4; i++) R.line(c => c.rect(20 + i * 300, 80, 260, 860), '#141822', 14, { maxR: 4 });
  R.fill(RECT(860, 120, 260, 400), '#8aa0c8', { maxR: 20, dir: 90 }); glow(R, 990, 320, 600, '150,180,230', .35);   // cold window
  R.fill(RECT(0, 1000, SW, 1134), lin(0, 1000, 0, SH, [[0, '#4a4a54'], [1, '#22222a']]), { maxR: 34, dir: 0 });
  for (let i = 0; i < 8; i++) { const x = 80 + (i * 137) % 1000, y = 1500 + (i * 211) % 500; R.fill(P([[x, y], [x + 200, y - 30], [x + 220, y + 240], [x + 20, y + 270]]), '#e8e4dc', { maxR: 10, dir: 0 }); }
  const nik = person(R, 560, 1000, 270, 'nikBroken', { light: 1, turn: -.2, tint: '#9ab0e0', tintA: .25, body: 2.0 });
  limb(R, [[800, 1300], [760, 1100], [700, 1000]], 80, '#2a2a2e');
  R.line(c => c.ellipse(720, 990, 50, 34, -.4, 0, 7), '#9a9ea6', 16, { maxR: 4, hgt: 1.4 }); R.fill(E(720, 990, 32, 26, -.4), '#dce0e8', { maxR: 3, hgt: 1.4 });
  R.fill(RR(260, 1760, 100, 200, 14), '#0c0c10', { maxR: 4 });                     // the phone on the floor
  return done(R, { nik }, { phone: [272, 1774, 76, 172] }, 42);
}
export function buildAudit() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#5a4430'], [1, '#2a1e14']], { dir: 0 });
  glow(R, 600, 900, 900, '255,200,130', .3);
  for (let i = 0; i < 9; i++) { const x = 40 + (i % 3) * 380, y = 120 + Math.floor(i / 3) * 620, a = ((i * 7) % 5 - 2) * .04;
    R.fill(c => { c.save(); c.translate(x + 170, y + 270); c.rotate(a); c.rect(-170, -270, 340, 540); c.restore(); }, '#f0ece2', { maxR: 14, dir: 0 });
    for (let k = 0; k < 9; k++) R.line(c => { c.moveTo(x + 30, y + 60 + k * 52); c.lineTo(x + 300 - (k % 3) * 30, y + 60 + k * 52); }, '#8a8a90', 5, { maxR: 2 }); }
  const nik = person(R, 600, 1960, 260, 'nikBroken', { light: 0, body: 1.2 });
  return done(R, { nik }, {}, 43);
}
export function buildSeasons() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#d8cfbc'], [1, '#8a7e6a']]);
  R.fill(RECT(140, 160, 920, 760), '#ffffff', { maxR: 30, dir: 90, group: 'win' });   // window (season painted live)
  R.line(c => { c.rect(140, 160, 920, 760); c.moveTo(600, 160); c.lineTo(600, 920); }, '#5a4a3a', 26, { maxR: 6 });
  R.fill(RECT(0, 1560, SW, 574), lin(0, 1560, 0, SH, [[0, '#8a6a48'], [1, '#3a2a1a']]), { maxR: 26, dir: 0 });
  const nik = person(R, 600, 1240, 300, 'nik27', { light: -1, turn: .1, body: 2.2 });
  R.fill(P([[700, 1600], [1100, 1600], [1120, 1700], [680, 1700]]), '#44464c', { maxR: 6, dir: 0 });
  R.fill(P([[100, 1640], [520, 1620], [540, 1860], [110, 1880]]), '#141214', { maxR: 8 });
  hand(R, 420, 1700, 44, 'nik27', 0);
  return done(R, { nik }, { win: [152, 172, 896, 736] }, 44);
}
export function buildRepay() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#f4e8cc'], [.5, '#e0cca4'], [1, '#8a7458']]);
  R.fill(RECT(700, 160, 420, 620), '#fff8e0', { maxR: 30, dir: 90 }); glow(R, 900, 400, 700, '255,240,200', .45);
  R.fill(RECT(0, 1640, SW, 494), lin(0, 1640, 0, SH, [[0, '#b08a5a'], [1, '#5a4430']]), { maxR: 26, dir: 0 });
  const ano = person(R, 520, 1000, 300, 'anoop', { light: 1, turn: .2, body: 2.6 });
  R.fill(RR(680, 1180, 220, 400, 24), '#0c0c10', { maxR: 6, hgt: 1.2 }); hand(R, 720, 1560, 48, 'anoop', -1.4);
  return done(R, { ano }, { phone: [696, 1200, 188, 360] }, 45);
}
export function buildArrivals() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#f6e2b0'], [.4, '#f0c880'], [1, '#6a4a30']]);
  R.fill(RECT(0, 140, SW, 520), lin(0, 140, 0, 660, [[0, '#fff0c8'], [1, '#f8d898']]), { maxR: 30, dir: 0 });
  for (let i = 0; i < 9; i++) R.line(c => { c.moveTo(i * 150 + 20, 140); c.lineTo(i * 150 + 20, 660); }, '#c8a070', 12, { maxR: 5 });
  R.fill(RECT(700, 200, 420, 140), '#2a2420', { maxR: 8 }); R.text('ARRIVALS', 910, 300, '700 64px "Cormorant Garamond"', '#ffd27a', { maxR: 3 });
  R.fill(RECT(0, 1900, SW, 234), lin(0, 1900, 0, SH, [[0, '#8a6a48'], [1, '#4a3420']]), { maxR: 24, dir: 0 });
  const achan = person(R, 1000, 940, 230, 'achan', { light: -1, turn: -.4, tint: '#ffd8a0', tintA: .2, body: 4.2 });
  const nik = person(R, 520, 900, 270, 'nik27', { light: 1, turn: .25, tint: '#ffd8a0', tintA: .18, body: 4.4 });
  const amma = person(R, 260, 1000, 240, 'amma', { light: 1, turn: .45, tint: '#ffd8a0', tintA: .2, body: 4.0 });
  limb(R, [[100, 1300], [300, 1250], [450, 1220]], 70, '#e4dac0'); hand(R, 470, 1215, 32, 'amma', 0);   // the hug
  limb(R, [[880, 1380], [760, 1360], [680, 1340]], 70, '#ece8e0'); hand(R, 660, 1335, 34, 'achan', 3.1);   // Achan touches the watch
  return done(R, { achan, nik, amma }, { watch: [640, 1330] }, 46);
}
export function buildVeranda() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#0a1018'], [.5, '#101820'], [1, '#0a0c10']]);
  // banana leaves in the rain, beyond the veranda pillars
  for (let i = 0; i < 6; i++) R.fill(E(120 + i * 200, 700 + (i % 2) * 120, 220, 70, -.6 + (i % 3) * .3), ['#1e3a24', '#28482c', '#1a3220'][i % 3], { maxR: 20 });
  R.fill(RECT(0, 0, SW, 180), '#3a2418', { maxR: 20, dir: 0 }); for (let i = 0; i < 5; i++) R.fill(RECT(i * 300, 0, 40, 180), '#2a1810', { maxR: 6 });   // tiled eave
  R.fill(RECT(60, 180, 60, 1400), '#d8c8a8', { maxR: 10, dir: 90 }); R.fill(RECT(1080, 180, 60, 1400), '#c8b898', { maxR: 10, dir: 90 });
  R.fill(RECT(0, 1580, SW, 554), lin(0, 1580, 0, SH, [[0, '#6a3a22'], [1, '#2a160c']]), { maxR: 26, dir: 0 });   // red-oxide floor
  R.fill(RECT(80, 1500, 1040, 80), '#4a2a18', { maxR: 10, dir: 0 });                  // wooden bench
  R.fill(P([[880, 1400], [940, 1400], [960, 1500], [860, 1500]]), '#c8a040', { maxR: 4, hgt: 1.3 }); R.fill(E(910, 1380, 14, 26), '#ffd070', { maxR: 3, hgt: 1.3 });   // oil lamp
  glow(R, 910, 1380, 420, '255,180,80', .5);
  const nik = person(R, 520, 1080, 280, 'nik27', { light: 1, turn: .35, tint: '#ffb060', tintA: .25, body: 1.7 });
  R.fill(RR(600, 1440, 140, 60, 10), '#0c0c10', { maxR: 4 });                         // phone on the bench
  return done(R, { nik }, { lamp: [910, 1380], phone: [600, 1440] }, 47);
}
export function buildPalms() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#0a1420'], [.6, '#122030'], [1, '#081018']]);
  for (let i = 0; i < 5; i++) { const x = 100 + i * 250, y = 400 + (i % 2) * 160; R.line(c => { c.moveTo(x, SH); c.quadraticCurveTo(x + 40, 1200, x + 20, y); }, '#1a2a2a', 26, { maxR: 6 });
    for (let k = 0; k < 7; k++) { const a = -Math.PI + k * Math.PI / 6; R.line(c => { c.moveTo(x + 20, y); c.quadraticCurveTo(x + 20 + Math.cos(a) * 150, y - 80 + Math.sin(a) * 60, x + 20 + Math.cos(a) * 260, y + 60 + Math.abs(Math.sin(a)) * 40); }, '#16302a', 22, { maxR: 5 }); } }
  return done(R, {}, {}, 48);
}

// knife-laid episode title: a small italic line over a big word
export function buildEpText(a, b, col = '#d8302a') {
  const R = new Ref(1000, 420, 1);
  R.text(a, 500, 170, 'italic 600 110px "Cormorant Garamond"', '#efe2c4', { maxR: 5, dir: 0 });
  R.text(b, 500, 340, '700 140px "Cormorant Garamond"', col, { maxR: 6, dir: 0 });
  return { strokes: paintRef(R, { R: [10, 5, 2.5], T: 10, seed: 49 }), ref: R };
}
