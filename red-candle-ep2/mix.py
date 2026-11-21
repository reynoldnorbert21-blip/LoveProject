# Red Candle · Episode 2 "The Fall" — score, sound design, dialogue mix -> out/mix.wav
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', '/home/user/lemomo-ai/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, compress, noise, brown, bp, lp, hp, click, clack, whoosh, thump, ding, heartbeat, t_

ev = json.load(open(os.path.join(HERE, 'events.json'))); DUR = ev['dur']; N = int(DUR * SR) + SR
HIT = {e['type']: e['t'] for e in ev['ev'] if e['type'] not in ('cut', 'line')}
C = {e['id']: e['t'] for e in ev['ev'] if e['type'] == 'cut'}; LINES = [e for e in ev['ev'] if e['type'] == 'line']
rng = np.random.default_rng(11); S.seed(5); BEAT = 60 / 80
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

# ---------------- music ----------------
m = []
def N_(t, inst, p, d, v, pan=0., g=1.): m.append((t, inst, p, d, v, pan, g))
N_(0.1, 'piano', 'D2', 3, .8, 0, .9); N_(0.1, 'piano', 'A2', 3, .6, 0, .7); N_(.1, 'gran_cassa', None, None, .5, 0, .5)
# Onam: warm harmonium (accordion) + a sly pizzicato figure under the whisper
for k, p in enumerate(['D3', 'F3', 'A3']): N_(C['onam'], 'accordion', p, C['green'] - C['onam'], .3, -.3 + k * .3, .3)
for i in range(int((C['green'] - C['onam']) / (BEAT / 2))): N_(C['onam'] + i * BEAT / 2, 'cellos_pizz', ['D3', 'F3', 'A3', 'G3'][i % 4], .3, .35, -.2, .4)
# the pulse: starts bright, sours to minor, accelerates
prog = [('F2', 'C4'), ('C2', 'G3'), ('D2', 'A3'), ('Bb1', 'F3'), ('D2', 'F3'), ('C#2', 'E3'), ('D2', 'D3'), ('A1', 'E3')]
t = C['green']; bar = 0; bt = BEAT
while t < HIT['silence'] - .05:
    lo, hi = prog[bar % 8 if t < C['loss'] else 4 + bar % 4]
    for b in range(4):
        tt = t + b * bt
        if tt >= HIT['silence'] - .05: break
        N_(tt, 'contrabass_pizz', lo, .5, .6, 0, .9); N_(tt + bt / 2, 'violins_pizz', hi, .3, .4, .3, .45)
        if b in (0, 2): N_(tt, 'frame_drum', None, None, .55, 0, .6)
        if t > C['revenge']: N_(tt + bt / 4, 'cellos_spic', hi.replace('3', '2').replace('4', '3'), .2, .45, -.3, .5)
    if t > C['revenge']: N_(t, 'violins_trem', hi, 4 * bt, .5, .2, .45)
    t += 4 * bt; bar += 1
    if t > C['revenge']: bt = max(BEAT * .7, bt * .96)        # the panic accelerates
# the fall: hard silence, heartbeat; then broken low strings
N_(C['chat'], 'cellos', 'D2', 3.2, .5, 0, .8); N_(C['chat'], 'contrabass', 'D1', 3.2, .5, 0, .6)
N_(C['anoop'], 'timpani', 'D2', 2, .8, 0, .8)
N_(C['leave'], 'cellos', 'F3', 2.2, .4, -.2, .7); N_(C['leave'] + 2.2, 'cellos', 'E3', 2.2, .4, -.2, .7)
for i, p in enumerate(['A4', 'F4', 'E4', 'D4']): N_(C['bus'] + .4 + i * 1.3, 'piano', p, 1.6, .45, .1, .6)
N_(C['notebook'], 'cellos', 'D3', 3.2, .45, 0, .8); N_(C['notebook'] + 3.2, 'cellos', 'C#3', 2.7, .45, 0, .8); N_(C['notebook'], 'organ_soft', 'A2', 5.9, .25, 0, .4)
N_(HIT['ep3'], 'piano', 'D2', 2.6, .7, 0, .8)
S.ensure(sorted({e[1] for e in m}))
music = S.room(S.render(m, dur=N / SR, master=False).astype(np.float32), size=.55, mix=.2)

# ---------------- sound design ----------------
fx = st(); amb = st()
for k, v in C.items():
    if v > 0: add(fx, scrape(.55), v - .02, .2, rng.uniform(-.3, .3))
a, b = span('onam'); amb += bed(murmur(b - a), a, b, .22);
for i in range(4): add(fx, clack(2.4, .3), a + .5 + i * 1.6, .08, .4)
add(fx, ding(.9), HIT['ping1'], .2, .1); add(fx, ding(.9), HIT['ping2'], .2, -.1)
for i in range(4): add(fx, click(3.0, .5), HIT['chatPop'] + i * .55, .15, .2)
a, b = span('loss'); amb += bed(hum(b - a, 50), a, b, .05)
a, b = span('revenge')
for i in range(int((b - a) / .12)): add(fx, click(2.4 + rng.uniform(-.4, .4), .3), a + i * .12 + rng.uniform(0, .05), .08, rng.uniform(-.3, .3))
add(fx, click(1.6, .8), HIT['loanOk'], .35)
a, b = span('split'); amb += bed(hum(b - a, 60), a, b, .03)
add(fx, heartbeat(1.), HIT['heart1'], .8); add(fx, heartbeat(1.), HIT['heart2'], .9)
add(fx, (hp(noise(.25), 2500) * np.exp(-np.linspace(0, 8, int(.25 * SR)))).astype(np.float32), HIT['crack'], .7)
for i in range(6): add(fx, ding(.4), HIT['flood'] + i * .2, .08, rng.uniform(-.5, .5))
a, b = span('anoop'); amb += bed(lp(noise(b - a), 400).astype(np.float32), a, b, .04)
a, b = span('leave'); add(fx, thump(.6, 90), b - .6, .3)
a, b = span('bus'); amb += bed(rainbed(b - a, 1.3), a, b, .55)
a, b = span('notebook'); amb += bed(lp(noise(b - a), 300).astype(np.float32), a, b, .04)
add(fx, scrape(.8), HIT['circle'], .2)

# ---------------- voice ----------------
voice = st(); duck = np.zeros(N)
for L in LINES:
    x, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = compress(x / (np.abs(x).max() + 1e-9), thr=.3, ratio=3.); x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .12
    add(voice, x.astype(np.float32), L['t'], 1., 0.); duck[int((L['t'] - .15) * SR):int((L['t'] + len(x) / SR + .25) * SR)] = 1
k = int(.12 * SR); duck = np.convolve(duck, np.ones(k) / k, 'same'); g = (1 - duck * (1 - 10 ** (-8 / 20)))[:, None].astype(np.float32)
mix = music * .55 * g + amb * g + fx * (1 - duck[:, None] * .3) + voice
i0, i1 = int(HIT['silence'] * SR), int(HIT['heart1'] * SR); mix[i0:i1] = 0
mix = mix[:int(DUR * SR)]; fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = limit(mix.astype(np.float32), .9); os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix, SR); print('mix', mix.shape, 'instruments', sorted({e[1] for e in m}))
