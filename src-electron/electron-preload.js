/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */


import { contextBridge, ipcRenderer } from 'electron'
import { BrowserWindow } from '@electron/remote'


contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close () {
    BrowserWindow.getFocusedWindow().close()
  }
})

contextBridge.exposeInMainWorld('nodes', {
  getNodes () {
    return ipcRenderer.invoke('getNodes')
  },

  async addNode (data) {
    return await ipcRenderer.invoke('addNode', data)
  },

  async delNode (data) {
    return await ipcRenderer.invoke('delNode', data)
  },

  async editNode (data) {
    return await ipcRenderer.invoke('editNode', data)
  }

})

contextBridge.exposeInMainWorld('dockerNodes', {
  getDockerNodes () {
    return ipcRenderer.invoke('getDockerNodes')
  },

  // addDockerNode1 (data) {
  //   return ipcRenderer.send('addDockerNode', data)
  // },

  async addDockerNode (data) {
    return await ipcRenderer.invoke('addDockerNode', data)
  },

  async delDockerNode (data) {
    return await ipcRenderer.invoke('delDockerNode', data)
  },

  async editDockerNode (data) {
    return await ipcRenderer.invoke('editDockerNode', data)
  }

})

contextBridge.exposeInMainWorld('terminal', {
  createTerminal () {
    return ipcRenderer.invoke('createSSH')
  },

  closeTerminal () {
    return ipcRenderer.invoke('closeSSH')
  },

  sendCmdToTerminal () {
    // return ipcRenderer.invoke('')
  }
})

contextBridge.exposeInMainWorld('precmds', {
  getPreCmds () {
    return ipcRenderer.invoke('getPreCmds')
  },

  addPreCmd (data) {
    return ipcRenderer.invoke('addPreCmd', data)
  },

  editPreCmd (data) {
    return ipcRenderer.invoke('editPreCmd', data)
  },

  delPreCmd (data) {
    return ipcRenderer.invoke('delPreCmd', data)
  },

  editPreCmdGroup (data) {
    return ipcRenderer.invoke('editPreCmdGroup', data)
  },


  delPreCmdGroup (data) {
    return ipcRenderer.invoke('delPreCmdGroup', data)
  },

})
