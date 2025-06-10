import { shell } from 'electron'

import si from 'systeminformation'
import { cmd, cmd1, totalMemory, platform, arch } from '../common/utils.js'
import { listRegistry } from './reg.js'
import { db } from '../database/manager.js'



export function getOSInfo () {
  return {
    platform: platform,
    arch: arch,
    totalMemory: (totalMemory / 1024 / 1024 / 1024).toFixed(2),  // GB
  }
}

export async function getUtilization () {
  const mem = await si.mem()
  const memoryUsage = (mem.used / mem.total).toFixed(2)

  const load = await si.currentLoad()
  const cpuUsage = load.currentLoad.toFixed(2)

  return {
    cpuUsage: cpuUsage,
    memoryUsage: memoryUsage,
  }
}

export async function getSystemProxy () {

  if (platform === 'win32') {
    const proxy = {}

    try {
      const registryPath = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"
      const result = await listRegistry(registryPath)
      if (result[registryPath]) {
        const values = result[registryPath].values

        const proxyEnable = values.ProxyEnable ? values.ProxyEnable.value : 0
        if (proxyEnable === 0) {
          return proxy
        }

        if (values.ProxyServer) {
          proxy["http"] = values.ProxyServer.value
          proxy["https"] = values.ProxyServer.value
        }

        if (values.ProxyOverride) {
          proxy["byPass"] = values.ProxyOverride.value
        }
      }

      return proxy
    } catch (error) {
      return {}
    }
  } else {
    return {
      http: process.env.HTTP_PROXY || process.env.http_proxy,
      https: process.env.HTTPS_PROXY || process.env.https_proxy
    }
  }
}


// 打开指定目录
function openDirectoryInExplorer(directoryPath) {
  shell.openPath(directoryPath).then(error => {
    if (error) {
      console.error('打开目录失败:', error)
    } else {
      console.log('成功打开目录:', directoryPath)
    }
  })
}


