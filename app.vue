<script setup lang="ts">
const themeStore = useThemeStore()
const colorMode = useColorMode()

onMounted(() => {
  themeStore.hydrate()
})
</script>

<template>
  <div
    :data-palette="themeStore.themePalette"
    :class="{ dark: colorMode.value === 'dark' }"
    class="min-h-screen transition-colors"
    style="background-color: var(--cb-bg); color: var(--cb-text)"
  >
    <NuxtPage />
  </div>
</template>
