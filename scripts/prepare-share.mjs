import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

// Deterministic thumbnail sizing only; keep the original couple photograph.
// Frame the seated couple above centre so neither face is clipped by the card.
const out = new URL('../public/images/share/', import.meta.url)
await mkdir(out, { recursive:true })
const source = new URL('../public/images/draft/main-1400.webp', import.meta.url).pathname
const { width, height } = await sharp(source).metadata()
const cropHeight = Math.round(width * 630 / 1200)
const top = Math.min(Math.round(height * .22), height - cropHeight)
for (const edition of ['main', 'a', 'b']) {
  await sharp(source)
    .extract({ left:0, top, width, height:cropHeight })
    .resize(1200, 630)
    .jpeg({ quality:88, mozjpeg:true })
    .toFile(new URL(`wedding-${edition}.jpg`, out).pathname)
}
