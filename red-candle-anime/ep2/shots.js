// Red Candle · Episode 2 "The Fall" — 80s cel anime.
import { K, init, W, H, plate, show, inCam, bust, rect, glow, grime, win, screen, chrome, caption, mark, clamp, lerp, ss, eo, seg, st, U, range, talk, blink,
  cel, poly, line, airbrush, vgrad, rgba, mix, hash, rng, TAU, pal, LWK } from '../kit.js';
import { chart, notif, clock, chat, incoming, UI } from '../ui.js';
import { bigPhone, laptop, watchInsert, candle, phoneAtEar, mug } from '../props.js';
import { rain, speedLines } from '../engine/fx.js';
import { brandCard } from '../ep1/shots.js';

let A = {}, HT, LT;
const RED = { cols: [[0, '#ffd8c8'], [.46, '#ffffff'], [.5, '#4a0610'], [.7, '#c81e2a'], [.9, '#ff6a3a'], [1, '#ffd08a']], neon: '#ff2a3a' };
const GREEN = { cols: [[0, '#c8ffd8'], [.46, '#ffffff'], [.5, '#0a3a1c'], [.7, '#2fc06a'], [.9, '#b8ff6a'], [1, '#ffe08a']], neon: '#2aff7a' };

export async function setup({ TL, ENV }) {
  init(TL, ENV); HT = K.HIT; LT = K.LT;
  A.living = plate(W, H, (g, e) => {                    // UK living room dressed for Onam: marigold garlands, a pookalam on the carpet
    vgrad(g, 0, 0, W, H, [[0, '#f0d8a8'], [.6, '#d8a868'], [1, '#8a5a34']]); grime(g, 0, 0, W, 1200, 12, '#6a3a10', .08);
    win(g, e, 640, 200, 360, 460, 'dusk', { frame: '#f4ecdc', seed: 14 });
    for (let i = 0; i < 14; i++) { const x = 30 + i * 76, y = 110 + Math.sin(i / 13 * Math.PI) * 60; const f = new Path2D(); f.arc(x, y, 26, 0, TAU); cel(g, f, { f: ['#f4a020', '#f4d030', '#e86a1e'][i % 3], s: '#b8640e', so: [-4, 4], l: '#6a3008', lw: 2 }); }
    vgrad(g, 0, 1250, W, 670, [[0, '#a8604a'], [1, '#6a3020']]);
    for (let r = 5; r >= 1; r--) { const p = new Path2D(); p.ellipse(540, 1700, r * 90, r * 30, 0, 0, TAU); g.fillStyle = ['#f4d030', '#e83a1e', '#f4a020', '#ffffff', '#c81e6a'][r - 1]; g.fill(p); }
    glow(g, e, 540, 300, 600, '#ffd890', .3, .3);
  });
  A.sadya = plate(W, H, (g, e) => {
    vgrad(g, 0, 0, W, H, [[0, '#e8c890'], [.5, '#c89858'], [1, '#6a4428']]);
    for (let i = 0; i < 9; i++) { const f = new Path2D(); f.arc(80 + i * 130, 120 + (i % 2) * 30, 34, 0, TAU); cel(g, f, { f: ['#f4c430', '#e8742a', '#f4e8c8'][i % 3], l: '#6a3008', lw: 2 }); }
    glow(g, e, 540, 300, 700, '#ffe0a0', .3, .3);
  });
  A.room = plate(W, H, (g, e) => {
    vgrad(g, 0, 0, W, H, [[0, '#0c0e1c'], [.6, '#161a2e'], [1, '#0a0a14']]); win(g, e, 640, 160, 360, 520, 'rain', { frame: '#1a1c2a', seed: 3 });
    rect(g, 0, 1380, W, 540, { f: '#1c1a26', s: '#0e0d14', so: [0, -30], l: '#06060a', lw: 3 }); grime(g, 0, 0, W, 1380, 4, '#000000', .12);
  });
  A.office = plate(W, H, (g, e) => { vgrad(g, 0, 0, W, H, [[0, '#e8eef4'], [1, '#c8d2dc']]); for (let i = 0; i < 3; i++) win(g, e, 60 + i * 340, 140, 300, 620, 'day', { frame: '#8a96a4', seed: 40 + i, lw: 14 }); rect(g, 0, 1180, W, 740, { f: '#9aa4b0', l: '#2a3038', lw: 3 }); });
  A.flat = plate(W, H, (g, e) => {                      // the shared flat: grey, cold light
    vgrad(g, 0, 0, W, H, [[0, '#4a5068'], [1, '#22263a']]); grime(g, 0, 0, W, H, 33, '#000000', .14);
    rect(g, 700, 260, 300, 1100, { f: '#5a4030', s: '#3a2818', so: [-14, 0], l: '#1a0e06', lw: 3 }); const k = new Path2D(); k.arc(740, 820, 12, 0, TAU); cel(g, k, { f: '#d8b860', l: '#4a3008', lw: 2 });
    rect(g, 0, 1400, W, 520, { f: '#3a3448', l: '#0e0c14', lw: 3 });
  });
  A.door = plate(W, H, (g, e) => {                      // doorway, warm hallway light behind Jithin
    vgrad(g, 0, 0, W, H, [[0, '#2a2e42'], [1, '#141622']]);
    rect(g, 260, 180, 560, 1300, { f: '#ffd890', l: '#3a2a10', lw: 6 }); glow(null, e, 540, 800, 700, '#ffc870', .7);
    vgrad(g, 270, 190, 540, 1280, [[0, '#fff0c8'], [1, '#e8b870']]);
    rect(g, 0, 1480, W, 440, { f: '#22242e', l: '#08080c', lw: 3 });
  });
  A.bus = plate(W, H, (g, e) => {                       // bus shelter in the rain, one sodium lamp
    vgrad(g, 0, 0, W, H, [[0, '#060a16'], [.6, '#18203a'], [1, '#0a0e18']]);
    const R = rng(51); for (let i = 0; i < 20; i++) { const x = R() * W, y = 300 + R() * 600; airbrush(g, x, y, 40 + R() * 80, 40 + R() * 80, ['#ffcf7a', '#ff5a3a', '#7ac8ff'][i % 3], .3, 1); airbrush(e, x, y, 40, 40, '#ffcf7a', .25, 1); }
    cel(g, poly([[60, 220], [1020, 220], [1020, 260], [60, 260]]), { f: '#3a4050', l: '#0a0c12', lw: 3 }); line(g, [[90, 260], [90, 1500]], '#3a4050', 16); line(g, [[990, 260], [990, 1500]], '#3a4050', 16);
    g.fillStyle = rgba('#9ab8d8', .12); g.fillRect(100, 262, 880, 1230);
    rect(g, 140, 300, 260, 400, { f: '#1a2a4a', l: '#0a0c12', lw: 3 }); g.fillStyle = '#ffd27a'; g.font = '700 50px "Barlow SC"'; g.textAlign = 'center'; g.fillText('BUS 42', 270, 400); e.fillStyle = rgba('#ffd27a', .5); e.font = g.font; e.textAlign = 'center'; e.fillText('BUS 42', 270, 400);
    glow(g, e, 540, 230, 500, '#ffb050', .35, .5);
    vgrad(g, 0, 1500, W, 420, [[0, '#20263a'], [1, '#0a0c16']]); for (let i = 0; i < 10; i++) airbrush(g, R() * W, 1520 + R() * 380, 120, 8, '#ffb050', .25, 1);
  });
  A.desk = plate(W, H, (g, e) => {                      // desk under a lamp, the notebook
    vgrad(g, 0, 0, W, H, [[0, '#1a120a'], [1, '#0a0604']]); airbrush(g, 540, 700, 800, 700, '#ffb060', .35, 1); airbrush(e, 540, 500, 500, 400, '#ffb060', .25, 1);
    rect(g, -20, 300, W + 40, 1700, { f: '#6a4628', s: '#4a2e18', so: [0, -40], l: '#1a0e06', lw: 3 });
  });
  return { phone: ['b17', 'b19'] };
}

const HOLD = (x, w, h, t) => {};
function phoneShot(g, e, key, light, fn, o = {}) {      // a phone held up close; the room behind it soft and dark
  show(g, e, A.room, { z: 1.4, y: 900 }); g.save(); g.fillStyle = rgba('#000000', .35); g.fillRect(0, 0, W, H); g.restore();
  bigPhone(g, e, key, W / 2, o.y ?? 900, o.w ?? 600, fn, { rot: o.rot ?? -.03, glow: o.glow ?? .32, crack: o.crack });
  const P = pal(o.who || 'nik', light), sk = P.skin, pw = o.w ?? 600, py = o.y ?? 900, x0 = W / 2 - pw / 2, x1 = W / 2 + pw / 2;
  for (let i = 0; i < 4; i++) { const f = new Path2D(); f.roundRect(x0 - 40, py - 120 + i * 84, 66, 66, 28); cel(g, f, { f: sk.f, s: sk.s, so: [6, -6], h: sk.h, ho: [-3, 3], l: sk.l, lw: 2.4 }); }
  const th = new Path2D(); th.roundRect(x1 - 30, py + 60, 64, 150, 30); cel(g, th, { f: sk.f, s: sk.s, so: [-6, -6], h: sk.h, ho: [3, 3], l: sk.l, lw: 2.4 });
}

const SH = {
  title(t, g, e) {
    vgrad(g, 0, 0, W, H, [[0, '#2a0406'], [1, '#0e0102']]); airbrush(g, W / 2, 900, 700, 600, '#6a0a10', .5, 1);
    for (let i = 0; i < 24; i++) { const life = 2 + hash(i) * 2, ph = ((st(t) + hash(i * 5.5) * life) % life) / life; const x = W / 2 + (hash(i * 3.7) - .5) * 800, y = 1600 - ph * 900; g.fillStyle = rgba(i % 3 ? '#ff6a3a' : '#ffd070', Math.sin(ph * Math.PI)); g.fillRect(x, y, 6, 6); e.fillStyle = g.fillStyle; e.fillRect(x - 2, y - 2, 10, 10); }
    if (t > HT.presents && t < HT.title + 3.2) { g.save(); g.globalAlpha = seg(t, HT.presents, HT.presents + .4); g.font = '500 40px "Cormorant SC"'; g.letterSpacing = '8px'; g.textAlign = 'center'; g.fillStyle = '#f4e4c8'; g.fillText('MeowXTrader presents', W / 2, 560); g.restore(); }
    if (t > HT.title) { const n = Math.min(8, Math.floor((t - HT.title) * 12)); g.save(); g.font = 'italic 800 64px Kanit'; g.textAlign = 'center'; g.fillStyle = '#f4e4c8'; g.fillText('Episode 2', W / 2, 820); g.restore(); chrome(g, e, 'THE FALL'.slice(0, n), W / 2, 1010, 170, RED); }
    return { post: { expo: 1.05 }, sub: { hide: true } };
  },
  onam(t, g, e) {
    const [a] = range('onam'), tt = st(t), who = t < LT.b02 - .2 ? 'two' : t < LT.b03 - .2 ? 'N' : 'J';
    if (who === 'two') {
      const u = seg(t, a, LT.b02), cam = { x: 540, y: lerp(1000, 940, u), z: lerp(1, 1.1, u) }; show(g, e, A.living, cam);
      inCam(g, cam, A.living, g2 => { bust(g2, null, 'jithin', 'warm', 330, 960, 1.95, { expr: 'grin', mouth: talk(t, 'jithin') || undefined, look: [.6, .1], blink: blink(tt, 3), light: [1, -.7] });
        bust(g2, null, 'nikKasavu', 'warm', 790, 990, 1.9, { mirror: true, expr: 'neutral', look: [.6, .1], blink: blink(tt, 7), light: [-1, -.7] }); });
    } else if (who === 'N') { show(g, e, A.living, { x: 700, y: 900, z: 1.35 }); bust(g, e, 'nikKasavu', 'warm', 620, 1000, 2.8, { mirror: true, expr: 'worried', mouth: talk(t, 'nik') || undefined, look: [.5, .1], blink: blink(tt, 7), light: [-1, -.7] }); }
    else { show(g, e, A.living, { x: 380, y: 900, z: 1.35 }); bust(g, e, 'jithin', 'warm', 440, 1000, 2.8, { expr: 'hard', E: { mouth: 'smile' }, mouth: talk(t, 'jithin') || undefined, look: [.5, .1], blink: blink(tt, 3), light: [1, -.7] }); }
    caption(g, e, 'Onam · Manchester', 300, seg(t, a + .2, a + .5) * (1 - seg(t, a + 3, a + 3.3)));
    return { post: { expo: 1.05, tint: [1.03, .98, .9] } };
  },
  sadya(t, g, e) {
    const tt = st(t), ano = t < LT.b05 - .3;
    show(g, e, A.sadya, { z: 1.2, x: ano ? 380 : 680, y: 900 });
    if (ano) bust(g, e, 'anoopKasavu', 'warm', 460, 960, 2.6, { expr: 'warm', mouth: talk(t, 'anoop') || undefined, look: [.6, .1], blink: blink(tt, 4), light: [1, -.7] });
    else bust(g, e, 'jithin', 'warm', 640, 960, 2.6, { mirror: true, expr: 'smile', mouth: talk(t, 'jithin') || undefined, look: [.6, .3], blink: blink(tt, 2), light: [-1, -.7] });
    // banana leaf with rice and curries in the foreground
    cel(g, [[-80, 1640], [600, 1560], [1180, 1620], [1180, 1920], [-80, 1920]], { f: '#3a9a3a', s: '#2a6a2a', so: [0, 20], h: '#7ad06a', ho: [0, -6], l: '#0e3a0e', lw: 3 });
    line(g, [[-80, 1800], [1180, 1700]], '#7ad06a', 5);
    const rice = new Path2D(); rice.ellipse(560, 1760, 150, 56, 0, 0, TAU); cel(g, rice, { f: '#f8f4ea', s: '#d8d0bc', so: [0, 10], l: '#6a6450', lw: 2 });
    [['#e8a030', 200, 1720], ['#c84a1e', 860, 1700], ['#f0e0a0', 330, 1850], ['#6a8a2a', 800, 1850]].forEach(([c, x, y]) => { const p = new Path2D(); p.ellipse(x, y, 70, 40, 0, 0, TAU); cel(g, p, { f: c, s: mix(c, '#000000', .3), so: [0, 6], l: mix(c, '#000000', .6), lw: 2 }); });
    return { post: { expo: 1.06, tint: [1.03, .98, .9] } };
  },
  transfer(t, g, e) { phoneShot(g, e, 'p1', 'cool', (x, w, h) => { clock(x, w, h, '14:06', { y: .26 }); notif(x, w, h * .34, 'Bank · Payment received', 'Anoop sent you £5,000', eo(seg(t, HT.ping1, HT.ping1 + .3))); }, { who: 'jithin' }); return { post: { expo: 1.04 } }; },
  transfer2(t, g, e) { phoneShot(g, e, 'p2', 'cool', (x, w, h) => { clock(x, w, h, '14:07', { y: .26 }); notif(x, w, h * .34, 'Bank · Payment received', 'Jithin sent you £4,500', eo(seg(t, HT.ping2, HT.ping2 + .3))); }); return { post: { expo: 1.04 } }; },
  green(t, g, e) {
    const tt = st(t), u = U('green', t); show(g, e, A.room, { z: 1.2 });
    bust(g, e, 'nik', 'screen', 300, 520, 1.6, { expr: 'grin', look: [.6, .7], blink: blink(tt, 4), light: [.5, 1], reflect: '#3aee8a' });
    bigPhone(g, e, 'gr', 620, 1060, 560, (x, w, h) => {
      const msgs = [{ me: true, text: '+6% this week. All green.' }];
      [['Anoop', 'Legend bro!!'], ['Rahul', 'Too good machane'], ['Jithin', 'Told you he is the guy'], ['Sanju', 'Add me also next month']].forEach(([from, text], i) => { if (t > HT.chatPop + i * .6) msgs.push({ from, text, fromCol: from === 'Jithin' ? '#7ab8ff' : '#f0b060' }); });
      chat(x, w, h, 'Profit Club', msgs);
    }, { rot: -.05, glow: .3 });
    return { post: { expo: 1.04, tint: [.96, 1.02, .98] } };
  },
  loss(t, g, e) {
    const [a] = range('loss'), u = U('loss', t), tt = st(t);
    vgrad(g, 0, 0, W, H, [[0, '#2a0406'], [1, '#0a0102']]);
    g.save(); g.globalAlpha = .55; chart(g, 0, 160, W, 900, { n: 16, seed: 77, bias: -.05, allRed: true }); g.restore(); e.save(); e.globalAlpha = .35; chart(e, 0, 160, W, 900, { n: 16, seed: 77, bias: -.05, allRed: true }); e.restore();
    LWK.k = .7; bust(g, e, 'nik', 'red', 540, lerp(1000, 940, ss(u)), lerp(3.4, 4.0, ss(u)), { expr: 'shock', E: { iris: .6 }, look: [0, .3], blink: blink(tt, 9), reflect: '#ff3a2a', light: [0, 1], rim: '#ff3a2a', tear: seg(u, .55, 1) * .7, ph: tt }); LWK.k = 1;
    if (t < a + 2 / 24) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore(); }
    return { post: { expo: 1.02, tint: [1.08, .9, .9], track: t < a + .25 ? 1 : 0 } };
  },
  revenge(t, g, e) {
    const [a] = range('revenge'), tt = st(t), lot = t < HT.lot ? '1.0' : t < HT.lot + 1 ? '2.5' : '5.0';
    g.save(); g.translate(W / 2, H / 2); g.rotate(-.06); g.translate(-W / 2, -H / 2);
    vgrad(g, -100, -100, W + 200, H + 200, [[0, '#14060a'], [1, '#06020a']]);
    [[60, 180, 460, 300], [560, 140, 460, 320], [300, 560, 480, 300]].forEach(([x, y, w, h], i) => { rect(g, x - 12, y - 12, w + 24, h + 24, { f: '#18181e', l: '#050508', lw: 3 });
      screen(g, e, 'm' + i, x, y, w, h, (c, w, h) => { c.fillStyle = '#140808'; c.fillRect(0, 0, w, h); chart(c, 10, 50, w - 20, h - 60, { n: 18, seed: 40 + i * 7 + Math.floor((t - a) * 3), bias: -.03 }); c.fillStyle = '#ff4a3c'; c.font = `700 36px ${UI}`; c.textAlign = 'left'; c.fillText(i === 1 ? `LOT ${lot}` : i ? '−£1,240' : '−£860', 14, 40); }, { glow: .4 }); });
    const c = new Path2D(); c.arc(900, 640, 80, 0, TAU); cel(g, c, { f: '#d8d4c8', l: '#2a2820', lw: 4 }); const mn = (t - a) * 14; line(g, [[900, 640], [900 + Math.cos(mn) * 60, 640 + Math.sin(mn) * 60]], '#1a1a1e', 6);
    bust(g, e, 'nikBroken', 'red', 540, 1180, 2.6, { expr: 'hard', E: { iris: .7, open: 1.05, brow: [8, -2, 0], sweat: 1 }, look: [Math.sin(st(t, 8) * 5) * .8, -.4], light: [0, -1], rim: '#ff4a3c', reflect: '#ff3a2a' });
    g.restore();
    if (t > HT.lot && t < HT.lot + 1.6) speedLines(g, Math.floor(t * 12), { type: 'radial', cx: W / 2, cy: 900, col: '#ff3a2a', n: 60, a: .35 });
    return { post: { expo: 1.02, tint: [1.06, .92, .94] } };
  },
  ignore(t, g, e) {
    const down = t > HT.facedown, k = seg(t, HT.facedown - .35, HT.facedown);
    vgrad(g, 0, 0, W, H, [[0, '#1a1c26'], [1, '#0a0a10']]); rect(g, -20, 500, W + 40, 1500, { f: '#4a3a2a', s: '#2a2018', so: [0, -30], l: '#120c06', lw: 3 });
    if (!down) { g.save(); g.translate(W / 2, 1080); g.scale(1, 1 - k * 2 < 0 ? -(1 - k * 2) : 1 - k * 2); g.translate(-W / 2, -1080); bigPhone(g, e, 'ig', W / 2, 1080, 480, (x, w, h) => { if (k < .5) incoming(x, w, h, 'Amma', t); else { x.fillStyle = '#2a2a34'; x.fillRect(0, 0, w, h); } }, { rot: .2, glow: .45 }); g.restore(); }
    else { const p = new Path2D(); p.roundRect(W / 2 - 240, 1080 - 490, 480, 980, 60); g.save(); g.translate(W / 2, 1080); g.rotate(.2); g.translate(-W / 2, -1080); cel(g, p, { f: '#2a2a34', s: '#16161c', so: [-12, -12], h: '#5a5a70', ho: [6, 6], l: '#050508', lw: 3 }); g.restore(); }
    if (!down && Math.floor(t * 16) % 2) { g.save(); g.translate(Math.sin(t * 90) * 4, 0); g.restore(); }
    return { post: { expo: down ? .92 : 1.03 } };
  },
  loan(t, g, e) {
    const u = U('loan', t), z = lerp(1.05, 1.18, u); show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'ln', W / 2, 980, 780, (x, w, h) => {
      x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.fillStyle = '#16161a'; x.font = `700 ${w * .07}px ${UI}`; x.fillText('Personal Loan', w / 2, h * .17); x.font = `700 ${w * .15}px ${UI}`; x.fillText('£8,000', w / 2, h * .42);
      const ok = t > HT.loanOk; x.fillStyle = ok ? '#2a8a4a' : '#1a4aa8'; x.beginPath(); x.roundRect(w / 2 - w * .26, h * .52, w * .52, h * .16, 18); x.fill(); x.fillStyle = '#fff'; x.font = `700 ${w * .06}px ${UI}`; x.fillText(ok ? 'Approved' : 'Approve loan', w / 2, h * .63);
      if (t > HT.loanOk + .8) { x.fillStyle = '#16161a'; x.font = `600 ${w * .045}px ${UI}`; x.fillText('Deposit to broker: Credit card ···· 4600', w / 2, h * .85); } }, { glow: .35 }));
    return { post: { expo: 1.02 } };
  },
  split(t, g, e) {
    const tt = st(t);
    g.save(); g.beginPath(); g.rect(0, 0, W, H / 2 - 6); g.clip(); show(g, e, A.room, { z: 1.4, y: 760 });
    const Pn = bust(g, null, 'nikBroken', 'night', 600, 560, 2.2, { expr: 'cry', mouth: talk(t, 'nik') || 'cry', look: [.2, .4], blink: blink(tt, 2), tear: .7, ph: tt, light: [1, -.4], rim: '#7aa0ff' });
    g.save(); g.translate(600, 560); g.scale(2.2, 2.2); phoneAtEar(g, Pn); g.restore(); g.restore();
    g.save(); g.beginPath(); g.rect(0, H / 2 + 6, W, H / 2); g.clip(); show(g, e, A.office, { z: 1.2, y: 1100 });
    const Pj = bust(g, null, 'jithin', 'day', 520, 1500, 2.2, { mirror: true, expr: 'smile', mouth: talk(t, 'jithin') || undefined, look: [.4, -.2], blink: blink(tt, 6), light: [-1, -.8] });
    g.save(); g.translate(520, 1500); g.scale(-2.2, 2.2); phoneAtEar(g, Pj); g.restore(); mug(g, 880, 1820, 1.4, '#2a5a8a'); g.restore();
    g.fillStyle = '#000'; g.fillRect(0, H / 2 - 6, W, 12); e.fillStyle = '#000'; e.fillRect(0, 0, W, H);
    return { post: { expo: 1.03 }, sub: { top: H / 2 + 30 } };
  },
  margin(t, g, e) {
    const [a] = range('margin'), z = 1.1 + seg(t, HT.heart1, HT.heart1 + .15) * .04 - seg(t, HT.heart1 + .15, HT.heart1 + .5) * .04 + seg(t, HT.heart2, HT.heart2 + .15) * .05;
    show(g, e, A.room, { z });
    inCam(g, { z }, A.room, g2 => laptop(g2, e, 'mg', W / 2, 980, 780, (x, w, h) => {
      x.fillStyle = '#120404'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.fillStyle = '#ffd0c8'; x.font = `600 ${w * .06}px ${UI}`; x.fillText('Account balance', w / 2, h * .25);
      x.fillStyle = '#ff3a2a'; x.font = `700 ${w * .2}px ${UI}`; x.fillText('£0.00', w / 2, h * .52);
      if (Math.floor((t - a) * 3) % 2 === 0) { x.fillStyle = '#ff2a1e'; x.fillRect(w * .14, h * .64, w * .72, h * .18); x.fillStyle = '#fff'; x.font = `700 ${w * .09}px ${UI}`; x.fillText('MARGIN CALL', w / 2, h * .78); } }, { glow: .5 }));
    if (t > HT.crack) { const k = eo(seg(t, HT.crack, HT.crack + .2)); g.strokeStyle = rgba('#ffffff', .85); g.lineWidth = 3; for (let i = 0; i < 11; i++) { const an = i / 11 * TAU + hash(i) * .5, L0 = (240 + hash(i * 3) * 520) * k; g.beginPath(); g.moveTo(660, 880); let px = 660, py = 880; for (let s = 1; s <= 3; s++) { px += Math.cos(an + (hash(i * s) - .5) * .4) * L0 / 3; py += Math.sin(an + (hash(i + s) - .5) * .4) * L0 / 3; g.lineTo(px, py); } g.stroke(); }
      if (t < HT.crack + 2 / 24) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore(); } }
    return { post: { expo: 1.0, tint: [1.06, .92, .92], track: t > HT.crack && t < HT.crack + .3 ? 1 : 0 } };
  },
  chat(t, g, e) {
    phoneShot(g, e, 'ch', 'night', (x, w, h) => {
      const msgs = []; [['Anoop', 'Where is my money?'], ['Rahul', 'Nikhil call me NOW'], ['Sanju', 'You lost everything??'], ['Anoop', 'Answer the phone'], ['Rahul', 'Where is my money?']].forEach(([from, text], i) => { if (t > HT.flood + i * .22) msgs.push({ from, text, col: '#3a1a1a' }); });
      if (t > HT.jitMsg) msgs.push({ from: 'Jithin', text: 'ഞാൻ അവനോട് പറഞ്ഞതാ, all-in പോവരുതെന്ന്.', ml: true, fromCol: '#7ab8ff' });
      chat(x, w, h, 'Profit Club', msgs);
    }, { who: 'nikBroken', crack: true, y: 860, w: 640 });
    return { post: { expo: 1.02 } };
  },
  anoop(t, g, e) {
    const u = U('anoop', t), tt = st(t); vgrad(g, 0, 0, W, H, [[0, '#3a0a0e'], [1, '#140406']]);
    speedLines(g, Math.floor(t * 12), { type: 'radial', cx: 560, cy: 820, col: '#ff6a5a', n: 90, a: .35 });
    LWK.k = .8; bust(g, e, 'anoop', 'red', 540, 980, lerp(3.2, 3.5, u), { expr: 'angry', mouth: talk(t, 'anoop') || 'frown', look: [-.1, 0], blink: 0, tear: seg(u, .45, 1) * .8, ph: tt, light: [-1, -.6] }); LWK.k = 1;
    return { post: { expo: 1.02, tint: [1.04, .94, .94] } };
  },
  realise(t, g, e) {
    const [a] = range('realise'), tt = st(t);
    if (t < a + 3.6) {   // the two receipts, side by side, the tape stutters
      vgrad(g, 0, 0, W, H, [[0, '#0a0c18'], [1, '#14182a']]);
      const k = seg(t, a, a + .3); notifCard(g, e, 120, 520, 'Anoop sent you £5,000', k, '#2a6a3a'); notifCard(g, e, 120, 860, 'Jithin sent you £4,500', seg(t, a + .9, a + 1.2), '#8a1a14');
      if (t > a + 1.6) { g.save(); g.strokeStyle = '#ff3a2a'; g.lineWidth = 8; g.beginPath(); g.ellipse(770, 950, 150, 60, 0, 0, TAU * seg(t, a + 1.6, a + 2.2)); g.stroke(); g.restore(); }
      return { post: { expo: 1.03, track: t > a + 3.3 ? 1 : 0 } };
    }
    if (t < a + 6.4) { vgrad(g, 0, 0, W, H, [[0, '#101424'], [1, '#06080e']]); LWK.k = .45; bust(g, e, 'nikBroken', 'night', 540, 1240, 7.5, { expr: 'shock', E: { iris: .6 }, look: [.6, 0], blink: 0, light: [1, -.4] }); LWK.k = 1; return { post: { expo: 1.02 } }; }
    show(g, e, A.flat, { z: 1.3, x: 600, y: 900 });
    bust(g, e, 'jithin', 'cool', 560, 1000, 2.6, { mirror: true, expr: 'sad', E: { mouth: 'closed' }, look: [.8, .6], blink: blink(tt, 5), light: [-1, -.6] });
    return { post: { expo: .98, tint: [.95, .97, 1.04] } };
  },
  leave(t, g, e) {
    const tt = st(t);
    if (t < HT.door + .25) { show(g, e, A.door, { z: 1.1 }); bust(g, e, 'jithin', 'sil', 540, 980, 2.5, { mirror: true, expr: 'smile', mouth: talk(t, 'jithin') || undefined, look: [.8, .3], blink: blink(tt, 2), rim: '#ffd890', light: [0, -1] });
      if (t > HT.door - .3) { const k = seg(t, HT.door - .3, HT.door + .25); rect(g, 260 + 560 * (1 - k), 180, 560 * k, 1300, { f: '#3a2818', l: '#0a0604', lw: 4 }); }
      return { post: { expo: 1.02 } }; }
    const u = seg(t, HT.door + .25, range('leave')[1]); show(g, e, A.flat, { z: lerp(1.15, 1.3, u) });
    bust(g, e, 'nikBroken', 'night', 540, 1000, lerp(2.4, 2.7, u), { expr: 'cry', E: { mouth: 'frown' }, look: [0, .9], blink: blink(tt, 6), tear: seg(u, .2, 1), ph: tt, light: [1, -.5] });
    return { post: { expo: .95, tint: [.94, .96, 1.05] } };
  },
  bus(t, g, e) {
    const u = U('bus', t), tt = st(t), z = lerp(1, 1.35, ss(u)); show(g, e, A.bus, { z, y: lerp(960, 900, u) });
    inCam(g, { z, y: lerp(960, 900, u) }, A.bus, g2 => { const P = bust(g2, null, 'nikBroken', 'rain', 560, 1040, 2.2, { expr: 'cry', mouth: talk(t, 'nik') || 'cry', look: [0, .5], blink: blink(tt, 3), tear: .5 + seg(t, LT.b18, LT.b20 + 2) * .5, ph: tt, light: [0, -1], rim: '#ffb050' });
      g2.save(); g2.translate(560, 1040); g2.scale(2.2, 2.2); phoneAtEar(g2, P); g2.restore(); });
    rain(g, e, Math.floor(t * 12), { n: 320, a: .45, ang: .12 });
    return { post: { expo: 1.0, tint: [.92, .96, 1.06], lift: .05 } };
  },
  notebook(t, g, e) {
    const u = U('notebook', t), watchAt = .72, cam = u < watchAt ? { z: lerp(1, 1.08, u), y: 900 } : { z: 1.5, y: 1500, x: 760 };
    show(g, e, A.desk, cam);
    inCam(g, cam, A.desk, g2 => {
      g2.save(); g2.translate(500, 860); g2.rotate(-.04); cel(g2, poly([[-420, -560], [420, -560], [420, 560], [-420, 560]]), { f: '#f2ead2', s: '#d0c4a4', so: [-10, -10], l: '#5a4a2a', lw: 3 });
      for (let y = -480; y < 560; y += 60) { g2.strokeStyle = rgba('#7a9ad8', .4); g2.lineWidth = 2; g2.beginPath(); g2.moveTo(-400, y); g2.lineTo(400, y); g2.stroke(); }
      g2.fillStyle = '#1e2a6a'; g2.font = `italic 700 74px ${UI}`; g2.textAlign = 'left';
      [['Friends', '£18,000'], ['Loan', '£8,000'], ['Credit card', '£4,600']].forEach(([a, b], i) => { g2.textAlign = 'left'; g2.fillText(a, -360, -360 + i * 150); g2.textAlign = 'right'; g2.fillText(b, 360, -360 + i * 150); });
      g2.fillRect(-360, 80, 720, 6); g2.textAlign = 'left'; g2.font = `italic 700 92px ${UI}`; g2.fillText('Total', -360, 240); g2.textAlign = 'right'; g2.fillStyle = '#b01e14'; g2.fillText('£30,600', 360, 240);
      const c = seg(t, HT.circle, HT.circle + .8); if (c > 0) { g2.strokeStyle = '#b01e14'; g2.lineWidth = 9; g2.beginPath(); g2.ellipse(150, 210, 240, 100, -.05, 0, TAU * c); g2.stroke(); }
      g2.restore();
      watchInsert(g2, null, 800, 1560, .9, t, { who: 'nikBroken', light: 'warm', rot: .3 });
    });
    return { post: { expo: 1.03, tint: [1.04, .96, .88] } };
  },
  ep3(t, g, e) {
    vgrad(g, 0, 0, W, H, [[0, '#04140a'], [1, '#010603']]); airbrush(g, W / 2, 900, 700, 600, '#0a3a1c', .5, 1);
    if (t > HT.ep3) { const n = Math.min(9, Math.floor((t - HT.ep3) * 12)); g.save(); g.font = 'italic 800 64px Kanit'; g.textAlign = 'center'; g.fillStyle = '#e4f4e8'; g.fillText('Episode 3', W / 2, 760); g.restore(); chrome(g, e, 'THE GRIND'.slice(0, n), W / 2, 960, 160, GREEN); }
    caption(g, e, 'Next · Episode 3', 1240, seg(t, HT.ep3 + .9, HT.ep3 + 1.2), { size: 40, col: '#7af0a0' });
    return { post: { expo: 1.05 }, sub: { hide: true } };
  },
  brand(t, g, e) { return brandCard(t, g, e, HT.brand); },
};
function notifCard(g, e, x, y, text, k, col) {
  if (k <= 0) return; g.save(); g.globalAlpha = clamp(k * 2); g.translate(0, (1 - eo(k)) * -60);
  g.fillStyle = '#f4f2ee'; g.beginPath(); g.roundRect(x, y, 840, 220, 30); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#2a6a3a'; g.font = `700 40px ${UI}`; g.textAlign = 'left'; g.fillText('Bank · Payment received', x + 40, y + 70);
  g.fillStyle = '#16161a'; g.font = `700 60px ${UI}`; g.fillText(text, x + 40, y + 160); g.restore();
  if (e) { e.save(); e.globalAlpha = .25 * clamp(k * 2); e.fillStyle = '#ffffff'; e.fillRect(x, y, 840, 220); e.restore(); }
}

export function frame(t, g, e) {
  const i = K.TL.shotAt(t), id = K.TL.SHOTS[i][0];
  const r = SH[id](t, g, e) || {}; mark(g, e); return r;
}
