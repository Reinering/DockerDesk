import { clientConfig } from '../../common/config.js'
import path from 'path'
import { fileURLToPath } from 'node:url'
// import { app } from 'electron'
import * as SQLite3 from 'sqlite3'

// const SQLite3 = require("sqlite3")

// 数据库文件路径
const dbPath = path.resolve(fileURLToPath(new URL('.', import.meta.url)), clientConfig.sqlite.dbPath)

console.log(`Connected to ${dbPath}`)

// 创建或连接到 SQLite 数据库
const db = new SQLite3.Database(dbPath, (err) => {
  if (err) {
    console.log(err)
  }
  console.log("finish")
})

// 初始化表
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS services (
//                                           id INTEGER PRIMARY KEY AUTOINCREMENT,
//                                           name TEXT NOT NULL,
//                                           connectionType TEXT NOT NULL,
//                                           type TEXT NOT NULL,
//                                           address TEXT,
//                                           port INTEGER
//     )
//   `, (err) => {
//     if (err) {
//       console.error('database.initTableError:', err.message)
//     } else {
//       console.log('database.connectionSuccess')
//     }
//   })
// })

// 使用 ESM 命名导出
export { db }
