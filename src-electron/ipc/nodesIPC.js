import { ipcMain } from 'electron'
import { nodes } from '../actions/nodes.js'
import { generateUuid } from '../common/utils.js'
import { interference, encryptPwd } from '../common/encrypt.js'
import log from 'electron-log'


export function registerNodesIpcHandlers(win) {

  // nodes
  ipcMain.handle('getNodes', (event) => {
    return nodes.getNodes().then((result) => {
      if (result instanceof Array) {
        try {
          const data = []
          result.forEach(node => {
            data.push({
              id: node.id,
              serviceName: node.name,
              serviceType: node.service_type,
              connectionType: node.connect_type,
              protocol: node.protocol,
              address: node.address,
              port: node.port,
              username: node.username,
              authType: node.auth_type,
              password: (node.password !== null && node.password.length > 0) ? interference : '',
              key: (node.key !== null && node.key.length > 0) ? interference : '',
              mark: node.mark,
              // deleteFlags: result[0].delete_flags,
            })
          })
          return data
        } catch (error) {
          return { success: false, error: error.message }
        }
      }
      return result
    })
  })

  ipcMain.handle('getNode', async (event, id) => {
    return nodes.getNodeByID(id).then((result) => {
      if (result instanceof Array && result.length > 0 ) {
        const data = {
          id: result[0].id,
          serviceName: result[0].name,
          serviceType: result[0].service_type,
          connectionType: result[0].connect_type,
          protocol: result[0].protocol,
          address: result[0].address,
          port: result[0].port,
          // deleteFlags: result[0].delete_flags,
        }

        return { success: true, data: data }
      } else if (result instanceof Array) {
        return { success: true, data: result }
      } else {
        return result
      }
    })
  })

  ipcMain.handle('addNode', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: generateUuid(),
        name: res.serviceName,
        service_type: res.serviceType,
        connect_type: res.connectionType,
        protocol: res.protocol !== null && res.protocol.length > 0 ? res.protocol : null,
        address: res.address !== null && res.address.length > 0 ? res.address : null,
        port: res.address !== null && res.port.length > 0 ? res.port : null,
        username: res.username !== null && res.username.length > 0 ? res.username : null,
        auth_type: res.authType !== null && res.authType.length > 0 ? res.authType : null,
        password: res.password !== null && res.password.length > 0 ? encryptPwd(res.password) : null,
        key: res.key !== null && res.key.length > 0 ? encryptPwd(res.key) : null,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
        mark: res.mark !== null && res.mark.length > 0 ? res.mark : null,
      }

      return nodes.addNode(value).then((result) => {
        if (result.success ) {
          if (res.authType === "password") {
            res.password = res.password !== null && res.password.length > 0 ? interference : res.password
          } else if (res.authType === "key") {
            res.key = res.key !== null && res.key.length > 0 ? interference : res.key
          }

          res.id = value.id
          result.data = res
        }
        return result
      })
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deleteNode', async (event, id) => {
    return await nodes.deleteNodeByID(id)
  })

  ipcMain.handle('delNode', async (event, id) => {
    return await nodes.delNodeByID(id)
  })

  ipcMain.handle('editNode', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: res.id,
        name: res.serviceName,
        service_type: res.serviceType,
        connect_type: res.connectionType,
        protocol: res.protocol !== null && res.protocol.length > 0 ? res.protocol : null,
        address: res.address !== null && res.address.length > 0 ? res.address : null,
        port: res.port !== null && res.port.length > 0 ? res.port : null,
        username: res.username !== null && res.username.length > 0 ? res.username : null,
        auth_type: res.authType !== null && res.authType.length > 0 ? res.authType : null,
        modify_time: Date.now(),
        mark: res.mark !== null && res.mark.length > 0 ? res.mark : null,
      }

      if (res.authType === "password") {
        if (res.password !== null && res.password.length > 0 && res.password !== interference) {
          value.password = encryptPwd(res.password)
        }
      } else if (res.authType === "key") {
        if (res.key !== null && res.key.length > 0 && res.key !== interference) {
          value.key = encryptPwd(res.key)
        }
      }

      return nodes.updateNode(value).then((result) => {
        if (result.success ) {
          if (res.authType === "password") {
            res.password = res.password !== null && res.password.length > 0 ? interference : res.password
          } else if (res.authType === "key") {
            res.key = res.key !== null && res.key.length > 0 ? interference : res.key
          }

          result.data = res
          return result
        }
      })
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updateNode', async (event, data) => {
    try {
      const value = JSON.parse(data)

      return await nodes.updateNode(value)
    } catch (error) {
      log.error(error)
      return { success: false, error: error.message }
    }
  })
}
