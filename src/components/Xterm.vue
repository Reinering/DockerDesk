<template>

  <div ref="xtermRef" :id="'xterm-container-' + terminalId">
    <q-menu
      context-menu
      auto-close
    >
      <q-list>
        <q-item clickable @click="onCopyButton">
          <q-item-section>
            {{ t('copy') }}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="showMenu" clickable @click="onPasteButton">
          <q-item-section>
            {{ t('paste') }}
          </q-item-section>
        </q-item>
        <q-item v-if="showMenu" clickable @click="onSelectPasteButton">
          <q-item-section>
            {{ t('selectPaste') }}
          </q-item-section>
        </q-item>
        <q-item v-if="showMenu" clickable @click="onCleanButton">
          <q-item-section>
            {{ t('clean') }}
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item v-if="showMenu" clickable @click="onRefreshButton">
          <q-item-section>
            {{ t('refresh') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup>
defineOptions({
  name: 'Xterm',
})

const props = defineProps({
  terminalId: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: () => {},
  }
})

import { inject, ref, onMounted, onBeforeUnmount, nextTick, watch, reactive, onActivated, onDeactivated } from 'vue'
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import '@xterm/xterm/css/xterm.css'
import { clientConfig } from 'src/common/config.js'


const t = inject('t')
const $q = inject('$q')

const connectState = ref('disconnected')  // disconnected / connecting / connected

const lastEnterTime = ref(0)
const DOUBLE_ENTER_THRESHOLD = ref(500)
const isDoubleEnter = ref(false)

const xtermRef = ref(null)
let term = null
let fitAddon = null
let channels = null

const xtermConfig = reactive({
  cursorBlink: true,
  theme: {
    background: '#1e1e1e',
    foreground: '#ffffff',
  },
  fontFamily: 'Consolas, "Courier New", monospace', // 设置字体
  fontSize: 16, // 设置字体大小
  fontWeight: 'normal', // 可选：字体粗细（normal, bold, 100-900）
  disableStdin: false // 禁止输入
})

const showMenu = ref(true)

const reconnect = () => {
  console.log("reconnect")
  // reconnect
  if (props.data.connectionType === t('node.remoteNode') && props.data.protocol === 'SSH') {
    window.sshTerminal.createSSHTerminal(JSON.stringify({
      uuid: props.terminalId,
      connID: props.data.id
    })).then((result) => {
      if (result.success === false) {

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
        })
      } else {
        handleResize()

        if (Object.hasOwnProperty.call(props.data, "command")) {
          setTimeout(() => {
            window.sshTerminal.execStream(JSON.stringify({
              uuid: props.terminalId,
              command: props.data.command,
            })).then((result) => {
              if (!result.success) {

                $q.notify({
                  type: 'negative',
                  position: clientConfig.quasar.notify.position,
                  message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
                })
              }
            })
          }, 2000)
        } else {
          connectState.value = "connected"
        }
      }
    })
  } else if (props.data.serviceType === 'WSL' || props.data.serviceName === "wsl_docker" || props.data.serviceName === "wsl_podman") {
    if (Object.hasOwnProperty.call(props.data, "command")) {
      window.terminal.execTerminal({
        uuid: props.terminalId,
        // cmd: `wsl -d ${props.data.serviceName} --user ${props.data.user} -e ${props.data.command}`,
        cmd: ['wsl', '-d', props.data.serviceName, "--user", props.data.user, '-e', props.data.command],
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          connectState.value = "connected"
        }
      })
    } else if (props.data.serviceName === "wsl_docker" || props.data.serviceName === "wsl_podman") {
      window.terminal.createWSLTerminal({
        uuid: props.terminalId,
        name: "DockerDesk",
        user: 'root',
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        }
      })
    } else {
      window.terminal.createWSLTerminal({
        uuid: props.terminalId,
        name: props.data.serviceName,
        user: 'root',
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          connectState.value = "connected"
        }
      })
    }
  } else {
    window.terminal.createTerminal(props.terminalId)
      .then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        }
      })

  }
}

const connect = () => {
  // init connect
  if (props.data.connectionType === t('node.remoteNode') && props.data.protocol === 'SSH') {
    window.sshTerminal.createSSHTerminal(JSON.stringify({
      uuid: props.terminalId,
      connID: props.data.id
    })).then((result) => {
      if (result.success === false) {

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
        })
      } else {
        handleResize()

        if (Object.hasOwnProperty.call(props.data, "command")) {
          setTimeout(() => {
            window.sshTerminal.execStream(JSON.stringify({
              uuid: props.terminalId,
              command: props.data.command,
            })).then((result) => {
              if (!result.success) {

                $q.notify({
                  type: 'negative',
                  position: clientConfig.quasar.notify.position,
                  message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
                })
              }
            })
          }, 2000)
        } else {
          connectState.value = "connected"

          term.onData((data) => {
            sendSSHTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
      }
    })

    window.sshTerminal.receive(
      (result) => {
        const { uuid, data } = JSON.parse(result)

        if (props.terminalId === uuid && term) {
          if (data === "Terminal disconnected") {
            connectState.value = "disconnected"
          } else {
            term.write(data)
          }
        }
      }
    )
  } else if (props.data.serviceType === 'WSL' || props.data.serviceName === "wsl_docker" || props.data.serviceName === "wsl_podman") {
    if (Object.hasOwnProperty.call(props.data, "command")) {
      window.terminal.execTerminal({
        uuid: props.terminalId,
        // cmd: `wsl -d ${props.data.serviceName} --user ${props.data.user} -e ${props.data.command}`,
        cmd: ['wsl', '-d', props.data.serviceName, "--user", props.data.user, '-e', props.data.command],
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          connectState.value = "connected"

          term.onData((data) => {
            sendTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
      })
    } else if (props.data.serviceName === "wsl_docker" || props.data.serviceName === "wsl_podman") {
      window.terminal.createWSLTerminal({
        uuid: props.terminalId,
        name: "DockerDesk",
        user: 'root',
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          term.onData((data) => {
            sendTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
      })
    } else {
      window.terminal.createWSLTerminal({
        uuid: props.terminalId,
        name: props.data.serviceName,
        user: 'root',
      }).then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          connectState.value = "connected"

          term.onData((data) => {
            sendTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
      })
    }

    window.terminal.receive(
      (result) => {
        const { uuid, data } = JSON.parse(result)
        if (props.terminalId === uuid && term) {
          if (data === "Terminal disconnected") {
            connectState.value = "disconnected"
          } else {
            term.write(data)
          }
        }
      }
    )
  } else {
    window.terminal.createTerminal(props.terminalId)
      .then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          connectState.value = "connected"

          term.onData((data) => {
            sendTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
      })

    window.terminal.receive(
      (result) => {
        const { uuid, data } = JSON.parse(result)

        if (props.terminalId === uuid && term) {
          if (data === "Terminal disconnected") {
            connectState.value = "disconnected"
          } else {
            term.write(data)
          }
        }
      }
    )
  }
}

const initTerminal = () => {
  if (Object.hasOwnProperty.call(props.data, "disableStdin")) {
    xtermConfig.disableStdin = props.data["disableStdin"]
    showMenu.value = false
  }

  term = new Terminal(xtermConfig)
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)

  term.open(xtermRef.value)
  fitAddon.fit()

  handleResize()

  connect()
}

const destroyTerminal = () => {
  if (term) {
    term.dispose()
    term = null

  }
  if (fitAddon) {
    fitAddon.dispose()
    fitAddon = null
  }
  if (channels) {

  }

  if (props.data.connectionType === t('node.remoteNode')) {
    window.sshTerminal.closeSSHTerminal(props.terminalId)
  } else {
    window.terminal.closeTerminal(props.terminalId)
  }

}

const onCopyButton = () => {
  let selectedText = term.getSelection()
  if (selectedText) {
    try {
      navigator.clipboard.writeText(selectedText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

const onPasteButton = () => {
  navigator.clipboard.readText().then(text => {
    if (props.data.connectionType === t('node.remoteNode')  && props.data.protocol === 'SSH') {
      sendSSHTerminal({
        uuid: props.terminalId,
        data: text,
      })
    } else {
      sendTerminal({
        uuid: props.terminalId,
        data: text,
      })
    }

  })
}

const onSelectPasteButton = () => {
  let selectedText = term.getSelection()
  if (selectedText) {
    try {
      navigator.clipboard.writeText(selectedText)


      if (props.data.connectionType === t('node.remoteNode')  && props.data.protocol === 'SSH') {
        sendSSHTerminal({
          uuid: props.terminalId,
          data: selectedText,
        })
      } else {
        sendTerminal({
          uuid: props.terminalId,
          data: selectedText,
        })
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

const onCleanButton = () => {
  term.clear()
}

const onRefreshButton = () => {
  connectState.value = "connecting"
  connect()
}

const sendTerminal = (data) => {
  if (connectState.value === "disconnected" && data === '\r' && isDoubleEnter.value) {
    connectState.value = "connecting"
    connect()
  } else {
    window.terminal.send(JSON.stringify(data)).then((result) => {
      if (!result.success) {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('xterm.termInitError') + ': ' + result.error
        })
      }
    })
  }
}

const sendSSHTerminal = (data) => {
  window.sshTerminal.send(JSON.stringify(data)).then((result) => {
    if (!result.success) {

      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
      })
    }
  })

  // if (connectState.value === "disconnected" && data.data === '\r') {
  //   console.log("mark1")
  //   if (isDoubleEnter.value) {
  //     connectState.value = "connecting"
  //     reconnect()
  //   }
  // } else {
  //   console.log("mark2")
  // }
}

// 行列匹配
const handleResize = () => {
  // console.log('resize', term.rows, term.cols)
  if (props.data.connectionType === t('node.remoteNode') && props.data.protocol === 'SSH') {
    window.sshTerminal.resize(JSON.stringify({
      uuid: props.terminalId,
      rows: term.rows,
      cols: term.cols,
    })).then((result) => {

    })
  } else {
    window.terminal.resize(JSON.stringify({
      uuid: props.terminalId,
      rows: term.rows,
      cols: term.cols,
    })).then((result) => {

    })
  }

}

const debounce = (func, wait) => {
  let timeout

  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 使用 ResizeObserver 监听容器尺寸变化
const setupResizeObserver = () => {
  const resizeObserver = new ResizeObserver(debounce(() => {
    if (fitAddon && xtermRef.value) {
      fitAddon.fit()
      handleResize()
    }
  }, 200))

  resizeObserver.observe(xtermRef.value)
  onBeforeUnmount(() => resizeObserver.disconnect())
}



const handleKeyDown = (event) => {
  // 标签页切换，快捷键 alt + 数字键
  console.log("handleKeyDown", event.key)
  if (event.altKey) {
  }

  // 检查是否是 Enter 键
  if (event.key === 'Enter' || event.keyCode === 13) {
    const currentTime = new Date().getTime()
    const deltaTime = currentTime - lastEnterTime.value

    // 阻止默认行为（例如表单提交或在 textarea 中换行），
    // 以免干扰双回车逻辑，这取决于你在哪里监听事件
    // event.preventDefault();

    if (deltaTime < DOUBLE_ENTER_THRESHOLD.value && deltaTime > 0) {
      // ✅ 检测到双回车
      console.log('Double Enter detected!')
      isDoubleEnter.value = true

      // 执行双回车后的操作，例如：
      // submitForm()

      // 为了防止检测到“三连回车”甚至更多，在成功检测到双回车后，
      // 最好重置 lastEnterTime 或设为一个非常小的值
      lastEnterTime.value = 0

    } else {
      // 第一次按下 Enter，或者间隔时间太长
      console.log('Single Enter or too slow.')
      lastEnterTime.value = currentTime
      isDoubleEnter.value = false
    }
  }
}

// 暴露 resize 方法给父组件
defineExpose({
  resize: () => {
    if (fitAddon) {
      fitAddon.fit()
    }
  },

  send: (data) => {
    if (term) {
      if (props.data.connectionType === t('node.remoteNode') && props.data.protocol === 'SSH') {
        sendSSHTerminal({
          uuid: props.terminalId,
          data: data,
        })
      } else {
        sendTerminal({
          uuid: props.terminalId,
          data: data,
        })
      }
    }
  }

})

onMounted(async () => {
  initTerminal()
  await nextTick()
  fitAddon.fit()

  setupResizeObserver()

  // window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  destroyTerminal()

  window.removeEventListener('keydown', handleKeyDown)
})

onActivated(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onDeactivated(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

</script>

<style scoped>
.xterm-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
