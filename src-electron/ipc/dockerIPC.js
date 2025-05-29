import { ipcMain } from 'electron'
import { SSHClient } from '../actions/ssh-client.js'
import { DockerNode } from '../actions/docker.js'
import { nodes } from 'app/src-electron/actions/nodes.js'
import { dencryptPwd } from 'app/src-electron/common/encrypt.js'
import { sftp_clients } from 'app/src-electron/ipc/sshIPC.js'


export const ssh_clients = new Map()


export function registerDockerIpcHandlers(win) {

  ipcMain.handle('connectDocker', async (event, {uuid, connID}) => {
    if (connID === undefined || connID === null) {
      return { success: false, error: 'id required' }
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
            }
          }

          const sshClient = new SSHClient(uuid, win, config)

          ssh_clients.set(uuid, sshClient)

          return await sshClient.connect()
            .then((result) => {
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


  ipcMain.handle('closeDocker', async (event, uuid) => {
    try{
      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)
        sshClient.disconnect()
        ssh_clients.delete(uuid)

        return { success: true, error: '' }
      } else {
        return { success: false, error: "docker client close error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('statusDocker', async (event, uuid) => {
    try {
      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)


        // sshClient.resize(cols, rows)


        return { success: true, error: '' }
      } else {
        return { success: false, error: "ssh client resize error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }



  })














}
