<script setup lang="ts">
import { getColorById } from '~/constants/playerColors'

const gameStore = useGameStore()

onMounted(() => {
  gameStore.hydrate()
})

const step = computed(() => {
  if (!gameStore.matchStarted) return 'setup'
  const rounds = gameStore.rounds
  if (rounds.length === 0) return 'bet'
  const last = rounds[rounds.length - 1]
  const hasHandsWon = Object.keys(last.handsWon ?? {}).length > 0
  return hasHandsWon ? 'bet' : 'hands'
})

const showHistory = ref(false)
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3"
      style="background-color: var(--cb-surface); border-color: var(--cb-accent)"
    >
      <h1 class="text-lg font-bold">Call Break</h1>
      <div class="flex items-center gap-4">
        <UButton
          v-if="gameStore.matchStarted"
          variant="ghost"
          size="sm"
          @click="gameStore.newMatch"
        >
          New Match
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          @click="showHistory = true"
        >
          Past Matches
        </UButton>
        <ThemeSelector />
      </div>
    </header>

    <div class="flex flex-col gap-6 p-4 md:flex-row">
      <!-- Sidebar: scores (desktop) -->
      <aside
        v-if="gameStore.matchStarted"
        class="hidden w-64 shrink-0 md:block"
      >
        <div class="sticky top-20 rounded-lg p-4" style="background-color: var(--cb-surface)">
          <ScoreSummary />
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1">
        <!-- Step indicator -->
        <div v-if="gameStore.matchStarted" class="mb-4 flex gap-2 text-sm">
          <span
            :class="step === 'bet' ? 'font-semibold' : 'opacity-60'"
            :style="step === 'bet' ? { color: 'var(--cb-accent)' } : {}"
          >
            Enter bets
          </span>
          <span class="opacity-40">→</span>
          <span
            :class="step === 'hands' ? 'font-semibold' : 'opacity-60'"
            :style="step === 'hands' ? { color: 'var(--cb-accent)' } : {}"
          >
            Enter results
          </span>
        </div>

        <!-- Setup -->
        <div v-if="step === 'setup'" class="max-w-2xl">
          <PlayerSetupForm />
        </div>

        <!-- Bet entry -->
        <BetEntryForm
          v-else-if="step === 'bet'"
          @submitted="() => {}"
        />

        <!-- Hands won -->
        <HandsWonForm
          v-else-if="step === 'hands'"
          @submitted="() => {}"
        />

        <!-- After round: summary + actions -->
        <div v-if="gameStore.matchStarted && step === 'bet' && gameStore.rounds.length > 0" class="mt-6 flex flex-wrap gap-3">
          <UButton
            variant="outline"
            @click="gameStore.finishMatch"
          >
            Finish Match
          </UButton>
        </div>

        <!-- Winner banner -->
        <UAlert
          v-if="gameStore.winner"
          color="success"
          class="mt-4"
        >
          <template #title>
            <span
              v-if="gameStore.winner"
              :style="{ color: getColorById(gameStore.winner.color ?? 'red').bg }"
            >
              {{ gameStore.winner.emoji ?? '' }} {{ gameStore.winner.name }} wins!
            </span>
          </template>
        </UAlert>
      </main>
    </div>

    <!-- Mobile score button -->
    <ScoreSheetMobile />

    <!-- Match history modal -->
    <UModal v-model="showHistory">
      <div class="p-4">
        <div class="mb-4 flex justify-end">
          <UButton icon="i-heroicons-x-mark" variant="ghost" aria-label="Close" @click="showHistory = false" />
        </div>
        <MatchHistory @close="showHistory = false" />
      </div>
    </UModal>
  </div>
</template>
