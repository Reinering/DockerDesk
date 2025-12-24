import knex from 'knex'
import { clientConfig } from 'src/common/config.js'
import path from 'path'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
import { app } from 'electron'
// import Database from 'better-sqlite3'

const isDev = process.defaultApp || process.env.NODE_ENV === 'development'

// 数据库文件路径
let dbPath

if (isDev) {
  // 开发环境，使用源代码目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  dbPath = path.resolve(__dirname, clientConfig.sqlite.dbPath)
} else {
  // 生产环境，使用exe所在目录
  const exeDir = path.dirname(app.getPath('exe'))
  dbPath = path.resolve(exeDir, clientConfig.sqlite.dbPath)
}
// const dbPath = path.resolve(fileURLToPath(new URL('.', import.meta.url)), clientConfig.sqlite.dbPath)

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

const registries = [
  {url: "https://docker.io", username: '', password: ''},
  {url: "https://quay.io", username: '', password: ''},
  {url: "https://ghcr.io", username: '', password: ''},
  {url: "https://gcr.io", username: '', password: ''},
]

async function initDB() {
  try {
    let tableExists = await db.schema.hasTable('nodes')
    if (!tableExists) {
      await db.schema.createTableIfNotExists('nodes', function(table) {
        table.text('id').notNullable().primary() // 主键，文本类型，非空
        table.text('name').notNullable() // 名称，文本类型，非空
        table.text('service_type').notNullable() // 服务类型，文本类型，非空
        table.text('connect_type').notNullable() // 连接类型，文本类型，非空
        table.text('protocol') // 协议类型，文本类型，非空
        table.text('address') // 地址，文本类型，可空
        table.text('port') // 端口，文本类型，可空
        table.text('username') // 用户名，文本类型，可空
        table.text('auth_type') // 认证类型，文本类型，可空
        table.text('password') // 密码，文本类型，可空
        table.text('key') // 密钥，文本类型，可空
        table.timestamp('create_time').notNullable() // 创建时间戳，非空
        table.timestamp('modify_time') // 修改时间戳，可空
        table.timestamp('delete_time') // 删除时间戳，可空
        table.integer('delete_flags').notNullable() // 删除标志，整数类型，非空
        table.text('mark') // 备注，文本类型，可空
      })

      await db('nodes').insert([
        {
          id: "11111111",
          name: "wsl_docker",
          service_type: "Docker",
          connect_type: "local",
          address: 'DockerDesk',
          create_time: Date.now(),
          delete_flags: 1
        },
        {
          id: "11111112",
          name: "wsl_podman",
          service_type: "Podman",
          connect_type: "local",
          address: 'DockerDesk',
          create_time: Date.now(),
          delete_flags: 1
        },
      ])
    }

    await db.schema.createTableIfNotExists('pre_cmds', function(table) {
      table.text('label').notNullable() // 主键，文本类型，非空
      table.text('group').notNullable() // 名称，文本类型，非空
      table.text('text') // docker 类型，文本类型，可空
      table.text('mark') // 备注，文本类型，可空
      table.timestamp('create_time').notNullable() // 创建时间戳，非空
      table.timestamp('modify_time') // 修改时间戳，可空
      table.timestamp('delete_time') // 删除时间戳，可空
      table.integer('delete_flags').notNullable() // 删除标志，整数类型，非空

    })

    tableExists = await db.schema.hasTable('settings')
    if (!tableExists) {
      await db.schema.createTable('settings', function(table) {
        table.text('field').notNullable() // 主键，文本类型，非空
        table.text('type').notNullable() // 名称，文本类型，非空
        table.text('value') // docker 类型，文本类型，可空
        table.text('mark') // 备注，文本类型，可空
        table.timestamp('modify_time') // 修改时间戳，非空
        table.integer('delete_flags').notNullable() // 删除标志，整数类型，非空
      })

      await db('settings').insert([
        {
          field: "auto_save_log",
          type: "bool",
          value: "false",
          mark: "auto save log",
          delete_flags: 0
        },
        {
          field: "docker_registries",
          type: "json",
          value: JSON.stringify(registries),
          mark: "docker registry",
          delete_flags: 0
        },
        {
          field: "docker_registry_mirrors",
          type: "json",
          value: '',
          mark: "docker registry mirror",
          delete_flags: 0
        },
        {
          field: "web_proxy",
          type: "json",
          value: '',
          mark: "web proxy",
          delete_flags: 0
        },
        {
          field: "podman_proxy_mode",
          type: "string",
          value: '',
          mark: "disable / system / manual",
          delete_flags: 0
        },
        {
          field: "storeApis",
          type: "json",
          value: '',
          mark: "store api",
          delete_flags: 0
        },
      ])
    }

    tableExists = await db.schema.hasTable('shortcuts')
    if (!tableExists) {
      await db.schema.createTableIfNotExists('shortcuts', function(table) {
        table.text('id').notNullable() // 主键，文本类型，非空
        table.text('node_id').notNullable() //
        table.text('name').notNullable() //
        table.text('url').notNullable() //
        table.text('label') //
        table.text('color') //
        table.binary('icon') //
        table.text('font_size') //
        table.timestamp('create_time').notNullable() // 创建时间戳，非空
        table.timestamp('modify_time') // 修改时间戳，可空
        table.timestamp('delete_time') // 删除时间戳，可空
        table.integer('delete_flags').notNullable() // 删除标志，整数类型，非空
        table.text('prev_id').notNullable() // 上一个元素
        table.integer('page_no').notNullable() // page number

      })
    }

    console.log('Table created and database initialized successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}



export { db, initDB }
