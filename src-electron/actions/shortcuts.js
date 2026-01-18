import { db } from '../database/manager.js'



export const shortcuts = {

  getShortcutss:  async () => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*').where("delete_flags", '=', '0').then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  getShortcutsById:  async (id) => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*')
      .where("delete_flags", '=', '0')
      .andWhere("id", '=', id)
      .then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  getShortcutsByPrevId:  async (id) => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*')
      .where("delete_flags", '=', '0')
      .andWhere("prev_id", '=', id)
      .then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  getShortcutsByContainerId:  async (id) => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*')
      .where("delete_flags", '=', '0')
      .andWhere("container_id", '=', id)
      .then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

  addShortcuts: async (data) => {
    return await db('shortcuts').insert(data)
      .then((result) => {
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

  updatesShortcutsById: async (data) => {
    try {
      await db.transaction(async (trx) => {
        const updatePromises = data.map((item) => {
          if (Object.prototype.hasOwnProperty.call(item, 'pageNo')) {
            return trx('shortcuts')
              .where('id', item.id)
              .update({
                page_no: item.pageNo,
                modify_time: new Date()
              })
          } else {
            return trx('shortcuts')
              .where('id', item.id)
              .update({
                prev_id: item.prevId,
                modify_time: new Date()
              })
          }

        })

        await Promise.all(updatePromises)
      })

      return { success: true }
    } catch (error) {
      return error
    }
  },

  updateShortcutsById: async (id, data) => {
    return await db('shortcuts')
      .where('id', '=', id)
      .update(data)
      .then((result) => {
      if (result === 0) return { success: false, error: '' }
      return { success: true, error: '' }
    }).catch(error => {
      return { success: false, error: error }
    })
  },

  updatesShortcutsByPage: async (data) => {
    try {
      await db.transaction(async (trx) => {
        const updatePromises = data.map((item) => {
          if (Object.prototype.hasOwnProperty.call(item, 'pageNo')) {
            return trx('shortcuts')
              .where('id', item.id)
              .update({
                page_no: item.pageNo,
                modify_time: new Date()
              })
          } else {
            return trx('shortcuts')
              .where('id', item.id)
              .update({
                prev_id: item.prevId,
                modify_time: new Date()
              })
          }

        })

        await Promise.all(updatePromises)
      })

      return { success: true }
    } catch (error) {
      return error
    }
  },

  updatesPageShortcutsByPage: async (data) => {
    try {
      await db.transaction(async (trx) => {
        const updatePromises = data.map((item) => {
          return trx('shortcuts')
            .where('page_no', item.oldPage)
            .update({
              page_no: item.newPage,
              modify_time: new Date()
            })
        })

        await Promise.all(updatePromises)
      })

      return { success: true }
    } catch (error) {
      return error
    }
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

  delShortcutsByContainerId: async (id) => {
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

  getLastShortcutsByPage:  async (pageNo) => {
    // delete_flags: 0: normal, 1: deleted
    return db('shortcuts')
      .select('*')
      .where("delete_flags", '=', '0')
      .andWhere("page_no", '=', pageNo).then(
        rows => {
          return rows
        }).catch(error => {
        return { success: false, error: error }
      })
  },

}

export const delShortcutsById = async (id) => {
  const result = await shortcuts.getShortcutsById(id)
  if (!Array.isArray(result) || result.length === 0) {
    return result
  }
  const prevId = result[0]["prev_id"]

  const result1 = await shortcuts.getShortcutsByPrevId(id)
  if (!Array.isArray(result1)) {
    return result1
  } else if (result1.length === 0) {
    return shortcuts.delShortcutsByID(id)
  }

  const result3 =  await shortcuts.delShortcutsByID(id)
  if (!result3.success) {
    return result3
  }

  return shortcuts.updateShortcutsById(
    result1[0].id,
    {
      prev_id: prevId
    }
  )
}
