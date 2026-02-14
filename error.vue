<script setup lang="ts">
const error = useError()

onMounted(() => {
  if (error.value) console.error('Nuxt error:', error.value)
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
    <h1 class="text-2xl font-bold text-red-600">
      {{ error?.statusCode ?? 500 }} — {{ error?.statusMessage ?? 'Error' }}
    </h1>
    <p v-if="error?.message" class="max-w-lg font-mono text-sm text-gray-600 dark:text-gray-400">
      {{ error.message }}
    </p>
    <UButton @click="handleError">Go home</UButton>
  </div>
</template>
