import { defineBoot } from '#q-app/wrappers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async ({ app } /* { app, router, ... } */) => {
  // something to do
  // 1. 创建 Pinia 实例
  const pinia = createPinia()

  // 2. 使用持久化插件
  pinia.use(piniaPluginPersistedstate)

  // 3. 将 Pinia 实例挂载到 Vue 应用上,覆盖已有的Pinia
  app.use(pinia)
})
