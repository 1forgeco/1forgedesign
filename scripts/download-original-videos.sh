#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="$project_dir/source-media/original-videos"
webm_dir="$project_dir/public/videos/original"
base_url="https://figma-templates-en.vercel.app/assets"
mkdir -p "$output_dir" "$webm_dir"

download() {
  local url="$1"
  local output="$2"
  if [[ -s "$output" ]]; then
    return
  fi
  curl --fail --location --silent --show-error --retry 3 "$url" --output "$output"
}

download_pair() {
  local number="$1"
  local folder="$2"
  local slug="$3"
  download "$base_url/$folder/$slug.mp4" "$output_dir/template-$number.mp4"
  download "$base_url/$folder/$slug.webm" "$webm_dir/template-$number.webm"
}

download "$base_url/edit%20hero%20lp%20templates.mp4" "$output_dir/hero-showcase.mp4"
download "$base_url/edit%20hero%20lp%20templates.webm" "$webm_dir/hero-showcase.webm"
download_pair "01" "template%201" "hero-organico-editorial"
download_pair "02" "template%202" "hero-dark-luxury"
download_pair "03" "template%203" "hero-minimal-bold"
download_pair "04" "template%204" "hero-split-screen"
download_pair "05" "template%205" "cards-produto-glassmorphism"
download_pair "06" "template%206" "cards-servico-editorial"
download_pair "07" "template%207" "navigation-bar-premium"
download_pair "08" "template%208" "navigation-bar-minimal"
download_pair "09" "template%209" "hero-stats-flutuantes"
download_pair "10" "template%2010" "hero-mockup-3d"
download_pair "11" "template%2011" "footer-editorial-dark"
download_pair "12" "template%2012" "footer-minimal-clean"
download_pair "20" "template%2020" "landing-page-full"
download_pair "21" "template%2021" "hero-aqua-glass"
download_pair "22" "template%2022" "hero-smart-product-3d"
download_pair "24" "template%2024" "hero-museum-imperial"
download_pair "26" "template%2026" "hero-ferrari-296"
download_pair "27" "template%2027" "hero-paradise-caribe"
download_pair "28" "template%2028" "hero-crystal-lotus"
download_pair "29" "template%2029" "hero-cycle-zephyr"
download_pair "30" "template%2030" "hero-iris-vision"
download_pair "31" "template%2031" "hero-aurora-heart"
download_pair "32" "template%2032" "hero-glacius-frost"
download_pair "33" "template%2033" "hero-crystal-sphere"
download_pair "34" "template%2034" "hero-smart-key"
download_pair "35" "template%2035" "hero-noir-lux"
download_pair "36" "template%2036" "hero-techwear"
download_pair "37" "template%2037" "hero-solace"
download_pair "38" "template%2038" "hero-amethyst"
download_pair "39" "template%2039" "hero-primal"

echo "All 30 genuine template motion sources plus the hero are available."
