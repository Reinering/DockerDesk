import { clientConfig } from 'src/common/config.js'
import path from 'path'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
// import { app } from 'electron'


// 数据库文件路径
const dbPath = path.resolve(fileURLToPath(new URL('.', import.meta.url)), clientConfig.sqlite.dbPath)

console.log(`Connected to ${dbPath}`)

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true })
}

// 创建或连接到 SQLite 数据库
const db = new Database(path.join(dbPath, clientConfig.sqlite.dbName), {
  verbose: console.log,
  fileMustExist: false, // 如果数据库不存在，则创建一个新的数据库
  timeout: 5000, // 设置超时时间为 5 秒
  readonly: false // 设置为可读写模式
})

db.pragma('journal_mode = WAL')

db.init = () => {
  console.log('Initializing database...')

  this.exec(`
    CREATE TABLE IF NOT EXISTS docker_node (
      "id" text NOT NULL,
      "name" TEXT NOT NULL,
      "docker_type" TEXT NOT NULL,
      "connect_type" TEXT NOT NULL,
      "ssh_address" TEXT,
      "ssh_port" TEXT,
      "ssh_username" TEXT,
      "ssh_passowrd" TEXT,
      "create_timestamp" TIMESTAMP NOT NULL,
      "modify_timestamp" TIMESTAMP,
      "delete_timestamp" TIMESTAMP,
      "delete_flags" INTEGER NOT NULL,
      "mark" TEXT,
      PRIMARY KEY ("id")
    )
  `)

  this.exec(`
    CREATE TABLE IF NOT EXISTS pre_cmds (
      "group" TEXT NOT NULL,
      "label" TEXT NOT NULL,
      "text" TEXT,
      "mark" TEXT,
      "create_time" datetime NOT NULL
    )
  `)

}



// 使用 ESM 命名导出
export { db }






