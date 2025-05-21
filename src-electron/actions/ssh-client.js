// import { readFileSync } from 'fs'
import { Client  } from 'ssh2'
import { formatPermissions, formatDate } from '../common/utils.js'


// { host, username, password, port }

export class SSHClient {
  constructor(uuid, win, config) {
    this.config = config
    this.uuid = uuid
    this.win = win
    this.conn = new Client()
    this.stream = null
    this.isSftp = null
    this.status = 'disconnected'       // connecting | connected | disconnected |
  }

  // 连接到 SSH 服务器
  async connect() {
    if (this.status === 'connecting') {
      return
    } else {
      this.status = 'connecting'
    }
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', async () => {
          this.conn.shell((err, stream) => {
            if (err) {
              console.error('SSH shell error:', err)
              this.status = 'disconnected'
              return
            }

            this.stream = stream

            // 将 SSH 输出发送到前端
            stream.on('data', (data) => {
              // console.log(data.toString())
              this.win.webContents.send("sshTerminalReceive",
                JSON.stringify({
                  uuid: this.uuid,
                  data: data.toString()
                }))
            }).stderr.on('data', (data) => {
              this.win.webContents.send("sshTerminalReceive",
                JSON.stringify({
                  uuid: this.uuid,
                  data: data.toString()
                }))
            })

            stream.on('close', () => {
              this.conn.end()
              resolve({ status: 'closed' })
            })
          })

          this.status = 'connected'
          console.log('ssh connected')
        }).on('end', () => {
      }).on('error', (err) => {
        reject(err)
      }).on('close', () => {
      this.sendDisconnect()
      }).connect(this.config)

      resolve()
    })
  }

  reconnect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', async () => {
          this.status = 'connected'
          console.log('ssh connected')
        }).on('error', (err) => {
        reject(err)
      }).on('close', () => {
        this.sendDisconnect()
      }).connect(this.config)

      resolve()
    })
  }

  // 写入数据到 SSH 流
  write(data) {
    console.log('ssh write', data)
    if (this.stream) {
      this.stream.write(data)
    }
  }

  sendDisconnect() {
    this.status = 'disconnected'
    this.win.webContents.send("sshTerminalReceive",
      JSON.stringify({
        uuid: this.uuid,
        data: "Terminal disconnected"
      }))
  }

  // 清理连接
  disconnect() {
    if (this.stream) {
      this.stream.end()
    }
    if (this.conn) {
      this.conn.end()
    }

    this.status = 'Disconnected'
  }
}


export class SFTPClient {
  constructor(config) {
    this.config = config
    this.conn = new Client()
    this.sftp = null
    this.status = 'disconnected'    // connecting | connected | disconnected |
  }

  // 连接到 SFTP
  connect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', () => {
          this.conn.sftp((err, sftp) => {
            if (err) return reject(err)
            this.sftp = sftp
            this.status = 'connected'
            resolve('Connected')
          })
        })
        .on('error', (err) => {
          reject(err)
        }).on('close', () => {
          this.status = 'disconnected'
        }).connect(this.config)
    })
  }

  // 列出远程目录
  listDir(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.readdir(remotePath, (err, list) => {
        if (err) return reject(err)
        resolve(
          list.map((item) => ({
            name: item.filename,
            attrs: item.attrs,
            mode: item.attrs.permissions || item.attrs.mode,
            permString: formatPermissions(item.attrs.mode, item.attrs.isDirectory()),
            nlink: item.attrs.nlink || 2,
            isDir: item.attrs.isDirectory(),
            size: item.attrs.size,
            mtime: formatDate(item.attrs.mtime),
          }))
        )
      })
    })
  }

  // 下载文件
  downloadFile(remotePath, localPath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))
      this.sftp.fastGet(remotePath, localPath, (err) => {
        if (err) return reject(err)
        resolve('Downloaded')
      })
    })
  }

  // 上传文件
  uploadFile(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))
      this.sftp.fastPut(localPath, remotePath, (err) => {
        if (err) return reject(err)
        resolve('Uploaded')
      })
    })
  }

  // 断开连接
  disconnect() {
    if (this.sftp) this.sftp.end()
    if (this.conn) this.conn.end()
  }
}




