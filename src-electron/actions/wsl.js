import { cmd, cmd1, cmdAdmin,  CmdRunner, modifyIniConfig, } from 'app/src-electron/common/utils.js'
import { WslCmdRunner } from 'app/src-electron/common/wsl.js'
import readline from 'readline'
import path from 'path'
import { parse, stringify } from 'smol-toml'


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

export async function getWSLInfo (encoding='utf16le') {
  return cmd('wsl -v', encoding)
}

export async function getWSLList () {
  return cmd('wsl -l -v', 'utf16le')
}

export async function wslUpdate (encoding='utf16le') {
  return cmdAdmin('wsl --update --web-download', encoding)
}

export async function getDistributionList () {
  return cmd('wsl -l -o', 'utf16le')
}

export async function wslInstallSubSystem (win) {
  const cmdRunner = new WslCmdRunner(win)
  const command = ['--install', '-d', 'Debian', '--name', 'DockerDesk']

  try {
    return await cmdRunner.setupWslUser(command, 'user', 'user')
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error)
    })
  }
}

export async function installWSL (win, data) {
  const cmdRunner = new WslCmdRunner(win, )

  let command = []
  command.push("--install")
  command.push("----web-download")
  command.push("--distribution")
  command.push(data.wslDistribution)
  command.push("--name")
  command.push(data.name)

  let username = ''
  let password = ''

  if (data.wslDistribution !== "Custom") {
    if (!data.startNow) {
      command.push("--no-launch")
    }
  } else {
    command.push("--location")
    command.push(data.localImagePath)
    if (!data.startNow) {
      command.push("--no-launch")
    }
  }

  try {
    if (data.startNow) {
      if (data.root) {
        username = 'root'
      } else {
        username = data.username
      }
      password = data.password
    }

    return await cmdRunner.setupWslUser(command, username, password)
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error)
    })
  }
}

export async function startSubSystem (name='DockerDesk') {
  return cmd1(`wsl --distribution ${name}`, 'utf16le')
}

export async function startBGSubSystem (name='DockerDesk') {
  return cmd1(`wsl --distribution ${name} --exec dbus-launch true`, 'utf16le')
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
  return cmd(`wsl --export ${name} "${filename}"`, 'utf16le')
}

export async function moveSubSystem (name, distDir) {
  const folder = path.join(distDir, `${name}`)
  return cmd(`wsl --manage ${name} --move "${folder}"`, 'utf16le')
}

export async function execSubSystem (command) {
  let tmp = ''
  if (command instanceof Array) {
    tmp = command.join(' ')
  } else {
    tmp = command
  }

  return cmd(`wsl ${tmp}`, 'utf8')
}

export async function execSSubSystem (commands) {
  let result
  console.log(commands)
  for (const command of commands) {
    result = await cmd(`wsl ${command.join(' ')}`, 'utf8').then((data) => {
      return data
    }, (error) => {
      throw error
    })
  }

  return result
}

export async function dockerLogin (win, data) {
  const cmdRunner = new WslCmdRunner(win, )

  let command = []
  command.push("--install")
  command.push("----web-download")
  command.push("--distribution")
  command.push(data.wslDistribution)
  command.push("--name")
  command.push(data.name)

  let username = ''
  let password = ''

  if (data.wslDistribution !== "Custom") {
    if (!data.startNow) {
      command.push("--no-launch")
    }
  } else {
    command.push("--location")
    command.push(data.localImagePath)
    if (!data.startNow) {
      command.push("--no-launch")
    }
  }

  try {
    if (data.startNow) {
      if (data.root) {
        username = 'root'
      } else {
        username = data.username
      }
      password = data.password
    }

    return await cmdRunner.setupWslUser(command, username, password)
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error)
    })
  }
}

export async function readPodmanConf(commands) {
  const configContent = await execSubSystem(commands)
  return parse(configContent)
}
