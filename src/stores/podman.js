import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePodmanStore = defineStore('Podman', {
  state: () => ({
    proxies: {
      mode: '',
      httpProxy: '',
      httpsProxy: '',
      noProxy: ''
    }
  }),

  getters: {
    getENV: (state) => {
      let env = []

      if (state.proxies.mode === "disable") {
        return env
      }

      if (state.proxies.httpsProxy) {
        env.push(`https_proxy=${state.proxies.httpsProxy}`)
      }

      if (state.proxies.httpProxy) {
        env.push(`http_proxy=${state.proxies.httpProxy}`)
      }

      if (state.proxies.noProxy) {
        env.push(`no_proxy=${state.proxies.noProxy}`)
      }

      return env
    }
  },

  actions: {

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePodmanStore, import.meta.hot))
}
