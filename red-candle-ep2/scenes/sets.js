// Every set of Episode 1 as a reference illustration -> knife strokes.
// Scene units: SW x SH (9:16). Each builder returns { strokes, ref, f: {faces}, a: {anchors} }.
import { Ref, paintRef } from '../engine/plate.js';
import { P, E, RR, lin, rad } from './common.js';
import { person, limb, hand, shiftC, rgba } from './people.js';
import { KNIFE, DAB } from '../engine/impasto.js';

export const SW = 1200, SH = 2134;
const RECT = (x, y, w, h) => P([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const R_STD = [44, 22, 11, 5.5, 2.8];
const bg = (R, stops, o = {}) => R.fill(RECT(0, 0, SW, SH), lin(0, 0, 0, SH, stops), { maxR: 44, dir: o.dir ?? 90, fallback: 90, detail: 1.6, ...o });
const done = (R, f = {}, a = {}, seed = 1, o = {}) => ({ strokes: paintRef(R, { R: o.R || R_STD, T: o.T ?? 13, seed }), ref: R, f, a });

// ---------- screens: laptop on a dark desk (cold open, the green candles) ----------
export function buildLaptop() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#0c0f1a'], [.5, '#141a2c'], [1, '#0a0b12']]);
  R.fill(RECT(0, 1500, SW, 634), lin(0, 1500, 0, SH, [[0, '#2a2018'], [1, '#120c0a']]), { maxR: 30, dir: 0 });            // desk
  R.fill(P([[90, 380], [1110, 380], [1130, 1290], [70, 1290]]), '#1c1e24', { maxR: 10, dir: 90 });                        // lid
  R.fill(P([[20, 1290], [1180, 1290], [1240, 1480], [-40, 1480]]), lin(0, 1290, 0, 1480, [[0, '#4a4c54'], [1, '#26272c']]), { maxR: 14, dir: 0 }); // base
  R.fill(P([[380, 1400], [820, 1400], [840, 1460], [360, 1460]]), '#3a3c42', { maxR: 6, dir: 0 });
  R.tint(E(600, 1600, 700, 160), rad(600, 1560, 20, 700, [[0, 'rgba(120,170,255,.35)'], [1, 'rgba(120,170,255,0)']]));
  // the notebook and the silver watch on the desk
  R.fill(P([[60, 1620], [420, 1590], [450, 1980], [80, 2010]]), '#141214', { maxR: 12, dir: 80 });
  R.line(c => c.ellipse(900, 1800, 95, 60, -.2, 0, 7), '#8a8e96', 24, { maxR: 5, hgt: 1.4 });
  R.fill(E(900, 1800, 62, 52, -.2), lin(840, 1760, 960, 1840, [[0, '#d8dce4'], [1, '#6a6e78']]), { maxR: 4, hgt: 1.3 });
  return done(R, {}, { screen: [120, 410, 960, 850] }, 2);
}

// ---------- Nikhil at 3 a.m., face lit by the screen ----------
export function buildFace27() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#121a2e'], [.6, '#0e1220'], [1, '#07080d']]);
  // window, rain-dark glass
  R.fill(RECT(90, 120, 560, 820), lin(0, 120, 0, 940, [[0, '#2a3a5c'], [.6, '#1c2842'], [1, '#141c30']]), { maxR: 26, dir: 92 });
  R.line(c => { c.rect(90, 120, 560, 820); c.moveTo(370, 120); c.lineTo(370, 940); c.moveTo(90, 530); c.lineTo(650, 530); }, '#0a0c14', 22, { maxR: 6 });
  [[200, 300], [520, 260], [480, 700], [240, 760]].forEach(([x, y]) => R.tint(E(x, y, 26, 26), rad(x, y, 1, 26, [[0, 'rgba(255,190,110,.55)'], [1, 'rgba(255,190,110,0)']])));
  const f = person(R, 640, 1260, 520, 'nik27', { light: 1, tint: '#7fb2ff', tintA: .42, body: 2.0 });
  R.tint(RECT(0, 1300, SW, 834), lin(0, 1300, 0, SH, [[0, 'rgba(10,14,30,0)'], [1, 'rgba(6,8,14,.75)']]));
  // laptop lid edge in the foreground, glowing
  R.fill(P([[300, 1960], [1200, 1880], [1200, 2134], [300, 2134]]), '#14161c', { maxR: 10, dir: 0 });
  R.line(c => { c.moveTo(300, 1958); c.lineTo(1200, 1878); }, '#9cc4ff', 10, { maxR: 3, hgt: 1.3 });
  return done(R, { nik: f }, {}, 3);
}

// ---------- Kochi airport, night: Achan, Nikhil, Amma ----------
export function buildAirport() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#1a2440'], [.35, '#2a3050'], [.55, '#6a5040'], [1, '#2a1e18']]);
  // glass wall with runway lights, departures board
  R.fill(RECT(0, 140, SW, 560), lin(0, 140, 0, 700, [[0, '#101830'], [1, '#26304e']]), { maxR: 30, dir: 0 });
  for (let i = 0; i < 9; i++) R.line(c => { c.moveTo(i * 150 + 20, 140); c.lineTo(i * 150 + 20, 700); }, '#0a0e1a', 14, { maxR: 5 });
  for (let i = 0; i < 14; i++) { const x = 40 + i * 85, y = 610 + (i % 3) * 6; R.fill(E(x, y, 9, 6), i % 4 ? '#ffcf7a' : '#ff6a4a', { maxR: 3, hgt: 1.3 }); }
  R.fill(RECT(700, 200, 420, 150), '#141414', { maxR: 8, dir: 0 });
  R.text('DEPARTURES', 910, 260, '700 52px "Cormorant Garamond"', '#ffc85a', { maxR: 3 });
  R.text('DXB  ·  LHR  ·  MAN', 910, 320, '600 34px "Cormorant Garamond"', '#e8e0c8', { maxR: 2 });
  // warm tungsten wash
  R.tint(RECT(0, 700, SW, 1434), rad(600, 900, 40, 1100, [[0, 'rgba(255,170,90,.32)'], [1, 'rgba(255,170,90,0)']]));
  R.fill(RECT(0, 1900, SW, 234), lin(0, 1900, 0, SH, [[0, '#4a3628'], [1, '#22180f']]), { maxR: 24, dir: 0 });
  const amma = person(R, 960, 980, 250, 'amma', { light: -1, turn: -.35, tint: '#ffb070', tintA: .2, body: 4.2 });
  const achan = person(R, 230, 960, 255, 'achan', { light: 1, turn: .35, tint: '#ffb070', tintA: .2, body: 4.2 });
  const nik = person(R, 600, 900, 270, 'nik19', { light: 0, tint: '#ffb070', tintA: .18, body: 4.4 });
  // backpack straps on Nikhil
  R.line(c => { c.moveTo(470, 1000); c.lineTo(450, 1500); c.moveTo(730, 1000); c.lineTo(750, 1500); }, '#18181c', 34, { maxR: 7 });
  // Amma's hand with the saree end, wiping her eye
  limb(R, [[1120, 1350], [1060, 1120], [1010, 900]], 70, '#d9cfb8');
  hand(R, 1000, 880, 34, 'amma', -2.2);
  // Nikhil's forearm raised, Achan's hands fastening the watch
  limb(R, [[520, 1500], [600, 1330], [720, 1270]], 78, '#7c7e84');
  hand(R, 760, 1262, 40, 'nik19', 0);
  limb(R, [[260, 1400], [470, 1340], [610, 1290]], 74, '#ece8e0');
  hand(R, 640, 1282, 36, 'achan', .1);
  limb(R, [[330, 1560], [560, 1420], [690, 1330]], 74, '#e4e0d6');
  hand(R, 700, 1320, 34, 'achan', -.6);
  return done(R, { nik, amma, achan }, { watch: [668, 1276] }, 4);
}

// ---------- Manchester, red-brick street in the rain (dusk) ----------
export function buildManc() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#4a5878'], [.3, '#6a7290'], [.45, '#8a8090'], [1, '#2a2a36']]);
  // two rows of red-brick terraces converging to a vanishing point
  const vx = 640, vy = 900;
  R.fill(P([[0, 200], [vx - 40, vy - 140], [vx - 40, vy + 20], [0, 1500]]), lin(0, 0, vx, 0, [[0, '#6a3a30'], [1, '#8a5a50']]), { maxR: 30, dir: 'edge', fallback: 20 });
  R.fill(P([[SW, 120], [vx + 40, vy - 150], [vx + 40, vy + 20], [SW, 1540]]), lin(SW, 0, vx, 0, [[0, '#5a302a'], [1, '#7a4a44']]), { maxR: 30, dir: 'edge', fallback: -20 });
  for (let i = 0; i < 6; i++) { const k = i / 6, x0 = k * (vx - 60), w = 120 * (1 - k * .8), y0 = 420 + k * (vy - 520), h = 230 * (1 - k * .8);
    R.fill(RECT(x0 + 20, y0, w, h), i % 2 ? '#f0b866' : '#2a2a3a', { maxR: 12 * (1 - k * .5), dir: 90 });
    const x1 = SW - 20 - k * (SW - vx - 60) - w; R.fill(RECT(x1, y0 - 30, w, h), i % 3 ? '#2a2a3a' : '#e8a858', { maxR: 12 * (1 - k * .5), dir: 90 }); }
  // wet street
  R.fill(P([[0, 1500], [vx - 40, vy + 20], [vx + 40, vy + 20], [SW, 1540], [SW, SH], [0, SH]]), lin(0, vy, 0, SH, [[0, '#7a7488'], [.3, '#4a4658'], [1, '#1a1a22']]), { maxR: 36, dir: 0 });
  // streetlamps + reflections (horizontal dabs)
  for (const [x, y, s] of [[180, 700, 1], [1000, 660, 1], [470, 820, .5], [790, 810, .5]]) {
    R.line(c => { c.moveTo(x, y); c.lineTo(x, y + 700 * s); }, '#1a1a20', 16 * s, { maxR: 4 });
    R.fill(E(x, y, 22 * s, 30 * s), '#ffd27a', { maxR: 4, hgt: 1.4 });
    R.tint(E(x, y, 160 * s, 160 * s), rad(x, y, 4, 160 * s, [[0, 'rgba(255,200,110,.6)'], [1, 'rgba(255,200,110,0)']]));
    for (let k = 0; k < 7; k++) R.fill(RECT(x - (40 - k * 4) * s, y + 760 * s + k * 34 * s + 200 * (1 - s), (80 - k * 8) * s, 10 * s), '#e8b870', { maxR: 4, dir: 0, alpha: .8 });
  }
  return done(R, {}, { vp: [vx, vy] }, 5);
}

// Nikhil from behind, dragging the suitcase (separate plate so he can move against the street)
export function buildBackNik() {
  const R = new Ref(700, 1100, 1), x = 350;
  R.fill(P([[x - 60, 360], [x + 60, 360], [x + 80, 1000], [x - 80, 1000]]), '#24242a', { maxR: 6, dir: 90 });            // legs (dark jeans), animated over
  R.fill(c => { c.moveTo(x - 50, 110); c.quadraticCurveTo(x - 150, 120, x - 160, 220); c.lineTo(x - 150, 520); c.lineTo(x + 150, 520); c.lineTo(x + 160, 220); c.quadraticCurveTo(x + 150, 120, x + 50, 110); c.closePath(); }, lin(x - 160, 0, x + 160, 0, [[0, '#9a9ca2'], [1, '#5a5c62']]), { maxR: 10, dir: 90 });
  R.fill(RR(x - 110, 170, 220, 280, 40), lin(x - 110, 0, x + 110, 0, [[0, '#2a2a30'], [1, '#141418']]), { maxR: 8, dir: 90, hgt: 1.2 }); // backpack
  R.fill(E(x, 60, 70, 82), lin(x - 70, 0, x + 70, 0, [[0, '#2a1e18'], [.5, '#1a1310'], [1, '#0e0a08']]), { maxR: 6, dir: 'edge' });       // head from behind (hair)
  R.fill(E(x - 70, 70, 12, 20), '#7a4c34', { maxR: 3 }); R.fill(E(x + 70, 70, 12, 20), '#6a4030', { maxR: 3 });
  limb(R, [[x + 150, 230], [x + 200, 380], [x + 260, 500]], 52, '#7a7c82');
  hand(R, x + 268, 520, 26, 'nik19', 1.4);
  // suitcase behind him, tilted on its wheels
  R.fill(P([[x + 250, 540], [x + 330, 520], [x + 420, 960], [x + 300, 990]]), lin(x + 250, 0, x + 420, 0, [[0, '#3a5a8a'], [1, '#1e3050']]), { maxR: 8, dir: 80, hgt: 1.2 });
  R.fill(E(x + 320, 990, 20, 20), '#0e0e10', { maxR: 4 }); R.fill(E(x + 410, 966, 20, 20), '#0e0e10', { maxR: 4 });
  return { strokes: paintRef(R, { R: [20, 10, 5, 2.6], T: 12, seed: 6 }), ref: R };
}

// ---------- restaurant kitchen at midnight ----------
export function buildKitchen() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#cfd8cc'], [.4, '#a8b4a8'], [1, '#4a524c']]);
  // white tiles
  for (let y = 300; y < 1300; y += 110) for (let x = (y / 110 % 2) * 55; x < SW; x += 110) R.fill(RECT(x + 4, y + 4, 102, 102), (x + y) % 3 ? '#dfe6dc' : '#d2dace', { maxR: 18, dir: 0 });
  R.fill(RECT(160, 120, 880, 60), '#f6fff4', { maxR: 6, dir: 0, hgt: 1.3 });                                       // fluorescent tube
  R.tint(RECT(0, 0, SW, 900), rad(600, 150, 20, 900, [[0, 'rgba(240,255,240,.6)'], [1, 'rgba(240,255,240,0)']]));
  // steel counter + sink
  R.fill(RECT(0, 1480, SW, 654), lin(0, 1480, 0, SH, [[0, '#b8c0c4'], [.1, '#7a8288'], [1, '#2e3236']]), { maxR: 30, dir: 0 });
  R.fill(RR(560, 1520, 600, 220, 20), '#4a5258', { maxR: 12, dir: 0 });
  // tower of greasy plates
  for (let i = 0; i < 16; i++) R.fill(E(830 + (i % 3) * 6, 1500 - i * 34, 210, 30), i % 2 ? '#f2f0e8' : '#d8d4c4', { maxR: 6, dir: 0 });
  R.fill(E(830, 1470 - 16 * 34, 210, 30), '#e8e4d8', { maxR: 6, dir: 0 });
  const nik = person(R, 380, 820, 290, 'nikApron', { light: 1, turn: .45, tint: '#e8ffe8', tintA: .15, body: 3.4 });
  // arms down into the sink, yellow gloves
  limb(R, [[560, 1110], [650, 1340], [760, 1540]], 80, '#8a8c92');
  R.fill(E(780, 1560, 54, 42, .8), '#e8c03a', { maxR: 8 });
  limb(R, [[220, 1130], [380, 1380], [620, 1560]], 80, '#8a8c92');
  R.fill(E(650, 1575, 54, 42, .4), '#d8b030', { maxR: 8 });
  return done(R, { nik }, { sink: [860, 1600] }, 7);
}

// ---------- shared room, bunk beds: over the shoulder onto the phone ----------
export function buildBunk() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#1e1a22'], [.5, '#2a2228'], [1, '#141014']]);
  // bunk frame + upper mattress, desk lamp glow
  R.fill(RECT(0, 0, SW, 340), '#3a3036', { maxR: 24, dir: 0 });
  R.fill(RECT(0, 300, SW, 60), '#5a4a50', { maxR: 10, dir: 0 });
  R.line(c => { c.moveTo(60, 0); c.lineTo(60, SH); c.moveTo(1140, 0); c.lineTo(1140, SH); }, '#6a6a72', 36, { maxR: 8, hgt: 1.3 });
  R.tint(E(1000, 700, 600, 600), rad(1000, 600, 20, 650, [[0, 'rgba(255,180,100,.4)'], [1, 'rgba(255,180,100,0)']]));
  R.fill(P([[920, 520], [1100, 520], [1060, 620], [960, 620]]), '#e8b860', { maxR: 6 });
  // his shoulder + back of head, bottom-left (OTS)
  R.fill(c => { c.moveTo(-60, SH); c.lineTo(-60, 1500); c.quadraticCurveTo(80, 1340, 360, 1380); c.quadraticCurveTo(520, 1420, 560, SH); c.closePath(); }, lin(0, 1300, 0, SH, [[0, '#8a8c92'], [1, '#4a4c52']]), { maxR: 16, dir: 'edge' });
  R.fill(E(240, 1240, 170, 200), lin(80, 0, 400, 0, [[0, '#1a1310'], [1, '#2c201a']]), { maxR: 8, dir: 'edge' });
  R.fill(E(395, 1260, 26, 44), '#7a4a34', { maxR: 4 });
  // hands holding the phone (screen is a live texture)
  R.fill(RR(470, 760, 420, 760, 46), '#121216', { maxR: 6, hgt: 1.2 });
  hand(R, 470, 1380, 60, 'nik19', -.2); hand(R, 890, 1420, 60, 'nik19', 3.4);
  return done(R, {}, { screen: [492, 790, 376, 700] }, 8);
}

// ---------- video call with Amma: phone, Nikhil, the empty noodle cup and fridge ----------
export function buildCall() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#18202e'], [.6, '#1e2634'], [1, '#101318']]);
  // open, empty fridge glowing cold on the right
  R.fill(RECT(760, 900, 440, 1100), '#c8dcef', { maxR: 20, dir: 90, hgt: 1.1 });
  R.fill(RECT(800, 960, 360, 980), '#e8f4ff', { maxR: 24, dir: 0 });
  for (const y of [1220, 1480, 1740]) R.fill(RECT(800, y, 360, 16), '#a8bccc', { maxR: 4, dir: 0 });
  R.fill(RR(980, 1690, 80, 50, 8), '#f0e090', { maxR: 4 });                  // a single lemon-yellow sachet
  R.tint(RECT(400, 800, 800, 1334), rad(980, 1400, 30, 800, [[0, 'rgba(200,230,255,.35)'], [1, 'rgba(200,230,255,0)']]));
  // table + empty instant-noodle cup
  R.fill(RECT(0, 1800, 760, 334), lin(0, 1800, 0, SH, [[0, '#4a3a30'], [1, '#221a14']]), { maxR: 20, dir: 0 });
  R.fill(P([[480, 1660], [640, 1660], [618, 1830], [502, 1830]]), lin(480, 0, 640, 0, [[0, '#f4f0e6'], [1, '#c8c0b0']]), { maxR: 8, dir: 90 });
  R.fill(RECT(480, 1676, 160, 50), '#c8342a', { maxR: 5, dir: 0 });
  R.fill(E(560, 1660, 82, 16), '#3a2a20', { maxR: 4 });
  R.line(c => { c.moveTo(530, 1600); c.lineTo(600, 1700); c.moveTo(550, 1590); c.lineTo(610, 1695); }, '#d8c8a0', 8, { maxR: 2 });
  const nik = person(R, 380, 820, 300, 'nik19', { light: 1, turn: .3, tint: '#9cc8ff', tintA: .3, body: 3.4 });
  // arm raising the phone beside his face; the phone screen (Amma) is a painted inset with its own face
  limb(R, [[620, 1300], [720, 1080], [700, 860]], 84, '#8a8c92');
  R.fill(RR(560, 420, 300, 540, 34), '#101014', { maxR: 6, hgt: 1.2 });
  R.fill(RR(578, 444, 264, 492, 20), lin(0, 444, 0, 936, [[0, '#6a5240'], [1, '#3a2c22']]), { maxR: 12, dir: 90 });
  for (const q of [R.ctx, R.idc]) { q.save(); q.beginPath(); q.roundRect(578, 444, 264, 492, 20); q.clip(); }
  const amma = person(R, 712, 760, 180, 'amma', { light: -1, turn: 0, body: 1.2, wide: .8 });
  for (const q of [R.ctx, R.idc]) q.restore();
  hand(R, 838, 940, 40, 'nik19', -2.4);
  return done(R, { nik, amma }, { phone: [710, 690] }, 9);
}

// ---------- bright IT office ----------
export function buildOffice() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#e8eef0'], [.5, '#d4dcd8'], [1, '#8a9490']]);
  for (let i = 0; i < 4; i++) { R.fill(RECT(30 + i * 300, 80, 240, 900), lin(0, 80, 0, 980, [[0, '#fff6dc'], [1, '#e8f0f4']]), { maxR: 30, dir: 90 }); }
  for (let i = 0; i < 4; i++) R.tint(P([[30 + i * 300, 980], [270 + i * 300, 980], [470 + i * 300, 1900], [150 + i * 300, 1900]]), 'rgba(255,240,190,.32)');
  // rows of desks receding
  for (let k = 0; k < 3; k++) { const y = 1080 + k * 90, s = .55 + k * .2; R.fill(RECT(0, y, SW, 26 * s), '#b0a898', { maxR: 8, dir: 0 }); for (let i = 0; i < 5; i++) R.fill(RECT(60 + i * 240 + k * 40, y - 110 * s, 150 * s, 100 * s), '#2a2e34', { maxR: 6 }); }
  // his desk, foreground
  R.fill(RECT(0, 1640, SW, 494), lin(0, 1640, 0, SH, [[0, '#d8ccb8'], [1, '#8a7e6a']]), { maxR: 26, dir: 0 });
  const nik = person(R, 420, 1060, 260, 'nik24', { light: -1, turn: .25, body: 3.0 });
  R.fill(RECT(640, 1080, 520, 330), '#16181e', { maxR: 6, hgt: 1.1 });               // monitor 1 (live code texture)
  R.fill(RECT(860, 1400, 80, 240), '#2a2c32', { maxR: 6 });
  R.fill(RR(160, 1600, 560, 70, 10), '#e4e2dc', { maxR: 6, dir: 0 });                  // keyboard
  hand(R, 250, 1610, 44, 'nik24', -.2); hand(R, 620, 1620, 44, 'nik24', 3.3);
  R.fill(P([[760, 1560], [860, 1560], [850, 1650], [770, 1650]]), '#f0f0ec', { maxR: 5 });           // mug
  return done(R, { nik }, { mon: [656, 1096, 488, 298] }, 10);
}

// ---------- pub after work ----------
export function buildPub() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#2a160c'], [.4, '#5a3216'], [1, '#1a0e08']]);
  // bar shelves with glowing bottles
  R.fill(RECT(0, 160, SW, 560), '#3a2010', { maxR: 30, dir: 0 });
  for (let i = 0; i < 12; i++) { const x = 60 + i * 95, h = 120 + (i * 37 % 60); R.fill(RR(x, 600 - h, 46, h, 12), ['#c87a2a', '#6a8a3a', '#d8a84a', '#8a2a1a'][i % 4], { maxR: 6, dir: 90, hgt: 1.3 }); }
  R.tint(RECT(0, 0, SW, 900), rad(600, 400, 20, 800, [[0, 'rgba(255,170,70,.4)'], [1, 'rgba(255,170,70,0)']]));
  // table + two pints
  R.fill(RECT(0, 1640, SW, 494), lin(0, 1640, 0, SH, [[0, '#6a3a18'], [1, '#2a1608']]), { maxR: 26, dir: 0 });
  for (const x of [170, 1000]) { R.fill(P([[x - 70, 1500], [x + 70, 1500], [x + 56, 1720], [x - 56, 1720]]), lin(x - 70, 0, x + 70, 0, [[0, '#e8a030'], [1, '#a05a10']]), { maxR: 8, dir: 90, hgt: 1.2 }); R.fill(E(x, 1500, 70, 16), '#f6eedc', { maxR: 5 }); }
  const jit = person(R, 330, 940, 250, 'jithin', { light: 1, turn: .45, tint: '#ffb060', tintA: .22, body: 3.2 });
  const nik = person(R, 880, 1000, 250, 'nik24', { light: -1, turn: -.4, tint: '#ffb060', tintA: .2, body: 3.0 });
  // Jithin leans across, holding out his phone (live chart texture)
  limb(R, [[480, 1250], [560, 1420], [600, 1360]], 74, '#a9c8e6');
  R.fill(RR(520, 1120, 200, 360, 24), '#0e0e12', { maxR: 6, hgt: 1.2 });
  hand(R, 610, 1440, 40, 'jithin', -1.4);
  return done(R, { jit, nik }, { phone: [532, 1140, 176, 320] }, 11);
}

// ---------- 2 a.m. research desk ----------
export function buildResearch() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#0e1018'], [.5, '#181820'], [1, '#0a0a0e']]);
  R.fill(E(980, 300, 120, 120), '#e8e2d0', { maxR: 10 });            // wall clock face (hands live)
  R.line(c => c.ellipse(980, 300, 120, 120, 0, 0, 7), '#2a2a30', 16, { maxR: 4 });
  R.fill(P([[60, 520], [300, 520], [240, 640], [120, 640]]), '#e8a850', { maxR: 6 });       // lamp
  R.tint(RECT(0, 400, SW, 1400), rad(180, 700, 20, 900, [[0, 'rgba(255,170,90,.35)'], [1, 'rgba(255,170,90,0)']]));
  R.fill(RECT(0, 1500, SW, 634), lin(0, 1500, 0, SH, [[0, '#3a2a1e'], [1, '#160e0a']]), { maxR: 26, dir: 0 });
  const nik = person(R, 360, 1020, 250, 'nik24', { light: 1, turn: .4, tint: '#7fdc9a', tintA: .22, body: 2.4 });
  // laptop (live chart), notebook full of notes, coffee mugs
  R.fill(P([[620, 1060], [1160, 1060], [1180, 1440], [600, 1440]]), '#16181e', { maxR: 6, hgt: 1.1 });
  R.fill(P([[560, 1440], [1200, 1440], [1220, 1520], [540, 1520]]), '#44464c', { maxR: 6, dir: 0 });
  R.fill(P([[90, 1620], [520, 1590], [540, 1900], [110, 1930]]), '#efe8d6', { maxR: 10, dir: 0 });
  for (let i = 0; i < 7; i++) R.line(c => { c.moveTo(130, 1650 + i * 38); c.lineTo(480 - (i % 3) * 40, 1630 + i * 38); }, '#3a4a8a', 5, { maxR: 2 });
  for (const [x, y] of [[700, 1640], [880, 1700], [1040, 1620]]) { R.fill(P([[x - 50, y - 70], [x + 50, y - 70], [x + 42, y + 50], [x - 42, y + 50]]), '#e6e2da', { maxR: 6, dir: 90 }); R.fill(E(x, y - 70, 50, 12), '#2a1a10', { maxR: 4 }); }
  hand(R, 560, 1470, 40, 'nik24', 0);
  return done(R, { nik }, { scr: [636, 1076, 508, 348], clock: [980, 300] }, 12);
}

// ---------- office bathroom stall ----------
export function buildBath() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#c8d4ce'], [1, '#6a7a74']]);
  for (let y = 0; y < SH; y += 140) for (let x = 0; x < SW; x += 140) R.fill(RECT(x + 5, y + 5, 130, 130), (x / 140 + y / 140) % 2 ? '#d6e0da' : '#c4d0ca', { maxR: 20, dir: 0 });
  R.fill(RECT(0, 0, 140, SH), '#8a9a94', { maxR: 20, dir: 90 });            // stall partition
  R.tint(RECT(0, 0, SW, 1000), rad(600, 0, 20, 1000, [[0, 'rgba(255,255,240,.45)'], [1, 'rgba(255,255,240,0)']]));
  const nik = person(R, 600, 820, 330, 'nik24', { light: 0, tint: '#a8ffb8', tintA: .2, body: 3.4 });
  // phone held low in front, screen to camera (live +£ texture)
  R.fill(RR(390, 1500, 400, 560, 40), '#0e0e12', { maxR: 6, hgt: 1.2 });
  hand(R, 400, 1900, 64, 'nik24', -.3); hand(R, 790, 1920, 64, 'nik24', 3.4);
  return done(R, { nik }, { scr: [410, 1520, 360, 520] }, 13);
}

// ---------- office canteen: the push ----------
export function buildCanteen() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#e6dcc8'], [.5, '#c8b89c'], [1, '#6a5a48']]);
  R.fill(RECT(0, 260, SW, 300), '#f4f0e4', { maxR: 30, dir: 0 });
  for (let i = 0; i < 6; i++) R.fill(E(100 + i * 200, 300, 60, 22), '#fff8dc', { maxR: 6 });
  R.fill(RECT(0, 1700, SW, 434), lin(0, 1700, 0, SH, [[0, '#a89070'], [1, '#5a4a38']]), { maxR: 26, dir: 0 });
  for (const x of [460, 640]) { R.fill(P([[x - 40, 1600], [x + 40, 1600], [x + 32, 1720], [x - 32, 1720]]), '#f4f2ec', { maxR: 5, dir: 90 }); R.fill(E(x, 1600, 40, 10), '#4a2a18', { maxR: 3 }); }
  const nik = person(R, 300, 1080, 250, 'nik24', { light: 1, turn: .35, body: 3.0 });
  const jit = person(R, 840, 940, 300, 'jithin', { light: -1, turn: -.4, body: 3.8 });
  // Jithin's hand on Nikhil's shoulder
  limb(R, [[620, 1300], [520, 1220], [470, 1180]], 84, '#a9c8e6');
  hand(R, 450, 1180, 44, 'jithin', 3.4);
  return done(R, { nik, jit }, {}, 14);
}

// ---------- resignation: glass office, Jithin watching through the glass ----------
export function buildResign(focus) {
  const R = new Ref(SW, SH, 1), sharpN = focus === 'nik';
  bg(R, [[0, '#c8d4dc'], [1, '#7a8890']]);
  // glass wall + the open office behind it, where Jithin sits
  R.fill(RECT(0, 200, SW, 1100), lin(0, 200, 0, 1300, [[0, '#dfe8ee'], [1, '#b4c4cc']]), { maxR: sharpN ? 44 : 30, dir: 90, detail: sharpN ? 2.4 : 1.4 });
  const jit = person(R, 880, 700, 200, 'jithin', { light: -1, turn: -.3, body: 3.0 });
  R.fill(RECT(700, 980, 420, 40), '#9a8a78', { maxR: sharpN ? 30 : 8, dir: 0 });
  R.fill(P([[720, 830], [790, 830], [784, 910], [726, 910]]), '#f0eee8', { maxR: sharpN ? 20 : 4 });      // his coffee cup
  R.line(c => { c.moveTo(0, 200); c.lineTo(SW, 200); c.moveTo(0, 1300); c.lineTo(SW, 1300); c.moveTo(560, 200); c.lineTo(560, 1300); }, '#5a6670', 18, { maxR: 6 });
  R.tint(RECT(0, 200, SW, 1100), 'rgba(220,235,245,.22)');
  // manager's desk + manager (back of chair), Nikhil handing the envelope
  R.fill(RECT(0, 1640, SW, 494), lin(0, 1640, 0, SH, [[0, '#5a4a3c'], [1, '#2a2018']]), { maxR: 24, dir: 0 });
  R.fill(RR(820, 1380, 420, 600, 60), '#22262c', { maxR: sharpN ? 16 : 30, dir: 90 });
  R.fill(E(1010, 1350, 110, 120), '#1a1412', { maxR: sharpN ? 10 : 24 });
  const nik = person(R, 300, 1220, 300, 'nik24', { light: 1, turn: .4, body: 3.0 });
  limb(R, [[500, 1560], [640, 1600], [760, 1560]], 80, '#24324f');
  R.fill(P([[700, 1500], [940, 1470], [956, 1600], [714, 1632]]), '#f6f2e6', { maxR: 6, dir: -8, hgt: 1.2 });
  R.text('Resignation', 828, 1572, 'italic 600 40px "Cormorant Garamond"', '#2a2a2a', { maxR: 2 });
  hand(R, 740, 1560, 42, 'nik24', 0);
  const st = paintRef(R, { R: R_STD, T: 13, seed: 15 });
  // re-coarsen the out-of-focus plane: drop the fine strokes on the soft side
  return { strokes: st, ref: R, f: { nik, jit }, a: {} };
}

// ---------- golden hour: walking out with the box (background) ----------
export function buildSunset() {
  const R = new Ref(SW, SH, 1);
  bg(R, [[0, '#f0a050'], [.3, '#f6c070'], [.5, '#e88a50'], [1, '#5a3028']]);
  R.fill(E(600, 760, 150, 150), '#fff0b0', { maxR: 14, hgt: 1.3 });
  R.fill(RECT(0, 300, 460, 1400), lin(0, 0, 460, 0, [[0, '#5a3a3a'], [1, '#8a5a4a']]), { maxR: 30, dir: 90 });       // office building
  for (let y = 360; y < 1600; y += 120) for (let x = 40; x < 420; x += 110) R.fill(RECT(x, y, 70, 80), '#f6c068', { maxR: 10, dir: 90 });
  R.fill(RECT(820, 500, 380, 1200), '#6a4040', { maxR: 30, dir: 90 });
  R.fill(RECT(0, 1600, SW, 534), lin(0, 1600, 0, SH, [[0, '#c87a50'], [1, '#4a2a20']]), { maxR: 34, dir: 0 });
  return done(R, {}, {}, 16);
}
export function buildWalker() {
  const R = new Ref(900, 1500, 1);
  const nik = person(R, 450, 420, 260, 'nik24', { light: -1, turn: 0, tint: '#ffb060', tintA: .25, body: 4.2 });
  // cardboard box held at the waist
  R.fill(P([[160, 1000], [740, 1000], [760, 1380], [140, 1380]]), lin(160, 0, 740, 0, [[0, '#d8a868'], [1, '#a87840']]), { maxR: 12, dir: 90, hgt: 1.2 });
  R.fill(P([[140, 1000], [760, 1000], [720, 940], [180, 940]]), '#e8bc80', { maxR: 8, dir: 0 });
  R.fill(RR(280, 900, 120, 60, 6), '#3a7a4a', { maxR: 4 });               // a plant in the box
  R.fill(E(560, 900, 50, 70), '#4a8a4a', { maxR: 6 });
  hand(R, 170, 1180, 50, 'nik24', 1.6); hand(R, 730, 1180, 50, 'nik24', 1.5);
  return { strokes: paintRef(R, { R: [30, 15, 7.5, 3.6], T: 12, seed: 17 }), ref: R, f: { nik } };
}

// ---------- cards ----------
export function buildTitleText() {
  const R = new Ref(1000, 300, 1);
  R.text('RED CANDLE', 500, 190, '700 150px "Cormorant Garamond"', '#e8352a', { maxR: 6, dir: 0 });
  return { strokes: paintRef(R, { R: [10, 5, 2.5], T: 10, seed: 18 }), ref: R };
}
export function buildEp2Text() {
  const R = new Ref(1000, 420, 1);
  R.text('Episode 2', 500, 170, 'italic 600 110px "Cormorant Garamond"', '#efe2c4', { maxR: 5, dir: 0 });
  R.text('THE FALL', 500, 340, '700 140px "Cormorant Garamond"', '#d8302a', { maxR: 6, dir: 0 });
  return { strokes: paintRef(R, { R: [10, 5, 2.5], T: 10, seed: 19 }), ref: R };
}
