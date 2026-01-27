import { defineStore, acceptHMRUpdate } from 'pinia'


export const usePreCmdsStore = defineStore('precmds', {
  state: () => ({
    isSync: "0",
    option: '',
    preCmds: {},

    isSudo: false,
    isSendNow: false,
  }),

  getters: {
    showPreCmds: (state) => {
      return state.preCmds
    },
  },

  actions: {
    setPreCmds(data){
      this.preCmds = data
    },

    cleanPreCmds(){
      this.option = '',
      this.preCmds = {}
    }
  },

  persist: {
    storage: sessionStorage,
    paths: ['option', 'preCmds', 'isSudo', 'isSendNow'],
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreCmdsStore, import.meta.hot))
}
