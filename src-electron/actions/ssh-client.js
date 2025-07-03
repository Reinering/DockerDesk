import { readFileSync, mkdirSync } from 'fs'
import * as fs from 'fs'
import { Client } from 'ssh2'
import path from 'node:path'
import os from 'os'
import {
  devConsole,
  formatPermissions,
  formatDate,
  isLocalExists,
  parseListDir,
  detectEncoding
} from '../common/utils.js'
import iconv from 'iconv-lite'
import chardet from 'chardet'


const homeDir = os.homedir()
const downloadDir = path.join(homeDir, 'Downloads')


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
              const encoding = detectEncoding(data)

              this.win.webContents.send("sshTerminalReceive",
                JSON.stringify({
                  uuid: this.uuid,
                  data: iconv.decode(Buffer.from(data, 'binary'), encoding)
                }))
            })

            stream.stderr.on('data', (data) => {
              const encoding = detectEncoding(data)

              this.win.webContents.send("sshTerminalReceive",
                JSON.stringify({
                  uuid: this.uuid,
                  data: iconv.decode(Buffer.from(data, 'binary'), encoding)
                }))
            })

            stream.on('close', () => {
              // this.conn.end()
              // resolve({ status: 'closed' })
            })
          })

          this.status = 'connected'
          console.log('ssh connected')
        }).on('end', () => {
        }).on('error', (err) => {
          reject(err)
        }).on('close', () => {
        this.sendDisconnected()
        }).connect(this.config)
      resolve()
    })
  }

  exec(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) return reject(err)

        let stdout = ''
        let stderr = ''

        stream.on('data', (data) => {
          devConsole(data.toString())
          stdout += iconv.decode(Buffer.from(data, 'binary'), 'gbk') // 收集 STDOUT
        })
        stream.stderr.on('data', (data) => {
          devConsole(data.toString())
          stderr += iconv.decode(Buffer.from(data, 'binary'), 'gbk') // 收集 STDERR
        })
        stream.on('close', (code, signal) => {
          devConsole(`Command "${command}" finished with code ${code}, signal ${signal}`)
          resolve({ command, stdout, stderr, code, signal })
        })
      })
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
        this.sendDisconnected()
      }).connect(this.config)

      resolve()
    })
  }

  // 写入数据到 SSH 流
  write(data) {
    // console.log('ssh write', data)
    if (this.stream) {
      this.stream.write(data)
    }
  }

  sendDisconnected() {
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

  async listDir(remotePath){
    try {
      const result = await this.exec(`ls -la "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return parseListDir(result.stdout)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createFile(remotePath){
    try {
      const result = await this.exec(`touch "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return result.stdout
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createFolder(remotePath){
    try {
      const result = await this.exec(`mkdir -p "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return result.stdout
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteFile(remotePath){
    try {
      const result = await this.exec(`rm "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return result.stdout
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async deleteFolder(remotePath){
    try {
      const result = await this.exec(`rm -r "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return result.stdout
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async rename(newValue, oldValue) {
    try {
      const result = await this.exec(`mv "${oldValue}" "${newValue}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return result.stdout
    } catch (error) {
      throw new Error(error.message)
    }
  }
}


export class SFTPClient {
  constructor(uuid, win, config) {
    this.config = config
    this.uuid = uuid
    this.win = win
    this.conn = new Client()
    this.sftp = null
    this.status = 'disconnected'    // connecting | connected | disconnected |
    this.activeUploads = new Map()  // 存储当前上传文件的 SFTP 流和连接
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
          this.activeUploads.clear()
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

  // 执行重命名操作
  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.rename(oldPath, newPath, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  // 创建远程文件
  createRemoteFile(filePath, content = '') {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      return this.sftp.writeFile(filePath, content, { encoding: 'utf8' }, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  // 创建远程文件夹
  createRemoteFolder(folderPath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.mkdir(folderPath, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  // 下载文件
  downloadFile(remotePath, localPath=downloadDir) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      const filename = path.basename(remotePath)
      const localFilePath = path.join(localPath, filename)

      isLocalExists(localFilePath, (exists) => {
        if (exists) {
          reject(new Error('File already exists'))
          return
        }

        try {
          this.sftp.fastGet(
            remotePath,
            localFilePath,
            (err) => {
              if (err) return reject(err)
              resolve('Downloaded')
            })
        } catch (error) {
          reject(error)
        }
      })

    })
  }

  // 下载文件夹
  downloadFolder(remotePath, localPath=downloadDir) {
    let localFolder = localPath

    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.readdir(remotePath, (err, list) => {
        if (err) {
          if (err) return reject(err)
        }

        const foldername = path.basename(remotePath)
        localFolder = path.join(localFolder, foldername)

        isLocalExists(localFolder, (exists) => {
          if (exists) {
            reject(new Error('Folder already exists'))
            return
          }

          try {
            mkdirSync(localFolder, { recursive: true })

            list.forEach(item => {

              const childRemotePath = `${remotePath}/${item.filename}`
              let childLocalFolder = localFolder

              if (item.attrs.isDirectory()) {
                this.downloadFolder(childRemotePath, childLocalFolder)
              } else {
                this.downloadFile(childRemotePath, childLocalFolder)
              }
            })
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      })
    })
  }

  // 上传小文件 sftp.fastPut()
  uploadSFile(remotePath, fileData) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))
      // console.log('ArrayBuffer size:', fileData.buffer.byteLength)

      this.isRemoteExists(remotePath)
        .then(async (result) => {
          const tempFilePath = path.join(os.tmpdir(), fileData.name)

          await fs.promises.writeFile(tempFilePath, Buffer.from(fileData.buffer))
            .then(() => {
              // const stats = fs.promises.stat(tempFilePath)
              // console.log('Temp file size1:', stats.size)
            })

          this.sftp.fastPut(tempFilePath, remotePath, (err)=> {
            if (err) {
              reject(err)
            } else {
              fs.promises.unlink(tempFilePath)
              resolve()
            }
          })
        }, (err) => {
          reject(err)
        })
    })
  }

  // 上传小文件 sftp.fastPut()
  async uploadSFile1(remotePath, fileData) {
    if (!this.sftp) throw new Error('SFTP not connected')
    console.log('ArrayBuffer size:', fileData.buffer)

    const tempFilePath = path.join(os.tmpdir(), fileData.name)
    await fs.promises.writeFile(tempFilePath, Buffer.from(fileData.buffer))
      .then(() => {
        // const stats = fs.promises.stat(tempFilePath)
        // console.log('Temp file size1:', stats.size)
      })

    return new Promise((resolve, reject) => {
      try {
        this.sftp.fastPut(tempFilePath, remotePath, (err)=> {
          if (err) {
            reject(err)
          } else {
            fs.promises.unlink(tempFilePath)
            resolve()
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 上传大文件
  uploadFile(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.fastPut(localPath, remotePath, (err) => {
        if (err) return reject(err)
        resolve('Uploaded')
      })

    })
  }

  async uploadFileStart(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        const writeStream = this.sftp.createWriteStream(remotePath)

        this.activeUploads.set(remotePath, writeStream)

        writeStream.on('data', (chunk) => {

        }).on('error', (error) => {
          this.activeUploads.delete(remotePath)
          this.win.webContents.send("uploadFileSFTP",
            JSON.stringify({
              uuid: this.uuid,
              data: "Stream disconnected",
              error: error
            }))
        }).on('end', () => {

        })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // 处理文件块
  async uploadFileChunk(remotePath, chunk) {

    return new Promise((resolve, reject) => {
      try {
        const writeStream = this.activeUploads.get(remotePath)
        if (writeStream) {
          const buffer = Buffer.from(chunk)
          writeStream.write(buffer)
          resolve()
        } else {
          reject(new Error('writeStream not Found'))
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  // 处理文件传输结束
  async uploadFileEnd(remotePath) {

    return new Promise((resolve, reject) => {
      try {

        const writeStream = this.activeUploads.get(remotePath)
        if (writeStream) {
          writeStream.end(() => {
            this.activeUploads.delete(remotePath)

            resolve()
          })
        } else {
          reject(new Error('writeStream not Found'))
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  // 上传文件夹
  uploadFolder(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.fastPut(localPath, remotePath, (err) => {
        if (err) return reject(err)
        resolve('Uploaded')
      })
    })
  }

  deleteFile(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.unlink(remotePath, (err) => {
        if (err) return reject(err)
        resolve('file deleted')
      })
    })
  }

  deleteFolder(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.readdir(remotePath, (err, list) => {
        if (err) return reject(err)

        Promise.all(
          list.map(item => {
            const childRemotePath = `${remotePath}/${item.filename}`
            return item.attrs.isDirectory()
              ? this.deleteFolder(childRemotePath)
              : this.deleteFile(childRemotePath)
          })
        )
          .then(() => {
            this.sftp.rmdir(remotePath, err => {
              if (err) return reject(err)
              resolve('folder deleted')
            })
          })
          .catch(err => reject(err))
      })
    })
  }

  isRemoteExists(remotePath,) {
    return new Promise((resolve, reject) => {
       this.sftp.stat(remotePath, (err, stats) => {
        if (err) {
          resolve(stats)
        } else {
          reject("file already exists")
        }
      })
    })
  }


  // 断开连接
  disconnect() {
    if (this.sftp) this.sftp.end()
    if (this.conn) this.conn.end()
  }
}


export class SSH2Client {
  constructor(uuid, win, config) {
    this.config = config
    this.uuid = uuid
    this.win = win
    this.conn = new Client()
    this.stream = null
    this.isSudo = true
    this.status = 'disconnected'       // connecting | connected | disconnected |
  }

  // 连接到 SSH 服务器
  async connect() {
    if (this.status === 'connected') {
      return
    } else {
      this.status = 'connecting'
    }
    return new Promise((resolve, reject) => {
      this.conn
        .on('ready', async () => {
          this.status = 'connected'
          console.log("ssh connected")
          resolve()
      }).on('end', () => {

      }).on('error', (err) => {
        reject(err)
      }).on('close', () => {
        reject()
        this.sendDisconnected()
      }).connect(this.config)
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
        this.sendDisconnected()
      }).connect(this.config)

      resolve()
    })
  }

  sendDisconnected() {
    this.status = 'disconnected'
    this.win.webContents.send("containerSSHState",
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

  exec(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) return reject(err)

        let stdout = ''
        let stderr = ''

        stream.on('close', (code, signal) => {
          resolve({ stdout, stderr, code, signal })
        }).on('data', (data) => {
          stdout += data
        }).stderr.on('data', (data) => {
          stderr += data
        })
      })
    })
  }

  async checkPermissions() {
    if (this.isSudo !== null) {
      return
    }

    try {
      // 检查是否为 root 用户
      const whoami = await this.exec('whoami')
      if (whoami.stdout.trim() === 'root') {
        this.isSudo = false
      }

      // 检查无密码 sudo
      const sudoTest = await this.exec('sudo -n true 2>/dev/null && echo "success"')
      if (sudoTest.stdout.includes('success')) {
        this.isSudo = true
      }

      // 检查 sudo 权限
      const sudoList = await this.exec('sudo -l 2>/dev/null | head -1');
      if (sudoList.stdout.includes('User') || sudoList.stderr.includes('password')) {
        this.isSudo = true
      } else {
        this.isSudo = false
      }
    } catch (error) {
      this.isSudo = false
    }
  }

  async execCmd(cmd) {
    if (this.status !== 'connected') {
      await this.reconnect()
    }

    let command = cmd
    if (this.isSudo) {
      command = `sudo ${cmd}`
    }

    devConsole(command)

    return new Promise((resolve, reject) => {
      this.conn.exec(
        `export PATH=/usr/local/bin:$PATH && ${command}`,
        {
          pty: true,
        },
        (err, stream) => {
        if (err) return reject(err)

        let stdout = ''
        let stderr = ''
        let sudoPromptDetected = false

        stream.on('data', (data) => {
          const dataStr = data.toString()
          stdout += dataStr

          devConsole("stdout", dataStr)

          // 检测 sudo 提示
          if (!sudoPromptDetected && this.isSudo && /password for.*:|sudo.*password|Password:|[sudo]/i.test(dataStr)) {
            sudoPromptDetected = true
            stdout = ''
            stream.stdin.write(`${this.config.password}\n`)
            devConsole("sudo Mark")
          }
        })

        stream.stderr.on('data', (data) => {
          devConsole("stderr", data.toString())
          stderr += data.toString() // 收集 STDERR
        })

        stream.on('close', (code) => {
          if (code !== 0 || stderr) {
            reject(`Command failed with code ${code}: ${stderr || stdout}`)
          } else {
            resolve(stdout)
          }
        })
      })
    })
  }

  async listDir(remotePath){
    try {
      const result = await this.exec(`ls -la "${remotePath}"`)

      if (result.stderr && result.code !== 0) {
        throw new Error(result.stderr)
      }

      return parseListDir(result.stdout)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
