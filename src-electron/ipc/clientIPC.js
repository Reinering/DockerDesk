import { ipcMain } from 'electron'



export function registerClientIpcHandlers(win) {

  ipcMain.handle('openDownloadFolder', async (event, data) => {

  })


}
