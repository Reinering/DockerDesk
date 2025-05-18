import { registerDBIpcHandlers } from "./ipc/dbIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"
import { registerSSHIpcHandlers } from "./ipc/sshIPC.js"
import { BrowserWindow } from 'electron'

export function registerIpcHandlers(win) {

  registerDBIpcHandlers(win)

  registerTerminalIpcHandlers(win)

  registerSSHIpcHandlers(win)
}


