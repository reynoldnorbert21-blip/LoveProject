// Red Candle · Episode 3 "The Grind" — 80s cel anime.
import { K, init, W, H, plate, show, inCam, bust, rect, glow, grime, win, screen, chrome, caption, mark, clamp, lerp, ss, eo, seg, st, U, range, talk, blink,
  cel, poly, line, airbrush, vgrad, rgba, mix, hash, rng, TAU, pal, LWK } from '../kit.js';
import { chart, notif, clock, chat, spinner, UI } from '../ui.js';
import { bigPhone, laptop, watchInsert, candle, mug, steam } from '../props.js';
import { rain, speedLines, flare } from '../engine/fx.js';
import { brandCard } from '../ep1/shots.js';

let A = {}, HT, LT;
const GREEN = { cols: [[0, '#c8ffd8'], [.46, '#ffffff'], [.5, '#0a3a1c'], [.7, '#2fc06a'], [.9, '#b8ff6a'], [1, '#ffe08a']], neon: '#2aff7a' };
const RED = { cols: [[0, '#ffd8c8'], [.46, '#ffffff'], [.5, '#4a0610'], [.7, '#c81e2a'], [.9, '#ff6a3a'], [1, '#ffd08a']], neon: '#ff2a3a' };

export async function setup({ TL, ENV }) {
  init(TL, ENV); HT = K.HIT; LT = K.LT;
  A.wh = plate(W * 1.4, H, (g, e, w) => {                // warehouse at night: racks, sodium lamps, boxes
    vgrad(g, 0, 0, w, H, [[0, '#1a1410'], [.6, '#3a2a1a'], [1, '#141008']]);
    for (let i = 0; i < 6; i++) { const x = i * 260 + 40; line(g, [[x, 200], [x, 1500]], '#5a4a2a', 14); for (let r = 0; r < 5; r++) { const y = 300 + r * 240; line(g, [[x, y], [x + 230, y]], '#7a5a2a', 10);
      for (let b = 0; b < 3; b++) rect(g, x + 10 + b * 72, y - 90 - (hash(i * 9 + r * 3 + b) * 40 | 0), 64, 90 + (hash(i * 9 + r * 3 + b) * 40 | 0), { f: '#b8864a', s: '#7a5428', so: [-8, -4], h: '#e0b070', ho: [4, 3], l: '#3a2408', lw: 2 }); } }
    for (let i = 0; i < 5; i++) glow(g, e, 140 + i * 300, 120, 300, '#ffb050', .35, .5);
    rect(g, 0, 1500, w, 420, { f: '#4a4038', l: '#14100c', lw: 3 }); for (let i = 0; i < 12; i++) { g.fillStyle = '#e8c030'; g.fillRect(i * 130, 1600, 70, 14); }
  });
  A.room = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#0c0e1c'], [.6, '#161a2e'], [1, '#0a0a14']]); win(g, e, 640, 160, 360, 520, 'rain', { frame: '#1a1c2a', seed: 3 }); rect(g, 0, 1380, W, 540, { f: '#1c1a26', s: '#0e0d14', so: [0, -30], l: '#06060a', lw: 3 }); grime(g, 0, 0, W, 1380, 4, '#000000', .12); });
  A.cls = plate(W, H, (g, e) => {                       // MeowXTrader Academy classroom
    vgrad(g, 0, 0, W, H, [[0, '#e8e0d0'], [1, '#b8a888']]);
    rect(g, 70, 150, 940, 560, { f: '#f8f8f4', s: '#d0d0c8', so: [-10, -10], l: '#4a4a44', lw: 6 }); rect(g, 70, 710, 940, 24, { f: '#8a8a84', l: '#3a3a34', lw: 2 });
    g.fillStyle = '#1a5a3a'; g.font = '700 54px "Barlow SC"'; g.textAlign = 'center'; g.fillText('MeowXTrader Academy', 540, 240);
    g.fillStyle = '#d0201a'; g.font = 'italic 900 210px Kanit'; g.fillText('RISK 1%', 540, 500);
    g.strokeStyle = '#1a3a8a'; g.lineWidth = 6; g.beginPath(); g.moveTo(200, 560); g.lineTo(880, 560); g.stroke(); g.fillStyle = '#1a3a8a'; g.font = '600 40px "Barlow SC"'; g.fillText('control risk · not the market', 540, 640);
    glow(g, e, 540, 100, 700, '#fff4d8', .2, .25);
    rect(g, 0, 1300, W, 620, { f: '#8a6a48', l: '#2a1a0a', lw: 3 });
  });
  A.bed = plate(W, H, (g, e) => {                       // bedroom floor at night, against the bed
    vgrad(g, 0, 0, W, H, [[0, '#0c1024'], [1, '#1a1e38']]); win(g, e, 120, 180, 360, 480, 'night', { frame: '#1a1c2a', seed: 63 });
    airbrush(g, 300, 420, 300, 300, '#5a7aff', .15, 1); rect(g, 520, 900, 700, 420, { f: '#3a3e5a', s: '#24263a', so: [0, -30], l: '#0a0a14', lw: 3 });
    rect(g, 0, 1300, W, 620, { f: '#24202e', l: '#08060c', lw: 3 });
  });
  A.wall = plate(W, H, (g, e) => {                      // every trade printed and pinned to the wall
    vgrad(g, 0, 0, W, H, [[0, '#4a3e30'], [1, '#2a2218']]); glow(g, e, 540, 200, 700, '#ffc070', .3, .2);
    const R = rng(71); for (let i = 0; i < 9; i++) { const x = 60 + (i % 3) * 330, y = 150 + Math.floor(i / 3) * 400; g.save(); g.translate(x + 140, y + 170); g.rotate((R() - .5) * .12);
      cel(g, poly([[-140, -170], [140, -170], [140, 170], [-140, 170]]), { f: '#f2ede0', s: '#c8c0ac', so: [-6, -6], l: '#5a5444', lw: 2 }); for (let k = 0; k < 8; k++) { g.fillStyle = '#9a9488'; g.fillRect(-110, -130 + k * 34, 140 + R() * 80, 10); }
      g.fillStyle = '#c81e14'; g.beginPath(); g.arc(0, -160, 10, 0, TAU); g.fill(); g.restore(); }
  });
  A.desk = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#1a120a'], [1, '#0a0604']]); airbrush(g, 540, 700, 800, 700, '#ffb060', .35, 1); airbrush(e, 540, 500, 500, 400, '#ffb060', .25, 1); rect(g, -20, 300, W + 40, 1700, { f: '#6a4628', s: '#4a2e18', so: [0, -40], l: '#1a0e06', lw: 3 }); });
  A.study = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#2a2a3a'], [1, '#14141e']]); rect(g, 0, 1360, W, 560, { f: '#5a4030', l: '#1a0e06', lw: 3 }); });
  A.rainwin = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#101830'], [1, '#1c2440']]); const R = rng(11); for (let i = 0; i < 40; i++) { const x = R() * W, y = R() * H * .7, r = 20 + R() * 70, c = ['#ffcf7a', '#7ac8ff', '#3aee8a'][i % 3]; airbrush(g, x, y, r, r, c, .35, 1); airbrush(e, x, y, r, r, c, .3, 1); } });
  A.flat = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#e8dcc4'], [1, '#b8a280']]); win(g, e, 620, 200, 380, 520, 'day', { frame: '#8a7a64', seed: 81 }); rect(g, 0, 1400, W, 520, { f: '#8a6a48', l: '#2a1a0a', lw: 3 }); });
  A.arr = plate(W, H, (g, e) => {                       // Kochi airport arrivals, morning sun, palms through the glass
    vgrad(g, 0, 0, W, H, [[0, '#ffe8b8'], [.5, '#f0c888'], [1, '#a8784a']]);
    for (let i = 0; i < 5; i++) { const x = i * 240 - 40; g.fillStyle = rgba('#ffffff', .25); g.fillRect(x, 0, 200, 900); line(g, [[x + 220, 0], [x + 220, 900]], '#8a6a4a', 10); }
    for (const [x, s] of [[150, 1], [520, .8], [880, 1.1]]) { line(g, [[x, 900], [x + 20 * s, 380 * s + 200]], '#6a4a2a', 18 * s); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .5; cel(g, [[x + 20 * s, 380 * s + 200], [x + 20 * s + Math.cos(a) * 200 * s, 380 * s + 200 + Math.sin(a) * 120 * s + 80 * s], [x + 20 * s + Math.cos(a) * 120 * s, 380 * s + 230 + Math.sin(a) * 60 * s]], { f: '#3a8a3a', s: '#2a6a2a', l: '#0e3a0e', lw: 2 }); } }
    rect(g, 80, 80, 520, 110, { f: '#1a2a4a', l: '#0a0c18', lw: 4 }); g.fillStyle = '#ffd27a'; g.font = '700 70px "Barlow SC"'; g.textAlign = 'left'; g.fillText('ARRIVALS', 120, 160); e.fillStyle = rgba('#ffd27a', .5); e.font = g.font; e.fillText('ARRIVALS', 120, 160);
    glow(g, e, 900, 200, 600, '#fff0c0', .4, .5);
    rect(g, 0, 1350, W, 570, { f: '#c8b498', l: '#4a3a2a', lw: 3 });
  });
  A.ver = plate(W, H, (g, e) => {                       // Kerala veranda at night in the monsoon, a tube light, wet coconut palms
    vgrad(g, 0, 0, W, H, [[0, '#0a1420'], [.6, '#14283a'], [1, '#0a1018']]);
    for (const [x, s] of [[200, 1.2], [760, 1], [1000, .8]]) { line(g, [[x, 1300], [x + 30 * s, 300]], '#1a2a24', 22 * s); for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k - 3.5) * .45; cel(g, [[x + 30 * s, 300], [x + 30 * s + Math.cos(a) * 260 * s, 300 + Math.sin(a) * 150 * s + 120 * s], [x + 30 * s + Math.cos(a) * 160 * s, 340 + Math.sin(a) * 70 * s]], { f: '#1a3a2a', s: '#0e2418', l: '#04100a', lw: 2 }); } }
    rect(g, 0, 0, W, 140, { f: '#5a3a22', s: '#3a2412', so: [0, 20], l: '#1a0c04', lw: 3 }); for (const x of [60, 1000]) rect(g, x, 140, 50, 1300, { f: '#e8dcc0', s: '#a89c80', so: [-12, 0], l: '#4a4030', lw: 3 });
    rect(g, 420, 170, 240, 22, { f: '#f4fff8', l: '#5a6a62', lw: 2 }); glow(g, e, 540, 200, 500, '#e8fff0', .35, .5);
    rect(g, 0, 1400, W, 520, { f: '#8a3a22', s: '#5a2212', so: [0, -30], l: '#2a0c04', lw: 3 }); rect(g, 0, 1380, W, 40, { f: '#e8dcc0', l: '#4a4030', lw: 2 });
  });
  A.palms = plate(W, H, (g, e) => {                     // the last image: Kerala night, palms, the rain
    vgrad(g, 0, 0, W, H, [[0, '#020812'], [.6, '#0a1a2a'], [1, '#04080e']]);
    for (const [x, s] of [[120, 1.3], [520, .9], [960, 1.2]]) { line(g, [[x, 1920], [x + 40 * s, 520]], '#0e1a16', 26 * s); for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k - 3.5) * .45; cel(g, [[x + 40 * s, 520], [x + 40 * s + Math.cos(a) * 280 * s, 520 + Math.sin(a) * 160 * s + 130 * s], [x + 40 * s + Math.cos(a) * 170 * s, 560 + Math.sin(a) * 80 * s]], { f: '#0e2418', l: '#020806', lw: 2 }); } }
  });
  return { phone: ['c08', 'c19'] };
}

function phoneShot(g, e, key, light, fn, o = {}) {
  show(g, e, o.bg || A.room, { z: 1.4, y: 900 }); g.save(); g.fillStyle = rgba('#000000', .35); g.fillRect(0, 0, W, H); g.restore();
  const pw = o.w ?? 600, py = o.y ?? 900, x0 = W / 2 - pw / 2, x1 = W / 2 + pw / 2;
  bigPhone(g, e, key, W / 2, py, pw, fn, { rot: o.rot ?? -.03, glow: o.glow ?? .32 });
  const P = pal(o.who || 'nik', light), sk = P.skin;
  for (let i = 0; i < 4; i++) { const f = new Path2D(); f.roundRect(x0 - 40, py - 120 + i * 84, 66, 66, 28); cel(g, f, { f: sk.f, s: sk.s, so: [6, -6], h: sk.h, ho: [-3, 3], l: sk.l, lw: 2.4 }); }
  const th = new Path2D(); th.roundRect(x1 - 30, py + 60, 64, 150, 30); cel(g, th, { f: sk.f, s: sk.s, so: [-6, -6], h: sk.h, ho: [3, 3], l: sk.l, lw: 2.4 });
}
function ink(x, s, X, Y, c, font, col) { if (c <= 0) return; x.font = font; x.fillStyle = col; x.textAlign = 'left'; x.fillText(s.slice(0, Math.max(0, Math.floor(c))), X, Y); }

const SH = {
  title(t, g, e) {
    vgrad(g, 0, 0, W, H, [[0, '#04140a'], [1, '#010603']]); airbrush(g, W / 2, 900, 700, 600, '#0a3a1c', .5, 1);
    if (t > HT.presents && t < HT.title + 1.6) { g.save(); g.globalAlpha = seg(t, HT.presents, HT.presents + .4); g.font = '500 40px "Cormorant SC"'; g.letterSpacing = '8px'; g.textAlign = 'center'; g.fillStyle = '#e4f4e8'; g.fillText('MeowXTrader presents', W / 2, 560); g.restore(); }
    if (t > HT.title) { const n = Math.min(9, Math.floor((t - HT.title) * 12)); g.save(); g.font = 'italic 800 64px Kanit'; g.textAlign = 'center'; g.fillStyle = '#e4f4e8'; g.fillText('Episode 3', W / 2, 820); g.restore(); chrome(g, e, 'THE GRIND'.slice(0, n), W / 2, 1010, 160, GREEN); }
    caption(g, e, '8 months later', 1660, seg(t, HT.months, HT.months + .3), { size: 46, col: '#7af0a0' });
    return { post: { expo: 1.05 }, sub: { hide: true } };
  },
  warehouse(t, g, e) {
    const u = U('warehouse', t), tt = st(t), cam = { x: lerp(560, A.wh.w - 560, u), y: H / 2, z: 1 }; show(g, e, A.wh, cam);
    if (t < 6 + 1.5) caption(g, e, '8 months later', 1660, 1 - seg(t, 7.2, 7.5), { size: 46, col: '#7af0a0' });
    const P = bust(g, e, 'nikHivis', 'warm', 480, 1020, 2.3, { expr: 'tired', look: [.8, .3], blink: blink(tt, 2), light: [.6, -1] });
    // handheld scanner + its red beam on each beep
    g.save(); g.translate(820, 1300); g.rotate(-.5); rect(g, -40, -90, 80, 180, { f: '#e8c030', s: '#a8841a', so: [-8, 0], l: '#3a2a04', lw: 3 }); rect(g, -30, -80, 60, 50, { f: '#1a1a20', l: '#050508', lw: 2 }); g.restore();
    for (const b of [HT.beep1, HT.beep2]) { const k = seg(t, b, b + .35); if (k > 0 && k < 1) { g.save(); g.strokeStyle = rgba('#ff2a1e', Math.sin(k * Math.PI)); g.lineWidth = 6; g.beginPath(); g.moveTo(780, 1220); g.lineTo(1080, 760); g.stroke(); g.restore(); e.save(); e.strokeStyle = rgba('#ff2a1e', Math.sin(k * Math.PI)); e.lineWidth = 14; e.beginPath(); e.moveTo(780, 1220); e.lineTo(1080, 760); e.stroke(); e.restore(); } }
    return { post: { expo: 1.03, tint: [1.04, .96, .88] } };
  },
  lunch(t, g, e) {
    const [a] = range('lunch');
    phoneShot(g, e, 'ad', 'warm', (x, w, h) => {
      x.fillStyle = '#0c0c10'; x.fillRect(0, 0, w, h); x.fillStyle = '#1e3a5a'; x.fillRect(0, h * .12, w, h * .26); x.textAlign = 'center';
      x.fillStyle = '#e8eef4'; x.font = `700 ${w * .11}px ${UI}`; x.fillText('Trade our capital', w / 2, h * .25); x.fillStyle = '#ffd27a'; x.font = `italic 600 ${w * .065}px ${UI}`; x.fillText('Funded account · $100K', w / 2, h * .31);
      x.fillStyle = '#ff3a2a'; x.fillRect(0, h * .38, w * clamp((t - a) / 6), 8);
      x.fillStyle = '#e8eef4'; x.textAlign = 'left'; x.font = `700 ${w * .065}px ${UI}`; x.fillText('Pass the challenge. Keep 80%.', w * .05, h * .46); x.fillStyle = '#8a96a8'; x.font = `600 ${w * .05}px ${UI}`; x.fillText('1.2M views', w * .05, h * .51);
      chart(x, w * .05, h * .58, w * .9, h * .36, { n: 16, seed: 5, bias: .03 });
    }, { bg: A.wh, who: 'nikHivis' });
    return { post: { expo: 1.03 } };
  },
  class(t, g, e) {
    const tt = st(t), back = t > 36.4;
    if (!back) { const u = seg(t, 27.57, 36.4), cam = { x: 540, y: lerp(820, 900, u), z: lerp(1, 1.06, u) }; show(g, e, A.cls, cam);
      inCam(g, cam, A.cls, g2 => bust(g2, null, 'mentor', 'day', 260, 1060, 2.0, { expr: talk(t, 'mentor') ? 'talk' : 'hard', mouth: talk(t, 'mentor') || 'set', look: [.6, .1], blink: blink(tt, 4), light: [1, -.8] }));
      return { post: { expo: 1.05 } }; }
    show(g, e, A.cls, { z: 1.25, y: 700, x: 540 }); g.save(); g.fillStyle = rgba('#000000', .15); g.fillRect(0, 0, W, H); g.restore();
    bust(g, e, 'nikGreen', 'day', 520, 1080, 2.4, { expr: 'neutral', look: [.5, .9], blink: blink(tt, 7), light: [1, -.8] });
    g.save(); g.translate(560, 1560); g.rotate(-.06); cel(g, poly([[-300, -120], [300, -120], [300, 200], [-300, 200]]), { f: '#f2ead2', s: '#d0c4a4', so: [-8, -8], l: '#5a4a2a', lw: 3 });
    g.fillStyle = '#1e2a6a'; g.font = `italic 700 56px ${UI}`; g.textAlign = 'left'; g.fillText('Risk 1%'.slice(0, Math.floor((t - 36.4) * 6)), -240, -20); g.restore();
    return { post: { expo: 1.04 } };
  },
  breach(t, g, e) {
    const n = clamp(Math.floor((t - HT.breach) / .4) + 1, 0, 7), pulse = 1 - seg((t - HT.breach) % .4, 0, .2), z = 1.1 + pulse * .02 * (n > 0);
    show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'br', W / 2, 980, 780, (x, w, h) => {
      x.fillStyle = '#f4f4f2'; x.fillRect(0, 0, w, h); x.textAlign = 'left'; x.fillStyle = '#16161a'; x.font = `700 ${w * .06}px ${UI}`; x.fillText('Inbox', w * .04, h * .12);
      for (let i = 0; i < n; i++) { const y = h * .16 + i * h * .095; x.fillStyle = i === 0 ? '#ffe0da' : '#ffffff'; x.fillRect(w * .02, y, w * .96, h * .085); x.fillStyle = '#c81e14'; x.font = `700 ${w * .042}px ${UI}`; x.fillText(`Account Breached · Challenge #${n - i}`, w * .05, y + h * .06); }
      if (n > 0) { x.fillStyle = '#1a4aa8'; x.beginPath(); x.roundRect(w * .66, h * .86, w * .3, h * .11, 14); x.fill(); x.fillStyle = '#fff'; x.font = `700 ${w * .05}px ${UI}`; x.fillText('Buy again', w * .7, h * .94); } }, { glow: .3 }));
    return { post: { expo: 1.02 } };
  },
  floor(t, g, e) {
    const u = U('floor', t), tt = st(t); show(g, e, A.bed, { z: lerp(1, 1.18, ss(u)), y: lerp(1000, 960, u) });
    bust(g, e, 'nikBroken', 'night', 520, 1000, 2.4, { expr: u < .4 ? 'tired' : 'cry', E: { mouth: u < .4 ? 'closed' : 'frown' }, look: [.5, .7], blink: blink(tt, 5), tear: seg(u, .35, 1), ph: tt, light: [-1, -.4], rim: '#7a9aff' });
    bigPhone(g, e, 'vn', 790, 1390, 230, (x, w, h) => { x.fillStyle = '#0c1014'; x.fillRect(0, 0, w, h); x.fillStyle = '#e8eef0'; x.font = `700 ${w * .13}px ${UI}`; x.textAlign = 'center'; x.fillText('Amma', w / 2, h * .2);
      x.fillStyle = '#7ab8ff'; for (let i = 0; i < 12; i++) { const hh = 12 + 60 * Math.abs(Math.sin(st(t, 12) * 9 + i)); x.fillRect(w * .08 + i * w * .07, h * .5 - hh / 2, w * .04, hh); }
      x.fillStyle = '#3ad27a'; x.beginPath(); x.arc(w / 2, h * .8, w * .1, 0, TAU); x.fill(); }, { rot: .35, glow: .5 });
    return { post: { expo: 1.0, tint: [.93, .96, 1.06], lift: .05 } };
  },
  audit(t, g, e) {
    const [a] = range('audit'), u = U('audit', t), tt = st(t), cam = { z: lerp(1, 1.08, u), y: lerp(1000, 920, u) }; show(g, e, A.wall, cam);
    inCam(g, cam, A.wall, g2 => { g2.font = `italic 700 54px ${UI}`; g2.fillStyle = '#d01a14';
      [['no stop loss', 80, 330], ['revenge', 470, 300], ['5% risk', 120, 760], ['all-in', 760, 720], ['no plan', 420, 1150]].forEach(([s, X, Y], i) => { if (t > a + .6 + i * .5) { g2.save(); g2.translate(X, Y); g2.rotate(-.08 + i * .04); g2.fillStyle = rgba('#ff3a5a', .4); g2.fillRect(-10, -50, s.length * 30, 60); g2.fillStyle = '#d01a14'; g2.fillText(s, 0, 0); g2.restore(); } }); });
    bust(g, e, 'nikBroken', 'warm', 300, 1480, 2.0, { expr: 'hard', E: { mouth: 'closed', lid: .25 }, look: [.8, -.4], blink: blink(tt, 4), light: [1, -1] });
    return { post: { expo: 1.04, tint: [1.03, .97, .9] } };
  },
  rules(t, g, e) {
    const [a] = range('rules'), u = U('rules', t), cam = { z: lerp(1.3, 1.12, u), y: lerp(560, 960, ss(u)) }; show(g, e, A.desk, cam);
    inCam(g, cam, A.desk, g2 => { g2.save(); g2.translate(540, 960); g2.rotate(-.03); cel(g2, poly([[-470, -620], [470, -620], [470, 620], [-470, 620]]), { f: '#f2ead2', s: '#d0c4a4', so: [-10, -10], l: '#5a4a2a', lw: 3 });
      for (let y = -560; y < 620; y += 70) { g2.strokeStyle = rgba('#7a9ad8', .4); g2.lineWidth = 2; g2.beginPath(); g2.moveTo(-450, y); g2.lineTo(450, y); g2.stroke(); }
      const R = [['Rule 1: Never trade money', 1], ["you can't afford to lose.", 0], ["Never trade someone else's money.", 0], ['Rule 2: Risk 1% per trade.', 1], ['Rule 3: Follow the system,', 1], ['not feelings.', 0], ['Rule 4: No revenge trades.', 1]];
      let c = (t - a) * 42; R.forEach(([s, hd], i) => { ink(g2, s, -420, -470 + i * 140, c, `italic ${hd ? 700 : 600} ${hd ? 60 : 54}px ${UI}`, hd ? '#1e2a6a' : '#2a3a7a'); c -= s.length; }); g2.restore(); });
    return { post: { expo: 1.04, tint: [1.04, .96, .88] } };
  },
  seasons(t, g, e) {   // THE COMEBACK — lands on the drop
    const [a, b] = range('seasons'), u = U('seasons', t), tt = st(t), s = u * 3, k = Math.floor(s);
    show(g, e, A.study, { z: 1 });
    win(g, e, 560, 160, 440, 600, ['autumn', 'snow', 'spring'][Math.min(2, k)], { frame: '#3a3448', seed: 90 + Math.floor(t * 6) % 3 });
    const cal = ['OCT', 'JAN', 'APR'][Math.min(2, k)]; rect(g, 120, 220, 220, 260, { f: '#f2ead6', l: '#4a4030', lw: 3 }); rect(g, 120, 220, 220, 70, { f: '#2fc06a', l: '#0a3a1c', lw: 2 }); g.fillStyle = '#1a1a1a'; g.font = '700 80px "Barlow SC"'; g.textAlign = 'center'; g.fillText(cal, 230, 420);
    rect(g, 560, 860, 480, 330, { f: '#1c1c24', l: '#06060a', lw: 4 });
    screen(g, e, 'sz', 576, 876, 448, 298, (x, w, h) => { x.fillStyle = '#0a0f0c'; x.fillRect(0, 0, w, h); chart(x, 10, 20, w - 20, h - 40, { n: 30, seed: 3, bias: .006, reveal: .3 + u * .7 }); x.fillStyle = '#3aee8a'; x.font = `700 ${w * .07}px ${UI}`; x.textAlign = 'left'; x.fillText(`Risk 1% · Day ${Math.floor(1 + u * 180)}`, 14, 34); }, { glow: .5 });
    bust(g, e, 'nikGreen', 'cool', 360, 1080, 2.5, { expr: 'hard', look: [.8, .2], blink: blink(tt, 3), light: [1, -.6], rim: '#3aee8a', reflect: '#3aee8a' });
    // light band sweeping across the held cel
    const sw = ((t - a) * .6) % 1; g.save(); g.globalCompositeOperation = 'overlay'; g.fillStyle = rgba('#ffffff', .25); g.beginPath(); g.moveTo(-400 + sw * 2000, 0); g.lineTo(-200 + sw * 2000, 0); g.lineTo(-600 + sw * 2000, H); g.lineTo(-800 + sw * 2000, H); g.fill(); g.restore();
    if (t < a + 1.4) speedLines(g, Math.floor(t * 12), { type: 'radial', cx: 440, cy: 900, col: '#ffffff', n: 110, a: .6 * (1 - seg(t, a + .6, a + 1.4)) });
    if (t < a + 2 / 24) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore(); }
    else if (t < a + .25) { g.save(); g.fillStyle = rgba('#ffffff', 1 - seg(t, a + 2 / 24, a + .25)); g.fillRect(0, 0, W, H); g.restore(); }
    return { post: { expo: 1.05, sat: 1.08 } };
  },
  payout(t, g, e) {
    const u = U('payout', t), ok = t > HT.approved, z = lerp(1.06, 1.22, ss(u)); show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'po', W / 2, 980, 780, (x, w, h) => {
      x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h); x.fillStyle = '#7fa8e8'; x.font = `600 ${w * .07}px ${UI}`; x.textAlign = 'left'; x.fillText('03:00', w * .06, h * .14);
      x.textAlign = 'center'; x.fillStyle = '#e8eefc'; x.font = `700 ${w * .14}px ${UI}`; x.fillText('Payout', w / 2, h * .46);
      x.fillStyle = ok ? '#3aee8a' : '#ffd27a'; x.font = `italic 700 ${w * (ok ? .14 : .11)}px ${UI}`; x.fillText(ok ? 'Approved' : 'Processing', w / 2, h * .64); if (!ok) spinner(x, w / 2, h * .8, w * .06, t); }, { glow: ok ? .55 : .35 }));
    if (ok && t < HT.approved + .3) { g.save(); g.fillStyle = rgba('#ffffff', 1 - seg(t, HT.approved, HT.approved + .3)); g.fillRect(0, 0, W, H); g.restore(); }
    if (ok) flare(e, W / 2 + 260, 900, .9 * (1 - seg(t, HT.approved + .3, HT.approved + 1.4)), '#9affc8');
    return { post: { expo: 1.04, tint: [.96, 1.02, 1.0] } };
  },
  payface(t, g, e) {
    const u = U('payface', t), tt = st(t); show(g, e, A.rainwin, { z: 1 + u * .05 });
    LWK.k = .6; bust(g, e, 'nikGreen', 'screen', W / 2, 900, 4.3, { expr: u < .35 ? 'neutral' : u < .7 ? 'cry' : 'smile', E: u >= .35 && u < .7 ? { mouth: 'smile' } : {}, look: [0, .2], blink: blink(tt, 3), tear: seg(u, .3, .9), ph: tt, light: [0, .6], rim: '#3aee8a', reflect: '#3aee8a' }); LWK.k = 1;
    return { post: { expo: 1.04, tint: [.95, 1.02, 1.0] } };
  },
  repay(t, g, e) {
    phoneShot(g, e, 'rp', 'day', (x, w, h) => { x.fillStyle = '#14100c'; x.fillRect(0, 0, w, h); x.fillStyle = '#f0e0c0'; x.textAlign = 'center'; x.font = `600 ${w * .22}px ${UI}`; x.fillText('09:12', w / 2, h * .25);
      notif(x, w, h * .32, 'Bank · Payment received', 'Nikhil sent you £5,000', eo(seg(t, HT.sent, HT.sent + .3))); }, { bg: A.flat, who: 'anoop' });
    return { post: { expo: 1.05 } };
  },
  anoop(t, g, e) {
    const u = U('anoop', t), tt = st(t); show(g, e, A.flat, { z: lerp(1.1, 1.3, ss(u)), y: 900 });
    bust(g, e, 'anoop', 'day', 420, 860, lerp(2.3, 2.6, u), { expr: u < .4 ? 'sad' : 'cry', E: { mouth: 'frown' }, look: [.7, .9], blink: blink(tt, 2), tear: seg(u, .4, 1), ph: tt, light: [1, -.6] });
    bigPhone(g, e, 'an', 760, 1300, 360, (x, w, h) => { x.fillStyle = '#0e1418'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.fillStyle = '#e8eef0'; x.font = `700 ${w * .1}px ${UI}`; x.fillText('Nikhil', w / 2, h * .09);
      x.fillStyle = '#26323a'; x.beginPath(); x.roundRect(w * .06, h * .16, w * .88, h * .12, 14); x.fill(); x.fillStyle = '#9ad8b0'; x.font = `700 ${w * .08}px ${UI}`; x.fillText('Sent you £5,000', w / 2, h * .24);
      const k = clamp((t - HT.typed) / .9); if (k > 0) { x.fillStyle = '#1e5a3c'; x.beginPath(); x.roundRect(w * .14, h * .78, w * .8, h * .1, 14); x.fill(); x.fillStyle = '#fff'; x.font = `600 ${w * .09}px ${UI}`; x.fillText('Sorry da.'.slice(0, Math.ceil(k * 9)), w * .54, h * .85); } }, { rot: .1, glow: .35 });
    return { post: { expo: 1.04 } };
  },
  arrivals(t, g, e) {
    const [a, b] = range('arrivals'), tt = st(t), c = id => LT[id];
    const fin = t > c('c18') + 3.9, sh = t < c('c15') - .2 ? 'hug' : t < c('c16') - .2 ? 'amma' : t < c('c17') - .2 ? 'nik16' : t < c('c18') - .2 ? 'achan' : !fin ? 'nik18' : 'wide';
    if (sh === 'hug' || sh === 'wide') {
      const u = seg(t, sh === 'hug' ? a : c('c18') + 3.9, sh === 'hug' ? c('c15') : b), cam = { x: 540, y: lerp(980, 940, u), z: lerp(1, 1.08, u) }; show(g, e, A.arr, cam);
      inCam(g, cam, A.arr, g2 => { bust(g2, null, 'amma', 'warm', 230, 1000, 1.8, { expr: 'cry', E: { mouth: 'smileopen' }, look: [.7, 0], blink: blink(tt, 3), tear: .8, ph: tt, light: [1, -.8] });
        bust(g2, null, 'achan', 'warm', 860, 960, 1.85, { mirror: true, expr: 'smile', look: [.7, .1], blink: blink(tt, 5), tear: .4, ph: tt, light: [-1, -.8] });
        bust(g2, null, 'nikGreen', 'warm', 540, 1080, 2.0, { expr: 'grin', look: [-.3, 0], blink: blink(tt, 1), tear: .5, ph: tt, light: [0, -1] }); });
      caption(g, e, 'Kochi · home', 300, sh === 'hug' ? seg(t, a + .2, a + .5) * (1 - seg(t, a + 2.8, a + 3.1)) : 0);
      return { post: { expo: 1.07, sat: 1.08, tint: [1.04, .98, .9] } };
    }
    if (sh === 'amma') { show(g, e, A.arr, { z: 1.4, x: 360, y: 860 }); bust(g, e, 'amma', 'warm', 480, 980, 3.0, { expr: 'cry', E: { mouth: 'smile' }, mouth: talk(t, 'amma') || undefined, look: [.7, 0], blink: blink(tt, 3), tear: 1, ph: tt, light: [1, -.8] }); }
    else if (sh === 'achan') { show(g, e, A.arr, { z: 1.4, x: 760, y: 860 }); bust(g, e, 'achan', 'warm', 600, 980, 3.0, { mirror: true, expr: 'warm', mouth: talk(t, 'achan') || undefined, look: [.6, .1], blink: blink(tt, 5), tear: .3, ph: tt, light: [-1, -.8] }); }
    else {
      show(g, e, A.arr, { z: 1.4, x: 540, y: 860 });
      bust(g, e, 'nikGreen', 'warm', 540, 980, 3.0, { expr: sh === 'nik16' ? 'grin' : 'warm', mouth: talk(t, 'nik') || undefined, look: [-.4, 0], blink: blink(tt, 1), tear: .6, ph: tt, light: [0, -1] });
      if (sh === 'nik18' && t > c('c18') + 1.6) { const k = seg(t, c('c18') + 1.6, c('c18') + 2.4); watchInsert(g, e, W / 2, lerp(2300, 1500, eo(k)), 1.0, t, { who: 'nikGreen', light: 'warm', rot: -.35, glint: seg(t, c('c18') + 2.6, c('c18') + 3.4), star: Math.sin(seg(t, c('c18') + 2.6, c('c18') + 3.4) * Math.PI) * .9, sleeve: pal('nikGreen', 'warm').cloth }); }
    }
    return { post: { expo: 1.07, sat: 1.08, tint: [1.04, .98, .9] } };
  },
  veranda(t, g, e) {
    const u = U('veranda', t), tt = st(t); show(g, e, A.ver, { z: lerp(1, 1.06, u) });
    bust(g, e, 'nikGreen', 'night', 460, 1060, 2.2, { expr: 'warm', look: [.7, t > HT.buzz ? .8 : .1], blink: blink(tt, 4), light: [.4, -1], rim: '#9affc8' });
    rect(g, 640, 1390, 260, 30, { f: '#e8dcc0', l: '#4a4030', lw: 2 });
    bigPhone(g, e, 'vb', 780, 1340, 120, (x, w, h) => { x.fillStyle = t > HT.buzz ? '#2a3a5a' : '#0a0a10'; x.fillRect(0, 0, w, h); }, { rot: 1.57 + (t > HT.buzz && t < HT.buzz + 1.2 ? Math.sin(t * 80) * .03 : 0), glow: .6 });
    rain(g, e, Math.floor(t * 12), { n: 200, a: .35, ang: .08 });
    return { post: { expo: 1.02, tint: [.94, .98, 1.04] } };
  },
  msg(t, g, e) {
    phoneShot(g, e, 'ms', 'night', (x, w, h) => chat(x, w, h, 'Jithin', [{ from: 'Jithin', text: 'Bro, എന്റെ ജോലി പോയി. നീ എന്നെ ട്രേഡിങ് പഠിപ്പിക്ക്. പിള്ളേരുടെ കയ്യിൽ നിന്ന് വീണ്ടും കാശ് എടുക്കാം, പഴയ പോലെ.', ml: true, fromCol: '#7ab8ff' }]), { bg: A.ver, who: 'nikGreen' });
    return { post: { expo: 1.03 } };
  },
  veranda2(t, g, e) {
    const tt = st(t);
    if (t < HT.facedown) {
      phoneShot(g, e, 'ms2', 'night', (x, w, h) => chat(x, w, h, 'Jithin', [{ from: 'Jithin', text: 'Bro, എന്റെ ജോലി പോയി. നീ എന്നെ ട്രേഡിങ് പഠിപ്പിക്ക്. പിള്ളേരുടെ കയ്യിൽ നിന്ന് വീണ്ടും കാശ് എടുക്കാം, പഴയ പോലെ.', ml: true, fromCol: '#7ab8ff' }, ...(t > HT.photo ? [{ me: true, text: "Rule 1: Never trade someone else's money." }] : [])]), { bg: A.ver, who: 'nikGreen' });
      if (t > HT.photo && t < HT.photo + .2) { g.save(); g.fillStyle = rgba('#ffffff', .8); g.fillRect(0, 0, W, H); g.restore(); }
      return { post: { expo: 1.03 } };
    }
    const u = seg(t, HT.facedown, range('veranda2')[1]); show(g, e, A.ver, { z: lerp(1.15, 1.25, u) });
    bust(g, e, 'nikGreen', 'night', 520, 1000, 2.6, { expr: 'smile', look: [-.6, -.3], blink: blink(tt, 2), light: [.4, -1], rim: '#9affc8' });
    rain(g, e, Math.floor(t * 12), { n: 200, a: .35, ang: .08 });
    return { post: { expo: 1.02, tint: [.94, .98, 1.04] } };
  },
  end(t, g, e) {
    const [a, b] = range('end'), u = U('end', t); show(g, e, A.palms, { z: lerp(1, 1.06, u) });
    const k = eo(seg(t, HT.candle, HT.candle + 1.0)), ttl = LT.c20 + dur('c20') + .2;
    candle(g, e, W / 2, 1000, 320 * st(k, 12), 110, 'green', { ga: .8 });
    rain(g, e, Math.floor(t * 12), { n: 240, a: .3, ang: .1 });
    if (t > ttl) { const n = Math.min(10, Math.floor((t - ttl) * 12)); chrome(g, e, 'RED CANDLE'.slice(0, n), W / 2, 1400, 140, RED); }
    if (t > b - 2.2) { g.save(); g.globalAlpha = seg(t, b - 2.2, b - 1.8); g.font = '600 34px "Barlow SC"'; g.textAlign = 'center'; g.fillStyle = '#c8d8c8'; g.fillText('A story about discipline. Not financial advice.', W / 2, 1700); g.restore(); }
    return { post: { expo: 1.03, tint: [.94, 1.0, 1.04] } };
  },
  brand(t, g, e) { return brandCard(t, g, e, HT.brand); },
};
const dur = id => K.ENV[id]?.dur ?? 2;

export function frame(t, g, e) {
  const i = K.TL.shotAt(t), id = K.TL.SHOTS[i][0];
  const r = SH[id](t, g, e) || {}; mark(g, e); return r;
}
