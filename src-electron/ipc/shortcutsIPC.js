import { ipcMain, dialog, shell } from 'electron'
import { shortcuts, delShortcutsById } from '../actions/shortcuts.js'
import { generateUuid } from 'app/src-electron/common/utils.js'


export function registerShortcutsIpcHandlers(win) {

  ipcMain.handle('getShortcutss', async (event) => {
    try {
      return shortcuts.getShortcutss()
        .then((result) => {
          if (!Array.isArray(result)) {
            return result
          }

          const pagesMap = {}

          result.forEach(node => {
            const p = node.page_no
            if (!pagesMap[p]) {
              pagesMap[p] = []
            }

            const item = {
              id: node.id,
              containerId: node.container_id,
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
        container_id: res.containerId,
        node_id: res.nodeId,
        name: res.websiteName,
        url: res.website,
        label: res.iconText,
        color: res.iconColor,
        font_size: res.fontSize,
        prev_id: res.prevId,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
        page_no: res.pageNo,
      }

      return shortcuts.addShortcuts(value)
        .then((result) => {
          return result
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
        container_id: res.containerId,
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
        return result
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updatesShortcutsById', async (event, data) => {
    try {
      return shortcuts.updatesShortcutsById(data).then((result) => {
        if (result.success ) {
          return result
        } else {
          return { success: false, error: result }
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updatesShortcutsByPage', async (event, data) => {
    try {
      return shortcuts.updatesShortcutsByPage(data).then((result) => {
        if (result.success ) {
          return result
        } else {
          return { success: false, error: result }
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updatesPageShortcutsByPage', async (event, data) => {
    try {
      return shortcuts.updatesPageShortcutsByPage(data).then((result) => {
        if (result.success ) {
          return result
        } else {
          return { success: false, error: result }
        }
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deleteShortcuts', async (event, id) => {
    return delShortcutsById(id)
  })

  ipcMain.handle('delShortcutsByContainerId', async (event, id) => {
    try {
      const result = await shortcuts.getShortcutsByContainerId(id)
      if (!Array.isArray(result) || result.length === 0) {
        return result
      }

      let i = 0
      for (const item of result) {
        const result1 = await delShortcutsById(item.id)
        if (result1.success) {
          i += 1
        }
      }

      return { success: true, data: i }
    } catch (e) {
      return { success: false, error: e.message }
    }
  })

  ipcMain.handle('getLastShortcutsByPage', async (event, data) => {
    try {
      return shortcuts.getLastShortcutsByPage(data)
        .then((result) => {
          if (!Array.isArray(result)) {
            return result
          } else if (result.length === 0) {
            return { success: true, data: '' }
          }

          const pagesMap = {}

          result.forEach(node => {
            const p = node.page_no
            if (!pagesMap[p]) {
              pagesMap[p] = []
            }

            const item = {
              id: node.id,
              containerId: node.container_id,
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

          return { success: true, data: finalData[0][finalData[0].length - 1] }
        })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
