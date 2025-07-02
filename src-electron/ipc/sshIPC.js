import { ipcMain } from 'electron'
import { SSHClient } from '../actions/ssh-client.js'
import { SFTPClient } from '../actions/sftp-client.js'
import { SCPClient } from '../common/pscp.js'
import { nodes } from '../actions/nodes.js'
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

        const sftpClient = new SFTPClient(uuid, win, sshClient.config)

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

        if (sshClient.status === "disconnected" && data === '\r') {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        sshClient.write(data)

        return { success: true, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('sshTerminalExec', async (event, { uuid, command }) => {
    try {
      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected") {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        sshClient.exec(command).then((result) => {
          const { command, stdout, stderr, code, signal } = result

          if (code !== 0 || stderr) {
            return { success: false, error: `Command failed with code ${code}: ${stderr || stdout}` }
          } else {
            return { success: true, data: stdout, error: '' }
          }
        })
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

}


export function registerSFTPIpcHandlers(win) {

  ipcMain.handle('createSFTPTerminal', async (event, uuid) => {
    if (uuid === undefined || uuid === null) {
      return { success: false, error: 'id required' }
    }

    try {
      if (!ssh_clients.has(uuid)) {
        return { success: false, error: 'ssh disconnected' }
      }

      const sshClient = ssh_clients.get(uuid)
      if (sshClient.status === "disconnected") {
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

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
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

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
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

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
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

  ipcMain.handle('downloadSFileSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.downloadSFile(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadStreamSFTP', async (event, {uuid, remotePath}) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.downloadFileStream(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadSFileSFTP', async (event, { uuid, remotePath, localPath }) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadSFile(remotePath, localPath)
        .then((result) => {
          return { success: true, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadFileSFTP', async (event, data) => {
    try {
      const { uuid, remotePath, localPath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFile(remotePath, localPath)
        .then((result) => {
          return { success: true, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadStreamStartSFTP', async (event, { uuid, remotePath, fileData }) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFileStart(remotePath, fileData)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })
  ipcMain.handle('uploadStreamChunkSFTP', async (event, { uuid, remotePath, chunk }) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFileChunk(remotePath, chunk)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })
  ipcMain.handle('uploadStreamEndSFTP', async (event, { uuid, remotePath }) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFileEnd(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadStreamSFTP', async (event, { uuid, remotePath, localPath }) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFileStream(remotePath, localPath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadFolderSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
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

  ipcMain.handle('uploadFolderSFTP', async (event, {uuid, remotePath, localPath}) => {
    try {
      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.uploadFolder(remotePath, localPath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('deleteFileSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.deleteFile(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('deleteFolderSFTP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
        return { success: false, error: 'ssh disconnected' }
      }

      const sftpClient = sftp_clients.get(uuid)

      if (sftpClient.status === "disconnected") {
        return { success: false, error: 'sftp disconnected' }
      }

      return await sftpClient.deleteFolder(remotePath)
        .then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })

    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('renameSFTP', async (event, data) => {
    try {
      const { uuid, newValue, oldValue } = JSON.parse(data)

      if (!sftp_clients.has(uuid)) {
        return { success: false, error: "sftp disconnected" }
      }

      if (!ssh_clients.has(uuid) || ssh_clients.get(uuid).status === "disconnected") {
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
    if (uuid === undefined || uuid === null) {
      return { success: false, error: 'id required' }
    }

    try {
      if (!ssh_clients.has(uuid)) {
        return { success: false, error: 'ssh disconnected' }
      }

      const sshClient = ssh_clients.get(uuid)
      if (sshClient.status === "disconnected") {
        return { success: false, error: "ssh disconnected" }
      }

      if (!scp_clients.has(uuid)) {
        const scpClient = new SCPClient(uuid, win, sshClient.config)

        return scpClient.isExist().then(() => {
          scp_clients.set(uuid, scpClient)
          return { success: true, error: '' }
        }, () => {
          return { success: false, error: "pscp.exe not exist" }
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

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected") {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.listDir(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('createFileSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected") {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.createFile(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('createFolderSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected") {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.createFolder(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadSFileSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.downloadSFile(remotePath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadFileSCP', async (event, { uuid, remotePath }) => {
    try {
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.downloadFile(remotePath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadStreamSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.downloadFile(remotePath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadSFileSCP', async (event, { uuid, remotePath, localPath }) => {
    try {
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.uploadFile(remotePath, localPath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadFileSCP', async (event, { uuid, remotePath, localPath }) => {
    try {
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.uploadFile(remotePath, localPath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadFolderSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.downloadFolder(remotePath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadFolderSCP', async (event, { uuid, remotePath, localPath }) => {
    try {
      // const { uuid, remotePath, localPath } = JSON.parse(data)

      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.uploadFolder(remotePath, localPath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('deleteFileSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected") {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.deleteFile(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('deleteFolderSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected" && data === '\r') {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.deleteFolder(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('renameSCP', async (event, data) => {
    try {
      const { uuid, newValue, oldValue } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected" && data === '\r') {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.rename(newValue, oldValue)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('readFileSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected" && data === '\r') {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.listDir(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('saveFileSCP', async (event, data) => {
    try {
      const { uuid, remotePath } = JSON.parse(data)

      if (ssh_clients.has(uuid)) {
        const sshClient = ssh_clients.get(uuid)

        if (sshClient.status === "disconnected" && data === '\r') {
          await sshClient.reconnect()
            .then((result) => {

            }, (error) => {
              return { success: false, error: error }
            })
        }

        const result = await sshClient.listDir(remotePath)
        return { success: true, data: result, error: '' }
      } else {
        return { success: false, error: "ssh client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('uploadStreamSCP', async (event, { uuid, remotePath, localPath }) => {
    try {
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.uploadFileStream(remotePath, localPath).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle('downloadBatchSCP', async (event, data) => {
    try {
      const { uuid, remotePath, files } = JSON.parse(data)
      if (scp_clients.has(uuid)) {
        const scpClient = scp_clients.get(uuid)

        return await scpClient.downloadBatch(remotePath, files).then((result) => {
          return { success: true, data: result, error: '' }
        }, (error) => {
          return { success: false, error: error }
        })
      } else {
        return { success: false, error: "scp client write error" }
      }
    } catch (error) {
      return { success: false, error: error }
    }
  })
}
