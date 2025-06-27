import { ipcMain } from 'electron'
import { SSH2Client } from '../actions/ssh-client.js'
import { nodes } from 'app/src-electron/actions/nodes.js'
import { dencryptPwd } from 'app/src-electron/common/encrypt.js'
import { sftp_clients } from 'app/src-electron/ipc/sshIPC.js'
// import { getDockerInfo } from 'app/src-electron/actions/client.js'


export const ssh_clients = new Map()


export function registerContainerIpcHandlers(win) {

  ipcMain.handle('containerSSHConnect', async (event, connID) => {
    if (connID === undefined || connID === null) {
      return { success: false, error: 'id required' }
    }

    if (ssh_clients.has(connID)) {
      const sshClient = ssh_clients.get(connID)

      if (sshClient.status !== "connected") {
        return await sshClient.connect()
          .then((result) => {
            return { success: true, error: '' }
          }, (error) => {
            return { success: false, error: error }
          })
      } else {
        return { success: true, error: '' }
      }
    }

    try {
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
              // 设置环境变量
              env: {
                PATH: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
              }
            }
          }

          const sshClient = new SSH2Client(connID, win, config)

          return await sshClient.connect()
            .then((result) => {

              ssh_clients.set(connID, sshClient)

              sshClient.checkPermissions()

              return { success: true, error: '' }
            }, (error) => {
              return { success: false, error: error }
            })

        }, (error) => {
          return { success: false, error: error }
        }).catch ((error) => {
          throw error
        })
    } catch (err) {
      return { success: false, error: err }
    }
  })

  ipcMain.handle('containerSSHClose', async (event, connID) => {
    try{
      if (ssh_clients.has(connID)) {
        const sshClient = ssh_clients.get(connID)
        sshClient.disconnect()
        ssh_clients.delete(connID)

        return { success: true, error: '' }
      } else {
        return { success: false, error: "ssh client close error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('containerSSHExec', async (event, {connID, command}) => {
    try {
      if (ssh_clients.has(connID)) {
        const sshClient = ssh_clients.get(connID)

        if (sshClient.ssh_status === "disconnected" && command === '\r') {
          return await sshClient.reconnect()
            .then((result) => {
              return { success: true, error: '' }
            }, (error) => {
              return { success: false, error: error }
            })
        } else {
          let cmd = command
          if (command instanceof Array) {
            cmd = command.join(' ')
          }
          return sshClient.execCmd(cmd)
            .then((result) => {
              console.log("result", result)
              return { success: true, data: result }
            }, (error) => {
              console.log("error", error)
              return { success: false, error: error }
            })
        }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('containerSSHExecs', async (event, {connID, command}) => {
    try {
      if (ssh_clients.has(connID)) {
        const sshClient = ssh_clients.get(connID)

        if (sshClient.ssh_status === "disconnected" && command === '\r') {
          return await sshClient.reconnect()
            .then((result) => {
              return { success: true, error: '' }
            }, (error) => {
              return { success: false, error: error }
            })
        } else {
          let result
          if (command instanceof Array) {
            for (const item of command) {
              let cmd = item
              if (command instanceof Array) {
                cmd = item.join(' ')
              }

              result = await sshClient.execCmd(cmd)
                .then((result) => {
                  return { success: true, data: result }
                }, (error) => {
                  return { success: false, error: error }
                })
            }
            return result
          } else {
            return { success: false, error: "ssh client write error" }
          }
        }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

}
