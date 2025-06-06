<template>

  <div ref="xtermRef" :id="'xterm-container-' + terminalId">
    <q-menu context-menu auto-close>
      <q-list>
        <q-item clickable @click="onCopyButton">
          <q-item-section>
            {{ t('copy') }}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="onPasteButton">
          <q-item-section>
            {{ t('paste') }}
          </q-item-section>
        </q-item>
        <q-item clickable @click="onSelectPasteButton">
          <q-item-section>
            {{ t('selectPaste') }}
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

import { inject, ref, onMounted, onBeforeUnmount, nextTick, watch, reactive, onActivated, onDeactivated } from 'vue'
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import '@xterm/xterm/css/xterm.css'
import { clientConfig } from 'src/common/config.js'

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

const t = inject('t')
const $q = inject('$q')

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
})

const initTerminal = () => {
  term = new Terminal(xtermConfig)
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)

  term.open(xtermRef.value)
  fitAddon.fit()

  handleResize()

  // init connect
  if (props.data.connectionType === t('node.remoteNode') && props.data.protocol === 'SSH') {
    window.sshTerminal.createSSHTerminal(JSON.stringify({
      uuid: props.terminalId,
      connID: props.data.id
    }))
      .then((result) => {
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          term.onData((data) => {
            sendSSHTerminal({
              uuid: props.terminalId,
              data: data,
            })
          })
        }
    })

    window.sshTerminal.receive(
      (result) => {
        const { uuid, data } = JSON.parse(result)

        if (props.terminalId === uuid && term) {
          term.write(data)
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
          term.write(data)
        }
      }
    )
  }
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
    console.log("selectedText", text)

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

const sendTerminal = (data) => {
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
}

// 行列匹配
const handleResize = () => {
  // console.log('resize', term.rows, term.cols)
  window.terminal.resize(JSON.stringify({
    uuid: props.terminalId,
    rows: term.rows,
    cols: term.cols,
  })).then((result) => {

  })
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
  console.log("mark", event.key)
  if (event.altKey) {
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
