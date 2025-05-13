
import { useNavigatorStore } from 'stores/navigator.js'
import { isEmptyProxy, isEmptyStr } from 'src/utils/common.js'


const navigatorStore = useNavigatorStore()

export const changeNavigatorGoto = (router, item, params=null) => {
  if (!isEmptyProxy(navigatorStore.lastNaviItem)) {
    navigatorStore.setLastNaviItemState(false)
  }
  navigatorStore.setNaviItemState([item, true])
  navigatorStore.setLastNaviItem(item)
  if (isEmptyStr(item.route)) {
    router.push(navigatorStore.mainUri)
  } else {
    if (navigatorStore.mainUri[navigatorStore.mainUri.length - 1] === '/') {
      router.push({path: `${navigatorStore.mainUri}${item.route}`, query: {data: JSON.stringify(params)}})
    } else {
      router.push({path: `${navigatorStore.mainUri}/${item.route}`, query: {data: JSON.stringify(params)}})
    }
  }
}
