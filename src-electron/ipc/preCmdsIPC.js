import { ipcMain } from 'electron'
import { preCmds } from '../actions/preCmds.js'
import log from 'electron-log'


export function registerPreCmdsIpcHandlers(win) {

  // pre_cmds
  ipcMain.handle('getPreCmds', async () => {
    return preCmds.getPreCmds().then((result) => {
      if (result instanceof Array) {
        try {
          const data = {}
          for (let i = 0; i < result.length; i++) {
            let da = result[i]

            if (Object.prototype.hasOwnProperty.call(da, "group")) {
              let group = result[i]["group"]
              if (!Object.prototype.hasOwnProperty.call(data, group)) {
                data[group] = []
              }

              if (Object.prototype.hasOwnProperty.call(da, "label") && Object.prototype.hasOwnProperty.call(da,"text")) {
                let tmp = {
                  label: da["label"],
                  text: da["text"],
                  mark: da["mark"],
                }
                data[group].push(tmp)
              }
            }
          }
          return data
        } catch (error) {
          log.error(error)
          return { success: false, error: error.message }
        }
      }
      return result
    })
  })

  ipcMain.handle('addPreCmd', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        label: res.label,
        group: res.group,
        text: res.text,
        mark: res.mark,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
      }
      return preCmds.addPreCmd(value)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('editPreCmd', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        label: res.new.label,
        group: res.new.group,
        text: res.new.text,
        mark: res.new.mark,
        modify_time: Date.now(),
      }
      return preCmds.updatePreCmd(res.old, value)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delPreCmd', async (event, data) => {
    try {
      const res = JSON.parse(data)
      return preCmds.delPreCmd(res)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('editPreCmdGroup', async (event, data) => {
    try {
      const res = JSON.parse(data)
      return preCmds.updateGroup(res.old, res.new)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delPreCmdGroup', async (event, data) => {
    try {
      return preCmds.delGroup(data)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })


}
