import { ipcMain } from 'electron'
import { Terminal } from '../actions/terminal.js'


const terminals = new Map()

export function registerTerminalIpcHandlers(win) {

  ipcMain.handle('createTerminal', async (event, uuid) => {
    try {
      // const term = new Terminal({
      //   onData: data => process.stdout.write(data),
      //   onExit: ({ exitCode, signal }) => console.log(`Terminal exited with code ${exitCode}`),
      // }).start()

      const term = new Terminal(uuid, win).start()

      terminals.set(uuid, term)
      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('closeTerminal', async (event, uuid) => {
    try{
      if (terminals.has(uuid)) {
        const term = terminals.get(uuid)
        term.destroy()
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty uninitialized" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('terminalResize', async (event, data) => {
    try {
      const { uuid, rows, cols } = JSON.parse(data)

      if (terminals.has(uuid)) {
        const term = terminals.get(uuid)
        term.resize(cols, rows)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty uninitialized" }
      }
    } catch (error) {
      console.log(error)
      return { success: false, error: error }
    }
  })

  ipcMain.handle('terminalSend', async (event, value) => {

    try {
      const { uuid, data } = JSON.parse(value)

      if (terminals.has(uuid)) {
        const term = terminals.get(uuid)
        term.write(data)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty uninitialized" }
      }
    } catch (error) {
      console.log(error)
      return { success: false, error: error }
    }
  })


}

