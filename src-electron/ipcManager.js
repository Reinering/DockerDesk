import { registerClientIpcHandlers } from "./ipc/clientIPC.js"
import { registerNodesIpcHandlers } from "./ipc/nodesIPC.js"
import { registerPreCmdsIpcHandlers } from "./ipc/preCmdsIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"
import { registerSSHIpcHandlers, registerSFTPIpcHandlers, registerSCPIpcHandlers } from "./ipc/sshIPC.js"
import { registerWSLIpcHandlers } from "./ipc/wslIPC.js"
import { registerShortcutsIpcHandlers } from "./ipc/shortcutsIPC.js"
import { registerContainerIpcHandlers } from "./ipc/containerIPC.js"


export function registerIpcHandlers(win) {

  registerClientIpcHandlers(win)

  registerNodesIpcHandlers(win)

  registerPreCmdsIpcHandlers(win)

  registerTerminalIpcHandlers(win)

  registerSSHIpcHandlers(win)

  registerSFTPIpcHandlers(win)

  registerSCPIpcHandlers(win)

  registerWSLIpcHandlers(win)

  registerShortcutsIpcHandlers(win)

  registerContainerIpcHandlers(win)

}


