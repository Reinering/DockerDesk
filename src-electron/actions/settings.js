import { db } from '../database/manager.js'


export const settings = {

  getByField: async (field) => {
    return db('settings')
      .where('field', '=', field)
      .select('*').then(
        rows => {
          return { success: true, data: rows }
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  updateByField: async (field) => {
    return db('settings')
      .where('field', '=', field)
      .select('*').then(
        rows => {
          return { success: true, data: rows }
        }).catch(error => {
        return { success: false, error: error }
      })
  },
}
