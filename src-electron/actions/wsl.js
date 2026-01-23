import { cmd, cmd1, cmdAdmin,  CmdRunner, modifyIniConfig, } from 'app/src-electron/common/utils.js'
import { WslCmdRunner } from 'app/src-electron/common/wsl.js'
import { parseWSLListVersion } from 'app/src/utils/wsl.js'
import { nodes } from '../actions/nodes.js'
import { db } from '../database/manager.js'
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
  return cmdAdmin('wsl --update --web-download', encoding, true)
}

export async function getDistributionList () {
  return cmd('wsl -l -o', 'utf16le')
}

export async function wslInstallSubSystem (win) {
  const result = await getWSLSettings("defaultInstallDir")

  const cmdRunner = new WslCmdRunner(win)
  let command
  if (result.success && result.data) {
    command = ['--install', '-d', 'Debian', '--name', 'DockerDesk', '--location', path.join(result.data, 'DockerDesk')]
  } else {
    command = ['--install', '-d', 'Debian', '--name', 'DockerDesk']
  }


  try {
    return await cmdRunner.setupWslUser(command, 'user', 'user')
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error)
    })
  }
}

export async function installWSL (win, data) {
  if (data.wslDistribution === "Custom" && data.localPath) {
    const fileExtension = data.localPath.split('.').pop().toLowerCase()
    return importSubSystem(fileExtension, data.name, data.installDir, data.localPath)
  } else {
    let command = []
    command.push("--install")
    command.push("--web-download")
    command.push("--distribution")
    command.push(data.wslDistribution)
    command.push("--name")
    command.push(data.name)

    if (data.installDir) {
      command.push("--location")
      command.push(path.join(data.installDir, data.name))
    } else {
      const result = await getWSLSettings("defaultInstallDir")

      if (result.success && result.data) {
        command.push("--location")
        command.push(path.join(result.data, data.name))
      }
    }

    if (!data.startNow) {
      command.push("--no-launch")
    }

    const cmdRunner = new WslCmdRunner(win, )

    let username = ''
    let password = ''

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
}

export async function getSubSystemState (name='DockerDesk') {
  return cmd(`wsl -l -v`, 'utf16le').then((result) => {
    const data = parseWSLListVersion(result)

    for (let index in data) {
      if (data[index].name === "DockerDesk") {
        return data[index].state
      }
    }
  })
}

export async function startSubSystem (name='DockerDesk') {
  return cmd(`wsl --distribution ${name}`, 'utf16le')
}

export async function startBGSubSystem (name='DockerDesk', ) {
  return cmd(`wsl --distribution ${name} --exec dbus-launch true`)
}

export async function stopSubSystem (name='DockerDesk') {
  return cmd(`wsl --terminate ${name}`, 'utf16le')
}

export async function stopSubAll (name='DockerDesk') {
  return cmd(`wsl --shutdown`, 'utf16le')
}

export async function checkSubSystem (name='DockerDesk') {
  let isError = false
  let res = ''
  await nodes.getNodeByID('11111111').then((result) => {
    if (result instanceof Array && result.length > 0 ) {
      if (result[0].delete_flags === 1 || result[0].delete_flags === 0) {
        nodes.updateNode({
          id: "11111111",
          delete_flags: 2
        }).then((result) => {
          if (!result.success) {
            isError = true
            res = result.error
          }
        })
      }
    } else {
      isError = true
      res = result.error
    }
  })

  if (!isError) {
    await nodes.getNodeByID('11111112').then((result) => {
      if (result instanceof Array && result.length > 0 ) {
        if (result[0].delete_flags === 1 || result[0].delete_flags === 0) {
          nodes.updateNode({
            id: "11111112",
            delete_flags: 2
          }).then((result) => {
            if (!result.success) {
              isError = true
              res = result.error
            }
          })
        }
      } else {
        isError = true
        res = result.error
      }
    })
  }

  return new Promise((resolve, reject) => {
    if (isError) {
      reject(res)
    } else {
      resolve(res)
    }
  })
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
  return cmd(`wsl --unregister ${name}`, 'utf16le')
}

export async function exportSubSystem (name, format, distDir) {
  if (format === "tar") {
    const filename = path.join(distDir, `${name}.tar`)
    return cmd(`wsl --export ${name} "${filename}"`, 'utf8')
  } else if (format === "vhd") {
    const filename = path.join(distDir, `${name}.vhdx`)
    return cmd(`wsl --export ${name} "${filename}" --vhd`, 'utf8')
  }
}

export async function importSubSystem (format, name, installDir, file) {
  let command = name

  if (installDir) {
    command = `wsl --import ${command} "${path.join(installDir, name)}"`
  } else {
    const result = await getWSLSettings("defaultInstallDir")

    if (result.success && result.data) {
      command = `wsl --import ${command} "${path.join(result.data, name)}"`
    } else {
      command = `wsl --import-in-place ${command}`
    }
  }

  command = `${command} "${file}"`
  if (format === "vhdx") {
    if (command.indexOf("--import-in-place") === -1) {
      command = `${command} --vhd`
    }
  } else {
    throw Error("If no installation location is specified, the file must be in VHDX format.")
  }

  // command = `${command} --version 2`

  return cmd(command, 'utf8')
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
  for (const command of commands) {
    console.log(command)
    result = await cmd(`wsl ${command.join(' ')}`, 'utf8')
    console.log("mark1")
  }
  console.log("mark")

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

export function getWSLSettings (key) {
  return db('settings')
    .where('field', '=', 'wsl_settings')
    .select('*').then(
      rows => {
        const data = JSON.parse(rows[0]["value"])
        if (key === null || key === undefined) {
          return { success: true, data }
        }

        if (Object.prototype.hasOwnProperty.call(data, key)) {
          return { success: true, data: data[key] }
        } else {
          return { success: true, data: '' }
        }
      }).catch(error => {
      return { success: false, error: error }
    })
}

export function setWSLSettings (data) {
  const result = db('settings')
    .where('field', '=', 'wsl_settings')
    .select('*').then(
      rows => {
        return rows[0]["value"]
      }).catch(error => {
      return error
    })

  return result.then((res) => {
    const settings = JSON.parse(res)

    const _data = JSON.parse(data)
    if (Object.prototype.hasOwnProperty.call(_data, "key") && Object.prototype.hasOwnProperty.call(_data, "value")) {
      settings[_data.key] = _data.value

      return db('settings')
        .where('field', '=', "wsl_settings")
        .update({
          value: JSON.stringify(settings)
        }).then(
          rows => {
            return { success: true, data: rows }
          }).catch(error => {
          return { success: false, error: error }
        })
    }
  })
}

export function getWSLLaunch (wslName=null) {
  return db('settings')
    .where('field', '=', 'wsl_settings')
    .select('*').then(
      rows => {
        const data = JSON.parse(rows[0]["value"])
        if (wslName === null) {
          return { success: true, data }
        }

        if (Object.prototype.hasOwnProperty.call(data, "startupBehavior") && Object.prototype.hasOwnProperty.call(data["startupBehavior"], wslName)) {
          return { success: true, data: data["startupBehavior"][wslName] }
        } else {
          return { success: true, data: {} }
        }
      }).catch(error => {
      return { success: false, error: error }
    })
}

export function setWSLLaunch (data) {
  const result = db('settings')
    .where('field', '=', 'wsl_settings')
    .select('*').then(
      rows => {
        return rows[0]["value"]
      }).catch(error => {
      return error
    })

  return result.then((res) => {
    const settings = JSON.parse(res)

    const _data = JSON.parse(data)
    if (Object.prototype.hasOwnProperty.call(_data, "wslName")) {
      if (!Object.prototype.hasOwnProperty.call(settings, "startupBehavior")) {
        settings["startupBehavior"] = {}
      }

      if (!Object.prototype.hasOwnProperty.call(settings["startupBehavior"], _data.wslName)) {
        settings["startupBehavior"][_data.wslName] = {}
      }

      for (let key of Object.keys(_data)) {
        if (key === "wslName") {
          continue
        }

        settings["startupBehavior"][_data.wslName][key] = _data[key]
      }

      return db('settings')
        .where('field', '=', "wsl_settings")
        .update({
          value: JSON.stringify(settings)
        }).then(
          rows => {
            return { success: true, data: rows }
          }).catch(error => {
          return { success: false, error: error }
        })
    }
  })
}

