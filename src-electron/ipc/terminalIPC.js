import { ipcMain } from 'electron'
import { Terminal } from '../actions/terminal.js'


export const terminals = new Map()

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

  ipcMain.handle('createWSLTerminal', async (event, {uuid, name, user, }) => {
    try {
      const cmd = `wsl -d ${name} --user ${user}`
      const term = new Terminal(uuid, win, cmd).start()

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
        terminals.delete(uuid)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty close error" }
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
        return { success: false, error: "node-pty resize error" }
      }
    } catch (error) {
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
        return { success: false, error: "node-pty write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('execTerminal', async (event, {uuid, cmd}) => {
    try {
      const term = new Terminal(uuid, win, cmd).start()

      terminals.set(uuid, term)
      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

}

