// The cast, as reference illustrations (painted once into knife strokes) + live faces (eyes, brows, mouth) per frame.
// A person is anchored at the chin (x, y); s = head height in scene px (chin to crown). turn: -1 (faces left) .. 1 (faces right).
import { KNIFE, BRUSH, DAB, LINE, hex, mixc, shade } from '../engine/impasto.js';
import { P, E, lin, rad, lerp } from './common.js';

export const CAST = {
  nik19: { skin: '#a8714c', skinD: '#6e4430', hair: '#17110e', hairStyle: 'wavy', beard: 'mous', cloth: 'hoodie', c1: '#8b8d93', c2: '#6c6e75' },
  nik24: { skin: '#a8714c', skinD: '#6e4430', hair: '#17110e', hairStyle: 'wavy', beard: 'trim', cloth: 'overshirt', c1: '#24324f', c2: '#f2efe8' },
  nik27: { skin: '#a8714c', skinD: '#6e4430', hair: '#17110e', hairStyle: 'wavy', beard: 'trim', cloth: 'shirt', c1: '#6b6f3e', c2: '#565a30' },
  nikApron: { skin: '#a8714c', skinD: '#6e4430', hair: '#17110e', hairStyle: 'wavy', beard: 'mous', cloth: 'apron', c1: '#9a9ca2', c2: '#1d1c1f' },
  jithin: { skin: '#c48d68', skinD: '#8a5a40', hair: '#120d0b', hairStyle: 'gelled', beard: 'none', cloth: 'office', c1: '#a9c8e6', c2: '#7fa4c8', lanyard: true, round: 1.08 },
  amma: { skin: '#9c6848', skinD: '#64402c', hair: '#2a2420', hairStyle: 'bun', beard: 'none', cloth: 'saree', c1: '#efe6d0', c2: '#c9a24a', earrings: true, female: true },
  achan: { skin: '#94603f', skinD: '#5e3a26', hair: '#8a8580', hairStyle: 'grey', beard: 'greymous', cloth: 'mundu', c1: '#f1efe8', c2: '#d8d4ca', glasses: true },
  anoop: { skin: '#9a6644', skinD: '#5e3c28', hair: '#140f0c', hairStyle: 'wavy', beard: 'full', cloth: 'jumper', c1: '#6e2232', c2: '#4e1622' },
};

// light: [dx, tint, amount] — dx: which side the key light comes from (-1 left, 1 right); tint: colour of the light on the skin
export function person(R, x, y, s, who, o = {}) {
  const c = CAST[who], turn = o.turn ?? 0, L = o.light ?? 0, tint = o.tint || null, tintA = o.tintA ?? .35, body = o.body ?? 3.6, wide = o.wide ?? 1;
  const u = (px, py) => [x + px * s, y + py * s];
  const pp = pts => P(pts.map(([a, b]) => u(a, b)));
  const skinG = (k = 0) => lin(x - .4 * s, 0, x + .4 * s, 0, L < 0 ? [[0, shiftC(c.skin, 1.12)], [.6, c.skin], [1, c.skinD]] : L > 0 ? [[0, c.skinD], [.4, c.skin], [1, shiftC(c.skin, 1.12)]] : [[0, c.skinD], [.5, c.skin], [1, c.skinD]]);
  const clothG = (col, col2) => lin(x - 1.2 * s * wide, 0, x + 1.2 * s * wide, 0, L < 0 ? [[0, shiftC(col, 1.15)], [.55, col], [1, shiftC(col, .62)]] : L > 0 ? [[0, shiftC(col, .62)], [.45, col], [1, shiftC(col, 1.15)]] : [[0, shiftC(col, .7)], [.5, col], [1, shiftC(col, .7)]]);
  const fr = s * .09, fine = s * .025;
  const hx = turn * .05;                                      // head centre shift for 3/4 views
  // ---- hair behind (bun, long back)
  if (c.hairStyle === 'bun') R.fill(E(...u(hx - turn * .3, -.92), .2 * s, .16 * s), c.hair, { maxR: fine * 2, dir: 'edge' });
  // ---- torso
  const sw = .92 * wide;
  const torso = c2 => { const [ax, ay] = u(-.2, .14), [bx, by] = u(.2, .14); c2.moveTo(ax, ay); c2.quadraticCurveTo(x - .78 * s * wide, y + .22 * s, x - sw * s, y + .66 * s); c2.lineTo(x - (sw + .08) * s, y + body * s); c2.lineTo(x + (sw + .08) * s, y + body * s); c2.lineTo(x + sw * s, y + .66 * s); c2.quadraticCurveTo(x + .78 * s * wide, y + .22 * s, bx, by); c2.closePath(); };
  const base = c.cloth === 'apron' ? c.c1 : c.c1;
  R.fill(torso, clothG(base), { maxR: fr, dir: 90, fallback: 90, hgt: 1.05 });
  // ---- neck
  R.fill(pp([[-.17 + hx, -.2], [.17 + hx, -.2], [.2, .26], [-.2, .26]]), lin(x, y - .2 * s, x, y + .3 * s, [[0, shade4(c.skinD, .85)], [1, c.skin]]), { maxR: fine * 2, dir: 90 });
  // ---- clothes details
  const lw = s * .05;
  if (c.cloth === 'hoodie') {
    R.line(cc => { const [a, b] = u(-.42, .28); cc.moveTo(a, b); cc.quadraticCurveTo(x, y + .62 * s, x + .42 * s, y + .28 * s); }, shiftC(c.c1, .75), s * .16, { maxR: fine * 2 });
    R.line(cc => { cc.moveTo(...u(-.12, .45)); cc.lineTo(...u(-.15, 1.15)); cc.moveTo(...u(.12, .45)); cc.lineTo(...u(.14, 1.12)); }, '#d8d8dc', s * .03, { maxR: fine });
  } else if (c.cloth === 'overshirt') {
    R.fill(pp([[-.32, .26], [.32, .26], [.2, .9], [0, 1.1], [-.2, .9]]), c.c2, { maxR: fine * 2, dir: 90 });
    R.fill(pp([[-.34, .22], [-.05, .5], [-.28, .95], [-.55, .4]]), shiftC(c.c1, 1.25), { maxR: fine * 1.5, dir: 60 });
    R.fill(pp([[.34, .22], [.05, .5], [.28, .95], [.55, .4]]), shiftC(c.c1, .8), { maxR: fine * 1.5, dir: 120 });
  } else if (c.cloth === 'shirt' || c.cloth === 'office' || c.cloth === 'mundu') {
    R.fill(pp([[-.3, .18], [0, .52], [-.18, .66], [-.44, .34]]), shiftC(c.c1, 1.12), { maxR: fine * 1.4, dir: 60 });
    R.fill(pp([[.3, .18], [0, .52], [.18, .66], [.44, .34]]), shiftC(c.c1, .86), { maxR: fine * 1.4, dir: 120 });
    R.line(cc => { cc.moveTo(...u(0, .55)); cc.lineTo(...u(.02, body)); }, shiftC(c.c1, .78), s * .022, { maxR: fine });
    if (c.lanyard) {
      R.line(cc => { cc.moveTo(...u(-.3, .25)); cc.lineTo(...u(-.05, 1.25)); cc.moveTo(...u(.3, .25)); cc.lineTo(...u(.05, 1.25)); }, '#1f3f8a', s * .045, { maxR: fine });
      R.fill(pp([[-.2, 1.22], [.2, 1.22], [.2, 1.72], [-.2, 1.72]]), '#f4f4f0', { maxR: fine, dir: 0 });
      R.fill(pp([[-.2, 1.22], [.2, 1.22], [.2, 1.34], [-.2, 1.34]]), '#2a52b0', { maxR: fine * .6, dir: 0 });
      R.fill(pp([[-.14, 1.4], [-.02, 1.4], [-.02, 1.56], [-.14, 1.56]]), '#9a8a7a', { maxR: fine * .5 });
    }
  } else if (c.cloth === 'saree') {
    R.fill(cc => { cc.moveTo(...u(-1.12, .6)); cc.lineTo(...u(-.7, .35)); cc.lineTo(...u(.95, 2.8)); cc.lineTo(...u(.5, 3.2)); cc.closePath(); }, shiftC(c.c1, .93), { maxR: fr * .7, dir: 55 });
    R.line(cc => { cc.moveTo(...u(-.62, .33)); cc.lineTo(...u(1.0, 2.7)); }, c.c2, s * .14, { maxR: fine * 1.2 });
    R.line(cc => { cc.moveTo(...u(-1.1, .66)); cc.lineTo(...u(.48, 3.18)); }, c.c2, s * .1, { maxR: fine * 1.2 });
  } else if (c.cloth === 'jumper') {
    R.line(cc => { const [a, b] = u(-.3, .24); cc.moveTo(a, b); cc.quadraticCurveTo(x, y + .5 * s, x + .3 * s, y + .24 * s); }, shiftC(c.c1, .72), s * .07, { maxR: fine });
  } else if (c.cloth === 'apron') {
    R.fill(pp([[-.55, .9], [.55, .9], [.7, body], [-.7, body]]), c.c2, { maxR: fr * .6, dir: 90 });
    R.line(cc => { cc.moveTo(...u(-.5, .95)); cc.lineTo(...u(-.22, .2)); cc.moveTo(...u(.5, .95)); cc.lineTo(...u(.22, .2)); }, c.c2, s * .06, { maxR: fine });
  }
  // ---- head
  const [hcx, hcy] = u(hx, -.5);
  if (c.female) R.fill(E(hcx, hcy, .33 * s, .48 * s), skinG(), { maxR: fine * 1.6, dir: 'edge', fallback: 90, detail: .8 });
  else R.fill(E(hcx, hcy, .35 * s * (c.round || 1), .5 * s), skinG(), { maxR: fine * 1.6, dir: 'edge', fallback: 90, detail: .8 });
  // ears
  R.fill(E(...u(hx - .35 + Math.max(0, turn) * .06, -.5), .045 * s, .085 * s), c.skinD, { maxR: fine });
  R.fill(E(...u(hx + .35 + Math.min(0, turn) * .06, -.5), .045 * s, .085 * s), c.skinD, { maxR: fine });
  if (c.earrings) { R.fill(E(...u(hx - .36, -.38), .03 * s, .03 * s), '#e8c060', { maxR: fine * .5, hgt: 1.4 }); R.fill(E(...u(hx + .36, -.38), .03 * s, .03 * s), '#e8c060', { maxR: fine * .5, hgt: 1.4 }); }
  // jaw shadow + nose
  R.tint(E(hcx, hcy + .32 * s, .3 * s, .14 * s), 'rgba(60,30,20,.18)');
  R.fill(pp([[hx + turn * .1 - .01, -.46], [hx + turn * .1 + .04, -.33], [hx + turn * .1 - .045, -.31]]), shade4(c.skin, .82), { maxR: fine * .5, dir: 80 });
  R.fill(E(...u(hx + turn * .1, -.315), .06 * s, .022 * s), shade4(c.skinD, .9), { maxR: fine * .4, dir: 0 });
  // beard
  if (c.beard === 'trim' || c.beard === 'full') {
    const th = c.beard === 'full' ? .13 : .07;
    R.fill(cc => { const [a, b] = u(hx - .34, -.48); cc.moveTo(a, b); cc.quadraticCurveTo(x + (hx - .34) * s, y + (.05 + th) * s, x + hx * s, y + (.04 + th) * s); cc.quadraticCurveTo(x + (hx + .34) * s, y + (.05 + th) * s, x + (hx + .34) * s, y - .48 * s); cc.lineTo(...u(hx + .29, -.42)); cc.quadraticCurveTo(x + (hx + .22) * s, y - .1 * s, x + hx * s, y - .08 * s); cc.quadraticCurveTo(x + (hx - .22) * s, y - .1 * s, x + (hx - .29) * s, y - .42 * s); cc.closePath(); }, c.beard === 'full' ? '#1a1310' : 'rgba(30,22,18,.88)', { maxR: fine * 1.2, dir: 90 });
  }
  if (c.beard === 'mous' || c.beard === 'trim' || c.beard === 'full' || c.beard === 'greymous') {
    const mc = c.beard === 'greymous' ? '#9a948c' : '#1c1411', mw = c.beard === 'mous' ? .035 : .055;
    R.fill(cc => { cc.ellipse(x + (hx + turn * .07) * s, y - .265 * s, .14 * s, mw * s, 0, Math.PI, 0); cc.closePath(); }, mc, { maxR: fine * .6, dir: 0 });
  }
  // hair
  const hc = c.hair, hcL = shiftC(c.hair, 1.8);
  if (c.hairStyle === 'wavy') {
    R.fill(cc => { cc.moveTo(...u(hx - .39, -.46)); cc.bezierCurveTo(x + (hx - .52) * s, y - 1.2 * s, x + (hx + .52) * s, y - 1.22 * s, x + (hx + .4) * s, y - .46 * s); cc.quadraticCurveTo(x + (hx + .36) * s, y - .68 * s, x + (hx + .2) * s, y - .72 * s); cc.quadraticCurveTo(x + (hx + .08) * s, y - .64 * s, x + (hx - .04) * s, y - .73 * s); cc.quadraticCurveTo(x + (hx - .18) * s, y - .66 * s, x + (hx - .28) * s, y - .72 * s); cc.quadraticCurveTo(x + (hx - .36) * s, y - .66 * s, x + (hx - .39) * s, y - .46 * s); cc.closePath(); }, lin(x, y - 1.1 * s, x, y - .6 * s, [[0, hc], [.5, hcL], [1, hc]]), { maxR: fine * 1.6, dir: 'edge', fallback: 20, hgt: 1.25 });
  } else if (c.hairStyle === 'gelled') {
    R.fill(cc => { cc.moveTo(...u(hx - .38, -.5)); cc.bezierCurveTo(x + (hx - .47) * s, y - 1.18 * s, x + (hx + .47) * s, y - 1.18 * s, x + (hx + .38) * s, y - .52 * s); cc.quadraticCurveTo(x + (hx + .3) * s, y - .8 * s, x + (hx - .1) * s, y - .76 * s); cc.quadraticCurveTo(x + (hx - .3) * s, y - .72 * s, x + (hx - .38) * s, y - .5 * s); cc.closePath(); }, lin(x - .4 * s, 0, x + .4 * s, 0, [[0, hc], [.35, '#3a3230'], [.4, hc], [1, hc]]), { maxR: fine * 1.2, dir: 0, hgt: 1.2 });
    R.line(cc => { cc.moveTo(...u(hx - .16, -.9)); cc.quadraticCurveTo(x + (hx - .1) * s, y - 1.02 * s, x + (hx - .12) * s, y - 1.0 * s); }, '#5a5250', s * .02, { maxR: fine * .5 });
  } else if (c.hairStyle === 'bun') {
    R.fill(cc => { cc.moveTo(...u(hx - .35, -.48)); cc.bezierCurveTo(x + (hx - .42) * s, y - 1.08 * s, x + (hx + .42) * s, y - 1.08 * s, x + (hx + .35) * s, y - .48 * s); cc.quadraticCurveTo(x + (hx + .25) * s, y - .84 * s, x + hx * s, y - .78 * s); cc.quadraticCurveTo(x + (hx - .25) * s, y - .76 * s, x + (hx - .35) * s, y - .48 * s); cc.closePath(); }, lin(x - .4 * s, 0, x + .4 * s, 0, [[0, hc], [.3, '#8a847c'], [.36, hc], [.7, '#7a746c'], [.76, hc], [1, hc]]), { maxR: fine * 1.2, dir: 'edge', fallback: 0 });
  } else if (c.hairStyle === 'grey') {
    R.fill(cc => { cc.moveTo(...u(hx - .37, -.5)); cc.bezierCurveTo(x + (hx - .42) * s, y - 1.06 * s, x + (hx + .42) * s, y - 1.06 * s, x + (hx + .37) * s, y - .5 * s); cc.quadraticCurveTo(x + (hx + .3) * s, y - .88 * s, x + hx * s, y - .92 * s); cc.quadraticCurveTo(x + (hx - .3) * s, y - .88 * s, x + (hx - .37) * s, y - .5 * s); cc.closePath(); }, lin(x, y - 1.05 * s, x, y - .6 * s, [[0, '#b0aaa2'], [1, hc]]), { maxR: fine * 1.2, dir: 'edge', fallback: 10 });
  }
  if (c.glasses) {
    for (const sx of [-.14, .14]) R.line(cc => cc.ellipse(x + (hx + sx + turn * .06) * s, y - .53 * s, .1 * s, .07 * s, 0, 0, 7), '#3a2a20', s * .018, { maxR: fine * .4, hgt: 1.3 });
    R.line(cc => { cc.moveTo(...u(hx - .04 + turn * .06, -.54)); cc.lineTo(...u(hx + .04 + turn * .06, -.54)); }, '#3a2a20', s * .016, { maxR: fine * .4 });
  }
  // screen / lamp light washing over the face
  if (tint) R.tint(E(hcx + (L || 0) * .1 * s, hcy, .42 * s, .58 * s), rad(hcx + (L || 0) * .3 * s, hcy, .05 * s, .6 * s, [[0, rgba(tint, tintA)], [1, rgba(tint, tintA * .4)]]));
  return { x, y, s, turn, who, hx };
}

// Live face. f = anchor from person(); st: {look:[dx,dy], blink, mouth (0..1 open), smile (-1..1), brow (-1 worried .. 1 raised), tear}
export function face(out, f, st = {}, rev = 0) {
  const c = CAST[f.who], s = f.s, t = f.turn, lk = st.look || [0, 0];
  const X = (dx) => f.x + (f.hx + dx + t * .08) * s, Y = dy => f.y + dy * s;
  const ink = hex('#1a0f0b'), white = hex('#efe6dc');
  const blink = st.blink ?? 0;
  for (const side of [-1, 1]) {
    const ex = X(side * .135), ey = Y(-.53), sq = t * side > 0 ? .85 : 1;
    if (blink < .7) {
      out.push({ x: ex, y: ey, ang: 0, len: .12 * s * sq, wid: .055 * s * (1 - blink), c: white, type: DAB, seed: 11 + side, hgt: .5, rev });
      out.push({ x: ex + lk[0] * .025 * s, y: ey + lk[1] * .012 * s, ang: 0, len: .055 * s, wid: .05 * s * (1 - blink), c: ink, type: DAB, seed: 13 + side, hgt: .6, rev });
      out.push({ x: ex + lk[0] * .025 * s + .012 * s, y: ey - .012 * s, ang: 0, len: .014 * s, wid: .014 * s, c: [1, 1, 1], type: DAB, seed: 15 + side, hgt: .8, rev });
    } else out.push({ x: ex, y: ey + .01 * s, ang: 0, len: .12 * s * sq, wid: .016 * s, c: ink, type: BRUSH, seed: 17 + side, bend: .2, rev });
    // upper lid line
    out.push({ x: ex, y: ey - .028 * s * (1 - blink), ang: 0, len: .13 * s * sq, wid: .016 * s, c: ink, type: BRUSH, seed: 19 + side, bend: -.25, rev, hgt: .5 });
    // brow
    const br = st.brow ?? 0;
    out.push({ x: ex + side * .01 * s, y: ey - (.1 + br * .025) * s, ang: side * (-.03 + (br < 0 ? -br * .3 : 0)), len: .15 * s * sq, wid: .032 * s, c: hex(c.hairStyle === 'grey' ? '#6a645e' : '#1a1210'), type: KNIFE, seed: 21 + side, rev, hgt: .9 });
  }
  if (st.tear) out.push({ x: X(.15), y: Y(-.44 + st.tear * .12), ang: Math.PI / 2, len: .05 * s, wid: .022 * s, c: hex('#cfe0ef'), type: DAB, seed: 27, rev, hgt: 1.2 });
  // mouth
  const m = st.mouth ?? 0, sm = st.smile ?? 0, mx = X(.0) + t * .02 * s, my = Y(-.2);
  const lip = hex(c.female ? '#8a4a40' : '#6e3a2e');
  if (m > .08) {
    out.push({ x: mx, y: my + m * .02 * s, ang: 0, len: (.13 + sm * .03) * s, wid: (.02 + m * .06) * s, c: hex('#3a1612'), type: DAB, seed: 23, rev, hgt: .4 });
    out.push({ x: mx, y: my - .006 * s, ang: 0, len: .14 * s, wid: .018 * s, c: lip, type: BRUSH, bend: -sm * .2, seed: 24, rev });
  } else out.push({ x: mx, y: my, ang: 0, len: (.12 + Math.max(0, sm) * .05) * s, wid: .022 * s, c: lip, type: BRUSH, bend: sm * .35, seed: 25, rev });
}

// simple limbs and hands for posed arms
export function limb(R, pts, w, col, props = {}) {
  R.line(c => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); }, col, w, { maxR: w * .25, dir: 'edge', ...props });
}
export function hand(R, x, y, r, who, ang = 0) {
  const c = CAST[who];
  R.fill(E(x, y, r * 1.05, r * .8, ang), lin(x - r, y, x + r, y, [[0, c.skinD], [.5, c.skin], [1, c.skinD]]), { maxR: r * .3, dir: 'edge' });
  R.line(cc => { cc.moveTo(x + Math.cos(ang) * r * .4, y + Math.sin(ang) * r * .4); cc.lineTo(x + Math.cos(ang) * r * 1.35, y + Math.sin(ang) * r * 1.35); }, c.skin, r * .5, { maxR: r * .15 });
}

export function shiftC(h, k) { const c = hex(h); return '#' + c.map(v => Math.round(Math.min(1, Math.max(0, v * k)) * 255).toString(16).padStart(2, '0')).join(''); }
function shade4(h, k) { return shiftC(h, k); }
export function rgba(h, a) { const c = hex(h); return `rgba(${c[0] * 255 | 0},${c[1] * 255 | 0},${c[2] * 255 | 0},${a})`; }
