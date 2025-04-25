import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, reactive } from 'vue'

export const useNavigatorStore = defineStore('navigator', {
  state: () => ({
    mainUri: ref(''),
    naviItems: reactive({}),
    lastNaviItem: reactive({})
  }),

  getters: {
    showMainUri: (state) => {
      return state.mainUri
    },

    showNaviItems: (state) => {
      return state.naviItems
    },

    showLastNaviItem: (state) => {
      return state.lastNaviItem
    }
  },

  actions: {
    setMainUri(data){
      this.mainUri = data
    },

    setNaviItems(data){
      this.naviItems = data
    },

    setNaviItemState(payload){
      payload[0].state = payload[1]
    },

    setLastNaviItem(data){
      this.lastNaviItem = data
    },

    setLastNaviItemState(state, checked){
      this.lastNaviItem.state = checked
    },

    setNaviItemClick(payload){
      payload[0].click = payload[1]
    },

    cleanNaviDatas(){
      this.mainUri = ''
      this.naviItems = {}
      this.lastNaviItem = {}
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['mainUri', 'naviItems', 'lastNaviItem']
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavigatorStore, import.meta.hot))
}
