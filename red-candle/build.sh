#!/bin/sh
# Rebuild "Red Candle · Episode 1" from source. LIB = the Lemo-Opuscar library folder.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/home/user/lemomo-ai/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
# Voice lines are already generated with ElevenLabs (voice/*.mp3 -> trimmed voice/*.wav); see CREDITS.
cd "$LIB"
export LEMO_ANGLE=${LEMO_ANGLE:-swiftshader}   # software WebGL on GPU-less machines; macOS: LEMO_ANGLE=metal
"$LIB/.venv/bin/python" core/audio/sampler.py --need "$HERE/mix.py"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 30 --workers 4 --size 1080x1920 --out "$HERE/out/reel.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
(cd "$HERE" && node tools_srt.mjs)
"$LIB/.venv/bin/python" "$HERE/master.py" "$HERE/out/mix.wav" "$HERE/out/reel.mp4" "$HERE/red-candle-reel-master.mp4"
ffmpeg -y -v error -ss 3 -i "$HERE/red-candle-reel-master.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
ffmpeg -y -v error -i "$HERE/red-candle-reel-master.mp4" -c:v libx264 -crf 23 -preset slow -profile:v high -pix_fmt yuv420p -r 30 -c:a copy -movflags +faststart "$HERE/red-candle-reel.mp4"
