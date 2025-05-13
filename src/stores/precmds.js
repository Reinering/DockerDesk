import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, reactive } from 'vue'


export const usePreCmdsStore = defineStore('precmds', {
  state: () => ({
    isSync: ref("0"),
    option: ref(''),
    preCmds: reactive({}),
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
      this.option = ref('0'),
      this.preCmds = reactive({})
    }
  },


  persist: {
    storage: sessionStorage,
    paths: ['preCmds']
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreCmdsStore, import.meta.hot))
}
