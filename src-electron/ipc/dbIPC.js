import { ipcMain } from 'electron'
import { dockerNodes } from '../actions/dockerNode.js'
import { generateUuid } from '../common/utils.js'
import { interference, encryptPwd } from '../common/encrypt.js'



export function registerDBIpcHandlers() {

  ipcMain.handle('getDockerNodes', () => {
    return  dockerNodes.getDockerNodes().then((result) => {
      if (result instanceof Array) {
        try {
          const data = []
          result.forEach(node => {
            data.push({
              id: node.id,
              serviceName: node.name,
              serviceType: node.docker_type,
              connectionType: node.connect_type,
              address: node.ssh_address,
              port: node.ssh_port,
              username: node.ssh_username,
              password: (node.ssh_password !== null && node.ssh_password.length > 0) ? interference : '',
              mark: node.mark
            })
          })
          return data
        } catch (error) {
          console.log(error)
          return { success: false, error: error.message }
        }
      }
      return result
    })
  })

  ipcMain.on('addDockerNode1', (data) => {
    console.log(data)
  })

  ipcMain.handle('addDockerNode', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: generateUuid(),
        name: res.serviceName,
        docker_type: res.serviceType,
        connect_type: res.connectionType,
        ssh_address: res.address !== null && res.address.length > 0 ? res.address : null,
        ssh_port: res.address !== null && res.port.length > 0 ? res.port : null,
        ssh_username: res.username !== null && res.username.length > 0 ? res.username : null,
        ssh_password: res.password !== null && res.password.length > 0 ? encryptPwd(res.password) : null,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
        mark: res.mark !== null && res.mark.length > 0 ? res.mark : null,
      }

      return dockerNodes.addDockerNode(value).then((result) => {
        if(result.success ) {
          res.password = res.password !== null && res.password.length > 0 ? interference : res.password
          result.data = res
        }
        return result
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deleteDockerNode', async (event, id) => {
    return await dockerNodes.deleteDockerNodeByID(id)
  })

  ipcMain.handle('delDockerNode', async (event, id) => {
    return await dockerNodes.delDockerNodeByID(id)
  })

  ipcMain.handle('editDockerNode', async (event, data) => {
    try {
      const res = JSON.parse(data)
      const value = {
        id: res.id,
        name: res.serviceName,
        docker_type: res.serviceType,
        connect_type: res.connectionType,
        ssh_address: res.address !== null && res.address.length > 0 ? res.address : null,
        ssh_port: res.port !== null && res.port.length > 0 ? res.port : null,
        ssh_username: res.username !== null && res.username.length > 0 ? res.username : null,
        modify_time: Date.now(),
        mark: res.mark !== null && res.mark.length > 0 ? res.mark : null,
      }
      if (res.password !== null && res.password.length > 0 && res.password !== interference) {
        value.ssh_password = encryptPwd(res.password)
      }

      return dockerNodes.updateDockerNode(value)
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

}
