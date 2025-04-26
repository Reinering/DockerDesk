import { db } from '../database/manager.js'


export const dockerNodes = {
  getDockerNodes:  async () => {
    // const stmt = db.prepare('SELECT * FROM docker_node WHERE delete_flags = 0')
    // return stmt.all()

    // delete_flags: 0: normal, 1: deleted
    return db('docker_node')
      .where('delete_flags', '=', '0')
      .select('*').then(
      rows => {
        return rows
      }).catch(error => {
        return { success: false, error: error }
      })
      // .finally(() => {
      //   db.destroy()
      // })
  },

  getDockerNodeByID:  async (id) => {
    // const stmt = db.prepare('SELECT * FROM docker_node WHERE id = ?')
    // return stmt.get('id')

    db('docker_node')
      .where('delete_flags', '=', '0', '&&', 'id', '=', id)
      .select('*').then(
      rows => {
        console.log(rows)
        return rows
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  addDockerNode: async (data) => {
    // const stmt = db.prepare(`INSERT INTO docker_node
    //     (id, name, docker_type, link_type,
    //      ssh_address, ssh_port, ssh_username, ssh_password,
    //      create_timestamp, modify_timestamp, delete_timestamp, delete_flags, mark)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    // stmt.run(data)

    return await db('docker_node').insert(data)
      .then(result => {
        return { success: true, error: '' }
    }).catch(error => {
        return { success: false, error: error }
    })
  },

  deleteDockerNodeByID: async (id) => {
    return await db('docker_node').where('id', '=', id).delete().then((result) => {
      return { success: true, id: id, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  delDockerNodeByID: async (id) => {
    return await db('docker_node').where('id', '=', id).update(
      {
        delete_time: Date.now(),
        delete_flags: 1,
      }
    ).then((result) => {
      return { success: true, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  updateDockerNode: async (data) => {
    return await db('docker_node').where('id', '=', data.id).update(
      data
    ).then((result) => {
      if (result === 0) return { success: false, error: '' }
      return { success: true, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

}
