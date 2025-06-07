import { spawn } from 'child_process'
import { devConsole } from './utils.js'

export class WslCmdRunner {
  constructor(win, options = {}) {
    this.win = win
    this.encoding = options.encoding || 'utf8'  // 默认编码
    this.debug = options.debug || true

  }

  // 交互式配置 WSL 用户（用户名、密码、确认密码）
  async setupWslUser(command, username, password) {
    // 监听输出并匹配提示
    return new Promise((resolve, reject) => {
      console.log('🚀 启动 WSL 安装:', 'wsl', command.join(' '))

      const wslProcess = spawn('wsl', command, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
      })

      // 设置编码
      wslProcess.stdout.setEncoding(this.encoding)
      wslProcess.stderr.setEncoding(this.encoding)

      let allOutput = ''
      let lastOutput = ''
      let userInputSent = false
      let passwordInputSent = false
      let confirmPasswordSent = false

      // 处理所有输出的通用函数
      const processOutput = (data, source) => {
        const text = data.toString()
        allOutput += text
        lastOutput = text

        devConsole(`[${source}] ${text.trim()}`, this.debug)

        if (username === '') {
          return
        }

        if (text.includes('Please create a default UNIX user account') && !userInputSent) {
          devConsole('🔍 检测到用户账户创建提示，准备发送用户名...', this.debug)
          setTimeout(() => {
            devConsole(`📝 发送用户名: ${username}`, this.debug)
            wslProcess.stdin.write(`${username}\n`)
            userInputSent = true
          }, 2000) // 等待2秒
        }

        else if (text.includes('Enter new UNIX username:') && !userInputSent) {
          devConsole('🔍 检测到用户名输入提示', this.debug)
          setTimeout(() => {
            devConsole('📝 发送用户名: ${username}', this.debug)
            wslProcess.stdin.write(`${username}\n`)
            userInputSent = true
          }, 500)
        }

        else if (text.includes('New password:') && !passwordInputSent) {
          devConsole('🔍 检测到密码输入提示', this.debug)
          setTimeout(() => {
            devConsole('📝 发送密码...', this.debug)
            wslProcess.stdin.write(`${password}\n`)
            passwordInputSent = true
          }, 500)
        }

        else if (text.includes('Retype new password:') && !confirmPasswordSent) {
          devConsole('🔍 检测到确认密码提示', this.debug)
          setTimeout(() => {
            devConsole('📝 确认密码...', this.debug)
            wslProcess.stdin.write(`${password}\n`)
            confirmPasswordSent = true
          }, 500)
        }

        else if (text.includes('password updated successfully')) {
          devConsole('🎉 检测到配置成功!', this.debug)
          setTimeout(() => {
            wslProcess.kill('SIGTERM')
            resolve('WSL User configuration complete')
          }, 1000)
        }
      }

      wslProcess.stdout.on('data', (data) => processOutput(data, 'STDOUT'))
      wslProcess.stderr.on('data', (data) => processOutput(data, 'STDERR'))

      wslProcess.on('close', (code) => {
        devConsole(`\n📊 WSL 进程结束，退出码: ${code}`, this.debug)
        devConsole('📋 完整输出记录:', this.debug)
        console.log(allOutput)

        if (confirmPasswordSent || code === 0) {
          resolve('WSL Installed complete')
        } else {
          reject(new Error(`WSL exitCode: ${code} ${lastOutput}`))
        }
      })

      wslProcess.on('error', (error) => {
        reject(new Error(`WSL Error: ${error.message}`))
      })

      // 超时处理 - 如果长时间卡住，尝试发送输入
      setTimeout(() => {
        if (!userInputSent && allOutput.includes('Please create a default UNIX user account')) {
          devConsole('⏰ 超时检测：强制发送用户名', this.debug)
          wslProcess.stdin.write(`${username}\n`)
          userInputSent = true
        }
      }, 10000) // 10秒超时

      // 最终超时
      setTimeout(() => {
        if (!confirmPasswordSent) {
          devConsole('❌ 最终超时，终止进程', this.debug)
          devConsole('📋 超时时的输出:', this.debug)
          devConsole(allOutput, this.debug)
          wslProcess.kill('SIGKILL')
          reject(new Error('WSL Timeout'))
        }
      }, 600000) // 2分钟最终超时

    })
  }
}



