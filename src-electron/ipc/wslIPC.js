import { ipcMain, shell } from 'electron'
import {
  modifyWSLDebugConfig, execSubSystem, execSSubSystem,
  getWSLInfo, getWSLList, wslUpdate,
  wslInstallSubSystem, installWSL, startSubSystem, stopSubSystem, restartSubSystem,
  unregisterSubSystem, exportSubSystem, moveSubSystem, getDistributionList, dockerLogin, startBGSubSystem,
  readPodmanConf, checkSubSystem,
  getWSLSettings, setWSLSettings, getWSLLaunch, setWSLLaunch, getSubSystemState
} from 'app/src-electron/actions/wsl.js'


let isProcessing = false

export function registerWSLIpcHandlers(win) {

  ipcMain.handle('modifyWSLDebugConfig', async (event, data) => {
    return modifyWSLDebugConfig(data).then((result) => {
      return { success: true, data: result, error: '' }
    }, (error) => {
      return { success: false, error: error }
    })
  })

  ipcMain.handle('checkWSLInfo', async (event, encoding) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return getWSLInfo(encoding).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('getWSLList', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return getWSLList().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('getDistributionList', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return getDistributionList().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('upgradeWSL', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return wslUpdate().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('installSubSystem', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return wslInstallSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('startSubSystem', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return startSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.on('startSubSystem', async (event) => {
    startSubSystem()
  })

  ipcMain.handle('startBGSubSystem', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return startBGSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('stopSubSystem', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return stopSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('checkSubSystem', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return checkSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('installWSL', async (event, data) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return installWSL(win, JSON.parse(data)).then((result) => {
        isProcessing = false
        return { success: true, data: result, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  // ipcMain.handle('startWSL', async (event, name) => {
  //   if (isProcessing) {
  //     return { success: false, error: "Other WSL commands are being executed... Please try again later" }
  //   } else {
  //     isProcessing = true
  //
  //     return startSubSystem(name).then((data) => {
  //       isProcessing = false
  //       return { success: true, data: data, error: '' }
  //     }, (error) => {
  //       isProcessing = false
  //       return { success: false, error: error }
  //     })
  //   }
  // })

  ipcMain.on('startWSL', async (event, {name}) => {
    startSubSystem(name)
  })

  ipcMain.handle('startBGWSL', async (event, {name}) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return startBGSubSystem(name).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })


  ipcMain.handle('stopWSL', async (event, {name}) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return stopSubSystem(name).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('restartWSL', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return restartSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('deleteWSL', async (event, {name}) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return unregisterSubSystem(name).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('terminalWSL', async (event) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return stopSubSystem().then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('exportWSL', async (event, {name, format, distDir}) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return exportSubSystem(name, format, distDir).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('moveWSL', async (event, {name, distDir}) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return moveSubSystem(name, distDir).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('execWSL', async (event, command) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      return execSubSystem(command).then((data) => {
        isProcessing = false
        return { success: true, data: data, error: '' }
      }, (error) => {
        isProcessing = false
        return { success: false, error: error }
      })
    }
  })

  ipcMain.handle('execSWSL', async (event, commands) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      try {
        return execSSubSystem(commands).then((data) => {
          isProcessing = false
          return { success: true, data: data, error: '' }
        }, (error) => {
          isProcessing = false
          return { success: false, error: error }
        })
      } catch (err) {
        isProcessing = false
        return { success: false, error: err }
      }
    }
  })

  ipcMain.handle('dockerLoginWSL', async (event, commands) => {
    if (isProcessing) {
      return { success: false, error: "Other WSL commands are being executed... Please try again later" }
    } else {
      isProcessing = true

      try {
        return dockerLogin(commands).then((data) => {
          isProcessing = false
          return { success: true, data: data, error: '' }
        }, (error) => {
          isProcessing = false
          return { success: false, error: error }
        })
      } catch (err) {
        isProcessing = false
        return { success: false, error: err }
      }
    }
  })

  ipcMain.handle('readPodmanConfWSL', async (event, commands) => {
    try {
      return readPodmanConf(commands).then((data) => {
        return { success: true, data: data, error: '' }
      }, (error) => {
        return { success: false, error: error }
      })
    } catch (err) {
      return { success: false, error: err }
    }
  })

  ipcMain.handle('getWSLSettings', async (event, data) => {
    try {
      return getWSLSettings(data)
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('setWSLSettings', async (event, data) => {
    try {
      return setWSLSettings(data)
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('getWSLLaunch', async (event, data) => {
    try {
      return getWSLLaunch(data)
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('setWSLLaunch', async (event, data) => {
    try {
      return setWSLLaunch(data)
    } catch (error) {
      return { success: false, error: error }
    }
  })

}
