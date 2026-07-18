# Video source audit

Reference gallery: `https://figma-templates-en.vercel.app/`

The reference gallery exposes genuine motion files for 30 of the 39 templates plus its main showcase. The recovered native files are stored in `source-media/original-videos` as MP4 and `public/videos/original` as WebM.

## Native source quality

- 26 template videos: 720 × 960
- Template 01: 1080 × 1350
- Template 20: 1920 × 1080
- Template 21: 1080 × 1440
- Template 22: 1080 × 1920
- Main showcase: 1920 × 1080

The reference website does not expose native 4K files. Files in `public/videos/4k` are presentation renditions produced with Lanczos scaling, restrained sharpening, H.264 encoding and fast-start metadata. They are intentionally described as “4K presentation” files rather than native 4K masters.

## Recovered missing motion

The first local import missed genuine motion for templates 04, 05, 07, 10, 11, 12 and 20. Those original MP4 and WebM pairs are now included.

## Still-only reference templates

Templates 13, 14, 15, 16, 17, 18, 19, 23 and 25 are marked `video: false` by the reference site. Their 4K presentation files use a subtle cinematic camera move derived from the highest-resolution supplied cover image; they are not represented as downloaded original animation.
