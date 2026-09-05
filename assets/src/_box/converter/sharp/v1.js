import sharp from 'sharp'

const SIZE = 512

const SVG_MASKS = {
  circle: `<svg width="${SIZE}" height="${SIZE}">
    <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="white"/>
  </svg>`,

  star: (() => {
    const cx = SIZE / 2, cy = SIZE / 2
    const outerR = SIZE * 0.48, innerR = SIZE * 0.2
    const pts = []
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR
      const angle = (i * Math.PI) / 5 - Math.PI / 2
      pts.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`)
    }
    return `<svg width="${SIZE}" height="${SIZE}">
      <polygon points="${pts.join(' ')}" fill="white"/>
    </svg>`
  })(),

  heart: `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 512 512">
    <path d="
      M256,440
      C256,440 60,300 60,180
      C60,110 110,70 180,70
      C216,70 256,100 256,100
      C256,100 296,70 332,70
      C402,70 452,110 452,180
      C452,300 256,440 256,440 Z
    " fill="white"/>
  </svg>`,

  hexagon: (() => {
    const pts = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const px = SIZE / 2 + Math.cos(angle) * SIZE * 0.48
      const py = SIZE / 2 + Math.sin(angle) * SIZE * 0.48
      pts.push(`${px},${py}`)
    }
    return `<svg width="${SIZE}" height="${SIZE}">
      <polygon points="${pts.join(' ')}" fill="white"/>
    </svg>`
  })(),

  triangle: (() => {
    const margin = SIZE * 0.06
    const top = `${SIZE / 2},${margin}`
    const left = `${margin},${SIZE - margin}`
    const right = `${SIZE - margin},${SIZE - margin}`
    return `<svg width="${SIZE}" height="${SIZE}">
      <polygon points="${top} ${left} ${right}" fill="white"/>
    </svg>`
  })(),
}

export const FLAG_MAP = {
  '-c': { type: 'shape', val: 'circle' },
  '-circle': { type: 'shape', val: 'circle' },
  '-e': { type: 'shape', val: 'star' },
  '-star': { type: 'shape', val: 'star' },
  '-co': { type: 'shape', val: 'heart' },
  '-heart': { type: 'shape', val: 'heart' },
  '-h': { type: 'shape', val: 'hexagon' },
  '-hex': { type: 'shape', val: 'hexagon' },
  '-hexagon': { type: 'shape', val: 'hexagon' },
  '-t': { type: 'shape', val: 'triangle' },
  '-tri': { type: 'shape', val: 'triangle' },
  '-triangle':{ type: 'shape', val: 'triangle' },
  '-d': { type: 'effect', val: 'blur' },
  '-blur': { type: 'effect', val: 'blur' },
  '-p': { type: 'effect', val: 'pixelate' },
  '-pixel': { type: 'effect', val: 'pixelate' },
  '-g': { type: 'effect', val: 'grayscale' },
  '-gray': { type: 'effect', val: 'grayscale' },
  '-bw': { type: 'effect', val: 'grayscale' },
  '-i': { type: 'effect', val: 'invert' },
  '-invert': { type: 'effect', val: 'invert' },
  '-v': { type: 'effect', val: 'flip' },
  '-flip': { type: 'effect', val: 'flip' },
}

export function parseFlags(args = []) {
  const shapes = new Set()
  const effects = new Set()
  const cleanArgs = []

  for (const arg of args) {
    const lower = arg.toLowerCase()
    if (FLAG_MAP[lower]) {
      const { type, val } = FLAG_MAP[lower]
      if (type === 'shape') shapes.add(val)
      else effects.add(val)
    } else {
      cleanArgs.push(arg)
    }
  }

  return {
    shapes: [...shapes],
    effects: [...effects],
    cleanArgs,
    hasFlags: shapes.size > 0 || effects.size > 0,
  }
}

export async function applyTransformation(buffer, shapes = [], effects = []) {
  let img = sharp(buffer).resize(SIZE, SIZE, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })

  for (const effect of effects) {
    switch (effect) {
      case 'grayscale':
        img = img.greyscale()
        break

      case 'invert':
        img = img.negate({ alpha: false })
        break

      case 'blur':
        img = img.blur(8)
        break

      case 'pixelate': {
        const pixelBuf = await img.png().toBuffer()
        img = sharp(pixelBuf)
          .resize(Math.floor(SIZE / 12), Math.floor(SIZE / 12), { fit: 'fill' })
          .resize(SIZE, SIZE, { fit: 'fill', kernel: sharp.kernel.nearest })
        break
      }

      case 'flip':
        img = img.flip()
        break
    }
  }

  const shape = shapes[0]
  if (shape && SVG_MASKS[shape]) {
    const imgBuf = await img.png().toBuffer()
    img = sharp(imgBuf).composite([{
      input: Buffer.from(SVG_MASKS[shape]),
      blend: 'dest-in',
    }])
  }

  return img.png().toBuffer()
}

export async function isImage(buffer) {
  try {
    const { fileTypeFromBuffer } = await import('file-type')
    const type = await fileTypeFromBuffer(buffer)
    if (!type) return false
    return type.mime.startsWith('image/') && type.mime !== 'image/gif'
  } catch {
    return false
  }
}

export const SUPPORTED = {
  shapes:  ['circle', 'star', 'heart', 'hexagon', 'triangle'],
  effects: ['grayscale', 'invert', 'blur', 'pixelate', 'flip'],
}
