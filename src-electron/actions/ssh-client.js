// import { readFileSync } from 'fs'
import { Client } from 'ssh2'


export class SSHClient {
  constructor(uuid, win, { host, username, password, port }) {
    this.config = { host, username, password, port: port || 22 }
    this.uuid = uuid
    this.win = win
    this.conn = new Client()
    this.stream = null
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
          console.log('Connected')
        }).on('end', () => {
      })
        .on('error', (err) => {
          reject(err)
        }).on('close', () => {
        this.sendDisconnect()
      })
        .connect(this.config)

      resolve()
    })
  }

  reconnect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', async () => {
          this.status = 'connected'
          console.log('Connected')
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


class SFTPClient {
  constructor({ host, username, password, port }) {
    this.config = { host, username, password, port: port || 22 }
    this.conn = new Client()
    this.sftp = null
  }

  // 连接到 SFTP
  connect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', () => {
          this.conn.sftp((err, sftp) => {
            if (err) return reject(err)
            this.sftp = sftp
            resolve('Connected')
          })
        })
        .on('error', (err) => {
          reject(err)
        })
        .connect(this.config)
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
            isDir: item.attrs.isDirectory(),
            size: item.attrs.size,
            mtime: item.attrs.mtime,
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

