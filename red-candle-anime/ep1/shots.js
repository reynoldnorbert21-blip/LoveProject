// Red Candle · Episode 1 — 80s cel anime. Same timeline and voices as the painted series; every shot redrawn as cels over airbrushed plates.
import { K, init, W, H, plate, show, inCam, camK, bust, rect, glow, grime, win, screen, chrome, caption, mark, flash, clamp, lerp, ss, eo, seg, st, U, range, L, dur, talk, blink,
  cel, poly, line, airbrush, vgrad, rgba, mix, hash, rng, TAU, pal, head, LWK } from '../kit.js';
import { chart, notif, clock, code, spinner, UI } from '../ui.js';
import { bigPhone, laptop, watchInsert, candle, backWalker, suitcase, envelope, mug, phoneAtEar, steam } from '../props.js';
import { rain, speedLines } from '../engine/fx.js';

let A = {}, HT;
export async function setup({ TL, ENV }) {
  init(TL, ENV); HT = K.HIT;
  A.room = plate(W, H, (g, e) => {                     // dark rented room at 3 a.m. (cold open / crash)
    vgrad(g, 0, 0, W, H, [[0, '#0c0e1c'], [.6, '#161a2e'], [1, '#0a0a14']]);
    win(g, e, 640, 160, 360, 520, 'rain', { frame: '#1a1c2a', seed: 3 });
    rect(g, 0, 1380, W, 540, { f: '#1c1a26', s: '#0e0d14', so: [0, -30], l: '#06060a', lw: 3 });   // desk
    grime(g, 0, 0, W, 1380, 4, '#000000', .12);
  });
  A.rainwin = plate(W, H, (g, e) => {                  // rain-streaked window behind the close-up
    vgrad(g, 0, 0, W, H, [[0, '#101830'], [1, '#1c2440']]);
    const R = rng(11); for (let i = 0; i < 40; i++) { const x = R() * W, y = R() * H * .7, r = 20 + R() * 70; airbrush(g, x, y, r, r, ['#ffcf7a', '#7ac8ff', '#ff6a9a'][i % 3], .35, 1); airbrush(e, x, y, r, r, ['#ffcf7a', '#7ac8ff', '#ff6a9a'][i % 3], .3, 1); }
    for (let i = 0; i < 120; i++) { const x = R() * W, y = R() * H; g.strokeStyle = rgba('#cfe0ff', .18); g.lineWidth = 2 + R() * 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 6, y + 40, x - 2, y + 60 + R() * 120); g.stroke(); }
  });
  A.home = plate(W, H, (g, e) => {                     // Kerala home, lamp-lit, the night before the flight
    vgrad(g, 0, 0, W, 1250, [[0, '#d8a868'], [1, '#a8743e']]); grime(g, 0, 0, W, 1250, 8, '#5a3010', .1);
    win(g, e, 680, 220, 330, 440, 'night', { frame: '#5a3418', seed: 5, hbar: true });
    rect(g, 120, 260, 190, 250, { f: '#f2ead6', s: '#c8bca0', so: [-6, -6], l: '#5a4a2a', lw: 2.4 }); rect(g, 120, 260, 190, 66, { f: '#c8341e', l: '#5a1008', lw: 2 });   // calendar
    g.fillStyle = '#3a2210'; g.font = '700 70px "Barlow SC"'; g.textAlign = 'center'; g.fillText('14', 215, 450);
    line(g, [[540, 0], [540, 120]], '#2a1a0e', 5); cel(g, poly([[470, 120], [610, 120], [580, 170], [500, 170]]), { f: '#e8c070', s: '#a8803a', so: [0, 8], l: '#4a3008', lw: 2.4 });
    glow(g, e, 540, 200, 520, '#ffc070', .55, .45);
    vgrad(g, 0, 1250, W, 670, [[0, '#9a3e22'], [1, '#5a1e10']]); line(g, [[0, 1250], [W, 1250]], '#3a1408', 4);
    for (let i = 0; i < 6; i++) { g.fillStyle = rgba('#ffffff', .05); g.fillRect(0, 1300 + i * 100, W, 4); }
  });
  A.airport = plate(W, H, (g, e) => {                  // departures hall at night
    vgrad(g, 0, 0, W, H, [[0, '#1a2440'], [.55, '#3a4a6a'], [1, '#2a3048']]);
    for (let i = 0; i < 5; i++) { const x = i * 240 - 40; rect(g, x, 0, 220, 760, { f: '#0e1630', l: '#4a5a7a', lw: 6 }); }
    const R = rng(21); for (let i = 0; i < 26; i++) { const x = R() * W, y = 560 + R() * 160; g.fillStyle = ['#ff5a3a', '#ffffff', '#7ac8ff'][i % 3]; g.fillRect(x, y, 6, 6); glow(null, e, x, y, 30, g.fillStyle, .6); }
    rect(g, 90, 120, 900, 300, { f: '#0a0a10', s: '#000000', l: '#2a2a34', lw: 6 });     // departures board
    g.font = '700 46px "Barlow SC"'; g.textAlign = 'left';
    [['DEPARTURES', '', '#ffd27a'], ['DXB  DUBAI', '01:55  BOARDING', '#ffb03a'], ['LHR  LONDON', '02:10  GATE 4', '#ffb03a'], ['MAN  MANCHESTER', '02:40  BOARDING', '#ffd27a']].forEach(([a, b, c], i) => { g.fillStyle = c; g.fillText(a, 130, 180 + i * 64); g.fillText(b, 640, 180 + i * 64); e.fillStyle = rgba(c, .6); e.font = g.font; e.textAlign = 'left'; e.fillText(a, 130, 180 + i * 64); e.fillText(b, 640, 180 + i * 64); });
    for (let i = 0; i < 4; i++) glow(g, e, 160 + i * 260, 40, 160, '#dfeaff', .35, .5);
    vgrad(g, 0, 1300, W, 620, [[0, '#5a6480'], [1, '#2a3048']]);
  });
  A.manc = plate(W, H, (g, e) => {                     // Manchester terrace street at night, rain, one-point perspective
    const VX = 540, VY = 760, R = rng(31);
    vgrad(g, 0, 0, W, VY, [[0, '#060a18'], [1, '#2a3048']]); airbrush(g, VX, VY, 500, 200, '#5a5a7a', .5, 1);
    vgrad(g, 0, VY, W, H - VY, [[0, '#2a3044'], [1, '#0c0f1a']]);
    const P = (side, d, hgt) => { const k = Math.pow(d, 1.7); const x = side < 0 ? lerp(-80, VX - 70, k) : lerp(W + 80, VX + 70, k); const y0 = lerp(1500, VY + 20, k), top = lerp(-200, VY - 230, k) + hgt; return [x, y0, top]; };
    for (const side of [-1, 1]) for (let i = 9; i >= 0; i--) {
      const d0 = i / 10, d1 = (i + 1) / 10, [x0, y0, t0] = P(side, d0, 0), [x1, y1, t1] = P(side, d1, 0);
      const col = i % 2 ? '#5a2c24' : '#4a241e';
      cel(g, poly([[x0, t0], [x1, t1], [x1, y1], [x0, y0]]), { f: col, s: '#200e0e', l: '#0a0406', lw: 2 });
      for (const fy of [.25, .55]) { const ax = lerp(x0, x1, .3), bx = lerp(x0, x1, .7), ay = lerp(t0, y0, fy), by = lerp(t1, y1, fy), hh = (y0 - t0) * .12, hh2 = (y1 - t1) * .12, lit = R() < .45;
        g.fillStyle = lit ? '#ffcf7a' : '#141a2a'; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.lineTo(bx, by + hh2); g.lineTo(ax, ay + hh); g.closePath(); g.fill();
        if (lit) { e.fillStyle = rgba('#ffcf7a', .5); e.fill(new Path2D()); e.beginPath(); e.moveTo(ax, ay); e.lineTo(bx, by); e.lineTo(bx, by + hh2); e.lineTo(ax, ay + hh); e.closePath(); e.fill(); } }
    }
    for (const [side, d] of [[-1, .15], [1, .4], [-1, .62], [1, .8]]) { const [x, y0] = P(side, d, 0), s = lerp(1.6, .35, Math.pow(d, 1.7)); const lx = x + (side < 0 ? 60 : -60) * s;
      line(g, [[lx, y0], [lx, y0 - 520 * s]], '#14141a', 12 * s); cel(g, poly([[lx - 22 * s, y0 - 520 * s], [lx + 22 * s, y0 - 520 * s], [lx + 14 * s, y0 - 490 * s], [lx - 14 * s, y0 - 490 * s]]), { f: '#ffe0a0', l: '#3a2a10', lw: 2 });
      glow(g, e, lx, y0 - 500 * s, 200 * s, '#ffc870', .45, .7); airbrush(g, lx, y0 + 40 * s, 60 * s, 300 * s, '#ffc870', .25, 1); airbrush(e, lx, y0 + 40 * s, 40 * s, 280 * s, '#ffc870', .3, 1); }
    for (let i = 0; i < 9; i++) { const y = lerp(1900, VY + 30, Math.pow(i / 9, .6)); g.fillStyle = rgba('#ffffff', .05); g.fillRect(VX - 8 * (1 - i / 9) - 2, y, 16 * (1 - i / 9) + 4, 50 * (1 - i / 9) + 4); }
  });
  A.kitchen = plate(W, H, (g, e) => {                  // restaurant kitchen, fluorescent tubes, steel
    vgrad(g, 0, 0, W, H, [[0, '#cfdcd2'], [.6, '#9aaea2'], [1, '#5a6a62']]);
    for (let y = 0; y < 1300; y += 70) for (let x = (y / 70 % 2) * 35; x < W; x += 70) { g.strokeStyle = rgba('#ffffff', .25); g.lineWidth = 2; g.strokeRect(x, y, 70, 70); }
    for (const x of [200, 760]) { rect(g, x - 150, 70, 300, 24, { f: '#f4fff8', l: '#6a7a72', lw: 2 }); glow(g, e, x, 90, 320, '#e8fff0', .3, .45); }
    for (let i = 0; i < 5; i++) { const x = 160 + i * 180; line(g, [[x, 160], [x, 300]], '#4a4a52', 4); const p = new Path2D(); p.ellipse(x, 360, 60, 60, 0, 0, TAU); cel(g, p, { f: '#8a8e98', s: '#5a5e68', so: [-10, -8], h: '#d8dce4', ho: [6, 6], l: '#2a2e38', lw: 3 }); }
    rect(g, 0, 1240, W, 680, { f: '#a8b0b8', s: '#6a727c', so: [0, -40], h: '#e4ecf4', ho: [0, 10], l: '#2a3038', lw: 3 });
  });
  A.office = plate(W * 1.3, H, (g, e, w) => {         // bright IT office (wider: side tracking)
    vgrad(g, 0, 0, w, H, [[0, '#e8eef4'], [1, '#c8d2dc']]);
    for (let i = 0; i < 4; i++) win(g, e, 60 + i * 340, 140, 300, 620, 'day', { frame: '#8a96a4', seed: 40 + i, lw: 14 });
    rect(g, 0, 1180, w, 740, { f: '#9aa4b0', s: '#6a7480', so: [0, -30], l: '#2a3038', lw: 3 });
    for (let i = 0; i < 4; i++) { const x = 140 + i * 360; rect(g, x, 980, 240, 160, { f: '#22242c', l: '#06060a', lw: 3 }); }
  });
  A.pub = plate(W, H, (g, e) => {                      // warm pub: back bar, bottles, pendant lamps
    vgrad(g, 0, 0, W, H, [[0, '#3a1e10'], [.5, '#5a3018'], [1, '#2a140a']]);
    for (let r = 0; r < 3; r++) { rect(g, 40, 300 + r * 200, 1000, 20, { f: '#6a3a1a', l: '#2a1408', lw: 2 });
      for (let i = 0; i < 14; i++) { const x = 70 + i * 70, c = ['#3a8a4a', '#c8a040', '#8a2a1a', '#d8d0b0', '#2a5a8a'][(i + r) % 5], hh = 110 + (hash(i + r * 9) * 50 | 0); cel(g, poly([[x, 300 + r * 200], [x + 36, 300 + r * 200], [x + 36, 300 + r * 200 - hh * .6], [x + 24, 300 + r * 200 - hh], [x + 12, 300 + r * 200 - hh], [x, 300 + r * 200 - hh * .6]]), { f: c, s: mix(c, '#000000', .4), so: [-6, 0], h: mix(c, '#ffffff', .5), hi: [[[x + 6, 300 + r * 200 - hh * .55], [x + 12, 300 + r * 200 - hh * .55], [x + 12, 300 + r * 200 - 10], [x + 6, 300 + r * 200 - 10]]], l: mix(c, '#000000', .7), lw: 1.6 }); e.fillStyle = rgba(c, .2); e.fillRect(x, 300 + r * 200 - hh, 36, hh); } }
    for (const x of [200, 540, 880]) { line(g, [[x, 0], [x, 110]], '#1a0e06', 4); cel(g, poly([[x - 60, 110], [x + 60, 110], [x + 40, 160], [x - 40, 160]]), { f: '#c8641e', l: '#3a1406', lw: 2 }); glow(g, e, x, 170, 300, '#ffb050', .55, .6); }
    rect(g, 0, 1300, W, 620, { f: '#4a2410', s: '#2a1406', so: [0, -30], h: '#8a5028', ho: [0, 8], l: '#140804', lw: 3 });
  });
  A.night = plate(W, H, (g, e) => {                    // his room at night, wall clock
    vgrad(g, 0, 0, W, H, [[0, '#0e1024'], [1, '#1a1c34']]); grime(g, 0, 0, W, H, 61, '#000000', .12);
    const c = new Path2D(); c.arc(840, 320, 110, 0, TAU); cel(g, c, { f: '#d8d4c8', s: '#8a867a', so: [-8, -8], l: '#2a2820', lw: 4 });
    rect(g, 0, 1350, W, 570, { f: '#1e1c2a', l: '#06060a', lw: 3 });
  });
  A.canteen = plate(W, H, (g, e) => {                  // office canteen, daylight
    vgrad(g, 0, 0, W, H, [[0, '#f0e6d4'], [1, '#c8b89c']]);
    win(g, e, 80, 160, 920, 520, 'day', { frame: '#a89a84', seed: 71, hbar: false, lw: 14 });
    rect(g, 0, 1280, W, 640, { f: '#c86a3a', s: '#8a4220', so: [0, -30], h: '#f0a070', ho: [0, 8], l: '#3a1808', lw: 3 });
  });
  A.sunset = plate(W * 2.2, H, (g, e, w) => {         // long sunset street for side tracking
    vgrad(g, 0, 0, w, H, [[0, '#3a2a6a'], [.35, '#c8507a'], [.55, '#ff9a5a'], [.7, '#ffd890'], [1, '#6a3a3a']]);
    airbrush(g, w * .5, 1000, 220, 220, '#fff4c8', 1, .3); glow(null, e, w * .5, 1000, 600, '#ffa050', .8);
    const R = rng(81); for (let x = 0; x < w;) { const bw = 140 + R() * 220, bh = 300 + R() * 500; g.fillStyle = mix('#2a1430', '#5a2a3a', R()); g.fillRect(x, 1250 - bh, bw, bh); for (let k = 0; k < 8; k++) if (R() < .3) { const wx = x + 10 + R() * (bw - 30), wy = 1250 - bh + 20 + R() * (bh - 60); g.fillStyle = '#ffd88a'; g.fillRect(wx, wy, 16, 22); e.fillStyle = rgba('#ffd88a', .6); e.fillRect(wx, wy, 16, 22); } x += bw + 10; }
    vgrad(g, 0, 1250, w, 670, [[0, '#4a2a3a'], [1, '#1a0e1a']]);
  });
  return { phone: ['a26'] };
}

const LT = id => K.LT[id];
const amber = (g, e, x, y, r) => glow(g, e, x, y, r, '#ffb050', .4, .5);

// payout screen (cold open)
function payout(x, w, h, t) {
  x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h); x.textAlign = 'left'; x.fillStyle = '#7fa8e8'; x.font = `600 ${w * .07}px ${UI}`; x.fillText('03:00', w * .06, h * .14);
  x.textAlign = 'center'; x.fillStyle = '#e8eefc'; x.font = `700 ${w * .14}px ${UI}`; x.fillText('Payout', w / 2, h * .46);
  x.fillStyle = '#ffd27a'; x.font = `italic 700 ${w * .11}px ${UI}`; x.fillText('Processing', w / 2, h * .62); spinner(x, w / 2, h * .8, w * .06, t, '#e8eefc');
}

const SH = {
  cold(t, g, e) {
    const u = U('cold', t), z = lerp(1, 1.14, ss(u)); show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'lap', W / 2, 980, 780, (x, w, h) => payout(x, w, h, t)));
    glow(g, e, W / 2, 980, 700, '#4a7aff', .25, .15);
    return { post: { power: Math.min(1, t / .6), expo: 1.02, tint: [.94, .97, 1.05] }, sub: { hide: true } };
  },
  face(t, g, e) {
    const [a] = range('face'), u = U('face', t), z = lerp(1, 1.12, ss(u)); show(g, e, A.rainwin, { z: 1 + u * .05 });
    LWK.k = .6; const tt = st(t);
    bust(g, e, 'nik', 'screen', W / 2, lerp(980, 900, ss(u)), 4.4 * z, { expr: 'hard', E: { lid: .42 }, look: [.25, .15], blink: blink(tt, 3), light: [1, .4], rim: '#ff5a8a', tear: seg(t, a + 5, a + 7.2) * .6 });
    LWK.k = 1;
    for (let i = 0; i < 18; i++) { const x = hash(i * 3.3) * W, y = ((hash(i) * H + st(t, 12) * 260) % (H + 200)) - 100; g.fillStyle = rgba('#0a1020', .18); g.fillRect(x, y, 10, 90); }   // rain shadows sliding on the face
    return { post: { expo: 1.02, tint: [.95, .97, 1.05], lift: .05 } };
  },
  title(t, g, e) {
    vgrad(g, 0, 0, W, H, [[0, '#0a0206'], [1, '#1a0408']]); airbrush(g, W / 2, 1100, 700, 700, '#5a0a10', .6, 1);
    const k = eo(seg(t, HT.titleCandle, HT.titleCandle + 1.0)); candle(g, e, W / 2, 1180, 560 * st(k, 12), 150, 'red', { ga: .8 });
    if (t > HT.presents && t < HT.titleText + 2.6) { g.save(); g.globalAlpha = seg(t, HT.presents, HT.presents + .4); g.font = '500 40px "Cormorant SC"'; g.letterSpacing = '8px'; g.textAlign = 'center'; g.fillStyle = '#f4e4c8'; g.fillText('MeowXTrader presents', W / 2, 400); g.restore(); }
    if (t > HT.titleText) { const n = Math.min(10, Math.floor((t - HT.titleText) * 12)); chrome(g, e, 'RED CANDLE'.slice(0, n), W / 2, 1480, 150, { cols: [[0, '#ffd8c8'], [.46, '#ffffff'], [.5, '#4a0610'], [.7, '#c81e2a'], [.9, '#ff6a3a'], [1, '#ffd08a']], neon: '#ff2a3a' }); }
    caption(g, e, '4 years earlier', 1700, seg(t, HT.years, HT.years + .3), { size: 46 });
    return { post: { expo: 1.05 }, sub: { hide: true } };
  },
  home(t, g, e) {
    const [a] = range('home'), u = U('home', t), tt = st(t);
    const cam = t < LT('a04') - .2 ? { x: lerp(540, 520, u), y: lerp(1000, 960, u), z: lerp(1, 1.08, u) } : { x: 330, y: 760, z: 1.55 };
    show(g, e, A.home, cam);
    inCam(g, cam, A.home, g2 => {
      const amTalk = talk(t, 'amma'), nkTalk = talk(t, 'nik');
      bust(g2, null, 'amma', 'warm', 320, 820, 1.9, { expr: t > LT('a04') ? 'grin' : 'warm', mouth: amTalk || undefined, look: [.6, .1], blink: blink(tt, 4), light: [1, -.6] });
      bust(g2, null, 'nik19', 'warm', 790, 860, 1.85, { mirror: true, expr: t > LT('a03') + 2.6 ? 'grin' : 'smile', mouth: nkTalk || undefined, look: [.5, .1], blink: blink(tt, 2), light: [-1, -.6] });
      suitcase(g2, 220, 1330, 640, 260, { jars: [[90, 120, '#c8a040'], [250, 110, '#b8541e'], [400, 130, '#8a2a14']] });
    });
    caption(g, e, 'Kerala · the night before', 300, seg(t, a + .2, a + .5) * (1 - seg(t, a + 3, a + 3.3)));
    return { post: { expo: 1.05, tint: [1.03, .97, .9] } };
  },
  airport(t, g, e) {
    const [a] = range('airport'), tt = st(t), cutW = 33.2, cutB = 36.2, cutA = LT('a07') - .3;
    if (t >= cutW && t < cutB) {   // insert: Achan fastens his watch on the boy's wrist
      vgrad(g, 0, 0, W, H, [[0, '#2a3450'], [1, '#141a2a']]); for (let i = 0; i < 9; i++) airbrush(g, hash(i) * W, hash(i * 3) * H * .7, 90, 90, ['#ffcf7a', '#7ac8ff'][i % 2], .35, 1);
      const k = seg(t, HT.watchClick - .1, HT.watchClick + .35);
      watchInsert(g, e, W / 2, 900, 1.25, t, { who: 'nik19', light: 'cool', rot: -.15, glint: k > 0 && k < 1 ? k : .1, star: k > 0 && k < 1 ? Math.sin(k * Math.PI) * .9 : 0, sleeve: pal('nik19', 'cool').cloth });
      const Pa = pal('achan', 'cool'); for (const [fx, fy, r] of [[470, 1080, .3], [520, 1100, .25], [430, 760, -.4], [480, 740, -.3]]) { g.save(); g.translate(fx, fy); g.rotate(r); const f = new Path2D(); f.roundRect(-26, -60, 52, 120, 24); cel(g, f, { f: Pa.skin.f, s: Pa.skin.s, so: [-6, -6], h: Pa.skin.h, ho: [3, 3], l: Pa.skin.l, lw: 2.4 }); line(g, [[-14, -20], [14, -20]], Pa.skin.l, 1.4); g.restore(); }
      return { post: { expo: 1.04, tint: [.97, .98, 1.03] } };
    }
    if (t >= cutA) {   // Amma breaks: "Call every day, okay?"
      show(g, e, A.airport, { x: 540, y: 700, z: 1.4 });
      bust(g, e, 'amma', 'cool', 520, 980, 3.2, { expr: 'cry', mouth: talk(t, 'amma') || 'cry', tear: .3 + seg(t, cutA, cutA + 2) * .7, blink: blink(tt, 9), ph: tt, light: [.6, -.8] });
      return { post: { expo: 1.03, tint: [.97, .98, 1.03] } };
    }
    const u = seg(t, a, cutA), cam = t < cutW ? { x: 540, y: 960, z: lerp(1, 1.06, u) } : { x: 560, y: 900, z: 1.22 };
    show(g, e, A.airport, cam);
    inCam(g, cam, A.airport, g2 => {
      bust(g2, null, 'amma', 'cool', 140, 1000, 1.5, { expr: 'sad', blink: blink(tt, 5), tear: seg(t, a, cutA) * .5, light: [1, -.6] });
      bust(g2, null, 'achan', 'cool', 380, 900, 1.9, { expr: talk(t, 'achan') ? 'warm' : 'smile', mouth: talk(t, 'achan') || undefined, look: [.6, .2], blink: blink(tt, 6), light: [1, -.6] });
      bust(g2, null, 'nik19', 'cool', 800, 930, 1.85, { mirror: true, expr: t > cutB ? 'sad' : 'neutral', look: [.4, t > cutB ? .5 : .1], blink: blink(tt, 1), light: [-1, -.6] });
    });
    return { post: { expo: 1.04, tint: [.97, .98, 1.03] } };
  },
  watch(t, g, e) {
    const [a, b] = range('watch'), cut = 52.4;
    if (t < cut) {
      const u = seg(t, a, cut); vgrad(g, 0, 0, W, H, [[0, '#1a2038'], [1, '#0a0e1c']]);
      for (let i = 0; i < 14; i++) { const x = (hash(i) * W + u * 120 * (1 + hash(i * 5))) % W, y = hash(i * 3) * H * .8; airbrush(g, x, y, 60 + hash(i * 7) * 80, 60 + hash(i * 7) * 80, ['#ffcf7a', '#7ac8ff', '#ff8a6a'][i % 3], .35, 1); airbrush(e, x, y, 60, 60, '#ffcf7a', .3, 1); }
      watchInsert(g, e, W / 2, 880, lerp(1.6, 1.9, ss(u)), t, { who: 'nik19', light: 'night', rot: -.1, sleeve: pal('nik19', 'night').cloth });
      return { post: { expo: 1.03, tint: [.96, .97, 1.04] } };
    }
    // airplane window, wing light blinking, the city falling away
    const u = seg(t, cut, b); vgrad(g, 0, 0, W, H, [[0, '#1c1e2c'], [1, '#0e0f18']]);
    g.save(); const wn = new Path2D(); wn.roundRect(220, 420, 640, 900, 300); g.clip(wn);
    vgrad(g, 220, 420, 640, 900, [[0, '#0a1030'], [1, '#2a3460']]);
    const R = rng(91); for (let i = 0; i < 160; i++) { const x = 220 + R() * 640, y = 1000 + R() * 400 + u * 200; g.fillStyle = ['#ffcf7a', '#ffffff', '#ff8a5a'][i % 3]; g.fillRect(x, y, 3, 3); e.fillStyle = g.fillStyle; e.fillRect(x, y, 3, 3); }
    cel(g, poly([[860, 900], [420, 1040], [380, 1080], [860, 1000]]), { f: '#5a6070', s: '#3a3e4a', so: [0, 8], l: '#14161c', lw: 3 });
    if (Math.floor(t * 1.5) % 2) { g.fillStyle = '#ff3a2a'; g.beginPath(); g.arc(400, 1060, 9, 0, TAU); g.fill(); glow(null, e, 400, 1060, 80, '#ff3a2a', .9); }
    g.restore(); g.strokeStyle = '#2a2c38'; g.lineWidth = 40; g.beginPath(); g.roundRect(220, 420, 640, 900, 300); g.stroke();
    return { post: { expo: 1.02, tint: [.95, .97, 1.05] } };
  },
  manc(t, g, e) {
    const [a] = range('manc'), u = U('manc', t), cam = { x: W / 2, y: H / 2 + 60, z: lerp(1, 1.12, u) };
    show(g, e, A.manc, cam);
    inCam(g, cam, A.manc, g2 => backWalker(g2, null, W / 2 - 40, lerp(1240, 1120, u), lerp(1.25, .95, u), st(t - a, 12) * .9, { who: 'nik', light: 'rain', suitcase: true, hood: true }));
    rain(g, e, Math.floor(t * 12), { n: 260, a: .38, ang: .15 });
    return { post: { expo: 1.0, tint: [.92, .96, 1.06], lift: .05 } };
  },
  kitchen(t, g, e) {
    const u = U('kitchen', t), tt = st(t); show(g, e, A.kitchen, { z: lerp(1, 1.1, u) });
    for (let i = 0; i < 7; i++) { const p = new Path2D(); p.ellipse(860, 1220 - i * 22, 150, 30, 0, 0, TAU); cel(g, p, { f: '#f2f4f6', s: '#b8c0c8', so: [0, 6], l: '#4a525a', lw: 2 }); }
    bust(g, e, 'nikApron', 'cool', 470, 860, 2.4, { expr: 'tired', look: [.4, .6], blink: blink(tt, 3), light: [.6, -1] });
    steam(g, 470, 1500, t, 9, .28);
    return { post: { expo: 1.03, tint: [.96, 1.02, .97] } };
  },
  bunk(t, g, e) {
    const u = U('bunk', t), tt = st(t); show(g, e, A.night, { z: lerp(1, 1.08, u) });
    bust(g, e, 'nik', 'screen', 300, 470, 1.55, { expr: t > HT.emailBuzz + .3 ? 'worried' : 'tired', look: [.6, .7], blink: blink(tt, 5), light: [.5, 1], rim: '#5a8aff' });
    bigPhone(g, e, 'bph', 620, 1010, 560, (x, w, h) => { clock(x, w, h, '01:47', { y: .24 }); if (t > HT.emailBuzz) notif(x, w, h * .32, 'University Finance', 'Tuition fee overdue', eo(seg(t, HT.emailBuzz, HT.emailBuzz + .3)), { tc: '#8a1a14', h: 240, big: '£3,200' }); }, { rot: -.05, glow: .28 });
    return { post: { expo: 1.02, tint: [.94, .97, 1.05], lift: .04 } };
  },
  call(t, g, e) {
    const tt = st(t), nikOn = (t >= LT('a13') - .1 && t < LT('a14') - .2) || t >= LT('a15') - .1;
    if (nikOn) {   // his side: lying on the bunk, the brave smile
      show(g, e, A.night, { z: 1.25, y: 900 });
      const lie = t >= LT('a15') - .1;
      bust(g, e, 'nik', 'screen', 540, 900, 3.3, { expr: lie ? 'grin' : 'smile', mouth: talk(t, 'nik') || undefined, look: [.1, -.1], blink: blink(tt, 6), light: [0, 1], rim: '#5a8aff', E: { wet: lie ? .6 : .3 } });
      return { post: { expo: 1.02, tint: [.94, .97, 1.05], lift: .04 } };
    }
    vgrad(g, 0, 0, W, H, [[0, '#0a0c18'], [1, '#14182a']]);
    bigPhone(g, e, 'cph', W / 2, 920, 700, (x, w, h) => {
      vgrad(x, 0, 0, w, h, [[0, '#d8a868'], [1, '#8a5a30']]); airbrush(x, w * .7, h * .2, 200, 200, '#ffc070', .6, 1);
      const worry = t > LT('a14') - .2;
      bust(x, null, 'amma', 'warm', w / 2, h * .5, w / 300, { expr: worry ? 'worried' : 'warm', mouth: talk(t, 'amma') || undefined, look: [0, .1], blink: blink(tt, 4) });
      x.fillStyle = '#20242c'; x.fillRect(w - 170, 30, 140, 230); x.fillStyle = '#3a4258'; x.fillRect(w - 160, 40, 120, 210);
      x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(0, h - 120, w, 120); x.fillStyle = '#e83a2a'; x.beginPath(); x.arc(w / 2, h - 60, 40, 0, TAU); x.fill();
      x.fillStyle = '#f4f2ee'; x.font = `700 40px ${UI}`; x.textAlign = 'left'; x.fillText('Amma ♥', 30, 70);
    }, { glow: .55 });
    return { post: { expo: 1.03, tint: [.97, .97, 1.03] } };
  },
  callEnd(t, g, e) {
    const [a] = range('callEnd'), u = U('callEnd', t), tt = st(t), lit = 1 - seg(t, HT.hangup, HT.hangup + .3);
    show(g, e, A.night, { z: lerp(1.25, 1.4, u), y: 900 });
    bust(g, e, 'nik', lit > .5 ? 'screen' : 'night', 540, 900, lerp(3.3, 3.7, u), { expr: u < .15 ? 'smile' : u < .4 ? 'neutral' : 'sad', look: [.1, lerp(-.1, .7, ss(seg(u, .2, .55)))], blink: blink(tt, 6), light: [0, 1], tear: seg(u, .5, 1) * .8, ph: tt });
    return { post: { expo: lerp(1.02, .95, u), tint: [.93, .96, 1.06], lift: .05 } };
  },
  office(t, g, e) {
    const u = U('office', t), tt = st(t), cam = { x: lerp(560, A.office.w - 560, u), y: H / 2, z: 1 };
    show(g, e, A.office, cam);
    inCam(g, cam, A.office, g2 => { rect(g2, 700, 760, 520, 340, { f: '#22242c', l: '#06060a', lw: 4 }); screen(g2, null, 'mon', 720, 780, 480, 300, (x, w, h) => code(x, w, h, t)); });
    bust(g, e, 'nikShirt', 'day', 380, 1000, 2.2, { expr: 'smile', look: [.8, .2], blink: blink(tt, 2), light: [1, -.8] });
    return { post: { expo: 1.05, sat: 1.06 } };
  },
  pub(t, g, e) {
    const [a] = range('pub'), tt = st(t), ins = t >= LT('a17') + 1.6 && t < LT('a18') - .15;
    if (ins) {   // insert: the phone in Jithin's hand, +£200 today
      show(g, e, A.pub, { z: 1.6, y: 700 });
      bigPhone(g, e, 'pph', W / 2, 900, 520, (x, w, h) => { x.fillStyle = '#0c1410'; x.fillRect(0, 0, w, h); x.fillStyle = '#3aee8a'; x.textAlign = 'center'; x.font = `700 ${w * .2}px ${UI}`; x.fillText('+£200', w / 2, h * .2); x.font = `italic 600 ${w * .07}px ${UI}`; x.fillStyle = '#9ad8b0'; x.fillText('today', w / 2, h * .27); chart(x, 16, h * .32, w - 32, h * .6, { n: 14, seed: 3, bias: .03 }); }, { rot: .06, glow: .65 });
      return { post: { expo: 1.05, tint: [1.03, .97, .9] } };
    }
    const u = U('pub', t), cam = { x: 540, y: lerp(1000, 960, u), z: lerp(1.02, 1.12, u) };
    show(g, e, A.pub, cam);
    inCam(g, cam, A.pub, g2 => {
      bust(g2, null, 'jithin', 'warm', 330, 960, 2.0, { expr: talk(t, 'jithin') ? 'grin' : 'smile', mouth: talk(t, 'jithin') || undefined, look: [.6, .1], blink: blink(tt, 3), light: [1, -.7] });
      bust(g2, null, 'nikShirt', 'warm', 790, 990, 1.95, { mirror: true, expr: t > LT('a19') + 3 ? 'neutral' : 'worried', mouth: talk(t, 'nik') || undefined, look: [.6, .1], blink: blink(tt, 7), light: [-1, -.7] });
      mug(g2, 560, 1360, 1.2, '#d8a040'); mug(g2, 700, 1380, 1.1, '#c8641e');
    });
    return { post: { expo: 1.05, tint: [1.03, .97, .9] } };
  },
  research(t, g, e) {
    const [a] = range('research'), u = U('research', t), tt = st(t); show(g, e, A.night, { z: lerp(1, 1.1, u) });
    const hr = (t - a) * 1.6, mn = (t - a) * 16; g.lineCap = 'round'; g.strokeStyle = '#1a1a1e';
    g.lineWidth = 10; g.beginPath(); g.moveTo(840, 320); g.lineTo(840 + Math.cos(hr - 1.57) * 55, 320 + Math.sin(hr - 1.57) * 55); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(840, 320); g.lineTo(840 + Math.cos(mn - 1.57) * 85, 320 + Math.sin(mn - 1.57) * 85); g.stroke();
    bust(g, e, 'nik', 'screen', 360, 930, 2.2, { expr: 'hard', E: { lid: .2 }, look: [.9, .3], blink: blink(tt, 9), light: [1, .2], reflect: '#3aee8a' });
    rect(g, 600, 760, 460, 320, { f: '#1c1c24', l: '#06060a', lw: 4 });
    screen(g, e, 'rs', 616, 776, 428, 288, (x, w, h) => { x.fillStyle = '#0a0e14'; x.fillRect(0, 0, w, h); chart(x, 8, 14, w - 16, h - 28, { n: 30, seed: 9 + Math.floor((t - a) * 2) * 13, bias: .004, reveal: ((t - a) * 2) % 1 * .7 + .3 }); }, { glow: .6 });
    return { post: { expo: 1.02, tint: [.94, .98, 1.04], lift: .04 } };
  },
  bath(t, g, e) {
    const u = U('bath', t), tt = st(t); vgrad(g, 0, 0, W, H, [[0, '#c8d4cc'], [1, '#8a9a92']]);
    for (let y = 0; y < H; y += 90) { g.strokeStyle = rgba('#ffffff', .3); g.lineWidth = 2; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    const happy = ss(seg(u, .55, .9));
    bust(g, e, 'nikShirt', 'cool', 540, 560, 1.8, { expr: happy > .5 ? 'grin' : 'neutral', look: [0, .9 - happy * .9], blink: blink(tt, 4), light: [0, -1] });
    bigPhone(g, e, 'bth', W / 2, 1150, 400, (x, w, h) => { x.fillStyle = '#0c120e'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.fillStyle = '#9ab8a8'; x.font = `600 ${w * .09}px ${UI}`; x.fillText('Today’s P&L', w / 2, h * .16);
      const v = t < HT.ping1 ? null : t < HT.ping2 ? '+£180' : '+£420', pop = t < HT.ping2 ? seg(t, HT.ping1, HT.ping1 + .25) : seg(t, HT.ping2, HT.ping2 + .25);
      if (v) { x.save(); x.translate(w / 2, h * .5); const s = .8 + .2 * eo(pop); x.scale(s, s); x.fillStyle = '#3aee8a'; x.font = `700 ${w * .26}px ${UI}`; x.fillText(v, 0, 0); x.restore(); } }, { glow: .7 });
    return { post: { expo: 1.04 } };
  },
  canteen(t, g, e) {
    const tt = st(t), who = t < LT('a23') - .2 ? 'J' : t < LT('a24') - .2 ? 'N' : 'J';
    show(g, e, A.canteen, { z: 1.25, x: who === 'J' ? 400 : 680, y: 900 });
    if (who === 'J') {
      bust(g, e, 'jithin', 'day', 420, 980, 2.7, { expr: 'grin', mouth: talk(t, 'jithin') || undefined, look: [.6, .1], blink: blink(tt, 2), light: [1, -.8] });
    } else bust(g, e, 'nikShirt', 'day', 660, 980, 2.7, { mirror: true, expr: 'worried', mouth: talk(t, 'nik') || undefined, look: [.5, .3], blink: blink(tt, 8), light: [-1, -.8] });
    return { post: { expo: 1.05, sat: 1.05 } };
  },
  resign(t, g, e) {
    const tt = st(t);
    if (t < HT.rack) {   // the resignation letter slides onto the desk
      vgrad(g, 0, 0, W, H, [[0, '#c8d0d8'], [1, '#8a94a0']]); rect(g, 0, 900, W, 1020, { f: '#b08a60', s: '#7a5a3a', so: [0, -20], l: '#3a2410', lw: 3 });
      const k = eo(seg(t, HT.envelope - .3, HT.envelope + .4)); envelope(g, lerp(-300, 540, k), 1200, 560, lerp(-.3, -.05, k));
      const P = pal('nikShirt', 'cool'), hx = lerp(-260, 360, k); cel(g, [[hx - 700, 1130], [hx - 40, 1150], [hx - 30, 1290], [hx - 700, 1330]], { f: P.cloth.f, s: P.cloth.s, so: [0, -12], h: P.cloth.h, ho: [0, 6], l: P.cloth.l, lw: 3 }); const hd = new Path2D(); hd.roundRect(hx - 50, 1150, 150, 120, 50); cel(g, hd, { f: P.skin.f, s: P.skin.s, so: [-8, -8], h: P.skin.h, ho: [4, 4], l: P.skin.l, lw: 2.6 }); for (let f = 0; f < 3; f++) line(g, [[hx + 40, 1180 + f * 28], [hx + 96, 1186 + f * 28]], P.skin.l, 2);
      return { post: { expo: 1.04 } };
    }
    show(g, e, A.office, { x: 900, y: 900, z: 1.2 });   // ...and Jithin stays at his own desk, sipping his coffee
    const sip = t > HT.sip && t < HT.sip + 1.4;
    bust(g, e, 'jithin', 'day', 560, 1000, 2.5, { expr: t > HT.sip + .8 ? 'smile' : 'neutral', look: [-.6, .2], blink: blink(tt, 1), light: [1, -.8] });
    mug(g, 720 - (sip ? 140 : 0), sip ? 1180 : 1420, 1.6, '#2a5a8a');
    return { post: { expo: 1.04 } };
  },
  walk(t, g, e) {
    const [a] = range('walk'), u = U('walk', t), stop = seg(t, LT('a27') - 1.2, LT('a27') - .6), tt = st(t);
    const travel = (t - a) * 90 - stop * 0, cam = { x: 600 + Math.min(travel, (LT('a27') - 1 - a) * 90), y: H / 2, z: 1 };
    show(g, e, A.sunset, cam);
    const bob = Math.abs(Math.sin(st(t - a, 12) * 5.5)) * 12 * (1 - stop), guilt = t > LT('a26') && t < LT('a27') + 2;
    const P = bust(g, e, 'nikShirt', 'sunset', 520, 1020 + bob, 2.3, { expr: guilt ? 'sad' : t > LT('a28') ? 'smile' : 'grin', mouth: talk(t, 'nik') || undefined, look: [.3, guilt ? .6 : -.1], blink: blink(tt, 3), light: [1, -.4], rim: '#ffd06a' });
    if (t > HT.ring + .6) { g.save(); g.translate(520, 1020 + bob); g.scale(2.3, 2.3); phoneAtEar(g, P); g.restore(); }
    caption(g, e, '● Achan calling…', 300, seg(t, HT.ring, HT.ring + .2) * (1 - seg(t, HT.ring + 2.8, HT.ring + 3)), { col: '#7af0a0' });
    return { post: { expo: 1.06, tint: [1.05, .95, .88] } };
  },
  laptop(t, g, e) {
    const [a, b] = range('laptop'), drop = t >= HT.drop, z = lerp(1, 1.18, ss(seg(t, a, HT.silence))) + seg(t, HT.drop, HT.drop + .2) * .08;
    show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'lap2', W / 2, 980, 780, (x, w, h) => {
      x.fillStyle = '#0a0f0c'; x.fillRect(0, 0, w, h); x.textAlign = 'left'; x.fillStyle = '#3aee8a'; x.font = `700 ${w * .07}px ${UI}`; x.fillText('Balance  +£3,940', w * .06, h * .14);
      const rv = clamp(.45 + seg(t, a, HT.silence) * .6), red = drop ? eo(seg(t, HT.drop, HT.drop + .25)) : 0;
      chart(x, 24, h * .2, w - 48, h * .74, { n: 30, seed: 21, bias: .016, reveal: rv * .93 });
      if (red) { const cw = (w - 48) / 30, cx = 24 + cw * 28.4; x.fillStyle = '#ff2a1e'; x.fillRect(cx - cw * .45, h * .22, cw * .9, h * .72 * red); x.fillStyle = `rgba(255,30,20,${.3 * red})`; x.fillRect(0, 0, w, h);
        x.fillStyle = '#ff3a2a'; x.fillRect(w * .05, h * .05, w * .62, h * .12); x.fillStyle = '#fff'; x.fillText('Balance  −£2,180', w * .06, h * .14); }
    }));
    // the impact: two inverted frames, then the red floods in
    if (t >= HT.drop && t < HT.drop + 2 / 24) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); g.restore(); speedLines(g, 1, { type: 'radial', cx: W / 2, cy: 980, col: '#000000', n: 120, a: .8 }); }
    if (t > HT.drop + .4) { const f = seg(t, HT.drop + .4, b); g.save(); g.globalAlpha = f * .85; vgrad(g, 0, 0, W, H, [[0, '#5a0408'], [1, '#2a0204']]); g.restore(); candle(g, e, W / 2, 1300, 700 * eo(f), 170, 'red', { ga: .9 * f }); }
    return { post: { expo: 1.03, track: t >= HT.drop && t < HT.drop + .35 ? 1 : 0 }, sub: {} };
  },
  ep2(t, g, e) {
    vgrad(g, 0, 0, W, H, [[0, '#2a0406'], [1, '#0e0102']]); airbrush(g, W / 2, 900, 700, 600, '#6a0a10', .5, 1);
    if (t > HT.ep2) { const n = Math.min(8, Math.floor((t - HT.ep2) * 12)); chrome(g, e, 'THE FALL'.slice(0, n), W / 2, 960, 160, { cols: [[0, '#ffd8c8'], [.46, '#ffffff'], [.5, '#4a0610'], [.7, '#c81e2a'], [.9, '#ff6a3a'], [1, '#ffd08a']], neon: '#ff2a3a' });
      g.save(); g.font = 'italic 800 64px Kanit'; g.textAlign = 'center'; g.fillStyle = '#f4e4c8'; g.fillText('Episode 2', W / 2, 760); g.restore(); }
    caption(g, e, 'Next · Episode 2', 1240, seg(t, HT.ep2 + .9, HT.ep2 + 1.2), { size: 40 });
    return { post: { expo: 1.05 }, sub: { hide: true } };
  },
  brand(t, g, e) { return brandCard(t, g, e, HT.brand); },
};

export function brandCard(t, g, e, t0) {
  vgrad(g, 0, 0, W, H, [[0, '#06100a'], [1, '#020604']]); airbrush(g, W / 2, 820, 600, 600, '#0a3a1c', .6, 1);
  const k = eo(seg(t, t0, t0 + .8)); candle(g, e, W / 2, 900, 360 * st(k, 12), 120, 'green', { ears: k > .95, wick: 70, wick2: 60 });
  if (t > t0 + .6) { const n = Math.min(11, Math.floor((t - t0 - .6) * 14)); chrome(g, e, 'MeowXTrader'.slice(0, n), W / 2, 1190, 128, { cols: [[0, '#c8ffd8'], [.46, '#ffffff'], [.5, '#0a3a1c'], [.7, '#2fc06a'], [.9, '#b8ff6a'], [1, '#ffe08a']], neon: '#2aff7a' }); }
  if (t > t0 + 1.3) { g.save(); g.globalAlpha = seg(t, t0 + 1.3, t0 + 1.7); g.font = '600 50px "Barlow SC"'; g.textAlign = 'center'; g.fillStyle = '#9af0b8'; g.letterSpacing = '6px'; g.fillText('TRADE WITH RULES', W / 2, 1290); g.restore(); }
  if (t > t0 + 1.6) { g.save(); g.globalAlpha = seg(t, t0 + 1.6, t0 + 2); g.font = '600 34px "Barlow SC"'; g.textAlign = 'center'; g.fillStyle = '#c8d8c8'; g.fillText('A story about discipline. Not financial advice.', W / 2, 1520); g.restore(); }
  return { post: { expo: 1.05 }, sub: { hide: true } };
}

export function frame(t, g, e) {
  const i = K.TL.shotAt(t), id = K.TL.SHOTS[i][0];
  const r = SH[id](t, g, e) || {};
  if (id !== 'cold') mark(g, e);
  return r;
}
