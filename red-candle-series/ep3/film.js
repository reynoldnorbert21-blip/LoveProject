// Red Candle · Episode 3 "The Grind" (~3 min). Shots only; the film core lives in ../core.js.
import * as T0 from './timeline.js';
import * as S from '../scenes/sets.js';
import * as S2 from '../scenes/sets2.js';
import * as S3 from '../scenes/sets3.js';
import { run, plate, drawPlate, flush, dyn, screen, TX, chart, chatUI, notif, rain, embers, bgStrokes, mouth, blink, F, U, range, camOf, camK, SCREEN_CAM, UI, TR, mul, SC,
  KNIFE, DAB, LINE, hex, clamp, lerp, ss, seg, eo, hash, W, H, SW, SH } from '../core.js';
const LT = Object.fromEntries(T0.LINES.map(l => [l[0], l[2]]));
const HIT = { ...T0.HIT, redcandle: T0.HIT.candle + 1.6 };
const TL = { ...T0,
  CARDS: [
    { t0: HIT.presents, t1: HIT.title + 1.6, top: 560, size: 40, html: '<span style="letter-spacing:.2em;font-style:normal;font-family:\'Cormorant SC\'">MeowXTrader presents</span>' },
    { t0: HIT.months, t1: T0.shotRange('title')[1] + 2.0, top: 1660, size: 56, html: '8 months later' },
    { t0: T0.shotRange('arrivals')[0] + .2, t1: T0.shotRange('arrivals')[0] + 3.0, top: 300, size: 46, html: 'Kochi · home' },
    { t0: T0.shotRange('end')[1] - 2.2, t1: T0.shotRange('end')[1], top: 1700, size: 38, html: 'A story about discipline. Not financial advice.' },
    { t0: HIT.brand + 1.6, t1: T0.DUR, top: 1500, size: 36, html: 'Trade with rules.' },
  ],
  SUBTOP: [[T0.shotRange('msg')[0], T0.shotRange('msg')[1], 1560]],
};
const BUILD = {
  title: () => S2.buildEpText('Episode 3', 'THE GRIND', '#2fb46a'), warehouse: S2.buildWarehouse,
  phoneB: () => S2.buildPhone({ who: 'nikBroken', sleeve: '#2a2a2e', seed: 61 }), cls: S2.buildClass, laptop: S.buildLaptop,
  floor: S2.buildFloor, audit: S2.buildAudit, rules: () => S2.buildNotebook({ seed: 62 }), seasons: S2.buildSeasons, face27: S.buildFace27,
  phoneA: () => S2.buildPhone({ who: 'anoop', sleeve: '#6e2232', warm: true, seed: 63 }), repay: S2.buildRepay, arrivals: S2.buildArrivals,
  veranda: S2.buildVeranda, phone27: () => S2.buildPhone({ who: 'nik27', sleeve: '#6b6f3e', warm: true, seed: 64 }), palms: S2.buildPalms, red: S.buildTitleText, brand: S3.buildBrand,
};
const TEX = { lap: [960, 850], ph: [544, 1100], vn: [76, 172], notes: [600, 1067], page: [880, 1240], win: [896, 736], aph: [188, 360] };
export const setup = canvas => run(canvas, { TL, BUILD, SHOTS, TEX });
function phoneShot(k, t, cam, draw) { const p = drawPlate(k, { t, cam }); const T = TX.ph; draw(T); screen(T, p.a.screen, { cam, t }); return p; }
const ink = (x, s, X, Y, n, font, col) => { x.font = font; x.fillStyle = col; x.fillText(s.slice(0, Math.max(0, Math.floor(n))), X, Y); };

const SHOTS = {
  title(t) {
    bgStrokes(['#06180e', '#0a2414', '#020a06']); flush({ t });
    drawPlate('title', { t, cam: SCREEN_CAM, M: TR(40, 720), appear: HIT.title, noUnder: true });
    return { post: { vig: .55 } };
  },
  warehouse(t) {
    const p = plate('warehouse'), u = U('warehouse', t), cam = camOf(lerp(480, 700, u), 1100, 1.08);
    drawPlate('warehouse', { t, cam });
    for (const b of [HIT.beep1, HIT.beep2]) { const k = seg(t, b, b + .35); if (k > 0 && k < 1) dyn.push({ x: p.a.beam[0] - 120, y: p.a.beam[1] + 260, ang: 2.1, len: 560, wid: 6, c: hex('#ff2a1e'), type: LINE, alpha: Math.sin(k * Math.PI), seed: 3 }); }
    flush({ t, cam, run: 0 });
    F(p.f.nik, { brow: -.3, look: [.8, .3], blink: blink(t, 2) * .6 + .2 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.03, lightCol: [1, .78, .5], sat: .95 } };
  },
  lunch(t) {
    const [a] = range('lunch'), u = U('lunch', t), cam = camOf(600, lerp(980, 900, u), lerp(1.0, 1.14, u));
    phoneShot('phoneB', t, cam, T => {
      const x = T.x, w = T.w, h = T.h; x.fillStyle = '#0c0c10'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#1e3a5a'; x.fillRect(0, 160, w, 330); x.fillStyle = '#e8eef4'; x.textAlign = 'center'; x.font = `700 70px ${UI}`; x.fillText('Trade our capital', w / 2, 340);
      x.fillStyle = '#ffd27a'; x.font = `italic 600 40px ${UI}`; x.fillText('Funded account · $100K', w / 2, 410);
      x.fillStyle = '#ff3a2a'; x.fillRect(0, 488, w * clamp((t - a) / 6), 8);
      x.fillStyle = '#e8eef4'; x.textAlign = 'left'; x.font = `700 40px ${UI}`; x.fillText('Pass the challenge. Keep 80%.', 30, 580);
      x.fillStyle = '#8a96a8'; x.font = `600 32px ${UI}`; x.fillText('1.2M views', 30, 630);
      x.strokeStyle = 'rgba(230,235,240,.6)'; x.lineWidth = 3; for (let i = 0; i < 8; i++) { const an = i / 8 * 6.28 + hash(i) * .4; x.beginPath(); x.moveTo(w * .7, h * .3); x.lineTo(w * .7 + Math.cos(an) * 900, h * .3 + Math.sin(an) * 900); x.stroke(); }
    });
    return { post: { expo: 1.02, gain: [.96, 1, 1.04] } };
  },
  class(t) {
    const p = plate('cls'), u = U('class', t), cam = camK(u, [[0, [600, 760, 1.0]], [.6, [620, 900, 1.05]], [1, [600, 1500, 1.22]]]);
    drawPlate('cls', { t, cam });
    F(p.f.men, { mouth: mouth(t, 'mentor'), look: [.4, .3], brow: .2, blink: blink(t, 4) });
    F(p.f.nik, { look: [.6, .9], brow: -.3, blink: blink(t, 7) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, lightCol: [1, .94, .82] } };
  },
  breach(t) {
    const p = plate('laptop'), n = clamp(Math.floor((t - HIT.breach) / .4) + 1, 0, 7), pulse = 1 - seg((t - HIT.breach) % .4, 0, .2);
    const cam = camOf(600, 860, 1.1 + pulse * .02 * (n > 0));
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#f4f4f2'; x.fillRect(0, 0, w, h); x.textAlign = 'left';
    x.fillStyle = '#16161a'; x.font = `700 56px ${UI}`; x.fillText('Inbox', 40, 80);
    for (let i = 0; i < n; i++) { const y = 120 + i * 92; x.fillStyle = i === n - 1 ? '#ffe8e4' : '#ffffff'; x.fillRect(20, y, w - 40, 82); x.fillStyle = '#c81e14'; x.font = `700 40px ${UI}`; x.fillText(`Account Breached · Challenge #${n - i}`, 40, y + 54); }
    if (n > 0) { x.fillStyle = '#1a4aa8'; x.beginPath(); x.roundRect(w - 320, h - 130, 280, 100, 20); x.fill(); x.fillStyle = '#fff'; x.font = `700 48px ${UI}`; x.fillText('Buy again', w - 290, h - 64); }
    screen(T, p.a.screen, { cam, t });
    return { post: { expo: 1.02, vig: .4 } };
  },
  floor(t) {
    const p = plate('floor'), u = U('floor', t), cam = camOf(600, lerp(1200, 1080, u), lerp(.96, 1.22, ss(u)));
    drawPlate('floor', { t, cam });
    const T = TX.vn, x = T.x; x.fillStyle = '#0c1014'; x.fillRect(0, 0, T.w, T.h); x.fillStyle = '#7ab8ff'; for (let i = 0; i < 9; i++) { const hh = 10 + 40 * Math.abs(Math.sin(t * 9 + i)); x.fillRect(8 + i * 7, 86 - hh / 2, 4, hh); }
    screen(T, p.a.phone, { cam, t });
    F(p.f.nik, { brow: -.7, look: [.8, .6], blink: blink(t, 5) * .5, tear: seg(u, .6, 1) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.0, gain: [.92, .96, 1.06], lift: [.01, .015, .04] } };
  },
  audit(t) {
    const p = plate('audit'), [a] = range('audit'), u = U('audit', t), cam = camOf(600, lerp(1000, 900, u), lerp(1.0, 1.1, u), lerp(-.03, .03, u));
    drawPlate('audit', { t, cam });
    for (let i = 0; i < 6; i++) { const k = seg(t, a + .4 + i * .5, a + .8 + i * .5); if (k <= 0) continue; const x0 = 70 + (i % 3) * 380, y0 = 240 + Math.floor(i / 3) * 620 + (i % 2) * 104; dyn.push({ x: x0 + 130 * k, y: y0, ang: 0, len: 260 * k, wid: 34, c: hex('#ff3a5a'), type: KNIFE, alpha: .55, seed: i, run: 0 }); }
    flush({ t, cam, run: 0 });
    const T = TX.notes, x = T.x; x.clearRect(0, 0, T.w, T.h); x.font = `italic 700 34px ${UI}`; x.fillStyle = '#c81e14';
    [['no stop loss', 120, 180], ['revenge', 300, 220], ['5% risk', 160, 520], ['all-in', 420, 500], ['no plan', 260, 820]].forEach(([s, X, Y], i) => { if (t > a + .6 + i * .5) { x.save(); x.translate(X, Y); x.rotate(-.08 + i * .04); x.fillText(s, 0, 0); x.restore(); } });
    screen(T, [0, 0, SW, SH], { cam, t });
    return { post: { expo: 1.04, lightCol: [1, .9, .72] } };
  },
  rules(t) {
    const p = plate('rules'), [a] = range('rules'), u = U('rules', t), cam = camK(u, [[0, [600, 520, 1.3]], [1, [600, 1000, 1.12]]]);
    drawPlate('rules', { t, cam });
    const T = TX.page, x = T.x, w = T.w; x.fillStyle = '#efe7d2'; x.fillRect(0, 0, w, T.h); x.textAlign = 'left';
    const R = [['Rule 1: Never trade money', 1], ["you can't afford to lose.", 0], ["Never trade someone else's money.", 0], ['Rule 2: Risk 1% per trade.', 1], ['Rule 3: Follow the system,', 1], ['not feelings.', 0], ['Rule 4: No revenge trades.', 1]];
    let c = (t - a) * 42;
    R.forEach(([s, head], i) => { ink(x, s, 60, 130 + i * 150, c, `italic ${head ? 700 : 600} ${head ? 62 : 56}px ${UI}`, head ? '#1e2a6a' : '#2a3a7a'); c -= s.length; });
    screen(T, p.a.page, { cam, t });
    return { post: { expo: 1.04, lightCol: [1, .9, .72], vig: .4 } };
  },
  seasons(t) {
    const p = plate('seasons'), u = U('seasons', t), cam = camOf(600, 1000, lerp(1.02, 1.1, u));
    drawPlate('seasons', { t, cam });
    const T = TX.win, x = T.x, w = T.w, h = T.h, s = u * 3;
    const sky = s < 1 ? ['#e8b070', '#c86a30'] : s < 2 ? ['#d8e0e8', '#f4f6f8'] : ['#a8d8f0', '#e8f4d8'];
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const px = hash(i) * w, py = (hash(i * 3) * h + t * (s < 1 ? 60 : s < 2 ? 90 : 0)) % h; x.fillStyle = s < 1 ? ['#d8541c', '#e88a2a', '#b83a14'][i % 3] : s < 2 ? '#ffffff' : ['#6ab84a', '#f4a8c8', '#8ac85a'][i % 3]; x.beginPath(); x.arc(px, py, s < 2 && s >= 1 ? 6 : 11, 0, 7); x.fill(); }
    screen(T, p.a.win, { cam, t });
    F(p.f.nik, { look: [.3, .7], smile: .1, blink: blink(t, 3) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05 } };
  },
  payout(t) {
    const p = plate('laptop'), u = U('payout', t), cam = camOf(600, 860, lerp(1.06, 1.22, ss(u)));
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h, ok = t > HIT.approved; x.fillStyle = '#0d1424'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#7fa8e8'; x.font = `600 56px ${UI}`; x.textAlign = 'left'; x.fillText('03:00', 60, 90);
    x.fillStyle = '#e8eefc'; x.textAlign = 'center'; x.font = `700 120px ${UI}`; x.fillText('Payout', w / 2, h * .42);
    x.font = `italic 600 ${ok ? 120 : 96}px ${UI}`; x.fillStyle = ok ? '#38e27e' : '#ffd27a'; x.fillText(ok ? 'Approved' : 'Processing', w / 2, h * .58);
    if (!ok) for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + t * 4; x.globalAlpha = .25 + .75 * ((i - Math.floor(t * 8)) % 8 + 8) % 8 / 8; x.fillStyle = '#e8eefc'; x.beginPath(); x.arc(w / 2 + Math.cos(an) * 70, h * .74 + Math.sin(an) * 70, 12, 0, 7); x.fill(); }
    x.globalAlpha = 1; screen(T, p.a.screen, { cam, t });
    return { post: { expo: 1.05, lift: [.01, .015, .04], vig: .4 } };
  },
  payface(t) {
    const p = plate('face27'), u = U('payface', t), cam = camOf(650, lerp(1000, 980, u), lerp(1.25, 1.4, u));
    drawPlate('face27', { t, cam });
    rain(t, { box: [90, 120, 650, 940], n: 60, alpha: .3, speed: .6, len: .6 }); flush({ t, cam, run: 0 });
    F(p.f.nik, { look: [0, .2], blink: ss(seg(u, .1, .5)), brow: .1 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, lift: [.01, .02, .02], vig: .38, gain: [.96, 1.04, .98] } };
  },
  repay(t) {
    const u = U('repay', t), cam = camOf(600, 960, lerp(1.0, 1.1, u));
    phoneShot('phoneA', t, cam, T => { T.x.fillStyle = '#14100c'; T.x.fillRect(0, 0, T.w, T.h); T.x.fillStyle = '#f0e0c0'; T.x.textAlign = 'center'; T.x.font = `600 110px ${UI}`; T.x.fillText('09:12', T.w / 2, 300);
      if (t > HIT.sent) notif(T, 'Bank · Payment received', 'Nikhil sent you £5,000', seg(t, HIT.sent, HIT.sent + .3), { y: 360 }); });
    return { post: { expo: 1.05, lightCol: [1, .95, .85] } };
  },
  anoop(t) {
    const p = plate('repay'), u = U('anoop', t), cam = camOf(lerp(600, 640, u), lerp(1000, 1180, u), lerp(1.05, 1.35, ss(u)));
    drawPlate('repay', { t, cam });
    const T = TX.aph, x = T.x, w = T.w, h = T.h; x.fillStyle = '#0e1418'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
    x.fillStyle = '#e8eef0'; x.font = `700 26px ${UI}`; x.fillText('Nikhil', w / 2, 40);
    x.fillStyle = '#26323a'; x.beginPath(); x.roundRect(14, 70, w - 28, 90, 14); x.fill(); x.fillStyle = '#9ad8b0'; x.font = `700 22px ${UI}`; x.fillText('Sent you £5,000', w / 2, 125);
    const k = clamp((t - HIT.typed) / .9); if (k > 0) { const s = 'Sorry da.'.slice(0, Math.ceil(k * 9)); x.fillStyle = '#1e5a3c'; x.beginPath(); x.roundRect(30, h - 120, w - 44, 70, 14); x.fill(); x.fillStyle = '#fff'; x.font = `600 26px ${UI}`; x.fillText(s, w / 2, h - 75); }
    screen(T, p.a.phone, { cam, t });
    F(p.f.ano, { look: [.7, .9], brow: lerp(.5, -.6, ss(u)), blink: blink(t, 2) * .5, tear: seg(u, .5, 1) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, lightCol: [1, .96, .86] } };
  },
  arrivals(t) {
    const p = plate('arrivals'), u = U('arrivals', t), [a, b] = range('arrivals'), kk = v => (v - a) / (b - a);
    const cam = camK(u, [[0, [600, 1150, .98]], [kk(LT.c15 - .2), [300, 1000, 1.35]], [kk(LT.c16 - .2), [520, 900, 1.4]], [kk(LT.c17 - .3), [820, 1150, 1.3]], [kk(LT.c18 - .3), [560, 900, 1.45]], [1, [600, 1050, 1.08]]]);
    drawPlate('arrivals', { t, cam });
    const [wx, wy] = p.a.watch; dyn.push({ x: wx, y: wy, ang: 1.25, len: 64, wid: 26, c: hex('#d4d8e0'), c2: hex('#8a909a'), type: KNIFE, seed: 5, hgt: 1.5 });
    const g = seg(u, .6, .7); if (g > 0 && g < 1) dyn.push({ x: wx + 8, y: wy - 12, ang: .8, len: 46 * Math.sin(g * Math.PI), wid: 7, c: [1, 1, 1], type: KNIFE, seed: 7 });
    F(p.f.amma, { mouth: mouth(t, 'amma'), smile: .7, brow: -.3, look: [.6, -.2], blink: blink(t, 3), tear: seg(u, .2, .8) });
    F(p.f.achan, { mouth: mouth(t, 'achan'), smile: .6, look: [-.7, .4], blink: blink(t, 5), tear: seg(t, LT.c18, LT.c18 + 2) });
    F(p.f.nik, { mouth: mouth(t, 'nik'), smile: .75, look: [-.5, .1], blink: blink(t, 1) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.07, sat: 1.08, lightCol: [1, .92, .74] } };
  },
  veranda(t) {
    const p = plate('veranda'), u = U('veranda', t), cam = camOf(600, 1150, lerp(.98, 1.08, u));
    drawPlate('veranda', { t, cam });
    rain(t, { box: [130, 180, 1070, 1500], n: 160, alpha: .4, ang: 1.62 }); flush({ t, cam, run: 0 });
    const bz = seg(t, HIT.buzz, HIT.buzz + 1.2); if (bz > 0) { dyn.push({ x: p.a.phone[0] + 70, y: p.a.phone[1] + 30, ang: 0, len: 150, wid: 70, c: hex('#9cc4ff'), type: DAB, alpha: .7 * (1 - bz * .4), seed: 9 }); flush({ t, cam, run: 0 }); }
    F(p.f.nik, { look: [.6, .7], brow: .1, blink: blink(t, 4) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, lightCol: [1, .8, .5], vig: .4 } };
  },
  msg(t) {
    const u = U('msg', t), cam = camOf(600, 960, lerp(1.0, 1.1, u));
    phoneShot('phone27', t, cam, T => {
      const msgs = [{ from: 'Jithin', text: 'Bro, എന്റെ ജോലി പോയി. നീ എന്നെ ട്രേഡിങ് പഠിപ്പിക്ക്. പിള്ളേരുടെ കയ്യിൽ നിന്ന് വീണ്ടും കാശ് എടുക്കാം, പഴയ പോലെ.', ml: true, fromCol: '#7ab8ff' }];
      if (t > HIT.photo) msgs.push({ me: true, text: 'Rule 1: Never trade someone else\'s money.' });
      chatUI(T, 'Jithin', msgs);
      if (t > HIT.photo && t < HIT.photo + .25) { T.x.fillStyle = 'rgba(255,255,255,.8)'; T.x.fillRect(0, 0, T.w, T.h); }
    });
    return { post: { expo: 1.04, lightCol: [1, .85, .6] } };
  },
  veranda2(t) {
    const p = plate('veranda'), u = U('veranda2', t), cam = camOf(lerp(560, 600, u), lerp(1100, 1000, u), lerp(1.15, 1.25, u));
    drawPlate('veranda', { t, cam });
    rain(t, { box: [130, 180, 1070, 1500], n: 160, alpha: .4, ang: 1.62 }); flush({ t, cam, run: 0 });
    F(p.f.nik, { look: [-.6, -.3], smile: .2, brow: 0, blink: blink(t, 2) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04, lightCol: [1, .8, .5], vig: .42 } };
  },
  brand(t) {
    bgStrokes(['#0c1410', '#121a14', '#060a08']); flush({ t });
    drawPlate('brand', { t, cam: SCREEN_CAM, M: TR(40, 560), appear: HIT.brand, noUnder: true });
    return { post: { vig: .55 } };
  },
  end(t) {
    const [a] = range('end'), u = U('end', t), cam = camOf(600, lerp(1100, 1000, u), lerp(.98, 1.06, u));
    drawPlate('palms', { t, cam });
    rain(t, { n: 220, alpha: .35, ang: 1.66 }); flush({ t, run: 0 });
    const k = eo(seg(t, HIT.candle, HIT.candle + 1.0)), fade = 1 - seg(t, HIT.redcandle - .2, HIT.redcandle + .6) * .7;
    if (k > 0) { dyn.push({ x: W / 2, y: 820 - 110 * k, ang: Math.PI / 2, len: 260 * k + 1, wid: 80, c: hex('#2fb46a'), c2: hex('#5ae08e'), type: KNIFE, seed: 9, run: 0, alpha: fade }); dyn.push({ x: W / 2, y: 820 - 110 * k, ang: Math.PI / 2, len: 400 * k + 1, wid: 7, c: hex('#5ae08e'), type: KNIFE, seed: 10, alpha: fade }); embers(t, W / 2, 700, { t0: HIT.candle, n: 16, spread: 200, cols: ['#5ae08e', '#c8ffd8'], alpha: k * .8 }); flush({ t, run: 0 }); }
    if (t > HIT.redcandle) drawPlate('red', { t, cam: SCREEN_CAM, M: TR(40, 1080), appear: HIT.redcandle, noUnder: true });
    return { post: { expo: 1.02, gain: [.94, 1, 1.06], vig: .45 } };
  },
};
