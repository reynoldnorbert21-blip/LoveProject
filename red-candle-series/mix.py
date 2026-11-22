# Red Candle series — original score (family theme + comeback BGM), sound design and dialogue mix.
# usage: LIB=<library> python mix.py <ep> [--nomusic]   -> out/mix-ep<ep>.wav (or mix-ep<ep>-nomusic.wav)
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB', '/home/user/lemomo-ai/lemo-opuscar'); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, compress, noise, brown, bp, lp, hp, click, clack, whoosh, thump, ding, heartbeat, t_
EP = int(sys.argv[1]); NOMUSIC = '--nomusic' in sys.argv; SONGS = '--songs' in sys.argv; ANIME = '--anime' in sys.argv
ev = json.load(open(f'{HERE}/out/events-ep{EP}.json')); DUR = ev['dur']; N = int(DUR * SR) + SR
HIT = {e['type']: e['t'] for e in ev['ev'] if e['type'] not in ('cut', 'line')}
C = {e['id']: e['t'] for e in ev['ev'] if e['type'] == 'cut'}; LINES = [e for e in ev['ev'] if e['type'] == 'line']
rng = np.random.default_rng(EP * 7); S.seed(EP * 3)
def span(a): ks = list(C); i = ks.index(a); return C[a], (C[ks[i + 1]] if i + 1 < len(ks) else DUR)
def st(): return np.zeros((N, 2), np.float32)
def bed(x, a, b, gain=1., fade=.4, pan=0.):
    out = st(); n = int((b - a) * SR); x = np.resize(x, n) * gain; e = np.ones(n); f = min(int(fade * SR), n // 2)
    if f: e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    add(out, (x * e).astype(np.float32), a, 1., pan); return out
def scrape(d=.9):
    n = int(round(d * SR)); return (bp(noise(d), 1500, 6000) * np.linspace(.2, 1, n) ** .5 * np.exp(-np.linspace(0, 3, n))).astype(np.float32)
def rainbed(d, b=1.): return (bp(noise(d), 900, 7000) * .5 * b + lp(noise(d), 500) * .4).astype(np.float32)
def murmur(d): x = bp(noise(d), 250, 1800); e = lp(np.abs(noise(d)), 4); e = e / e.max(); return (x * (.4 + e)).astype(np.float32)
def hum(d, f=60): tt = t_(d); return (np.sin(2 * np.pi * f * tt) * .3 + lp(noise(d), 300) * .3).astype(np.float32)
def chirp(f0=3200): tt = t_(.12); f = f0 + 1800 * np.sin(tt * 40); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18)).astype(np.float32)
def beep(f=2400, d=.12): tt = t_(d); return (np.sin(2 * np.pi * f * tt) * np.minimum(1, (d - tt) * 40) * .5).astype(np.float32)

# ======================= MUSIC =======================
m = []; BEAT = 60 / 66
def N_(t, inst, p, d, v, pan=0., g=1.):
    if t < DUR: m.append((t, inst, p, d, v, pan, g))
# the family theme (D minor; `major=True` lifts it to D major)
THEME = [('A3', 1), ('D4', 1), ('E4', 1), ('F4', 2), ('E4', 1), ('D4', 1), ('C4', 1), ('D4', 3), ('F4', 1), ('G4', 1), ('A4', 2), ('G4', 1), ('F4', 1), ('E4', 1), ('D4', 3)]
MAJ = {'F4': 'F#4', 'C4': 'C#4', 'F3': 'F#3'}
def theme(t0, inst, v=.5, g=.7, beat=BEAT, major=False, upto=None, octave=0, pan=0.):
    t = t0
    for i, (p, b) in enumerate(THEME):
        if upto is not None and i >= upto: break
        q = MAJ.get(p, p) if major else p
        if octave: q = q[:-1] + str(int(q[-1]) + octave)
        N_(t, inst, q, b * beat * 1.05, v, pan, g); t += b * beat
    return t
def pad(t0, t1, chord, inst='accordion', v=.3, g=.32):
    for k, p in enumerate(chord): N_(t0, inst, p, max(.5, t1 - t0 + .3), v, -.3 + k * .3, g)
def pulse(t0, t1, prog, beat=BEAT, layers=1, acc=1.0):
    t = t0; bar = 0; b0 = beat
    ROOT = {'D': ('D2', 'A3', 'F4'), 'Bb': ('Bb1', 'F3', 'D4'), 'F': ('F2', 'C4', 'A4'), 'C': ('C2', 'G3', 'E4'), 'Dm': ('D2', 'F3', 'D4'), 'A': ('A1', 'E3', 'C#4'), 'G': ('G1', 'D3', 'B3')}
    while t < t1 - .05:
        lo, mid, hi = ROOT[prog[bar % len(prog)]]
        for b in range(4):
            tt = t + b * beat
            if tt >= t1 - .05: break
            N_(tt, 'contrabass_pizz', lo.replace('1', '2'), .5, .55 if b else .65, 0, .85)
            if b in (0, 2): N_(tt, 'frame_drum', None, None, .5 if b == 0 else .35, 0, .5)
            if layers >= 2: N_(tt + beat / 2, 'cellos_pizz', mid, .35, .4, -.25, .5)
            if layers >= 3: N_(tt, 'violins_pizz', hi, .3, .38, .3, .45)
        if layers >= 4: N_(t, 'violins_trem', hi, 4 * beat, .4, .2, .35)
        t += 4 * beat; bar += 1; beat = max(b0 * .72, beat * acc)
def chenda(t0, t1, beat=BEAT * .75, v=.7):        # comeback drums: chenda-style rolls (toms + frame drum), 12/8 feel
    t = t0; bar = 0
    while t < t1 - .05:
        for k in range(12):
            tt = t + k * beat / 3
            if tt >= t1: break
            acc = k in (0, 6) ; roll = bar % 4 == 3 and k >= 8
            if acc or roll or rng.random() < .55: N_(tt, 'toms', 'low' if acc else 'high', None, (v if acc else v * .55) * (1.2 if roll else 1), (rng.random() - .5) * .4, .6)
            if acc: N_(tt, 'gran_cassa', None, None, v * .7, 0, .55)
        t += 4 * beat; bar += 1

if EP == 1:
    N_(.1, 'cellos', 'D3', C['title'] - .1, .3, -.1, .6); N_(.1, 'organ_soft', 'A3', C['title'], .22, .2, .4)
    N_(HIT['titleCandle'], 'piano', 'D2', 4, .85, 0, .9); N_(HIT['titleCandle'], 'gran_cassa', None, None, .5, 0, .6)
    a, b = span('home'); pad(a, b, ['D3', 'F3', 'A3']); theme(a + 1.0, 'flute', .45, .55)
    a, b = span('airport'); pad(a, b, ['Bb2', 'D3', 'F3']); theme(a + .5, 'cellos', .5, .75)
    a, b = span('watch'); pad(a, b, ['G2', 'D3', 'G3'], v=.35); N_(a, 'harp', 'D4', 2, .4, .2, .5); N_(a + 1.2, 'harp', 'A4', 2, .35, .2, .45)
    a, b = span('manc'); N_(a, 'cellos', 'D3', b - a, .35, 0, .6)
    a, b = span('kitchen'); N_(a, 'cellos', 'C3', b - a, .32, 0, .55)
    a, b = span('bunk'); N_(a, 'piano', 'A2', 3, .4, 0, .6); N_(a + 3.5, 'piano', 'F2', 4, .35, 0, .6)
    a, b = span('call'); pad(a, b, ['D3', 'F3', 'A3'], v=.25, g=.25); theme(a + .3, 'flute', .35, .4, upto=8)
    a, b = span('callEnd'); theme(a + .6, 'piano', .35, .55, upto=4)                     # the theme breaks off
    a, b = span('office'); [N_(a + i * BEAT * .6, 'harp', ['F3', 'A3', 'C4', 'F4', 'C4', 'A3'][i % 6], 2, .4, .3, .5) for i in range(int((b - a) / (BEAT * .6)))]
    pulse(C['pub'], C['canteen'], ['D', 'D', 'Bb', 'Bb', 'F', 'F', 'C', 'C'], layers=2)
    pulse(C['canteen'], C['walk'], ['Dm', 'Bb', 'F', 'A'], layers=4)
    a, b = span('walk'); pad(a, b, ['D3', 'F#3', 'A3'], inst='violins', v=.35, g=.4); theme(a + 1.0, 'cellos', .45, .6, major=True)
    a, b = span('laptop'); pulse(a, HIT['silence'], ['D', 'F'], layers=3, beat=BEAT * .8)
    d = HIT['drop']; N_(d, 'gran_cassa', None, None, 1., 0, 1.); N_(d, 'timpani', 'D2', 3, 1., 0, 1.); N_(d, 'gong', None, None, .7, 0, .7); N_(d, 'piano', 'D1', 4, 1., 0, .9); N_(d, 'piano', 'Eb2', 4, .8, 0, .7)
    a, b = span('ep2'); N_(a, 'cellos', 'D3', 2.5, .45, 0, .8); N_(a + 2.5, 'cellos', 'C#3', 2.6, .42, 0, .8)
    a, b = span('brand'); N_(a + .2, 'harp', 'D4', 3, .45, 0, .5); N_(a + .2, 'organ_soft', 'A3', 4, .22, 0, .35)
elif EP == 2:
    N_(.1, 'piano', 'D2', 3, .8, 0, .9); N_(.1, 'cellos', 'A2', 5, .3, 0, .5)
    a, b = span('onam'); pad(a, b, ['D3', 'F3', 'A3'], v=.25, g=.25); [N_(a + i * BEAT / 2, 'cellos_pizz', ['D3', 'F3', 'A3', 'G3'][i % 4], .3, .35, -.2, .4) for i in range(int((b - a) / (BEAT / 2)))]
    a, b = span('sadya'); pad(a, b, ['F3', 'A3', 'C4']); theme(a + .4, 'flute', .45, .5, major=False); [N_(a + i * BEAT, 'frame_drum', None, None, .35, 0, .35) for i in range(int((b - a) / BEAT))]
    pulse(C['green'], C['loss'], ['F', 'C', 'Dm', 'Bb'], layers=3)
    a, b = span('loss'); N_(a, 'cellos', 'D2', b - a, .45, 0, .7); N_(a + 1, 'piano', 'A2', 3, .5, 0, .6)
    pulse(C['revenge'], C['ignore'], ['Dm', 'A', 'Dm', 'A'], layers=4, acc=.95)
    a, b = span('ignore'); theme(a + .2, 'glockenspiel', .4, .5, beat=BEAT * .9, upto=8)      # Amma's call: the theme, unanswered
    pulse(C['loan'], C['margin'], ['Dm', 'A', 'Bb', 'A'], layers=4, acc=.93)
    a, b = span('chat'); N_(a, 'cellos', 'D2', b - a, .5, 0, .8); N_(a, 'contrabass', 'D1', b - a, .45, 0, .6)
    a, b = span('anoop'); N_(a + .2, 'timpani', 'D2', 2, .8, 0, .8)
    a, b = span('realise'); N_(a, 'violins_trem', 'A4', b - a, .4, .2, .4); N_(a, 'violins_trem', 'Bb4', b - a, .3, -.2, .3)
    a, b = span('leave'); theme(a + .3, 'violin', .45, .6, beat=BEAT * 1.15, upto=8)        # the theme, sour and alone
    a, b = span('bus'); theme(a + .8, 'piano', .4, .55, beat=BEAT * 1.25); N_(a, 'organ_soft', 'D3', b - a, .18, 0, .3)
    a, b = span('notebook'); N_(a, 'cellos', 'D3', 4, .45, 0, .8); N_(a + 4, 'cellos', 'C#3', b - a - 4, .45, 0, .8); N_(a, 'organ_soft', 'A2', b - a, .22, 0, .4)
    a, b = span('ep3'); N_(a, 'piano', 'D2', 3, .7, 0, .8)
    a, b = span('brand'); N_(a + .2, 'harp', 'D4', 3, .45, 0, .5)
else:
    N_(.1, 'piano', 'D2', 3, .7, 0, .8); N_(.1, 'cellos', 'A2', 4, .35, 0, .6)
    a, b = span('warehouse'); [N_(a + i * BEAT * 2, 'piano', p, BEAT * 2, .4, -.1, .55) for i, p in enumerate(['D3', 'D3', 'F3', 'E3', 'D3', 'C3', 'D3', 'A2', 'D3', 'F3'] * 2) if a + i * BEAT * 2 < span('lunch')[1]]
    a, b = span('class'); pad(a, b, ['D3', 'F3', 'A3'], inst='organ_soft', v=.22, g=.3)
    a, b = span('breach'); N_(a, 'violins_trem', 'D4', b - a, .4, .2, .35)
    a, b = span('floor'); pad(a, b, ['D3', 'F3', 'A3'], v=.22, g=.25); theme(a + 1.2, 'accordion', .35, .45, beat=BEAT * 1.15)   # under Amma's voice note
    a, b = span('audit'); pulse(a, b, ['Dm', 'Dm'], layers=1)
    # the comeback BGM: chenda rolls + string ostinato + heroic flute theme
    a, b = span('rules'); pulse(a, b, ['Dm', 'Bb', 'F', 'C'], layers=2); chenda(a + (b - a) * .5, b, v=.5)
    a, b = span('seasons'); chenda(a, b, v=.75); pulse(a, b, ['D', 'Bb', 'F', 'C'], layers=4)
    theme(a + .4, 'flute', .6, .75, major=True, octave=1); theme(a + .4, 'violins', .5, .5, major=True)
    a, b = span('payout'); N_(a, 'violins_trem', 'A4', HIT['approved'] - a, .35, 0, .35); N_(HIT['approved'], 'glockenspiel', 'A5', 1.5, .6, .2, .6); N_(HIT['approved'], 'harp', 'D4', 2, .5, 0, .6)
    a, b = span('payface'); theme(a + .4, 'flute', .45, .55, major=True, upto=8)
    a, b = span('repay'); pad(a, span('anoop')[1], ['D3', 'F#3', 'A3'], inst='violins', v=.3, g=.35)
    a, b = span('arrivals'); pad(a, b, ['D3', 'F#3', 'A3']); theme(a + .6, 'cellos', .5, .7, major=True); theme(a + .6 + 16 * BEAT, 'flute', .5, .6, major=True, octave=1)
    [N_(a + i * BEAT * .5, 'harp', ['D4', 'F#4', 'A4', 'D5'][i % 4], 1.5, .35, .3, .4) for i in range(int((b - a) / (BEAT * .5)))]
    a, b = span('veranda'); N_(a, 'organ_soft', 'D3', span('veranda2')[1] - a, .2, 0, .32)
    a, b = span('veranda2'); [N_(a + i * .7, 'piano', p, 1.8, .42, 0, .55) for i, p in enumerate(['A3', 'D4', 'E4', 'F#4'])]
    a, b = span('end'); chenda(a + .3, a + 4.0, v=.6)
    for p in ['D3', 'A3', 'D4', 'F#4', 'A4']: N_(HIT['candle'], 'cellos' if p in ('D3', 'A3') else 'violins', p, b - HIT['candle'], .45, 0, .55)
    theme(HIT['candle'] + .4, 'flute', .5, .6, major=True, upto=8)
    a, b = span('brand'); N_(a + .2, 'harp', 'D5', 3, .45, 0, .5); N_(a + .2, 'cellos', 'D3', 4.5, .4, 0, .5)
S.ensure(sorted({e[1] for e in m}))
music = S.room(S.render(m, dur=N / SR, master=False).astype(np.float32), size=.55, mix=.2)

# ======================= SOUND DESIGN =======================
fx = st(); amb = st()
for k, v in C.items():
    if v > 0 and k not in ('brand',) and not ANIME: add(fx, scrape(.55), v - .02, .2, rng.uniform(-.3, .3))       # the knife lays every new shot (painted version only)
def has(k): return k in C
if EP == 1:
    a, b = span('cold'); amb += bed(lp(rainbed(span('face')[1]), 2500), 0, span('face')[1], .35)
    add(fx, whoosh(1.0, .6), HIT['titleCandle'] - .25, .35); add(fx, scrape(.9), HIT['titleText'], .3)
    a, b = span('home'); amb += bed(lp(noise(b - a), 2000).astype(np.float32), a, b, .03); [add(fx, chirp(4200 + rng.uniform(0, 600)), a + 1 + i * 2.3, .02, rng.uniform(-.6, .6)) for i in range(5)]   # night insects
    for i in range(3): add(fx, clack(1.4, .5), a + 1.2 + i * .9, .12, -.2)
    a, b = span('airport'); amb += bed(hum(b - a, 55), a, b, .06); amb += bed(murmur(b - a), a, b, .08); add(fx, ding(.5), a + .4, .1, .4)
    add(fx, click(2.2, .8), HIT['watchClick'], .5, .1); add(fx, click(3., .5), HIT['watchClick'] + .05, .3, .1)
    a, b = span('watch'); amb += bed(murmur(b - a), a, b, .05)
    a, b = span('manc'); amb += bed(rainbed(b - a, 1.3), a, b, .6)
    w = (lp(brown(b - a), 200) * (1 + .6 * np.sin(2 * np.pi * 3.4 * t_(b - a)))).astype(np.float32); amb += bed(w / np.abs(w).max(), a, b, .18, pan=.15)
    a, b = span('kitchen'); amb += bed(bp(noise(b - a), 200, 1200).astype(np.float32), a, b, .12); [add(fx, clack(1.6 + rng.uniform(-.3, .3), .5), a + .3 + i * .8, .18, .3) for i in range(int((b - a) / .8))]
    a, b = span('bunk'); amb += bed(lp(noise(b - a), 300).astype(np.float32), a, b, .05); add(fx, (lp(noise(.6), 180) * np.sin(np.linspace(0, 60, int(.6 * SR)))).astype(np.float32), HIT['emailBuzz'], .25)
    a, b = span('call'); add(fx, ding(.6), HIT['chime'], .14, 0); amb += bed(hum(b - a + span('callEnd')[1] - b, 50), a, span('callEnd')[1], .05)
    add(fx, (bp(noise(.15), 800, 3000) * np.exp(-np.linspace(0, 6, int(.15 * SR)))).astype(np.float32), HIT['hangup'], .2)
    a, b = span('office'); amb += bed(hum(b - a, 60), a, b, .04); [add(fx, click(2.6 + rng.uniform(-.4, .4), .25), a + .4 + i * .19, .1, -.2) for i in range(int((b - a - 1) / .19))]
    a, b = span('pub'); amb += bed(murmur(b - a), a, b, .2); [add(fx, clack(2.4, .3), a + .6 + i * 2.6, .08, .4) for i in range(int((b - a) / 2.6))]
    a, b = span('research'); [add(fx, click(3.2, .3), a + i * .2, .07, .3) for i in range(int((b - a) / .2))]
    a, b = span('bath'); amb += bed(hp(noise(b - a), 400).astype(np.float32) * .3, a, b, .04); add(fx, ding(1.), HIT['ping1'], .2, .1); add(fx, ding(1.), HIT['ping2'], .22, .1)
    a, b = span('canteen'); amb += bed(murmur(b - a), a, b, .1); add(fx, thump(.5, 140), HIT['pat'], .3)
    a, b = span('resign'); amb += bed(hum(b - a, 60), a, b, .03); add(fx, whoosh(.5, .4), HIT['envelope'], .2, .2); add(fx, scrape(.6), HIT['rack'], .15, .3)
    a, b = span('walk'); amb += bed(lp(noise(b - a), 1500).astype(np.float32), a, b, .04); [add(fx, chirp(2600 + rng.uniform(0, 1500)), a + .3 + i * .6, .05, rng.uniform(-.7, .7)) for i in range(int((b - a) / .6))]
    add(fx, thump(.6, 90), HIT['box'], .35); [add(fx, ding(.35), HIT['ring'] + i * .45, .08, 0) for i in range(3)]
    a = C['laptop']; amb += bed(hp(noise(HIT['silence'] - a), 3000).astype(np.float32) * .2, a, HIT['silence'], .05, fade=.05)
    add(fx, scrape(1.2), HIT['drop'] + .35, .45); add(fx, scrape(.9), HIT['drop'] + .9, .35, -.3); add(fx, scrape(.9), HIT['ep2'], .3)
    SIL = [(HIT['silence'], HIT['drop'])]
elif EP == 2:
    a, b = span('onam'); amb += bed(murmur(b - a + span('sadya')[1] - b), a, span('sadya')[1], .2)
    a, b = span('sadya'); [add(fx, clack(2.0, .3), a + .5 + i * 1.7, .07, rng.uniform(-.5, .5)) for i in range(int((b - a) / 1.7))]
    add(fx, ding(.9), HIT['ping1'], .2, .1); add(fx, ding(.9), HIT['ping2'], .2, -.1); [add(fx, click(3.0, .5), HIT['chatPop'] + i * .6, .15, .2) for i in range(4)]
    a, b = span('loss'); amb += bed(hum(b - a, 50), a, b, .05)
    a, b = span('revenge'); [add(fx, click(2.4 + rng.uniform(-.4, .4), .3), a + i * .12, .08, rng.uniform(-.3, .3)) for i in range(int((b - a) / .12))]
    a, b = span('ignore'); vib = (lp(noise(.7), 180) * np.sin(np.linspace(0, 70, int(.7 * SR)))).astype(np.float32)
    [add(fx, vib, HIT['buzz'] + i * 1.0, .3) for i in range(int((HIT['facedown'] - HIT['buzz']) / 1.0))]; add(fx, thump(.5, 160), HIT['facedown'], .3)
    add(fx, click(1.6, .8), HIT['loanOk'], .35)
    add(fx, heartbeat(1.), HIT['heart1'], .8); add(fx, heartbeat(1.), HIT['heart2'], .9)
    add(fx, (hp(noise(.25), 2500) * np.exp(-np.linspace(0, 8, int(.25 * SR)))).astype(np.float32), HIT['crack'], .7)
    [add(fx, ding(.4), HIT['flood'] + i * .22, .08, rng.uniform(-.5, .5)) for i in range(6)]
    a, b = span('anoop'); amb += bed(lp(noise(span('realise')[1] - a), 400).astype(np.float32), a, span('realise')[1], .04)
    add(fx, thump(.6, 90), HIT['door'], .3)
    a, b = span('bus'); amb += bed(rainbed(b - a, 1.3), a, b, .55)
    a, b = span('notebook'); add(fx, scrape(.8), HIT['circle'], .2); add(fx, scrape(.9), HIT['ep3'], .3)
    SIL = [(HIT['silence'], HIT['heart1'])]
else:
    a, b = span('warehouse'); amb += bed(hum(b - a, 50), a, b, .07); amb += bed(lp(brown(b - a), 200).astype(np.float32), a, b, .1); add(fx, beep(), HIT['beep1'], .25); add(fx, beep(), HIT['beep2'], .25)
    a, b = span('class'); amb += bed(murmur(b - a), a, b, .04)
    [(add(fx, ding(.5), HIT['breach'] + i * .45, .1, .2), add(fx, click(1.8, .6), HIT['breach'] + i * .45 + .25, .2)) for i in range(7)]
    a, b = span('floor'); amb += bed(hum(b - a, 50), a, b, .05)
    a, b = span('audit'); [add(fx, (bp(noise(.35), 2000, 6000) * .4).astype(np.float32), a + .4 + i * .7, .1, .1) for i in range(int((b - a) / .7))]
    a, b = span('rules'); [add(fx, (bp(noise(.05), 3000, 8000) * .3).astype(np.float32), a + i * .09, .05, -.1) for i in range(int((b - a) / .09))]
    add(fx, ding(1.), HIT['sent'], .2, .1); add(fx, ding(.6), HIT['typed'] + 1.0, .12, .1)
    a, b = span('arrivals'); amb += bed(murmur(b - a), a, b, .12); [add(fx, chirp(2800 + rng.uniform(0, 900)), a + .5 + i * 1.8, .04, rng.uniform(-.6, .6)) for i in range(int((b - a) / 1.8))]
    a = C['veranda']; amb += bed(rainbed(C['end'] - a, .9), a, C['end'], .45)
    add(fx, (lp(noise(.6), 180) * np.sin(np.linspace(0, 60, int(.6 * SR)))).astype(np.float32), HIT['buzz'], .25)
    add(fx, click(2.8, .9), HIT['photo'], .35); add(fx, thump(.4, 120), HIT['facedown'], .25)
    a, b = span('end'); amb += bed(rainbed(b - a, .7), a, b, .4)
    SIL = []

# ======================= VOICE =======================
voice = st(); duck = np.zeros(N)
PHONE = {1: {'a26'}, 2: {'b17', 'b19'}, 3: {'c08', 'c19'}}[EP]          # heard through a phone speaker
for L in LINES:
    x, sr = sf.read(f"{HERE}/voice/ep{EP}/{L['id']}.wav", dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = compress(x / (np.abs(x).max() + 1e-9), thr=.3, ratio=3.); x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .12
    if L['id'] in PHONE: x = (bp(x, 300, 3400) * 1.5).astype(np.float32)
    add(voice, x.astype(np.float32), L['t'], 1., 0.); duck[int((L['t'] - .15) * SR):int((L['t'] + len(x) / SR + .25) * SR)] = 1
k = int(.12 * SR); duck = np.convolve(duck, np.ones(k) / k, 'same'); g = (1 - duck * (1 - 10 ** (-8 / 20)))[:, None].astype(np.float32)
# ======================= SONGS (the user's tracks, placed by situation) =======================
# cue: (file, offset into the track, t0, t1, gain, fade in, fade out) — t0/t1 are shot names or HIT keys or seconds; the score is muted under each cue
def T(v): return v if isinstance(v, (int, float)) else (HIT[v] if v in HIT else C[v])
CUES = {
  1: [('Alaakaa_Loova', 0.0, 0.0, 'home', .9, .05, 1.2),                      # cold open + title: the dark build
      ('Apna_Friday_Aayega', 14.0, 'office', 'resign', .8, 1.5, 1.6)],       # IT job, the pub, first profits
  2: [('Apna_Friday_Aayega_House_Mix', 0.0, 9.36, 'loss', .85, 2.0, .05),     # Onam with the boys -> the drop lands on the first transfer; cut dead at the first loss
      ('Alaakaa_Loova', 8.0, 'loss', 'margin', .8, .4, .3)],                 # loss, revenge trades, loan, the spiral
  3: [('Blud_Is_On_His_Way', 10.0, 'audit', 'arrivals', .95, 1.0, 3.5),       # reads his trades -> hit on the comeback -> payout -> repays everyone
      ('GOAT_Song', 0.0, 'end', 99.0, .8, .3, 1.5)],                         # last line, RED CANDLE, MeowXTrader
}[EP]
songs = st(); smask = np.ones(N, np.float32)
if SONGS:
    import soxr
    for f, off, a, b, gain, fi, fo in CUES:
        a, b = T(a), min(T(b), DUR); x, sr = sf.read(f"{HERE}/music-user/{f}.mp3", dtype='float32', always_2d=True)
        if sr != SR: x = soxr.resample(x, sr, SR).astype(np.float32)
        if x.shape[1] == 1: x = np.repeat(x, 2, 1)
        x = x[int(off * SR):int((off + b - a) * SR)]; n = len(x)
        x = x / (np.sqrt(np.mean(x ** 2)) + 1e-9) * .075 * gain                     # level-match every track
        env = np.ones(n, np.float32); i, o = max(1, int(fi * SR)), max(1, int(fo * SR)); env[:i] = np.linspace(0, 1, i); env[-o:] *= np.linspace(1, 0, o)
        s0 = int(a * SR); n = min(n, N - s0); songs[s0:s0 + n] += (x[:n] * env[:n, None]).astype(np.float32)
        i0, i1 = int(a * SR), int((a + n / SR) * SR); xf = int(.6 * SR)
        smask[i0:i1] = 0; smask[max(0, i0 - xf):i0] = np.minimum(smask[max(0, i0 - xf):i0], np.linspace(1, 0, i0 - max(0, i0 - xf))); smask[i1:i1 + xf] = np.minimum(smask[i1:i1 + xf], np.linspace(0, 1, len(smask[i1:i1 + xf])))
    gs = (1 - duck * (1 - 10 ** (-13 / 20)))[:, None].astype(np.float32)           # songs carry vocals: duck deeper under the Malayalam dialogue
mix = (0 if NOMUSIC else music * .55 * g * smask[:, None] + (songs * gs if SONGS else 0)) + amb * g + fx * (1 - duck[:, None] * .3) + voice
for a, b in SIL: i0, i1 = int(a * SR), int(b * SR); mix[i0:i1] = 0; f = int(.08 * SR); mix[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
mix = mix[:int(DUR * SR)]; fo = int(1.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = limit(mix.astype(np.float32), .9); os.makedirs(f'{HERE}/out', exist_ok=True)
name = f"{HERE}/out/mix-ep{EP}{'-anime' if ANIME else ''}{'-songs' if SONGS else ''}{'-nomusic' if NOMUSIC else ''}.wav"; sf.write(name, mix, SR)
print(name, f'{DUR:.1f}s', 'instruments', sorted({e[1] for e in m}))
