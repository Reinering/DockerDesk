import path from 'path'
import { fileURLToPath } from 'node:url'
import { clientConfig } from 'src/common/config.js'
import { isLocalExist, cmd, cmd1, devConsole } from './utils.js'
import { app } from 'electron'
import { spawn } from 'child_process'
import iconv from 'iconv-lite'


const isDev = process.defaultApp || process.env.NODE_ENV === 'development'

// 数据库文件路径
let puttyPath

if (isDev) {
  // 开发环境，使用源代码目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  puttyPath = path.resolve(__dirname, clientConfig.putty.path)
} else {
  // 生产环境，使用exe所在目录
  const exeDir = path.dirname(app.getPath('exe'))
  puttyPath = path.resolve(exeDir, clientConfig.putty.path)
}

const plinkEXEPath = path.join(puttyPath, 'plink.exe')
const pscpEXEPath = path.join(puttyPath, 'pscp.exe')
const psftpEXEPath = path.join(puttyPath, 'psftp.exe')
const puttyEXEPath = path.join(puttyPath, 'putty.exe')


export class SCPClient {
  constructor(uuid, win, config) {
    this.uuid = uuid | null
    this.win = win | null
    this.config = config
    this.cmdRunner = new CmdRunner(win, uuid)

  }

  isExist() {
    return isLocalExist(pscpEXEPath)
  }

  async uploadSFile(remotePath, localPath) {
    return cmd(`${pscpEXEPath} -scp -pw ${this.config.password} -P ${this.config.port} ${localPath} ${this.config.username}@${this.config.host}:${remotePath}`, 'utf8')
  }

  async uploadFileStream(remotePath, localPath) {
    const filename = path.basename(localPath)
    this.cmdRunner.filename = filename
    this.cmdRunner.action = "upload"
    return this.cmdRunner.start(pscpEXEPath, ["-scp", "-pw", this.config.password, '-P', this.config.port, localPath, `${this.config.username}@${this.config.host}:${remotePath}`])
  }

  async uploadFolder(remotePath, localPath) {
    const filename = path.basename(localPath)
    this.cmdRunner.filename = filename
    this.cmdRunner.action = "upload"
    return this.cmdRunner.start(pscpEXEPath, ['-scp', '-pw', this.config.password, '-P', this.config.port, '-r', localPath, `${this.config.username}@${this.config.host}:${remotePath}`])
  }

  async downloadFile(remotePath, localPath) {
    const filename = path.basename(localPath)
    return await cmd(`${pscpEXEPath} -scp -pw ${this.config.password} -P ${this.config.port} ${this.config.username}@${this.config.host}:${remotePath} ${localPath} `, 'utf8')
  }

  async downloadFolder(remotePath, localPath) {
    const filename = path.basename(localPath)
    return await cmd(`${pscpEXEPath} -scp -pw ${this.config.password} -r -P ${this.config.port} ${this.config.username}@${this.config.host}:${remotePath} ${localPath} `, 'utf8')
  }

}


export class CmdRunner {
  constructor(win, uuid, options = {}) {
    this.win = win
    this.uuid = uuid
    this.encoding = options.encoding || 'utf8' // 默认编码
    this.process = null // 保存 cmd 进程
    this.isRunning = false // 进程状态
    this.action = ''    // download | upload
    this.filename = ''
  }

  start(command='cmd.exe', options=[], isProgress=true) {
    if (this.isRunning) {
      throw new Error('Cmd Running！')
    }

    return new Promise((resolve) => {
      console.log(command, options)

      this.process = spawn(command, options, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
        windowsHide: true,
      })

      this.isRunning = true

      let stdout = ''
      let stderr = ''

      // 监听输出
      this.process.stdout.on('data', (data) => {
        devConsole(`cmd : ${iconv.decode(Buffer.from(data, 'binary'), 'gbk')}`)
        stdout = iconv.decode(Buffer.from(data, 'binary'), 'gbk')

        if (isProgress) {
          const result = parseProgressLog(stdout)

          if (!result) {
            return
          }

          this.win.webContents.send("onProgressSFTP",
            {
              uuid: this.uuid,
              file: result.filename,
              type: this.action,
              // total: this.formatBytes(total),
              // downloaded: this.formatBytes(total_transferred),
              // speed: this.formatBytes(speed) + '/s',
              // timeLeft: this.formatTime(estimatedTimeLeft),
              progress: parseInt(result.progress) / 100 ,
              status: 'doing',   // starting | doing | done | stop
              error: ''
            })
        }
      })

      // 监听错误
      this.process.stderr.on('data', (data) => {
        devConsole(`cmd error: ${data}`)
        if (isProgress) {
          stderr += data.toString(this.encoding)
        }
      })

      // 监听进程关闭
      this.process.on('close', (code) => {
        devConsole(`cmd exit code: ${code}`)
        if (isProgress) {
          if (code === 0) {
            this.win.webContents.send("onProgressSFTP",
              {
                uuid: this.uuid,
                file: this.filename,
                type: this.action,
                progress: '',
                status: 'done',   // doing | done
                error: ''
              })
          } else {
            this.win.webContents.send("onProgressSFTP",
              {
                uuid: this.uuid,
                file: this.filename,
                type: this.action,
                progress: '',
                status: 'done',   // doing | done
                error: stderr.length > 0 ? stderr : stdout
              })
          }
        }

        this.isRunning = false
        this.filename = ''
      })

      resolve()
    })
  }


  // 停止 cmd 进程
  stop() {
    if (!this.isRunning) {
      return Promise.resolve('Cmd: Process not running')
    }

    return new Promise((resolve) => {
      this.process.stdin.end() // 结束输入流
      this.process.on('close', () => {
        this.isRunning = false
        resolve('Cmd Stopped')
      })
    })
  }

}


function parseProgressLog(log) {
  // 正则表达式，匹配文件名、传输大小（带单位）、速度（带单位）、ETA 时间和进度
  const regex = /^(\S+)\s*\|\s*(\d+\.?\d*)\s*([kMG]?B)\s*\|\s*(\d+\.?\d*)\s*([kMG]?B\/s)\s*\|\s*ETA:\s*(\d{2}:\d{2}:\d{2})\s*\|\s*(\d+)%/

  const match = log.trim().match(regex)

  if (!match) {
    return null // 如果不匹配，返回 null
  }

  return {
    filename: match[1], // 文件名
    size: `${parseFloat(match[2])} ${match[3]}`, // 传输大小，带动态单位（如 kB、MB）
    speed: `${parseFloat(match[4])} ${match[5]}`, // 传输速度，带动态单位（如 kB/s、MB/s）
    eta: match[6], // ETA 时间（hh:mm:ss）
    progress: parseInt(match[7], 10) // 进度（%）
  }
}
