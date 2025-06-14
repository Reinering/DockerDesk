/*
*
* */

import MobileDevice from 'mobile-detect'
import { toRaw, isProxy } from 'vue'

export function myTrim (x) {
  return x.replace(/^\s+|\s+$/gm, '')
}

export function isEmptyProxy (obj) {
  if (isProxy(obj)) {
    // console.log(toString.call(toRaw(obj)))
    // console.log(toRaw(obj))
    // console.log(Object.keys(toRaw(obj)))
    // console.log(Object.keys(toRaw(obj)).length)
    if (Object.keys(toRaw(obj)).length === 0) {
      return true
    } else {
      return false
    }
  } else {
    throw TypeError
  }
}

export function isEmptyObj (obj) {
  return (typeof obj === 'undefined' || obj === null || obj === "")
}

export const isEmptyObject = (obj) => {
  for (let key in obj) {
    return false
  }
  return true
}

export function isEmptyStr (str) {
  if (str != null && myTrim(str).length > 0) {
    return false
  }
  return true
}

export function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 声音
export function play (audio_path) {
  // audio_path "/audio/beep.wav"
  let audio = new Audio(audio_path)
  audio.play()
}

function getDeviceInfo () {
  // 获取设备信息
  const deviceType = window.navigator.userAgent
  // alert(deviceType)
  const x86 = /Windows/.test(deviceType)
  const deviceInfo = {}
  if (x86) {
    deviceInfo.platform = 'Windows'
  } else if (process.env.MODE !== 'electrom') {
    const md = new MobileDevice(deviceType)
    const os = md.os() // 获取系统
    if (os === 'iOS') { // ios系统的处理
      deviceInfo.platform = 'ios'
      deviceInfo.version = md.mobile()
    } else if (os === 'AndroidOS') { // Android系统的处理
      deviceInfo.platform = 'Android'
      // TV 平台版本
      if (deviceType.indexOf("Hi3798") > -1) {
        deviceInfo.version = "TV"
      } else {
        let sss = deviceType.split(";")
        for (let i = 0; i < sss.length; i++) {
          if (sss[i].indexOf("Android") !== -1) {
            let ssss = sss[i].split(' ')
            let j = ssss.indexOf("Android")
            if (j !== -1) {
              deviceInfo.version = ssss[j + 1]
            }
            break
          }
        }
        // let i = sss.contains("Build/")
        // if (i > -1) {
        // deviceInfo.version = sss[i].substring(0, sss[i].indexOf("Build/"))
        // }
      }
    }
  } else {
    deviceInfo.platform = 'linux'
  }
  return deviceInfo
}
export const deviceInfo = getDeviceInfo()

export function findItem (items, item) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].label === item.label && items[i].route === item.route) {
      return items[i]
    }

    if (items[i].children.length > 0) {
      const result = findItem(items[i].children, item)
      if (result !== undefined) {
        return result
      }
    }
  }
  return undefined
}

export const findNaviItemByName = (items, name, prefix='') => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === name) {
      return [items[i], prefix]
    }

    if (items[i].children.length > 0) {
      if (prefix !== '') {
        prefix = prefix + '/' + items[i].route
      } else {
        prefix = items[i].route
      }

      const result = findNaviItemByName(items[i].children, name, prefix)
      if (result !== undefined) {
        return result
      }
    }
  }
  return undefined
}



export function addClass (diffValue) {
  if (diffValue > 0) {
    return "arrow_up"
  } else if (diffValue < 0) {
    return "arrow_down"
  } else {
    return ""
  }
}



export const changeExpansionIcon = (setting) => {
  if (setting.icon === "expand_more") {
    setting.icon = "expand_less"
  } else if (setting.icon === "expand_less") {
    setting.icon = "expand_more"
  }
}


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

export function getResourcePath(filePath) {
  if (process.env.MODE === 'electron') {
    if (process.env.NODE_ENV !== 'development') {
      return filePath
    } else {
      return `src/static/${filePath}`
    }
  }
}

export function firstUpper(word) {
  return word.charAt(0).toUpperCase()
    + word.slice(1)
}
export function firstLower(word) {
  return word.charAt(0).toLowerCase()
    + word.slice(1)
}

export function encodeToBase64(data) {
  const jsonString = JSON.stringify(data)
  // 处理中文等Unicode字符
  const base64Data = btoa(unescape(encodeURIComponent(jsonString)))
  return base64Data
}

export function decodeFromBase64(base64String) {
  const jsonString = decodeURIComponent(escape(atob(base64String)))
  return JSON.parse(jsonString)
}


export function format(str, ...args) {
  console.log("mark", str)
  return str.replace(/\{(\d+)\}/g, (match, index) => args[index] || match)
}
