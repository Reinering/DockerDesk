import { defineStore, acceptHMRUpdate } from 'pinia'


export const useConfigStore = defineStore('config', {
  state: () => ({
    lang: '',
    theme: 'dark',
    userMode: '',
    isShowCarousel: '',
    isShowSearchBar: ''
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
    paths: ['lang', 'theme', 'userMode'],
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
