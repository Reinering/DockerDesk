import { registerClientIpcHandlers } from "./ipc/clientIPC.js"
import { registerNodesIpcHandlers } from "./ipc/nodesIPC.js"
import { registerPreCmdsIpcHandlers } from "./ipc/preCmdsIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"
import { registerSSHIpcHandlers, registerSFTPIpcHandlers } from "./ipc/sshIPC.js"
import { registerDockerIpcHandlers } from "./ipc/dockerIPC.js"
import { registerPodmanIpcHandlers } from "./ipc/podmanIPC.js"
import { registerWSLIpcHandlers } from "./ipc/wslIPC.js"
import { registerShortcutsIpcHandlers } from "./ipc/shortcutsIPC.js"
// import { registerDockerWSLIpcHandlers } from "./ipc/dockerWSLIPC.js"


export function registerIpcHandlers(win) {

  registerClientIpcHandlers(win)

  // registerDBIpcHandlers(win)

  registerNodesIpcHandlers(win)

  registerPreCmdsIpcHandlers(win)

  registerTerminalIpcHandlers(win)

  registerSSHIpcHandlers(win)

  registerSFTPIpcHandlers(win)

  registerWSLIpcHandlers(win)

  // registerDockerWSLIpcHandlers(win)

  registerDockerIpcHandlers(win)

  registerPodmanIpcHandlers(win)

  registerShortcutsIpcHandlers(win)

}


