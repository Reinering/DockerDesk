import * as fs from 'fs'
import { exec, execSync, spawn } from 'child_process'
import readline from 'readline'
import os from 'node:os'
import iconv from 'iconv-lite'
import ini from 'ini'
import * as sudo from 'sudo-prompt'



const dev = true

// 获取总内存（单位：字节）
export const totalMemory = os.totalmem()

// 获取系统类型（操作系统）'win32', 'linux', 'darwin' (macOS)
export const platform = os.platform()

// 获取 CPU 架构 'x64', 'arm', 'arm64', 'ia32'
export const arch = os.arch()

const isWindows = platform === 'win32'


// 指定长度和进制 len: 生成UUID长度,radix: 需要chars中字符集的长度 max:62
export function generateUuid (len = 16, radix = 62) {
  // [0-9][a-z][A-Z]
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [], i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}


// 辅助函数：格式化权限
export function formatPermissions(mode, isDir) {
  const perms = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx']
  const owner = perms[(mode >> 6) & 7]
  const group = perms[(mode >> 3) & 7]
  const others = perms[mode & 7]
  const type = isDir ? 'd' : '-'
  return `${type}${owner}${group}${others}`
}

// 辅助函数：格式化日期为“月日 时:分”
export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000) // 假设 timestamp 是秒
  const month = date.getMonth() + 1 // 月份从 0 开始
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}


// 检查本地文件或文件夹是否存在
export function isLocalExists(localPath, callback) {
  fs.access(localPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(false) // 本地路径不存在
      return
    }
    callback(true) // 本地路径存在
  })
}

export function devConsole (text, debug=dev) {
  if (debug) {
    console.log(text)
  }
}

export async function modifyIniConfig(data, file) {
  let configContent
  try {
    configContent = await fs.readFileSync(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`${file} The file does not exist, a new file will be created`)
      configContent = ''    // 文件不存在时初始化为空
    } else {
      throw err
    }
  }

  const config = ini.parse(configContent)

  Object.keys(data).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(config, key)) {
      config[key] = {}
    }

    Object.keys(data[key]).forEach((k) => {
      config[key][k] = data[key][k]
    })
  })

  const newConfigContent = ini.stringify(config)
  await fs.writeFileSync(file, newConfigContent, 'utf8')
}


// 执行 CMD 命令
export function cmd1(command, encoding='cp936', isAdmin=false) {
  if (command instanceof Array) {
    command = command.join(' ')
  }
  console.log(command)

  const options = { cwd: process.cwd(), windowsHide: true, encoding: 'buffer' }
  if (isAdmin) {
    options["sudo"] = true
    options["admin"] = true
  }

  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(isWindows ? error.message.toString(encoding) : error.message.toString('utf8'))
      }
      if (stderr) {
        return reject(isWindows ? stderr.toString(encoding) : stderr.toString('utf8'))
      }
      return resolve(isWindows ? stdout.toString(encoding) : stdout.toString('utf8'))
    })
  })
}


// 执行 CMD 命令
export function cmd(command, encoding='cp936', isAdmin=false) {
  if (command instanceof Array) {
    command = command.join(' ')
  }

  const options = { cwd: process.cwd(), windowsHide: true, encoding: 'buffer' }
  if (isAdmin) {
    options["sudo"] = true
    options["admin"] = true
  }

  console.log(command)
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        devConsole(`error: ${error.message.toString('utf8')}`)
        return reject(isWindows ? iconv.decode(error.message, encoding) : error.message.toString('utf8'))
      }
      if (stderr && stderr.length > 0) {
        devConsole(`stderr: ${stderr.toString('utf8')}`)
        return reject(isWindows ? iconv.decode(stderr, encoding) : stderr.toString('utf8'))
      }

      devConsole(`stdout: ${stdout.toString('utf8')}`)
      return resolve(isWindows ? iconv.decode(stdout, encoding) : stderr.toString('utf8'))
    })
  })
}


// 执行 CMD 命令
export function cmdAdmin(command, encoding='cp936', isAdmin=false) {
  if (command instanceof Array) {
    command = command.join(' ')
  }

  const options = { cwd: process.cwd(), windowsHide: true, encoding: 'buffer' }
  if (isAdmin) {
    options["sudo"] = true
    options["admin"] = true
  }

  console.log(command)
  return new Promise((resolve, reject) => {
    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        devConsole(`error: ${error.message.toString('utf8')}`)
        return reject(isWindows ? iconv.decode(error.message, encoding) : error.message.toString('utf8'))
      }
      if (stderr && stderr.length > 0) {
        devConsole(`stderr: ${stderr.toString('utf8')}`)
        return reject(isWindows ? iconv.decode(stderr, encoding) : stderr.toString('utf8'))
      }

      devConsole(`stdout: ${stdout.toString('utf8')}`)
      return resolve(isWindows ? iconv.decode(stdout, encoding) : stderr.toString('utf8'))
    })
  })
}


export function cmdSpawn(command, encoding='cp936') {


}


export function cmdSync(command) {
  if (command instanceof Array) {
    command = command.join(' ')
  }

  return new Promise((resolve, reject) => {
    try {
      // 执行 CMD 命令并获取输出
      const output = execSync(command, { encoding: 'binary' })
      resolve(isWindows ? iconv.decode(output, 'cp936') : output.toString('utf8'))
    } catch (error) {
      // console.error(`执行错误: ${error.message}`)
      // console.error(`标准错误: ${error.stderr}`)
      reject(isWindows ? iconv.decode(error.message, 'cp936') : error.message.toString('utf8'))
    }
  })
}


export class CmdRunner {
  constructor(win, uuid, options = {}) {
    this.encoding = options.encoding || 'utf8' // 默认编码
    this.win = win || null
    this.uuid = uuid || null
    this.cmd = null // 保存 cmd 进程
    this.isRunning = false // 进程状态
  }

  // 启动 cmd 进程
  start(command='cmd.exe', options=[]) {
    if (this.isRunning) {
      throw new Error('Cmd Running！')
    }

    devConsole(`'🚀 启动 WSL:', ${command}, ${options.join(' ')}`)

    this.cmd = spawn(command, options, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false
    })
    this.isRunning = true

    // 设置编码
    this.cmd.stdout.setEncoding(this.encoding)
    this.cmd.stderr.setEncoding(this.encoding)

    // 返回 Promise，方便异步操作
    return new Promise((resolve) => {
      // 监听输出
      this.cmd.stdout.on('data', (data) => {
        devConsole(`cmd : ${data}`)
        this.win.webContents.send("cmdRunnerReceive",
          JSON.stringify({
            type: "stdout",
            uuid: this.uuid,
            data: data
          }))
      })

      // 监听错误
      this.cmd.stderr.on('data', (data) => {
        devConsole(`cmd error: ${data}`)
        this.win.webContents.send("cmdRunnerReceive",
          JSON.stringify({
            type: "stderr",
            uuid: this.uuid,
            data: data
          }))
      })

      // 监听进程关闭
      this.cmd.on('close', (code) => {
        this.isRunning = false
        devConsole(`cmd exit code: ${code}`)
        this.win.webContents.send("cmdRunnerReceive",
          JSON.stringify({
            type: "close",
            uuid: this.uuid,
            code: code
          }))
      })

      // 确保进程启动
      resolve(this)
    })
  }

  // 发送命令
  sendCommand1(command) {
    if (!this.isRunning) {
      throw new Error('Cmd: The process has not been started! Please call the start method first')
    }

    return new Promise((resolve, reject) => {
      // 发送命令并添加换行符
      this.cmd.stdin.write(`${command}\n`)

      // 监听输出（这里可以根据需要扩展，例如收集特定输出）
      const onData = (data) => {
        resolve(data.toString())
        this.cmd.stdout.off('data', onData) // 移除监听，避免重复触发
      }

      this.cmd.stdout.on('data', onData)

      // 错误处理
      this.cmd.stderr.once('data', (data) => {
        reject(new Error(`Cmd Error: ${data}`))
      })
    })
  }

  // 发送命令
  sendCommand(command) {
    if (!this.isRunning) {
      throw new Error('Cmd: The process has not been started! Please call the start method first')
    }

    // 发送命令并添加换行符
    this.cmd.stdin.write(`${command}\n`)
  }

  // 停止 cmd 进程
  stop() {
    if (!this.isRunning) {
      return Promise.resolve('Cmd: Process not running')
    }

    return new Promise((resolve) => {
      this.cmd.stdin.end() // 结束输入流
      this.cmd.on('close', () => {
        this.isRunning = false
        resolve('Cmd Stopped')
      })
    })
  }

  // 连续发送多条命令
  async runCommands(commands) {
    if (!this.isRunning) {
      await this.start()
    }

    const results = []
    for (const command of commands) {
      try {
        const result = await this.sendCommand1(command)
        results.push({ command, result })
      } catch (error) {
        results.push({ command, error: error.message })
      }
    }
    return results
  }
}



