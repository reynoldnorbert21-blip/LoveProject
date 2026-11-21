# Red Candle · Episode 1 — score, sound design, dialogue mix -> out/mix.wav
# Run with the library's python from the library root (build.sh does this): LIB/.venv/bin/python mix.py
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', os.path.join(HERE, '..', '..', 'lemomo-ai', 'lemo-opuscar'))
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, compress, noise, brown, bp, lp, hp, click, clack, whoosh, thump, ding, env_exp, t_

ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR = ev['dur']; N = int(DUR * SR) + SR
HIT = {e['type']: e['t'] for e in ev['ev'] if e['type'] not in ('cut', 'line')}
CUT = {e['id']: e['t'] for e in ev['ev'] if e['type'] == 'cut'}
LINES = [e for e in ev['ev'] if e['type'] == 'line']
rng = np.random.default_rng(7); S.seed(3)
BEAT = 60 / 72

def st(): return np.zeros((N, 2), np.float32)
def seg_env(n, a, b, fade=.4):
    e = np.zeros(n); i0, i1 = int(a * SR), int(b * SR); f = int(fade * SR)
    e[i0:i1] = 1
    if f: e[i0:i0 + f] *= np.linspace(0, 1, min(f, i1 - i0)); e[max(i0, i1 - f):i1] *= np.linspace(1, 0, i1 - max(i0, i1 - f))
    return e
def bed(x, a, b, gain=1., fade=.4, pan=0.):
    out = st(); n = int((b - a) * SR); x = np.resize(x, n) * gain
    e = seg_env(n, 0, n / SR, fade); add(out, (x * e).astype(np.float32), a, 1., pan); return out

# ======================= MUSIC =======================
m = []
def N_(t, inst, p, d, v, pan=0., g=1.): m.append((t, inst, p, d, v, pan, g))
C = CUT
# cold open drone + title hit
N_(0.1, 'cellos', 'D3', 4.9, .32, -.1, .7); N_(0.1, 'organ_soft', 'A3', 4.9, .25, .2, .45)
N_(HIT['titleCandle'], 'piano', 'D2', 3, .85, 0, 1.); N_(HIT['titleCandle'], 'piano', 'D3', 3, .7, 0, .8); N_(HIT['titleCandle'], 'gran_cassa', None, None, .5, 0, .6)
# home / cold: cello melody over a reed pad (accordion stands in for a harmonium), 7.6 -> 24.8
mel = [('A3', 2), ('D4', 2), ('F4', 2), ('E4', 2), ('D4', 3), ('C4', 1), ('A3', 4), ('Bb3', 2), ('A3', 2), ('G3', 2), ('F3', 2), ('E3', 4)]
t = C['airport']
for p, b in mel:
    if t > C['office'] - .5: break
    N_(t, 'cellos', p, b * BEAT * 1.02, .5, -.15, .9); t += b * BEAT
pads = [(['D3', 'F3', 'A3'], C['airport']), (['Bb2', 'D3', 'F3'], C['manc']), (['A2', 'E3', 'A3'], C['kitchen']), (['D3', 'F3', 'A3'], C['call']), (['F3', 'A3', 'C4'], C['office'])]
for i, (ch, t0) in enumerate(pads):
    t1 = pads[i + 1][1] if i + 1 < len(pads) else C['pub']
    for k, p in enumerate(ch): N_(t0, 'accordion', p, t1 - t0 + .3, .32, -.3 + k * .3, .32)
for i in range(10): N_(C['office'] + i * BEAT * .6, 'harp', ['F3', 'A3', 'C4', 'F4', 'C4', 'A3'][i % 6], 2, .4, .3, .5)
# green: the pulse, rising
prog = ['D', 'D', 'Bb', 'Bb', 'F', 'F', 'C', 'C']
root = {'D': ('D2', 'D3', 'A3', 'F4'), 'Bb': ('Bb1', 'Bb2', 'F3', 'D4'), 'F': ('F2', 'F3', 'C4', 'A4'), 'C': ('C2', 'C3', 'G3', 'E4')}
t = HIT['pulseIn']; bar = 0
while t < HIT['silence'] - .05:
    ch = root[prog[bar % 8]]; late = t > C['walk'] - .5
    for bt in range(4):
        tt = t + bt * BEAT
        if tt >= HIT['silence'] - .05: break
        N_(tt, 'contrabass_pizz', ch[1], .6, .6 if bt == 0 else .45, 0, .9)
        if bt in (0, 2): N_(tt, 'frame_drum', None, None, .5 if bt == 0 else .35, 0, .55)
        if t > C['research'] - .5: N_(tt + BEAT / 2, 'cellos_pizz', ch[2], .4, .4, -.25, .55)
        if t > C['bath'] - .5: N_(tt, 'violins_pizz', ch[3], .4, .4, .3, .5); N_(tt + BEAT / 2, 'violins_pizz', ch[2].replace('3', '4'), .4, .35, .3, .45)
    if t > C['resign'] - 1: N_(t, 'violins', ch[3], 4 * BEAT, .45 if late else .35, .2, .55 if late else .4)
    if late: N_(t, 'cellos', ch[1], 4 * BEAT, .55, -.2, .7)
    t += 4 * BEAT; bar += 1
for k, h in enumerate(('ping1', 'ping2')): N_(HIT[h], 'glockenspiel', ['A5', 'D6'][k], 1.2, .6, .2, .55)
d = HIT['drop']
N_(d, 'gran_cassa', None, None, 1., 0, 1.); N_(d, 'timpani', 'D2', 3, 1., 0, 1.); N_(d, 'gong', None, None, .7, 0, .7)
N_(d, 'piano', 'D1', 4, 1., 0, .9); N_(d, 'piano', 'Eb2', 4, .8, 0, .7)
N_(d + 1.3, 'cellos', 'D3', 2.2, .45, 0, .8); N_(d + 3.3, 'cellos', 'C#3', 1.6, .42, 0, .8); N_(d + 1.3, 'contrabass', 'D2', 3.4, .4, 0, .5)
S.ensure(sorted({e[1] for e in m}))
music = S.render(m, dur=N / SR, master=False).astype(np.float32)
music = S.room(music, size=.55, mix=.2)

# ======================= SOUND DESIGN =======================
fx = st(); amb = st()
def rainbed(d, bright=1.):
    x = noise(d); return (bp(x, 900, 7000) * .5 * bright + lp(noise(d), 500) * .4).astype(np.float32)
def hum(d, f=60): tt = t_(d); return (np.sin(2 * np.pi * f * tt) * .3 + np.sin(2 * np.pi * f * 2 * tt) * .15 + lp(noise(d), 300) * .3).astype(np.float32)
def murmur(d):
    x = bp(noise(d), 250, 1800); e = lp(np.abs(noise(d)), 4); e = e / e.max(); return (x * (.4 + e)).astype(np.float32)
def chirp(f0=3200):
    tt = t_(.12); f = f0 + 1800 * np.sin(tt * 40); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18)).astype(np.float32)
def scrape(d=.9):
    n = int(round(d * SR)); x = bp(noise(d), 1500, 6000) * np.linspace(.2, 1, n) ** .5 * np.exp(-np.linspace(0, 3, n)); return x.astype(np.float32)
def crackle(d):
    x = np.zeros(int(d * SR), np.float32); idx = rng.integers(0, len(x) - 200, int(d * 25))
    for i in idx: x[i:i + 120] += (hp(noise(.0025), 2000)[:120] * rng.uniform(.2, 1)).astype(np.float32)
    return x
def span(a): ks = list(C); i = ks.index(a); return C[a], (C[ks[i + 1]] if i + 1 < len(ks) else DUR)
# a palette-knife scrape on every paint-over cut
for k, v in C.items():
    if v > 0 and k not in ('laptop',): add(fx, scrape(.55), v - .02, .22, rng.uniform(-.3, .3))
a0, a1 = 0, C['title']; amb += bed(lp(rainbed(a1), 2500), a0, a1, .35); amb += bed(hum(a1, 50), a0, a1, .05)
add(fx, whoosh(1.0, .6), HIT['titleCandle'] - .25, .35); amb += bed(crackle(3), *span('title'), .5)
add(fx, scrape(.9), HIT['titleText'], .3)
a0, a1 = span('airport'); amb += bed(hum(a1 - a0, 55), a0, a1, .07); amb += bed(murmur(a1 - a0), a0, a1, .08); add(fx, ding(.5), a0 + .3, .1, .4)
add(fx, click(2.2, .8), HIT['watchClick'], .5, .1); add(fx, click(3., .5), HIT['watchClick'] + .05, .3, .1)
a0, a1 = span('manc'); amb += bed(rainbed(a1 - a0, 1.3), a0, a1, .6)
wheels = (lp(brown(a1 - a0), 200) * (1 + .6 * np.sin(2 * np.pi * 3.8 * t_(a1 - a0)))).astype(np.float32); amb += bed(wheels / np.abs(wheels).max(), a0, a1, .18, pan=.15)
a0, a1 = span('kitchen'); amb += bed(bp(noise(a1 - a0), 200, 1200).astype(np.float32), a0, a1, .12)
for i in range(5): add(fx, clack(1.6 + rng.uniform(-.3, .3), .5), a0 + .3 + i * .7 + rng.uniform(0, .3), .18, .3)
a0, a1 = span('call'); add(fx, ding(.6), HIT['chime'], .14, 0); amb += bed(hum(a1 - a0, 50), a0, a1, .06)
a0, a1 = span('office'); amb += bed(hum(a1 - a0, 60), a0, a1, .04)
for i in range(22): add(fx, click(2.6 + rng.uniform(-.4, .4), .25), a0 + .4 + i * .19 + rng.uniform(0, .08), .1, -.2)
a0, a1 = span('pub'); amb += bed(murmur(a1 - a0), a0, a1, .2)
for i in range(2): add(fx, clack(2.4, .3), a0 + .6 + i * 2, .08, .4)
a0, a1 = span('research')
for i in range(int((a1 - a0) / .2)): add(fx, click(3.2, .3), a0 + i * .2, .07, .3)
for i in range(14): add(fx, click(2.0, .3), a0 + .3 + i * .26, .06, -.1)
a0, a1 = span('bath'); amb += bed(hp(noise(a1 - a0), 400).astype(np.float32) * .3, a0, a1, .04)
add(fx, ding(1.), HIT['ping1'], .2, .1); add(fx, ding(1.), HIT['ping2'], .22, .1)
a0, a1 = span('canteen'); amb += bed(murmur(a1 - a0), a0, a1, .1); add(fx, thump(.5, 140), HIT['pat'], .3)
a0, a1 = span('resign'); amb += bed(hum(a1 - a0, 60), a0, a1, .03)
add(fx, whoosh(.5, .4), HIT['envelope'], .2, .2); add(fx, scrape(.6), HIT['rack'], .15, .3)
add(fx, (lp(noise(.4), 1200) * np.linspace(1, 0, int(.4 * SR))).astype(np.float32), HIT['sip'], .08, .4)
a0, a1 = span('walk'); amb += bed(lp(noise(a1 - a0), 1500).astype(np.float32), a0, a1, .04)
for i in range(7): add(fx, chirp(2600 + rng.uniform(0, 1500)), a0 + .3 + i * .42 + rng.uniform(0, .2), .05, rng.uniform(-.7, .7))
add(fx, thump(.6, 90), HIT['box'], .35)
a0 = C['laptop']; amb += bed(hp(noise(HIT['silence'] - a0), 3000).astype(np.float32) * .2, a0, HIT['silence'], .05, fade=.05)
add(fx, scrape(1.2), HIT['drop'] + .35, .45); add(fx, scrape(.9), HIT['drop'] + .9, .35, -.3)
add(fx, scrape(.9), HIT['ep2'], .3)

# ======================= VOICE =======================
voice = st(); duck = np.zeros(N)
for L in LINES:
    x, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = compress(x / (np.abs(x).max() + 1e-9), thr=.3, ratio=3.)
    x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .12
    add(voice, x.astype(np.float32), L['t'], 1., 0.)
    i0 = int((L['t'] - .15) * SR); i1 = int((L['t'] + len(x) / SR + .25) * SR); duck[i0:i1] = 1
k = int(.12 * SR); duck = np.convolve(duck, np.ones(k) / k, 'same')
g = (1 - duck * (1 - 10 ** (-8 / 20)))[:, None].astype(np.float32)

mix = music * .55 * g + amb * g + fx * (1 - duck[:, None] * .3) + voice
# hard silence: digital zero before the drop
i0, i1 = int(HIT['silence'] * SR), int(HIT['drop'] * SR); mix[i0:i1] = 0
f = int(.08 * SR); mix[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
mix = mix[:int(DUR * SR)]
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = limit(mix.astype(np.float32), .9)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR)
print('mix', mix.shape, 'peak', float(np.abs(mix).max()), 'voice rms', float(np.sqrt(np.mean(voice ** 2))), 'music rms', float(np.sqrt(np.mean((music * .55) ** 2))))
print('instruments', sorted({e[1] for e in m}))
