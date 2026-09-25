import sharp from 'sharp'

// First render the supplied PDF with render-venue.swift (preserves Korean fonts).
const source = process.argv[2] ?? 'tmp/pdfs/the-link-directions-quartz.png'
await sharp(source).webp({ lossless:true, effort:6 }).toFile('public/images/draft/venue-directions.webp')
console.log('Prepared lossless venue directions image.')
