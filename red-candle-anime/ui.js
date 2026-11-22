// Screen contents (phones, laptops, monitors), drawn flat into a screen canvas, then shown backlit.
import { hash, rgba, TAU } from './engine/cel.js';
export const UI = '"Barlow SC"';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export function chart(x, X, Y, Wd, Ht, o = {}) {
  const n = o.n ?? 26, cw = Wd / n; let p = o.start ?? .5; const pts = [];
  for (let i = 0; i < n; i++) { const d = (hash(i * 3.1 + (o.seed || 0)) - .5) * .09 + (o.bias ?? .012); const op = p; p = clamp(p + d, .08, .92); pts.push([op, p]); }
  x.save(); x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 2;
  for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(X, Y + Ht * k / 5); x.lineTo(X + Wd, Y + Ht * k / 5); x.stroke(); }
  const shown = Math.max(1, Math.floor(n * (o.reveal ?? 1)));
  for (let i = 0; i < shown; i++) {
    const [a, b] = pts[i], up = o.allRed ? false : b >= a, cx = X + cw * (i + .5), hi = Math.max(a, b) + hash(i * 7.7) * .04, lo = Math.min(a, b) - hash(i * 5.3) * .04;
    x.strokeStyle = x.fillStyle = up ? '#3aee8a' : '#ff4a3c';
    x.lineWidth = Math.max(2, cw * .1); x.beginPath(); x.moveTo(cx, Y + Ht * (1 - hi)); x.lineTo(cx, Y + Ht * (1 - lo)); x.stroke();
    x.fillRect(cx - cw * .32, Y + Ht * (1 - Math.max(a, b)), cw * .64, Math.max(3, Ht * Math.abs(b - a)));
  }
  x.restore(); return pts;
}
export function wrap(x, s, mw) { const words = s.split(' '), out = []; let cur = ''; for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (x.measureText(t).width > mw && cur) { out.push(cur); cur = wd; } else cur = t; } if (cur) out.push(cur); return out; }
export function chat(x, w, h, title, msgs, o = {}) {
  x.fillStyle = o.bg || '#0e1418'; x.fillRect(0, 0, w, h);
  const sc = w / 540;
  x.fillStyle = '#1c2a30'; x.fillRect(0, 0, w, 100 * sc); x.fillStyle = '#e8eef0'; x.font = `700 ${44 * sc}px ${UI}`; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(title, 26 * sc, 66 * sc);
  let y = h - 30 * sc;
  for (let i = msgs.length - 1; i >= 0 && y > 120 * sc; i--) {
    const m = msgs[i], mine = m.me, font = m.ml ? `700 ${30 * sc}px Manjari` : `600 ${34 * sc}px ${UI}`; x.font = font;
    const lines = wrap(x, m.text, w * .64), bh = (24 + lines.length * 40 + (m.from ? 34 : 0)) * sc; y -= bh;
    const bx = mine ? w - 24 * sc - w * .72 : 24 * sc;
    x.fillStyle = m.col || (mine ? '#1e5a3c' : '#26323a'); x.beginPath(); x.roundRect(bx, y, w * .72, bh - 10 * sc, 16 * sc); x.fill();
    let ty = y + 40 * sc; if (m.from) { x.fillStyle = m.fromCol || '#f0b060'; x.font = `700 ${28 * sc}px ${UI}`; x.fillText(m.from, bx + 18 * sc, ty - 4 * sc); ty += 34 * sc; x.font = font; }
    x.fillStyle = '#f0f2f0'; for (const l of lines) { x.fillText(l, bx + 18 * sc, ty); ty += 40 * sc; }
    y -= 12 * sc;
  }
}
export function notif(x, w, y, title, body, k = 1, o = {}) {
  if (k <= 0) return; const sc = w / 540;
  x.save(); x.translate(0, (1 - k) * -200 * sc); x.globalAlpha = clamp(k * 3);
  x.fillStyle = o.bg || '#f4f2ee'; x.beginPath(); x.roundRect(18 * sc, y, w - 36 * sc, (o.h || 170) * sc, 22 * sc); x.fill();
  x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  x.fillStyle = o.tc || '#2a6a3a'; x.font = `700 ${30 * sc}px ${UI}`; x.fillText(title, 44 * sc, y + 52 * sc, w - 90 * sc);
  x.fillStyle = '#16161a'; x.font = `700 ${40 * sc}px ${UI}`; x.fillText(body, 44 * sc, y + 116 * sc, w - 90 * sc);
  if (o.big) { x.fillStyle = o.bigc || '#c81e14'; x.font = `700 ${70 * sc}px ${UI}`; x.fillText(o.big, 44 * sc, y + 200 * sc, w - 90 * sc); }
  x.restore();
}
export function clock(x, w, h, s, o = {}) { x.fillStyle = o.bg || '#0e1220'; x.fillRect(0, 0, w, h); x.fillStyle = '#c8d4f0'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = `600 ${w * .26}px ${UI}`; x.fillText(s, w / 2, h * (o.y ?? .3)); }
export function incoming(x, w, h, name, t, o = {}) {
  x.fillStyle = '#16301e'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.fillStyle = '#b8d8c0'; x.font = `600 ${w * .07}px ${UI}`; x.fillText(o.label || 'incoming call', w / 2, h * .22);
  x.fillStyle = '#f4f8f4'; x.font = `700 ${w * .16}px ${UI}`; x.fillText(name, w / 2, h * .34);
  const pulse = .5 + .5 * Math.sin(t * 8);
  for (const [cx, c] of [[w * .28, '#e8402a'], [w * .72, '#3ac860']]) { x.fillStyle = rgba(c, .25 * pulse); x.beginPath(); x.arc(cx, h * .8, w * .14, 0, TAU); x.fill(); x.fillStyle = c; x.beginPath(); x.arc(cx, h * .8, w * .09, 0, TAU); x.fill(); }
}
export function bigText(x, w, h, lines) { for (const [s, y, size, col, it] of lines) { x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = `${it ? 'italic ' : ''}700 ${size}px ${UI}`; x.fillText(s, w / 2, y); } }
export function spinner(x, cx, cy, r, t, col = '#e8eefc') { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * 4; x.globalAlpha = .25 + .75 * (((i - Math.floor(t * 8)) % 8 + 8) % 8) / 8; x.fillStyle = col; x.beginPath(); x.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * .17, 0, TAU); x.fill(); } x.globalAlpha = 1; }
export function code(x, w, h, t, seed = 0) {
  x.fillStyle = '#10141c'; x.fillRect(0, 0, w, h);
  const lh = h / 11;
  for (let i = 0; i < 12; i++) { const y = lh * .6 + i * lh - ((t * 24) % lh); let xx = 14 + (hash(i * 3 + seed) * 4 | 0) * 14; const n = 3 + (hash(i + Math.floor(t * .6) + seed) * 5 | 0);
    for (let j = 0; j < n; j++) { const ww = 14 + hash(i * 7 + j) * w * .1; x.fillStyle = ['#7aa8ff', '#e8c070', '#9ad2a0', '#d8d8e0', '#ff7aa8'][(i + j) % 5]; x.fillRect(xx, y, ww, lh * .32); xx += ww + 8; } }
}
