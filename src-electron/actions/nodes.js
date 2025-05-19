import { db } from '../database/manager.js'


export const nodes = {
  getNodes:  async () => {
    // delete_flags: 0: normal, 1: deleted
    return db('nodes')
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

  getNodeByID:  async (id) => {
    return await db('nodes')
      .where('delete_flags', '=', '0')
      .andWhere('id', '=', id)
      .select('*').then(
      rows => {
        return rows
      }, (error) => {
        return { success: false, error: error }
      })
      .catch(error => {
      return { success: false, error: error }
    })
  },

  addNode: async (data) => {
    return await db('nodes').insert(data)
      .then(result => {
        return { success: true, error: '' }
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  deleteNodeByID: async (id) => {
    return await db('nodes').where('id', '=', id).delete().then((result) => {
      return { success: true, id: id, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  delNodeByID: async (id) => {
    return await db('nodes').where('id', '=', id).update(
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

  updateNode: async (data) => {
    return await db('nodes').where('id', '=', data.id).update(
      data
    ).then((result) => {
      if (result === 0) return { success: false, error: '' }
      return { success: true, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

}
