// Red Candle · 80s cel anime. ?ep=1|2|3 picks the episode; ?test=model draws the cast model sheet; ?raw=1 skips the tape/CRT pass; ?nosub=1 hides subtitles.
import { canvas, W, H } from './engine/cel.js';
import { makePost } from './engine/post.js';
import { hud, spans } from './hud.js';
const qs = new URLSearchParams(location.search), ep = +(qs.get('ep') || 1), TEST = qs.get('test');
const TL = await import(`./ep${ep}/timeline.js`);
const [sc, g] = canvas(W, H), [gc, e] = canvas(W, H), [ovc, ov] = canvas(W, H);
const post = makePost(document.getElementById('gl'));
for (const f of ['italic 800 60px Kanit', 'italic 900 60px Kanit', '600 40px "Barlow SC"', '700 40px "Barlow SC"', '500 40px "Cormorant SC"']) await document.fonts.load(f);
await document.fonts.load('700 40px Manjari', 'അആഇ');
const ENV = await (await fetch(`audio/ep${ep}/env.json`)).json();
const SP = spans(TL, ENV);
const mod = TEST ? await import('./test.js') : await import(`./ep${ep}/shots.js`);
const ctx = TEST ? null : await mod.setup({ TL, ENV });
function render(t) {
  for (const x of [g, e]) { x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; }
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H); e.fillStyle = '#000'; e.fillRect(0, 0, W, H);
  let over = {}, subo = {};
  if (TEST) mod.test(g, e, t, TEST);
  else { const r = mod.frame(t, g, e) || {}; over = r.post || {}; subo = r.sub || {}; }
  if (qs.get('nosub') || TEST || subo.hide) ov.clearRect(0, 0, W, H); else hud(ov, t, SP, { ...subo, phone: ctx?.phone });
  const raw = { bloom: 0, halo: 0, soft: 0, flick: 0, lift: 0, contrast: 0, fade: 0, sat: 1, tint: [1, 1, 1], scan: 0, grille: 0, bleed: 1, rshift: 0, glow: 0, corner: 0, noiseA: 0, power: 1, track: 0, expo: 1 };
  post.render(sc, gc, Math.round(t * 24), ovc, qs.get('raw') ? raw : over);
}
window.EV = []; window.render = render; window.DUR = TL.DUR;
render(parseFloat(qs.get('t') ?? '20'));
window.READY = true;
