# Private wedding draft assets

venue-directions.webp is a lossless raster rendering of the single-page hotel
directions PDF supplied by the user, “2604 더링크호텔 약도 오시는길 (1).pdf”.
The hotel artwork and directions are retained without rewriting or cropping.
Rendered with scripts/render-venue.swift to preserve embedded Korean text, then
converted with scripts/prepare-directions.mjs. The original PDF is not published.

venue-naver-map.png is the unmodified PNG saved using Naver Map's official
Download button on 2026-09-25, for the search “더링크호텔” at zoom 15.
Source: https://map.naver.com/p/search/%EB%8D%94%EB%A7%81%ED%81%AC%ED%98%B8%ED%85%94
Official export instructions: https://help.naver.com/service/5637/contents/18762?osType=PC
Map content belongs to NAVER and its data providers; it is not an original project
asset or a freely licensed map. The draft retains explicit NAVER attribution and
links to the source. Refresh from the source if roads or venue information change.

intro-*.webp and main-*.webp are optimized derivatives of the photographs supplied
by the user in images/intro.jpg and images/main.jpg. Originals are excluded from Git.

gallery/01-*.webp through gallery/25-*.webp are optimized derivatives of the user's
images/1.jpg through images/25.jpg, added at the user's request. Also included are
gallery/21-1-*.webp and gallery/21-2-*.webp from images/21-1.jpg and images/21-2.jpg.
The 320px files are
board thumbnails; 1200px files are for the swipe viewer. EXIF/GPS and original camera
metadata are omitted. The JPEG originals remain local and excluded from Git.
Regenerate these derivatives with node scripts/prepare-gallery.mjs.

black-rush-outlines.json contains Latin lettering outlines for the personal,
non-profit wedding draft editor, rendered as SVG paths, not an embedded font file.
Black Rush by Basni.std: https://www.dafont.com/blackrush.font
The source lists personal, non-profit use as permitted. No original font binary
is published. These outlines are not licensed for general template distribution
or commercial reuse. SVG conversion does not change the source license.

Regenerate images with node scripts/prepare-draft.mjs. To regenerate lettering,
provide a locally obtained Blackrush.ttf path as the optional first argument.
