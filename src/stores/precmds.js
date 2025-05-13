import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, reactive } from 'vue'


export const usePreCmdsStore = defineStore('precmds', {
  state: () => ({
    isSync: ref("0"),
    option: ref(''),
    preCmds: reactive({}),

    isSudo: ref(false),
    isSendNow: ref(false),
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
      this.option = ref(''),
      this.preCmds = reactive({})
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
