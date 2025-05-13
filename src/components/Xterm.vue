<template>
  <div ref="xtermRef" class="xterm-container"></div>
</template>

<script setup>
defineOptions({
  name: 'Xterm',
})

import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import '@xterm/xterm/css/xterm.css'

const props = defineProps({
  terminalId: {
    type: String,
    required: true,
  },
  connection: {
    type: Object,
    default: () => ({}),
  },
})

const xtermRef = ref(null)
let term = null
let fitAddon = null
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

  term.onData((data) => {
    if (props.connection.type === 'ssh' && sshStream) {
      sshStream.write(data)
    }
  })
}

const handleResize = () => {
  window.addEventListener('resize', () => {
    if (fitAddon) {
      fitAddon.fit()
    }
  })
}

const connectSSH = () => {
  const { Client } = require('ssh2')
  const conn = new Client()
  conn
    .on('ready', () => {
      conn.shell((err, stream) => {
        if (err) throw err
        sshStream = stream
        stream
          .on('data', (data) => {
            term.write(data.toString())
          })
          .on('close', () => {
            term.write('\r\nConnection closed\r\n')
            conn.end()
          })
      })
    })
    .connect(props.connection.config) // 例如 { host: 'remote-host', port: 22, username: 'user', password: 'pass' }
}

// 使用 ResizeObserver 监听容器尺寸变化
const setupResizeObserver = () => {
  const resizeObserver = new ResizeObserver(() => {
    if (fitAddon && xtermRef.value) {
      fitAddon.fit()
    }
  })
  resizeObserver.observe(xtermRef.value)
  onBeforeUnmount(() => resizeObserver.disconnect())
}

// 暴露 resize 方法给父组件
defineExpose({
  resize: () => {
    if (fitAddon) {
      fitAddon.fit();
    }
  },
});

onMounted(async () => {
  initTerminal()
  await nextTick()
  fitAddon.fit()
  setupResizeObserver()
  if (props.connection.type === 'ssh') {
    connectSSH()
  }
})

onBeforeUnmount(() => {
  if (term) {
    term.dispose()
  }
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
