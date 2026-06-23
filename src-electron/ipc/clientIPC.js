import { app, ipcMain, dialog, shell } from 'electron'
import axios from 'axios'
import puppeteer from 'puppeteer'
import * as fs from 'fs'
import path from 'path'
import Crypto from 'crypto.js'
import  ping from 'ping'
import {
  getOSInfo, getUtilization,
  getSystemProxy,
} from '../actions/client.js'
import { settings } from '../actions/settings.js'

import { CmdRunner, cmdAdmin, cmd } from '../common/utils.js'
import { readStoreData, writeStoreData, } from '../common/store.js'
import { setLang } from '../common/i18n.js'
import { getAutoLaunch, setupAutoLaunch } from "../common/launch.js"
import { HotKeys } from "../common/hotKeys.js"
import { registryHotKey, unRegistryHotKey } from "../actions/hotKeys.js"
import { showSubWindow, closeSubWindow } from "../actions/electron-sub.js"


export  const CmdRunners = new Map()

export function registerClientIpcHandlers(win) {

  ipcMain.handle('fetchData', async (event, url, options) => {
    try {
      const response = await axios({ url, ...options })
      // 只返回真正需要的数据，剔除 axios 的额外属性
      return { success: true, data: response.data }
    } catch (error) {
      // 这里也可以只返回必要的错误信息，避免 error 对象本身不可克隆
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          response: error.response ? { status: error.response.status, data: error.response.data } : null
        }
      }
    }
  })

  ipcMain.handle('getTitle', async (event, url) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle2' })

      const title = await page.title()

      await browser.close()

      return { success: true, data: title.trim() }
    } catch (error) {
      // 这里也可以只返回必要的错误信息，避免 error 对象本身不可克隆z
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          response: error.response ? { status: error.response.status, data: error.response.data } : null
        }
      }
    }
  })

  ipcMain.on('syncLang', async (event, lang) => {
    setLang(lang)
  })

  ipcMain.on('openUrlOnBrowser', async (event, url) => {
    shell.openExternal(url)
  })

  ipcMain.handle('getOSInfo', async (event) => {
    return getOSInfo()
  })

  ipcMain.handle('getOSUtilization', async (event) => {
    return getUtilization()
  })

  ipcMain.handle('selectFiles', async (event) => {

    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!result.canceled) {
      // 遍历所有选中的路径，转换为包含元数据的对象
      const fileDetails = result.filePaths.map(filePath => {
        const stats = fs.statSync(filePath) // 获取文件状态
        return {
          name: path.basename(filePath), // 文件名，例如 "test.zip"
          path: filePath,                // 完整路径
          size: stats.size,              // 文件大小 (单位: Bytes)
          // sizeFormatted: (stats.size / 1024 / 1024).toFixed(2) + ' MB' // 可选：提前格式化
        }
      })

      return fileDetails
    }

    return null
  })

  ipcMain.handle('selectFolders', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
    })

    if (!result.canceled) {
      return result.filePaths // 返回文件路径
    }
    return null
  })

  ipcMain.handle('readFile', async (event) => {

    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!result.canceled) {
      try {
        const data = await fs.readFileSync(result.filePaths[0])
        return Crypto.base64encode(data.buffer)
      } catch (error) {
        return null
      }
    }
    return null
  })

  ipcMain.handle('readFileIcon', async (event) => {

    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['ico'] },
        // { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!result.canceled) {
      try {
        const data = await fs.readFileSync(result.filePaths[0]).buffer
        const base64 = `data:image/x-icon;base64,${Buffer.from(data).toString('base64')}`
        return base64
      } catch (error) {
        return null
      }
    }
    return null
  })

  ipcMain.handle('readFileIconByUrl', async (event, url) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const base64 = `data:image/x-icon;base64,${Buffer.from(arrayBuffer).toString('base64')}`
    return base64
  })

  ipcMain.handle('getSystemProxy', async (event) => {
    return getSystemProxy()
  })

  ipcMain.handle('getSettings', async (event, field) => {
    return settings.getByField(field)
      .then((result) => {
        if (result.success) {
          return { success: true, data: {
            field: result.data[0].field,
            type: result.data[0].type,
            value: result.data[0].value,
            } }
        } else {
          return result
        }
      })
  })

  ipcMain.handle('updateSettings', async (event, data) => {
    if (data instanceof Array) {
      let result
      for (const item of data) {

        result = settings.updateByField(item)
      }
      return result
    } else {
      data["modify_time"] = Date.now()

      return settings.updateByField(data)
    }
  })

  ipcMain.handle('cmdExec', async (event, data) => {
    try {
      let command = data
      if (data instanceof Array) {
        command = data.join(' ')
      }

      return cmd(command).then((data) => {
        return { success: true, data: data, error: '' }
      }, (error) => {
        return { success: false, error: error }
      })
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('cmdExecAdmin', async (event, data) => {
    try {
      let command = data
      if (data instanceof Array) {
        command = data.join(' ')
      }

      return cmdAdmin(command, 'utf16le', true).then((data) => {
        console.log("cmdExecAdmin", data)
        return { success: true, data: data, error: '' }
      }, (error) => {
        console.log("cmdExecAdmin", error)
        return { success: false, error: error }
      })
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('cmdRunnerStart', async (event, {uuid, cmd, options}) => {
    try {
      if (CmdRunners.has(uuid)) {
        const cmdRunner = CmdRunners.get(uuid)
        cmdRunner.stop()
        CmdRunners.delete(uuid)
      }

      console.log(uuid, cmd, options)

      const cmdRunner = new CmdRunner(win, uuid)
      cmdRunner.start(cmd, options)

      CmdRunners.set(uuid, cmdRunner)
      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('cmdRunnerExec', async (event, {uuid, cmd}) => {
    try {
      if (CmdRunners.has(uuid)) {
        const cmdRunner = CmdRunners.get(uuid)

        let command = cmd
        if (cmd instanceof Array) {
          command = cmd.join(' ')
        }

        cmdRunner.sendCommand(command)
      }

      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('cmdRunnerStop', async (event, {uuid}) => {
    try {
      if (CmdRunners.has(uuid)) {
        const cmdRunner = CmdRunners.get(uuid)
        cmdRunner.stop()
        CmdRunners.delete(uuid)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "cmdRunner close error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }

  })

  ipcMain.handle('getAutoLaunch', async (event) => {
    try {
      return getAutoLaunch().then((result) => {
        return { success: true, data: result, error: '' }
      })
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('setAutoLaunch', async (event, checked) => {
    return setupAutoLaunch(checked, true).then((result) => {
      return result
    })

  })

  ipcMain.handle('readStoreData', async (event, ) => {
    return readStoreData()
  })

  ipcMain.handle('writeStoreData', async (event, data) => {
    return writeStoreData(data)
  })

  ipcMain.handle('registryHotKey', async (event, name) => {
    return registryHotKey(name)
  })

  ipcMain.handle('unRegistryHotKey', async (event, name) => {
    return unRegistryHotKey(name)
  })

  ipcMain.handle('restoreHotKeys', async (event) => {
    return HotKeys.restore()
  })

  ipcMain.handle('showSubWindow', async (event, sub) => {
    return showSubWindow(sub)
  })

  ipcMain.handle('closeSubWindow', async (event, sub) => {
    return closeSubWindow(sub)
  })

  ipcMain.handle('ping', async (event, host) => {
    return await ping.promise.probe(host)
  })

}
