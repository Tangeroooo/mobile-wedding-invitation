import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'

// Publish web-sized, metadata-free derivatives, never the camera originals.
const destination = new URL('../public/images/draft/gallery/', import.meta.url)
await mkdir(destination, { recursive:true })
let thumbnailBytes = 0, viewerBytes = 0, originalBytes = 0
const allPhotos = Array.from({ length:25 }, (_, index) => String(index + 1))
  .flatMap(id => id === '21' ? [id, '21-1', '21-2'] : [id])
const requested = process.argv.slice(2)
if (requested.some(id => !allPhotos.includes(id))) throw new Error('Unknown gallery photo ID')
for (const number of requested.length ? requested : allPhotos) {
  const source = new URL(`../images/${number}.jpg`, import.meta.url)
  originalBytes += (await stat(source)).size
  for (const width of [320, 1200]) {
    const result = await sharp(source.pathname).rotate()
      .resize({ width, withoutEnlargement:true })
      .webp({ quality:width === 320 ? 74 : 82, effort:5 })
      .toFile(new URL(`${String(number).padStart(2,'0')}-${width}.webp`, destination).pathname)
    if (width === 320) thumbnailBytes += result.size
    else viewerBytes += result.size
    console.log(`${number} / ${width}: ${Math.round(result.size / 1024)} KB`)
  }
}
console.log(JSON.stringify({originalBytes,thumbnailBytes,viewerBytes}))
