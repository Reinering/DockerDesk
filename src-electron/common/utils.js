import * as fs from 'fs'


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
export function isExists(localPath, callback) {
  fs.access(localPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(false) // 本地路径不存在
      return
    }
    callback(true) // 本地路径存在
  })
}
