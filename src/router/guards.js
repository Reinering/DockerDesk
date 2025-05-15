/**
 *
 * */
import { LocalStorage, SessionStorage } from 'quasar'
import { useNavigatorStore } from 'stores/navigator.js'
import { devConsole } from 'src/common/config'


// 导航守卫

// 全局前置守卫
export const beforeEach = (store, to, from) => {
  // devConsole(to, from)

  const navigatorStore = useNavigatorStore()

  if (to.fullPath === '/') {
    navigatorStore.clear()
  }
}

// 全局后置守卫
export const afterEach = (store, to, from) => {
  // devConsole(to, from)
}

// 全局解析守卫
export const beforeResolve = async (store, to, from) => {
  // devConsole(to, from)


}

// 路由独享守卫
export const toMain = (to, from) => {
  // devConsole(to, from)

}

export const toOther = (to, from) => {
  // devConsole(to, from)

}
