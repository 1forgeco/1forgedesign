#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$project_dir/source-media/original-videos"
image_dir="$project_dir/public/templates"
output_dir="$project_dir/public/videos/4k"
mkdir -p "$output_dir"

images=(
  hero-organico-editorial-3.webp
  hero-dark-luxury-2.webp
  hero-minimal-bold-2.webp
  hero-split-screen-1.webp
  cards-produto-glassmorphism-2.webp
  cards-servico-editorial-1.webp
  navigation-bar-premium-1.webp
  navigation-bar-minimal-3.webp
  hero-stats-flutuantes-3.webp
  hero-mockup-3d-4.webp
  footer-editorial-dark-1.webp
  footer-minimal-clean-1.webp
  features-grid-2.webp
  depoimentos-2.webp
  sobre-dark-1.webp
  cta-section-premium-1.webp
  preco-planos-cards-cover.webp
  blog-post-hero-1.webp
  portfolio-hero-cover.webp
  landing-page-full-2.webp
  hero-aqua-glass-1.webp
  hero-smart-product-3d-1.webp
  hero-editorial-medieval-1.webp
  hero-museum-imperial-1.webp
  hero-samurai-purple-1.webp
  hero-ferrari-296-1.webp
  hero-paradise-caribe-1.webp
  hero-crystal-lotus-1.webp
  hero-cycle-zephyr-1.webp
  hero-iris-vision-1.webp
  hero-aurora-heart-1.webp
  hero-glacius-frost-1.webp
  hero-crystal-sphere-1.webp
  hero-smart-key-1.webp
  hero-noir-lux-1.webp
  hero-techwear-1.webp
  hero-solace-1.webp
  hero-amethyst-1.webp
  hero-primal-1.webp
)

encode_video() {
  local input="$1"
  local output="$2"
  local width height scale
  width="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$input")"
  height="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$input")"
  if (( width >= height )); then
    scale="3840:-2"
  else
    scale="2160:-2"
  fi

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    -vf "fps=30,scale=$scale:flags=lanczos,unsharp=5:5:0.35:5:5:0.0,format=yuv420p" \
    -an -c:v libx264 -preset veryfast -tune animation -crf 22 \
    -profile:v high -level 5.2 -g 60 -keyint_min 30 -fps_mode cfr -movflags +faststart \
    "$output"
}

encode_still() {
  local input="$1"
  local output="$2"
  local width height canvas
  width="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$input")"
  height="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$input")"
  if (( width >= height )); then
    canvas="3840x2160"
  else
    canvas="2160x2880"
  fi

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$input" \
    -vf "zoompan=z='1+0.055*(1-cos(2*PI*on/239))/2':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=$canvas:fps=30,unsharp=5:5:0.28:5:5:0.0,format=yuv420p" \
    -frames:v 240 -an -c:v libx264 -preset veryfast -tune stillimage -crf 21 \
    -profile:v high -level 5.2 -g 60 -keyint_min 30 -movflags +faststart \
    "$output"
}

encode_video "$source_dir/hero-showcase.mp4" "$output_dir/hero-showcase.mp4"

for index in "${!images[@]}"; do
  number="$(printf "%02d" "$((index + 1))")"
  source="$source_dir/template-$number.mp4"
  output="$output_dir/template-$number.mp4"
  if [[ -f "$source" ]]; then
    encode_video "$source" "$output"
  else
    encode_still "$image_dir/${images[$index]}" "$output"
  fi
  echo "4K presentation ready: template-$number.mp4"
done

echo "Created 39 template presentation videos plus the hero in $output_dir"
