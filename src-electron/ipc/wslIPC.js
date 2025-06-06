import { ipcMain, dialog } from 'electron'
import {
  getWSLInfo, getWSLList, wslUpdate,
  wslInstallSubSystem, startSubSystem, stopSubSystem,
  unregisterSubSystem, exportSubSystem, moveSubSystem,

} from 'app/src-electron/actions/wsl.js'



export function registerWSLIpcHandlers(win) {

  ipcMain.handle('checkWSLInfo', async (event) => {
    return getWSLInfo().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })


  ipcMain.handle('getWSLList', async (event) => {
    return getWSLList().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('upgradeWSL', async (event) => {
    return wslUpdate().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('installSubSystem', async (event) => {
    return wslInstallSubSystem().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })


  ipcMain.handle('startSubSystem', async (event) => {
    return startSubSystem().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('stopSubSystem', async (event) => {
    return stopSubSystem().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('startWSL', async (event, {name}) => {
    return startSubSystem(name).then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('stopWSL', async (event, {name}) => {
    return stopSubSystem(name).then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('restartWSL', async (event) => {
    return stopSubSystem().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('deleteWSL', async (event, {name}) => {
    return unregisterSubSystem(name).then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('termimalWSL', async (event) => {
    return stopSubSystem().then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('exportWSL', async (event, {name, distDir}) => {
    return exportSubSystem(name, distDir).then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('moveWSL', async (event, {name, distDir}) => {
    return moveSubSystem(name, distDir).then((data) => {
      return { success: true, data:data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })
}
