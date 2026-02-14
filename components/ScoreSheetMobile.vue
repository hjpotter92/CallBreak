<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <div class="md:hidden">
    <UButton
      icon="i-heroicons-chart-bar"
      color="primary"
      size="lg"
      class="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      aria-label="View scores"
      @click="open = true"
    />
    <UModal v-model="open" :ui="{ width: 'max-w-md' }">
      <div class="p-4">
        <h3 class="mb-4 text-lg font-semibold">Scores</h3>
        <ScoreSummary />
      </div>
    </UModal>
  </div>
</template>
