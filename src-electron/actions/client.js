import { ipcMain, shell } from 'electron'

import si from 'systeminformation'
import { cmd, cmd1, cmdSync, totalMemory, platform, arch } from '../common/utils.js'






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

export async function getDockerInfo () {
  return cmd('docker -v')
}

export async function getPodmanInfo () {
  return cmd('podman -v')
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


