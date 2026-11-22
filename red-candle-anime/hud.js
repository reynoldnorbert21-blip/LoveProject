// Subtitles recorded on the tape: Malayalam (Manjari) over English (Barlow), cream-yellow with a thick dark outline; a phone voice gets a cyan tag.
import { W, H, rgba } from './engine/cel.js';
export function spans(TL, ENV) {
  const L = TL.LINES, out = [];
  for (let i = 0; i < L.length; i++) { const [id, who, t0, ml, en] = L[i], d = ENV[id]?.dur ?? 2, next = i + 1 < L.length ? L[i + 1][2] - .1 : TL.DUR;
    out.push({ id, who, ml, en, a: t0 - .1, b: Math.min(next, Math.max(t0 + d + .5, t0 + 1.8)) }); }
  return out;
}
function wrap(c, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
export function hud(c, t, S, o = {}) {
  c.clearRect(0, 0, W, H);
  const v = S.find(s => t >= s.a && t < s.b); if (!v) return;
  const phone = (o.phone || []).includes(v.id);
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.font = '700 46px Manjari'; const ml = wrap(c, v.ml, W - 150);
  c.font = '600 42px "Barlow SC"'; const en = wrap(c, v.en, W - 170);
  const lh1 = 60, lh2 = 50, total = ml.length * lh1 + 14 + en.length * lh2;
  let y = (o.top ?? (H - 150 - total)) + lh1 / 2;
  const fill = phone ? '#9ff4ff' : '#fff0a0';
  const draw = (txt, font, col, lw) => { c.font = font; c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 10; c.shadowOffsetY = 3; c.strokeStyle = '#140a1c'; c.lineWidth = lw; c.strokeText(txt, W / 2, y); c.shadowColor = 'transparent'; c.fillStyle = col; c.fillText(txt, W / 2, y); };
  for (const s of ml) { draw(s, '700 46px Manjari', fill, 10); y += lh1; }
  y += 14 - lh1 / 2 + lh2 / 2;
  for (const s of en) { draw(s, '600 42px "Barlow SC"', phone ? '#d8fbff' : '#fff7d6', 8); y += lh2; }
  c.restore();
}
