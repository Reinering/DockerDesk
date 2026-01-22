import { settings } from './settings.js'
import { HotKeys } from '../common/hotKeys.js'



export async function registryHotKey (name) {
  const result = await settings.getByField("hot_keys")
  if (!result.success) {
    return
  }

  let data = JSON.parse(result.data[0].value)
  for (const item of data) {
    if (item.name === name) {
      if (!item.enable) {
        return {success: false, error: "registry failed: Hotkey Not enabled"}
      } else if (!Object.prototype.hasOwnProperty.call(HotKeys, item.func)) {
        return {success: false, error: "registry failed: Function not found"}
      }

      if (name === "switchTab") {
        return HotKeys.switchTab.registry()
      } else {
        return HotKeys.register(item.keys.join('+'), HotKeys[item.func])
      }
    }
  }

  return {success: false, error: "Hotkey not found"}
}

export async function unRegistryHotKey (name) {
  const result = await settings.getByField("hot_keys")
  if (!result.success) {
    return
  }

  let data = JSON.parse(result.data[0].value)
  for (const item of data) {

    if (item.name === name) {
      if (name === "switchTab") {
        return HotKeys.switchTab.registry()
      } else {
        return HotKeys.switchTab.unRegister()
      }
    }
  }

  return {success: false, error: "Hotkey not found"}

}
