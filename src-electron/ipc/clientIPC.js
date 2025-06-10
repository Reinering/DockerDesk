import { ipcMain, dialog } from 'electron'
import {
  getOSInfo, getUtilization,
  getSystemProxy,
} from '../actions/client.js'
import { settings } from '../actions/settings.js'


export function registerClientIpcHandlers(win) {

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

    data["modify_time"] = Date.now()

    return settings.updateByField(data)
  })
}
