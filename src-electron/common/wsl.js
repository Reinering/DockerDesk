import { spawn } from 'child_process'


export class WslCmdRunner {
  constructor(win, options = {}) {
    this.win = win
    this.encoding = options.encoding || 'utf8'  // 默认编码
    this.cmd = null                             // 保存 cmd 进程
    this.isRunning = false                      // 进程状态
    this.outputBuffer = ''                      // 用于收集输出，检测提示
  }

  // 启动 cmd 进程
  start(command) {
    if (this.isRunning) {
      throw new Error('Cmd Running！')
    }

    this.cmd = spawn('wsl', command)
    this.isRunning = true

    // 设置编码
    this.cmd.stdout.setEncoding(this.encoding)
    this.cmd.stderr.setEncoding(this.encoding)

    // 返回 Promise，方便异步操作
    return new Promise((resolve, reject) => {
      // 监听输出
      this.cmd.stdout.on('data', (data) => {
        console.log(`cmd : ${data.toString()}`)
      })

      // 监听错误
      this.cmd.stderr.on('data', (data) => {
        console.error(`cmd error: ${data.toString()}`)
      })

      // 监听进程关闭
      this.cmd.on('close', (code) => {
        this.isRunning = false
        console.log(`cmd exit code: ${code}`)
        reject(`exit code: ${code}`)

        this.win.webContents.send("wslSpawnReceive", {exitCode: code})
      })

      // 确保进程启动
      resolve(this)
    })
  }

  // 发送命令
  sendCommand(command) {
    if (!this.isRunning) {
      throw new Error('Cmd: The process has not been started! Please call the start method first')
    }

    return new Promise((resolve, reject) => {
      // 发送命令并添加换行符
      this.cmd.stdin.write(`${command}\n`)

      // 监听输出（这里可以根据需要扩展，例如收集特定输出）
      const onData = (data) => {
        resolve(data.toString())
        this.cmd.stdout.off('data', onData) // 移除监听，避免重复触发
      }

      this.cmd.stdout.on('data', onData)

      // 错误处理
      this.cmd.stderr.once('data', (data) => {
        reject(new Error(`Cmd Error: ${data}`))
      })
    })
  }

  // 停止 cmd 进程
  stop() {
    if (!this.isRunning) {
      return Promise.resolve('Cmd: Process not running\'')
    }

    return new Promise((resolve) => {
      this.cmd.stdin.end() // 结束输入流
      this.cmd.on('close', () => {
        this.isRunning = false
        resolve('Cmd Stopped')
      })
    })
  }

  // 发送命令或输入
  sendInput(input) {
    if (!this.isRunning) {
      throw new Error('WSL: The process has not been started! Please call the start method first')
    }

    return new Promise((resolve, reject) => {
      this.cmd.stdin.write(`${input}\n`)

      // 监听输出以确认输入被接受
      const onData = (data) => {
        this.outputBuffer += data
        resolve(data.toString())
        this.cmd.stdout.off('data', onData)
      }

      this.cmd.stdout.on('data', onData)

      // 错误处理
      this.cmd.stderr.once('data', (data) => {
        reject(new Error(`Input Error: ${data}`))
      })
    })
  }

  // 交互式配置 WSL 用户（用户名、密码、确认密码）
  async setupWslUser(command, username, password) {
    if (!this.isRunning) {
      await this.start(command)
    }

    // 定义提示和对应的输入
    const prompts = [
      {
        pattern: /Enter new UNIX username:/i,
        input: username,
      },
      {
        pattern: /New password:/i,
        input: password,
      },
      {
        pattern: /Retype new password:/i,
        input: password,
      },
    ]

    const successPrompts = [
      "已成功安装分发"
    ]

    const errorPrompts = [
      "Wsl/E_INVALIDARG",
      "ERROR_ALREADY_EXISTS"
    ]

    // 监听输出并匹配提示
    return new Promise((resolve, reject) => {
      let currentPromptIndex = 0

      const onData = async (data) => {
        this.outputBuffer += data
        console.log(`WSL Output: ${data.toString("")}`)

        // 检查当前输出是否匹配预期提示
        if (
          currentPromptIndex < prompts.length &&
          prompts[currentPromptIndex].pattern.test(this.outputBuffer)
        ) {
          try {
            await this.sendInput(prompts[currentPromptIndex].input)
            currentPromptIndex++
            this.outputBuffer = '' // 清空缓冲区，准备下一个提示

            // 如果所有提示都已处理，完成配置
            if (currentPromptIndex === prompts.length) {
              this.cmd.stdout.off('data', onData)
              resolve('WSL User configuration complete')
            }
          } catch (error) {
            this.cmd.stdout.off('data', onData)
            reject(error)
          }
        }

        for (const prompt of errorPrompts) {
          if (data.toString().indexOf(prompt) !== -1) {
            return reject(data.toString())
          }
        }

        for (const prompt of successPrompts) {
          if (data.toString().indexOf(prompt) !== -1) {
            return resolve()
          }
        }
      }

      this.cmd.stdout.on('data', onData)

      // 错误处理
      this.cmd.stderr.on('data', (data) => {
        reject(new Error(`WSL Configuration Error: ${data}`))
      })
    })
  }
}
