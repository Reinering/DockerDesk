import * as pty from 'node-pty'
import * as os from 'node:os'


// 终端实例类
export class Terminal {
  constructor(uuid, win, cmd= [], options = {}) {
    this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
    this.uuid=uuid
    this.win=win
    this.ptyProcess = null
    this.cmd = cmd
    this.options = {
      name: 'xterm-color',
      cols: options.cols || 80,
      rows: options.rows || 24,
      cwd: options.cwd || process.cwd(),
      env: options.env || process.env,
      onData: options.onData || (data => process.stdout.write(data)),
      onExit: options.onExit || (({ exitCode, signal }) => console.log(`Terminal exited with code ${exitCode} and signal ${signal}`)),
    }
  }

  // 启动终端
  start() {
    console.log("cmd", this.cmd)
    this.ptyProcess = pty.spawn(this.shell, this.cmd, this.options)

    // 处理输出
    this.ptyProcess.onData(data => {
      this.options.onData(data)
      this.win.webContents.send("terminalReceive",
        JSON.stringify({
          uuid: this.uuid,
          data: data
        }))
    })

    // 处理退出
    this.ptyProcess.onExit(this.options.onExit)

    // 处理错误
    this.ptyProcess.on('error', err => {
      console.error('PTY error:', err)
    })

    return this
  }

  // 写入数据到终端
  write(data) {
    if (this.ptyProcess) {
      // console.log("write", data)
      this.ptyProcess.write(data)

      if (data === 'exit') {
        this.destroy()
      }
    }
  }

  // 调整终端大小
  resize(cols, rows) {
    if (this.ptyProcess) {
      if (cols > 0 && rows > 0) {
        this.ptyProcess.resize(cols, rows)
      } else {
        console.error('Invalid cols or rows:', cols, rows);
      }
      this.ptyProcess.resize(cols, rows)
    }
  }

  // 销毁终端
  destroy() {
    if (this.ptyProcess) {
      this.ptyProcess.kill()
      this.ptyProcess = null
    }
  }
}

