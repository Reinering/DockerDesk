import { ipcMain } from 'electron'
import { dockerNodes } from '../actions/dockerNode.js'
import { generateUuid } from '../common/utils.js'
// import { v7 } from 'uuid'


export function registerDBIpcHandlers() {
  // ipcMain.on('getDockerNodes', () => {})

  ipcMain.handle('getDockerNodes', () => {
    return  dockerNodes.getDockerNodes().then((result) => {
      if (result instanceof Array) {
        const data = []
        result.forEach(node => {
          data.push({
            id: node.id,
            serviceName: node.name,
            serviceType: node.docker_type,
            connectionType: node.connect_type,
            address: node.ssh_address,
            port: node.ssh_port,
            // username: node.ssh_username,
            // password: node.ssh_password,
            mark: node.mark
          })
        })
        return data
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
        ssh_address: res.address,
        ssh_port: res.port,
        ssh_username: res.username,
        ssh_password: res.password,
        create_time: Date.now(),
        modify_time: null,
        delete_time: null,
        delete_flags: 0,
        mark: res.mark,
      }

      return dockerNodes.addDockerNode(value)
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
        ssh_address: res.address,
        ssh_port: res.port,
        ssh_username: res.username,
        ssh_password: res.password,
        modify_time: Date.now(),
        mark: res.mark,
      }
      console.log(value)
      return dockerNodes.updateDockerNode(value)
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

}
