import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, reactive } from 'vue'

export const useNavigatorStore = defineStore('navigator', {
  state: () => ({
    mainUri: ref(''),
    naviItems: reactive({}),
    lastNaviItem: reactive({
      prefix: '',
      item: {}
    })
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

    setLastNaviItem(data, prefix){
      this.lastNaviItem.prefix = prefix
      this.lastNaviItem.item = data
    },

    setLastNaviItemState(state, checked){
      this.lastNaviItem.item.state = checked
    },

    setNaviItemClick(payload){
      payload[0].click = payload[1]
    },

    cleanNaviDatas(){
      this.mainUri = ref(''),
      this.naviItems = reactive({}),
      this.lastNaviItem = reactive({
        prefix: '',
        item: {}
      })
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
