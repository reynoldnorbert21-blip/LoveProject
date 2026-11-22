// Cel props: big phone / laptop frames with live screens, the watch insert, the candle, a figure seen from behind, suitcase, envelope, mug.
import { cel, path, poly, line, rgba, mix, TAU, hash, airbrush } from './engine/cel.js';
import { screen, rect, glow } from './kit.js';
import { pal } from './cast.js';

// phone held upright, filling part of the frame: x,y centre, w width (height = 2w), screen fn(ctx,w,h)
export function bigPhone(g, e, key, x, y, w, fn, o = {}) {
  const h = w * 2.05, r = w * .12;
  g.save(); if (o.rot) { g.translate(x, y); g.rotate(o.rot); g.translate(-x, -y); }
  const body = new Path2D(); body.roundRect(x - w / 2, y - h / 2, w, h, r);
  cel(g, body, { f: '#22222c', s: '#121218', so: [-w * .03, -w * .03], h: '#5a5a70', ho: [w * .015, w * .015], l: '#050508', lw: 3 });
  const sw = Math.round(w * .9), sh = Math.round(h * .9);
  if (e && o.rot) { e.save(); e.translate(x, y); e.rotate(o.rot); e.translate(-x, -y); }
  screen(g, e, key, Math.round(x - sw / 2), Math.round(y - sh / 2), sw, sh, fn, { round: r * .7, glow: o.glow ?? .5 });
  if (e && o.rot) e.restore();
  g.fillStyle = rgba('#ffffff', .07); g.beginPath(); g.moveTo(x - sw / 2, y - sh / 2); g.lineTo(x - sw / 2 + sw * .35, y - sh / 2); g.lineTo(x - sw / 2, y - sh / 2 + sh * .3); g.fill();
  if (o.crack) { g.strokeStyle = rgba('#ffffff', .75); g.lineWidth = 2; const cx = x + sw * .15, cy = y - sh * .2; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .3; g.beginPath(); g.moveTo(cx, cy); let px = cx, py = cy; for (let k = 1; k < 4; k++) { px += Math.cos(a + (hash(i * k) - .5) * .5) * sw * .16; py += Math.sin(a + (hash(i + k) - .5) * .5) * sw * .16; g.lineTo(px, py); } g.stroke(); } }
  g.restore();
}
// laptop seen from the front: screen fn, lid frame, keyboard deck below
export function laptop(g, e, key, x, y, w, fn, o = {}) {
  const h = w * .64;
  rect(g, x - w / 2 - 24, y - h / 2 - 24, w + 48, h + 48, { f: '#2c2c36', s: '#18181e', so: [-8, -8], h: '#5c5c70', ho: [4, 4], l: '#06060a', lw: 3 });
  screen(g, e, key, Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w), Math.round(h), fn, { glow: o.glow ?? .55 });
  cel(g, poly([[x - w / 2 - 40, y + h / 2 + 24], [x + w / 2 + 40, y + h / 2 + 24], [x + w / 2 + 130, y + h / 2 + 150], [x - w / 2 - 130, y + h / 2 + 150]]), { f: '#3a3a46', s: '#22222a', so: [0, -10], l: '#06060a', lw: 3 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { const kx = x - w / 2 - 20 + r * 30 + c * ((w + 40 - r * 60) / 12), ky = y + h / 2 + 40 + r * 26; g.fillStyle = '#24242c'; g.fillRect(kx, ky, (w - r * 60) / 12 - 8, 18); }
}
// wrist + steel watch, seen close (insert). hands: second hand angle from t
export function watchInsert(g, e, x, y, s, t, o = {}) {
  const P = pal(o.who || 'nik', o.light || 'cool');
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || -.25);
  cel(g, [[-520, -70], [380, -90], [460, -60], [470, 70], [380, 96], [-520, 80]], { f: P.skin.f, s: P.skin.s, sh: [[[-520, 30], [470, 30], [470, 96], [-520, 96]]], h: P.skin.h, hi: [[[-520, -60], [460, -56], [460, -40], [-520, -44]]], l: P.skin.l, lw: 2.4 });
  if (o.sleeve) cel(g, [[-640, -110], [-360, -100], [-340, 120], [-640, 130]], { f: o.sleeve.f, s: o.sleeve.s, so: [-14, -10], l: o.sleeve.l, lw: 2.4 });
  for (const sgn of [-1, 1]) cel(g, [[-60, sgn * 70], [60, sgn * 70], [54, sgn * 150], [-54, sgn * 150]], { f: '#b8bcc6', s: '#7a7e8a', so: [-6, 0], h: '#eef0f6', hi: [[[-40, sgn * 80], [-24, sgn * 80], [-24, sgn * 150], [-40, sgn * 150]]], l: '#3a3e48', lw: 2.4 });
  const face = new Path2D(); face.arc(0, 0, 96, 0, TAU);
  cel(g, face, { f: '#c8ccd6', s: '#868a96', so: [-8, -8], h: '#ffffff', ho: [5, 5], l: '#2a2e38', lw: 3 });
  const dial = new Path2D(); dial.arc(0, 0, 78, 0, TAU); cel(g, dial, { f: '#f4f0e4', s: '#d0c8b4', so: [-5, -5], l: '#5a5446', lw: 2 });
  g.strokeStyle = '#2a2622'; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.lineWidth = i % 3 ? 2 : 4; g.beginPath(); g.moveTo(Math.cos(a) * 60, Math.sin(a) * 60); g.lineTo(Math.cos(a) * 70, Math.sin(a) * 70); g.stroke(); }
  const hr = (o.hour ?? 2.6) / 12 * TAU - Math.PI / 2, mn = (o.min ?? 40) / 60 * TAU - Math.PI / 2, sc = Math.floor(t) / 60 * TAU - Math.PI / 2;
  g.lineCap = 'round'; g.strokeStyle = '#1a1612'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(hr) * 38, Math.sin(hr) * 38); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(mn) * 56, Math.sin(mn) * 56); g.stroke();
  g.strokeStyle = '#c8261c'; g.lineWidth = 2; g.beginPath(); g.moveTo(-Math.cos(sc) * 14, -Math.sin(sc) * 14); g.lineTo(Math.cos(sc) * 64, Math.sin(sc) * 64); g.stroke();
  g.fillStyle = '#1a1612'; g.beginPath(); g.arc(0, 0, 5, 0, TAU); g.fill();
  // sliding highlight on the crystal
  const k = o.glint ?? ((t * .35) % 1);
  g.save(); g.clip(dial); g.fillStyle = rgba('#ffffff', .5 * Math.sin(k * Math.PI)); g.beginPath(); g.moveTo(-120 + k * 240, -100); g.lineTo(-80 + k * 240, -100); g.lineTo(-140 + k * 240, 100); g.lineTo(-180 + k * 240, 100); g.fill(); g.restore();
  g.restore();
  if (e && o.star) { e.save(); e.translate(x, y); e.globalCompositeOperation = 'lighter'; airbrush(e, 0, -30 * s, 60 * s, 60 * s, '#ffffff', o.star, 1); e.fillStyle = rgba('#ffffff', o.star); e.fillRect(-110 * s, -32 * s, 220 * s, 4 * s); e.fillRect(-2 * s, -140 * s, 4 * s, 220 * s); e.restore(); }
}
// a candle (trading candle) as a cel object with a backlit glow
export function candle(g, e, x, base, hgt, w, col, o = {}) {
  const C = col === 'green' ? { f: '#2fc06a', s: '#1a8a46', h: '#8af0b0', l: '#0a3a1c', gl: '#3aff8a' } : { f: '#d8261c', s: '#8e140e', h: '#ff8a6a', l: '#3a0604', gl: '#ff3a2a' };
  if (hgt <= 1) return;
  line(g, [[x, base - hgt - (o.wick ?? 90)], [x, base + (o.wick2 ?? 70)]], C.f, 8);
  cel(g, poly([[x - w / 2, base - hgt], [x + w / 2, base - hgt], [x + w / 2, base], [x - w / 2, base]]), { f: C.f, s: C.s, sh: [[[x + w * .2, base - hgt], [x + w / 2, base - hgt], [x + w / 2, base], [x + w * .2, base]]], h: C.h, hi: [[[x - w * .36, base - hgt + 10], [x - w * .2, base - hgt + 10], [x - w * .2, base - 10], [x - w * .36, base - 10]]], l: C.l, lw: 3 });
  if (o.ears) { cel(g, poly([[x - w / 2, base - hgt], [x - w * .3, base - hgt - w * .5], [x - w * .1, base - hgt]]), { f: C.f, l: C.l, lw: 3 }); cel(g, poly([[x + w * .1, base - hgt], [x + w * .3, base - hgt - w * .5], [x + w / 2, base - hgt]]), { f: C.f, l: C.l, lw: 3 }); }
  if (e) { e.save(); e.fillStyle = rgba(C.gl, o.ga ?? .7); e.fillRect(x - w / 2, base - hgt, w, hgt); e.fillRect(x - 4, base - hgt - (o.wick ?? 90), 8, hgt + (o.wick ?? 90) + (o.wick2 ?? 70)); e.restore(); glow(null, e, x, base - hgt / 2, Math.max(hgt, w) * .9, C.gl, .35); }
}
// a person seen from behind (small, in a big painted world): hood, shoulders, walking legs, optional suitcase. ph = walk phase (stepped by caller)
export function backWalker(g, e, x, y, s, ph, o = {}) {
  const P = pal(o.who || 'nik', o.light || 'rain'), cl = P.cloth;
  g.save(); g.translate(x, y); g.scale(s, s);
  const sw = Math.sin(ph * TAU);
  for (const sgn of [-1, 1]) { const k = sw * sgn; cel(g, [[sgn * 30 - 22, 180], [sgn * 30 + 22, 180], [sgn * 30 + 18 + k * 10, 380 - Math.max(0, k) * 20], [sgn * 30 - 18 + k * 10, 380 - Math.max(0, k) * 20]], { f: '#2a2e3c', s: '#181a24', so: [-6, 0], l: '#08080e', lw: 2 });
    cel(g, [[sgn * 30 - 24 + k * 10, 372 - Math.max(0, k) * 20], [sgn * 30 + 24 + k * 10, 372 - Math.max(0, k) * 20], [sgn * 30 + 24 + k * 10, 392 - Math.max(0, k) * 20], [sgn * 30 - 24 + k * 10, 392 - Math.max(0, k) * 20]], { f: '#16161c', l: '#050508', lw: 2 }); }
  cel(g, [[-80, 40], [-60, 0], [60, 0], [80, 40], [74, 200], [-74, 200]], { f: cl.f, s: cl.s, so: [-14, -6], h: cl.h, ho: [6, 4], l: cl.l, lw: 2.4 });
  const hd = new Path2D(); hd.ellipse(0, -36, 44, 50, 0, 0, TAU);
  cel(g, hd, o.hood ? { f: cl.s, s: mix(cl.s, '#000000', .3), so: [-8, -6], l: cl.l, lw: 2.4 } : { f: P.hair.f, s: P.hair.s, so: [-8, -6], h: P.hair.h, ho: [4, 3], l: P.hair.l, lw: 2.4 });
  for (const sgn of [-1, 1]) cel(g, [[sgn * 70, 30], [sgn * 92, 50 + sgn * sw * 6], [sgn * 96 - sw * sgn * 10, 170], [sgn * 76 - sw * sgn * 10, 176], [sgn * 66, 60]], { f: cl.f, s: cl.s, so: [-6, -4], l: cl.l, lw: 2.2 });
  if (o.suitcase) { cel(g, poly([[110, 120], [190, 120], [190, 290], [110, 290]]), { f: '#2a3a5a', s: '#18243a', so: [-8, -6], h: '#4a6a9a', ho: [4, 4], l: '#080c18', lw: 2.4 }); line(g, [[150, 120], [150, 60], [96, 60]], '#40404a', 5); }
  g.restore();
  if (e) { e.save(); e.translate(x, y); e.scale(s, s); e.fillStyle = '#000'; e.fillRect(-96, -90, 192, 490); e.restore(); }
}
export function suitcase(g, x, y, w, h, o = {}) {
  cel(g, poly([[x, y], [x + w, y], [x + w + 30, y + h], [x - 30, y + h]]), { f: '#1e3050', s: '#121c30', so: [-10, -6], l: '#060a14', lw: 3 });
  cel(g, poly([[x + 24, y + 20], [x + w - 24, y + 20], [x + w, y + h - 20], [x, y + h - 20]]), { f: '#e4d6b8', s: '#bca888', so: [-8, -8], l: '#5a4a2a', lw: 2 });
  (o.jars || []).forEach(([jx, jw, jc], i) => { cel(g, poly([[x + jx, y + 60], [x + jx + jw, y + 60], [x + jx + jw, y + h - 40], [x + jx, y + h - 40]]), { f: jc, s: mix(jc, '#000000', .3), so: [-8, 0], h: mix(jc, '#ffffff', .5), hi: [[[x + jx + 8, y + 70], [x + jx + 18, y + 70], [x + jx + 18, y + h - 50], [x + jx + 8, y + h - 50]]], l: mix(jc, '#000000', .6), lw: 2 });
    cel(g, poly([[x + jx - 6, y + 42], [x + jx + jw + 6, y + 42], [x + jx + jw + 6, y + 64], [x + jx - 6, y + 64]]), { f: '#e8e4dc', s: '#a8a49c', so: [0, -6], l: '#4a4840', lw: 2 }); });
}
export function envelope(g, x, y, w, ang = 0, label = 'Resignation') {
  g.save(); g.translate(x, y); g.rotate(ang);
  cel(g, poly([[-w / 2, -w * .3], [w / 2, -w * .3], [w / 2, w * .3], [-w / 2, w * .3]]), { f: '#f4efe2', s: '#c8c0ac', so: [-8, -8], l: '#5a5444', lw: 2.4 });
  line(g, [[-w / 2, -w * .3], [0, 0], [w / 2, -w * .3]], '#8a8270', 2);
  g.fillStyle = '#2a2622'; g.font = `600 ${w * .09}px "Barlow SC"`; g.textAlign = 'center'; g.fillText(label, 0, w * .2); g.restore();
}
export function mug(g, x, y, s, col = '#c84a2a') {
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, poly([[-40, -50], [40, -50], [36, 50], [-36, 50]]), { f: col, s: mix(col, '#000000', .35), so: [-10, 0], h: mix(col, '#ffffff', .4), hi: [[[-30, -46], [-20, -46], [-20, 44], [-30, 44]]], l: mix(col, '#000000', .7), lw: 2.4 });
  g.strokeStyle = mix(col, '#000000', .7); g.lineWidth = 12; g.beginPath(); g.arc(46, 0, 22, -1.3, 1.3); g.stroke(); g.strokeStyle = col; g.lineWidth = 7; g.stroke();
  g.restore();
}
// hand pressing a phone to the ear (for a bust in 3/4 facing right, local head units)
export function phoneAtEar(g, P) {
  cel(g, poly([[-96, -10], [-62, -26], [-34, 70], [-70, 84]]), { f: '#22222c', s: '#121218', so: [-4, -3], l: '#050508', lw: 2 });
  cel(g, [[-110, 40], [-74, 10], [-50, 60], [-60, 130], [-150, 330], [-210, 320]], { f: P.skin.f, s: P.skin.s, so: [-8, -6], l: P.skin.l, lw: 2 });
  cel(g, [[-200, 330], [-140, 250], [-80, 360], [-160, 420]], { f: P.cloth.f, s: P.cloth.s, so: [-8, -6], l: P.cloth.l, lw: 2 });
}
export function steam(g, x, y, t, n = 8, a = .22) {
  for (let i = 0; i < n; i++) { const life = 2.6 + hash(i) * 1.6, ph = ((t + hash(i * 2.2) * life) % life) / life, px = x + (hash(i * 3.3) - .5) * 260 + Math.sin(ph * 5 + i) * 40, py = y - ph * 700;
    airbrush(g, px, py, 60 + ph * 120, 50 + ph * 90, '#f4fbf6', a * Math.sin(ph * Math.PI), .8); }
}
