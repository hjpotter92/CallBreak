export const PLAYER_EMOJIS = [
  '😊',
  '🐱',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🦁',
  '🐯',
  '🐸',
  '🐷',
  '🐶',
  '🐰',
  '🦄',
  '🐙',
  '🦋',
  '🌸',
  '⭐',
  '🌙',
  '☀️',
  '🎮',
  '🎯',
  '🎲',
  '🃏',
  '🍀',
  '🌈',
] as const

export type PlayerEmoji = (typeof PLAYER_EMOJIS)[number]

export function getRandomUnusedEmoji(used: string[]): string {
  const available = PLAYER_EMOJIS.filter((e) => !used.includes(e))
  const pool = available.length > 0 ? available : [...PLAYER_EMOJIS]
  return pool[Math.floor(Math.random() * pool.length)]
}
