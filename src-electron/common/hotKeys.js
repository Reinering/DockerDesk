import { globalShortcut } from 'electron'
import { settings } from '../actions/settings.js'



export const HotKeys = {

  // local
  defaultLocal: [
    {
      name: 'findBar',
      txt: 'Show/Hide findBar',
      func: "showFindBar",
      keys: ['Ctrl', 'F'],
      enable: true,
      isEdit: false,
      desc: 'setting.findBar'
    },
  ],

  localRegistry: async (mainWindow) => {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.type !== 'keyDown') return

      // Mac 常用 Command，Windows/Linux 常用 Control
      const isCmdOrCtrl = input.control || input.meta
      const isShift = input.shift
      const isAlt = input.alt

      if (!isCmdOrCtrl && !isShift && isAlt) {
        event.preventDefault()
      }

      for (const item of HotKeys.defaultLocal) {
        if (!item.enable || !Object.prototype.hasOwnProperty.call(HotKeys, item.func)) {
          continue
        }

        if (item.keys.length === 2) {
          if (item.keys[0] === "Ctrl" && isCmdOrCtrl && item.keys[1] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          } else if (item.keys[0] === 'Shift' && isShift && item.keys[1] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          } else if (item.keys[0] === 'Alt' && isAlt && item.keys[1] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          }

        } else if (item.keys.length === 3) {
          if (item.keys[0] === "Ctrl" && isCmdOrCtrl && item.keys[1] === 'Shift' && isShift && item.keys[2] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          } else if (item.keys[0] === "Ctrl" && isCmdOrCtrl && item.keys[1] === 'Alt' && isAlt && item.keys[2] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          }
        } else if (item.keys.length === 4) {
          if (item.keys[0] === "Ctrl" && isCmdOrCtrl && item.keys[1] === 'Shift' && isShift && item.keys[2] === 'Alt' && isAlt && item.keys[3] === input.key.toUpperCase()) {
            HotKeys[item.func]()
          }
        }
      }
    })
  },

  // global

  mainWin: null,
  result: [],
  defaultGlobal: [
    {
      name: 'showWindow',
      txt: 'Show/Hide Window',
      func: "showWindow",
      keys: ['Ctrl', 'Alt', 'H'],
      enable: false,
      isEdit: true,
      desc: 'setting.quickShowHide'

    },


    // {
    //   name: 'switchTab',
    //   txt: 'Switch Tab',
    //   func: "switchTab",
    //   keys: ['Alt', 'Num'],
    //   enable: false,
    //   isEdit: false,
    //   desc: 'setting.switchTab'
    // }
  ],

  registerAll: async (mainWindow) => {
    if (!mainWindow && !HotKeys.mainWin) {
      return
    } else if (mainWindow) {
      HotKeys.mainWin = mainWindow
    }

    const result = await settings.getByField("hot_keys")
    if (!result.success) {
      return
    }

    let data = JSON.parse(result.data[0].value)
    if (data.length === 0) {
      const result = await settings.updateByField({field: "hot_keys", value: JSON.stringify(HotKeys.defaultGlobal)})
      if (result.success) {
        data = HotKeys.defaultGlobal
      } else {
        HotKeys.result = result
        return
      }
    }

    HotKeys.result.length = 0
    for (const item of data) {

      if (!item.enable || !Object.prototype.hasOwnProperty.call(HotKeys, item.func)) {
        continue
      }

      let ret
      if (item.name === "switchTab") {
        ret = await HotKeys.switchTab.registry()
      } else {
        ret = await HotKeys.register(item.keys.join('+'), HotKeys[item.func])
      }

      HotKeys.result.push(ret)
    }
  },

  unRegisterAll: async () => {
    try {
      const result = await settings.getByField("hot_keys")
      if (!result.success) {
        return
      }

      const data = JSON.parse(result.data[0].value)
      for (const item of data) {
        if (!item.enable || !Object.prototype.hasOwnProperty.call(HotKeys, item.func)) {
          continue
        }

        if (item.name === "switchTab") {
          HotKeys.switchTab.unRegister()
        } else {
          HotKeys.unRegister(item.keys.join('+'))
        }
      }
    } catch (e) {
      console.log(e)
    }
  },

  register: (accelerator, func) => {
    const ret = globalShortcut.register(accelerator, func)

    if (!ret) {
      console.log(`快捷键 ${accelerator} 注册失败 → 已经被其他程序占用`)

      return { success: false }
      // 这里可以：
      // 1. 提示用户
      // 2. 尝试备选快捷键
      // 3. 记录日志
      // 4. 弹窗让用户手动改快捷键
    } else {
      console.log(`快捷键 ${accelerator} 注册成功`)
    }

    // 额外检查（可选）
    if (globalShortcut.isRegistered(accelerator)) {
      console.log('isRegistered 确认已注册（仅代表本程序注册成功）')
      return { success: true }
    }
  },

  unRegister: (accelerator) => {
    try {
      globalShortcut.unregister(accelerator)
      return { success: true }
    } catch (e) {
      return { success: false, error: e}
      }
  },

  restore: () => {
    return HotKeys.unRegisterAll().then(() => {
      return settings.updateByField({
        field: "hot_keys",
        value: JSON.stringify(HotKeys.defaultGlobal)
      }).then((result) => {
        if (!result.success) {
          return result
        }

        return HotKeys.registerAll()
      })
    })
  },

  showWindow: () => {
    if (!HotKeys.mainWin) return

    if (HotKeys.mainWin.isVisible()) {
      HotKeys.mainWin.hide()
      // 可选：失去焦点时自动隐藏更自然
      // mainWindow.blur()
    } else {
      HotKeys.mainWin.show()
      HotKeys.mainWin.focus()           // 非常重要！否则用户感觉没反应
    }
  },

  switchTab: {
    registry: async () => {
      // 注册 Ctrl + 1 到 Ctrl + 0
      const rets = []
      for (let i = 1; i <= 6; i++) {
        const key = i === 10 ? '0' : String(i)
        const accelerator = `CommandOrControl+${key}`   // macOS 用 Cmd，Win/Linux 用 Ctrl

        const ret = await HotKeys.register(accelerator, () => {
          HotKeys.mainWin.webContents.send('switchTabOnHotKey', i - 1)
        })

        rets.push(ret)
      }

      return {success: true, data: rets}
    },

    unRegister: () => {
      // 注册 Ctrl + 1 到 Ctrl + 0
      for (let i = 1; i <= 6; i++) {
        const key = i === 10 ? '0' : String(i)
        const accelerator = `CommandOrControl+${key}`   // macOS 用 Cmd，Win/Linux 用 Ctrl

        HotKeys.unRegister(accelerator)
      }

      return {success: true}
    }

  },

  showFindBar: async () => {
    HotKeys.mainWin.webContents.send('showFindBar')
  }


}

