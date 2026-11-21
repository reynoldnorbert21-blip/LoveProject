// Shared film core for the Red Candle reels: plates, paint-over transitions, live screens, faces, subtitles, cards.
// An episode's film.js calls run(canvas, { TL, BUILD, SHOTS: shot functions, TEX: {name:[w,h]} }).
import { Impasto, Strokes, KNIFE, BRUSH, DAB, LINE, hex } from './engine/impasto.js';
import { face } from './scenes/people.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';
export { KNIFE, BRUSH, DAB, LINE, hex, clamp, lerp, ss, seg, eo, eio, hash };

export const W = 1080, H = 1920, SW = 1200, SH = 2134;
export const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
export const TR = (x, y) => [1, 0, 0, 1, x, y], SC = s => [s, 0, 0, s, 0, 0];
export const key = (u, ks) => { if (u <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0] = ks[i], [t1, v1] = ks[i + 1]; if (u < t1) { const k = eio((u - t0) / (t1 - t0)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); } } return ks[ks.length - 1][1]; };
let CAMZ = 1, APPEAR = null, TK = 1;
export const camOf = (x, y, z, rot = 0) => { z = Math.max(z * CAMZ, Math.max(W / SW, H / SH) * (1 + Math.abs(rot) * 1.2)); const hx = W / 2 / z, hy = H / 2 / z; return { x: clamp(x, hx, SW - hx), y: clamp(y, hy, SH - hy), zoom: z, rot }; };
export const camK = (u, ks) => { const v = key(u, ks); return camOf(v[0], v[1], v[2], v[3] || 0); };
export const SCREEN_CAM = { x: W / 2, y: H / 2, zoom: 1 };
export const UI = '"Cormorant Garamond", serif';

let E, TL, BUILD, SHOT, env, sub, subMl, subEn, card;
const P = {}; export const TX = {}; export const dyn = new Strokes(8192);
export const U = (id, t) => { const [a, b] = TL.shotRange(id); return clamp((t - a) / (b - a)); };
export const range = id => TL.shotRange(id);

export async function run(canvas, cfg) {
  TL = cfg.TL; BUILD = cfg.BUILD; SHOT = cfg.SHOTS;
  for (const f of ['700 100px "Cormorant Garamond"', 'italic 600 100px "Cormorant Garamond"', '400 40px Manjari', '700 40px Manjari']) await document.fonts.load(f, 'അആ');
  E = new Impasto(canvas, { W, H, ss: 2 });
  env = await (await fetch('audio/env.json')).json();
  for (const [k, [w, h]] of Object.entries(cfg.TEX || {})) TX[k] = mkTex(w * 2, h * 2);
  sub = document.createElement('div');
  sub.style.cssText = 'position:fixed;left:70px;right:70px;top:1380px;text-align:center;padding:22px 26px 24px;border-radius:14px;background:rgba(12,10,14,.55);opacity:0;';
  subMl = document.createElement('div'); subMl.style.cssText = 'font-family:Manjari;font-weight:700;font-size:42px;line-height:1.35;color:#f4ead8;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  subEn = document.createElement('div'); subEn.style.cssText = 'font-family:"Cormorant Garamond";font-style:italic;font-weight:600;font-size:42px;line-height:1.2;margin-top:10px;color:#e8d8b0;text-shadow:0 2px 6px rgba(0,0,0,.6)';
  sub.append(subMl, subEn); document.body.appendChild(sub);
  card = document.createElement('div');
  card.style.cssText = 'position:fixed;left:60px;right:60px;text-align:center;font-family:"Cormorant Garamond";color:#efe2c4;opacity:0;text-shadow:0 2px 10px rgba(0,0,0,.8)';
  document.body.appendChild(card);
  window.DUR = TL.DUR; window.EV = events(); window.TEXTS = texts;
  return frame;
}

const APP = (x, y, w, h) => (y / h) * .32 + (x / w) * .05;
export function plate(k) {
  if (P[k]) return P[k];
  const b = BUILD[k](), d = b.strokes.data(), w = b.ref.w, h = b.ref.h;
  for (let i = 0; i < d.length; i += 20) d[i + 14] = APP(d[i], d[i + 1], w, h);
  return P[k] = { b: E.batch(d), tex: E.texture(b.ref.ctx.canvas), w, h, f: b.f || {}, a: b.a || {} };
}
export function drawPlate(k, o) {
  const p = plate(k), M = o.M || [1, 0, 0, 1, 0, 0];
  const ap = o.appear ?? APPEAR, inT = ap !== null && ap !== undefined && o.t < ap + 1.0;
  if (!o.noUnder) E.under(p.tex, p.w, p.h, { ...o, M, grey: 0, alpha: (o.alpha ?? 1) * (inT ? seg(o.t, ap + .3, ap + .5) : 1) });
  E.draw(p.b, { grey: 0, ...o, M, appear: inT ? ap : -1e6, appDur: .1 });
  return p;
}
export const appearLate = d => APPEAR !== null ? APPEAR + d : undefined;
export const flush = o => {
  if (!dyn.n) return;
  if (APPEAR !== null && TK < 1) { const d = dyn.data(); for (let i = 0; i < d.length; i += 20) { const yf = o.M ? (o.M[5] + d[i + 1] * o.M[3]) / H : o.cam ? d[i + 1] / SH : d[i + 1] / H; d[i + 14] = clamp(yf) * .32 + .05; } }
  E.drawNow(dyn.data(), { grey: 0, ...o, appear: APPEAR !== null && TK < 1 ? APPEAR : -1e6, appDur: .1 }); dyn.clear();
};
function mkTex(w, h) {
  const gl = E.gl, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const x = cv.getContext('2d'); x.scale(2, 2); return { cv, x, t, w: w / 2, h: h / 2 };
}
export function screen(T, rect, o) { if (TK < .75) return; const gl = E.gl; gl.bindTexture(gl.TEXTURE_2D, T.t); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, T.cv); E.under(T.t, rect[2], rect[3], { ...o, M: TR(rect[0], rect[1]), grey: 0, alpha: 1 }); }

export function chart(x, X, Y, Wd, Ht, o = {}) {
  const n = o.n ?? 26, cw = Wd / n; let p = .55, pts = [];
  for (let i = 0; i < n; i++) { const d = (hash(i * 3.1 + (o.seed || 0)) - .5) * .09 + (o.bias ?? .012); const op = p; p = clamp(p + d, .08, .92); pts.push([op, p]); }
  x.save(); x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2;
  for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(X, Y + Ht * k / 5); x.lineTo(X + Wd, Y + Ht * k / 5); x.stroke(); }
  const shown = Math.max(1, Math.floor(n * (o.reveal ?? 1)));
  for (let i = 0; i < shown; i++) {
    const [a, b] = pts[i], up = b >= a, cx = X + cw * (i + .5), hi = Math.max(a, b) + hash(i * 7.7) * .04, lo = Math.min(a, b) - hash(i * 5.3) * .04;
    x.strokeStyle = x.fillStyle = up ? '#38d27a' : '#ff4a3c';
    x.lineWidth = Math.max(2, cw * .1); x.beginPath(); x.moveTo(cx, Y + Ht * (1 - hi)); x.lineTo(cx, Y + Ht * (1 - lo)); x.stroke();
    x.fillRect(cx - cw * .32, Y + Ht * (1 - Math.max(a, b)), cw * .64, Math.max(3, Ht * Math.abs(b - a)));
  }
  x.restore();
}
// a chat bubble list into a phone texture
export function chatUI(T, title, msgs, o = {}) {
  const x = T.x, w = T.w, h = T.h; x.fillStyle = o.bg || '#0e1418'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#1c2a30'; x.fillRect(0, 0, w, 110); x.fillStyle = '#e8eef0'; x.font = `700 46px ${UI}`; x.textAlign = 'left'; x.fillText(title, 30, 72);
  let y = h - 40;
  for (let i = msgs.length - 1; i >= 0 && y > 130; i--) {
    const m = msgs[i], mine = m.me, font = m.ml ? `700 30px Manjari` : `600 34px ${UI}`; x.font = font;
    const lines = wrap(x, m.text, w * .66), bh = 24 + lines.length * 40 + (m.from ? 34 : 0); y -= bh;
    const bx = mine ? w - 30 - w * .7 : 30;
    x.fillStyle = m.col || (mine ? '#1e5a3c' : '#26323a'); x.beginPath(); x.roundRect(bx, y, w * .7, bh - 10, 18); x.fill();
    let ty = y + 40; if (m.from) { x.fillStyle = m.fromCol || '#f0b060'; x.font = `700 28px ${UI}`; x.fillText(m.from, bx + 20, ty - 4); ty += 34; x.font = font; }
    x.fillStyle = '#f0f2f0'; for (const l of lines) { x.fillText(l, bx + 20, ty); ty += 40; }
    y -= 12;
  }
}
function wrap(x, s, mw) { const words = s.split(' '), out = []; let cur = ''; for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (x.measureText(t).width > mw && cur) { out.push(cur); cur = wd; } else cur = t; } if (cur) out.push(cur); return out; }
export function notif(T, title, body, k = 1, o = {}) {
  const x = T.x, w = T.w; x.save(); x.translate(0, (1 - eo(k)) * -220); x.globalAlpha = clamp(k * 3);
  x.fillStyle = o.bg || '#f4f2ee'; x.beginPath(); x.roundRect(24, o.y ?? 140, w - 48, 200, 28); x.fill();
  x.fillStyle = o.tc || '#2a6a3a'; x.font = `700 34px ${UI}`; x.textAlign = 'left'; x.fillText(title, 56, (o.y ?? 140) + 60);
  x.fillStyle = '#16161a'; x.font = `700 52px ${UI}`; x.fillText(body, 56, (o.y ?? 140) + 140); x.restore();
}

export function rain(t, o = {}) {
  const n = o.n ?? 160, [x0, y0, x1, y1] = o.box || [0, 0, W, H], ang = o.ang ?? 1.68;
  for (let i = 0; i < n; i++) {
    const sp = (900 + hash(i * 1.7) * 700) * (o.speed ?? 1), L = 40 + hash(i * 2.3) * 70, h = y1 - y0 + L;
    const y = y0 + ((hash(i * 4.1) * h + t * sp) % h) - L * .5, x = x0 + hash(i * 3.3) * (x1 - x0) + (y - y0) * Math.cos(ang) * .5;
    dyn.push({ x, y, ang, len: L * (o.len ?? 1), wid: (1.6 + hash(i) * 1.6) * (o.wid ?? 1), c: hex(o.col || '#c8d4ea'), type: LINE, alpha: (o.alpha ?? .45) * (.5 + hash(i * 9.1) * .5), seed: i, hgt: .3 });
  }
}
export function embers(t, cx, cy, o = {}) {
  for (let i = 0; i < (o.n ?? 30); i++) {
    const life = 2 + hash(i) * 2, ph = (((t - (o.t0 || 0)) + hash(i * 5.5) * life) % life) / life;
    dyn.push({ x: cx + (hash(i * 3.7) - .5) * (o.spread ?? 300) + Math.sin(ph * 6 + i) * 30, y: cy - ph * 700, ang: 0, len: 9, wid: 9, c: hex(o.cols ? o.cols[i % o.cols.length] : (i % 3 ? '#ff8a3a' : '#ffd070')), type: DAB, alpha: Math.sin(ph * Math.PI) * (o.alpha ?? 1), seed: i + 90, hgt: .6 });
  }
}
export function bgStrokes(cols, seed = 300) { for (let i = 0; i < 40; i++) dyn.push({ x: W / 2, y: (i / 40) * H * 1.05, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.6, wid: 80, c: hex(cols[i % cols.length]), c2: hex(cols[cols.length - 1]), type: KNIFE, seed: i + seed, run: .3 }); }
export function mouth(t, who) {
  for (const [id, , t0] of TL.LINES) if (TL.ONSCREEN[id] === who) { const e = env[id], k = Math.floor((t - t0) * 50); if (k >= 0 && k < e.env.length) return e.env[k]; }
  return 0;
}
export const blink = (t, s) => { const ph = ((t + s * 1.37) % (3.3 + s * .4)); return ph < .12 ? Math.sin(ph / .12 * Math.PI) : 0; };
export const F = (f, st) => face(dyn, f, st);

function frame(t) {
  t = Math.min(t, TL.DUR - 1e-3);
  const S = TL.SHOTS, i = TL.shotAt(t), a = S[i][1], k = i > 0 ? (t - a) / TL.TRANS : 1;
  E.begin([.05, .045, .05]);
  let r;
  if (k < 1) {
    CAMZ = 1 + .14 * k * k; APPEAR = null; TK = 1; SHOT[S[i - 1][0]](a - 1e-3);
    CAMZ = 1.07 - .07 * eo(k); APPEAR = a; TK = k; r = SHOT[S[i][0]](t) || {};
  } else { CAMZ = 1 + .07 * (1 - eo(clamp((t - a) / (TL.TRANS * 2) + .5))); APPEAR = null; TK = 1; r = SHOT[S[i][0]](t) || {}; }
  CAMZ = 1; APPEAR = null; TK = 1;
  E.finish({ ...(r.post || {}), ground: (r.post && r.post.ground) || [.06, .05, .05] });
  const s = subAt(t), top = subTop(t);
  if (s) { subMl.textContent = s[3]; subEn.textContent = s[4]; sub.style.opacity = 1; sub.style.top = top + 'px'; } else sub.style.opacity = 0;
  const c = (TL.CARDS || []).find(c => t >= c.t0 && t < c.t1);
  if (c) { card.style.top = c.top + 'px'; card.style.fontSize = (c.size || 56) + 'px'; card.style.fontStyle = c.italic === false ? 'normal' : 'italic'; card.innerHTML = c.html; card.style.opacity = seg(t, c.t0, c.t0 + .35); } else card.style.opacity = 0;
}
const subTop = t => { const o = (TL.SUBTOP || []).find(o => t >= o[0] && t < o[1]); return o ? o[2] : 1380; };
function subAt(t) {
  const L = TL.LINES;
  for (let i = 0; i < L.length; i++) { const [id, , t0] = L[i], d = env[id].dur, next = i + 1 < L.length ? L[i + 1][2] - .1 : TL.DUR;
    const t1 = Math.min(next, Math.max(t0 + d + .45, t0 + 1.7)); if (t >= t0 - .1 && t < t1) return L[i]; }
  return null;
}
function texts(t) {
  const out = [], s = subAt(t), top = subTop(t);
  if (s) out.push({ id: 'en', text: s[4], x0: 70, y0: top, x1: W - 70, y1: top + 200 }, { id: 'ml', text: s[3], x0: 70, y0: top, x1: W - 70, y1: top + 100, pass: true });
  return out;
}
function events() {
  const ev = TL.SHOTS.map(([id, t]) => ({ t, type: 'cut', id }));
  for (const [k, v] of Object.entries(TL.HIT)) ev.push({ t: v, type: k });
  for (const [id, who, t0] of TL.LINES) ev.push({ t: t0, type: 'line', id, who });
  return ev.sort((a, b) => a.t - b.t);
}
