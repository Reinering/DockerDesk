<template>
  <div ref="xtermRef" :id="'xterm-container-' + terminalId"></div>
</template>

<script setup>
defineOptions({
  name: 'Xterm',
})

import { inject, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
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
let sshStream = null

const initTerminal = () => {
  term = new Terminal({
    cursorBlink: true,
    theme: {
      background: '#1e1e1e',
      foreground: '#ffffff',
    },
  })
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)

  term.open(xtermRef.value)
  fitAddon.fit()

  handleResize()
  console.log("mark", props.data)

  // init connect
  if (props.data.connectionType === t('node.remoteNode')) {
    window.sshTerminal.createSSHTerminal(JSON.stringify({
      uuid: props.terminalId,
      connID: props.data.id
    }))
      .then((result) => {
        console.log("ssh", result)
        if (result.success === false) {

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: 'SSH ' + t('xterm.termInitError') + ': ' + result.error
          })
        } else {
          term.onData((data) => {
            console.log(data)
            sendTerminal({
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

const sendTerminal = (data) => {
  console.log("send", data)
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
  console.log("sendSSHTerminal", data)

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


const handleResize = () => {
  console.log('resize', term.rows, term.cols)
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
      fitAddon.fit();
    }
  },

  send: (data) => {
    if (term) {
      console.log('send', data)
      if (props.data.connectionType === t('node.remoteNode') && props.data.serviceType === 'SSH') {
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

  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  destroyTerminal()

  if (sshStream) {
    sshStream.end()
  }
})

</script>

<style scoped>
.xterm-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
