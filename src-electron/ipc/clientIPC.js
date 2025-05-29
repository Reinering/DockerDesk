import { ipcMain, dialog } from 'electron'
import {
  getOSInfo, getUtilization, getPodmanInfo, getDockerInfo,
  getWSLInfo, getWSList

} from '../actions/client.js'



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

  ipcMain.handle('checkDockerInfo', async (event) => {
    return getDockerInfo().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('checkPodmanInfo', async (event) => {
    return getPodmanInfo().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

}
