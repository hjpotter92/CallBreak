<script setup lang="ts">
import type { Match, Player } from '~/stores/game'
import { getColorById } from '~/constants/playerColors'

const emit = defineEmits<{ close: [] }>()
const gameStore = useGameStore()

function playerColor(player: Player) {
  return getColorById(player.color ?? 'red').bg
}
const selectedMatch = ref<Match | null>(null)
const showDetail = computed({
  get: () => !!selectedMatch.value,
  set: (v) => { if (!v) selectedMatch.value = null },
})

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function selectMatch(m: Match) {
  selectedMatch.value = m
}

function closeDetail() {
  selectedMatch.value = null
}

function removeMatch(m: Match) {
  gameStore.removeMatchFromHistory(m.id)
  closeDetail()
}

function resumeMatch(m: Match) {
  gameStore.resumeMatch(m)
  closeDetail()
  emit('close')
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Past Matches</h2>

    <div v-if="!gameStore.matchHistory.length" class="rounded-lg p-6 text-center opacity-70">
      No completed matches yet.
    </div>

    <div v-else class="space-y-2">
      <button
        v-for="match in gameStore.matchHistory"
        :key="match.id"
        class="w-full rounded-lg p-4 text-left transition-colors hover:opacity-90"
        style="background-color: var(--cb-surface)"
        @click="selectMatch(match)"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-sm opacity-70">{{ formatDate(match.timestamp) }}</span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="p in match.players"
              :key="p.id"
              class="rounded-lg border-l-4 px-2 py-1 text-sm"
              :style="{ backgroundColor: 'var(--cb-surface)', borderLeftColor: playerColor(p), color: 'inherit' }"
            >
              <span :style="{ color: playerColor(p), fontWeight: '600' }">{{ p.emoji }} {{ p.name }}:</span> {{ match.finalTotals[p.id] ?? 0 }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Detail modal -->
    <UModal v-model="showDetail">
      <div v-if="selectedMatch" class="max-h-[80vh] overflow-y-auto p-4">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              Match — {{ formatDate(selectedMatch.timestamp) }}
            </h3>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-play"
                variant="soft"
                size="sm"
                @click="resumeMatch(selectedMatch)"
              >
                Resume
              </UButton>
              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
                color="red"
                size="sm"
                aria-label="Remove match"
                @click="removeMatch(selectedMatch)"
              />
              <UButton icon="i-heroicons-x-mark" variant="ghost" @click="closeDetail" />
            </div>
          </div>
          <div class="mb-4 flex flex-wrap gap-3">
            <div
              v-for="p in selectedMatch.players"
              :key="p.id"
              class="rounded-lg px-3 py-2 border-l-4"
              :style="{ backgroundColor: 'var(--cb-surface)', borderLeftColor: playerColor(p) }"
            >
              {{ p.emoji }} {{ p.name }}: <span :style="{ color: playerColor(p), fontWeight: 'bold' }">{{ selectedMatch.finalTotals[p.id] ?? 0 }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium">Rounds</h4>
            <div
              v-for="r in selectedMatch.rounds"
              :key="r.roundIndex"
              class="rounded-lg p-3"
              style="background-color: var(--cb-surface)"
            >
              <div class="mb-2 font-medium">Round {{ r.roundIndex }}</div>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div
                  v-for="p in selectedMatch.players"
                  :key="p.id"
                  class="rounded p-2 text-sm border-l-4"
                  :style="{ backgroundColor: 'var(--cb-bg)', borderLeftColor: playerColor(p) }"
                >
                  {{ p.emoji }} {{ p.name }}: {{ r.bets[p.id] ?? '-' }}→{{ r.handsWon[p.id] ?? '-' }}
                  (<span :style="{ color: playerColor(p), fontWeight: '600' }">{{ r.scores[p.id] ?? 0 }}</span>)
                </div>
              </div>
            </div>
          </div>
        </div>
    </UModal>
  </div>
</template>
