// Scene kit: painted plates (colour + emissive pair, painted once), camera, stepped cel timing, lip flaps, blinks, screens, titles.
import { canvas, W, H, cel, path, poly, line, airbrush, vgrad, rgba, mix, hash, rng, TAU, LWK } from './engine/cel.js';
import { head, pal, phoneInHand } from './cast.js';
export { W, H, cel, path, poly, line, airbrush, vgrad, rgba, mix, hash, rng, TAU, LWK, head, pal, phoneInHand, canvas };

export let K = {};
export function init(TL, ENV) { K = { TL, ENV, HIT: TL.HIT, LT: Object.fromEntries(TL.LINES.map(l => [l[0], l[2]])) }; return K; }
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
export const ss = k => { k = clamp(k); return k * k * (3 - 2 * k); }, eo = k => 1 - Math.pow(1 - clamp(k), 3), seg = (t, a, b) => clamp((t - a) / (b - a));
export const st = (t, f = 12) => Math.floor(t * f + 1e-6) / f;                // cels on twos (12 fps), beats on threes (8 fps)
export const range = id => K.TL.shotRange(id), U = (id, t) => { const [a, b] = range(id); return clamp((t - a) / (b - a)); };
export const L = id => K.LT[id], dur = id => K.ENV[id]?.dur ?? 2;
export const speaking = (t, id) => t >= L(id) && t < L(id) + dur(id);

// lip flaps at 8 fps from the voice envelope, 3–4 shapes, ending on a held expression
export function talk(t, who, rest = null) {
  for (const [id, , t0] of K.TL.LINES) if (K.TL.ONSCREEN[id] === who) {
    const e = K.ENV[id]; if (!e) continue; const ts = st(t, 8), k = Math.floor((ts - t0) * 50);
    if (k >= 0 && k < e.env.length) { const v = e.env[k]; return v > .55 ? (hash(Math.floor(ts * 8)) > .5 ? 'oh' : 'talk') : v > .16 ? 'talk' : 'closed'; }
  }
  return rest;
}
export const lineFor = (t, who) => K.TL.LINES.some(([id, , t0]) => K.TL.ONSCREEN[id] === who && t >= t0 && t < t0 + dur(id));
// quick blink: one closed drawing held ~2 frames
export function blink(t, seed = 1) { const p = 3.2 + hash(seed) * 2.2, ph = ((t + hash(seed * 7) * p) % p); return ph < .09; }

// —— plates ——
export function plate(w, h, fn) { const [c, g] = canvas(w, h), [ec, e] = canvas(w, h); e.fillStyle = '#000'; e.fillRect(0, 0, w, h); fn(g, e, w, h); return { c, e: ec, w, h }; }
// show plate point (x,y) at the frame centre with zoom z (camera on ones)
export function show(g, e, P, cam = {}) {
  const x = cam.x ?? P.w / 2, y = cam.y ?? P.h / 2, z = cam.z ?? 1;
  for (const [ctx, img] of [[g, P.c], [e, P.e]]) { ctx.save(); ctx.translate(W / 2 + (cam.sx || 0), H / 2 + (cam.sy || 0)); ctx.scale(z, z); ctx.translate(-x, -y); ctx.drawImage(img, 0, 0); ctx.restore(); }
}
export function inCam(g, cam, P, fn) { g.save(); g.translate(W / 2 + (cam.sx || 0), H / 2 + (cam.sy || 0)); g.scale(cam.z ?? 1, cam.z ?? 1); g.translate(-(cam.x ?? P.w / 2), -(cam.y ?? P.h / 2)); fn(g); g.restore(); }
// keyframed camera: [[u,[x,y,z]],...]
export function camK(u, keys) {
  let i = 0; while (i < keys.length - 2 && u > keys[i + 1][0]) i++;
  const [a, A] = keys[i], [b, B] = keys[Math.min(i + 1, keys.length - 1)], k = b > a ? ss((u - a) / (b - a)) : 0;
  return { x: lerp(A[0], B[0], k), y: lerp(A[1], B[1], k), z: lerp(A[2], B[2], k) };
}

// —— characters ——  a bust at (x,y) in the current transform, scale s; mirror = faces screen-left. Stamps a black silhouette into the emissive canvas.
export function bust(g, e, who, light, x, y, s, o = {}) {
  const P = pal(who, light);
  g.save(); g.translate(x, y); g.scale(o.mirror ? -s : s, s); if (o.rot) g.rotate(o.rot); head(g, P, o); g.restore();
  if (e) { e.save(); e.translate(x, y); e.scale(o.mirror ? -s : s, s); e.fillStyle = '#000'; e.beginPath(); e.ellipse(-4, -8, 96, 118, 0, 0, TAU); e.fill(); e.fillRect(-190, 130, 380, 400); e.restore(); }
  return P;
}

// —— painting helpers ——
export function rect(g, x, y, w, h, o) { return cel(g, poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), o); }
export function glow(g, e, x, y, r, col, a = .5, ga = .6) { if (g) { g.save(); g.globalCompositeOperation = 'lighter'; airbrush(g, x, y, r, r, col, a * .5, 1); g.restore(); } if (e) airbrush(e, x, y, r, r, col, ga, 1); }
export function grime(g, x, y, w, h, seed = 1, col = '#000000', a = .08, n = 26) {
  const R = rng(seed); for (let i = 0; i < n; i++) airbrush(g, x + R() * w, y + R() * h, 40 + R() * 160, 30 + R() * 120, col, a * R(), 1);
}
// window: sky = night | rain | day | sunset | dusk | snow | spring | autumn
export function win(g, e, x, y, w, h, sky, o = {}) {
  const fr = o.frame || '#5a3a22', R = rng(o.seed || 7);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const S = { night: ['#0a1030', '#1c2a5a'], rain: ['#2a3448', '#4a5a72'], day: ['#7ab8f0', '#d8ecff'], sunset: ['#ff9a5a', '#ffd890'], dusk: ['#2a2058', '#c8607a'],
    snow: ['#9aaac4', '#e4ecf6'], spring: ['#8ac8f0', '#e8f4ff'], autumn: ['#e8a060', '#f8dca8'] }[sky] || ['#000', '#000'];
  vgrad(g, x, y, w, h, [[0, S[0]], [1, S[1]]]);
  if (sky === 'night' || sky === 'dusk') { for (let i = 0; i < 30; i++) { g.fillStyle = rgba('#ffffff', .3 + R() * .6); g.fillRect(x + R() * w, y + R() * h * .5, 2, 2); }
    for (let i = 0; i < 9; i++) { const bx = x + R() * w, bw = 40 + R() * 90, bh = h * (.2 + R() * .4); g.fillStyle = '#0a0c1c'; g.fillRect(bx, y + h - bh, bw, bh);
      for (let k = 0; k < 6; k++) { const lx = bx + 6 + R() * (bw - 14), ly = y + h - bh + 8 + R() * (bh - 20); g.fillStyle = '#ffd88a'; g.fillRect(lx, ly, 7, 9); e.fillStyle = rgba('#ffd88a', .5); e.fillRect(lx, ly, 7, 9); } } }
  if (sky === 'day' || sky === 'spring') for (let i = 0; i < 3; i++) { const cx = x + R() * w, cy = y + h * (.2 + R() * .3); airbrush(g, cx, cy, 120, 40, '#ffffff', .8, .6); airbrush(g, cx + 50, cy - 20, 80, 36, '#ffffff', .8, .6); }
  if (sky === 'sunset') { airbrush(g, x + w * .6, y + h * .7, 120, 120, '#fff4c8', 1, .3); glow(null, e, x + w * .6, y + h * .7, 260, '#ffb060', .7); }
  if (sky === 'rain' || sky === 'snow' || sky === 'autumn') for (let i = 0; i < 60; i++) { const px = x + R() * w, py = y + R() * h;
    if (sky === 'rain') { g.strokeStyle = rgba('#cfe0ff', .35); g.lineWidth = 1.4; g.beginPath(); g.moveTo(px, py); g.lineTo(px - 6, py + 30); g.stroke(); }
    else if (sky === 'snow') { g.fillStyle = rgba('#ffffff', .8); g.beginPath(); g.arc(px, py, 2 + R() * 3, 0, TAU); g.fill(); }
    else { g.fillStyle = ['#c84a1e', '#e8a030', '#a8361a'][i % 3]; g.beginPath(); g.ellipse(px, py, 7, 4, R() * 3, 0, TAU); g.fill(); } }
  if (sky !== 'night' && sky !== 'rain') { e.save(); e.globalAlpha = sky === 'day' || sky === 'spring' || sky === 'snow' ? .35 : .5; e.drawImage(g.canvas, x, y, w, h, x, y, w, h); e.restore(); }
  g.restore();
  g.strokeStyle = fr; g.lineWidth = o.lw || 18; g.strokeRect(x, y, w, h);
  if (o.bars !== false) { g.lineWidth = (o.lw || 18) * .6; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); if (o.hbar) { g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); } g.stroke(); }
  g.fillStyle = rgba('#ffffff', .08); g.fillRect(x + 10, y + 10, w * .18, h - 20);
}
// a flat screen whose content is painted per frame and also glows (backlit)
const SCR = new Map();
export function screen(g, e, key, x, y, w, h, fn, o = {}) {
  let c = SCR.get(key); if (!c || c[0].width !== w || c[0].height !== h) { c = canvas(w, h); SCR.set(key, c); }
  const [cv, cx] = c; cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.clearRect(0, 0, w, h); fn(cx, w, h);
  g.save(); if (o.round) { g.beginPath(); g.roundRect(x, y, w, h, o.round); g.clip(); } g.drawImage(cv, x, y); g.restore();
  if (e && o.glow !== 0) { e.save(); e.globalAlpha = o.glow ?? .45; e.drawImage(cv, x, y); e.restore(); }
  return cv;
}

// —— type ——
export function chrome(g, e, text, x, y, size, o = {}) {   // heavy italic chrome title (sky → white horizon → violet → pink → gold) with dark + neon outlines, glowing
  g.save(); g.font = `italic 900 ${size}px Kanit`; g.textAlign = o.align || 'center'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
  const top = y - size * .78, gr = g.createLinearGradient(0, top, 0, y + size * .05);
  const C = o.cols || [[0, '#8fd8ff'], [.46, '#ffffff'], [.5, '#3a2a6a'], [.68, '#c04a9a'], [.86, '#ff9a6a'], [1, '#ffe08a']];
  for (const [k, c] of C) gr.addColorStop(k, c);
  g.strokeStyle = o.neon || '#ff3a6a'; g.lineWidth = size * .16; g.strokeText(text, x, y);
  g.strokeStyle = '#120818'; g.lineWidth = size * .09; g.strokeText(text, x, y);
  g.fillStyle = gr; g.fillText(text, x, y); g.restore();
  if (e) { e.save(); e.font = `italic 900 ${size}px Kanit`; e.textAlign = o.align || 'center'; e.lineJoin = 'round'; e.strokeStyle = o.neon || '#ff3a6a'; e.lineWidth = size * .2; e.globalAlpha = o.ga ?? .9; e.strokeText(text, x, y); e.fillStyle = rgba('#ffffff', .3); e.fillText(text, x, y); e.restore(); }
}
// small caption card on the tape (place / time cards)
export function caption(g, e, text, y, k = 1, o = {}) {
  if (k <= 0) return;
  g.save(); g.globalAlpha = k; g.font = `700 ${o.size || 44}px "Barlow SC"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const tw = g.measureText(text).width, bw = tw + 70, bh = (o.size || 44) * 1.6;
  g.fillStyle = rgba(o.bg || '#0a0614', .72); g.beginPath(); g.roundRect(W / 2 - bw / 2, y - bh / 2, bw, bh, 8); g.fill();
  g.strokeStyle = o.col || '#ffd27a'; g.lineWidth = 3; g.stroke();
  g.fillStyle = o.col || '#ffd27a'; g.fillText(text, W / 2, y + 2); g.restore();
  if (e) { e.save(); e.globalAlpha = k * .4; e.font = `700 ${o.size || 44}px "Barlow SC"`; e.textAlign = 'center'; e.textBaseline = 'middle'; e.fillStyle = o.col || '#ffd27a'; e.fillText(text, W / 2, y + 2); e.restore(); }
}
// brand mark, small, top of every frame (recorded on the tape)
export function mark(g, e) {
  g.save(); g.font = '500 30px "Cormorant SC"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.letterSpacing = '4px';
  g.fillStyle = rgba('#000000', .35); g.fillText('MeowXTrader', W / 2 + 2, 82); g.fillStyle = rgba('#f4ead0', .62); g.fillText('MeowXTrader', W / 2, 80);
  g.fillStyle = '#3ad27a'; g.fillRect(W / 2 - 128, 66, 7, 28); g.restore();
}
// impact frame: two frames of an inverted silhouette over radial lines
export function flash(g, k) { if (k <= 0) return; g.save(); g.fillStyle = rgba('#ffffff', k); g.fillRect(0, 0, W, H); g.restore(); }
export const POST = { day: { expo: 1.04, sat: 1.06 }, warm: { expo: 1.05, tint: [1.02, .97, .9] }, night: { expo: 1.0, tint: [.94, .96, 1.04], lift: .05 }, red: { expo: 1.02, tint: [1.06, .9, .9] } };
