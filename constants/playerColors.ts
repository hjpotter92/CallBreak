export const PLAYER_COLORS = [
  { id: 'red', bg: '#ef4444', text: '#ffffff' },
  { id: 'blue', bg: '#3b82f6', text: '#ffffff' },
  { id: 'green', bg: '#22c55e', text: '#ffffff' },
  { id: 'amber', bg: '#f59e0b', text: '#ffffff' },
  { id: 'purple', bg: '#a855f7', text: '#ffffff' },
  { id: 'teal', bg: '#14b8a6', text: '#ffffff' },
  { id: 'pink', bg: '#ec4899', text: '#ffffff' },
  { id: 'indigo', bg: '#6366f1', text: '#ffffff' },
  { id: 'orange', bg: '#f97316', text: '#ffffff' },
  { id: 'cyan', bg: '#06b6d4', text: '#ffffff' },
  { id: 'emerald', bg: '#10b981', text: '#ffffff' },
  { id: 'rose', bg: '#f43f5e', text: '#ffffff' },
  { id: 'violet', bg: '#8b5cf6', text: '#ffffff' },
  { id: 'sky', bg: '#0ea5e9', text: '#ffffff' },
  { id: 'lime', bg: '#84cc16', text: '#1a1a1a' },
  { id: 'fuchsia', bg: '#d946ef', text: '#ffffff' },
  { id: 'slate', bg: '#64748b', text: '#ffffff' },
  { id: 'stone', bg: '#78716c', text: '#ffffff' },
  { id: 'zinc', bg: '#71717a', text: '#ffffff' },
  { id: 'neutral', bg: '#737373', text: '#ffffff' },
] as const

export type PlayerColorId = (typeof PLAYER_COLORS)[number]['id']

export function getDefaultPlayerColor(used: string[]): string {
  const available = PLAYER_COLORS.filter((c) => !used.includes(c.id))
  const pool = available.length > 0 ? available : [...PLAYER_COLORS]
  return pool[Math.floor(Math.random() * pool.length)].id
}

export function getColorById(id: string) {
  return PLAYER_COLORS.find((c) => c.id === id) ?? PLAYER_COLORS[0]
}
