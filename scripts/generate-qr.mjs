import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import sharp from 'sharp'

const baseUrl = 'https://tangeroooo.github.io/mobile-wedding-invitation/'
const outputDirectory = new URL('../public/qr/', import.meta.url)

const companionInvitations = [
  {
    key: 'a',
    label: 'A',
    url: `${baseUrl}invitation-a/`,
    background: '#F8E9E1',
    accent: '#B85D43',
  },
  {
    key: 'b',
    label: 'B',
    url: `${baseUrl}invitation-b/`,
    background: '#E8EEF5',
    accent: '#3E6483',
  },
]

const qrOptions = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: {
    dark: '#171817',
    light: '#FFFFFF',
  },
}

function createLabelledQrCard(qrSvg, invitation) {
  const nestedQr = qrSvg.replace('<svg ', '<svg x="160" y="80" ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="2050" viewBox="0 0 1800 2050">
  <rect width="1800" height="2050" fill="#FFFFFF"/>
  ${nestedQr}
  <rect x="160" y="1640" width="1480" height="290" rx="48" fill="${invitation.background}"/>
  <circle cx="300" cy="1785" r="86" fill="${invitation.accent}"/>
  <text x="300" y="1822" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="108" font-weight="700" text-anchor="middle">${invitation.label}</text>
  <text x="430" y="1768" fill="#171817" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" letter-spacing="5">WEDDING INVITATION ${invitation.label}</text>
  <text x="430" y="1840" fill="#535754" font-family="Arial, Helvetica, sans-serif" font-size="38" letter-spacing="2">mobile-wedding-invitation/invitation-${invitation.key}</text>
</svg>`
}

await mkdir(outputDirectory, { recursive: true })

await Promise.all([
  QRCode.toFile(
    fileURLToPath(new URL('wedding-invitation-qr.png', outputDirectory)),
    baseUrl,
    { ...qrOptions, width: 1600 },
  ),
  QRCode.toFile(
    fileURLToPath(new URL('wedding-invitation-qr.svg', outputDirectory)),
    baseUrl,
    { ...qrOptions, width: 1600, type: 'svg' },
  ),
])

await Promise.all(
  companionInvitations.map(async (invitation) => {
    const qrSvg = await QRCode.toString(invitation.url, {
      ...qrOptions,
      width: 1480,
      type: 'svg',
    })
    const cardSvg = createLabelledQrCard(qrSvg, invitation)
    const filename = `wedding-invitation-${invitation.key}-qr`
    const svgPath = fileURLToPath(new URL(`${filename}.svg`, outputDirectory))
    const pngPath = fileURLToPath(new URL(`${filename}.png`, outputDirectory))

    await Promise.all([
      writeFile(svgPath, cardSvg),
      sharp(Buffer.from(cardSvg)).png().toFile(pngPath),
    ])
  }),
)

console.log(`QR codes created for ${baseUrl}`)
for (const invitation of companionInvitations) {
  console.log(`QR ${invitation.label}: ${invitation.url}`)
}
