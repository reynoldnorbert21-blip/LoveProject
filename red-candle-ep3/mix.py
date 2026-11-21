# Red Candle · Episode 3 "The Grind" — score, sound design, dialogue mix -> out/mix.wav
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', '/home/user/lemomo-ai/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, compress, noise, brown, bp, lp, hp, click, clack, whoosh, thump, ding, t_

ev = json.load(open(os.path.join(HERE, 'events.json'))); DUR = ev['dur']; N = int(DUR * SR) + SR
HIT = {e['type']: e['t'] for e in ev['ev'] if e['type'] not in ('cut', 'line')}
C = {e['id']: e['t'] for e in ev['ev'] if e['type'] == 'cut'}; LINES = [e for e in ev['ev'] if e['type'] == 'line']
rng = np.random.default_rng(13); S.seed(7); BEAT = 60 / 76
def st(): return np.zeros((N, 2), np.float32)
def span(a): ks = list(C); i = ks.index(a); return C[a], (C[ks[i + 1]] if i + 1 < len(ks) else DUR)
def bed(x, a, b, gain=1., fade=.3, pan=0.):
    out = st(); n = int((b - a) * SR); x = np.resize(x, n) * gain; e = np.ones(n); f = min(int(fade * SR), n // 2)
    if f: e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    add(out, (x * e).astype(np.float32), a, 1., pan); return out
def scrape(d=.9):
    n = int(round(d * SR)); return (bp(noise(d), 1500, 6000) * np.linspace(.2, 1, n) ** .5 * np.exp(-np.linspace(0, 3, n))).astype(np.float32)
def rainbed(d, b=1.): return (bp(noise(d), 900, 7000) * .5 * b + lp(noise(d), 500) * .4).astype(np.float32)
def murmur(d): x = bp(noise(d), 250, 1800); e = lp(np.abs(noise(d)), 4); e = e / e.max(); return (x * (.4 + e)).astype(np.float32)
def hum(d, f=60): tt = t_(d); return (np.sin(2 * np.pi * f * tt) * .3 + lp(noise(d), 300) * .3).astype(np.float32)
def beep(f=2400, d=.12): tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.minimum(1, (d - tt) * 40) * .5).astype(np.float32)
def chirp(f0=3200): tt = t_(.12); f = f0 + 1800 * np.sin(tt * 40); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18)).astype(np.float32)

# ---------------- music ----------------
m = []
def N_(t, inst, p, d, v, pan=0., g=1.): m.append((t, inst, p, d, v, pan, g))
N_(.1, 'piano', 'D2', 3, .7, 0, .8); N_(.1, 'cellos', 'A2', 2.6, .35, 0, .6)
# the grind: sparse low piano, one note per bar
for i, p in enumerate(['D3', 'D3', 'F3', 'E3', 'D3', 'C3', 'D3', 'A2', 'D3', 'F3', 'E3', 'D3']):
    tt = C['warehouse'] + i * BEAT * 2
    if tt > C['rules'] - .3: break
    N_(tt, 'piano', p, BEAT * 2, .45, -.1, .6)
N_(C['breach'], 'cellos_trem' if False else 'violins_trem', 'D4', 3.2, .4, .2, .35)
N_(C['floor'], 'organ_soft', 'D3', 4, .25, 0, .4); N_(C['floor'], 'cellos', 'F3', 4, .35, 0, .6)
# discipline: a steady, patient pulse (marimba + pizz), major turn on the payout
prog = ['D', 'Bb', 'F', 'C']; ROOT = {'D': ('D2', 'A3', 'F4'), 'Bb': ('Bb1', 'F3', 'D4'), 'F': ('F2', 'C4', 'A4'), 'C': ('C2', 'G3', 'E4')}
t = C['rules']; bar = 0
while t < C['payout'] - .05:
    lo, mid, hi = ROOT[prog[bar % 4]]
    for b in range(4):
        tt = t + b * BEAT
        if tt >= C['payout'] - .05: break
        N_(tt, 'contrabass_pizz', lo.replace('1', '2'), .5, .5, 0, .8); N_(tt + BEAT / 2, 'marimba', mid.replace('3', '4'), .4, .45, .25, .5)
    N_(t, 'cellos', mid, 4 * BEAT, .35, -.2, .5); t += 4 * BEAT; bar += 1
N_(HIT['approved'], 'glockenspiel', 'A5', 1.5, .6, .2, .6); N_(HIT['approved'], 'harp', 'D4', 2, .5, 0, .6)
# home: warm strings + harmonium (accordion), D major
for k, (p, t0, d) in enumerate([('D3', C['repay'], 4.4), ('A3', C['repay'], 4.4), ('F#4', C['repay'], 4.4), ('G3', C['arrivals'], 3.4), ('B3', C['arrivals'], 3.4), ('D4', C['arrivals'], 3.4), ('A3', C['arrivals'] + 3.4, 3.4), ('D4', C['arrivals'] + 3.4, 3.4), ('F#4', C['arrivals'] + 3.4, 3.4)]):
    N_(t0, 'violins' if k % 3 == 2 else 'cellos', p, d, .45, -.2 + (k % 3) * .2, .6); N_(t0, 'accordion', p, d, .28, .1, .3)
for i in range(12): N_(C['arrivals'] + i * BEAT * .5, 'harp', ['D4', 'F#4', 'A4', 'D5'][i % 4], 1.5, .4, .3, .45)
# veranda: night, oil lamp, a single unanswered phrase, then the green candle chord
N_(C['veranda'], 'organ_soft', 'D3', 6.4, .22, 0, .35)
for i, p in enumerate(['A3', 'D4', 'E4', 'F#4']): N_(C['veranda2'] + i * .6, 'piano', p, 1.8, .45, 0, .55)
for p in ['D3', 'A3', 'D4', 'F#4', 'A4']: N_(HIT['candle'], 'cellos' if p in ('D3', 'A3') else 'violins', p, 4.2, .45, 0, .55)
N_(HIT['candle'], 'harp', 'D5', 3, .5, 0, .5); N_(HIT['redcandle'], 'piano', 'D2', 3, .7, 0, .8)
S.ensure(sorted({e[1] for e in m}))
music = S.room(S.render(m, dur=N / SR, master=False).astype(np.float32), size=.55, mix=.2)

# ---------------- sound design ----------------
fx = st(); amb = st()
for k, v in C.items():
    if v > 0: add(fx, scrape(.55), v - .02, .2, rng.uniform(-.3, .3))
a, b = span('warehouse'); amb += bed(hum(b - a, 50), a, b, .07); amb += bed(lp(brown(b - a), 200).astype(np.float32), a, b, .1)
add(fx, beep(), HIT['beep1'], .25); add(fx, beep(), HIT['beep2'], .25)
a, b = span('class'); amb += bed(murmur(b - a), a, b, .05)
for i in range(7): add(fx, ding(.5), HIT['breach'] + i * .4, .1, .2); add(fx, click(1.8, .6), HIT['breach'] + i * .4 + .25, .2)
a, b = span('floor'); amb += bed(hum(b - a, 50), a, b, .05)
a, b = span('audit')
for i in range(6): add(fx, (bp(noise(.35), 2000, 6000) * .4).astype(np.float32), a + .4 + i * .5, .1, .1)
a, b = span('rules')
for i in range(int((b - a) / .09)): add(fx, (bp(noise(.05), 3000, 8000) * .3).astype(np.float32), a + i * .09 + rng.uniform(0, .03), .05, -.1)
a, b = span('seasons'); amb += bed(lp(noise(b - a), 1200).astype(np.float32), a, b, .03)
add(fx, ding(1.), HIT['sent'], .2, .1)
a, b = span('arrivals'); amb += bed(murmur(b - a), a, b, .12)
for i in range(4): add(fx, chirp(2800 + rng.uniform(0, 900)), a + .5 + i * 1.4, .04, rng.uniform(-.6, .6))
a = C['veranda']; amb += bed(rainbed(C['end'] - a, .9), a, C['end'], .45)
add(fx, (lp(noise(.6), 180) * np.sin(np.linspace(0, 60, int(.6 * SR)))).astype(np.float32), HIT['buzz'], .25)
add(fx, click(2.8, .9), HIT['photo'], .35); add(fx, thump(.4, 120), HIT['facedown'], .25)
a, b = span('end'); amb += bed(rainbed(b - a, .7), a, b, .4)
add(fx, scrape(.9), HIT['redcandle'], .25)

# ---------------- voice ----------------
voice = st(); duck = np.zeros(N)
for L in LINES:
    x, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = compress(x / (np.abs(x).max() + 1e-9), thr=.3, ratio=3.); x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .12
    if L['id'] == 'f05':                                   # Amma's voice note: phone speaker
        x = (bp(x, 300, 3400) * 1.6).astype(np.float32)
    add(voice, x.astype(np.float32), L['t'], 1., 0.); duck[int((L['t'] - .15) * SR):int((L['t'] + len(x) / SR + .25) * SR)] = 1
k = int(.12 * SR); duck = np.convolve(duck, np.ones(k) / k, 'same'); g = (1 - duck * (1 - 10 ** (-8 / 20)))[:, None].astype(np.float32)
mix = music * .55 * g + amb * g + fx * (1 - duck[:, None] * .3) + voice
mix = mix[:int(DUR * SR)]; fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = limit(mix.astype(np.float32), .9); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR); print('mix', mix.shape, 'instruments', sorted({e[1] for e in m}))
