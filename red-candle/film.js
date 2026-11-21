// Red Candle · Episode 1 — 60 s Instagram Reel. Every frame repainted from knife strokes;
// every cut is a paint-over: the next shot is laid in with the knife, top to bottom, over the last frame of the previous one.
import { Impasto, Strokes, KNIFE, BRUSH, DAB, LINE, hex } from './engine/impasto.js';
import { W, H, DUR, SHOTS, LINES, ONSCREEN, HIT, TRANS, shotAt, shotRange } from './timeline.js';
import * as S from './scenes/sets.js';
import { face } from './scenes/people.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';

const SW = S.SW, SH = S.SH;
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const TR = (x, y) => [1, 0, 0, 1, x, y], SC = s => [s, 0, 0, s, 0, 0];
// keys on the shot's own 0..1 clock
const key = (u, ks) => { if (u <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0] = ks[i], [t1, v1] = ks[i + 1]; if (u < t1) { const k = eio((u - t0) / (t1 - t0)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); } } return ks[ks.length - 1][1]; };
// transition state: CAMZ pushes the camera (the old shot rushes in as it is painted over; the new one settles)
let CAMZ = 1, APPEAR = null, TK = 1;
const camOf = (x, y, z, pw = SW, ph = SH) => { z = Math.max(z * CAMZ, Math.max(W / pw, H / ph)); const hx = W / 2 / z, hy = H / 2 / z; return { x: clamp(x, hx, pw - hx), y: clamp(y, hy, ph - hy), zoom: z }; };
const camK = (u, ks) => { const v = key(u, ks); return camOf(v[0], v[1], v[2]); };
const SCREEN_CAM = { x: W / 2, y: H / 2, zoom: 1 };
const U = (id, t) => { const [a, b] = shotRange(id); return clamp((t - a) / (b - a)); };

let E, dyn, env, sub, subMl, subEn, card, P = {}, TX = {};
const APP = (x, y, w, h) => (y / h) * .32 + (x / w) * .05;     // per-stroke delay in the paint-over sweep

export async function setup(canvas) {
  for (const f of ['700 100px "Cormorant Garamond"', 'italic 600 100px "Cormorant Garamond"', '400 40px Manjari', '700 40px Manjari']) await document.fonts.load(f, 'അആ');
  E = new Impasto(canvas, { W, H, ss: 2 }); dyn = new Strokes(8192);
  env = await (await fetch('audio/env.json')).json();
  for (const [k, w, h] of [['lap', 960, 850], ['mon', 488, 298], ['pub', 176, 320], ['scr', 508, 348], ['bath', 360, 520]]) TX[k] = mkTex(w * 2, h * 2);
  sub = document.createElement('div');
  sub.style.cssText = 'position:fixed;left:70px;right:70px;top:1380px;text-align:center;padding:22px 26px 24px;border-radius:14px;background:rgba(12,10,14,.55);opacity:0;';
  subMl = document.createElement('div'); subMl.style.cssText = 'font-family:Manjari;font-weight:700;font-size:42px;line-height:1.35;color:#f4ead8;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  subEn = document.createElement('div'); subEn.style.cssText = 'font-family:"Cormorant Garamond";font-style:italic;font-weight:600;font-size:42px;line-height:1.2;margin-top:10px;color:#e8d8b0;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  sub.append(subMl, subEn); document.body.appendChild(sub);
  card = document.createElement('div');
  card.style.cssText = 'position:fixed;left:60px;right:60px;text-align:center;font-family:"Cormorant Garamond";color:#efe2c4;opacity:0;text-shadow:0 2px 8px rgba(0,0,0,.7)';
  document.body.appendChild(card);
  window.DUR = DUR; window.EV = events(); window.TEXTS = texts;
  return frame;
}

const BUILD = {
  laptop: S.buildLaptop, face27: S.buildFace27, airport: S.buildAirport, manc: S.buildManc, back: S.buildBackNik, kitchen: S.buildKitchen,
  call: S.buildCall, office: S.buildOffice, pub: S.buildPub, research: S.buildResearch, bath: S.buildBath,
  canteen: S.buildCanteen, resN: () => S.buildResign('nik'), resJ: () => S.buildResign('jit'), sunset: S.buildSunset, walker: S.buildWalker,
  title: S.buildTitleText, ep2: S.buildEp2Text,
};
function plate(k) {
  if (P[k]) return P[k];
  const b = BUILD[k](), d = b.strokes.data(), w = b.ref.w, h = b.ref.h;
  for (let i = 0; i < d.length; i += 20) d[i + 14] = APP(d[i], d[i + 1], w, h);
  return P[k] = { b: E.batch(d), tex: E.texture(b.ref.ctx.canvas), w, h, f: b.f || {}, a: b.a || {} };
}
// o.appear: lay this plate in with the knife from that time (defaults to the current transition)
function drawPlate(k, o) {
  const p = plate(k), M = o.M || [1, 0, 0, 1, 0, 0];
  const ap = o.appear ?? APPEAR, inT = ap !== null && ap !== undefined && o.t < ap + 1.0;
  if (!o.noUnder) E.under(p.tex, p.w, p.h, { ...o, M, grey: 0, alpha: (o.alpha ?? 1) * (inT ? seg(o.t, ap + .3, ap + .5) : 1) });
  E.draw(p.b, { grey: 0, ...o, M, appear: inT ? ap : -1e6, appDur: .1 });
  return p;
}
// live strokes join the same sweep (their delay from their height on screen)
const flush = o => {
  if (!dyn.n) return;
  if (APPEAR !== null && TK < 1) { const d = dyn.data(), sy = o.cam ? o.cam.zoom : 1; for (let i = 0; i < d.length; i += 20) { const yf = o.M ? (o.M[5] + d[i + 1] * o.M[3]) / H : o.cam ? d[i + 1] / SH : d[i + 1] / H; d[i + 14] = clamp(yf) * .32 + .05; } }
  E.drawNow(dyn.data(), { grey: 0, ...o, appear: APPEAR !== null && TK < 1 ? APPEAR : -1e6, appDur: .1 }); dyn.clear();
};

// ---------- textures ----------
function mkTex(w, h) {
  const gl = E.gl, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const x = cv.getContext('2d'); x.scale(2, 2); return { cv, x, t, w: w / 2, h: h / 2 };
}
function upTex(T) { const gl = E.gl; gl.bindTexture(gl.TEXTURE_2D, T.t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, T.cv); }
// screens arrive once the knife has passed over them
function screen(T, rect, o) { if (TK < .75) return; upTex(T); E.under(T.t, rect[2], rect[3], { ...o, M: TR(rect[0], rect[1]), grey: 0, alpha: 1 }); }

function chart(x, X, Y, Wd, Ht, o = {}) {
  const n = o.n ?? 26, cw = Wd / n; let p = .55, pts = [];
  for (let i = 0; i < n; i++) { const d = (hash(i * 3.1 + (o.seed || 0)) - .5) * .09 + (o.bias ?? .012); const op = p; p = clamp(p + d, .1, .92); pts.push([op, p]); }
  x.save(); x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2;
  for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(X, Y + Ht * k / 5); x.lineTo(X + Wd, Y + Ht * k / 5); x.stroke(); }
  const shown = Math.max(1, Math.floor(n * (o.reveal ?? 1)));
  for (let i = 0; i < shown; i++) {
    let [a, b] = pts[i]; const up = b >= a; const cx = X + cw * (i + .5);
    const hi = Math.max(a, b) + hash(i * 7.7) * .04, lo = Math.min(a, b) - hash(i * 5.3) * .04;
    x.strokeStyle = x.fillStyle = up ? '#38d27a' : '#ff4a3c';
    x.lineWidth = Math.max(2, cw * .1); x.beginPath(); x.moveTo(cx, Y + Ht * (1 - hi)); x.lineTo(cx, Y + Ht * (1 - lo)); x.stroke();
    x.fillRect(cx - cw * .32, Y + Ht * (1 - Math.max(a, b)), cw * .64, Math.max(3, Ht * Math.abs(b - a)));
  }
  if (o.red) { const cx = X + cw * (shown + .5), top = pts[shown - 1][1]; x.fillStyle = '#ff2a1e'; x.fillRect(cx - cw * .4, Y + Ht * (1 - top), cw * .8, Ht * o.red); }
  x.restore();
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
    dyn.push({ x: x0 + (hash(i * 3.3) - .5) * 260 + Math.sin(ph * 5 + i) * 40, y: y0 - ph * 900, ang: -1.4 + Math.sin(i) * .3, len: 120 + ph * 160, wid: 70 + ph * 120, c: hex('#f4fbf6'), type: DAB, alpha: .22 * Math.sin(ph * Math.PI), seed: i + 50, hgt: .2 });
  }
}
function embers(t, cx, cy, o = {}) {
  for (let i = 0; i < (o.n ?? 30); i++) {
    const life = 2 + hash(i) * 2, ph = (((t - (o.t0 || 0)) + hash(i * 5.5) * life) % life) / life;
    dyn.push({ x: cx + (hash(i * 3.7) - .5) * 300 + Math.sin(ph * 6 + i) * 30, y: cy - ph * 700, ang: 0, len: 9, wid: 9, c: hex(i % 3 ? '#ff8a3a' : '#ffd070'), type: DAB, alpha: Math.sin(ph * Math.PI) * (o.alpha ?? 1), seed: i + 90, hgt: .6 });
  }
}
function mouth(t, who) {
  for (const [id, , t0] of LINES) if (ONSCREEN[id] === who) { const e = env[id], k = Math.floor((t - t0) * 50); if (k >= 0 && k < e.env.length) return e.env[k]; }
  return 0;
}
const blink = (t, s) => { const ph = ((t + s * 1.37) % (3.3 + s * .4)); return ph < .12 ? Math.sin(ph / .12 * Math.PI) : 0; };
const F = (f, st) => face(dyn, f, st);

// ================= SHOTS (u = the shot's own 0..1 clock) =================
const SH_ = {};
SH_.cold = (t) => {
  const p = plate('laptop'), u = U('cold', t), cam = camOf(600, lerp(880, 830, u), lerp(1.04, 1.22, ss(u)));
  drawPlate('laptop', { t, cam });
  const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#7fa8e8'; x.font = `600 56px ${UI}`; x.textAlign = 'left'; x.fillText('03:00', 60, 90);
  x.fillStyle = '#e8eefc'; x.textAlign = 'center'; x.font = `700 120px ${UI}`; x.fillText('Payout', w / 2, h * .42);
  x.font = `italic 600 96px ${UI}`; x.fillStyle = '#ffd27a'; x.fillText('Processing', w / 2, h * .56);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * 4; x.globalAlpha = .25 + .75 * ((i - Math.floor(t * 8)) % 8 + 8) % 8 / 8; x.fillStyle = '#e8eefc'; x.beginPath(); x.arc(w / 2 + Math.cos(a) * 70, h * .72 + Math.sin(a) * 70, 12, 0, 7); x.fill(); } x.globalAlpha = 1;
  screen(T, p.a.screen, { cam, t });
  return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .4 } };
};
SH_.face = (t) => {
  const p = plate('face27'), u = ss(U('face', t)), cam = camOf(lerp(640, 660, u), lerp(1080, 990, u), lerp(1.0, 1.4, u));
  drawPlate('face27', { t, cam });
  rain(t, { box: [90, 120, 650, 940], n: 70, alpha: .35, speed: .6, len: .6 }); flush({ t, cam, run: 0 });
  F(p.f.nik, { look: [.2, .15], blink: 0, brow: -.1 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .38 } };
};
SH_.title = (t) => {
  const t0 = HIT.titleCandle, k = eo(seg(t, t0, t0 + .9)), cx = W / 2, base = 1260, top = base - 620 * k;
  if (k > 0) {
    dyn.push({ x: cx, y: (base + top) / 2, ang: Math.PI / 2, len: base - top, wid: 150, c: hex('#d8261c'), c2: hex('#ff4a32'), type: KNIFE, seed: 1, hgt: 1.3 });
    dyn.push({ x: cx, y: top - 90 * k, ang: Math.PI / 2, len: 180 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 2 });
    dyn.push({ x: cx, y: base + 70 * k, ang: Math.PI / 2, len: 140 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 3 });
  }
  embers(t, cx, top, { t0, alpha: seg(t, t0 + .3, t0 + .9) }); flush({ t, run: .2 });
  drawPlate('title', { t, cam: SCREEN_CAM, M: TR(40, 1380), appear: HIT.titleText, noUnder: true });
  return { post: { ground: [.03, .025, .03], vig: .5, weave: .05 } };
};
SH_.airport = (t) => {
  const p = plate('airport'), u = U('airport', t);
  const cam = camK(u, [[0, [560, 1050, .98]], [.3, [640, 1200, 1.3]], [.5, [668, 1260, 1.55]], [1, [600, 1050, 1.05]]]);
  drawPlate('airport', { t, cam });
  const [wx, wy] = p.a.watch, g = seg(t, HIT.watchClick, HIT.watchClick + .5);
  dyn.push({ x: wx, y: wy, ang: 1.25, len: 74, wid: 30, c: hex('#d4d8e0'), c2: hex('#8a909a'), type: KNIFE, seed: 5, hgt: 1.5 });
  dyn.push({ x: wx + 2, y: wy - 2, ang: 0, len: 34, wid: 34, c: hex('#eef2f8'), type: DAB, seed: 6, hgt: 1.6 });
  if (g > 0 && g < 1) dyn.push({ x: wx + 10, y: wy - 14, ang: .8, len: 50 * Math.sin(g * Math.PI), wid: 8, c: [1, 1, 1], type: KNIFE, seed: 7 });
  F(p.f.achan, { mouth: mouth(t, 'achan'), smile: .2, look: [.6, .5], blink: blink(t, 2) });
  F(p.f.amma, { brow: -.8, look: [-.4, .1], blink: blink(t, 5), tear: seg(u, .4, .9) });
  F(p.f.nik, { brow: -.4, look: [u < .5 ? -.7 : .1, u < .5 ? .5 : .1], blink: blink(t, 1) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: 1.05, lightCol: [1, .9, .75] } };
};
SH_.manc = (t) => {
  const [a] = shotRange('manc'), u = U('manc', t);
  const cam = camOf(lerp(620, 640, u), lerp(1150, 980, u), lerp(.95, 1.2, ss(u)));
  drawPlate('manc', { t, cam });
  const step = (t - a) * 1.9 * Math.PI, bob = Math.abs(Math.sin(step)) * 10;
  const M = mul(TR(W / 2 - 330 * .95, 900 + bob), SC(.95));
  for (const sd of [-1, 1]) { const sw = Math.sin(step) * sd * .28; dyn.push({ x: 350 + sd * 40 + Math.sin(sw) * 150, y: 690, ang: Math.PI / 2 - sw, len: 640, wid: 64, c: hex('#26262c'), type: KNIFE, seed: 30 + sd }); }
  flush({ t, cam: SCREEN_CAM, M, run: 0 });
  drawPlate('back', { t, cam: SCREEN_CAM, M, appear: APPEAR !== null ? APPEAR + .18 : undefined });
  rain(t, { n: 260, alpha: .5, ang: 1.75 }); flush({ t, run: 0 });
  return { post: { expo: 1.0, sat: .9, lift: [.02, .025, .05], gain: [.92, .96, 1.05], spec: .3 } };
};
SH_.kitchen = (t) => {
  const p = plate('kitchen'), u = U('kitchen', t);
  const cam = camOf(560 + Math.sin(t * 1.3) * 20, 1150 + Math.cos(t * 1.1) * 16, 1.04 + ss(u) * .16);
  drawPlate('kitchen', { t, cam });
  steam(t, p.a.sink[0], p.a.sink[1]); flush({ t, cam, run: 0 });
  F(p.f.nik, { brow: -.5, look: [.5, .9], blink: blink(t, 3) * .6 + .25 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.02, sat: .85, gain: [.96, 1.02, .96], contrast: 1.08 } };
};
SH_.call = (t) => {
  const p = plate('call'), u = U('call', t);
  const cam = camK(u, [[0, [712, 690, 1.75]], [.4, [712, 700, 1.7]], [.55, [560, 950, 1.02]], [.72, [560, 980, 1.02]], [1, [820, 1500, 1.18]]]);
  drawPlate('call', { t, cam });
  F(p.f.amma, { mouth: mouth(t, 'amma'), smile: .3, brow: -.2, blink: blink(t, 4) });
  F(p.f.nik, { mouth: mouth(t, 'nik'), smile: .55, look: [.6, -.2], blink: blink(t, 6), brow: t > HIT.reveal ? -.5 : 0 });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.03, gain: [.94, .98, 1.06] } };
};
SH_.office = (t) => {
  const p = plate('office'), u = U('office', t);
  const cam = camOf(lerp(500, 720, ss(u)), lerp(1280, 1220, u), lerp(1.02, 1.1, u));
  drawPlate('office', { t, cam });
  const T = TX.mon, x = T.x, w = T.w, h = T.h; x.fillStyle = '#12161e'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) { const y = 20 + i * 32 - ((t * 30) % 32); let xx = 16 + (hash(i * 3) * 4 | 0) * 16; const n = 3 + (hash(i + Math.floor(t * .6)) * 5 | 0); for (let j = 0; j < n; j++) { const ww = 16 + hash(i * 7 + j) * 50; x.fillStyle = ['#7aa8ff', '#e8c070', '#9ad2a0', '#d8d8e0'][(i + j) % 4]; x.fillRect(xx, y, ww, 10); xx += ww + 9; } }
  screen(T, p.a.mon, { cam, t });
  F(p.f.nik, { smile: .35, look: [.8, .2], blink: blink(t, 2) }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.06, sat: 1.04, lightCol: [1, .96, .86] } };
};
SH_.pub = (t) => {
  const p = plate('pub'), u = U('pub', t);
  const cam = camK(u, [[0, [600, 1150, .98]], [.5, [600, 1150, 1.02]], [.8, [626, 1300, 1.55]], [1, [626, 1300, 1.62]]]);
  drawPlate('pub', { t, cam });
  const T = TX.pub, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c1410'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#38d27a'; x.textAlign = 'center'; x.font = `700 40px ${UI}`; x.fillText('+£200', w / 2, 56);
  x.font = `italic 600 20px ${UI}`; x.fillStyle = '#9ad8b0'; x.fillText('today', w / 2, 80);
  chart(x, 10, 96, w - 20, h - 116, { n: 14, seed: 3, bias: .03, reveal: .4 + .6 * u });
  screen(T, p.a.phone, { cam, t });
  F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .65, brow: .5, look: [.6, .2], blink: blink(t, 3) });
  F(p.f.nik, { smile: seg(u, .55, .9) * .4, brow: .3, look: [-.8, .7], blink: blink(t, 7) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: 1.08, lightCol: [1, .85, .6] } };
};
SH_.research = (t) => {
  const p = plate('research'), [a] = shotRange('research'), u = U('research', t);
  const cam = camOf(lerp(560, 640, u), 1180, lerp(1.0, 1.16, ss(u)));
  drawPlate('research', { t, cam });
  const T = TX.scr, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0a0e14'; x.fillRect(0, 0, w, h);
  chart(x, 10, 15, w - 20, h - 30, { n: 34, seed: 9 + Math.floor((t - a) * 2) * 13, bias: .004, reveal: ((t - a) * 2) % 1 * .7 + .3 });
  screen(T, p.a.scr, { cam, t });
  const [cx, cy] = p.a.clock, hr = (t - a) * 1.6, mn = (t - a) * 16;
  dyn.push({ x: cx + Math.cos(hr - 1.57) * 30, y: cy + Math.sin(hr - 1.57) * 30, ang: hr - 1.57, len: 64, wid: 12, c: hex('#1a1a1e'), type: KNIFE, seed: 3 });
  dyn.push({ x: cx + Math.cos(mn - 1.57) * 45, y: cy + Math.sin(mn - 1.57) * 45, ang: mn - 1.57, len: 92, wid: 8, c: hex('#1a1a1e'), type: KNIFE, seed: 4 });
  F(p.f.nik, { look: [.9, .3], blink: blink(t, 9) * .5, brow: .2 }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, lift: [.01, .02, .02] } };
};
SH_.bath = (t) => {
  const p = plate('bath'), u = U('bath', t);
  const cam = camK(u, [[0, [590, 1780, 1.3]], [.62, [590, 1760, 1.32]], [.85, [600, 700, 1.1]], [1, [600, 690, 1.14]]]);
  drawPlate('bath', { t, cam });
  const T = TX.bath, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c120e'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
  x.fillStyle = '#9ab8a8'; x.font = `600 40px ${UI}`; x.fillText('Today’s P&L', w / 2, 120);
  const v = t < HIT.ping1 ? null : t < HIT.ping2 ? '+£180' : '+£420', pop = t < HIT.ping2 ? seg(t, HIT.ping1, HIT.ping1 + .25) : seg(t, HIT.ping2, HIT.ping2 + .25);
  if (v) { x.save(); x.translate(w / 2, h * .55); x.scale(.8 + .2 * eo(pop), .8 + .2 * eo(pop)); x.fillStyle = '#38e27e'; x.font = `700 130px ${UI}`; x.fillText(v, 0, 0); x.restore(); }
  screen(T, p.a.scr, { cam, t });
  F(p.f.nik, { smile: lerp(.1, .95, ss(seg(u, .6, .95))), look: [0, .9 - seg(u, .65, .9) * .9], blink: blink(t, 4) }); flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, sat: .95, gain: [.97, 1.02, 1] } };
};
SH_.canteen = (t) => {
  const p = plate('canteen'), u = U('canteen', t);
  const cam = camOf(lerp(540, 720, ss(u)), lerp(1260, 1170, u), lerp(.98, 1.22, ss(u)));
  drawPlate('canteen', { t, cam });
  F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .55, brow: .3, look: [-.7, .3], blink: blink(t, 2) });
  F(p.f.nik, { smile: .25, brow: .4, look: [.8, -.3], blink: blink(t, 8) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.05, sat: 1.03, lightCol: [1, .95, .85] } };
};
SH_.resign = (t) => {
  const rack = HIT.rack, k = seg(t, rack, rack + 1.6);
  const cam = camOf(lerp(540, 770, ss(k)), lerp(1260, 990, ss(k)), lerp(1.0, 1.3, ss(k)));
  let p = drawPlate('resN', { t, cam });
  if (t > rack) p = drawPlate('resJ', { t, cam, appear: rack, noUnder: t < rack + .5 });
  F(p.f.nik, { smile: .25, look: [.8, .3], blink: blink(t, 5) });
  F(p.f.jit, { look: [-.9, .2], smile: t > HIT.sip + .6 ? .3 : 0, blink: blink(t, 1) });
  flush({ t, cam, run: 0 });
  return { post: { expo: 1.04, gain: [.96, 1, 1.04] } };
};
SH_.walk = (t) => {
  const [a] = shotRange('walk'), u = U('walk', t);
  const cam = camOf(600, lerp(1200, 1000, u), lerp(.96, 1.08, u));
  drawPlate('sunset', { t, cam });
  const step = (t - a) * 1.9 * Math.PI, bob = Math.abs(Math.sin(step)) * 12, sc = lerp(1.0, 1.14, u) * CAMZ;
  const wk = plate('walker'), M = mul(TR(W / 2 - 450 * sc + Math.sin(step / 2) * 6, 480 + bob - 60 * u), SC(sc));
  drawPlate('walker', { t, cam: SCREEN_CAM, M, appear: APPEAR !== null ? APPEAR + .12 : undefined });
  F(wk.f.nik, { smile: .65, look: [0, 0], blink: blink(t, 3), brow: .3 }); flush({ t, cam: SCREEN_CAM, M, run: 0 });
  return { post: { expo: 1.06, sat: 1.1, lightCol: [1, .82, .55], light: [.6, -.5, .7] } };
};
SH_.laptop = (t) => {
  const p = plate('laptop'), [a] = shotRange('laptop');
  const cam = camOf(600, 860, lerp(1.0, 1.16, ss(seg(t, a, HIT.silence))) + seg(t, HIT.drop, HIT.drop + .2) * .07);
  drawPlate('laptop', { t, cam });
  const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0a0f0c'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#38d27a'; x.font = `700 64px ${UI}`; x.textAlign = 'left'; x.fillText('Balance  +£3,940', 50, 90);
  const rv = clamp(.45 + seg(t, a, HIT.silence) * .6, 0, 1), red = t > HIT.drop ? eo(seg(t, HIT.drop, HIT.drop + .3)) * .8 : 0;
  chart(x, 30, 130, w - 60, h - 170, { n: 30, seed: 21, bias: .016, reveal: rv * .93, red });
  if (red) { x.fillStyle = `rgba(255,30,20,${.25 * red})`; x.fillRect(0, 0, w, h); x.fillStyle = '#ff3a2a'; x.fillRect(50, 40, 560, 70); x.fillStyle = '#fff'; x.fillText('Balance  −£2,180', 50, 95); }
  screen(T, p.a.screen, { cam, t });
  if (t > HIT.drop + .35) {   // the red knife floods the frame
    const f = seg(t, HIT.drop + .35, shotRange('laptop')[1]);
    for (let i = 0; i < 60; i++) { const yy = (i / 60) * H * 1.1 - 40, gate = hash(i * 2.7) * .7; if (f < gate) continue; const g = clamp((f - gate) / .25); dyn.push({ x: lerp(-200, W / 2 + (hash(i) - .5) * 300, eo(g)), y: yy, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.5, wid: 70 + hash(i * 5) * 40, c: hex(i % 3 ? '#b8140e' : '#d8261c'), c2: hex('#7a0a08'), type: KNIFE, seed: i + 300, run: .3 }); }
    flush({ t });
  }
  return { post: { expo: 1.04, lift: [.01, .01, .01], vig: .4 } };
};
SH_.ep2 = (t) => {
  for (let i = 0; i < 40; i++) dyn.push({ x: W / 2, y: (i / 40) * H * 1.05, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.6, wid: 80, c: hex(i % 3 ? '#5a0806' : '#6e0c0a'), c2: hex('#2a0404'), type: KNIFE, seed: i + 300, run: .3 });
  flush({ t });
  drawPlate('ep2', { t, cam: SCREEN_CAM, M: TR(40, 620), appear: HIT.ep2, noUnder: true });
  return { post: { vig: .55 } };
};

// ---------- frame: shot + paint-over transition ----------
function renderShot(i, t) { return SH_[SHOTS[i][0]](t) || {}; }
function frame(t) {
  t = Math.min(t, DUR - 1e-3);
  const i = shotAt(t), a = SHOTS[i][1], k = i > 0 ? (t - a) / TRANS : 1;
  E.begin([.05, .045, .05]);
  let r;
  if (k < 1) {
    // the outgoing shot, frozen on its last moment, rushing in
    CAMZ = 1 + .14 * k * k; APPEAR = null; TK = 1;
    renderShot(i - 1, a - 1e-3);
    CAMZ = 1.07 - .07 * eo(k); APPEAR = a; TK = k;
    r = renderShot(i, t);
  } else { CAMZ = 1 + .07 * (1 - eo(clamp((t - a) / (TRANS * 2) + .5))); APPEAR = null; TK = 1; r = renderShot(i, t); }
  CAMZ = 1; APPEAR = null; TK = 1;
  E.finish({ ...(r.post || {}), ground: (r.post && r.post.ground) || [.06, .05, .05] });
  const id = SHOTS[i][0];
  const s = subAt(t), top = subTop(t);
  if (s) { subMl.textContent = s[3]; subEn.textContent = s[4]; sub.style.opacity = 1; sub.style.top = top + 'px'; } else sub.style.opacity = 0;
  if (id === 'title' && t > HIT.years) { card.style.top = '1700px'; card.style.fontSize = '58px'; card.style.fontStyle = 'italic'; card.innerHTML = '4 years earlier'; card.style.opacity = seg(t, HIT.years, HIT.years + .3); }
  else if (id === 'ep2' && t > HIT.ep2 + .9) { card.style.top = '1180px'; card.style.fontSize = '44px'; card.style.fontStyle = 'italic'; card.innerHTML = 'A story about discipline.<br><span style="font-size:36px;color:#c8b89a">Not financial advice.</span>'; card.style.opacity = seg(t, HIT.ep2 + .9, HIT.ep2 + 1.3); }
  else card.style.opacity = 0;
}
const subTop = t => SHOTS[shotAt(t)][0] === 'bath' && t < HIT.ping2 + .9 ? 300 : 1380;
function subAt(t) {
  for (let i = 0; i < LINES.length; i++) { const [id, , t0] = LINES[i], d = env[id].dur, next = i + 1 < LINES.length ? LINES[i + 1][2] - .1 : DUR;
    const t1 = Math.min(next, Math.max(t0 + d + .45, t0 + 1.7));
    if (t >= t0 - .1 && t < t1) return LINES[i]; }
  return null;
}
function texts(t) {
  const out = [], s = subAt(t), top = subTop(t);
  if (s) out.push({ id: 'en', text: s[4], x0: 70, y0: top, x1: W - 70, y1: top + 200 }, { id: 'ml', text: s[3], x0: 70, y0: top, x1: W - 70, y1: top + 100, pass: true });
  return out;
}
function events() {
  const ev = SHOTS.map(([id, t]) => ({ t, type: 'cut', id }));
  for (const [k, v] of Object.entries(HIT)) ev.push({ t: v, type: k });
  for (const [id, who, t0] of LINES) ev.push({ t: t0, type: 'line', id, who });
  return ev.sort((a, b) => a.t - b.t);
}
