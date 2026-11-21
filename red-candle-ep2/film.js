// Red Candle · Episode 2 "The Fall" — 60 s reel. Shots only; the film core lives in core.js.
import * as TL from './timeline.js';
import * as S from './scenes/sets.js';
import * as S2 from './scenes/sets2.js';
import { run, plate, drawPlate, flush, dyn, screen, TX, chart, chatUI, notif, rain, embers, bgStrokes, mouth, blink, F, U, range, camOf, camK, SCREEN_CAM, UI, TR, mul, SC, appearLate,
  KNIFE, DAB, LINE, hex, clamp, lerp, ss, seg, eo, hash, W, H } from './core.js';
const { HIT } = TL;

const BUILD = {
  title: S.buildEp2Text, onam: S2.buildOnam,
  phoneJ: () => S2.buildPhone({ who: 'jithin', sleeve: '#a9c8e6', cold: true, seed: 51 }),
  phoneN: () => S2.buildPhone({ who: 'nik24', sleeve: '#24324f', warm: true, seed: 52 }),
  phoneB: () => S2.buildPhone({ who: 'nikBroken', sleeve: '#2a2a2e', seed: 53 }),
  lossFace: () => S2.buildFaceCU('nik24', { bg: [[0, '#1a0608'], [1, '#080204']], tint: '#ff3a2a', tintA: .45, light: 0, fg: true, fgLine: '#ff5a4a', seed: 54 }),
  revenge: S2.buildRevenge, laptop: S.buildLaptop, split: S2.buildSplit, confront: S2.buildConfront, leave: S2.buildLeave, bus: S2.buildBusStop,
  notebook: () => S2.buildNotebook({ watch: true }),
};
const TEX = { lap: [960, 850], ph: [544, 1100], m0: [380, 300], m1: [360, 290], m2: [380, 300], page: [880, 1240] };
export const setup = canvas => run(canvas, { TL, BUILD, SHOTS, TEX });

function phoneShot(k, t, cam, draw) { const p = drawPlate(k, { t, cam }); const T = TX.ph; draw(T); screen(T, p.a.screen, { cam, t }); return p; }

const SHOTS = {
  title(t) {
    bgStrokes(['#3a0606', '#4a0a08', '#1a0202']); flush({ t });
    embers(t, W / 2, 1500, { t0: 0, n: 24, spread: 700, cols: ['#ff5a3a', '#ff9a4a'] }); flush({ t });
    drawPlate('title', { t, cam: SCREEN_CAM, M: TR(40, 720), appear: HIT.title, noUnder: true });
    return { post: { vig: .55 } };
  },
  onam(t) {
    const p = plate('onam'), u = U('onam', t);
    const cam = camK(u, [[0, [600, 1150, .98]], [.7, [600, 1000, 1.2]], [1, [580, 960, 1.28]]]);
    drawPlate('onam', { t, cam });
    F(p.f.jit, { mouth: mouth(t, 'jithin') * .7, smile: .35, look: [-.8, .1], brow: .2, blink: blink(t, 3) });
    F(p.f.nik, { look: [.8, 0], brow: .3, blink: blink(t, 7) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.05, sat: 1.06, lightCol: [1, .88, .66] } };
  },
  transfer(t) {
    const u = U('transfer', t), cam = camOf(600, 960, lerp(1.0, 1.1, u));
    phoneShot('phoneJ', t, cam, T => { T.x.fillStyle = '#10141c'; T.x.fillRect(0, 0, T.w, T.h); T.x.fillStyle = '#c8d4f0'; T.x.textAlign = 'center'; T.x.font = `600 110px ${UI}`; T.x.fillText('14:06', T.w / 2, 330);
      if (t > HIT.ping1) notif(T, 'Bank · Payment received', 'Anoop sent you £5,000', seg(t, HIT.ping1, HIT.ping1 + .3)); });
    return { post: { expo: 1.04, gain: [.95, 1, 1.05] } };
  },
  transfer2(t) {
    const u = U('transfer2', t), cam = camOf(600, 960, lerp(1.0, 1.1, u));
    phoneShot('phoneN', t, cam, T => { T.x.fillStyle = '#14100c'; T.x.fillRect(0, 0, T.w, T.h); T.x.fillStyle = '#f0e0c0'; T.x.textAlign = 'center'; T.x.font = `600 110px ${UI}`; T.x.fillText('14:06', T.w / 2, 330);
      if (t > HIT.ping2) notif(T, 'Bank · Payment received', 'Jithin sent you £4,500', seg(t, HIT.ping2, HIT.ping2 + .3)); });
    return { post: { expo: 1.04, lightCol: [1, .9, .75] } };
  },
  green(t) {
    const u = U('green', t), cam = camOf(600, lerp(980, 900, u), lerp(1.0, 1.12, u));
    phoneShot('phoneN', t, cam, T => {
      const msgs = [{ me: true, text: '+6% this week 📈'.replace('📈', '') + ' — all green' }];
      const rep = [['Anoop', 'Legend bro!!'], ['Rahul', 'Too good machane'], ['Jithin', 'Told you he is the guy'], ['Sanju', 'Add me also next month']];
      rep.forEach(([from, text], i) => { if (t > HIT.chatPop + i * .55) msgs.push({ from, text, fromCol: from === 'Jithin' ? '#7ab8ff' : '#f0b060' }); });
      chatUI(T, 'Profit Club', msgs);
    });
    return { post: { expo: 1.05, lightCol: [1, .9, .75] } };
  },
  loss(t) {
    const p = plate('lossFace'), u = U('loss', t), cam = camOf(620, lerp(1060, 980, u), lerp(1.0, 1.35, ss(u)));
    drawPlate('lossFace', { t, cam });
    F(p.f.p, { brow: -.9, look: [.1, .5], blink: blink(t, 4) * .5, mouth: 0 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.02, lift: [.03, 0, 0], vig: .45 } };
  },
  revenge(t) {
    const p = plate('revenge'), [a] = range('revenge'), u = U('revenge', t);
    const cam = camOf(600 + Math.sin(t * 7) * 6, 960 + Math.cos(t * 6) * 6, lerp(.98, 1.08, u), -.06);
    drawPlate('revenge', { t, cam });
    const lot = t < HIT.lot ? '1.0' : t < HIT.lot + .8 ? '2.5' : '5.0';
    ['m0', 'm1', 'm2'].forEach((k, i) => { const T = TX[k], x = T.x; x.fillStyle = '#140808'; x.fillRect(0, 0, T.w, T.h); chart(x, 10, 50, T.w - 20, T.h - 60, { n: 18, seed: 40 + i * 7 + Math.floor((t - a) * 3), bias: -.03 });
      x.fillStyle = '#ff4a3c'; x.font = `700 34px ${UI}`; x.textAlign = 'left'; x.fillText(i === 1 ? `LOT ${lot}` : i ? '−£1,240' : '−£860', 14, 38); screen(T, p.a.mons[i], { cam, t }); });
    const [cx, cy] = p.a.clock, mn = (t - a) * 14;
    dyn.push({ x: cx + Math.cos(mn) * 32, y: cy + Math.sin(mn) * 32, ang: mn, len: 66, wid: 8, c: hex('#1a1a1e'), type: KNIFE, seed: 4 }); flush({ t, cam, run: 0 });
    F(p.f.nik, { brow: -.7, look: [Math.sin(t * 5) * .8, -.4], blink: 0 }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.02, lift: [.04, 0, .02], vig: .45, sat: 1.1 } };
  },
  loan(t) {
    const p = plate('laptop'), u = U('loan', t), cam = camOf(600, 860, lerp(1.05, 1.18, u));
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
    x.fillStyle = '#16161a'; x.font = `700 64px ${UI}`; x.fillText('Personal Loan', w / 2, 140); x.font = `700 130px ${UI}`; x.fillText('£8,000', w / 2, 330);
    const ok = t > HIT.loanOk; x.fillStyle = ok ? '#2a8a4a' : '#1a4aa8'; x.beginPath(); x.roundRect(w / 2 - 230, 420, 460, 120, 24); x.fill(); x.fillStyle = '#fff'; x.font = `700 56px ${UI}`; x.fillText(ok ? 'Approved ✓'.replace('✓', '') : 'Approve loan', w / 2, 500);
    if (t > HIT.loanOk + .8) { x.fillStyle = '#16161a'; x.font = `600 46px ${UI}`; x.fillText('Deposit to broker: Credit card ···· 4600', w / 2, 680); }
    screen(T, p.a.screen, { cam, t });
    return { post: { expo: 1.02, vig: .4 } };
  },
  split(t) {
    const p = plate('split'), u = U('split', t), cam = camOf(600, 1067, lerp(.92, .98, u));
    drawPlate('split', { t, cam });
    F(p.f.nik, { brow: -.9, look: [.3, .4], blink: blink(t, 2) * .4, mouth: 0 });
    F(p.f.jit, { mouth: mouth(t, 'jithin'), smile: .6, look: [-.4, -.2], blink: blink(t, 6) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.04 } };
  },
  margin(t) {
    const p = plate('laptop'), [a] = range('margin'), cam = camOf(600, 860, 1.1 + seg(t, HIT.heart1, HIT.heart1 + .15) * .03 - seg(t, HIT.heart1 + .15, HIT.heart1 + .5) * .03 + seg(t, HIT.heart2, HIT.heart2 + .15) * .04);
    drawPlate('laptop', { t, cam });
    const T = TX.lap, x = T.x, w = T.w, h = T.h; x.fillStyle = '#120404'; x.fillRect(0, 0, w, h); x.textAlign = 'center';
    x.fillStyle = '#ffd0c8'; x.font = `600 56px ${UI}`; x.fillText('Account balance', w / 2, 220); x.fillStyle = '#ff3a2a'; x.font = `700 200px ${UI}`; x.fillText('£0.00', w / 2, 450);
    if (Math.floor((t - a) * 3) % 2 === 0) { x.fillStyle = '#ff2a1e'; x.fillRect(w / 2 - 330, 560, 660, 130); x.fillStyle = '#fff'; x.font = `700 84px ${UI}`; x.fillText('MARGIN CALL', w / 2, 655); }
    screen(T, p.a.screen, { cam, t });
    if (t > HIT.crack) { const k = seg(t, HIT.crack, HIT.crack + .2); for (let i = 0; i < 9; i++) { const ang = i / 9 * 6.28 + hash(i) * .5, L = (200 + hash(i * 3) * 500) * eo(k); dyn.push({ x: W / 2 + 120 + Math.cos(ang) * L / 2, y: 900 + Math.sin(ang) * L / 2, ang, len: L, wid: 4, c: [.9, .9, .95], type: LINE, alpha: .9, seed: i }); } flush({ t }); }
    return { post: { expo: 1.0, vig: .5, lift: [.03, 0, 0] } };
  },
  chat(t) {
    const u = U('chat', t), cam = camOf(600, 960, lerp(1.0, 1.12, u));
    const p = phoneShot('phoneB', t, cam, T => {
      const msgs = [], angry = [['Anoop', 'Where is my money?'], ['Rahul', 'Nikhil call me NOW'], ['Sanju', 'You lost everything??'], ['Anoop', 'Answer the phone'], ['Rahul', 'Where is my money?']];
      angry.forEach(([from, text], i) => { if (t > HIT.flood + i * .2) msgs.push({ from, text, col: '#3a1a1a' }); });
      if (t > HIT.jitMsg) msgs.push({ from: 'Jithin', text: 'ഞാൻ അവനോട് പറഞ്ഞതാ, all-in പോവരുതെന്ന്.', ml: true, fromCol: '#7ab8ff' });
      chatUI(T, 'Profit Club', msgs);
      const x = T.x; x.strokeStyle = 'rgba(230,235,240,.75)'; x.lineWidth = 3; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28 + hash(i) * .4; x.beginPath(); x.moveTo(T.w * .7, T.h * .3); x.lineTo(T.w * .7 + Math.cos(a) * 900, T.h * .3 + Math.sin(a) * 900); x.stroke(); }
    });
    return { post: { expo: 1.02, vig: .45 } };
  },
  anoop(t) {
    const p = plate('confront'), u = U('anoop', t);
    const cam = camK(u, [[0, [620, 1150, 1.0]], [.55, [560, 1100, 1.15]], [.8, [900, 820, 1.45]], [1, [940, 800, 1.5]]]);
    drawPlate('confront', { t, cam });
    F(p.f.ano, { mouth: mouth(t, 'anoop'), brow: .6, look: [-.9, .2], blink: 0 });
    F(p.f.nik, { brow: -.8, look: [u > .55 ? .9 : .6, -.3], blink: blink(t, 3) * .5 });
    F(p.f.jit, { look: [u > .6 ? .9 : -.5, .4], brow: -.2, blink: blink(t, 5) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.0, sat: .85, gain: [.95, .98, 1.04] } };
  },
  leave(t) {
    const p = plate('leave'), u = U('leave', t), cam = camOf(lerp(620, 480, u), lerp(1150, 1150, u), lerp(1.05, .96, u));
    drawPlate('leave', { t, cam });
    F(p.f.jit, { smile: .25, brow: -.4, look: [-.8, .4], blink: blink(t, 2) });
    F(p.f.nik, { brow: -.6, look: [0, 1], blink: blink(t, 6) * .5 }); flush({ t, cam, run: 0 });
    return { post: { expo: .98, sat: .8 } };
  },
  bus(t) {
    const p = plate('bus'), u = U('bus', t), cam = camOf(600, lerp(1150, 980, u), lerp(.96, 1.3, ss(u)));
    drawPlate('bus', { t, cam });
    rain(t, { n: 300, alpha: .55, ang: 1.72 }); flush({ t, run: 0 });
    F(p.f.nik, { mouth: mouth(t, 'nik') * .6, brow: -1, look: [0, .6], blink: blink(t, 3) * .5, tear: seg(t, 51.5, 54) }); flush({ t, cam, run: 0 });
    return { post: { expo: 1.0, gain: [.92, .96, 1.06], lift: [.01, .015, .04] } };
  },
  notebook(t) {
    const p = plate('notebook'), u = U('notebook', t);
    const cam = camK(u, [[0, [600, 860, 1.12]], [.5, [600, 960, 1.1]], [.8, [640, 1640, 1.25]], [1, [660, 1700, 1.3]]]);
    drawPlate('notebook', { t, cam });
    const T = TX.page, x = T.x, w = T.w, h = T.h; x.clearRect(0, 0, w, h); x.fillStyle = '#efe7d2'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1e2a6a'; x.textAlign = 'left'; x.font = `italic 600 92px ${UI}`;
    [['Friends', '£18,000'], ['Loan', '£8,000'], ['Credit card', '£4,600']].forEach(([a, b], i) => { x.fillText(a, 70, 200 + i * 170); x.textAlign = 'right'; x.fillText(b, w - 70, 200 + i * 170); x.textAlign = 'left'; });
    x.fillRect(70, 700, w - 140, 6); x.font = `italic 700 110px ${UI}`; x.fillText('Total', 70, 880); x.textAlign = 'right'; x.fillStyle = '#b01e14'; x.fillText('£30,600', w - 70, 880);
    const c = seg(t, HIT.circle, HIT.circle + .8); if (c > 0) { x.strokeStyle = '#b01e14'; x.lineWidth = 9; x.beginPath(); x.ellipse(w - 290, 845, 260, 110, -.05, 0, 6.3 * c); x.stroke(); }
    screen(T, p.a.page, { cam, t });
    return { post: { expo: 1.02, lightCol: [1, .88, .7], vig: .45 } };
  },
};
