// Red Candle · Episode 1 "Green Candles" — every frame repainted from knife strokes.
import { Impasto, Strokes, KNIFE, BRUSH, DAB, LINE, hex } from './engine/impasto.js';
import { W, H, DUR, SHOTS, LINES, ONSCREEN, HIT, shotAt, shotRange } from './timeline.js';
import * as S from './scenes/sets.js';
import { face } from './scenes/people.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';

const SW = S.SW, SH = S.SH, NEVER = 1e6;
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const TR = (x, y) => [1, 0, 0, 1, x, y], SC = s => [s, 0, 0, s, 0, 0];
const key = (t, ks) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0] = ks[i], [t1, v1] = ks[i + 1]; if (t < t1) { const k = eio((t - t0) / (t1 - t0)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); } } return ks[ks.length - 1][1]; };
// camera {x, y, zoom}, clamped so the view never leaves the painted plate
const camOf = (x, y, z, pw = SW, ph = SH) => { z = Math.max(z, Math.max(W / pw, H / ph)); const hx = W / 2 / z, hy = H / 2 / z; return { x: clamp(x, hx, pw - hx), y: clamp(y, hy, ph - hy), zoom: z }; };
const camK = (t, ks) => { const v = key(t, ks); return camOf(v[0], v[1], v[2]); };
const SCREEN_CAM = { x: W / 2, y: H / 2, zoom: 1 };

let E, dyn, env, sub, subMl, subEn, card, P = {}, TX = {};
const APP = (x, y, lv) => (y / SH) * .55 + (x / SW) * .1 + lv * .04;

export async function setup(canvas) {
  for (const f of ['700 100px "Cormorant Garamond"', 'italic 600 100px "Cormorant Garamond"', '400 40px Manjari', '700 40px Manjari']) await document.fonts.load(f, 'അആ');
  E = new Impasto(canvas, { W, H, ss: 2 }); dyn = new Strokes(8192);
  env = await (await fetch('audio/env.json')).json();
  // screens: crisp textures (small text can't be carried by knife strokes)
  for (const [k, w, h] of [['lap', 960, 850], ['phone', 380, 700], ['mon', 488, 298], ['pub', 176, 320], ['scr', 508, 348], ['bath', 360, 520]]) TX[k] = mkTex(w * 2, h * 2);
  // subtitles: Malayalam over English, in a calm dark plane
  sub = document.createElement('div');
  sub.style.cssText = 'position:fixed;left:70px;right:70px;top:1480px;text-align:center;padding:22px 26px 24px;border-radius:14px;background:rgba(12,10,14,.55);opacity:0;';
  subMl = document.createElement('div'); subMl.style.cssText = 'font-family:Manjari;font-weight:700;font-size:40px;line-height:1.35;color:#f4ead8;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  subEn = document.createElement('div'); subEn.style.cssText = 'font-family:"Cormorant Garamond";font-style:italic;font-weight:600;font-size:40px;line-height:1.2;margin-top:10px;color:#e8d8b0;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  sub.append(subMl, subEn); document.body.appendChild(sub);
  card = document.createElement('div');
  card.style.cssText = 'position:fixed;left:60px;right:60px;text-align:center;font-family:"Cormorant Garamond";color:#efe2c4;opacity:0;text-shadow:0 2px 8px rgba(0,0,0,.7)';
  document.body.appendChild(card);
  window.DUR = DUR; window.EV = events(); window.TEXTS = texts;
  return frame;
}

// lazily built plates (each worker builds only what its frames need)
const BUILD = {
  laptop: S.buildLaptop, face27: S.buildFace27, airport: S.buildAirport, manc: S.buildManc, back: S.buildBackNik, kitchen: S.buildKitchen,
  bunk: S.buildBunk, call: S.buildCall, office: S.buildOffice, pub: S.buildPub, research: S.buildResearch, bath: S.buildBath,
  canteen: S.buildCanteen, resN: () => S.buildResign('nik'), resJ: () => S.buildResign('jit'), sunset: S.buildSunset, walker: S.buildWalker,
  title: S.buildTitleText, ep2: S.buildEp2Text,
};
function plate(k) {
  if (P[k]) return P[k];
  const b = BUILD[k]();
  // paint-over order: strokes carry an 'app' offset so a plate can be laid in as a sweep
  const d = b.strokes.data(), F = 20;
  for (let i = 0; i < d.length; i += F) d[i + 14] = APP(d[i], d[i + 1], 0) * (b.ref.w > 1100 ? 1 : 1.6 * (d[i] / b.ref.w));
  return P[k] = { b: E.batch(d), tex: E.texture(b.ref.ctx.canvas), w: b.ref.w, h: b.ref.h, f: b.f || {}, a: b.a || {} };
}
function drawPlate(k, o) {
  const p = plate(k), M = o.M || [1, 0, 0, 1, 0, 0];
  const inT = o.appear !== undefined && o.t < o.appear + 1.2;
  if (!o.noUnder) E.under(p.tex, p.w, p.h, { ...o, M, grey: 0, alpha: (o.alpha ?? 1) * (inT ? seg(o.t, o.appear + .5, o.appear + .9) : 1) });
  E.draw(p.b, { grey: 0, ...o, M, appear: inT ? o.appear : -1e6, appDur: .16 });
  return p;
}
const flush = o => { if (dyn.n) E.drawNow(dyn.data(), { grey: 0, ...o }); dyn.clear(); };

// ---------- textures ----------
function mkTex(w, h) {
  const gl = E.gl, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const x = cv.getContext('2d'); x.scale(2, 2); return { cv, x, t, w: w / 2, h: h / 2 };
}
function upTex(T) { const gl = E.gl; gl.bindTexture(gl.TEXTURE_2D, T.t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, T.cv); }
function screen(T, rect, o) { upTex(T); E.under(T.t, rect[2], rect[3], { ...o, M: TR(rect[0], rect[1]), grey: 0, alpha: 1 }); }

// a candlestick chart into a 2D context. n candles, seed, bias (+ = green trend), reveal (0..1 candles drawn), red: index of a giant red candle
function chart(x, X, Y, Wd, Ht, o = {}) {
  const n = o.n ?? 26, cw = Wd / n; let p = .55, pts = [];
  for (let i = 0; i < n; i++) { const d = (hash(i * 3.1 + (o.seed || 0)) - .5) * .09 + (o.bias ?? .012); const op = p; p = clamp(p + d, .1, .92); pts.push([op, p]); }
  x.save(); x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2;
  for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(X, Y + Ht * k / 5); x.lineTo(X + Wd, Y + Ht * k / 5); x.stroke(); }
  const shown = Math.floor(n * (o.reveal ?? 1));
  for (let i = 0; i < shown; i++) {
    let [a, b] = pts[i]; const up = b >= a; const cx = X + cw * (i + .5);
    const hi = Math.max(a, b) + hash(i * 7.7) * .04, lo = Math.min(a, b) - hash(i * 5.3) * .04;
    x.strokeStyle = x.fillStyle = up ? '#38d27a' : '#ff4a3c';
    x.lineWidth = Math.max(2, cw * .1); x.beginPath(); x.moveTo(cx, Y + Ht * (1 - hi)); x.lineTo(cx, Y + Ht * (1 - lo)); x.stroke();
    x.fillRect(cx - cw * .32, Y + Ht * (1 - Math.max(a, b)), cw * .64, Math.max(3, Ht * Math.abs(b - a)));
  }
  if (o.red) { const cx = X + cw * (shown + .5), top = pts[shown - 1][1], len = o.red; x.fillStyle = x.strokeStyle = '#ff2a1e'; x.fillRect(cx - cw * .4, Y + Ht * (1 - top), cw * .8, Ht * len); }
  x.restore(); return pts;
}
const UI = '"Cormorant Garamond", serif';

// ---------- live layers ----------
function rain(t, o = {}) {
  const n = o.n ?? 160, [x0, y0, x1, y1] = o.box || [0, 0, W, H], ang = o.ang ?? 1.68;
  for (let i = 0; i < n; i++) {
    const sp = (900 + hash(i * 1.7) * 700) * (o.speed ?? 1), L = 40 + hash(i * 2.3) * 70, h = y1 - y0 + L;
    const y = y0 + ((hash(i * 4.1) * h + t * sp) % h) - L * .5, x = x0 + hash(i * 3.3) * (x1 - x0) + (y - y0) * Math.cos(ang) * .5;
    dyn.push({ x, y, ang, len: L * (o.len ?? 1), wid: (1.6 + hash(i) * 1.6) * (o.wid ?? 1), c: hex(o.col || '#c8d4ea'), type: LINE, alpha: (o.alpha ?? .45) * (.5 + hash(i * 9.1) * .5), seed: i, hgt: .3 });
  }
}
function steam(t, x0, y0, o = {}) {
  for (let i = 0; i < (o.n ?? 26); i++) {
    const life = 3 + hash(i) * 2, ph = ((t * .8 + hash(i * 2.2) * life) % life) / life;
    const x = x0 + (hash(i * 3.3) - .5) * 260 + Math.sin(ph * 5 + i) * 40, y = y0 - ph * 900;
    dyn.push({ x, y, ang: -1.4 + Math.sin(i) * .3, len: 120 + ph * 160, wid: 70 + ph * 120, c: hex('#f4fbf6'), type: DAB, alpha: .22 * Math.sin(ph * Math.PI), seed: i + 50, hgt: .2 });
  }
}
function embers(t, cx, cy, o = {}) {
  for (let i = 0; i < (o.n ?? 30); i++) {
    const life = 2 + hash(i) * 2, ph = (((t - (o.t0 || 0)) + hash(i * 5.5) * life) % life) / life;
    dyn.push({ x: cx + (hash(i * 3.7) - .5) * 300 + Math.sin(ph * 6 + i) * 30, y: cy - ph * 700, ang: 0, len: 9, wid: 9, c: hex(i % 3 ? '#ff8a3a' : '#ffd070'), type: DAB, alpha: Math.sin(ph * Math.PI) * (o.alpha ?? 1), seed: i + 90, hgt: .6 });
  }
}
// mouth from the voice envelope of whoever is speaking on screen
function mouth(t, who) {
  for (const [id, , t0] of LINES) if (ONSCREEN[id] === who) { const e = env[id], k = Math.floor((t - t0) * 50); if (k >= 0 && k < e.env.length) return e.env[k]; }
  return 0;
}
const blink = (t, s) => { const ph = ((t + s * 1.37) % (3.3 + s * .4)); return ph < .12 ? Math.sin(ph / .12 * Math.PI) : 0; };
const F = (f, st) => face(dyn, f, st);

// ================= SHOTS =================
const SH_ = {};
SH_.cold = (t) => {
  if (t < 3.2) {
    const p = plate('laptop'), cam = camOf(600, lerp(860, 840, t / 3.2), lerp(1.05, 1.16, ss(t / 3.2)));
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#7fa8e8'; x.font = `600 56px ${UI}`; x.textAlign = 'left'; x.fillText('03:00', 60, 90);
    x.fillStyle = '#e8eefc'; x.textAlign = 'center'; x.font = `700 120px ${UI}`; x.fillText('Payout', w / 2, h * .42);
    x.font = `italic 600 96px ${UI}`; x.fillStyle = '#ffd27a'; x.fillText('Processing', w / 2, h * .56);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * 4; x.globalAlpha = .25 + .75 * ((i - Math.floor(t * 8)) % 8 + 8) % 8 / 8; x.fillStyle = '#e8eefc'; x.beginPath(); x.arc(w / 2 + Math.cos(a) * 70, h * .72 + Math.sin(a) * 70, 12, 0, 7); x.fill(); } x.globalAlpha = 1;
    screen(T, p.a.screen, { cam, t });
    return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .4 } };
  }
  const p = plate('face27'), k = ss(seg(t, 3.2, 8)), cam = camOf(lerp(640, 660, k), lerp(1080, 990, k), lerp(.95, 1.32, k));
  drawPlate('face27', { t, cam });
  rain(t, { box: [90, 120, 650, 940], n: 70, alpha: .35, speed: .6, len: .6 }); flush({ t, cam, run: 0 });
  F(p.f.nik, { look: [.2, .15], blink: 0, brow: -.1 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .38 } };
};
SH_.title = (t) => {
  const t0 = 8, k = eo(seg(t, t0, t0 + 1.4)), cx = W / 2, base = 1260, top = base - 620 * k;
  if (k > 0) {
    dyn.push({ x: cx, y: (base + top) / 2, ang: Math.PI / 2, len: base - top, wid: 150, c: hex('#d8261c'), c2: hex('#ff4a32'), type: KNIFE, seed: 1, run: 0, hgt: 1.3 });
    dyn.push({ x: cx, y: top - 90 * k, ang: Math.PI / 2, len: 180 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 2 });
    dyn.push({ x: cx, y: base + 70 * k, ang: Math.PI / 2, len: 140 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 3 });
  }
  embers(t, cx, top, { t0, alpha: seg(t, t0 + .4, t0 + 1.2) }); flush({ t, cam: SCREEN_CAM, run: .2 });
  drawPlate('title', { t, cam: SCREEN_CAM, M: TR(40, 1380), appear: HIT.titleText, noUnder: true });
  return { post: { ground: [.03, .025, .03], vig: .5, weave: .05 } };
};
SH_.airport = (t) => {
  const p = plate('airport');
  const cam = camK(t, [[13, [560, 1050, .95]], [15.6, [600, 1100, 1.02]], [17.4, [668, 1250, 1.5]], [19.4, [660, 1200, 1.35]], [23, [600, 1060, 1.0]]]);
  drawPlate('airport', { t, cam });
  // the silver watch on his wrist + a glint when it clicks shut
  const [wx, wy] = p.a.watch, g = seg(t, HIT.watchClick, HIT.watchClick + .5);
  dyn.push({ x: wx, y: wy, ang: 1.25, len: 74, wid: 30, c: hex('#d4d8e0'), c2: hex('#8a909a'), type: KNIFE, seed: 5, hgt: 1.5 });
  dyn.push({ x: wx + 2, y: wy - 2, ang: 0, len: 34, wid: 34, c: hex('#eef2f8'), type: DAB, seed: 6, hgt: 1.6 });
  if (g > 0 && g < 1) dyn.push({ x: wx + 10, y: wy - 14, ang: .8, len: 50 * Math.sin(g * Math.PI), wid: 8, c: [1, 1, 1], type: KNIFE, seed: 7 });
  flush({ t, cam, run: 0 });
  F(p.f.achan, { mouth: mouth(t, 'achan'), smile: .2, look: [.6, .5], blink: blink(t, 2) });
  F(p.f.amma, { brow: -.8, look: [-.4, .1], blink: blink(t, 5), tear: seg(t, 18, 22) });
  F(p.f.nik, { brow: -.4, look: [t < 18 ? -.7 : .1, t < 18 ? .5 : .1], blink: blink(t, 1) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: 1.05, lightCol: [1, .9, .75] } };
};
SH_.manc = (t) => {
  const [a] = shotRange('manc'), k = seg(t, a, a + 8);
  const cam = camOf(lerp(620, 640, k), lerp(1150, 1000, k), lerp(.92, 1.12, ss(k)));
  drawPlate('manc', { t, cam });
  // walking from behind: the camera tracks him, so he holds his place in frame and bobs on each step
  const step = (t - a) * 1.9 * Math.PI, bob = Math.abs(Math.sin(step)) * 10;
  const bk = plate('back'), M = mul(TR(W / 2 - 330 * .95, 900 + bob), SC(.95));
  for (const sd of [-1, 1]) { const sw = Math.sin(step) * sd * .28; dyn.push({ x: 350 + sd * 40 + Math.sin(sw) * 150, y: 690, ang: Math.PI / 2 - sw, len: 640, wid: 64, c: hex('#26262c'), type: KNIFE, seed: 30 + sd, run: 0 }); }
  flush({ t, cam: SCREEN_CAM, M, run: 0 });
  drawPlate('back', { t, cam: SCREEN_CAM, M });
  rain(t, { n: 260, alpha: .5, ang: 1.75 }); flush({ t, cam: SCREEN_CAM, run: 0 });
  return { post: { expo: 1.0, sat: .9, lift: [.02, .025, .05], gain: [.92, .96, 1.05], spec: .3 } };
};
SH_.kitchen = (t) => {
  const p = plate('kitchen'), [a] = shotRange('kitchen');
  const cam = camOf(560 + Math.sin(t * .9) * 18, 1150 + Math.cos(t * .7) * 14, 1.05 + seg(t, a, a + 7) * .08);
  drawPlate('kitchen', { t, cam });
  steam(t, p.a.sink[0], p.a.sink[1]); flush({ t, cam, run: 0 });
  F(p.f.nik, { brow: -.5, look: [.5, .9], blink: blink(t, 3) * .6 + .25 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.02, sat: .85, gain: [.96, 1.02, .96], contrast: 1.08 } };
};
SH_.bunk = (t) => {
  const p = plate('bunk'), [a] = shotRange('bunk'), r = p.a.screen;
  const cam = camK(t, [[a, [600, 1100, .95]], [a + 2.5, [640, 1120, 1.08]], [a + 6.5, [680, 1140, 1.4]]]);
  drawPlate('bunk', { t, cam });
  const T = TX.phone, x = T.x, w = T.w, h = T.h;
  x.fillStyle = '#10141e'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
  x.fillStyle = '#c8d4f0'; x.font = `600 120px ${UI}`; x.fillText('01:47', w / 2, 240);
  if (t > HIT.emailBuzz) {
    const k = eo(seg(t, HIT.emailBuzz, HIT.emailBuzz + .4));
    x.save(); x.translate(0, (1 - k) * -200); x.fillStyle = '#f4f2ee'; x.beginPath(); x.roundRect(30, 380, w - 60, 520, 30); x.fill();
    x.fillStyle = '#7a1a14'; x.textAlign = 'left'; x.font = `700 46px ${UI}`; x.fillText('University Finance', 70, 460);
    x.fillStyle = '#16161a'; x.font = `700 62px ${UI}`; x.fillText('Tuition fee', 70, 590); x.fillText('overdue:', 70, 660);
    x.fillStyle = '#c81e14'; x.font = `700 110px ${UI}`; x.fillText('£3,200', 70, 800); x.restore();
  }
  screen(T, r, { cam, t });
  return { post: { expo: 1.02, lift: [.015, .01, .02] } };
};
SH_.call = (t) => {
  const p = plate('call'), [a] = shotRange('call');
  const cam = camK(t, [[a, [712, 690, 1.75]], [48.6, [712, 690, 1.75]], [50.0, [560, 950, 1.0]], [52.4, [560, 980, 1.0]], [54.2, [800, 1500, 1.12]]]);
  drawPlate('call', { t, cam });
  F(p.f.amma, { mouth: mouth(t, 'amma'), smile: .3, brow: -.2, blink: blink(t, 4) });
  F(p.f.nik, { mouth: mouth(t, 'nik'), smile: .55, look: [.6, -.2], blink: blink(t, 6), brow: t > 52 ? -.5 : 0 });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.03, gain: [.94, .98, 1.06] } };
};
SH_.office = (t) => {
  const p = plate('office'), [a] = shotRange('office'), k = seg(t, a, a + 8);
  const cam = camOf(lerp(520, 700, ss(k)), 1250, 1.02);
  drawPlate('office', { t, cam });
  const T = TX.mon, x = T.x, w = T.w, h = T.h; x.fillStyle = '#12161e'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 18; i++) { const y = 40 + i * 50 - ((t * 30) % 50), n = 3 + (hash(i + Math.floor(t * .6)) * 6 | 0); let xx = 30 + (hash(i * 3) * 4 | 0) * 30; for (let j = 0; j < n; j++) { const ww = 30 + hash(i * 7 + j) * 90; x.fillStyle = ['#7aa8ff', '#e8c070', '#9ad2a0', '#d8d8e0'][(i + j) % 4]; x.fillRect(xx, y, ww, 18); xx += ww + 16; } }
  screen(T, p.a.mon, { cam, t });
  F(p.f.nik, { smile: .35, look: [.8, .2], blink: blink(t, 2) }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.06, sat: 1.04, lightCol: [1, .96, .86] } };
};
SH_.pub = (t) => {
  const p = plate('pub'), [a] = shotRange('pub');
  const cam = camK(t, [[a, [600, 1150, .95]], [67.8, [600, 1150, .98]], [70.0, [626, 1300, 1.55]], [73, [626, 1300, 1.62]]]);
  drawPlate('pub', { t, cam });
  const T = TX.pub, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c1410'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#38d27a'; x.textAlign = 'center'; x.font = `700 70px ${UI}`; x.fillText('+£200', w / 2, 110);
  x.font = `italic 600 34px ${UI}`; x.fillStyle = '#9ad8b0'; x.fillText('today', w / 2, 150);
  chart(x, 20, 190, w - 40, h - 230, { n: 14, seed: 3, bias: .03, reveal: .4 + .6 * seg(t, a, a + 5) });
  screen(T, p.a.phone, { cam, t });
  F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .65, brow: .5, look: [.6, .2], blink: blink(t, 3) });
  F(p.f.nik, { smile: seg(t, 68, 71) * .4, brow: .3, look: [-.8, .7], blink: blink(t, 7) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: 1.08, lightCol: [1, .85, .6] } };
};
SH_.research = (t) => {
  const p = plate('research'), [a] = shotRange('research'), k = seg(t, a, a + 9);
  const cam = camOf(600, 1180, lerp(.98, 1.08, k));
  drawPlate('research', { t, cam });
  const T = TX.scr, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0a0e14'; x.fillRect(0, 0, w, h);
  chart(x, 20, 30, w - 40, h - 60, { n: 34, seed: 9 + Math.floor((t - a) * 1.2) * 13, bias: .004, reveal: ((t - a) * 1.2) % 1 * .7 + .3 });
  screen(T, p.a.scr, { cam, t });
  // the clock runs fast: a night passing
  const [cx, cy] = p.a.clock, hr = (t - a) * .9, mn = (t - a) * 9;
  dyn.push({ x: cx + Math.cos(hr - 1.57) * 30, y: cy + Math.sin(hr - 1.57) * 30, ang: hr - 1.57, len: 64, wid: 12, c: hex('#1a1a1e'), type: KNIFE, seed: 3 });
  dyn.push({ x: cx + Math.cos(mn - 1.57) * 45, y: cy + Math.sin(mn - 1.57) * 45, ang: mn - 1.57, len: 92, wid: 8, c: hex('#1a1a1e'), type: KNIFE, seed: 4 });
  flush({ t, cam, run: 0 });
  F(p.f.nik, { look: [.9, .3], blink: blink(t, 9) * .5, brow: .2 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, lift: [.01, .02, .02] } };
};
SH_.bath = (t) => {
  const p = plate('bath'), [a] = shotRange('bath');
  const cam = camK(t, [[a, [590, 1780, 1.3]], [86.0, [590, 1760, 1.3]], [87.8, [600, 700, 1.08]], [90, [600, 690, 1.12]]]);
  drawPlate('bath', { t, cam });
  const T = TX.bath, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c120e'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
  x.fillStyle = '#9ab8a8'; x.font = `600 40px ${UI}`; x.fillText('Today’s P&L', w / 2, 120);
  const v = t < HIT.ping1 ? null : t < HIT.ping2 ? '+£180' : '+£420', pop = t < HIT.ping2 ? seg(t, HIT.ping1, HIT.ping1 + .25) : seg(t, HIT.ping2, HIT.ping2 + .25);
  if (v) { x.save(); x.translate(w / 2, h * .55); x.scale(.8 + .2 * eo(pop), .8 + .2 * eo(pop)); x.fillStyle = '#38e27e'; x.font = `700 170px ${UI}`; x.fillText(v, 0, 0); x.restore(); }
  screen(T, p.a.scr, { cam, t });
  F(p.f.nik, { smile: lerp(.1, .95, ss(seg(t, 86.4, 88.6))), look: [0, .9 - seg(t, 87, 88) * .9], blink: blink(t, 4) }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: .95, gain: [.97, 1.02, 1] } };
};
SH_.canteen = (t) => {
  const p = plate('canteen'), [a] = shotRange('canteen'), k = seg(t, a, a + 10);
  const cam = camOf(lerp(560, 700, ss(k)), lerp(1250, 1180, k), lerp(.96, 1.15, ss(k)));
  drawPlate('canteen', { t, cam });
  F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .55, brow: .3, look: [-.7, .3], blink: blink(t, 2) });
  F(p.f.nik, { smile: .25, brow: .4, look: [.8, -.3], blink: blink(t, 8) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, sat: 1.03, lightCol: [1, .95, .85] } };
};
SH_.resign = (t) => {
  const rack = 104.0, k = seg(t, rack, rack + 3);
  const cam = camOf(lerp(560, 760, ss(k)), lerp(1250, 1000, ss(k)), lerp(.98, 1.25, ss(k)));
  let p = drawPlate('resN', { t, cam });
  if (t > rack) p = drawPlate('resJ', { t, cam, appear: rack, noUnder: t < rack + .6 });
  F(p.f.nik, { smile: .25, look: [.8, .3], blink: blink(t, 5) });
  F(p.f.jit, { look: [-.9, .2], smile: t > 106 ? .3 : 0, blink: blink(t, 1), mouth: 0 });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, gain: [.96, 1, 1.04] } };
};
SH_.walk = (t) => {
  const [a] = shotRange('walk'), k = seg(t, a, a + 7);
  const cam = camOf(600, lerp(1200, 1000, k), lerp(.95, 1.05, k));
  drawPlate('sunset', { t, cam });
  const step = (t - a) * 1.8 * Math.PI, bob = Math.abs(Math.sin(step)) * 12, sc = lerp(1.0, 1.12, k);
  const wk = plate('walker'), M = mul(TR(W / 2 - 450 * sc + Math.sin(step / 2) * 6, 480 + bob - 60 * k), SC(sc));
  drawPlate('walker', { t, cam: SCREEN_CAM, M });
  F(wk.f.nik, { smile: .65, look: [0, 0], blink: blink(t, 3), brow: .3 }); flush({ t, cam: SCREEN_CAM, M, run: 0 });
  return { post: { expo: 1.06, sat: 1.1, lightCol: [1, .82, .55], light: [.6, -.5, .7] } };
};
SH_.laptop = (t) => {
  const p = plate('laptop'), [a] = shotRange('laptop');
  const cam = camOf(600, 860, lerp(1.0, 1.12, ss(seg(t, a, HIT.silence))) + seg(t, HIT.drop, HIT.drop + .2) * .06);
  drawPlate('laptop', { t, cam });
  const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0a0f0c'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#38d27a'; x.font = `700 64px ${UI}`; x.textAlign = 'left'; x.fillText('Balance  +£3,940', 50, 90);
  const rv = clamp(seg(t, a, HIT.silence) * 1.0, .35, 1), red = t > HIT.drop ? eo(seg(t, HIT.drop, HIT.drop + .35)) * .8 : 0;
  chart(x, 30, 130, w - 60, h - 170, { n: 30, seed: 21, bias: .016, reveal: rv * .93, red });
  if (red) { x.fillStyle = `rgba(255,30,20,${.25 * red})`; x.fillRect(0, 0, w, h); x.fillStyle = '#ff3a2a'; x.fillRect(50, 40, 560, 70); x.fillStyle = '#fff'; x.fillText('Balance  −£2,180', 50, 95); }
  screen(T, p.a.screen, { cam, t });
  // the red knife floods the frame
  if (t > HIT.drop + .5) {
    const f = seg(t, HIT.drop + .5, a + 6.4);
    for (let i = 0; i < 60; i++) { const yy = (i / 60) * H * 1.1 - 40, gate = hash(i * 2.7) * .7; if (f < gate) continue; const g = clamp((f - gate) / .25); dyn.push({ x: lerp(-200, W / 2 + (hash(i) - .5) * 300, eo(g)), y: yy, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.5, wid: 70 + hash(i * 5) * 40, c: hex(i % 3 ? '#b8140e' : '#d8261c'), c2: hex('#7a0a08'), type: KNIFE, seed: i + 300, run: .3 }); }
    flush({ t, cam: SCREEN_CAM });
  }
  return { post: { expo: 1.04, lift: [.01, .01, .01], vig: .4 } };
};
SH_.ep2 = (t) => {
  for (let i = 0; i < 40; i++) dyn.push({ x: W / 2, y: (i / 40) * H * 1.05, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.6, wid: 80, c: hex(i % 3 ? '#5a0806' : '#6e0c0a'), c2: hex('#2a0404'), type: KNIFE, seed: i + 300, run: .3 });
  flush({ t, cam: SCREEN_CAM });
  drawPlate('ep2', { t, cam: SCREEN_CAM, M: TR(40, 720), appear: HIT.ep2, noUnder: true });
  return { post: { vig: .55 } };
};
SH_.end = (t) => {
  for (let i = 0; i < 40; i++) dyn.push({ x: W / 2, y: (i / 40) * H * 1.05, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.6, wid: 80, c: hex(i % 3 ? '#14120f' : '#1c1814'), type: KNIFE, seed: i + 400, run: .3 });
  flush({ t, cam: SCREEN_CAM });
  const k = eo(seg(t, HIT.end, HIT.end + .8));
  dyn.push({ x: W / 2, y: 700 - 80 * k, ang: Math.PI / 2, len: 200 * k + 1, wid: 60, c: hex('#2fb46a'), c2: hex('#5ae08e'), type: KNIFE, seed: 9, run: 0 });
  dyn.push({ x: W / 2, y: 700 - 80 * k, ang: Math.PI / 2, len: 300 * k + 1, wid: 6, c: hex('#5ae08e'), type: KNIFE, seed: 10 });
  flush({ t, cam: SCREEN_CAM, run: 0 });
  return { post: { vig: .5 } };
};

// ---------- frame ----------
function frame(t) {
  t = Math.min(t, DUR - 1e-3);
  E.begin([.05, .045, .05]);
  const id = SHOTS[shotAt(t)][0];
  const r = SH_[id](t) || {};
  E.finish({ ...(r.post || {}), ground: (r.post && r.post.ground) || [.06, .05, .05] });
  // subtitles
  const s = subAt(t);
  if (s) { subMl.textContent = s[3]; subEn.textContent = s[4]; sub.style.opacity = 1; sub.style.top = (id === 'bath' && t < 87.5 ? 320 : 1480) + 'px'; } else sub.style.opacity = 0;
  // cards in crisp type
  if (id === 'title' && t > HIT.years) { card.style.top = '1700px'; card.style.fontSize = '58px'; card.style.fontStyle = 'italic'; card.innerHTML = '4 years earlier'; card.style.opacity = seg(t, HIT.years, HIT.years + .4); }
  else if (id === 'end') { card.style.top = '880px'; card.style.fontSize = '64px'; card.style.fontStyle = 'italic'; card.innerHTML = 'A story about discipline.<br><span style="font-size:46px;color:#b8ac90">Not financial advice.</span>'; card.style.opacity = seg(t, HIT.end + .3, HIT.end + .9); }
  else card.style.opacity = 0;
}
function subAt(t) {
  for (let i = 0; i < LINES.length; i++) { const [id, , t0, , en] = LINES[i], d = env[id].dur, next = i + 1 < LINES.length ? LINES[i + 1][2] - .1 : DUR;
    const t1 = Math.min(next, Math.max(t0 + d + .6, t0 + en.replace(/\s/g, '').length / 15 + 1.7, t0 + 1.9));
    if (t >= t0 - .1 && t < t1) return LINES[i]; }
  return null;
}
function texts(t) {
  const out = [], s = subAt(t);
  if (s) { const top = SHOTS[shotAt(t)][0] === 'bath' && t < 87.5 ? 320 : 1480; out.push({ id: 'en', text: s[4], x0: 70, y0: top, x1: W - 70, y1: top + 200 }, { id: 'ml', text: s[3], x0: 70, y0: top, x1: W - 70, y1: top + 100, pass: true }); }
  const id = SHOTS[shotAt(t)][0];
  if (id === 'title' && t > HIT.years) out.push({ id: 'years', text: '4 years earlier', x0: 200, y0: 1700, x1: 880, y1: 1780 });
  if (id === 'end' && t > HIT.end + .3) out.push({ id: 'end', text: 'A story about discipline. Not financial advice.', x0: 60, y0: 880, x1: 1020, y1: 1060 });
  return out;
}
function events() {
  const ev = SHOTS.map(([id, t]) => ({ t, type: 'cut', id }));
  for (const [k, v] of Object.entries(HIT)) ev.push({ t: v, type: k });
  for (const [id, who, t0] of LINES) ev.push({ t: t0, type: 'line', id, who, dur: 0 });
  return ev.sort((a, b) => a.t - b.t);
}
