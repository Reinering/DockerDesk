import { ipcMain, dialog, shell } from 'electron'
import * as fs from 'fs'
import path from 'path'
import {
  getOSInfo, getUtilization,
  getSystemProxy,
} from '../actions/client.js'
import { settings } from '../actions/settings.js'
import { CmdRunner } from '../common/utils.js'
import Crypto from 'crypto.js'
import { interference } from 'app/src-electron/common/encrypt.js'


export  const CmdRunners = new Map()

export function registerClientIpcHandlers(win) {

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
      return result.filePaths // 返回文件路径
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
        item["modify_time"] = Date.now()
        result = settings.updateByField(item)
      }
      return result
    } else {
      data["modify_time"] = Date.now()

      return settings.updateByField(data)
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
    try{
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



}
