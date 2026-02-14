<script setup lang="ts">
import type { ThemePalette } from '~/stores/theme'

const themeStore = useThemeStore()
const colorMode = useColorMode()

const palettes: { value: ThemePalette; label: string; emoji: string }[] = [
  { value: 'classic', label: '🃏 Classic', emoji: '🃏' },
  { value: 'slate', label: '🪨 Slate', emoji: '🪨' },
  { value: 'amber', label: '🍯 Amber', emoji: '🍯' },
  { value: 'ocean', label: '🌊 Ocean', emoji: '🌊' },
]

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="flex items-center gap-2">
    <USelectMenu
      :model-value="themeStore.themePalette"
      :options="palettes"
      value-attribute="value"
      class="w-40"
      @update:model-value="themeStore.setThemePalette"
    >
      <template #leading>
        <span class="text-lg">{{ palettes.find(p => p.value === themeStore.themePalette)?.emoji ?? '🎨' }}</span>
      </template>
    </USelectMenu>
    <UButton
      :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
      variant="ghost"
      size="sm"
      aria-label="Toggle dark mode"
      @click="toggleDark"
    />
  </div>
</template>
