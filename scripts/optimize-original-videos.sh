#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$project_dir/source-media/original-videos"
output_dir="$project_dir/public/videos/optimized"
mkdir -p "$output_dir"

ffmpeg -hide_banner -loglevel error -y \
  -i "$source_dir/hero-showcase.mp4" \
  -vf "fps=30,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,format=yuv420p" \
  -an -c:v libx264 -preset fast -crf 25 -profile:v high -level 4.0 \
  -g 60 -keyint_min 30 -fps_mode cfr -movflags +faststart \
  "$output_dir/hero-showcase.mp4"

for source in "$source_dir"/template-*.mp4; do
  filename="$(basename "$source")"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$source" \
    -vf "fps=30,scale=720:960:force_original_aspect_ratio=increase,crop=720:960,format=yuv420p" \
    -an -c:v libx264 -preset fast -crf 26 -profile:v high -level 4.0 \
    -g 60 -keyint_min 30 -fps_mode cfr -movflags +faststart \
    "$output_dir/$filename"
done

echo "Optimized original motion videos written to $output_dir"
