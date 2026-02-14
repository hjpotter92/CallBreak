import { defineStore } from 'pinia'

const THEME_KEY = 'callbreak-theme-palette'

export type ThemePalette = 'classic' | 'slate' | 'amber' | 'ocean'

interface ThemeState {
  themePalette: ThemePalette
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    themePalette: 'classic',
  }),
  actions: {
    setThemePalette(palette: ThemePalette) {
      this.themePalette = palette
      if (import.meta.client) {
        localStorage.setItem(THEME_KEY, palette)
      }
    },
    hydrate() {
      if (import.meta.client) {
        const saved = localStorage.getItem(THEME_KEY) as ThemePalette | null
        if (saved && ['classic', 'slate', 'amber', 'ocean'].includes(saved)) {
          this.themePalette = saved
        }
      }
    },
  },
})
