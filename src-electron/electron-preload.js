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


import { contextBridge, ipcRenderer,  } from 'electron'
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
    // BrowserWindow.getFocusedWindow().close()
    BrowserWindow.getFocusedWindow().hide()
  },

  selectFiles () {
    return ipcRenderer.invoke('selectFiles')
  },

  selectFolders () {
    return ipcRenderer.invoke('selectFolders')
  },

  getProxy ()  {
    return ipcRenderer.invoke('getSystemProxy')
  },

  syncLang (lang) {
    ipcRenderer.send('syncLang', lang)
  },

  fetchData (url, options) {
    return ipcRenderer.invoke('fetchData', url, options)
  }

})


contextBridge.exposeInMainWorld('client', {

  openUrlOnBrowser(url) {
    return ipcRenderer.send('openUrlOnBrowser', url)
  },

  openDownloadFolder () {
    return ipcRenderer.invoke('openDownloadFolder')
  },

  readFile () {
    return ipcRenderer.invoke('readFile')
  },

  readFileIcon () {
    return ipcRenderer.invoke('readFileIcon')
  },

  readFileIconByUrl (data) {
    return ipcRenderer.invoke('readFileIconByUrl', data)
  },

  getOSInfo () {
    return ipcRenderer.invoke('getOSInfo')
  },

  getOSUtilization () {
    return ipcRenderer.invoke('getOSUtilization')
  },

  getSettings (field) {
    return ipcRenderer.invoke('getSettings', field)
  },

  updateSettings (data) {
    return ipcRenderer.invoke('updateSettings', data)
  },

  exec (data) {
    return ipcRenderer.invoke('cmdExec', data)
  },

  execAdmin (data) {
    return ipcRenderer.invoke('cmdExecAdmin', data)
  },

  cmdRunnerStart (data) {
    return ipcRenderer.invoke('cmdRunnerStart', data)
  },

  cmdRunnerExec (data) {
    return ipcRenderer.invoke('cmdRunnerExec', data)
  },

  cmdRunnerStop (data) {
    return ipcRenderer.invoke('cmdRunnerStop', data)
  },

  cmdRunnerReceive (callback) {
    return ipcRenderer.on('cmdRunnerReceive', (event, data) => callback(data))
  },

  getAutoLaunch () {
    return ipcRenderer.invoke('getAutoLaunch')
  },

  setAutoLaunch (data) {
    return ipcRenderer.invoke('setAutoLaunch', data)
  },

  readStoreData () {
    return ipcRenderer.invoke('readStoreData')
  },

  writeStoreData (path, data) {
    return ipcRenderer.invoke('writeStoreData', path, data)
  }

})


contextBridge.exposeInMainWorld('nodes', {
  getNodes () {
    return ipcRenderer.invoke('getNodes')
  },

  getNode (id) {
    return ipcRenderer.invoke('getNode', id)
  },

  async addNode (data) {
    return await ipcRenderer.invoke('addNode', data)
  },

  async delNode (data) {
    return await ipcRenderer.invoke('delNode', data)
  },

  async editNode (data) {
    return await ipcRenderer.invoke('editNode', data)
  },

  async updateNode (data) {
    return await ipcRenderer.invoke('updateNode', data)
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

  createWSLTerminal (data) {
    return ipcRenderer.invoke('createWSLTerminal', data)
  },

  execWSLTerminal (data) {
    return ipcRenderer.invoke('execWSLTerminal', data)
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
  },

  execTerminal (data) {
    return ipcRenderer.invoke('execTerminal', data)
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

  exec (data) {
    return ipcRenderer.invoke('sshTerminalExec', data)
  },

  execStream (data) {
    return ipcRenderer.invoke('sshTerminalExecStream', data)
  },

  receive (callback) {
    return ipcRenderer.on('sshTerminalReceive', (event, data) => callback(data))
  },

})


contextBridge.exposeInMainWorld('sftpTerminal', {

  create (uuid) {
    return ipcRenderer.invoke('createSFTPTerminal', uuid)
  },

  receive (callback) {
    return ipcRenderer.on('sftpTerminalReceive', (event, data) => callback(data))
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

  downloadSFile (data) {
    return ipcRenderer.invoke('downloadSFileSFTP', data)
  },

  downloadStream (data) {
    return ipcRenderer.invoke('downloadStreamSFTP', data)
  },

  uploadSFile (data) {
    return ipcRenderer.invoke('uploadSFileSFTP', data)
  },

  uploadFile (callback) {
    return ipcRenderer.on('uploadFileSFTP', (event, data) => callback(data))
  },

  uploadStreamStart (data) {
    return ipcRenderer.invoke('uploadStreamStartSFTP', data)
  },

  uploadStreamChunk (data) {
    return ipcRenderer.invoke('uploadStreamChunkSFTP', data)
  },

  uploadStreamEnd (data) {
    return ipcRenderer.invoke('uploadStreamEndSFTP', data)
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

  uploadStream (data) {
    return ipcRenderer.invoke('uploadStreamSFTP', data)
  },

  uploadProgress (callback) {
    return ipcRenderer.on('uploadProgressSFTP', (event, data) => callback(data))
  },

  onProgress (callback) {
    return ipcRenderer.on('onProgressSFTP', (event, data) => callback(data))
  }

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

  downloadSFile (data) {
    return ipcRenderer.invoke('downloadSFileSCP', data)
  },

  downloadFile (data) {
    return ipcRenderer.invoke('downloadFileSCP', data)
  },

  downloadStream (data) {
    return ipcRenderer.invoke('downloadStreamSCP', data)
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

  rename (data) {
    return ipcRenderer.invoke('renameSFTP', data)
  },

  readFile (data) {
    return ipcRenderer.invoke('readFileSCP', data)
  },

  saveFile (data) {
    return ipcRenderer.invoke('saveFileSCP', data)
  },

  uploadStream (data) {
    return ipcRenderer.invoke('uploadStreamSCP', data)
  },

  downloadBatch (data) {
    return ipcRenderer.invoke('downloadBatchSCP', data)
  },
})


contextBridge.exposeInMainWorld("wslTerminal", {

  modifyWSLDebugConfig (data) {
    return ipcRenderer.invoke('modifyWSLDebugConfig', data)
  },

  checkWSLInfo(encoding="utf16le") {
    return ipcRenderer.invoke('checkWSLInfo', encoding)
  },

  getWSLList () {
    return ipcRenderer.invoke('getWSLList')
  },

  getDistributionList () {
    return ipcRenderer.invoke('getDistributionList')
  },

  installSubSystem () {
    return ipcRenderer.invoke('installSubSystem')
  },

  upgradeWSL () {
    return ipcRenderer.invoke('upgradeWSL')
  },

  startSubSystem () {
    return ipcRenderer.invoke('startSubSystem')
  },

  startBGSubSystem () {
    return ipcRenderer.invoke('startBGSubSystem')
  },

  stopSubSystem () {
    return ipcRenderer.invoke('stopSubSystem')
  },

  checkSubSystem () {
    return ipcRenderer.invoke('checkSubSystem')
  },

  installWSL(data) {
    return ipcRenderer.invoke('installWSL', data)
  },

  receive (callback) {
    return ipcRenderer.on('wslSpawnReceive', (event, data) => callback(data))
  },

  startWSL(data) {
    return ipcRenderer.invoke('startWSL', data)
  },

  startBGWSL(data) {
    return ipcRenderer.invoke('startBGWSL', data)
  },

  stopWSL(data) {
    return ipcRenderer.invoke('stopWSL', data)
  },

  restartWSL(data) {
    return ipcRenderer.invoke('restartWSL', data)
  },

  deleteWSL(data) {
    return ipcRenderer.invoke('deleteWSL', data)
  },

  termimalWSL(data) {
    return ipcRenderer.invoke('termimalWSL', data)
  },

  exportWSL(data) {
    return ipcRenderer.invoke('exportWSL', data)
  },

  moveWSL(data) {
    return ipcRenderer.invoke('moveWSL', data)
  },

  execWSL(data) {
    return ipcRenderer.invoke('execWSL', data)
  },

  execSWSL(data) {
    return ipcRenderer.invoke('execSWSL', data)
  },

  dockerLoginWSL(data) {
    return ipcRenderer.invoke('dockerLoginWSL', data)
  },

  readPodmanConfWSL(data) {
    return ipcRenderer.invoke('readPodmanConfWSL', data)
  }

})


contextBridge.exposeInMainWorld("dockerTerminal", {

  checkDockerInfo() {
    return ipcRenderer.invoke('checkDockerInfo')
  },

  connect (data) {
    return ipcRenderer.invoke('connectDocker', data)
  },

  close (uuid) {
    return ipcRenderer.invoke('closeDocker', uuid)
  },

  status (uuid) {
    return ipcRenderer.invoke('statusDocker', uuid)
  }

})


contextBridge.exposeInMainWorld("podmanTerminal", {

  checkPodmanInfo() {
    return ipcRenderer.invoke('checkPodmanInfo')
  },

})


contextBridge.exposeInMainWorld('shortcuts', {

  getShortcutss () {
    return ipcRenderer.invoke('getShortcutss')
  },

  addShortcuts (data) {
    return ipcRenderer.invoke('addShortcuts', data)
  },

  editShortcuts (data) {
    return ipcRenderer.invoke('editShortcuts', data)
  },

  updatesShortcutsById (data) {
    return ipcRenderer.invoke('updatesShortcutsById', data)
  },

  updatesShortcutsByPage (data) {
    return ipcRenderer.invoke('updatesShortcutsByPage', data)
  },

  updatesPageShortcutsByPage (data) {
    return ipcRenderer.invoke('updatesPageShortcutsByPage', data)
  },

  deleteShortcuts (data) {
    return ipcRenderer.invoke('deleteShortcuts', data)
  },

})


contextBridge.exposeInMainWorld('containerTerminal', {
  connect (data) {
    return ipcRenderer.invoke('containerSSHConnect', data)
  },

  close (data) {
    return ipcRenderer.invoke('containerSSHClose', data)
  },

  receiveState (callback) {
    return ipcRenderer.on('containerSSHState', (event, data) => callback(data))
  },

  listDir (data) {
    return ipcRenderer.invoke('containerSSHListDir', data)
  },

  exec (data) {
    return ipcRenderer.invoke('containerSSHExec', data)
  },

  execs (data) {
    return ipcRenderer.invoke('containerSSHExecs', data)
  },

})
