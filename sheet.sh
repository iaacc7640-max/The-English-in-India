#!/bin/bash
# usage: sheet.sh NAME "t1,t2,t3,t4,..."  -> review/NAME_k.jpg, 2x2 tiles of full frames at 960x540
cd /home/user/The-English-in-India/project
rm -rf review/tmp_$1; timeout 600 node tools/capture.mjs frames review/tmp_$1 "$2" >/dev/null 2>&1
IFS=',' read -ra T <<< "$2"; k=0
for ((j=0; j<${#T[@]}; j+=4)); do
  args=(); f=""; n=0
  for ((m=j; m<j+4 && m<${#T[@]}; m++)); do args+=(-i "review/tmp_$1/t$(printf '%.2f' ${T[m]}).jpg"); n=$((n+1)); done
  while [ $n -lt 4 ]; do args+=(-f lavfi -i color=black:s=1920x1080:d=1); n=$((n+1)); done
  ffmpeg -v error -y "${args[@]}" -filter_complex "[0]scale=960:540[a];[1]scale=960:540[b];[2]scale=960:540[c];[3]scale=960:540[d];[a][b]hstack[t];[c][d]hstack[u];[t][u]vstack" -frames:v 1 -q:v 3 review/$1_$k.jpg; k=$((k+1))
done
ls review/$1_*.jpg
