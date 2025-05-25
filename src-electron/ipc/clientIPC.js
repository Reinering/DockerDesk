import { ipcMain, dialog } from 'electron'



export function registerClientIpcHandlers(win) {

  ipcMain.handle('selectFiles', async (event, data) => {

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

  ipcMain.handle('selectFolders', async (event, data) => {

    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
    })

    if (!result.canceled) {
      return result.filePaths // 返回文件路径
    }
    return null
  })


}
