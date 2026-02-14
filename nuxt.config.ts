// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  output: 'static',
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2025-02-15',
  modules: ['@nuxt/ui', '@nuxtjs/color-mode', '@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  css: ['~/assets/css/themes.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Call Break Score Tracker',
      meta: [{ name: 'description', content: 'Track Call Break card game scores' }],
    },
  },
})
