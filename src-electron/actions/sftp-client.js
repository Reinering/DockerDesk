import { readFileSync, mkdirSync } from 'fs'
import * as fs from 'fs'
import path from 'node:path'
import os from 'os'
import { isLocalExists } from '../common/utils.js'
import * as stream from 'node:stream'



const homeDir = os.homedir()
const downloadDir = path.join(homeDir, 'Downloads')


export class SFTPClient {

  constructor(uuid, win, config) {
    this.config = config
    this.uuid = uuid
    this.win = win
    this.sftp = null
    this.stream = null
  }

  async connect() {
    console.log('sftp connecting')
    if (this.status === 'connecting') {
      return
    } else {
      this.status = 'connecting'
    }

    const { default: Client } = await import('ssh2-sftp-client')
    this.sftp = new Client()

    return new Promise((resolve, reject) => {

      this.sftp.connect(this.config)
        .then(() => {

          this.sftp.on('end', () => {
            this.sendDisconnected()
          })

          this.sftp.on('error', (err) => {
            this.sendDisconnected()
          })

          this.status = 'connected'
          console.log('sftp connected')

          resolve()
        })
        .catch((err) => {reject(err)})
    })
  }

  sendDisconnected() {
    this.status = 'disconnected'
    this.win.webContents.send("sftpTerminalReceive",
      JSON.stringify({
        uuid: this.uuid,
        data: "SFTP Terminal disconnected"
      }))
  }

  // 断开连接
  disconnect() {
    if (this.sftp) this.sftp.end()
    this.sendDisconnected()
  }

  // 列出远程目录
  async listDir(remotePath){
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        this.sftp.list(remotePath).then((list) => {
          resolve(
            list.map((item) => {
              const isDir = item.type === 'd'
              return {
                name: item.name,
                permString: formatPermissions(item.longname, isDir),
                isDir: isDir,
                size: item.size,
                mtime: formatDate(item.modifyTime),
              }
            })
          )
        }, (err) => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 执行重命名操作
  async rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      this.sftp.rename(oldPath, newPath).then((reslut) => {
        resolve()
        }, (err) => {
        reject(err)
      })
    })
  }

  // 创建远程文件
  async createRemoteFile(filePath, content = '') {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        this.sftp.put(Buffer.from(content), filePath)
          .then((reslut) => {
            resolve()
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 创建远程文件夹
  async createRemoteFolder(folderPath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))
      try {
        this.sftp.mkdir(folderPath, true).then((result) => {
          resolve()
        }, (err) => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 下载文件
  async downloadSFile(remotePath, localPath=downloadDir) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        const filename = path.basename(remotePath)
        const localFilePath = path.join(localPath, filename)

        isLocalExists(localFilePath, (exists) => {
          if (exists) {
            reject(new Error('File already exists'))
            return
          }

          try {
            this.sftp.get(remotePath, localFilePath)
              .then((result) => {
                resolve('Downloaded')
              }, (err) => {
                reject(err)
              })
          } catch (error) {
            reject(error)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  async downloadFileStream(remotePath, localPath=downloadDir, isProgress=true) {
    if (!this.sftp) throw new Error('SFTP not connected')

    const filename = path.basename(remotePath)
    const localFilePath = path.join(localPath, filename)

    isLocalExists(localFilePath, async (exists) => {
      if (exists) {
        throw new Error('File already exists')
      }

      let lastProgress = 0
      const startTime = Date.now()

      await this.sftp.fastGet(remotePath, localFilePath, {
        step: (total_transferred, chunk, total) => {
          if (isProgress) {
            const progress = parseFloat((total_transferred / total).toFixed(2))

            if (progress - lastProgress > 0.01) {
              lastProgress = progress
              // const now = Date.now()
              // const elapsedTime = (now - startTime) / 1000
              // const speed = total_transferred / elapsedTime
              // const remainingBytes = total - total_transferred
              // const estimatedTimeLeft = remainingBytes / speed

              // 发送进度到渲染进程
              this.win.webContents.send("onProgressSFTP",
                {
                  uuid: this.uuid,
                  file: filename,
                  type: 'download',       // download | upload
                  // total: this.formatBytes(total),
                  // downloaded: this.formatBytes(total_transferred),
                  // speed: this.formatBytes(speed) + '/s',
                  // timeLeft: this.formatTime(estimatedTimeLeft),
                  progress: progress,
                  status: 'doing',   // starting | doing | done | stop
                  error: ''
                })
            }
          }
        }
      })

      if (isProgress) {
        this.win.webContents.send("onProgressSFTP",
          {
            uuid: this.uuid,
            file: filename,
            type: 'download',       // download | upload
            progress: '',
            status: 'done',   // doing | done
            error: ''
          })
      }
    })
  }

  // 下载文件夹
  async downloadFolder1(remotePath, localPath=downloadDir) {
    let localFolder = localPath

    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        const foldername = path.basename(remotePath)
        localFolder = path.join(localFolder, foldername)

        isLocalExists(localFolder, (exists) => {
          if (exists) {
            reject(new Error('Folder already exists'))
            return
          }

          this.sftp.list(remotePath)
            .then((list) => {
              try {
                mkdirSync(localFolder, { recursive: true })

                list.forEach(item => {
                  const childRemotePath = `${remotePath}/${item.name}`
                  let childLocalFolder = localFolder

                  if (item.type === 'd') {
                    this.downloadFolder(childRemotePath, childLocalFolder)
                  } else {
                    this.downloadFileStream(childRemotePath, childLocalFolder, false)
                  }
                })
                resolve()
              } catch (err) {
                reject(err)
              }
            }, (err) => {
              reject(err)
            })
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  async downloadFolder(remotePath, localPath=downloadDir) {
    if (!this.sftp) throw new Error('SFTP not connected')

    let localFolder = localPath

    const foldername = path.basename(remotePath)
    localFolder = path.join(localFolder, foldername)

    let totalBytes = 0
    let transferredBytes = 0
    let lastProgress = 0
    const startTime = Date.now()

    const { files, totalSize } = await this.getRemoteFilesAndSize(remotePath)
    totalBytes = totalSize

    // 确保本地目录存在（使用同步 fs.mkdirSync）
    fs.mkdirSync(localFolder, { recursive: true })

    // 逐个下载文件并监控进度
    for (const file of files) {
      // 正确计算远程路径的相对路径（兼容 Unix 路径）
      const relativePath = path.posix.relative(remotePath, file.path)
      // 转换为本地 Windows 路径
      const localPath = path.join(localFolder, ...relativePath.split('/'))
      const localDirPath = path.dirname(localPath)

      // 确保本地子目录存在
      fs.mkdirSync(localDirPath, { recursive: true })

      await this.sftp.fastGet(file.path, localPath, {
        step: (transferred, chunk, total) => {
          transferredBytes += chunk
          const progress = ((transferredBytes / totalBytes)).toFixed(2)

          if (progress - lastProgress > 0.01) {
            lastProgress = progress
            // const now = Date.now()
            // const elapsedTime = (now - startTime) / 1000
            // const speed = total_transferred / elapsedTime
            // const remainingBytes = total - total_transferred
            // const estimatedTimeLeft = remainingBytes / speed

            // 发送进度到渲染进程
            this.win.webContents.send("onProgressSFTP",
              {
                uuid: this.uuid,
                file: localFolder,
                type: 'download',       // download | upload
                // total: this.formatBytes(total),
                // downloaded: this.formatBytes(total_transferred),
                // speed: this.formatBytes(speed) + '/s',
                // timeLeft: this.formatTime(estimatedTimeLeft),
                progress: progress,
                status: 'doing',   // starting | doing | done | stop
                error: ''
              })
          }
        }
      })
    }

    this.win.webContents.send("onProgressSFTP",
      {
        uuid: this.uuid,
        file: localFolder,
        type: 'download',       // download | upload
        progress: '',
        status: 'done',   // doing | done
        error: ''
      })
  }

  async getRemoteFilesAndSize(remotePath) {
    let totalSize = 0
    const files = []
    const sftp = this.sftp

    async function traverse(currentDir) {
      const list = await sftp.list(currentDir) // 使用 Promise 风格
      for (const entry of list) {
        const fullPath = path.posix.join(currentDir, entry.name)
        if (entry.type === 'd') {
          await traverse(fullPath)
        } else if (entry.type === '-') {
          files.push({ path: fullPath, size: entry.size })
          totalSize += entry.size
        }
      }
    }

    await traverse(remotePath)
    return { files, totalSize }
  }

  async deleteFile(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        this.sftp.delete(remotePath)
          .then(() => {
            resolve()
          }, (err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  async deleteFolder(remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.sftp) return reject(new Error('SFTP not connected'))

      try {
        this.sftp.rmdir(remotePath, true)
          .then(() => {
            resolve()
          }, (err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  async isRemoteExists(remotePath,) {
    return new Promise((resolve, reject) => {
      try {
        this.sftp.exists(remotePath)
          .then((result) => {
            resolve(result)
          }, (err) => {
            reject("file already exists")
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 上传小文件 sftp.fastPut()
  async uploadSFile(remotePath, fileData) {
    if (!this.sftp) throw new Error('SFTP not connected')

    const tempFilePath = path.join(os.tmpdir(), fileData.name)
    await fs.promises.writeFile(tempFilePath, Buffer.from(fileData.buffer))
      .then(() => {
        // const stats = fs.promises.stat(tempFilePath)
        // console.log('Temp file size1:', stats.size)
      })

    return new Promise((resolve, reject) => {
      try {
        this.sftp.fastPut(tempFilePath, remotePath)
          .then(() => {
            fs.promises.unlink(tempFilePath)
            resolve()
          }, (err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 处理文件块
  async uploadFileChunk(remotePath, chunk) {

  }

  // 处理文件传输结束
  async uploadFileEnd(remotePath) {

  }

  async uploadFileStream1(remotePath, localPath) {
    if (!this.sftp) throw new Error('SFTP not connected')

    let totalBytesRead = 0

    const filename = path.basename(localPath)
    // const remoteFilePath = path.join(remotePath, filename)
    const stat = fs.statSync(localPath)

    // 创建文件读取流
    const stream = fs.createReadStream(localPath, { highWaterMark: 1024 * 1024 }) // 1MB 分片
    let lastProgress = 0
    stream.on('data', (chunk) => {
      totalBytesRead += chunk.length
      // console.log("chunk", totalBytesRead, stat.size)
      const progress = parseFloat((totalBytesRead / stat.size).toFixed(2))
      if (progress - lastProgress > 0.01) {
        lastProgress = progress
        // 发送进度到渲染进程
        this.win.webContents.send("uploadProgressSFTP",
          {
            uuid: this.uuid,
            progress: progress,
            status: 'doing',   // starting | doing | done | stop
            error: ''
          })
      }
    })

    // 使用流式上传
    await this.sftp.put(stream, filename, {
      // 可选：监控上传进度（某些库支持）
      step: (transferred, chunk, total) => {
        // 可选择性地在此处发送额外的进度更新
      },
    })

    this.win.webContents.send("uploadProgressSFTP",
      {
        uuid: this.uuid,
        progress: '',
        status: 'done',   // doing | done
        error: ''
      })
  }

  async uploadFileStream(remotePath, localPath, isProgress=true) {
    if (!this.sftp) throw new Error('SFTP not connected')

    const filename = path.basename(localPath)

    let lastProgress = 0
    const startTime = Date.now()

    await this.sftp.fastPut(localPath, path.posix.join(remotePath, filename), {
      step: (total_transferred, chunk, total) => {
        if (isProgress) {
          const progress = parseFloat((total_transferred / total).toFixed(2))

          if (progress - lastProgress > 0.01) {
            lastProgress = progress
            // const now = Date.now()
            // const elapsedTime = (now - startTime) / 1000
            // const speed = total_transferred / elapsedTime
            // const remainingBytes = total - total_transferred
            // const estimatedTimeLeft = remainingBytes / speed

            // 发送进度到渲染进程

            this.win.webContents.send("onProgressSFTP",
              {
                uuid: this.uuid,
                file: filename,
                type: 'upload',       // download | upload
                // total: this.formatBytes(total),
                // downloaded: this.formatBytes(total_transferred),
                // speed: this.formatBytes(speed) + '/s',
                // timeLeft: this.formatTime(estimatedTimeLeft),
                progress: progress,
                status: 'doing',   // starting | doing | done | stop
                error: ''
              })
          }
        }
      }
    })
    if (isProgress) {
      this.win.webContents.send("onProgressSFTP",
        {
          uuid: this.uuid,
          file: filename,
          type: 'upload',       // download | upload
          progress: '',
          status: 'done',   // doing | done
          error: ''
        })
    }
  }

  async uploadFolder1(remotePath, localPath) {
    if (!this.sftp) throw new Error('SFTP not connected')

    let remoteFolder = remotePath
    const foldername = path.basename(localPath)
    // remoteFolder = path.join(remoteFolder, foldername).replace(/\\/g, path.sep)
    remoteFolder = path.posix.join(remoteFolder, foldername)

    await this.sftp.mkdir(remoteFolder, true)

    return new Promise((resolve, reject) => {
      try {
        fs.readdir(localPath, { withFileTypes: true }, (err, list) => {
          if (err) return reject(err)

          try {
            list.forEach(item => {
              const childRemotePath = remoteFolder
              let childLocalFolder = path.posix.join(localPath, item.name)

              if (item.isDirectory()) {
                this.uploadFolder(childRemotePath, childLocalFolder)
              } else {
                this.uploadFileStream(childRemotePath, childLocalFolder, false)
              }
            })

            resolve ()
          } catch (err) {
            reject(err)
          }
        })
      }  catch(error) {
        reject(error)
      }

    })
  }

  async uploadFolder(remotePath, localPath) {
    if (!this.sftp) throw new Error('SFTP not connected')

    let totalBytes = 0
    let transferredBytes = 0
    let lastProgress = 0
    const startTime = Date.now()

    const foldername = path.basename(localPath)
    const remoteDir = path.posix.join(remotePath, foldername)

    // 获取所有文件和总大小
    const { files, totalSize } = await getFilesAndSize(localPath)
    totalBytes = totalSize

    // 确保远程目录存在
    await this.sftp.mkdir(remoteDir, true)

    // 逐个上传文件并监控进度
    for (const file of files) {
      const relativePath = path.relative(localPath, file.path)
      const remotePath = path.join(remoteDir, relativePath).replace(/\\/g, '/')
      const remoteDirPath = path.dirname(remotePath)

      // 确保远程子目录存在
      await this.sftp.mkdir(remoteDirPath, true)

      // 上传文件并监听进度
      await new Promise((resolve, reject) => {
        this.sftp.fastPut(file.path, remotePath, {
          step: (transferred, chunk, total) => {
            transferredBytes += chunk
            const progress = parseFloat((transferredBytes / totalBytes).toFixed(2))

            if (progress - lastProgress > 0.01) {
              lastProgress = progress
              // const now = Date.now()
              // const elapsedTime = (now - startTime) / 1000
              // const speed = total_transferred / elapsedTime
              // const remainingBytes = total - total_transferred
              // const estimatedTimeLeft = remainingBytes / speed

              // 发送进度到渲染进程

              this.win.webContents.send("onProgressSFTP",
                {
                  uuid: this.uuid,
                  file: foldername,
                  type: 'upload',       // download | upload
                  // total: this.formatBytes(total),
                  // downloaded: this.formatBytes(total_transferred),
                  // speed: this.formatBytes(speed) + '/s',
                  // timeLeft: this.formatTime(estimatedTimeLeft),
                  progress: progress,
                  status: 'doing',   // starting | doing | done | stop
                  error: ''
                })
            }
          }
        }).then(resolve).catch(reject)
      })
    }

    this.win.webContents.send("onProgressSFTP",
      {
        uuid: this.uuid,
        file: foldername,
        type: 'upload',       // download | upload
        progress: '',
        status: 'done',   // doing | done
        error: ''
      })
  }
}






// 辅助函数：格式化权限字符串（如果需要自定义）
function formatPermissions(longname, isDir) {
  if (!longname) return '---------'
  const permString = longname.slice(0, 10) // 直接使用 longname 的权限部分，如 'drwxr-xr-x'
  return permString
}

// 辅助函数：将 longname 转换为 mode（数字权限）
function longnameToMode(longname) {
  if (!longname) return 0
  const permString = longname.slice(1, 10) // 跳过类型字符（如 'd'），取 'rwxr-xr-x'
  const permMap = {
    'r': 4,
    'w': 2,
    'x': 1,
    '-': 0,
  }
  let mode = 0
  // 计算 owner 权限
  mode += (permMap[permString[0]] + permMap[permString[1]] + permMap[permString[2]]) * 64 // 8^2
  // 计算 group 权限
  mode += (permMap[permString[3]] + permMap[permString[4]] + permMap[permString[5]]) * 8 // 8^1
  // 计算 other 权限
  mode += permMap[permString[6]] + permMap[permString[7]] + permMap[permString[8]] // 8^0
  return mode // 如 0o644
}

// 辅助函数：格式化日期
function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp) // 源码返回毫秒时间戳
  return date.toISOString().replace('T', ' ').substring(0, 19) // 示例：2025-05-24 07:55:00
}


// 格式化字节
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化时间
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '计算中...'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}


// 递归获取目录中所有文件及其大小
async function getFilesAndSize(dir) {
  let totalSize = 0
  const files = []

  async function traverse(currentDir) {
    const entries = await fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await traverse(fullPath)
      } else {
        const stats = await fs.statSync(fullPath)
        files.push({ path: fullPath, size: stats.size })
        totalSize += stats.size
      }
    }
  }

  await traverse(dir)
  return { files, totalSize }
}
