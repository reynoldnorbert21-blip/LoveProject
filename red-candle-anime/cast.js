// Red Candle · 80s cel cast. One head function for every character (cranium sphere + jaw, 3/4 and front views), Kerala skin tones,
// coloured lines (iro-sen), hard shadow + highlight crescents, flat fills. Local units: cranium radius 80, eyes at +24, nose base +56, mouth +78, chin +114.
// Adapted from the library's head80.js (eye, mouth, lock, angel-ring construction), redrawn for men and older women.
import { cel, path, poly, line, TAU, rgba, mix, hex, LWK } from './engine/cel.js';

const LW = 1.5, LS = LW * .8, LH = LW * 1.05;

// —— colour models ——  day base per character; lights multiply lit / shade / line separately (色指定)
const SKIN = {
  nik: { f: '#c98e66', s: '#93593f', h: '#e6b78f', l: '#4e2618' },
  amma: { f: '#c68b64', s: '#8e5639', h: '#e4b58c', l: '#4a2416' },
  achan: { f: '#b67c56', s: '#7e4a30', h: '#d8a47c', l: '#40200f' },
  jithin: { f: '#b0764e', s: '#78452b', h: '#d29e74', l: '#3e1e0e' },
  anoop: { f: '#c08560', s: '#87513a', h: '#e0ae86', l: '#482214' },
  mentor: { f: '#a66e4a', s: '#6e3f28', h: '#c8946c', l: '#3a1c0c' },
};
const HAIR = {
  black: { f: '#2c2a40', s: '#16141f', h: '#625e86', l: '#0c0a16' },
  grey: { f: '#c4c0cc', s: '#86828f', h: '#f2f0f6', l: '#46424f' },
  pepper: { f: '#5c5866', s: '#34313c', h: '#9c98a8', l: '#1a1820' },
};
export const CLOTH = {
  hoodie: { f: '#7d8496', s: '#545a6c', h: '#a9b0c2', l: '#272b38' },
  hoodieDark: { f: '#3a3f50', s: '#242834', h: '#5f667c', l: '#0f1118' },
  shirt: { f: '#a9cdf0', s: '#7298c4', h: '#d8ecff', l: '#2c4a72' },
  navy: { f: '#28396a', s: '#18244a', h: '#4f66a4', l: '#0a1230' },
  white: { f: '#f2efe6', s: '#c2bcae', h: '#ffffff', l: '#5a5446' },
  gold: { f: '#e0ae3c', s: '#a8761c', h: '#ffe08a', l: '#5a3a08' },
  maroon: { f: '#8e2a36', s: '#5e1822', h: '#c25462', l: '#2e080e' },
  black: { f: '#2a2a32', s: '#16161c', h: '#55556a', l: '#060608' },
  green: { f: '#5e7a3e', s: '#3e5426', h: '#8aa862', l: '#1c2a0e' },
  hivis: { f: '#f2e01c', s: '#b8a40c', h: '#fff88a', l: '#5a4e00' },
  silver: { f: '#d8dce4', s: '#9aa0ac', h: '#ffffff', l: '#4a4e58' },
  cream: { f: '#f0e2c0', s: '#c4b088', h: '#fff6de', l: '#5c4a26' },
  blue: { f: '#2f6fd2', s: '#1d469a', h: '#7eaaf2', l: '#0e2252' },
  red: { f: '#d23a2a', s: '#962216', h: '#ff8070', l: '#4a0c06' },
  grey: { f: '#9a9aa2', s: '#6c6c76', h: '#c8c8d0', l: '#2c2c34' },
};
const EYE = { f: '#6a4430', s: '#341e12', h: '#b08060', l: '#160a04' };

export const LIGHTS = {
  day: { lit: [1, 1, 1], shade: [1, 1, 1], line: [1, 1, 1] },
  warm: { lit: [1.04, .93, .8], shade: [.92, .74, .7], line: [.95, .8, .75] },        // lamp-lit Kerala home, pub, sunset interior
  sunset: { lit: [1.08, .86, .7], shade: [.8, .56, .62], line: [.9, .7, .72] },
  cool: { lit: [.86, .9, 1.02], shade: [.7, .72, .92], line: [.85, .85, 1] },         // office, airport, overcast
  night: { lit: [.66, .68, .92], shade: [.44, .44, .74], line: [.65, .6, .9] },       // dark room lit by a phone
  rain: { lit: [.6, .68, .84], shade: [.4, .46, .66], line: [.6, .62, .8] },
  screen: { lit: [.72, .86, 1.06], shade: [.38, .42, .66], line: [.6, .62, .9] },     // face lit only by a monitor
  red: { lit: [1.0, .62, .58], shade: [.6, .26, .34], line: [.7, .4, .45] },          // the loss
  sil: { lit: [.2, .16, .3], shade: [.14, .1, .22], line: [.3, .2, .45] },
};
const mul = (c, m) => '#' + hex(c).map((x, i) => Math.max(0, Math.min(255, Math.round(x * m[i]))).toString(16).padStart(2, '0')).join('');
const tone = (o, L) => ({ f: mul(o.f, L.lit), s: mul(o.s, L.shade), h: mul(o.h || o.f, L.lit), l: mul(o.l, L.line) });
const toneC = (c, L) => mul(c, L.lit);

// —— the cast ——
export const CAST = {
  nik19: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: .4, cloth: 'tee', cc: 'blue' },
  nik: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .35, cloth: 'hoodie', cc: 'hoodie' },
  nikShirt: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .35, cloth: 'shirt', cc: 'shirt', lanyard: 1 },
  nikKasavu: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .35, cloth: 'kasavu', cc: 'cream' },
  nikBroken: { skin: 'nik', hair: 'black', style: 'messy', m: 1, mus: 1, beard: 1, cloth: 'hoodie', cc: 'hoodieDark', tired: 1 },
  nikApron: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .35, cloth: 'apron', cc: 'grey' },
  nikHivis: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .8, cloth: 'hivis', cc: 'hoodieDark' },
  nikGreen: { skin: 'nik', hair: 'black', style: 'short', m: 1, mus: 1, beard: .8, cloth: 'tee', cc: 'green' },
  jithin: { skin: 'jithin', hair: 'black', style: 'swept', m: 1, mus: 1, beard: 1, cloth: 'blazer', cc: 'navy' },
  jithinDown: { skin: 'jithin', hair: 'black', style: 'messy', m: 1, mus: 1, beard: 1, cloth: 'tee', cc: 'black', tired: 1 },
  anoop: { skin: 'anoop', hair: 'black', style: 'short', m: 1, mus: 1, beard: .6, cloth: 'tee', cc: 'maroon' },
  anoopKasavu: { skin: 'anoop', hair: 'black', style: 'short', m: 1, mus: 1, beard: .6, cloth: 'kasavu', cc: 'cream' },
  amma: { skin: 'amma', hair: 'black', style: 'bun', m: 0, cloth: 'saree', cc: 'white', bindi: 1, streak: 1 },
  achan: { skin: 'achan', hair: 'grey', style: 'old', m: 1, mus: 1, glasses: 1, cloth: 'kurta', cc: 'white', age: 1 },
  mentor: { skin: 'mentor', hair: 'pepper', style: 'short', m: 1, mus: 1, beard: .9, cloth: 'tee', cc: 'black', age: .5 },
};
export function pal(who, light = 'day') {
  const C = CAST[who], L = LIGHTS[light] || light;
  return { C, L, skin: tone(SKIN[C.skin], L), hair: tone(HAIR[C.hair], L), eye: tone(EYE, L), cloth: tone(CLOTH[C.cc], L),
    gold: tone(CLOTH.gold, L), white: tone(CLOTH.white, L), silver: tone(CLOTH.silver, L), hivis: tone(CLOTH.hivis, L), blue: tone(CLOTH.blue, L), black: tone(CLOTH.black, L),
    lash: toneC('#1a0e12', L), we: toneC('#f6f1ea', L), blush: toneC('#d86a5a', L), lip: toneC('#9a4a44', L), grey: tone(HAIR.grey, L) };
}

// —— geometry per view ——
const V = {
  front: {
    faceM: [[-68, -40], [-70, 4], [-68, 40], [-63, 68], [-52, 90], [-30, 107], [0, 115], [30, 107], [52, 90], [63, 68], [68, 40], [70, 4], [68, -40], [36, -64], [-36, -64]],
    faceF: [[-66, -40], [-67, 4], [-64, 36], [-57, 64], [-44, 88], [-24, 105], [0, 114], [24, 105], [44, 88], [57, 64], [64, 36], [67, 4], [66, -40], [36, -64], [-36, -64]],
    neck: [[-28, 76], [28, 76], [32, 146], [-32, 146]],
    chin: [[-42, 76], [42, 76], [42, 94], [26, 107], [0, 116], [-26, 107], [-42, 94]],
    far: [[92, 26], [92, 124], [28, 110], [48, 92], [58, 70], [63, 46], [66, 26]],
    eyes: [{ x: -36, y: 24, dir: -1, fs: 1 }, { x: 36, y: 24, dir: 1, fs: 1 }],
    brows: [[-14, -2, -56, 0], [14, -2, 56, 0]],
    nose: [[2, 34], [8, 54], [0, 57]], noseB: [[-4, 57], [4, 57.5]],
    mouth: { x: 0, y: 78, w: 26, fs: 1 },
    ears: [[-70, 28, -1], [70, 28, 1]],
    blush: [[-40, 50], [40, 50]],
    beard: [[-69, 16], [-67, 56], [-56, 86], [-34, 110], [0, 121], [34, 110], [56, 86], [67, 56], [69, 16], [62, 46], [48, 76], [26, 94], [0, 98], [-26, 94], [-48, 76], [-62, 46]],
    mus: [[-20, 66], [-8, 61], [0, 63], [8, 61], [20, 66], [22, 71], [10, 67], [0, 68], [-10, 67], [-22, 71]],
    glass: [[-36, 24, 25, 19], [36, 24, 25, 19]],
    dx: 0,
  },
  q: {
    faceM: [[-66, -44], [-69, -4], [-68, 32], [-63, 62], [-50, 88], [-26, 106], [6, 114], [28, 109], [42, 97], [50, 81], [52, 66], [56, 48], [58, 32], [53, 18], [56, 0], [56, -40], [18, -64], [-36, -64]],
    faceF: [[-64, -44], [-67, -4], [-66, 30], [-60, 60], [-46, 86], [-24, 104], [4, 114], [24, 108], [38, 94], [46, 78], [48, 64], [53, 46], [55, 30], [50, 16], [53, 0], [54, -40], [18, -64], [-36, -64]],
    neck: [[-36, 66], [14, 90], [18, 146], [-42, 146]],
    chin: [[-48, 66], [22, 66], [22, 98], [6, 116], [-26, 106], [-48, 88]],
    far: [[92, 30], [92, 124], [20, 114], [36, 100], [43, 84], [46, 70], [49, 56], [53, 44], [57, 30]],
    eyes: [{ x: -20, y: 24, dir: -1, fs: 1 }, { x: 36, y: 22, dir: 1, fs: .62 }],
    brows: [[2, -2, -42, 0], [26, -4, 50, 1]],
    nose: [[40, 36], [48, 53], [40, 57]], noseB: [[38, 57.5], [46, 55]],
    mouth: { x: 24, y: 79, w: 24, fs: .7 },
    ears: [[-62, 30, -1]],
    blush: [[-28, 50], [46, 48]],
    beard: [[-67, 10], [-65, 56], [-51, 89], [-26, 109], [6, 121], [30, 111], [44, 99], [52, 82], [54, 68], [44, 84], [28, 96], [8, 98], [-16, 92], [-40, 74], [-58, 40]],
    mus: [[6, 67], [20, 61], [30, 62], [42, 61], [48, 66], [46, 71], [34, 67], [24, 68], [10, 71]],
    glass: [[-20, 24, 26, 19], [37, 22, 16, 18]],
    dx: -14,
  },
};

// hair styles: cap / back / locks [x0,y0,x1,y1,tipx,tipy,bend] / side locks / halo
const STY = {
  short: {
    front: { back: [[-82, -20], [-84, 22], [-72, 40], [72, 40], [84, 22], [82, -20], [0, -64]], cap: [[-82, 12], [-88, -40], [-66, -88], [-24, -104], [26, -104], [66, -88], [88, -40], [82, 12], [72, -22], [0, -50], [-72, -22]],
      locks: [[-86, -50, -56, -76, -80, -6, -4], [-62, -80, -22, -94, -52, -24, -4], [-32, -94, 8, -96, -16, -30, 3], [-2, -96, 38, -90, 20, -34, 6], [28, -90, 64, -76, 50, -24, 6], [54, -78, 86, -52, 78, -10, 6]],
      side: [[-82, -30, -68, -46, -76, 36, -4], [82, -30, 68, -46, 76, 36, 4]], halo: [0, -16, 72, 56, Math.PI * 1.12, Math.PI * 1.88, 7, 7] },
    q: { back: [[-80, -30], [-92, 18], [-82, 46], [-50, 52], [40, 40], [58, 10], [58, -20], [-10, -60]], cap: [[-86, 8], [-92, -44], [-68, -90], [-22, -106], [26, -102], [58, -82], [66, -48], [60, -8], [46, -28], [0, -50], [-60, -30]],
      locks: [[-94, -50, -64, -76, -88, 0, -5], [-62, -88, -24, -98, -52, -24, -3], [-32, -98, 6, -100, -12, -30, 3], [-2, -100, 34, -92, 20, -32, 6], [22, -92, 56, -78, 46, -22, 6], [42, -82, 66, -58, 64, -12, 5]],
      side: [[-86, -40, -68, -56, -82, 30, -6]], halo: [-12, -18, 70, 56, Math.PI * 1.14, Math.PI * 1.84, 7, 7] },
  },
  swept: {   // Jithin: hair swept up and back, a confident quiff
    front: { back: [[-82, -20], [-84, 22], [-72, 40], [72, 40], [84, 22], [82, -20], [0, -64]], cap: [[-82, 10], [-88, -44], [-66, -96], [-20, -116], [30, -114], [70, -92], [88, -44], [82, 10], [72, -30], [10, -62], [-72, -30]],
      locks: [[-70, -84, -20, -110, 30, -120, 10], [-40, -100, 10, -112, 60, -104, 10], [-84, -50, -60, -84, -82, -14, -4], [60, -92, 86, -56, 82, -14, 6]],
      side: [[-82, -30, -68, -46, -76, 34, -4], [82, -30, 68, -46, 76, 34, 4]], halo: [0, -24, 72, 62, Math.PI * 1.12, Math.PI * 1.88, 7, 7] },
    q: { back: [[-80, -30], [-92, 18], [-82, 46], [-50, 52], [40, 40], [58, 10], [58, -20], [-10, -60]], cap: [[-86, 6], [-92, -48], [-66, -98], [-16, -118], [36, -112], [62, -86], [66, -50], [60, -14], [44, -36], [4, -62], [-60, -34]],
      locks: [[-70, -90, -24, -112, 34, -122, 10], [-40, -106, 6, -116, 62, -102, 10], [-94, -50, -66, -82, -90, -6, -5], [44, -90, 66, -60, 66, -18, 5]],
      side: [[-86, -40, -68, -56, -82, 28, -6]], halo: [-12, -26, 70, 62, Math.PI * 1.14, Math.PI * 1.84, 7, 7] },
  },
  messy: {   // broken Nikhil: longer, uncombed locks falling over the brow
    front: { back: [[-84, -20], [-88, 30], [-76, 56], [76, 56], [88, 30], [84, -20], [0, -64]], cap: [[-84, 16], [-92, -40], [-68, -90], [-24, -106], [26, -106], [68, -90], [92, -40], [84, 16], [72, -18], [0, -46], [-72, -18]],
      locks: [[-92, -50, -60, -78, -88, 14, -6], [-66, -84, -26, -96, -56, -6, -8], [-36, -96, 4, -98, -24, -2, 5], [-6, -98, 34, -94, 10, -4, -6], [24, -92, 60, -80, 40, -8, 7], [52, -80, 90, -54, 84, 10, 7], [-14, -98, 10, -98, -2, 6, 3]],
      side: [[-84, -30, -68, -46, -80, 52, -6], [84, -30, 68, -46, 80, 52, 6]], halo: [0, -14, 74, 56, Math.PI * 1.15, Math.PI * 1.85, 7, 6] },
    q: { back: [[-80, -30], [-96, 22], [-86, 58], [-50, 62], [40, 44], [58, 10], [58, -20], [-10, -60]], cap: [[-88, 12], [-94, -44], [-70, -92], [-22, -108], [26, -104], [58, -84], [68, -48], [62, -4], [46, -22], [0, -46], [-60, -26]],
      locks: [[-98, -50, -66, -78, -94, 16, -6], [-64, -90, -26, -100, -56, -4, -8], [-34, -100, 4, -102, -18, 0, 5], [-4, -102, 32, -96, 14, -2, -6], [20, -94, 56, -80, 46, -4, 7], [42, -84, 68, -58, 70, 6, 6]],
      side: [[-88, -40, -70, -56, -86, 46, -6]], halo: [-12, -16, 70, 56, Math.PI * 1.15, Math.PI * 1.84, 7, 6] },
  },
  old: {   // Achan: grey, receding, combed back
    front: { back: [[-82, -10], [-84, 24], [-72, 40], [72, 40], [84, 24], [82, -10], [0, -60]], cap: [[-82, 8], [-86, -40], [-68, -82], [-28, -98], [28, -98], [68, -82], [86, -40], [82, 8], [76, -30], [50, -66], [0, -76], [-50, -66], [-76, -30]],
      locks: [[-84, -40, -70, -70, -80, 0, -3], [70, -70, 84, -40, 80, 0, 3]],
      side: [[-82, -24, -70, -40, -76, 30, -3], [82, -24, 70, -40, 76, 30, 3]], halo: [0, -30, 70, 56, Math.PI * 1.15, Math.PI * 1.85, 6, 5] },
    q: { back: [[-80, -20], [-92, 18], [-82, 44], [-50, 50], [40, 38], [56, 10], [56, -20], [-10, -60]], cap: [[-86, 4], [-90, -44], [-70, -86], [-24, -100], [22, -98], [54, -82], [62, -56], [50, -64], [10, -78], [-40, -70], [-70, -34]],
      locks: [[-92, -46, -76, -72, -88, -4, -4]],
      side: [[-86, -34, -70, -50, -82, 26, -5]], halo: [-12, -32, 68, 54, Math.PI * 1.15, Math.PI * 1.82, 6, 5] },
  },
  bun: {   // Amma: centre parting, hair drawn back to a bun at the nape
    front: { back: [[-84, -20], [-90, 30], [-80, 64], [80, 64], [90, 30], [84, -20], [0, -60]], cap: [[-82, 20], [-90, -40], [-66, -88], [-20, -104], [20, -104], [66, -88], [90, -40], [82, 20], [70, -14], [30, -54], [0, -70], [-30, -54], [-70, -14]],
      locks: [[-2, -102, -40, -96, -86, 6, -16], [2, -102, 40, -96, 86, 6, 16]],
      side: [[-82, -20, -70, -36, -80, 44, -4], [82, -20, 70, -36, 80, 44, 4]], halo: [0, -20, 70, 56, Math.PI * 1.12, Math.PI * 1.88, 8, 6], bun: [0, 0, 0] },
    q: { back: [[-80, -30], [-94, 20], [-86, 56], [-54, 62], [40, 44], [58, 10], [58, -20], [-10, -60]], cap: [[-86, 14], [-92, -44], [-68, -90], [-20, -106], [22, -102], [56, -84], [66, -48], [60, 4], [46, -24], [18, -62], [-24, -60], [-62, -24]],
      locks: [[14, -102, -20, -98, -90, 2, -18], [18, -102, 44, -92, 64, 0, 12]],
      side: [], halo: [-12, -20, 70, 56, Math.PI * 1.14, Math.PI * 1.84, 8, 6], bun: [-84, 30, 34] },
  },
};

// ——— features ———
function eye(g, P, cx, cy, w, h, dir, fs, E, male) {
  const open = Math.max(0, E.open ?? 1), lid = E.lid || 0, W2 = w / 2, lash = P.lash;
  const X = u => cx + dir * u * W2;
  const inY = cy + h * .1, outY = cy - h * .06 - (E.smileEyes ? h * .06 : 0) + (E.sad ? h * .1 : 0);
  const topY = cy - h * .5 * open + lid * h * .32 + (E.sad ? h * .08 : 0);
  const botY = cy + h * .45 * Math.min(1, open + .25) - (E.smileEyes ? h * .3 : 0);
  if (open > .08) {
    const WP = path([[X(-1), inY, 1], [X(-.4), topY + h * .05], [X(.3), topY], [X(1), outY, 1], [X(.45), botY], [X(-.4), botY - h * .02]], true);
    g.save(); g.clip(WP);
    g.fillStyle = P.we; g.fill(WP);
    g.fillStyle = mix(P.we, P.skin.s, .55); g.fillRect(cx - w, topY - 6, w * 2, h * .24 + 6);
    const sc = E.iris || 1, iw = w * (male ? .23 : .25) * sc, ih = h * (male ? .5 : .46) * sc;
    const ix = cx + dir * W2 * .04 + (E.look?.[0] || 0) * w * .17, iy = cy + h * .08 + (E.look?.[1] || 0) * h * .16;
    const IR = new Path2D(); IR.ellipse(ix, iy, iw, ih, 0, 0, TAU);
    g.fillStyle = P.eye.f; g.fill(IR);
    g.save(); g.clip(IR);
    g.fillStyle = P.eye.s; g.fillRect(ix - iw, iy - ih, iw * 2, ih * .95);
    g.fillStyle = mix(P.eye.s, lash, .5); g.fillRect(ix - iw, iy - ih, iw * 2, ih * .38);
    g.fillStyle = mix(P.eye.l, lash, .3); g.beginPath(); g.ellipse(ix, iy - ih * .02, iw * .46, ih * .5, 0, 0, TAU); g.fill();
    g.fillStyle = P.eye.h; g.beginPath(); g.ellipse(ix, iy + ih * .9, iw * 1.05, ih * .5, 0, 0, TAU); g.fill();
    if (E.reflect) { g.strokeStyle = rgba(E.reflect, .8); g.lineWidth = iw * .22; g.beginPath(); g.arc(ix, iy, ih * .7, .3, 1.4); g.stroke(); }
    g.restore();
    g.strokeStyle = mix(P.eye.l, lash, .5); g.lineWidth = LW * .7 * LWK.k; g.stroke(IR);
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(ix - dir * iw * .34, iy - ih * .34, iw * .42, ih * .26, -.5 * dir, 0, TAU); g.fill();
    g.beginPath(); g.arc(ix + dir * iw * .42, iy + ih * .34, iw * .2, 0, TAU); g.fill();
    if (E.wet) {   // welling tears: a glossy band on the lower lid + extra wobbling highlights
      g.fillStyle = rgba('#ffffff', .55 * E.wet); g.beginPath(); g.ellipse(cx, botY - h * .05, w * .6, h * .12, 0, 0, TAU); g.fill();
      g.fillStyle = rgba('#ffffff', .9 * E.wet); g.beginPath(); g.arc(ix + dir * iw * .1, iy + ih * .62, iw * .16, 0, TAU); g.fill();
    }
    g.restore();
    line(g, [[X(.95), outY + h * .12], [X(.5), botY + 1], [X(.05), botY + 1.5]], mix(P.skin.l, P.skin.f, .35), LS * .8);
  }
  const t = h * (male ? .14 : .19);
  if (open > .08) {
    cel(g, [[X(-1.03), inY + 1, 1], [X(-.4), topY + h * .05 - t * .6], [X(.3), topY - t * .75], [X(.95), outY - t], [X(male ? 1.08 : 1.22), outY - t * (male ? 1.2 : 2.0), 1],
      [X(1.02), outY + t * .5], [X(.3), topY + t * .45], [X(-.4), topY + h * .05 + t * .35], [X(-.98), inY + t * .6, 1]], { f: lash });
    if (!male) for (let k = 0; k < 2; k++) { const u = .6 + k * .24, bx = X(u), by = topY + (outY - topY) * ((u - .3) / .7) - t * .5;
      cel(g, [[bx - dir * 2, by, 1], [bx + dir * (4 + k * 3), by - h * (.15 + k * .05), 1], [bx + dir * 3, by + 1, 1]], { f: lash }); }
    line(g, [[X(-.25), topY - h * .22], [X(.45), topY - h * .25], [X(1), outY - h * .3]], mix(P.skin.l, P.skin.f, .3), LS * .85);
    if (E.bags) line(g, [[X(-.6), botY + h * .3], [X(.1), botY + h * .38], [X(.7), botY + h * .26]], mix(P.skin.l, P.skin.f, .5), LS * .8);
  } else {
    cel(g, [[X(-1), inY, 1], [X(0), cy + h * .22], [X(1.05), outY + h * .04], [X(1.15), outY - t, 1], [X(1), outY + t * .8], [X(0), cy + h * .22 + t * .8], [X(-.98), inY + t * .5, 1]], { f: lash });
  }
}
function brow(g, P, ix, iy, ox, oy, B, male) {
  const a = [ix, iy + B[0]], c = [ox, oy + B[1]], m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2 - B[2]], k = male ? 2.6 : 1.4;
  cel(g, [[a[0], a[1] - k, 1], [m[0], m[1] - k * 1.1], [c[0], c[1] - .3, 1], [m[0], m[1] + k * .8], [a[0], a[1] + k, 1]], { f: P.C.age ? mix(P.hair.s, P.lash, .4) : P.lash });
}
function mouth(g, P, cx, cy, w, type, fs = 1) {
  const L = cx - w / 2, R = cx + w / 2 * fs, lc = P.skin.l;
  const lowerLip = (y, ww) => line(g, [[cx - ww * .6, y], [cx + ww * .5, y]], mix(lc, P.skin.f, .5), LS * .75);
  if (type === 'closed' || type === 'set') {
    line(g, [[L, cy + (type === 'set' ? 1.6 : 0)], [cx - w * .12, cy - .6], [cx + w * .06, cy + .2], [R, cy + (type === 'set' ? 1.6 : 0)]], lc, LS * 1.05); lowerLip(cy + 5.5, w * .2);
  } else if (type === 'frown') {
    line(g, [[L, cy + 3], [cx - w * .1, cy - .8], [cx + w * .08, cy - .6], [R, cy + 3]], lc, LS * 1.05); lowerLip(cy + 6, w * .2);
  } else if (type === 'smile') {
    line(g, [[L - 1, cy - 3], [cx - w * .15, cy + 1.6], [cx + w * .1, cy + 1.6], [R + 1, cy - 3]], lc, LS * 1.05); lowerLip(cy + 6.5, w * .16);
  } else {
    let pts, teeth = 0, tongue = 0, bot;
    if (type === 'smileopen') { pts = [[L - 1, cy - 3, 1], [cx, cy - 2], [R + 1, cy - 3, 1], [cx + w * .2, cy + 6], [cx, cy + 10], [cx - w * .22, cy + 6]]; teeth = 1; tongue = 1; bot = cy + 10; }
    else if (type === 'oh') { pts = [[cx - w * .24, cy + 3], [cx, cy - 4], [cx + w * .22, cy + 3], [cx + w * .16, cy + 14], [cx - w * .16, cy + 14]]; bot = cy + 14; }
    else if (type === 'cry') { pts = [[L + 1, cy + 4, 1], [cx - w * .1, cy - 1], [cx + w * .1, cy - 1], [R - 1, cy + 4, 1], [cx + w * .16, cy + 10], [cx - w * .18, cy + 10]]; teeth = .6; bot = cy + 10; }
    else if (type === 'shout') { pts = [[L, cy - 1, 1], [cx, cy - 4], [R, cy - 1, 1], [cx + w * .22, cy + 16], [cx, cy + 20], [cx - w * .24, cy + 16]]; teeth = 1; tongue = 1; bot = cy + 20; }
    else { pts = [[L + 3, cy, 1], [cx, cy - 1], [R - 3, cy, 1], [cx + w * .08, cy + 7], [cx - w * .1, cy + 7]]; tongue = .8; bot = cy + 7; }
    const MP = path(pts, true);
    g.save(); g.clip(MP); g.fillStyle = '#4a1418'; g.fill(MP);
    if (tongue) { g.fillStyle = '#c86068'; g.beginPath(); g.ellipse(cx, bot + 1, w * .28, 6, 0, 0, TAU); g.fill(); }
    if (teeth) { g.fillStyle = '#f8f4ee'; g.fillRect(cx - w, cy - 8, w * 2, 8 + 2.5 * teeth); }
    g.restore();
    g.strokeStyle = lc; g.lineWidth = LS * 1.05 * LWK.k; g.lineJoin = 'round'; g.stroke(MP); lowerLip(bot + 4.5, w * .14);
  }
}
function lock(x0, y0, x1, y1, tx, ty, bend = 0) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = tx - mx, dy = ty - my, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return [[x0, y0], [x0 + dx * .55 + nx * bend, y0 + dy * .55 + ny * bend], [tx, ty, 1], [x1 + dx * .5 + nx * bend * .7, y1 + dy * .5 + ny * bend * .7], [x1, y1]];
}
function halo(g, P, cx, cy, rx, ry, a0, a1, th, teeth) {
  const up = [], dn = [];
  for (let i = 0; i <= teeth * 2; i++) {
    const u = i / (teeth * 2), a = a0 + (a1 - a0) * u, env = Math.sin(u * Math.PI) * .7 + .3;
    up.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    const depth = th * env * (i % 2 ? 1.9 : .55);
    dn.push([cx + Math.cos(a) * (rx - depth * .15), cy + Math.sin(a) * ry + depth]);
  }
  g.fillStyle = mix(P.hair.h, '#ffffff', .25);
  g.beginPath(); up.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); for (let i = dn.length - 1; i >= 0; i--) g.lineTo(dn[i][0], dn[i][1]); g.closePath(); g.fill();
}

// ——— expressions ———  brow: [inner dy, outer dy, arch] (+ = down)
export const EXPR = {
  neutral: { open: 1, lid: .05, brow: [0, 0, 2], mouth: 'closed' },
  smile: { open: .76, lid: .1, brow: [-3, -1, 3], mouth: 'smile', smileEyes: true },
  grin: { open: .72, lid: .08, brow: [-4, -2, 3.5], mouth: 'smileopen', smileEyes: true },
  warm: { open: .9, lid: .2, brow: [-2, 0, 2.5], mouth: 'smile' },
  sad: { open: .8, lid: .35, brow: [-7, 4, 1], mouth: 'frown', sad: true, look: [0, .35] },
  cry: { open: .6, lid: .45, brow: [-9, 5, 1], mouth: 'cry', sad: true, wet: 1, look: [0, .2] },
  worried: { open: 1, lid: .1, brow: [-7, 3, 1.5], mouth: 'closed' },
  shock: { open: 1.12, lid: -.25, brow: [-9, -7, 4.5], mouth: 'oh', iris: .74 },
  angry: { open: .9, lid: .3, brow: [8, -4, 0], mouth: 'shout' },
  hard: { open: .9, lid: .36, brow: [6, -3, 1], mouth: 'set', look: [.3, 0] },
  tired: { open: .55, lid: .5, brow: [-4, 3, 1], mouth: 'closed', bags: 1, look: [0, .4] },
  talk: { open: 1, lid: .1, brow: [0, 0, 2], mouth: 'talk' },
};

// ——— the head ———  o: { view, expr, E, mouth, open, look, light:[lx,ly], rim, tear (0..1), blink }
export function head(g, P, o = {}) {
  const view = o.view || 'q', G = V[view], C = P.C, male = !!C.m, S = STY[C.style][view];
  const E = { ...EXPR[o.expr || 'neutral'], ...(o.E || {}) };
  for (const k of ['look', 'open', 'mouth', 'lid', 'reflect']) if (o[k] != null) E[k] = o[k];
  if (o.blink) E.open = 0;
  if (o.tear) E.wet = Math.max(E.wet || 0, Math.min(1, o.tear * 2));
  if (C.tired && !o.E?.bags) E.bags = 1;
  const lx = o.light?.[0] ?? -1, ly = o.light?.[1] ?? -.8, SO = k => [lx * k, ly * k];
  const rim = o.rim ? { c: o.rim, d: [-lx * 3, -ly * 2.4] } : null;
  const hairSt = { f: P.hair.f, s: P.hair.s, h: P.hair.h, l: P.hair.l, lw: LH, rim };
  // bun (behind) + back hair
  if (S.bun && S.bun[2]) { const b = new Path2D(); b.ellipse(S.bun[0], S.bun[1], S.bun[2], S.bun[2] * .9, 0, 0, TAU); cel(g, b, { ...hairSt, so: SO(8) });
    const f = new Path2D(); f.ellipse(S.bun[0] + 8, S.bun[1] - 18, 10, 6, -.4, 0, TAU); cel(g, f, { f: '#f4f0e0', l: '#7a7050', lw: LS }); }   // jasmine
  cel(g, S.back, { ...hairSt, f: P.hair.s, so: SO(10), s: mix(P.hair.s, '#000000', .25) });
  if (o.body !== false) torso(g, P, view, E, o);
  cel(g, poly(G.neck), { f: P.skin.f, s: P.skin.s, l: P.skin.l, lw: LS, sh: [G.chin] });
  if (o.body !== false) collar(g, P, view, o);
  // ears
  for (const [ex, ey, d] of G.ears) { const ea = new Path2D(); ea.ellipse(ex, ey, 11, 18, d * .15, 0, TAU); cel(g, ea, { f: P.skin.f, s: P.skin.s, so: [d * 4, 0], l: P.skin.l, lw: LS });
    line(g, [[ex + d * 2, ey - 8], [ex - d * 3, ey], [ex + d * 1, ey + 8]], mix(P.skin.l, P.skin.f, .4), LS * .8); }
  // face
  cel(g, male ? G.faceM : G.faceF, { f: P.skin.f, s: P.skin.s, l: P.skin.l, lw: LS, h: P.skin.h, sh: o.light ? [] : [G.far], so: o.light ? SO(12) : null, rim,
    clipFn: gg => {
      gg.fillStyle = mix(P.skin.f, P.skin.s, .65);
      for (const Lk of S.locks) { const [x0, y0, x1, y1, tx, ty, b] = Lk; gg.fill(path(lock(x0 - 4, y0 + 8, x1 + 6, y1 + 8, tx + 3, ty + 9, b))); }
      gg.fillRect(-120, -120, 240, C.style === 'old' ? 36 : 58);
      if (C.beard) { gg.fillStyle = rgba(P.hair.s, .16 + .1 * C.beard); gg.fill(path(G.beard)); }   // stubble shadow
      if (C.age) { gg.strokeStyle = rgba(P.skin.l, .35); gg.lineWidth = 1.2; for (const s of [-1, 1]) { gg.beginPath(); gg.moveTo(G.mouth.x + s * 18, 62); gg.quadraticCurveTo(G.mouth.x + s * 24, 74, G.mouth.x + s * 20, 86); gg.stroke(); } }
    } });
  if (!male) for (const [bx, by] of G.blush) { g.fillStyle = rgba(P.blush, .22); g.beginPath(); g.ellipse(bx, by, 13, 4.5, 0, 0, TAU); g.fill(); }
  // nose
  g.fillStyle = P.skin.s; g.beginPath(); g.moveTo(...G.nose[0]); g.lineTo(...G.nose[1]); g.lineTo(...G.nose[2]); g.closePath(); g.fill();
  line(g, G.noseB, P.skin.l, LS);
  // beard (full) / mustache under the mouth line
  if (C.beard > .5) cel(g, G.beard, { f: P.hair.f, s: P.hair.s, so: SO(5), l: P.hair.l, lw: LS, h: P.hair.h });
  mouth(g, P, G.mouth.x, G.mouth.y, G.mouth.w, E.mouth || 'closed', G.mouth.fs);
  if (C.mus) cel(g, G.mus, { f: C.mus < .6 ? rgba(P.hair.f, .55) : P.hair.f, l: C.mus < .6 ? null : P.hair.l, lw: LS * .8 });
  if (C.bindi) { g.fillStyle = '#c0141e'; g.beginPath(); g.arc(view === 'q' ? 8 : 0, -6, 4, 0, TAU); g.fill(); }
  for (const ey of G.eyes) eye(g, P, ey.x, ey.y, male ? 38 : 40, male ? 26 : 32, ey.dir, ey.fs, E, male);
  // tears streaming (cel-style: a glossy ribbon + a drop)
  if (o.tear > .15) {
    const k = Math.min(1, (o.tear - .15) / .6);
    for (const ey of G.eyes.slice(0, view === 'q' ? 1 : 2)) {
      const x0 = ey.x + ey.dir * 4, y0 = ey.y + 14, y1 = y0 + 70 * k;
      g.fillStyle = rgba('#e8f6ff', .75); g.beginPath(); g.moveTo(x0 - 2.5, y0); g.quadraticCurveTo(x0 - 6, (y0 + y1) / 2, x0 - 1, y1); g.lineTo(x0 + 3, y1); g.quadraticCurveTo(x0 - 1, (y0 + y1) / 2, x0 + 2.5, y0); g.fill();
      g.strokeStyle = rgba('#3a5a88', .6); g.lineWidth = .9; g.stroke();
      if (k > .9) { const dy = y1 + ((o.ph || 0) * 30) % 26; cel(g, [[x0 + 1, dy - 7, 1], [x0 + 5, dy + 1], [x0 + 1, dy + 5], [x0 - 3, dy + 1]], { f: '#eaf8ff', l: '#4a6a98', lw: .9 }); }
    }
  }
  // hair
  cel(g, S.cap, { ...hairSt, so: SO(10) });
  for (const Lk of S.side) { const [x0, y0, x1, y1, tx, ty, b] = Lk; cel(g, lock(x0, y0, x1, y1, tx, ty, b), { ...hairSt, so: SO(7) }); }
  g.save(); g.fillStyle = P.hair.s; for (const Lk of S.locks) { const [x0, y0, x1, y1, tx, ty, b] = Lk; g.fill(path(lock(x0 - 9, y0, x1 + 9, y1, tx, ty + 3, b))); } g.restore();
  const lockSt = { ...hairSt, l: mix(P.hair.l, P.hair.s, .45), lw: LH * .6 };
  S.locks.forEach(Lk => { const [x0, y0, x1, y1, tx, ty, b] = Lk; cel(g, lock(x0, y0, x1, y1, tx, ty, b), { ...lockSt, so: SO(6) }); });
  if (C.streak) { const q = view === 'q'; cel(g, lock(q ? 16 : 2, -102, q ? 24 : 10, -100, q ? 58 : 50, -20, q ? 10 : 12), { f: P.grey.f, l: P.grey.l, lw: LH * .5 }); }
  if (C.style === 'old') for (let k = 0; k < 5; k++) line(g, [[-70 + k * 12, -60 - k * 4], [-30 + k * 14, -86 - k * 2], [20 + k * 8, -88]], rgba(P.hair.l, .45), 1.1);
  const hz = S.halo; g.save(); const HC = new Path2D(); HC.addPath(path(S.cap)); for (const Lk of S.locks) { const [x0, y0, x1, y1, tx, ty, b] = Lk; HC.addPath(path(lock(x0, y0, x1, y1, tx, ty, b))); }
  g.clip(HC); halo(g, P, ...hz); g.restore();
  for (const b of G.brows) brow(g, P, b[0], b[1], b[2], b[3], E.brow || [0, 0, 2], male);
  if (C.glasses) for (const [gx, gy, rw, rh] of G.glass) {
    const R = new Path2D(); R.roundRect(gx - rw, gy - rh, rw * 2, rh * 2, 7);
    g.fillStyle = rgba('#dfefff', .16); g.fill(R); g.strokeStyle = '#2a2026'; g.lineWidth = 2.4 * LWK.k; g.stroke(R);
    g.fillStyle = rgba('#ffffff', .5); g.beginPath(); g.moveTo(gx - rw * .6, gy - rh * .8); g.lineTo(gx - rw * .2, gy - rh * .8); g.lineTo(gx - rw * .7, gy + rh * .3); g.closePath(); g.fill();
  }
  if (C.glasses) { const [a, b] = G.glass; line(g, [[a[0] + a[2], a[1] - 4], [(a[0] + b[0]) / 2, a[1] - 7], [b[0] - b[2], b[1] - 4]], '#2a2026', 2.4); }
}

// ——— bust: shoulders + clothing ———
function torso(g, P, view, E, o) {
  const C = P.C, dx = V[view].dx, dy = E.shoulders || o.shoulders || 0, wd = C.m ? .86 : .76, cl = P.cloth;
  const sh = [[-200 * wd + dx, 420, 1], [-194 * wd + dx, 214 + dy], [-150 * wd + dx, 162 + dy], [-60 + dx, 136 + dy * .5], [50 + dx, 136 + dy * .5], [134 * wd + dx, 160 + dy], [178 * wd + dx, 210 + dy], [186 * wd + dx, 420, 1]];
  const base = { s: cl.s, so: [-30, -10], h: cl.h, ho: [8, 6], l: cl.l, lw: LW * 1.1 };
  if (C.cloth === 'hoodie') {
    cel(g, sh, { ...base, f: cl.f });
    cel(g, [[-78 + dx, 150], [-56 + dx, 124], [52 + dx, 124], [74 + dx, 150], [40 + dx, 176], [-44 + dx, 176]], { f: cl.s, l: cl.l, lw: LW });   // hood folded behind the neck
    line(g, [[-20 + dx, 168], [-24 + dx, 250]], P.white.s, 3); line(g, [[18 + dx, 168], [22 + dx, 246]], P.white.s, 3);
  } else if (C.cloth === 'hivis') {
    cel(g, sh, { ...base, f: cl.f });
    const hv = P.hivis;
    for (const s of [-1, 1]) cel(g, [[s * 46 + dx, 150], [s * 150 * wd + dx, 168], [s * 186 * wd + dx, 360], [s * 54 + dx, 360]], { f: hv.f, s: hv.s, so: [-20, -6], l: hv.l, lw: LW,
      clipFn: gg => { gg.fillStyle = P.silver.f; gg.fillRect(-300, 268, 600, 18); gg.fillRect(-300, 314, 600, 18); } });
  } else if (C.cloth === 'apron') {
    cel(g, sh, { ...base, f: cl.f });
    cel(g, [[-70 + dx, 230], [70 + dx, 230], [86 + dx, 360], [-86 + dx, 360]], { f: '#24222a', s: '#121116', so: [-10, -4], l: '#050507', lw: LW });
    line(g, [[-64 + dx, 232], [-40 + dx, 150]], '#24222a', 7); line(g, [[64 + dx, 232], [40 + dx, 150]], '#24222a', 7);
  } else if (C.cloth === 'saree') {
    cel(g, sh, { ...base, f: cl.f, clipFn: gg => { gg.fillStyle = P.gold.f; gg.fill(poly([[-200 + dx, 250], [60 + dx, 140], [96 + dx, 148], [-170 + dx, 300]])); gg.fillStyle = P.gold.s; gg.fill(poly([[-200 + dx, 286], [80 + dx, 146], [96 + dx, 148], [-170 + dx, 300]])); } });
    cel(g, [[-194 * wd + dx, 230 + dy], [-150 * wd + dx, 164 + dy], [-104 + dx, 150, 1], [-112 + dx, 196], [-140 + dx, 250], [-190 * wd + dx, 268, 1]], { f: '#8a2a2a', s: '#5a1818', so: [-6, -4], l: '#2a0808', lw: LW });   // blouse sleeve
  } else if (C.cloth === 'blazer') {
    cel(g, sh, { ...base, f: cl.f });
    cel(g, [[-40 + dx, 150], [40 + dx, 150], [12 + dx, 360], [-12 + dx, 360]], { f: P.white.f, s: P.white.s, so: [-6, 0], l: P.white.l, lw: LW });
    for (const s of [-1, 1]) cel(g, [[s * 40 + dx, 146], [s * 70 + dx, 160], [s * 46 + dx, 250], [s * 14 + dx, 330]], { f: cl.h, s: cl.f, so: [s * 6, 0], l: cl.l, lw: LW });
  } else if (C.cloth === 'kasavu' || C.cloth === 'kurta' || C.cloth === 'shirt') {
    cel(g, sh, { ...base, f: cl.f });
    line(g, [[2 + dx, 170], [6 + dx, 360]], cl.l, LW);
    for (let y = 200; y < 360; y += 50) { g.fillStyle = cl.s; g.beginPath(); g.arc(12 + dx, y, 3.5, 0, TAU); g.fill(); }
    if (C.cloth === 'kasavu') { g.fillStyle = P.gold.f; g.fillRect(-8 + dx, 168, 10, 200); }
    if (C.lanyard) { line(g, [[-44 + dx, 152], [-6 + dx, 270]], P.blue.f, 6); line(g, [[44 + dx, 152], [8 + dx, 270]], P.blue.f, 6);
      cel(g, poly([[-26 + dx, 268], [30 + dx, 268], [30 + dx, 340], [-26 + dx, 340]]), { f: P.white.f, s: P.white.s, so: [-4, -3], l: P.white.l, lw: LW, clipFn: gg => { gg.fillStyle = P.blue.f; gg.fillRect(-26 + dx, 268, 56, 14); gg.fillStyle = '#8a6a5a'; gg.fillRect(-16 + dx, 290, 18, 22); } }); }
  } else {   // tee
    cel(g, sh, { ...base, f: cl.f });
  }
}
function collar(g, P, view, o) {
  const C = P.C, dx = V[view].dx, cl = P.cloth;
  if (C.cloth === 'kasavu' || C.cloth === 'kurta' || C.cloth === 'shirt' || C.cloth === 'blazer') {
    const cc = C.cloth === 'blazer' ? P.white : cl;
    for (const s of [-1, 1]) cel(g, [[s * 8 + dx, 176], [s * 34 + dx, 128], [s * 52 + dx, 140], [s * 40 + dx, 172]], { f: cc.f, s: cc.s, so: [s * 3, -3], l: cc.l, lw: LW });
  } else if (C.cloth === 'tee' || C.cloth === 'apron' || C.cloth === 'hivis' || C.cloth === 'hoodie') {
    line(g, [[-40 + dx, 140], [0 + dx, 160], [40 + dx, 140]], cl.l, LW * 1.4);
  }
}

// —— hand holding a phone (bust shots): x,y = phone centre, s scale, ang tilt; screen(ctx, w, h) paints the display in local px ——
export function phoneInHand(g, P, x, y, s, ang, screen, o = {}) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  const w = 110, h = 200;
  const body = new Path2D(); body.roundRect(-w / 2, -h / 2, w, h, 14);
  cel(g, body, { f: '#24242e', s: '#14141a', so: [-4, -4], h: '#5a5a6e', ho: [3, 3], l: '#060608', lw: 2 });
  g.save(); const scr = new Path2D(); scr.roundRect(-w / 2 + 7, -h / 2 + 12, w - 14, h - 26, 6); g.clip(scr); g.translate(-w / 2 + 7, -h / 2 + 12);
  if (screen) screen(g, w - 14, h - 26); g.restore();
  if (o.glare !== false) { g.fillStyle = rgba('#ffffff', .1); g.beginPath(); g.moveTo(-w / 2 + 7, -h / 2 + 12); g.lineTo(-w / 2 + 40, -h / 2 + 12); g.lineTo(-w / 2 + 7, -h / 2 + 70); g.fill(); }
  // fingers wrapped from the left, thumb on the right edge
  const sk = P.skin;
  for (let i = 0; i < 4; i++) { const fy = -30 + i * 30; const f = new Path2D(); f.roundRect(-w / 2 - 18, fy, 28, 24, 11); cel(g, f, { f: sk.f, s: sk.s, so: [3, -3], l: sk.l, lw: 1.5 }); }
  cel(g, [[w / 2 - 6, 40], [w / 2 + 14, 10], [w / 2 + 22, 30], [w / 2 + 8, 70], [w / 2 - 20, 110], [-w / 2 - 10, 110], [-w / 2 - 20, 60]], { f: sk.f, s: sk.s, so: [-6, -4], l: sk.l, lw: 1.5 });
  g.restore();
}
