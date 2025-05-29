import { ipcMain } from 'electron'



export function registerPodmanIpcHandlers() {

  ipcMain.handle('createPodman', async (event, data) => {

  })


}
