<script setup lang="ts">
import type { Player } from '~/stores/game'
import { getColorById } from '~/constants/playerColors'

const gameStore = useGameStore()

function playerColor(player: Player) {
  return getColorById(player.color ?? 'red').bg
}

const emit = defineEmits<{
  submitted: []
}>()

const bets = ref<Record<string, number>>({})
const error = ref('')

onMounted(() => {
  gameStore.players.forEach((p) => (bets.value[p.id] = 0))
})

const bidSum = computed(() =>
  Object.values(bets.value).reduce((a, b) => a + (b ?? 0), 0)
)

const canSubmit = computed(() => {
  const sum = bidSum.value
  if (sum < 10) return false
  return Object.values(bets.value).every((v) => v >= 2 && v <= 13)
})

const validationMessage = computed(() => {
  if (bidSum.value < 10) {
    return `Total bets must be 10 or more. Current sum: ${bidSum.value}.`
  }
  const invalid = Object.values(bets.value).find((v) => v < 2 || v > 13)
  if (invalid !== undefined) return 'Each bid must be 2–13.'
  return ''
})

function submit() {
  error.value = ''
  const result = gameStore.startRound(bets.value)
  if (result.ok) {
    emit('submitted')
  } else {
    error.value = result.error ?? 'Invalid bids'
  }
}
</script>

<template>
  <div class="space-y-6">
    <h2
      class="text-2xl font-semibold"
      style="color: var(--cb-accent)"
    >
      Round {{ gameStore.totalRounds + 1 }} - Enter Bets
    </h2>

    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div
        v-for="player in gameStore.players"
        :key="player.id"
        class="flex flex-col items-center rounded-xl p-5 border-l-4"
        :style="{ backgroundColor: 'var(--cb-surface)', borderLeftColor: playerColor(player) }"
      >
        <span v-if="player.emoji" class="mb-2 text-3xl">{{ player.emoji }}</span>
        <span class="mb-3 font-medium">{{ player.name }}</span>
        <div class="flex w-full items-center justify-between gap-3">
          <UInput
            v-model.number="bets[player.id]"
            type="number"
            min="0"
            max="13"
            size="lg"
            class="flex-1"
          />
          <span class="text-sm opacity-80">Bid (2–13)</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <UButton
        size="lg"
        :disabled="!canSubmit"
        @click="submit"
      >
        Start Round
      </UButton>
      <p
        v-if="validationMessage"
        class="text-sm text-red-500"
      >
        {{ validationMessage }}
      </p>
      <UAlert v-if="error" color="red" :title="error" />
    </div>
  </div>
</template>
