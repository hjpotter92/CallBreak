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

const handsWon = ref<Record<string, number>>({})
const error = ref('')

onMounted(() => {
  gameStore.players.forEach((p) => (handsWon.value[p.id] = 0))
})

const handsSum = computed(() =>
  Object.values(handsWon.value).reduce((a, b) => a + (b ?? 0), 0)
)

const canSubmit = computed(() => handsSum.value === 13)

const handleHandsWheel = useNumberInputWheel(0, 13)

function onHandsWheel(e: WheelEvent, playerId: string) {
  handleHandsWheel(e, () => handsWon.value[playerId] ?? 0, (v) => (handsWon.value[playerId] = v))
}

function submit() {
  error.value = ''
  const result = gameStore.completeRound(handsWon.value)
  if (result.ok) {
    emit('submitted')
  } else {
    error.value = result.error ?? 'Invalid hands won'
  }
}
</script>

<template>
  <div class="space-y-6">
    <h2
      class="text-2xl font-semibold"
      style="color: var(--cb-accent)"
    >
      Round {{ gameStore.totalRounds }} - Hands Won
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
            v-model.number="handsWon[player.id]"
            type="number"
            min="0"
            max="13"
            size="lg"
            class="flex-1"
            @wheel="onHandsWheel($event, player.id)"
          />
          <span class="text-sm opacity-80">Won (0–13)</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <UButton
        size="lg"
        :disabled="!canSubmit"
        @click="submit"
      >
        Complete Round
      </UButton>
      <p
        v-if="handsSum !== 13"
        class="text-sm text-red-500"
      >
        Total hands won must equal 13. Current sum: {{ handsSum }}.
      </p>
      <UAlert v-if="error" color="red" :title="error" />
    </div>
  </div>
</template>
