import { ipcMain } from 'electron'
import { dockerNodes } from '../actions/dockerNode.js'
import { generateUuid } from '../common/utils.js'
// import { v7 } from 'uuid'


export function registerDBIpcHandlers() {
  // ipcMain.on('getDockerNodes', () => {})

  ipcMain.handle('getDockerNodes', () => {
    const result = dockerNodes.getDockerNodes()
    return {
      id: result.id,
      serviceName: result.name,
      serviceType: result.docker_type,
      connectionType: result.connect_type,
      address: result.ssh_address,
      port: result.ssh_port,
      username: result.ssh_username,
      password: result.ssh_password,
      mark: result.mark

    }
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
      console.log("value", value)

      return dockerNodes.addDockerNode(value)
    } catch (error) {
      return { success: false, error: error.message }
    }
  })


}
