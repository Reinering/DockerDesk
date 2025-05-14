import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', {
  state: () => ({
    lang: '',

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
    paths: ['lang']
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
