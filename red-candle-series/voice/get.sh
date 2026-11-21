#!/bin/sh
# usage: get.sh <ep dir> <expires>  ; stdin lines: id session gen signature
B="https://elevenlabsusercontent.com/database/workspace/f28ea9681a0c48bd96e237d7d16c3da6/content_generation"
while read id s g sig; do
  curl -sS -o "$1/$id.mp3" "$B/$s/$g/content.mp3?Expires=$2&KeyName=assets-cdn-key-1&Signature=$sig"
  ffmpeg -nostdin -v error -y -i "$1/$id.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" -ar 48000 -ac 1 "$1/$id.wav"
  printf "%s %.2f\n" $id $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1/$id.wav")
done
