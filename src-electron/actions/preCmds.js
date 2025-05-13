import { db } from '../database/manager.js'


export const preCmds = {
  getPreCmds: async () => {
    return db('pre_cmds')
      .where('delete_flags', '=', '0')
      .select('*').then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  addPreCmd: async (data) => {
    return await db('pre_cmds').insert(data)
      .where('group', '=', data.group)
      .andWhere('label', '=', data.label)
      .andWhere('delete_flags', '=', '0')
      .then(result => {
        return { success: true, error: '' }
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  updatePreCmd: async (old, data) => {
    console.log("mark", old, data)
    return await db('pre_cmds')
      .where('group', '=', old.group)
      .andWhere('label', '=', old.label)
      .andWhere('delete_flags', '=', 0)
      .update(data).then((result) => {
        return { success: true, error: '' }
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  delPreCmd: async (data) => {
    return await db('pre_cmds').where('group', '=', data.group)
      .andWhere('label', '=', data.label)
      .update(
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

  updateGroup: async (old, data) => {
    return await db('pre_cmds')
      .where('group', '=', old)
      .andWhere('delete_flags', '=', 0)
      .update(
        {group: data}
      ).then((result) => {
        return { success: true, error: '' }
      }).catch(error => {
        return { success: false, error: error }
      })
  },

  delGroup: async (group) => {
    return await db('pre_cmds').where('group', '=', group)
      .andWhere('delete_flags', '=', 0)
      .update(
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
