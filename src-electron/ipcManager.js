import { registerClientIpcHandlers } from "./ipc/clientIPC.js"
import { registerNodesIpcHandlers } from "./ipc/nodesIPC.js"
import { registerPreCmdsIpcHandlers } from "./ipc/preCmdsIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"
import { registerSSHIpcHandlers, registerSFTPIpcHandlers } from "./ipc/sshIPC.js"


export function registerIpcHandlers(win) {

  registerClientIpcHandlers(win)

  // registerDBIpcHandlers(win)

  registerNodesIpcHandlers(win)

  registerPreCmdsIpcHandlers(win)

  registerTerminalIpcHandlers(win)

  registerSSHIpcHandlers(win)

  registerSFTPIpcHandlers(win)

}


