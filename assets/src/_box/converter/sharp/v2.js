export const SUPPORTED = {
  shapes: [],
  effects: [],
}

export function parseFlags(args = []) {
  return { shapes: [], effects: [], cleanArgs: args, hasFlags: false }
}

export async function applyTransformation(buffer, shapes = [], effects = []) {
  throw new Error('v2: no implementado todavía')
}
