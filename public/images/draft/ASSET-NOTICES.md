# Private wedding draft assets

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
