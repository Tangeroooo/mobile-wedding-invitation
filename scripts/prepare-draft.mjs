import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import opentype from 'opentype.js'

// Originals stay local; only stripped, resized web images are published.
const out = new URL('../public/images/draft/', import.meta.url)
await mkdir(out, { recursive: true })
for (const name of ['intro', 'main']) {
  for (const width of [800, 1400]) {
    const result = await sharp(new URL(`../images/${name}.jpg`, import.meta.url).pathname)
      .rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 })
      .toFile(new URL(`${name}-${width}.webp`, out).pathname)
    console.log(`${name}-${width}.webp: ${Math.round(result.size / 1024)} KB`)
  }
}

// Optional local font source. Never copy the TTF into the public site.
if (process.argv[2]) {
  const buffer = await readFile(process.argv[2])
  const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const glyphs = {}
  const kerning = {}
  for (let code = 32; code <= 126; code++) {
    const char = String.fromCharCode(code)
    const glyph = font.charToGlyph(char)
    const path = glyph.getPath(0, 0, 100)
    glyphs[char] = {
      path: path.toPathData(2),
      advance: (glyph.advanceWidth ?? 0) / font.unitsPerEm * 100,
      bounds: path.getBoundingBox(),
    }
    for (let next = 32; next <= 126; next++) {
      const pair = char + String.fromCharCode(next)
      const value = font.getKerningValue(glyph, font.charToGlyph(pair[1])) / font.unitsPerEm * 100
      if (value) kerning[pair] = value
    }
  }
  await writeFile(new URL('black-rush-outlines.json', out), JSON.stringify({ glyphs, kerning }))
}
