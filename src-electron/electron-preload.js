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

contextBridge.exposeInMainWorld('client', {
  openDownloadFolder () {
    return ipcRenderer.invoke('openDownloadFolder')
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

contextBridge.exposeInMainWorld('terminal', {
  createTerminal (uuid) {
    return ipcRenderer.invoke('createTerminal', uuid)
  },

  closeTerminal (uuid) {
    return ipcRenderer.invoke('closeTerminal', uuid)
  },

  resize (data) {
    return ipcRenderer.invoke('terminalResize', data)
  },

  send (data) {
    return ipcRenderer.invoke('terminalSend', data)
  },

  receive (callback) {
    return ipcRenderer.on('terminalReceive', (event, data) => callback(data))
  }
})

contextBridge.exposeInMainWorld('sshTerminal', {
  createSSHTerminal (data) {
    return ipcRenderer.invoke('createSSHTerminal', data)
  },

  detect (uuid) {
    return ipcRenderer.invoke('detectSSHTerminal', uuid)
  },

  closeSSHTerminal (uuid) {
    return ipcRenderer.invoke('closeSSHTerminal', uuid)
  },

  resize (data) {
    return ipcRenderer.invoke('sshTerminalReize', data)
  },

  send (data) {
    return ipcRenderer.invoke('sshTerminalSend', data)
  },

  receive (callback) {
    return ipcRenderer.on('sshTerminalReceive', (event, data) => callback(data))
  }
})

contextBridge.exposeInMainWorld('sftpTerminal', {
  create (uuid) {
    return ipcRenderer.invoke('createSFTPTerminal', uuid)
  },

  listDir (data) {
    return ipcRenderer.invoke('listDirSFTP', data)
  },

  cteateFile (data) {
    return ipcRenderer.invoke('createFileSFTP', data)
  },

  cteateFolder (data) {
    return ipcRenderer.invoke('createFolderSFTP', data)
  },

  downloadFile (data) {
    return ipcRenderer.invoke('downloadFileSFTP', data)
  },

  uploadFile (data) {
    return ipcRenderer.invoke('uploadFileSFTP', data)
  },

  uploadStream (data) {
    return ipcRenderer.invoke('uploadStreamSFTP', data)
  },

  downloadFolder (data) {
    return ipcRenderer.invoke('downloadFolderSFTP', data)
  },

  uploadFolder (data) {
    return ipcRenderer.invoke('uploadFolderSFTP', data)
  },

  deleteFile (data) {
    return ipcRenderer.invoke('deleteFileSFTP', data)
  },

  deleteFolder (data) {
    return ipcRenderer.invoke('deleteFolderSFTP', data)
  },

  rename (data) {
    return ipcRenderer.invoke('renameSFTP', data)
  },

  readFile (data) {
    return ipcRenderer.invoke('readFileSFTP', data)
  },

  saveFile (data) {
    return ipcRenderer.invoke('saveFileSFTP', data)
  },
})

contextBridge.exposeInMainWorld('scpTerminal', {
  create (uuid) {
    return ipcRenderer.invoke('createSCPTerminal', uuid)
  },

  listDir (data) {
    return ipcRenderer.invoke('listDirSCP', data)
  },

  cteateFile (data) {
    return ipcRenderer.invoke('createFileSCP', data)
  },

  cteateFolder (data) {
    return ipcRenderer.invoke('createFolderSCP', data)
  },

  downloadFile (data) {
    return ipcRenderer.invoke('downloadFileSCP', data)
  },

  uploadFile (data) {
    return ipcRenderer.invoke('uploadFileSCP', data)
  },

  downloadFolder (data) {
    return ipcRenderer.invoke('downloadFolderSCP', data)
  },

  uploadFolder (data) {
    return ipcRenderer.invoke('uploadFolderSCP', data)
  },

  deleteFile (data) {
    return ipcRenderer.invoke('deleteFileSCP', data)
  },

  deleteFolder (data) {
    return ipcRenderer.invoke('deleteFolderSCP', data)
  },

  readFile (data) {
    return ipcRenderer.invoke('readFileSCP', data)
  },

  saveFile (data) {
    return ipcRenderer.invoke('saveFileSCP', data)
  },
})
