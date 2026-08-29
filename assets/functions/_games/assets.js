import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const Assets_Dir = path.join(__dirname, 'Assets')

export function getAvatarLoseAsset() {
  return path.join(Assets_Dir, 'avatar', 'avatar_lose.png')
}

export function getDefaultProfileAsset(gender = 'men') {
  const file = gender === 'girl' ? 'defect_girl.png' : 'defect_men.png'
  return path.join(Assets_Dir, 'avatar', 'profile', file)
}

export function getProfileAsset(gender = 'men', index = 1) {
  const clamped = Math.min(10, Math.max(1, index))
  const folder = gender === 'girl' ? 'girl' : 'men'
  const file = `pp_${folder}_${clamped}.png`
  return path.join(Assets_Dir, 'avatar', 'profile', folder, file)
}

export function getItemAsset(fileName) {
  return path.join(Assets_Dir, 'items', fileName)
}

export function getBookAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'books', fileName)
}

export function getCurrencyAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'currency', fileName)
}

export function getTicketAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'currency', 'tickets', fileName)
}

export function getFoodAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'food', fileName)
}

export function getMaterialAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'materials', fileName)
}

export function getPotionAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'potions', fileName)
}

export function getRareAsset(fileName) {
  return path.join(Assets_Dir, 'items', 'rares', fileName)
}

export function getCritAsset(fileName) {
  return path.join(Assets_Dir, 'crits', fileName)
}

export default {
  getAvatarLoseAsset, getDefaultProfileAsset, getProfileAsset,
  getItemAsset, getBookAsset, getCurrencyAsset, getTicketAsset,
  getFoodAsset, getMaterialAsset, getPotionAsset, getRareAsset,
  getCritAsset
}
