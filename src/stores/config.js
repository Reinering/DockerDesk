import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', {
  state: () => ({
    lang: '',
    theme: 'dark'

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
    paths: ['lang', 'theme'],
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
