import * as v1 from './v1.js'
import * as v2 from './v2.js'

const versiones = [v1, v2]

export function parseFlags(args = []) {
  return v1.parseFlags(args)
}

export async function isImage(buffer) {
  return v1.isImage(buffer)
}

export async function applyTransformation(buffer, shapes = [], effects = []) {
  let resultado = buffer
  const pendingShapes = [...shapes]
  const pendingEffects = [...effects]

  for (const [idx, v] of versiones.entries()) {
    const supported = v.SUPPORTED || { shapes: [], effects: [] }
    const myShapes  = pendingShapes.filter(s  => supported.shapes.includes(s))
    const myEffects = pendingEffects.filter(e => supported.effects.includes(e))

    if (!myShapes.length && !myEffects.length) continue

    try {
      resultado = await v.applyTransformation(resultado, myShapes, myEffects)
      myShapes.forEach(s => { const i = pendingShapes.indexOf(s);  if (i !== -1) pendingShapes.splice(i, 1) })
      myEffects.forEach(e => { const i = pendingEffects.indexOf(e); if (i !== -1) pendingEffects.splice(i, 1) })
    } catch (e) {
      console.warn(`[sharp v${idx + 1}] falló: ${e.message}`)
    }
  }

  if (pendingShapes.length) console.warn('[sharp] Sin soporte para formas:', pendingShapes)
  if (pendingEffects.length) console.warn('[sharp] Sin soporte para efectos:', pendingEffects)

  return resultado
}

export { FLAG_MAP, SUPPORTED } from './v1.js'
    
