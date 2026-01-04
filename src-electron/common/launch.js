import AutoLaunch from 'auto-launch'
import { app } from 'electron'


/**
 * 设置应用开机自启动
 * @param enable 是否启用自启动，默认为true
 * @param isHidden
 */
export function setupAutoLaunch(enable = true, isHidden = false) {
  const autoLauncher = new AutoLaunch({
    name: app.getName(),
    path: process.execPath,
    isHidden: isHidden
  })

  if (enable) {
    return autoLauncher.isEnabled()
      .then((isEnabled) => {
        if (!isEnabled) {
          return autoLauncher.enable()
            .then(() => {
              return { success: true, error: '' }
            })
            .catch(err => {
              return { success: false, error: err }
            })
        }
        else {
          return { success: true, error: '' }
        }
      })
      .catch(err => {
        return { success: false, error: err }
      })
  }
  else {
    return autoLauncher.isEnabled()
      .then((isEnabled) => {
        if (isEnabled) {
         return autoLauncher.disable()
            .then(() => {
              return { success: true, error: '' }
              })
            .catch(err => {
              return { success: false, error: err }
            })
        }
        else {
          return { success: true, error: '' }
        }
      })
      .catch(err => {
        return { success: false, error: err }
      })
  }
}

export function getAutoLaunch() {
  const autoLauncher = new AutoLaunch({
    name: app.getName(),
    path: process.execPath,
  })

  return autoLauncher.isEnabled().then((isEnabled) => {
    return isEnabled
  })
}

