import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useShortcutsStore = defineStore('config', {
  state: () => ({
    shortcutsData: null,
    shortcutsTemplate: 0
  }),

  getters: {

  },

  actions: {
    setLang(data){
      this.lang = data
    }
  },

  persist: {
    storage: localStorage,
    paths: ["shortcutsTemplate"],
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShortcutsStore, import.meta.hot))
}
