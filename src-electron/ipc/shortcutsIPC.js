import { ipcMain, dialog, shell } from 'electron'
import { shortcuts } from '../actions/shortcuts.js'
import { generateUuid } from 'app/src-electron/common/utils.js'


export function registerShortcutsIpcHandlers(win) {

  ipcMain.handle('getShortcutss', async (event) => {
    try {
      return shortcuts.getShortcutss()
        .then((result) => {
          return { success: true, data: result }
        })
    } catch (error) {
      return { success: false, error: error.message }
    }

  })

  ipcMain.handle('addShortcuts', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: generateUuid(),
        node_id: res.node_id,
        name: res.name,
        url: res.url,
      }

      return shortcuts.addShortcuts(value)
        .then((result) => {
          return { success: true, data: result }
        })
    } catch (error) {
      return { success: false, error: error.message }
    }

  })

  ipcMain.handle('editShortcuts', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: res.id,
        node_id: res.node_id,
        name: res.name,
        url: res.url,
      }

      return shortcuts.updateShortcuts(value).then((result) => {
        if (result.success ) {
          return result
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deleteShortcuts', async (event, id) => {
    return await shortcuts.deleteShortcutsByID(id)
  })




}
