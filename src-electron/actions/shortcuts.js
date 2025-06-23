import { db } from '../database/manager.js'



export const shortcuts = {

  getShortcutss:  async () => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*').then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  addShortcuts: async (data) => {
    return await db('shortcuts').insert(data)
      .then(result => {
        return { success: true, error: '' }
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  updateShortcuts: async (data) => {
    return await db('shortcuts').where('id', '=', data.id).update(
      data
    ).then((result) => {
      if (result === 0) return { success: false, error: '' }
      return { success: true, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  deleteShortcutsByID: async (id) => {
    return await db('shortcuts').where('id', '=', id).delete().then((result) => {
      return { success: true, id: id, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  delShortcutsByID: async (id) => {
    return await db('shortcuts').where('id', '=', id).update(
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
}
