import { ipcMain, dialog, shell } from 'electron'
import { shortcuts } from '../actions/shortcuts.js'
import { generateUuid } from 'app/src-electron/common/utils.js'


export function registerShortcutsIpcHandlers(win) {

  ipcMain.handle('getShortcutss', async (event) => {
    try {
      return shortcuts.getShortcutss()
        .then((result) => {
          if (result instanceof Array) {
            const data = []

            result.forEach(node => {
              data.push({
                id: node.id,
                nodeId: node.node_id,
                websiteName: node.name,
                website: node.url,
                iconText: node.label,
                iconColor: node.color,
                icon: node.icon,
                fontSize: node.font_size
              })
            })

            return { success: true, data: data }
          }

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
        node_id: res.nodeId,
        name: res.websiteName,
        url: res.website,
        label: res.iconText,
        color: res.iconColor,
        font_size: res.fontSize,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
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
        node_id: res.nodeId,
        name: res.websiteName,
        url: res.website,
        label: res.iconText,
        color: res.iconColor,
        icon: res.icon,
        font_size: res.fontSize,
        modify_time: Date.now(),
        delete_time: null,
        delete_flags: 0,
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
    return await shortcuts.delShortcutsByID(id)
  })




}
