import knex from 'knex'
import { clientConfig } from 'src/common/config.js'
import path from 'path'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
// import Database from 'better-sqlite3'


// 数据库文件路径
const dbPath = path.resolve(fileURLToPath(new URL('.', import.meta.url)), clientConfig.sqlite.dbPath)

console.log(`Connected to ${dbPath}`)

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true })
}

// new Database(path.join(dbPath, clientConfig.sqlite.dbName), {
//   verbose: console.log,
//   fileMustExist: false, // 如果数据库不存在，则创建一个新的数据库
//   timeout: 5000, // 设置超时时间为 5 秒
//   readonly: false // 设置为可读写模式
// })

const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(dbPath, clientConfig.sqlite.dbName)
  },
  useNullAsDefault: true, // SQLite 推荐设置
  pool: { min: 0, max: 7 }
})



async function initDB() {
  try {
   await db.schema.createTableIfNotExists('nodes', function(table) {
      table.text('id').notNullable().primary(); // 主键，文本类型，非空
      table.text('name').notNullable(); // 名称，文本类型，非空
      table.text('service_type').notNullable(); // 服务类型，文本类型，非空
      table.text('connect_type').notNullable(); // 连接类型，文本类型，非空
      table.text('protocol'); // 协议类型，文本类型，非空
      table.text('address'); // 地址，文本类型，可空
      table.text('port'); // 端口，文本类型，可空
      table.text('username'); // 用户名，文本类型，可空
      table.text('auth_type'); // 认证类型，文本类型，可空
      table.text('password'); // 密码，文本类型，可空
      table.text('key'); // 密钥，文本类型，可空
      table.timestamp('create_time').notNullable(); // 创建时间戳，非空
      table.timestamp('modify_time'); // 修改时间戳，可空
      table.timestamp('delete_time'); // 删除时间戳，可空
      table.integer('delete_flags').notNullable(); // 删除标志，整数类型，非空
      table.text('mark'); // 备注，文本类型，可空
    })

    await db.schema.createTableIfNotExists('pre_cmds', function(table) {
      table.text('label').notNullable(); // 主键，文本类型，非空
      table.text('group').notNullable(); // 名称，文本类型，非空
      table.text('text'); // docker 类型，文本类型，非空
      table.text('mark'); // 备注，文本类型，可空
      table.timestamp('create_time').notNullable(); // 创建时间戳，非空
      table.timestamp('modify_time'); // 修改时间戳，可空
      table.timestamp('delete_time'); // 删除时间戳，可空
      table.integer('delete_flags').notNullable(); // 删除标志，整数类型，非空

    })

    console.log('Table created and database initialized successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}



export { db, initDB }
