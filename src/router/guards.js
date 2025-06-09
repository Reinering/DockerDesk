/**
 *
 * */
import { LocalStorage, SessionStorage } from 'quasar'
import { useNavigatorStore } from 'stores/navigator.js'
import { devConsole } from 'src/common/config'


// 导航守卫

// 全局前置守卫
export const beforeEach = (store, to, from) => {
  // devConsole("beforeEach", to, from)

  const navigatorStore = useNavigatorStore()

  // 判断是否进入错误页面
  if (to.matched.some(record => record.path === '/:catchAll(.*)*') || to.name === 'NotFound') {
    // console.log('Navigated to ErrorNotFound page');
    // 可在此处添加逻辑，例如记录日志或触发某些操作
    navigatorStore.clear()
  }
}

// 全局后置守卫
export const afterEach = (store, to, from) => {
  // devConsole("afterEach", to, from)
}

// 全局解析守卫
export const beforeResolve = async (store, to, from) => {
  // devConsole("beforeResolve", to, from)


}

// 路由独享守卫
export const toMain = (to, from) => {
  // devConsole("toMain", to, from)

}

export const toOther = (to, from) => {
  // devConsole(to, from)

}
