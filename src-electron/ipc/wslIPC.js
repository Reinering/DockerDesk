import { ipcMain, dialog } from 'electron'
import { getWSLInfo, getWSList } from 'app/src-electron/actions/client.js'



export function registerWSLIpcHandlers(win) {

  ipcMain.handle('checkWSLInfo', async (event) => {
    return getWSLInfo().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })


  ipcMain.handle('getWSLList', async (event) => {
    return getWSList().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })



}
