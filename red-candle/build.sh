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
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
(cd "$HERE" && node tools_srt.mjs)
"$LIB/.venv/bin/python" "$HERE/master.py" "$HERE/out/mix.wav" "$HERE/out/video.mp4" "$HERE/red-candle-ep1.mp4"
ffmpeg -y -v error -ss 6 -i "$HERE/red-candle-ep1.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
