<script setup lang="ts">
import type { Player, RoundData } from '~/stores/game'
import { getColorById } from '~/constants/playerColors'

const gameStore = useGameStore()

function playerColor(player: Player) {
  return getColorById(player.color ?? 'red').bg
}

const expandedRound = ref<number | null>(null)

const totals = computed(() => gameStore.totals)

function toggleRoundDetail(roundIndex: number) {
  expandedRound.value = expandedRound.value === roundIndex ? null : roundIndex
}

function getCellLabel(round: RoundData, playerId: string) {
  const bid = round.bets[playerId] ?? '-'
  const won = round.handsWon[playerId] ?? '-'
  return `${bid}→${won}`
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold">Scores</h3>

    <!-- Running totals -->
    <div class="flex flex-wrap gap-3">
      <div
        v-for="player in gameStore.players"
        :key="player.id"
        class="rounded-lg px-4 py-2 border-l-4"
        :style="{ backgroundColor: 'var(--cb-surface)', borderLeftColor: playerColor(player) }"
      >
        <span v-if="player.emoji" class="mr-1">{{ player.emoji }}</span>
        <span class="font-medium">{{ player.name }}:</span>
        <span class="ml-1 font-bold" :style="{ color: playerColor(player) }">
          {{ totals[player.id] ?? 0 }}
        </span>
      </div>
    </div>

    <!-- Round breakdown -->
    <div v-if="gameStore.rounds.length" class="space-y-2">
      <h4 class="text-sm font-medium opacity-80">Round breakdown</h4>
      <div class="space-y-1">
        <button
          v-for="round in gameStore.rounds"
          :key="round.roundIndex"
          class="w-full rounded-lg p-3 text-left transition-colors hover:opacity-90"
          style="background-color: var(--cb-surface)"
          @click="toggleRoundDetail(round.roundIndex)"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-medium">Round {{ round.roundIndex }}</span>
            <div class="flex flex-wrap gap-4">
              <span
                v-for="player in gameStore.players"
                :key="player.id"
                class="flex items-center gap-1"
              >
                <span
                  v-if="player.emoji"
                  class="text-sm"
                  :style="{ color: playerColor(player) }"
                >{{ player.emoji }}</span>
                <UTooltip :text="`Bid: ${round.bets[player.id] ?? '-'}, Won: ${round.handsWon[player.id] ?? '-'}`">
                  <span class="text-sm">
                    {{ getCellLabel(round, player.id) }}
                    <span
                      class="ml-0.5 font-medium"
                      :style="{ color: playerColor(player) }"
                    >
                      ({{ round.scores[player.id] ?? 0 }})
                    </span>
                  </span>
                </UTooltip>
              </span>
            </div>
          </div>

          <!-- Expanded detail -->
          <div
            v-if="expandedRound === round.roundIndex"
            class="mt-3 grid grid-cols-2 gap-2 border-t pt-3 sm:grid-cols-4"
          >
            <div
              v-for="player in gameStore.players"
              :key="player.id"
              class="rounded p-2 text-sm border-l-4"
              :style="{ backgroundColor: 'var(--cb-bg)', borderLeftColor: playerColor(player) }"
            >
              <div class="font-medium">{{ player.emoji }} {{ player.name }}</div>
              <div>Bid: {{ round.bets[player.id] ?? '-' }}</div>
              <div>Won: {{ round.handsWon[player.id] ?? '-' }}</div>
              <div :style="{ color: playerColor(player) }">
                Score: {{ round.scores[player.id] ?? 0 }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
