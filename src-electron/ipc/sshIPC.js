import { ipcMain } from 'electron'
import { SSHClient } from '../actions/ssh-client.js'
import { nodes } from '../actions/nodes.js'
import { generateUuid } from '../common/utils.js'
import { interference, encryptPwd, dencryptPwd } from '../common/encrypt.js'
import log from 'electron-log'


export const ssh_clients = new Map()

export function registerSSHIpcHandlers(win) {

  ipcMain.handle('createSSHTerminal', async (event, data) => {
    try{
      const { uuid, connID } = JSON.parse(data)

      if (connID === undefined || connID === null) {
        return { success: false, error: 'id required' }
      }

      return nodes.getNodeByID(connID)
        .then(async (nodes) => {
         if (nodes.length === 0) {
           return { success: false, error: 'uuid not found' }
         }
         let config
         if (nodes[0].auth_type === 'password') {
           config = {
             host: nodes[0].address,
             port: nodes[0].port,
             username: nodes[0].username,
             password: dencryptPwd(nodes[0].password),
           }
         } else if (nodes[0].auth_type === 'key') {
           config = {
             host: nodes[0].address,
             port: nodes[0].port,
             username: nodes[0].username,
             privateKey: dencryptPwd(nodes[0].key),
           }
         }

        const sshClient = new SSHClient(config)

        ssh_clients.set(uuid, sshClient)

        return await sshClient.connect()
          .then((result) => {
            console.log("ssh connect ", result)

            sshClient.onData((data) => {
              win.webContents.send("sshTerminalReceive",
                JSON.stringify({
                  uuid: uuid,
                  data: data
                }))
            })

            return { success: true, error: '' }
          }, (error) => {
            return { success: false, error: error }
          })
      }, (error) => {
        return { success: false, error: error }
      }).catch ((error) => {
          throw error
      })
    } catch (error) {
      return { success: false, error: error }
    }

  })

  ipcMain.handle('closeSSHTerminal', async (event, uuid) => {
    try{
      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)
        sshClient.disconnect()
        ssh_clients.delete(uuid)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty close error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('sshTerminalResize', async (event, data) => {
    try {
      const { uuid, rows, cols } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)
        sshClient.resize(cols, rows)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty resize error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('sshTerminalSend', async (event, value) => {
    try {
      const { uuid, data } = JSON.parse(value)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)
        sshClient.write(data)
        return { success: true, error: '' }
      } else {
        return { success: false, error: "node-pty write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

}

