import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron'
import { initialize, enable } from '@electron/remote/main/index.js'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { registerIpcHandlers } from './ipcManager.js'
import { initDB } from './database/manager.js'
import { ssh_clients } from "./ipc/sshIPC.js"
import { createTray } from "./common/tray.js"


import { initLogging } from './common/logging.js'


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))
console.log("currentDir", currentDir)

console.log("userData", app.getPath('userData'))

// public
const publicFolder = path.resolve(currentDir, process.env.QUASAR_PUBLIC_FOLDER)
console.log("publicFolder", publicFolder)

let mainWindow

async function createWindow () {
  /**
   * Initial window options
   */

  initialize()

  mainWindow = new BrowserWindow({
    // taskbar icon: path.resolve(currentDir, 'assets/icons/icon.ico') path.join(publicFolder, 'icons/favicon-128x128.png')
    icon: path.join(publicFolder, 'icons/favicon-128x128.png'), // tray icon
    width: 1200,
    height: 800,
    useContentSize: true,
    frame: false, // <-- 添加这里
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
      sandbox: false, // <-- to be able to import @electron/remote in preload script
      devTools: true,  // build open debug console
    }
  })

  enable(mainWindow.webContents)


  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  registerIpcHandlers(mainWindow)
}

initDB()
initLogging()

app.setName('DockerDesk')

let tray = null
app.whenReady().then(() => {
  createWindow()

  // 创建托盘图标 path.resolve(currentDir, 'icons/icon.png')
  const icon = nativeImage.createFromPath(path.join(publicFolder, 'icons/favicon-128x128.png'))
    .resize({ width: 16, height: 16 }) // 托盘图标通常较小
  createTray(mainWindow, icon)
})

app.on('did-finish-load', () => {

})

// close
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }

  // 退出前，断开所有ssh连接
  for (let conn of ssh_clients) {
    conn.close()
  }

})

//
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()

  }
})

