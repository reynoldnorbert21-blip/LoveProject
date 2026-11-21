# Loudness master without ffmpeg loudnorm (ffmpeg 6.x mis-reports length through it):
# measure integrated loudness with ffmpeg's ebur128, set -14 LUFS, oversampled peak limit at -1.2 dBTP, then mux.
from scipy.ndimage import minimum_filter1d
import sys, subprocess, re, numpy as np, soundfile as sf, soxr
wav, video, out = sys.argv[1:4]
def lufs(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); P = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1]); return I, P
x, sr = sf.read(wav, dtype='float32')
I, P = lufs(wav); print(f'in: {I:.1f} LUFS, true peak {P:.1f} dBTP')
for it in range(4):
    y = x * 10 ** ((-14 - I) / 20)
    up = soxr.resample(y, sr, sr * 4); ceil = 10 ** (-2.4 / 20)
    env = np.maximum(np.abs(up).max(1), 1e-9); g = np.minimum(1, ceil / env)
    k = 4 * int(.003 * sr); g = minimum_filter1d(g, 2 * k + 1)   # look-around
    g = np.convolve(g, np.ones(k) / k, 'same'); up = up * g[:, None]
    y = soxr.resample(up, sr * 4, sr).astype(np.float32)
    sf.write('/tmp/_master.wav', y, sr); I2, P2 = lufs('/tmp/_master.wav'); print(f'pass {it}: {I2:.1f} LUFS, {P2:.1f} dBTP')
    if abs(I2 + 14) < .4 and P2 <= -1.0: break
    I = I + (I2 + 14) * .9 if abs(I2 + 14) >= .4 else I
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', video, '-i', '/tmp/_master.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], check=True)
print('wrote', out)
