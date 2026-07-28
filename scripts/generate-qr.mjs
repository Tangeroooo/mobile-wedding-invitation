import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const invitationUrl =
  'https://tangeroooo.github.io/mobile-wedding-invitation/'
const outputDirectory = new URL('../public/qr/', import.meta.url)

await mkdir(outputDirectory, { recursive: true })

await Promise.all([
  QRCode.toFile(
    fileURLToPath(new URL('wedding-invitation-qr.png', outputDirectory)),
    invitationUrl,
    {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 1600,
      color: {
        dark: '#171817',
        light: '#FFFFFF',
      },
    },
  ),
  QRCode.toFile(
    fileURLToPath(new URL('wedding-invitation-qr.svg', outputDirectory)),
    invitationUrl,
    {
      errorCorrectionLevel: 'H',
      margin: 4,
      type: 'svg',
      color: {
        dark: '#171817',
        light: '#FFFFFF',
      },
    },
  ),
])

console.log(`QR codes created for ${invitationUrl}`)
