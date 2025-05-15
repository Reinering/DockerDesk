
import { useNavigatorStore } from 'stores/navigator.js'
import { isEmptyObj, isEmptyProxy, isEmptyStr } from 'src/utils/common.js'


const navigatorStore = useNavigatorStore()

export const changeNavigatorGoto = (router, item, prefix='', params=null) => {
  if (!isEmptyProxy(navigatorStore.lastNaviItem)) {
    navigatorStore.setLastNaviItemState(false)
  }

  navigatorStore.setNaviItemState([item, true])
  navigatorStore.setLastNaviItem(item, prefix)

  if (isEmptyStr(item.route)) {
    router.push(navigatorStore.mainUri)
  } else {
    if (navigatorStore.mainUri[navigatorStore.mainUri.length - 1] === '/') {
      if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
        router.push({path: `${navigatorStore.mainUri}${item.route}`, query: {data: JSON.stringify(params)}})
      } else {
        router.push({path: `${navigatorStore.mainUri}${prefix}/${item.route}`, query: {data: JSON.stringify(params)}})
      }
    } else {
      if (isEmptyStr(prefix) || isEmptyObj(prefix)) {
        router.push({path: `${navigatorStore.mainUri}/${item.route}`, query: {data: JSON.stringify(params)}})
      } else {
        router.push({path: `${navigatorStore.mainUri}/${prefix}/${item.route}`, query: {data: JSON.stringify(params)}})
      }
    }
  }
}
