import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const source = new URL('../public/icons/heart.svg', import.meta.url)
const png = await sharp(source.pathname).resize(32, 32).png().toBuffer()
await writeFile(new URL('../public/icons/heart-32.png', import.meta.url), png)
await sharp(source.pathname).resize(140, 140)
  .extend({ top:20, bottom:20, left:20, right:20, background:'#F4F4F0' })
  .flatten({ background:'#F4F4F0' }).png()
  .toFile(new URL('../public/icons/apple-touch-icon.png', import.meta.url).pathname)

// ICO container with a 32px PNG payload for older browser tab/bookmark support.
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header[6] = header[7] = 32
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(22, 18)
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, png]))
