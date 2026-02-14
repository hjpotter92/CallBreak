import { defineStore } from 'pinia'
import { getRandomUnusedEmoji } from '~/constants/playerEmojis'
import { getDefaultPlayerColor } from '~/constants/playerColors'
import { calculateRoundScore } from '~/composables/useCallBreakScore'

const GAME_KEY = 'callbreak-game-state'
const HISTORY_KEY = 'callbreak-match-history'

export interface Player {
  id: string
  name: string
  emoji?: string
  color?: string
}

export interface RoundData {
  roundIndex: number
  bets: Record<string, number>
  handsWon: Record<string, number>
  scores: Record<string, number>
}

export interface Match {
  id: string
  players: Player[]
  rounds: RoundData[]
  finalTotals: Record<string, number>
  timestamp: number
}

interface GameState {
  players: Player[]
  rounds: RoundData[]
  currentRound: number
  matchStarted: boolean
  matchHistory: Match[]
  targetScore: number | null
}

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6
const MIN_BID = 2
const MAX_BID = 13
const CARDS_PER_ROUND = 13
const MIN_BID_SUM = 10

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    players: [],
    rounds: [],
    currentRound: 0,
    matchStarted: false,
    matchHistory: [],
    targetScore: 200,
  }),
  getters: {
    playerIds: (state) => state.players.map((p) => p.id),
    totalRounds: (state) => state.rounds.length,
    currentRoundData: (state) =>
      state.rounds[state.currentRound] ?? null,
    totals: (state): Record<string, number> => {
      const t: Record<string, number> = {}
      state.players.forEach((p) => (t[p.id] = 0))
      state.rounds.forEach((r) => {
        Object.entries(r.scores).forEach(([id, s]) => {
          t[id] = (t[id] ?? 0) + s
        })
      })
      return t
    },
    winner: (state, getters): Player | null => {
      const target = state.targetScore
      if (!target) return null
      const totals = getters.totals as Record<string, number>
      const over = state.players.filter((p) => (totals[p.id] ?? 0) >= target)
      return over.length === 1 ? over[0] : null
    },
  },
  actions: {
    addPlayer(name: string, emoji?: string, color?: string) {
      if (this.players.length >= MAX_PLAYERS) return
      const id = crypto.randomUUID()
      const usedEmojis = this.players.map((p) => p.emoji).filter(Boolean) as string[]
      const usedColors = this.players.map((p) => p.color).filter(Boolean) as string[]
      const defaultEmoji = emoji ?? getRandomUnusedEmoji(usedEmojis)
      const defaultColor = color ?? getDefaultPlayerColor(usedColors)
      this.players.push({ id, name: name.trim() || `Player ${this.players.length + 1}`, emoji: defaultEmoji, color: defaultColor })
    },
    removePlayer(id: string) {
      this.players = this.players.filter((p) => p.id !== id)
    },
    updatePlayer(id: string, updates: Partial<Pick<Player, 'name' | 'emoji' | 'color'>>) {
      const p = this.players.find((x) => x.id === id)
      if (p) Object.assign(p, updates)
    },
    setTargetScore(score: number | null) {
      this.targetScore = score
    },
    startMatch() {
      if (this.players.length < MIN_PLAYERS) return false
      this.rounds = []
      this.currentRound = 0
      this.matchStarted = true
      this.persist()
      return true
    },
    startRound(bets: Record<string, number>) {
      const sum = Object.values(bets).reduce((a, b) => a + b, 0)
      if (sum < MIN_BID_SUM) return { ok: false, error: `Sum of bids must be ≥ ${MIN_BID_SUM}` }
      const invalid = Object.entries(bets).find(
        ([_, v]) => v < MIN_BID || v > MAX_BID
      )
      if (invalid) return { ok: false, error: `Each bid must be ${MIN_BID}–${MAX_BID}` }
      const round: RoundData = {
        roundIndex: this.rounds.length + 1,
        bets: { ...bets },
        handsWon: {},
        scores: {},
      }
      this.rounds.push(round)
      this.persist()
      return { ok: true }
    },
    completeRound(handsWon: Record<string, number>) {
      const round = this.rounds[this.rounds.length - 1]
      if (!round) return { ok: false, error: 'No active round' }
      const sum = Object.values(handsWon).reduce((a, b) => a + b, 0)
      if (sum !== CARDS_PER_ROUND)
        return { ok: false, error: `Hands won must sum to ${CARDS_PER_ROUND}` }
      const invalid = Object.values(handsWon).find((v) => v < 0 || v > MAX_BID)
      if (invalid !== undefined)
        return { ok: false, error: 'Each hands won must be 0–13' }
      round.handsWon = { ...handsWon }
      this.playerIds.forEach((id) => {
        const bet = round.bets[id] ?? 0
        const won = round.handsWon[id] ?? 0
        round.scores[id] = calculateRoundScore(bet, won)
      })
      this.currentRound = this.rounds.length
      this.persist()
      return { ok: true }
    },
    nextRound() {
      this.currentRound = this.rounds.length
      this.persist()
    },
    finishMatch() {
      const match: Match = {
        id: crypto.randomUUID(),
        players: [...this.players],
        rounds: [...this.rounds],
        finalTotals: { ...this.totals },
        timestamp: Date.now(),
      }
      this.matchHistory.unshift(match)
      this.players = []
      this.rounds = []
      this.currentRound = 0
      this.matchStarted = false
      this.persist()
      this.persistHistory()
    },
    newMatch() {
      this.players = []
      this.rounds = []
      this.currentRound = 0
      this.matchStarted = false
      this.persist()
    },
    removeMatchFromHistory(matchId: string) {
      this.matchHistory = this.matchHistory.filter((m) => m.id !== matchId)
      this.persistHistory()
    },
    resumeMatch(match: Match) {
      this.players = [...match.players]
      this.rounds = [...match.rounds]
      this.currentRound = match.rounds.length
      this.matchStarted = true
      this.matchHistory = this.matchHistory.filter((m) => m.id !== match.id)
      this.persist()
      this.persistHistory()
    },
    persist() {
      if (import.meta.client) {
        const data = {
          players: this.players,
          rounds: this.rounds,
          currentRound: this.currentRound,
          matchStarted: this.matchStarted,
          targetScore: this.targetScore,
        }
        localStorage.setItem(GAME_KEY, JSON.stringify(data))
      }
    },
    persistHistory() {
      if (import.meta.client) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.matchHistory))
      }
    },
    hydrate() {
      if (import.meta.client) {
        const raw = localStorage.getItem(GAME_KEY)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            this.players = data.players ?? []
            this.rounds = data.rounds ?? []
            this.currentRound = data.currentRound ?? 0
            this.matchStarted = data.matchStarted ?? false
            this.targetScore = data.targetScore ?? 200
          } catch (_) {}
        }
        const hist = localStorage.getItem(HISTORY_KEY)
        if (hist) {
          try {
            this.matchHistory = JSON.parse(hist)
          } catch (_) {}
        }
      }
    },
  },
})
