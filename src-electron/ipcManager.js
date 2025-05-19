import { registerNodesIpcHandlers } from "./ipc/nodesIPC.js"
import { registerPreCmdsIpcHandlers } from "./ipc/preCmdsIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"
import { registerSSHIpcHandlers } from "./ipc/sshIPC.js"


export function registerIpcHandlers(win) {

  // registerDBIpcHandlers(win)

  registerNodesIpcHandlers(win)

  registerPreCmdsIpcHandlers(win)

  registerTerminalIpcHandlers(win)

  registerSSHIpcHandlers(win)

}


