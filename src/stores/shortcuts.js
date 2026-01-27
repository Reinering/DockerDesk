import { defineStore, acceptHMRUpdate } from 'pinia'


export const useShortcutsStore = defineStore('shortcuts', {
  state: () => ({
    shortcutsData: null,
    shortcutsTemplate: 0,

    searchCache: [],
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
    paths: ["shortcutsTemplate", "searchCache"],
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShortcutsStore, import.meta.hot))
}
