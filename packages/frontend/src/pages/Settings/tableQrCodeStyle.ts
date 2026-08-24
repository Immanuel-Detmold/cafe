import { Options } from 'qr-code-styling'

const COFFEE_DARK = '#3E2723'
const COFFEE_MID = '#6F4E37'
const CREAM = '#FBF3E7'

/** Round center badge with just the table number, drawn onto a canvas and embedded in the QR code. */
const buildCenterImage = (tableNumber: string): string => {
  const size = 240
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = COFFEE_DARK
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const numberFontSize = tableNumber.length > 2 ? 84 : 116
  ctx.font = `bold ${numberFontSize}px "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(tableNumber, size / 2, size / 2)

  return canvas.toDataURL('image/png')
}

/** Café-themed QR options: brown gradient modules, cream background, table number badge in the center. */
export const buildTableQrOptions = (
  tableNumber: string,
  url: string,
): Partial<Options> => ({
  width: 320,
  height: 320,
  type: 'canvas',
  data: url,
  image: buildCenterImage(tableNumber),
  margin: 8,
  qrOptions: { errorCorrectionLevel: 'H' },
  imageOptions: {
    imageSize: 0.4,
    margin: 6,
    hideBackgroundDots: true,
  },
  dotsOptions: {
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: COFFEE_DARK },
        { offset: 1, color: COFFEE_MID },
      ],
    },
  },
  cornersSquareOptions: { type: 'extra-rounded', color: COFFEE_DARK },
  cornersDotOptions: { type: 'dot', color: COFFEE_MID },
  backgroundOptions: { color: CREAM },
})
