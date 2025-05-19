import { readFileSync } from 'fs'
import { Client } from 'ssh2'
import path from 'node:path'
import * as pty from 'node-pty'


export class SSHClient {
  constructor({ host, username, password, port }) {
    this.config = { host, username, password, port: port || 22 }
    this.conn = new Client()
    this.ptyProcess = null
    this.stream = null
    this.shell = 'bash' // 默认值，稍后动态更新
  }

  // 连接到 SSH 服务器
  async connect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', async () => {
          await this._detectShell() // 检测远程 shell
          this._startShell()
            .then(() => resolve('Connected'))
            .catch(reject)
          console.log('Connected')
          this.conn.end()
        })
        .on('error', (err) => {
          reject(err)
        })
        .connect(this.config)
    })
  }

  // 检测远程默认 shell
  async _detectShell() {
    return new Promise((resolve, reject) => {
      this.conn.exec('echo $SHELL', (err, stream) => {
        if (err) return reject(err)
        let shellData = ''
        stream
          .on('data', (data) => {
            shellData += data.toString()
          })
          .on('close', () => {
            const shellPath = shellData.trim() // 例如 /bin/bash 或 /bin/sh
            const shellName = path.basename(shellPath) || 'bash' // 提取 shell 名称，默认为 bash
            this.shell = shellName
            resolve()
          })
          .stderr.on('data', () => {}) // 忽略 stderr
      })
    })
  }

  // 启动 SSH shell 会话
  _startShell() {
    return new Promise((resolve, reject) => {
      this.conn.shell((err, stream) => {
        if (err) return reject(err)
        this.stream = stream
        this.ptyProcess = pty.spawn(this.shell, [], {
          name: 'xterm-color',
          cols: 80,
          rows: 24,
          cwd: process.env.HOME,
          env: process.env,
        })
        this.stream.on('data', (data) => {
          this.ptyProcess.write(data)
        })
        this.stream.on('close', () => {
          this.ptyProcess.kill()
          this.conn.end()
        })
        resolve()
      })
    })
  }

  // 获取 PTY 数据（供渲染进程订阅）
  onData(callback) {
    if (this.ptyProcess) {
      this.ptyProcess.on('data', callback)
    }
  }

  // 写入数据到 SSH 流
  write(data) {
    if (this.stream) {
      this.stream.write(data)
    }
  }

  // 调整终端大小
  resize(cols, rows) {
    if (this.ptyProcess) {
      if (cols > 0 && rows > 0) {
        this.ptyProcess.resize(cols, rows)
      } else {
        console.error('Invalid cols or rows:', cols, rows)
      }
      this.ptyProcess.resize(cols, rows)
    }
  }

  // 清理连接
  disconnect() {
    if (this.stream) {
      this.stream.end()
    }
    if (this.conn) {
      this.conn.end()
    }
    if (this.ptyProcess) {
      this.ptyProcess.kill()
    }
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
