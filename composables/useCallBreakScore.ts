/**
 * Custom Call Break scoring rules.
 * Evaluation order (first match wins):
 * - Bid ≥ 7 AND hands won ≥ 7 → 140 (flat)
 * - Hands won < bid (miss) → -10 × bid
 * - Hands won = bid (exact) → 10 × bid
 * - Exceed by 1 → 10 × bid + 1
 * - Exceed by 2 → 10 × bid + 2
 * - Exceed by 3+ → -10 × bid
 */
export function calculateRoundScore(bet: number, handsWon: number): number {
  if (bet >= 7 && handsWon >= 7) return 140
  if (handsWon < bet) return -10 * bet
  if (handsWon === bet) return 10 * bet
  const exceed = handsWon - bet
  if (exceed === 1) return 10 * bet + 1
  if (exceed === 2) return 10 * bet + 2
  return -10 * bet
}
