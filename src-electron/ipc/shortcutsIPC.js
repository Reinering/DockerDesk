import { ipcMain, dialog, shell } from 'electron'
import { shortcuts } from '../actions/shortcuts.js'
import { generateUuid } from 'app/src-electron/common/utils.js'


export function registerShortcutsIpcHandlers(win) {

  ipcMain.handle('getShortcutss', async (event) => {
    try {
      return shortcuts.getShortcutss()
        .then((result) => {
          if (!Array.isArray(result)) {
            return { success: true, data: result }
          }

          const pagesMap = {}

          result.forEach(node => {
            const p = node.page_no
            if (!pagesMap[p]) {
              pagesMap[p] = []
            }

            const item = {
              id: node.id,
              nodeId: node.node_id,
              websiteName: node.name,
              website: node.url,
              iconText: node.label,
              iconColor: node.color,
              icon: node.icon,
              fontSize: node.font_size,
              prevId: node.prev_id,
              pageNo: node.page_no
            }

            pagesMap[p].push(item)
          })

          const finalData = []

          Object.keys(pagesMap).forEach(p => {
            const orderedPage = []
            const page = pagesMap[p]

            let currentPrevId = '0'
            while (true) {
              let check = false

              for (const node of page) {
                if ((currentPrevId === '0' && node.prevId === '0') || node.prevId === currentPrevId) {
                  orderedPage.push(node)
                  currentPrevId = node.id
                  check = true
                  break
                }
              }

              if (! check) {
                if (orderedPage.length !== page.length) {
                  console.log("Some nodes are not covered by the chain.")
                }
                break
              }
            }

            finalData[p] = orderedPage
          })

          return { success: true, data: finalData }
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

  ipcMain.handle('updatesShortcutsById', async (event, data) => {
    try {
      return shortcuts.updatesShortcutsById(data).then((result) => {
        console.log(result)
        if (result.success ) {
          return result
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updatesShortcutsByPage', async (event, data) => {
    try {
      return shortcuts.updatesShortcutsByPage(data).then((result) => {
        console.log(result)
        if (result.success ) {
          return result
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updatesPageShortcutsByPage', async (event, data) => {
    try {
      return shortcuts.updatesPageShortcutsByPage(data).then((result) => {
        console.log(result)
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
