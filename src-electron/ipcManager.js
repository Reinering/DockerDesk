import { registerDBIpcHandlers } from "./ipc/dbIPC.js"
import { registerTerminalIpcHandlers } from "./ipc/terminalIPC.js"


export function registerIpcHandlers() {
  registerDBIpcHandlers()

  registerTerminalIpcHandlers()
}


