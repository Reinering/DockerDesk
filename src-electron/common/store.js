import path from 'path'
import { fileURLToPath } from 'node:url'
import { clientConfig } from 'src/common/config.js'
import { app } from 'electron'
import fs from 'fs'
import { db } from 'app/src-electron/database/manager.js'

const isDev = process.defaultApp || process.env.NODE_ENV === 'development'

// 商店文件路径
let storeDir

if (isDev) {
  // 开发环境，使用源代码目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  storeDir = path.resolve(__dirname, clientConfig.appStore.storeData.path)
} else {
  // 生产环境，使用exe所在目录
  const exeDir = path.dirname(app.getPath('exe'))
  storeDir = path.resolve(exeDir,clientConfig.appStore.storeData.path)
}

const storePath = path.join(storeDir, clientConfig.appStore.storeData.filename)

export async function getStoreApis () {
  return await db('settings')
    .where('delete_flags', '!=', '1')
    .andWhere('field', '=', "storeApis")
    .select('*').then(
      row => {
        return row
      }, (error) => {
        return { success: false, error: error }
      })
    .catch(error => {
      return { success: false, error: error }
    })
}

export async function setStoreApis (data) {
  data["modify_time"] = Date.now()
  return await db('settings').where('field', '=', "storeApis").update(
    {
      value: data,
      modify_time: Date.now()
    }
  ).then((result) => {
    if (result === 0) return { success: false, error: '' }
    return { success: true, error: '' }
  }).catch(error => {
    return { success: false, error: error }
  })
}

export function readStoreData () {
  if (! fs.existsSync(storePath)) {
    return { success: false, error: 'File not Found' }
  }

  const data = fs.readFileSync(storePath, { encoding: 'utf-8' })

  return { success: true, data, error: '' }
}

export function writeStoreData (data) {
  console.log("data", data)
  try {
    fs.writeFileSync(storePath, data)

    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error }
  }
}
