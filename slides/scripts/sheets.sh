#!/usr/bin/env bash
# Tiles shots/NN*.png into 2×2 contact sheets (shots/sheet-NN.png) for review.
set -euo pipefail
cd "$(dirname "$0")/../shots"
rm -f sheet-*.png
files=($(ls [0-9]*.png | sort))
n=${#files[@]}; i=0; s=1
while [ $i -lt $n ]; do
  args=(); c=0
  for f in "${files[@]:$i:4}"; do args+=(-i "$f"); c=$((c+1)); done
  while [ $c -lt 4 ]; do args+=(-f lavfi -i "color=c=white:s=1960x1104:d=1"); c=$((c+1)); done
  ffmpeg -loglevel error -y "${args[@]}" -filter_complex "[0]scale=980:552[a];[1]scale=980:552[b];[2]scale=980:552[c];[3]scale=980:552[d];[a][b][c][d]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0:fill=white" -frames:v 1 "sheet-$(printf %02d $s).png"
  i=$((i+4)); s=$((s+1))
done
ls sheet-*.png | wc -l
