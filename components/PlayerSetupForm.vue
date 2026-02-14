<script setup lang="ts">
import type { Player } from '~/stores/game'
import { PLAYER_EMOJIS } from '~/constants/playerEmojis'
import { PLAYER_COLORS, getColorById } from '~/constants/playerColors'

const gameStore = useGameStore()

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6

const emit = defineEmits<{
  start: []
}>()

onMounted(() => {
  if (gameStore.players.length === 0) {
    gameStore.addPlayer('')
    gameStore.addPlayer('')
  }
})

function addPlayer() {
  gameStore.addPlayer('')
}

function removePlayer(id: string) {
  gameStore.removePlayer(id)
}

function updatePlayer(id: string, field: 'name' | 'emoji' | 'color', value: string) {
  if (field === 'name') gameStore.updatePlayer(id, { name: value })
  else if (field === 'emoji') gameStore.updatePlayer(id, { emoji: value })
  else gameStore.updatePlayer(id, { color: value })
}

function canStart() {
  const valid = gameStore.players.filter((p) => p.name.trim()).length
  return valid >= MIN_PLAYERS
}

function startMatch() {
  if (!canStart()) return
  gameStore.startMatch()
  emit('start')
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Player Setup</h2>
    <p class="text-sm opacity-80">
      Add {{ MIN_PLAYERS }}-{{ MAX_PLAYERS }} players. Each player needs a name.
    </p>

    <div class="flex items-center gap-2">
      <label class="text-sm">Target score (optional):</label>
      <UInput
        :model-value="gameStore.targetScore ?? ''"
        type="number"
        placeholder="e.g. 300"
        class="w-24"
        @update:model-value="(v) => gameStore.setTargetScore(v ? Number(v) : null)"
      />
    </div>

    <div class="space-y-3">
      <div
        v-for="(player, idx) in gameStore.players"
        :key="player.id"
        class="flex flex-wrap items-center gap-2 rounded-lg p-3 border-l-4"
        :style="{ backgroundColor: 'var(--cb-surface)', borderLeftColor: getColorById(player.color ?? 'red').bg }"
      >
        <span class="text-sm font-medium opacity-70">{{ idx + 1 }}.</span>
        <UPopover :popper="{ placement: 'bottom-start' }">
          <template #default="{ open }">
            <UButton
              color="gray"
              variant="outline"
              size="md"
              class="min-w-[3rem] h-10 px-3 text-xl"
              aria-label="Choose emoji"
            >
              {{ player.emoji ?? '😊' }}
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="ml-1 size-4 shrink-0 opacity-60"
                :class="open && 'rotate-180'"
              />
            </UButton>
          </template>
          <template #panel="{ close }">
            <div class="grid grid-cols-7 gap-1 p-2 max-h-48 overflow-y-auto">
              <button
                v-for="emoji of PLAYER_EMOJIS"
                :key="emoji"
                type="button"
                class="rounded p-2 text-xl transition hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                :class="{ 'ring-2 ring-primary-500 bg-gray-100 dark:bg-gray-700': player.emoji === emoji }"
                @click="updatePlayer(player.id, 'emoji', emoji); close()"
              >
                {{ emoji }}
              </button>
            </div>
          </template>
        </UPopover>
        <UPopover :popper="{ placement: 'bottom-start' }">
          <template #default="{ open }">
            <UButton
              color="gray"
              variant="outline"
              size="md"
              class="h-10 w-10 p-0"
              aria-label="Choose colour"
              :style="{
                backgroundColor: getColorById(player.color ?? 'red').bg,
                borderColor: getColorById(player.color ?? 'red').bg,
              }"
            >
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="size-4 shrink-0 text-white drop-shadow"
                :class="open && 'rotate-180'"
              />
            </UButton>
          </template>
          <template #panel="{ close }">
            <div class="grid grid-cols-5 gap-1 p-2">
              <button
                v-for="c in PLAYER_COLORS"
                :key="c.id"
                type="button"
                class="h-8 w-8 rounded-full transition focus:outline-none focus:ring-2 focus:ring-primary-500"
                :style="{ backgroundColor: c.bg }"
                :class="{ 'ring-2 ring-primary-500 ring-offset-2': player.color === c.id }"
                @click="updatePlayer(player.id, 'color', c.id); close()"
              />
            </div>
          </template>
        </UPopover>
        <UInput
          :model-value="player.name"
          placeholder="Player name"
          class="flex-1 min-w-32"
          @update:model-value="(v: string) => updatePlayer(player.id, 'name', v)"
        />
        <UButton
          v-if="gameStore.players.length > MIN_PLAYERS"
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          size="sm"
          @click="removePlayer(player.id)"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <UButton
        v-if="gameStore.players.length < MAX_PLAYERS"
        icon="i-heroicons-plus"
        variant="outline"
        @click="addPlayer"
      >
        Add Player
      </UButton>
      <UButton
        :disabled="!canStart()"
        @click="startMatch"
      >
        Start Match
      </UButton>
    </div>
  </div>
</template>
