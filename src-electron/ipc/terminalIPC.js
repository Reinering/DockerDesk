import { ipcMain } from 'electron'
import { dockerNodes } from '../actions/dockerNode.js'
import { generateUuid } from '../common/utils.js'
import { interference, encryptPwd } from '../common/encrypt.js'
import log from 'electron-log'


export const ssh_connections = []

export function registerTerminalIpcHandlers() {

  ipcMain.handle('createSSH', () => {

  })

  ipcMain.handle('closeSSH', () => {

  })

}

