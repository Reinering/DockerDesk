import { ipcMain } from 'electron'
import { SSHClient, SFTPClient } from '../actions/ssh-client.js'
import { SCPClient } from '../actions/scp-client.js'
import { nodes } from '../actions/nodes.js'
import { generateUuid } from '../common/utils.js'
import { interference, encryptPwd, dencryptPwd } from '../common/encrypt.js'
import log from 'electron-log'


export const ssh_clients = new Map()
export const sftp_clients = new Map()
export const scp_clients = new Map()

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

        // const sshClient = new SSHClient(config)
        const sshClient = new SSHClient(uuid, win, config)

        ssh_clients.set(uuid, sshClient)

        return await sshClient.connect()
          .then((result) => {

            // sshClient.onData((data) => {
            //   win.webContents.send("sshTerminalReceive",
            //     JSON.stringify({
            //       uuid: uuid,
            //       data: data
            //     }))
            // })

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

  ipcMain.handle('detectSSHTerminal', async (event, uuid) => {
    try {
      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)
        if (sshClient.isSftp !== null ) {
          return { success: sshClient.isSftp, error: '' }
        }

        const sftpClient = new SFTPClient(sshClient.config)

        return await sftpClient.connect()
          .then((result) => {
            sftp_clients.set(uuid, sftpClient)
            sshClient.isSftp = true
            return { success: true, error: '' }
          }, (error) => {
            sshClient.isSftp = false
            return { success: false, error: error }
          })
      } else {
        return { success: false, error: "ssh client close error" }
      }
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

        if (sftp_clients.has(uuid)) {
          const sftpClient = sftp_clients.get(uuid)
          sftpClient.disconnect()
          sftp_clients.delete(uuid)
        }

        return { success: true, error: '' }
      } else {
        return { success: false, error: "ssh client close error" }
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
        return { success: false, error: "ssh client resize error" }
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

        if (sshClient.ssh_status === "disconnected" && data === '\r') {
          console.log(uuid, data)
          return await sshClient.reconnect()
            .then((result) => {
              console.log("ssh connect ")
              return { success: true, error: '' }
            }, (error) => {
              return { success: false, error: error }
            })
        } else {
          sshClient.write(data)
        }

        return { success: true, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('sshTerminalExec', async (event, value) => {

  })

}


export function registerSFTPIpcHandlers(win) {

  ipcMain.handle('createSFTPTerminal', async (event, uuid) => {
    console.log("uuid", uuid)
    if (uuid === undefined || uuid === null) {
      return { success: false, error: 'id required' }
    }

    try {
      if (!ssh_clients.has(uuid)) {
        return { success: false, error: 'ssh disconnected' }
      }

      const sshClient = ssh_clients.get(uuid)
      if (sshClient.ssh_status === "disconnected") {
        return { success: false, error: "ssh disconnected" }
      }

      let sftpClient
      if (sftp_clients.has(uuid)) {
        sftpClient = sftp_clients.get(uuid)
      } else {
        sftpClient = new SFTPClient(sshClient.config)
        sftp_clients.set(uuid, sftpClient)
      }

      if (sftpClient.status === "disconnected") {
        return await sftpClient.connect()
          .then((result) => {
            return { success: true, error: '' }
          }, (error) => {
            return { success: false, error: error }
          })
      }

      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('listDirSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.listDir(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('createFileSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.createRemoteFile(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {

      return { success: false, error: error }
    }
  })

  ipcMain.handle('createFolderSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.createRemoteFolder(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadFileSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.downloadFile(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadFileSFTP', async (event, data) => {

  })

  ipcMain.handle('downloadFolderSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.downloadFolder(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadFolderSFTP', async (event, data) => {

  })

  ipcMain.handle('deleteFileSFTP', async (event, data) => {

  })

  ipcMain.handle('deleteFolderSFTP', async (event, data) => {

  })

  ipcMain.handle('renameSFTP', async (event, data) => {
    try {
      const { uuid, newValue, oldValue } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).ssh_status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.rename(oldValue, newValue)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('readFileSFTP', async (event, data) => {

  })

  ipcMain.handle('saveFileSFTP', async (event, uuid) => {

  })
}


export function registerSCPIpcHandlers(win) {

  ipcMain.handle('createSCPTerminal', async (event, uuid) => {
    console.log("uuid", uuid)
    if (uuid === undefined || uuid === null) {
      return { success: false, error: 'id required' }
    }

    try {
      if (!ssh_clients.has(uuid)) {
        return { success: true, error: '' }
      }

      const sshClient = ssh_clients.get(uuid)
      if (sshClient.ssh_status === "disconnected") {
        return { success: false, error: "ssh disconnected" }
      }


      let sftpClient
      if (sftp_clients.has(uuid)) {
        sftpClient = sftp_clients.get(uuid)
      } else {
        sftpClient = new SFTPClient(sshClient.config)
        sftp_clients.set(uuid, sftpClient)
      }

      if (sftpClient.status === "disconnected") {
        return await sftpClient.connect()
          .then((result) => {
            return { success: true, error: '' }
          }, (error) => {
            return { success: false, error: error }
          })
      }

      return { success: true, error: '' }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('listDirSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      const sftpClient = sftp_clients.get(uuid)
      return sftpClient.listDir(remotePath)

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('createFileSCP', async (event, data) => {

  })

  ipcMain.handle('createFolderSCP', async (event, data) => {

  })

  ipcMain.handle('downloadFileSCP', async (event, data) => {

  })

  ipcMain.handle('uploadFileSCP', async (event, data) => {

  })

  ipcMain.handle('downloadFolderSCP', async (event, data) => {

  })

  ipcMain.handle('uploadFolderSCP', async (event, data) => {

  })

  ipcMain.handle('deleteFileSCP', async (event, data) => {

  })

  ipcMain.handle('deleteFolderSCP', async (event, data) => {

  })

  ipcMain.handle('readFileSCP', async (event, data) => {

  })

  ipcMain.handle('saveFileSCP', async (event, uuid) => {

  })
}
