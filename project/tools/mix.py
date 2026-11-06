"""Inside Out soundtrack: narration + soft procedural sound effects + a quiet music bed, all made here with numpy.
No samples, no AI audio, no downloads.

  python3 tools/mix.py [project=.]          → data/mix.wav (48 kHz stereo)

Reads data/cues.json (node tools/capture.mjs cues), data/narration.wav if it exists (voice.py or words.py --audio),
and script.json "music": "bed" (the procedural score, default) · "none" · "audio/your-track.mp3" (your own royalty-free
track, any format ffmpeg reads). The music ducks under the voice.

Sound rules (STYLE.md): every effect is soft and rounded, nothing above ~5 kHz, no ticks / hats / glitches / beeps.
Cue types: whoosh slide pop plop gulp boing bubbles sizzle sparkle thud slam tock zip alarm  (+ gain, dur)
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

P = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
SR = 48000
rng = np.random.default_rng(11)
cj = json.loads((P / 'data/cues.json').read_text())
script = json.loads((P / 'script.json').read_text())
DUR = float(cj['duration'])
N = int(DUR * SR) + SR // 10


def lp(x, f, o=2): b, a = signal.butter(o, min(f, SR / 2 - 100) / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, o=2): b, a = signal.butter(o, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def bp(x, f0, f1, o=2): b, a = signal.butter(o, [f0 / (SR / 2), f1 / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def db(x): return 10 ** (x / 20)
def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=None):
    """attack a seconds then exponential release over the rest"""
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    rest = n - na; e[na:] = np.exp(-np.linspace(0, r or 5, rest)) if rest > 0 else 1; return e
def sweep(f0, f1, d, shape='exp'):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) if shape == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d): return rng.standard_normal(int(d * SR))


# ---------- the effects ----------
def whoosh(d=0.38, **_):
    n = noise(d); lo, hi = lp(n, 500), lp(n, 2200)
    k = np.sin(np.pi * np.linspace(0, 1, len(n))); x = (lo * (1 - k) + hi * k) * k ** 1.5
    return x / (np.abs(x).max() + 1e-9) * 0.5
def slide(d=1.0, **_):
    n = lp(noise(d), 700); e = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 2
    return n / (np.abs(n).max() + 1e-9) * e * 0.35 + sweep(260, 120, d) * e * 0.08
def pop(**_): x = sweep(560, 240, 0.11) * env(int(0.11 * SR), 0.002, 6); return lp(x, 3000) * 0.7
def plop(**_): x = sweep(700, 180, 0.14) * env(int(0.14 * SR), 0.002, 5); return lp(x, 2500) * 0.6
def gulp(**_):
    a = sweep(320, 140, 0.16) * env(int(0.16 * SR), 0.01, 4); b = sweep(240, 90, 0.2) * env(int(0.2 * SR), 0.01, 4)
    x = np.concatenate([a, np.zeros(int(0.04 * SR)), b]); return lp(x, 1800) * 0.8
def boing(**_):
    d = 0.42; t = tt(d); f = 200 * (1 + 0.6 * t / d) * (1 + 0.08 * np.sin(2 * np.pi * 18 * t))
    return lp(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, 4), 2000) * 0.55
def bubbles(d=2.0, **_):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * 7)):
        st = rng.integers(0, max(1, len(x) - int(0.08 * SR))); f = rng.uniform(380, 900); b = sweep(f, f * 1.6, 0.06) * env(int(0.06 * SR), 0.003, 5)
        x[st:st + len(b)] += b * rng.uniform(0.2, 0.5)
    return lp(x, 2500) * 0.5
def sizzle(d=1.0, **_):
    n = bp(noise(d), 1800, 4500); crack = (rng.random(len(n)) < 0.002).astype(float); crack = lp(crack, 300) * 40
    e = np.minimum(1, np.linspace(0, 6, len(n))) * np.linspace(1, 0.2, len(n)); return n * (0.4 + crack) * e * 0.12
def sparkle(d=1.2, **_):
    notes = [784, 880, 1047, 1175, 1319, 1568]; x = np.zeros(int(d * SR) + SR // 2)
    for k, f in enumerate(notes):
        st = int(k * d / len(notes) * SR); n = int(0.4 * SR); t = tt(0.4)
        x[st:st + n] += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.004, 6) * 0.22
    return lp(x, 4500)
def thud(**_):
    d = 0.35; t = tt(d); x = np.sin(2 * np.pi * (70 + 40 * np.exp(-t * 30)) * t) * env(len(t), 0.002, 7)
    return x * 0.9 + lp(noise(d), 220) * env(len(t), 0.001, 12) * 0.3
def slam(**_):
    d = 0.5; t = tt(d); x = np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 25)) * t) * env(len(t), 0.002, 6)
    return np.tanh(1.6 * (x + lp(noise(d), 1200) * env(len(t), 0.001, 10) * 0.6)) * 0.9
def tock(**_): d = 0.09; t = tt(d); return (np.sin(2 * np.pi * 420 * t) + 0.3 * np.sin(2 * np.pi * 840 * t)) * env(len(t), 0.001, 9) * 0.35
def zip_(**_):
    d = 0.32; n = bp(noise(d), 400, 3000); k = np.linspace(0, 1, len(n))
    return (n / (np.abs(n).max() + 1e-9) * 0.35 + sweep(300, 1100, d) * 0.12) * np.sin(np.pi * k) ** 1.2
def alarm(d=2.0, **_):
    x = np.zeros(int(d * SR)); one = np.sin(2 * np.pi * 150 * tt(0.22)) * env(int(0.22 * SR), 0.02, 5)
    for st in np.arange(0, d - 0.25, 0.5): i = int(st * SR); x[i:i + len(one)] += one
    return lp(x, 900) * 0.55

def inhale(d=1.0, **_):
    n = bp(noise(d), 300, 2600); k = np.linspace(0, 1, len(n)); e = np.sin(np.pi * np.minimum(1, k * 1.15)) ** 1.5 * (0.6 + 0.4 * k)
    return n / (np.abs(n).max() + 1e-9) * e * 0.5
def heartbeat(**_):
    one = lambda d, f: np.sin(2 * np.pi * f * tt(d)) * env(int(d * SR), 0.004, 7)
    x = np.concatenate([one(0.16, 58), np.zeros(int(0.09 * SR)), one(0.2, 52) * 0.75]); return lp(x, 300) * 1.0

# ---------- Paper Atlas effects (soft, procedural) ----------
def gong(d=3.0, **_):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * 3 * t)) * g for f, g in [(98, 1), (147.5, 0.6), (211, 0.35), (263, 0.2)])
    return lp(x * env(len(t), 0.01, 3.2), 1500) * 0.6
def page(**_):
    d = 0.45; n = bp(noise(d), 900, 4200); k = np.linspace(0, 1, len(n)); e = np.sin(np.pi * k) ** 2 * (1 + 0.6 * np.sin(2 * np.pi * 9 * k))
    return n / (np.abs(n).max() + 1e-9) * e * 0.4
def quill(d=0.8, **_):
    x = np.zeros(int(d * SR))
    for st in np.arange(0, d - 0.12, 0.11): i = int(st * SR); n = int(0.09 * SR); x[i:i + n] += bp(noise(0.09), 1800, 4500) * env(n, 0.01, 4) * rng.uniform(0.5, 1)
    return x * 0.3
def seal(**_):
    d = 0.4; t = tt(d); x = np.sin(2 * np.pi * (90 + 50 * np.exp(-t * 25)) * t) * env(len(t), 0.002, 9)
    return x * 0.8 + lp(noise(d), 600) * env(len(t), 0.001, 20) * 0.25
def scroll(d=0.7, **_):
    n = lp(bp(noise(d), 300, 2500), 2500); k = np.linspace(0, 1, len(n)); return n / (np.abs(n).max() + 1e-9) * np.sin(np.pi * k) ** 1.2 * (0.8 + 0.2 * np.sin(2 * np.pi * 14 * k)) * 0.4
def coins(n_=6, **_):
    x = np.zeros(int(0.9 * SR))
    for k in range(n_):
        st = int(rng.uniform(0, 0.55) * SR); f = rng.uniform(2200, 3400); m = int(0.25 * SR); tt_ = tt(0.25)
        x[st:st + m] += (np.sin(2 * np.pi * f * tt_) + 0.4 * np.sin(2 * np.pi * f * 1.48 * tt_)) * env(m, 0.001, 9) * rng.uniform(0.3, 0.7)
    return lp(x, 4500) * 0.5
def waves(d=2.5, **_):
    n = lp(noise(d), 700); k = np.linspace(0, 1, len(n)); e = (0.5 + 0.5 * np.sin(2 * np.pi * k * d / 2.2 - 1.5)) * np.minimum(1, np.minimum(k, 1 - k) * 6)
    return n / (np.abs(n).max() + 1e-9) * e * 0.5
def brick(**_): d = 0.12; t = tt(d); return (np.sin(2 * np.pi * 520 * t) * 0.4 + lp(noise(d), 1500) * 0.6) * env(len(t), 0.001, 14) * 0.5
def cannon(**_):
    d = 1.6; t = tt(d); x = np.sin(2 * np.pi * (45 + 30 * np.exp(-t * 8)) * t) * env(len(t), 0.004, 4) + lp(noise(d), 180) * env(len(t), 0.002, 5) * 0.8
    return lp(x, 400) * 0.8
def steps(d=1.8, **_):
    x = np.zeros(int(d * SR))
    for st in np.arange(0, d - 0.15, 0.42): i = int(st * SR); n = int(0.1 * SR); x[i:i + n] += lp(noise(0.1), 500) * env(n, 0.002, 12)
    return x * 0.5
def cloth(**_): d = 0.6; n = bp(noise(d), 500, 2500); k = np.linspace(0, 1, len(n)); return n / (np.abs(n).max() + 1e-9) * np.sin(np.pi * k) ** 2 * 0.3
def rice(d=1.2, **_):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * 60)): st = rng.integers(0, len(x) - 400); x[st:st + 300] += bp(noise(300 / SR), 2500, 4800)[:300] * env(300, 0.001, 8) * rng.uniform(0.1, 0.4)
    return x * np.linspace(1, 0.1, len(x))

FX = dict(gong=gong, page=page, quill=quill, seal=seal, scroll=scroll, coins=coins, waves=waves, brick=brick, cannon=cannon, steps=steps, cloth=cloth, rice=rice, inhale=inhale, heartbeat=heartbeat, whoosh=whoosh, slide=slide, pop=pop, plop=plop, gulp=gulp, boing=boing, bubbles=bubbles, sizzle=sizzle,
          sparkle=sparkle, thud=thud, slam=slam, tock=tock, zip=zip_, alarm=alarm)
LEVEL = dict(gong=-16, page=-20, quill=-22, seal=-13, scroll=-20, coins=-19, waves=-21, brick=-18, cannon=-17, steps=-20, cloth=-22, rice=-23, inhale=-15, heartbeat=-8, whoosh=-17, slide=-19, pop=-14, plop=-15, gulp=-11, boing=-15, bubbles=-21, sizzle=-18, sparkle=-17,
             thud=-11, slam=-9, tock=-18, zip=-14, alarm=-17)


# ---------- the music bed: soft pad + plucked arpeggio, 100 BPM, I–vi–IV–V ----------
def music_bed():
    bpm = 100; beat = 60 / bpm; bar = beat * 4
    chords = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]]
    x = np.zeros(N)
    nb = int(np.ceil(DUR / bar)) + 1
    for b in range(nb):
        ch = chords[b % 4]; st = int(b * bar * SR); n = int(bar * SR)
        if st >= N: break
        t = tt(bar); e = np.minimum(1, t / 0.4) * np.minimum(1, (bar - t) / 0.4)
        pad = sum(np.sin(2 * np.pi * f / 2 * t) + 0.25 * np.sin(2 * np.pi * f * t) for f in ch) * e * 0.10
        x[st:st + n] += pad[:max(0, min(n, N - st))]
        for k in range(8):                                                       # eighth-note pluck arpeggio
            f = ch[[0, 1, 2, 1, 2, 0, 1, 2][k]] * (2 if k % 4 == 2 else 1); ps = st + int(k * beat / 2 * SR); pn = int(0.5 * SR)
            if ps + pn >= N: continue
            pt = tt(0.5); pl = (np.sin(2 * np.pi * f * pt) + 0.35 * np.sin(4 * np.pi * f * pt)) * env(pn, 0.003, 7) * 0.12
            x[ps:ps + pn] += pl
    x = lp(x, 3200)
    fade = np.ones(N); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo)
    return x / (np.abs(x).max() + 1e-9) * fade

def music_tension():
    """low drone + slow minor pulse, for mysterious / tense explainers (script.json "music": "tension")"""
    t = np.arange(N) / SR; x = np.zeros(N)
    for f, g in [(55, 0.5), (82.4, 0.3), (110, 0.2), (130.8, 0.12)]: x += np.sin(2 * np.pi * f * t + np.sin(t * 0.3) * 0.5) * g
    x *= 0.55 + 0.45 * np.sin(2 * np.pi * t / 8) ** 2
    beat = 60 / 84; ping = lambda f: (np.sin(2 * np.pi * f * tt(1.2)) + 0.3 * np.sin(4 * np.pi * f * tt(1.2))) * env(int(1.2 * SR), 0.01, 5)
    seq = [220.0, 261.6, 196.0, 174.6]
    for k in range(int(DUR / (beat * 2))):
        i = int(k * beat * 2 * SR); pg = ping(seq[(k // 2) % 4]) * 0.35
        if i + len(pg) < N: x[i:i + len(pg)] += pg
    x = lp(x, 2200); fade = np.ones(N); fo = int(1.5 * SR); fade[-fo:] = np.linspace(1, 0, fo); fi = int(0.8 * SR); fade[:fi] *= np.linspace(0, 1, fi)
    return x / (np.abs(x).max() + 1e-9) * fade

def music_build():
    """CH8 teaser: the bed's chords slowly lifting in pitch and volume, ending on an unresolved suspended chord"""
    t = np.arange(N) / SR; x = np.zeros(N); bar = 2.4
    chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7], [196.0, 261.6, 293.7]]
    for b in range(int(DUR / bar) + 1):
        st = int(b * bar * SR); n = int(bar * SR)
        if st >= N: break
        tb = tt(bar); e = np.minimum(1, tb / 0.3) * np.minimum(1, (bar - tb) / 0.3)
        seg_ = sum(np.sin(2 * np.pi * f * tb) + 0.3 * np.sin(4 * np.pi * f * tb) for f in chords[b % 4]) * e
        x[st:st + n] += seg_[:max(0, min(n, N - st))]
    x = lp(x, 2600); x *= np.linspace(0.4, 1.0, N)
    return x / (np.abs(x).max() + 1e-9)
def music_chapters():
    """one style per chapter from data/chapters.json "music" [{t, kind}], with 1 s crossfades"""
    secs = json.loads((P / 'data/chapters.json').read_text())['music']
    tracks = {'bed': music_bed(), 'tension': music_tension(), 'build': music_build()}
    w = {k: np.zeros(N) for k in tracks}; xf = int(1.0 * SR)
    for i, sct in enumerate(secs):
        a = int(sct['t'] * SR); b = int(secs[i + 1]['t'] * SR) if i + 1 < len(secs) else N
        g = np.zeros(N); g[max(0, a - xf // 2):b + xf // 2] = 1
        if a > 0: g[max(0, a - xf // 2):a + xf // 2] = np.linspace(0, 1, len(g[max(0, a - xf // 2):a + xf // 2]))
        if b < N: g[b - xf // 2:b + xf // 2] = np.linspace(1, 0, len(g[b - xf // 2:b + xf // 2]))
        w[sct['kind']] = np.maximum(w[sct['kind']], g)
    x = sum(tracks[k] * w[k] for k in tracks)
    return x / (np.abs(x).max() + 1e-9)

def load_audio(f):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(out, dtype=np.float32).reshape(-1, 2).astype(np.float64); return a


mix = np.zeros((N, 2))
# voice
vf = P / 'data/narration.wav'
voice = None
if vf.exists():
    v = load_audio(vf)[:N]; voice = np.zeros((N, 2)); voice[:len(v)] = v
    rms = np.sqrt(np.mean(voice ** 2) + 1e-12); voice *= db(-19) / rms
    mix += voice
# music
mus = script.get('music', 'bed')
if mus and mus != 'none':
    m = music_bed() if mus == 'bed' else music_tension() if mus == 'tension' else music_chapters() if mus == 'chapters' else None
    if m is None:
        a = load_audio(P / mus)[:N]; m = np.zeros(N); m[:len(a)] = a.mean(1); m /= np.abs(m).max() + 1e-9
    m = np.stack([m, m], 1) * db(-24 if voice is not None else -20)
    if voice is not None:                                                        # duck under the voice
        lev = np.abs(voice.mean(1)); lev = signal.lfilter([1 - 0.9995], [1, -0.9995], lev); lev /= lev.max() + 1e-9
        m *= (1 - 0.55 * np.clip(lev * 3, 0, 1))[:, None]
    mix += m
# effects
for c in cj['cues']:
    fn = FX.get(c['type'])
    if not fn: print('unknown cue type, skipped:', c['type']); continue
    x = fn(**({'d': c['dur']} if c.get('dur') else {}))
    x = lp(x, 5000) * db(LEVEL[c['type']]) * c.get('gain', 1.0) / (np.abs(x).max() + 1e-9) * 0.9
    i = int(c['t'] * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: pan = c.get('pan', 0.0); mix[i:i + n, 0] += x[:n] * (1 - max(0, pan)); mix[i:i + n, 1] += x[:n] * (1 + min(0, pan))
# master: gentle soft-clip, peak -1 dBFS
mix = np.tanh(mix * 1.2) / 1.2
mix *= db(-1) / (np.abs(mix).max() + 1e-9)
wavfile.write(P / 'data/mix.wav', SR, (mix * 32767).astype(np.int16))
print(f"data/mix.wav: {DUR:.2f} s · voice: {'yes' if voice is not None else 'NO (captions-only)'} · music: {mus} · {len(cj['cues'])} cues")
