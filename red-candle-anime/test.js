import { W, H, LWK } from './engine/cel.js';
import { head, pal, phoneInHand } from './cast.js';
function cell(g, x, y, w, h, label, fn) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = '#d8d0c8'; g.fillRect(x, y, w, h); fn(); g.restore();
  g.strokeStyle = '#8a8494'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
  g.fillStyle = '#3a3448'; g.font = '600 26px "Barlow SC"'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(label, x + 14, y + 10);
}
export function test(g, e, t, name) {
  g.fillStyle = '#cfc8c0'; g.fillRect(0, 0, W, H);
  const v = new URLSearchParams(location.search).get('v') || 'cast';
  if (v === 'cast') {
    const L = [['nik19', 'q', 'grin'], ['nik', 'q', 'neutral'], ['nikBroken', 'q', 'cry'], ['jithin', 'q', 'grin'], ['amma', 'q', 'warm'], ['achan', 'q', 'smile'], ['anoop', 'q', 'angry'], ['mentor', 'q', 'hard'], ['nikHivis', 'front', 'tired']];
    L.forEach(([who, view, ex], i) => cell(g, (i % 3) * 360, 40 + Math.floor(i / 3) * 620, 360, 620, `${who} · ${ex}`, () => { g.translate((i % 3) * 360 + 180, 40 + Math.floor(i / 3) * 620 + 250); g.scale(1.0, 1.0); head(g, pal(who), { view, expr: ex, tear: ex === 'cry' ? 1 : 0 }); }));
  } else {
    const who = v, ex = ['neutral', 'talk', 'smile', 'sad', 'cry', 'shock', 'worried', 'hard'];
    ex.forEach((x, i) => cell(g, (i % 2) * 540, Math.floor(i / 2) * 480, 540, 480, `${who} · ${x}`, () => { g.translate((i % 2) * 540 + 270, Math.floor(i / 2) * 480 + 210); g.scale(1.25, 1.25); head(g, pal(who), { view: i % 3 === 2 ? 'front' : 'q', expr: x, tear: x === 'cry' ? 1 : 0 }); }));
  }
}
