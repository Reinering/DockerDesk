import { ipcMain } from 'electron'
import {
  modifyWSLDebugConfig, execSubSystem, execSSubSystem,
  getWSLInfo, getWSLList, wslUpdate,
  wslInstallSubSystem, installWSL, startSubSystem, stopSubSystem, restartSubSystem,
  unregisterSubSystem, exportSubSystem, moveSubSystem, getDistributionList

} from 'app/src-electron/actions/wsl.js'



export function registerWSLIpcHandlers(win) {

  ipcMain.handle('modifyWSLDebugConfig', async (event, data) => {
    return modifyWSLDebugConfig(data).then((result) => {
      return { success: true, data: result, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('checkWSLInfo', async (event) => {
    return getWSLInfo().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('getWSLList', async (event) => {
    return getWSLList().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('getDistributionList', async (event) => {
    return getDistributionList().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('upgradeWSL', async (event) => {
    return wslUpdate().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('installSubSystem', async (event) => {
    return wslInstallSubSystem().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })


  ipcMain.handle('startSubSystem', async (event) => {
    return startSubSystem().then((data) => {
      return { success: true, data: data, error: '' }
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

  ipcMain.handle('installWSL', async (event, data) => {
    return installWSL(win, JSON.parse(data)).then((result) => {
      return { success: true, data: result, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('startWSL', async (event, {name}) => {
    return startSubSystem(name).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('stopWSL', async (event, {name}) => {
    return stopSubSystem(name).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('restartWSL', async (event) => {
    return restartSubSystem().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('deleteWSL', async (event, {name}) => {
    return unregisterSubSystem(name).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('termimalWSL', async (event) => {
    return stopSubSystem().then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('exportWSL', async (event, {name, distDir}) => {
    return exportSubSystem(name, distDir).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('moveWSL', async (event, {name, distDir}) => {
    return moveSubSystem(name, distDir).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  }),

  ipcMain.handle('execWSL', async (event, command) => {
    return execSubSystem(command).then((data) => {
      return { success: true, data: data, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('execSWSL', async (event, commands) => {
    try {
      return execSSubSystem(commands).then((data) => {
        return { success: true, data: data, error: '' }
      }, (error) => {
        return { success: false, error: error }
      })
    } catch (err) {
      return { success: false, error: err }
    }
  })
}
