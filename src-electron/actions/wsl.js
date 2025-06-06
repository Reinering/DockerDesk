import { cmd, cmd1, CmdRunner, modifyIniConfig, } from 'app/src-electron/common/utils.js'
import readline from 'readline'
import path from 'path'


const homeDir = process.env.HOME || process.env.USERPROFILE
const wslConfigFile = path.join(homeDir, '.wslconfig')

export async function modifyWSLDebugConfig (data) {
  return new Promise((resolve, reject) => {
    try {
      // {wsl2: { debugConsole: false }
      modifyIniConfig(data, wslConfigFile)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export async function getWSLInfo () {
  return cmd('wsl -v', 'utf16le')
}

export async function getWSLList () {
  return cmd('wsl -l -v', 'utf16le')
}

export async function wslUpdate () {
  return cmd('wsl --update --web-download', 'utf16le')
}

export async function wslInstallSubSystem () {
  const cmdRunner = new CmdRunner()
  await cmdRunner.start()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.on('line', async (input) => {
    if (input.toLowerCase() === 'exit') {
      await cmdRunner.stop()
      rl.close()
      return
    }
    try {
      const result = await cmdRunner.sendCommand(input);
      console.log('结果:', result)
    } catch (error) {
      console.error('错误:', error)
    }
  })

  rl.on('close', () => {
    console.log('交互结束')
  })

  return cmd('wsl --install -d Debian --name DockerDesk --no-launch', 'utf16le')
}

export async function startSubSystem (name='DockerDesk') {
  return cmd1(`wsl --distribution ${name}`, 'utf16le')
}

export async function stopSubSystem (name='DockerDesk') {
  return cmd1(`wsl --terminate ${name}`, 'utf16le')
}

export async function restartSubSystem (name='DockerDesk') {
  cmd1(`wsl --terminate ${name}`, 'utf16le')
    .then((result) => {
      return cmd1(`wsl --distribution ${name} --user root`, 'utf16le')
    }, (error) => {
      return error
    })

  return
}

export async function unregisterSubSystem (name) {
  return cmd1(`wsl --unregister ${name}`, 'utf16le')
}

export async function exportSubSystem (name, distDir) {
  const filename = path.join(distDir, `${name}.tar`)
  return cmd(`wsl --export ${name} ${filename}`, 'utf16le')
}

export async function moveSubSystem (name, distDir) {
  const folder = path.join(distDir, `${name}`)
  return cmd(`wsl --manage ${name} --move ${folder}`, 'utf16le')
}
