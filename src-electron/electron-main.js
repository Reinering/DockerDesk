import { app, BrowserWindow, nativeImage } from 'electron'
import { initialize, enable } from '@electron/remote/main/index.js'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { exec, execSync } from 'child_process'
import * as sudo from 'sudo-prompt'
import { registerIpcHandlers } from './ipcManager.js'
import { initDB, backupDB } from './database/manager.js'
import { ssh_clients, sftp_clients } from "./ipc/sshIPC.js"
import { terminals } from "./ipc/terminalIPC.js"
import { createTray } from "./common/tray.js"
import { wslStartLaunch, wslStopLaunch } from "./common/wsl.js"
import { HotKeys } from "./common/hotKeys.js"
import { cleanupTmp } from "./common/utils.js"
import { initLogging } from './common/logging.js'


const APPNAME = "DockerDesk"

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
    // transparent: true,            // 核心：开启窗口透明
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
      sandbox: false, // <-- to be able to import @electron/remote in preload script
      devTools: true,  // build open debug console
      nodeIntegration: false,
      webSecurity: true       // 建议开启，但需配合上方正确的 CSP
    }
  })

  enable(mainWindow.webContents)

  registerIpcHandlers(mainWindow)   // 注意注册顺序

  // 挂载 route
  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }
  // webPreferences.devTools为true时，开启devConsole
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

}

initDB()
initLogging()

app.setName(APPNAME)

let tray = null
app.whenReady().then(async () => {

  createWindow()

  // 创建托盘图标 path.resolve(currentDir, 'icons/icon.png')
  const icon = nativeImage.createFromPath(path.join(publicFolder, 'icons/favicon-128x128.png'))
    .resize({ width: 16, height: 16 }) // 托盘图标通常较小
  createTray(mainWindow, icon)

  HotKeys.registerAll(mainWindow)
  HotKeys.localRegistry(mainWindow)

  wslStartLaunch()

  if (app.isPackaged) {
    backupDB()
  }
})

app.on('did-finish-load', () => {

})

// close
app.on('window-all-closed', async () => {

  if (platform !== 'darwin') {
    app.quit()
  }
})

//
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', async () => {
  console.log("will-quit")

  // 退出前，断开所有ssh连接
  for (let uuid of ssh_clients.keys()) {
    const sshClient =  ssh_clients.get(uuid)
    try {
      if (sshClient.status !== 'disconnected') {
        await sshClient.disconnect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (let uuid of sftp_clients.keys()) {
    const sftpClient =  sftp_clients.get(uuid)
    try {
      if (sftpClient.status !== 'disconnected') {
        await sftpClient.disconnect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (let uuid of terminals.keys()) {
    const terminal =  terminals.get(uuid)
    try {
      await terminal.destroy()
    } catch (e) {
      console.log(e)
    }
  }

  wslStopLaunch()

  HotKeys.unRegisterAll()

  cleanupTmp()

})


// if (app.isPackaged) {
//   const isAdmin = await ensureAdmin() // 你需要封装一个返回 Promise 的检查函数
//   if (!isAdmin) {
//     handleElevation() // 处理提权逻辑
//     app.exit(0) // 重要：直接结束，不执行后面的创建窗口逻辑
//   }
// }


function ensureAdmin() {
  return new Promise((resolve) => {
    exec('net session', (err) => {
      resolve(!err)
    })
  })
}

// 封装提权跳转
function handleElevation() {

  const command = `"${process.execPath}"`

  sudo.exec(command, { name: APPNAME }, (error) => {
    if (error) {
      console.error('提权失败或被拒绝')
      app.quit()
    } else {
      // 新进程已启动，老进程功成身退
      app.exit(0)
    }
  })
}


