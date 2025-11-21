import { app, Menu, Tray } from 'electron'
import { i18n } from 'app/src-electron/common/i18n.js'
// import { i18n } from './i18n.js'
import { isEmptyObj } from 'app/src-electron/common/utils.js'



const trayConf = {
  mainWindow: undefined,
  icon: undefined,
}

let tray

export const createTray = (mainWindow, icon) => {
  // 如果 tray 已经存在，先销毁旧的（可选，但推荐）
  if (tray) tray.destroy()

  if ( ! isEmptyObj(mainWindow)) {
    trayConf.mainWindow = mainWindow
  }

  if ( ! isEmptyObj(icon)) {
    trayConf.icon = icon
  }

  tray = new Tray(trayConf.icon) // 设置托盘图标
  const contextMenu = Menu.buildFromTemplate([
    { label: i18n.t('show'), click: () => {
        /* 显示主窗口的逻辑 */
        trayConf.mainWindow.show()
        trayConf.mainWindow.setSkipTaskbar(false) // 从任务栏显示
      }},
    { label: i18n.t('hide'), click: () => {
        trayConf.mainWindow.hide()
        trayConf.mainWindow.setSkipTaskbar(true) // 从任务栏隐藏
      }},
    { label: i18n.t('exit'), click: () => {
        // 确保完全退出应用
        trayConf.mainWindow.destroy()
        app.quit()
      }}
  ])
  tray.setToolTip('DockerDesk') // 设置悬浮提示
  tray.setContextMenu(contextMenu) // 设置上下文菜单

  tray.on('click', () => {
    // mainWin.show()
    tray.popUpContextMenu()
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu()
  })

  // 双击托盘切换窗口显示状态
  tray.on('double-click', () => {
    if (trayConf.mainWindow.isVisible()) {
      trayConf.mainWindow.hide()
    } else {
      trayConf.mainWindow.show()
    }
  })
}
