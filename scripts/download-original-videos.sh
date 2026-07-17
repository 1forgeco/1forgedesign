#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="$project_dir/source-media/original-videos"
base_url="https://figma-templates-en.vercel.app/assets"
mkdir -p "$output_dir"

download() {
  local url="$1"
  local output="$2"
  curl --fail --location --silent --show-error --retry 3 "$url" --output "$output_dir/$output"
}

download "$base_url/edit%20hero%20lp%20templates.mp4" "hero-showcase.mp4"
download "$base_url/template%201/hero-organico-editorial.mp4" "template-01.mp4"
download "$base_url/template%202/hero-dark-luxury.mp4" "template-02.mp4"
download "$base_url/template%203/hero-minimal-bold.mp4" "template-03.mp4"
download "$base_url/template%206/cards-servico-editorial.mp4" "template-06.mp4"
download "$base_url/template%208/navigation-bar-minimal.mp4" "template-08.mp4"
download "$base_url/template%209/hero-stats-flutuantes.mp4" "template-09.mp4"
download "$base_url/template%2021/hero-aqua-glass.mp4" "template-21.mp4"
download "$base_url/template%2022/hero-smart-product-3d.mp4" "template-22.mp4"
download "$base_url/template%2024/hero-museum-imperial.mp4" "template-24.mp4"
download "$base_url/template%2026/hero-ferrari-296.mp4" "template-26.mp4"
download "$base_url/template%2027/hero-paradise-caribe.mp4" "template-27.mp4"
download "$base_url/template%2028/hero-crystal-lotus.mp4" "template-28.mp4"
download "$base_url/template%2029/hero-cycle-zephyr.mp4" "template-29.mp4"
download "$base_url/template%2030/hero-iris-vision.mp4" "template-30.mp4"
download "$base_url/template%2031/hero-aurora-heart.mp4" "template-31.mp4"
download "$base_url/template%2032/hero-glacius-frost.mp4" "template-32.mp4"
download "$base_url/template%2033/hero-crystal-sphere.mp4" "template-33.mp4"
download "$base_url/template%2034/hero-smart-key.mp4" "template-34.mp4"
download "$base_url/template%2035/hero-noir-lux.mp4" "template-35.mp4"
download "$base_url/template%2036/hero-techwear.mp4" "template-36.mp4"
download "$base_url/template%2037/hero-solace.mp4" "template-37.mp4"
download "$base_url/template%2038/hero-amethyst.mp4" "template-38.mp4"
download "$base_url/template%2039/hero-primal.mp4" "template-39.mp4"

echo "Downloaded 24 original source MP4 videos to $output_dir"
