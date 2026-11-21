// Red Candle · Episode 1 "Green Candles" (~3 min). Shots only; the film core lives in ../core.js.
import * as T0 from './timeline.js';
import * as S from '../scenes/sets.js';
import * as S3 from '../scenes/sets3.js';
import { run, plate, drawPlate, flush, dyn, screen, TX, chart, rain, embers, bgStrokes, mouth, blink, F, U, range, camOf, camK, SCREEN_CAM, UI, TR, mul, SC, appearLate,
  KNIFE, DAB, LINE, hex, clamp, lerp, ss, seg, eo, hash, W, H } from '../core.js';
const H_ = T0.HIT;
const [hA] = T0.shotRange('home'), [cA] = T0.shotRange('call');
const TL = { ...T0,
  CARDS: [
    { t0: H_.presents, t1: H_.titleText + 2.6, top: 560, size: 40, html: '<span style="letter-spacing:.2em;font-style:normal;font-family:\'Cormorant SC\'">MeowXTrader presents</span>' },
    { t0: H_.years, t1: T0.shotRange('title')[1], top: 1700, size: 58, html: '4 years earlier' },
    { t0: hA + .2, t1: hA + 3.2, top: 300, size: 46, html: 'Kerala · the night before' },
    { t0: H_.ring, t1: H_.ring + 3.0, top: 300, size: 44, italic: false, html: '<span style="background:rgba(20,40,30,.7);padding:10px 26px;border-radius:40px">● Achan calling…</span>' },
    { t0: H_.ep2 + .9, t1: T0.shotRange('ep2')[1], top: 1240, size: 42, html: 'Next · Episode 2' },
    { t0: H_.brand + 1.6, t1: T0.DUR, top: 1500, size: 36, html: 'A story about discipline. Not financial advice.' },
  ],
  SUBTOP: [[T0.shotRange('bath')[0], H_.ping2 + 1.2, 300]],
};
const BUILD = {
  laptop: S.buildLaptop, face27: S.buildFace27, title: S.buildTitleText, home: S3.buildHome, airport: S.buildAirport, manc: S.buildManc, back: S.buildBackNik,
  kitchen: S.buildKitchen, bunk: S.buildBunk, call: S.buildCall, office: S.buildOffice, pub: S.buildPub, research: S.buildResearch, bath: S.buildBath,
  canteen: S.buildCanteen, resN: () => S.buildResign('nik'), resJ: () => S.buildResign('jit'), sunset: S.buildSunset, walker: S.buildWalker,
  ep2: S.buildEp2Text, brand: S3.buildBrand,
};
const TEX = { lap: [960, 850], bph: [376, 700], mon: [488, 298], pub: [176, 320], scr: [508, 348], bath: [360, 520] };
export const setup = canvas => run(canvas, { TL, BUILD, SHOTS, TEX });

function payoutScreen(t, T) {
  const x = T.x, w = T.w, h = T.h; x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#7fa8e8'; x.font = `600 56px ${UI}`; x.textAlign = 'left'; x.fillText('03:00', 60, 90);
  x.fillStyle = '#e8eefc'; x.textAlign = 'center'; x.font = `700 120px ${UI}`; x.fillText('Payout', w / 2, h * .42);
  x.font = `italic 600 96px ${UI}`; x.fillStyle = '#ffd27a'; x.fillText('Processing', w / 2, h * .56);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * 4; x.globalAlpha = .25 + .75 * ((i - Math.floor(t * 8)) % 8 + 8) % 8 / 8; x.fillStyle = '#e8eefc'; x.beginPath(); x.arc(w / 2 + Math.cos(a) * 70, h * .72 + Math.sin(a) * 70, 12, 0, 7); x.fill(); }
  x.globalAlpha = 1;
}

const SHOTS = {
  cold(t) {
    const p = plate('laptop'), u = U('cold', t), cam = camOf(600, lerp(880, 840, u), lerp(1.04, 1.2, ss(u)));
    drawPlate('laptop', { t, cam }); payoutScreen(t, TX.lap); screen(TX.lap, p.a.screen, { cam, t });
    return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .4 } };
  },
  face(t) {
    const p = plate('face27'), u = ss(U('face', t)), cam = camOf(lerp(640, 660, u), lerp(1080, 990, u), lerp(1.0, 1.42, u));
    drawPlate('face27', { t, cam });
    rain(t, { box: [90, 120, 650, 940], n: 70, alpha: .35, speed: .6, len: .6 }); flush({ t, cam, run: 0 });
    F(p.f.nik, { look: [.2, .15], blink: 0, brow: -.15 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .4 } };
  },
  title(t) {
    const t0 = H_.titleCandle, k = eo(seg(t, t0, t0 + 1.0)), cx = W / 2, base = 1260, top = base - 620 * k;
    if (k > 0) {
      dyn.push({ x: cx, y: (base + top) / 2, ang: Math.PI / 2, len: base - top, wid: 150, c: hex('#d8261c'), c2: hex('#ff4a32'), type: KNIFE, seed: 1, hgt: 1.3 });
      dyn.push({ x: cx, y: top - 90 * k, ang: Math.PI / 2, len: 180 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 2 });
      dyn.push({ x: cx, y: base + 70 * k, ang: Math.PI / 2, len: 140 * k, wid: 10, c: hex('#ff5a40'), type: KNIFE, seed: 3 });
    }
    embers(t, cx, top, { t0, alpha: seg(t, t0 + .3, t0 + .9) }); flush({ t, run: .2 });
    drawPlate('title', { t, cam: SCREEN_CAM, M: TR(40, 1380), appear: H_.titleText, noUnder: true });
    return { post: { ground: [.03, .025, .03], vig: .5, weave: .05 } };
  },
  home(t) {
    const p = plate('home'), u = U('home', t);
    const cam = camK(u, [[0, [600, 1250, .96]], [.45, [560, 1150, 1.08]], [.75, [420, 900, 1.32]], [1, [400, 880, 1.38]]]);
    drawPlate('home', { t, cam });
    F(p.f.amma, { mouth: mouth(t, 'amma'), smile: u < .7 ? .4 : 0, brow: u > .65 ? -.6 : 0, look: [.8, .3], blink: blink(t, 4) });
    F(p.f.nik, { mouth: mouth(t, 'nik'), smile: u < .65 ? .8 : .1, look: [-.8, .2], blink: blink(t, 2) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, sat: 1.06, lightCol: [1, .86, .62] } };
  },
  airport(t) {
    const p = plate('airport'), u = U('airport', t);
    const cam = camK(u, [[0, [580, 1060, .98]], [.2, [300, 980, 1.25]], [.55, [400, 1000, 1.2]], [.8, [900, 1000, 1.25]], [1, [880, 1020, 1.28]]]);
    drawPlate('airport', { t, cam });
    const [wx, wy] = p.a.watch, g = seg(t, H_.watchClick, H_.watchClick + .5);
    dyn.push({ x: wx, y: wy, ang: 1.25, len: 74, wid: 30, c: hex('#d4d8e0'), c2: hex('#8a909a'), type: KNIFE, seed: 5, hgt: 1.5 });
    dyn.push({ x: wx + 2, y: wy - 2, ang: 0, len: 34, wid: 34, c: hex('#eef2f8'), type: DAB, seed: 6, hgt: 1.6 });
    if (g > 0 && g < 1) dyn.push({ x: wx + 10, y: wy - 14, ang: .8, len: 50 * Math.sin(g * Math.PI), wid: 8, c: [1, 1, 1], type: KNIFE, seed: 7 });
    F(p.f.achan, { mouth: mouth(t, 'achan'), smile: .25, brow: -.3, look: [.6, .5], blink: blink(t, 2) });
    F(p.f.amma, { mouth: mouth(t, 'amma'), brow: -.9, look: [-.4, .1], blink: blink(t, 5), tear: seg(u, .5, 1) });
    F(p.f.nik, { brow: -.5, look: [u < .55 ? -.7 : .7, u < .55 ? .5 : .2], blink: blink(t, 1) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, sat: 1.05, lightCol: [1, .9, .75] } };
  },
  watch(t) {
    const p = plate('airport'), u = ss(U('watch', t)), [wx, wy] = p.a.watch, cam = camOf(lerp(640, wx, u), lerp(1200, wy, u), lerp(1.4, 2.4, u));
    drawPlate('airport', { t, cam });
    dyn.push({ x: wx, y: wy, ang: 1.25, len: 74, wid: 30, c: hex('#d4d8e0'), c2: hex('#8a909a'), type: KNIFE, seed: 5, hgt: 1.5 });
    dyn.push({ x: wx + 2, y: wy - 2, ang: 0, len: 34, wid: 34, c: hex('#eef2f8'), type: DAB, seed: 6, hgt: 1.6 });
    const gl = (t * .4) % 1; dyn.push({ x: wx - 20 + gl * 40, y: wy - 10, ang: .8, len: 26, wid: 6, c: [1, 1, 1], type: KNIFE, alpha: Math.sin(gl * Math.PI), seed: 8 });
    F(p.f.nik, { brow: -.4, look: [.6, .8], blink: blink(t, 3) }); F(p.f.achan, { smile: .3, look: [.6, .5], blink: blink(t, 6) });
    F(p.f.amma, { brow: -.9, look: [-.4, .2], tear: 1, blink: blink(t, 5) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.03, sat: 1.04, lightCol: [1, .88, .7], vig: .4 } };
  },
  manc(t) {
    const [a] = range('manc'), u = U('manc', t), cam = camOf(lerp(620, 640, u), lerp(1150, 980, u), lerp(.95, 1.2, ss(u)));
    drawPlate('manc', { t, cam });
    const step = (t - a) * 1.7 * Math.PI, bob = Math.abs(Math.sin(step)) * 10, M = mul(TR(W / 2 - 330 * .95, 900 + bob), SC(.95));
    for (const sd of [-1, 1]) { const sw = Math.sin(step) * sd * .28; dyn.push({ x: 350 + sd * 40 + Math.sin(sw) * 150, y: 690, ang: Math.PI / 2 - sw, len: 640, wid: 64, c: hex('#26262c'), type: KNIFE, seed: 30 + sd }); }
    flush({ t, cam: SCREEN_CAM, M, run: 0 }); drawPlate('back', { t, cam: SCREEN_CAM, M, appear: appearLate(.18) });
    rain(t, { n: 260, alpha: .5, ang: 1.75 }); flush({ t, run: 0 });
    return { post: { expo: 1.0, sat: .88, lift: [.02, .025, .05], gain: [.92, .96, 1.05], spec: .3 } };
  },
  kitchen(t) {
    const p = plate('kitchen'), u = U('kitchen', t), cam = camOf(560 + Math.sin(t * 1.3) * 20, 1150 + Math.cos(t * 1.1) * 16, 1.04 + ss(u) * .2);
    drawPlate('kitchen', { t, cam });
    for (let i = 0; i < 26; i++) { const life = 3 + hash(i) * 2, ph = ((t * .8 + hash(i * 2.2) * life) % life) / life; dyn.push({ x: p.a.sink[0] + (hash(i * 3.3) - .5) * 260 + Math.sin(ph * 5 + i) * 40, y: p.a.sink[1] - ph * 900, ang: -1.4, len: 120 + ph * 160, wid: 70 + ph * 120, c: hex('#f4fbf6'), type: DAB, alpha: .22 * Math.sin(ph * Math.PI), seed: i + 50, hgt: .2 }); }
    flush({ t, cam, run: 0 });
    F(p.f.nik, { brow: -.6, look: [.5, .9], blink: blink(t, 3) * .6 + .3 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.02, sat: .82, gain: [.96, 1.02, .96], contrast: 1.08 } };
  },
  bunk(t) {
    const p = plate('bunk'), u = U('bunk', t), cam = camK(u, [[0, [600, 1100, .96]], [.3, [640, 1120, 1.1]], [1, [680, 1140, 1.45]]]);
    drawPlate('bunk', { t, cam });
    const T = TX.bph, x = T.x, w = T.w; x.fillStyle = '#10141e'; x.fillRect(0, 0, w, T.h); x.textAlign = 'center'; x.fillStyle = '#c8d4f0'; x.font = `600 120px ${UI}`; x.fillText('01:47', w / 2, 240);
    if (t > H_.emailBuzz) { const k = eo(seg(t, H_.emailBuzz, H_.emailBuzz + .4)); x.save(); x.translate(0, (1 - k) * -200); x.fillStyle = '#f4f2ee'; x.beginPath(); x.roundRect(22, 320, w - 44, 340, 26); x.fill();
      x.fillStyle = '#7a1a14'; x.textAlign = 'left'; x.font = `700 30px ${UI}`; x.fillText('University Finance', 48, 368, w - 96); x.fillStyle = '#16161a'; x.font = `700 44px ${UI}`; x.fillText('Tuition fee', 48, 440, w - 96); x.fillText('overdue', 48, 492, w - 96);
      x.fillStyle = '#c81e14'; x.font = `700 84px ${UI}`; x.fillText('£3,200', 48, 610, w - 96); x.restore(); }
    screen(T, p.a.screen, { cam, t });
    return { post: { expo: 1.02, lift: [.015, .01, .02] } };
  },
  call(t) {
    const p = plate('call'), u = U('call', t), L = T0.LINES.reduce((o, l) => (o[l[0]] = l[2], o), {}), [a, b] = range('call');
    const kk = v => (v - a) / (b - a);
    const cam = camK(u, [[0, [712, 690, 1.8]], [kk(L.a13 - .3), [712, 690, 1.75]], [kk(L.a13 + .2), [520, 900, 1.2]], [kk(L.a14 - .2), [520, 900, 1.2]], [kk(L.a14 + .3), [712, 700, 1.6]], [kk(L.a15 - .1), [700, 720, 1.55]], [kk(L.a15 + .4), [540, 920, 1.15]], [1, [540, 940, 1.12]]]);
    drawPlate('call', { t, cam });
    F(p.f.amma, { mouth: mouth(t, 'amma'), smile: t < L.a14 - .2 ? .45 : 0, brow: t > L.a14 - .2 ? -.7 : -.1, blink: blink(t, 4), look: [0, .1] });
    F(p.f.nik, { mouth: mouth(t, 'nik'), smile: .7, look: [.6, -.2], blink: blink(t, 6) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.03, gain: [.94, .98, 1.06] } };
  },
  callEnd(t) {
    const p = plate('call'), u = U('callEnd', t), cam = camK(u, [[0, [540, 940, 1.12]], [.35, [540, 960, 1.1]], [1, [820, 1520, 1.2]]]);
    drawPlate('call', { t, cam });
    F(p.f.amma, { blink: 1, mouth: 0 });                                       // the screen goes dark: her eyes "close"
    F(p.f.nik, { smile: lerp(.6, -.2, ss(seg(u, .05, .4))), brow: lerp(0, -.8, ss(seg(u, .1, .45))), look: [.2, lerp(-.2, .9, ss(seg(u, .2, .5)))], blink: blink(t, 6) }); flush({ t, cam, run: 0 });
    return { post: { expo: lerp(1.03, .96, u), gain: [.92, .96, 1.06], vig: .45 } };
  },
  office(t) {
    const p = plate('office'), u = U('office', t), cam = camOf(lerp(500, 720, ss(u)), lerp(1280, 1220, u), lerp(1.02, 1.1, u));
    drawPlate('office', { t, cam });
    const T = TX.mon, x = T.x; x.fillStyle = '#12161e'; x.fillRect(0, 0, T.w, T.h);
    for (let i = 0; i < 9; i++) { const y = 20 + i * 32 - ((t * 30) % 32); let xx = 16 + (hash(i * 3) * 4 | 0) * 16; const n = 3 + (hash(i + Math.floor(t * .6)) * 5 | 0); for (let j = 0; j < n; j++) { const ww = 16 + hash(i * 7 + j) * 50; x.fillStyle = ['#7aa8ff', '#e8c070', '#9ad2a0', '#d8d8e0'][(i + j) % 4]; x.fillRect(xx, y, ww, 10); xx += ww + 9; } }
    screen(T, p.a.mon, { cam, t });
    F(p.f.nik, { smile: .4, look: [.8, .2], blink: blink(t, 2) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.06, sat: 1.04, lightCol: [1, .96, .86] } };
  },
  pub(t) {
    const p = plate('pub'), u = U('pub', t), cam = camK(u, [[0, [600, 1150, .98]], [.3, [626, 1300, 1.5]], [.5, [560, 1100, 1.05]], [1, [400, 1000, 1.2]]]);
    drawPlate('pub', { t, cam });
    const T = TX.pub, x = T.x, w = T.w; x.fillStyle = '#0c1410'; x.fillRect(0, 0, w, T.h); x.fillStyle = '#38d27a'; x.textAlign = 'center'; x.font = `700 40px ${UI}`; x.fillText('+£200', w / 2, 56);
    x.font = `italic 600 20px ${UI}`; x.fillStyle = '#9ad8b0'; x.fillText('today', w / 2, 80); chart(x, 10, 96, w - 20, T.h - 116, { n: 14, seed: 3, bias: .03, reveal: .4 + .6 * u });
    screen(T, p.a.phone, { cam, t });
    F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .65, brow: .5, look: [.6, .2], blink: blink(t, 3) });
    F(p.f.nik, { mouth: mouth(t, 'nik'), smile: u > .6 ? .3 : 0, brow: .3, look: [-.8, u < .4 ? .7 : 0], blink: blink(t, 7) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, sat: 1.08, lightCol: [1, .85, .6] } };
  },
  research(t) {
    const p = plate('research'), [a] = range('research'), u = U('research', t), cam = camOf(lerp(560, 640, u), 1180, lerp(1.0, 1.16, ss(u)));
    drawPlate('research', { t, cam });
    const T = TX.scr, x = T.x; x.fillStyle = '#0a0e14'; x.fillRect(0, 0, T.w, T.h); chart(x, 10, 15, T.w - 20, T.h - 30, { n: 34, seed: 9 + Math.floor((t - a) * 2) * 13, bias: .004, reveal: ((t - a) * 2) % 1 * .7 + .3 });
    screen(T, p.a.scr, { cam, t });
    const [cx, cy] = p.a.clock, hr = (t - a) * 1.6, mn = (t - a) * 16;
    dyn.push({ x: cx + Math.cos(hr - 1.57) * 30, y: cy + Math.sin(hr - 1.57) * 30, ang: hr - 1.57, len: 64, wid: 12, c: hex('#1a1a1e'), type: KNIFE, seed: 3 });
    dyn.push({ x: cx + Math.cos(mn - 1.57) * 45, y: cy + Math.sin(mn - 1.57) * 45, ang: mn - 1.57, len: 92, wid: 8, c: hex('#1a1a1e'), type: KNIFE, seed: 4 });
    F(p.f.nik, { look: [.9, .3], blink: blink(t, 9) * .5, brow: .2 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, lift: [.01, .02, .02] } };
  },
  bath(t) {
    const p = plate('bath'), u = U('bath', t), cam = camK(u, [[0, [590, 1780, 1.3]], [.55, [590, 1760, 1.32]], [.8, [600, 700, 1.1]], [1, [600, 690, 1.16]]]);
    drawPlate('bath', { t, cam });
    const T = TX.bath, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c120e'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.fillStyle = '#9ab8a8'; x.font = `600 40px ${UI}`; x.fillText('Today’s P&L', w / 2, 120);
    const v = t < H_.ping1 ? null : t < H_.ping2 ? '+£180' : '+£420', pop = t < H_.ping2 ? seg(t, H_.ping1, H_.ping1 + .25) : seg(t, H_.ping2, H_.ping2 + .25);
    if (v) { x.save(); x.translate(w / 2, h * .55); x.scale(.8 + .2 * eo(pop), .8 + .2 * eo(pop)); x.fillStyle = '#38e27e'; x.font = `700 130px ${UI}`; x.fillText(v, 0, 0); x.restore(); }
    screen(T, p.a.scr, { cam, t });
    F(p.f.nik, { smile: lerp(.1, .95, ss(seg(u, .55, .9))), look: [0, .9 - seg(u, .6, .85) * .9], blink: blink(t, 4) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, sat: .95, gain: [.97, 1.02, 1] } };
  },
  canteen(t) {
    const p = plate('canteen'), u = U('canteen', t), cam = camK(u, [[0, [700, 1150, 1.15]], [.35, [760, 1100, 1.3]], [.6, [380, 1200, 1.3]], [1, [720, 1120, 1.28]]]);
    drawPlate('canteen', { t, cam });
    F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .55, brow: .3, look: [-.7, .3], blink: blink(t, 2) });
    F(p.f.nik, { mouth: mouth(t, 'nik'), smile: u > .4 && u < .65 ? 0 : .2, brow: u > .4 && u < .65 ? -.6 : .3, look: [.8, -.3], blink: blink(t, 8) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, sat: 1.03, lightCol: [1, .95, .85] } };
  },
  resign(t) {
    const k = seg(t, H_.rack, H_.rack + 1.6), cam = camOf(lerp(540, 770, ss(k)), lerp(1260, 990, ss(k)), lerp(1.0, 1.32, ss(k)));
    let p = drawPlate('resN', { t, cam });
    if (t > H_.rack) p = drawPlate('resJ', { t, cam, appear: H_.rack, noUnder: t < H_.rack + .5 });
    F(p.f.nik, { smile: .25, look: [.8, .3], blink: blink(t, 5) });
    F(p.f.jit, { look: [-.9, .2], smile: t > H_.sip + .6 ? .35 : 0, blink: blink(t, 1) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, gain: [.96, 1, 1.04] } };
  },
  walk(t) {
    const [a] = range('walk'), u = U('walk', t), cam = camOf(600, lerp(1200, 1000, u), lerp(.96, 1.1, u));
    drawPlate('sunset', { t, cam });
    const L = T0.LINES.find(l => l[0] === 'a27')[2], stop = seg(t, L - 1.2, L - .6);                 // he stops walking when Achan asks
    const step = (t - a) * 1.8 * Math.PI * (1 - stop), bob = Math.abs(Math.sin(step)) * 12 * (1 - stop), sc = lerp(1.0, 1.14, u);
    const wk = plate('walker'), M = mul(TR(W / 2 - 450 * sc + Math.sin(step / 2) * 6, 480 + bob - 60 * u), SC(sc));
    drawPlate('walker', { t, cam: SCREEN_CAM, M, appear: appearLate(.12) });
    F(wk.f.nik, { mouth: mouth(t, 'nik'), smile: t < L - 1 ? .65 : t < L + 2 ? 0 : .4, brow: t > L - 1 && t < L + 2 ? -.5 : .3, look: [0, t > L - 1 && t < L + 2 ? .8 : 0], blink: blink(t, 3) });
    flush({ t, cam: SCREEN_CAM, M, run: 0 });
    return { post: { expo: 1.06, sat: 1.1, lightCol: [1, .82, .55], light: [.6, -.5, .7] } };
  },
  laptop(t) {
    const p = plate('laptop'), [a, b] = range('laptop'), cam = camOf(600, 860, lerp(1.0, 1.16, ss(seg(t, a, H_.silence))) + seg(t, H_.drop, H_.drop + .2) * .07);
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0a0f0c'; x.fillRect(0, 0, w, h); x.fillStyle = '#38d27a'; x.font = `700 64px ${UI}`; x.textAlign = 'left'; x.fillText('Balance  +£3,940', 50, 90);
    const rv = clamp(.45 + seg(t, a, H_.silence) * .6, 0, 1), red = t > H_.drop ? eo(seg(t, H_.drop, H_.drop + .3)) * .8 : 0;
    chart(x, 30, 130, w - 60, h - 170, { n: 30, seed: 21, bias: .016, reveal: rv * .93 });
    if (red) { const cw = (w - 60) / 30, cx = 30 + cw * 28.4; x.fillStyle = '#ff2a1e'; x.fillRect(cx - cw * .4, 200, cw * .8, (h - 240) * red); x.fillStyle = `rgba(255,30,20,${.25 * red})`; x.fillRect(0, 0, w, h); x.fillStyle = '#ff3a2a'; x.fillRect(50, 40, 560, 70); x.fillStyle = '#fff'; x.fillText('Balance  −£2,180', 50, 95); }
    screen(T, p.a.screen, { cam, t });
    if (t > H_.drop + .35) { const f = seg(t, H_.drop + .35, b); for (let i = 0; i < 60; i++) { const yy = (i / 60) * H * 1.1 - 40, gate = hash(i * 2.7) * .7; if (f < gate) continue; const g = clamp((f - gate) / .25); dyn.push({ x: lerp(-200, W / 2 + (hash(i) - .5) * 300, eo(g)), y: yy, ang: (hash(i * 3.1) - .5) * .3, len: W * 1.5, wid: 70 + hash(i * 5) * 40, c: hex(i % 3 ? '#b8140e' : '#d8261c'), c2: hex('#7a0a08'), type: KNIFE, seed: i + 300, run: .3 }); } flush({ t }); }
    return { post: { expo: 1.04, lift: [.01, .01, .01], vig: .4 } };
  },
  ep2(t) {
    bgStrokes(['#5a0806', '#6e0c0a', '#2a0404']); flush({ t });
    drawPlate('ep2', { t, cam: SCREEN_CAM, M: TR(40, 720), appear: H_.ep2, noUnder: true });
    return { post: { vig: .55 } };
  },
  brand(t) {
    bgStrokes(['#0c1410', '#121a14', '#060a08']); flush({ t });
    drawPlate('brand', { t, cam: SCREEN_CAM, M: TR(40, 560), appear: H_.brand, noUnder: true });
    return { post: { vig: .55 } };
  },
};
