import { defineStore, acceptHMRUpdate } from 'pinia'

export const useComponentsStore = defineStore('components', {
  state: () => ({
    refreshContainers: null,
  }),

  getters: {
  },

  actions: {

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useComponentsStore, import.meta.hot))
}
