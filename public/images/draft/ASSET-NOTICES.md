# Private wedding draft assets

venue-naver-map.png is the unmodified PNG saved using Naver Map's official
Download button on 2026-09-25, for the search “더링크호텔” at zoom 15.
Source: https://map.naver.com/p/search/%EB%8D%94%EB%A7%81%ED%81%AC%ED%98%B8%ED%85%94
Official export instructions: https://help.naver.com/service/5637/contents/18762?osType=PC
Map content belongs to NAVER and its data providers; it is not an original project
asset or a freely licensed map. The draft retains explicit NAVER attribution and
links to the source. Refresh from the source if roads or venue information change.

intro-*.webp and main-*.webp are optimized derivatives of the photographs supplied
by the user in images/intro.jpg and images/main.jpg. Originals are excluded from Git.

black-rush-outlines.json contains Latin lettering outlines for the personal,
non-profit wedding draft editor, rendered as SVG paths, not an embedded font file.
Black Rush by Basni.std: https://www.dafont.com/blackrush.font
The source lists personal, non-profit use as permitted. No original font binary
is published. These outlines are not licensed for general template distribution
or commercial reuse. SVG conversion does not change the source license.

Regenerate images with node scripts/prepare-draft.mjs. To regenerate lettering,
provide a locally obtained Blackrush.ttf path as the optional first argument.
