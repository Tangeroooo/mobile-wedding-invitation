import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

// Deterministic thumbnail sizing only; keep the original couple photograph.
// Centre crop keeps both faces together inside square and landscape link cards.
const out = new URL('../public/images/share/', import.meta.url)
await mkdir(out, { recursive:true })
for (const edition of ['main', 'a', 'b']) {
  await sharp(new URL('../public/images/draft/intro-1400.webp', import.meta.url).pathname)
    .resize(1200, 630, { fit:'cover', position:'centre' })
    .jpeg({ quality:88, mozjpeg:true })
    .toFile(new URL(`wedding-${edition}.jpg`, out).pathname)
}
