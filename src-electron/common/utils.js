import * as fs from 'fs'
import { exec, execSync, spawn } from 'child_process'
import os from 'node:os'
import iconv from 'iconv-lite'


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


// 执行 CMD 命令
export function cmd(command) {
  if (command instanceof Array) {
    command = command.join(' ')
  }

  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd(), encoding: 'binary' }, (error, stdout, stderr) => {
      if (error) {
        // console.error(`执行错误: ${error.message}`)
        return reject(isWindows ? iconv.decode(error.message, 'cp936') : error.message.toString('utf8'))
      }
      if (stderr) {
        // console.error(`标准错误: ${stderr}`)
        return reject(isWindows ? iconv.decode(stderr, 'cp936') : stderr.toString('utf8'))
      }
      // console.log(`命令输出: ${stdout}`)
      return resolve(isWindows ? iconv.decode(stdout, 'cp936') : stdout.toString('utf8'))
    })
  })
}


// 执行 CMD 命令
export function cmd1(command) {
  if (command instanceof Array) {
    command = command.join(' ')
  }

  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd(), encoding: 'binary' }, (error, stdout, stderr) => {
      if (error) {
        // console.error(`执行错误: ${error.message}`)
        return reject(isWindows ? iconv.decode(error.message, 'cp936') : error.message.toString('utf8'))
      }
      if (stderr) {
        // console.error(`标准错误: ${stderr}`)
        return reject(isWindows ? iconv.decode(stderr, 'cp936') : stderr.toString('utf8'))
      }
      // console.log(`命令输出: ${stdout}.toString('utf8')`)
      return resolve(stdout.toString('utf8'))
    })
  })
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


