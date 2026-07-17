#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
image_dir="$project_dir/public/templates"
video_dir="$project_dir/public/videos"
mkdir -p "$video_dir"

files=(
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

for index in "${!files[@]}"; do
  number=$(printf "%02d" "$((index + 1))")
  output="$video_dir/template-$number.mp4"

  # Preserve every genuine WebM loop recovered from the reference gallery.
  case "$number" in
    01|02|03|06|08|09|21|22|24|26|27|28|29|30|31|32|33|34|35|36|37|38|39)
      continue
      ;;
  esac

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$image_dir/${files[$index]}" \
    -vf "scale=600:800:force_original_aspect_ratio=increase,crop=600:800,zoompan=z='1+0.04*(1-cos(2*PI*on/179))/2':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=600x800:fps=30,format=yuv420p" \
    -frames:v 180 -an -c:v libx264 -preset veryfast -crf 27 -g 60 -keyint_min 30 -movflags +faststart \
    "$output"
done

echo "Motion previews ready in $video_dir"
