<template>
  <q-dialog persistent>
    <q-card style="min-width: 70%">

      <q-card-section>
        <q-item-label class="text-h6">{{t('panel.container.createTitle')}}</q-item-label>
        <q-item-label class="text-deep-orange-9" caption lines="1" >{{hintNote}}</q-item-label>
        <q-item-label class="text-pink" caption lines="1" >{{hintMessage}}</q-item-label>
      </q-card-section>

      <q-card-section>
        <q-form >
          <q-input
            filled
            bottom-slots
            v-model="composeFile.folderPath"
            :label="t('panel.containers.inputHint1')"
            dense
          >
            <template v-slot:append>
              <q-icon
                v-if="composeFile.folderPath !== ''"
                name="close"
                @click="composeFile.folderPath = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="add_circle_outline" @click="onSelectFolder" />
            </template>
          </q-input>

          <q-file
            dense
            filled
            v-model="composeFile.filePath"
            :label="t('panel.containers.inputHint2')"
          >
            <template v-if="composeFile.filePath" v-slot:append>
              <q-icon name="cancel" @click.stop.prevent="composeFile.filePath = null" class="cursor-pointer" />
            </template>
          </q-file>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onCreate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject, ref, onMounted, onUnmounted, reactive } from 'vue'
import { usePodmanStore } from 'src/stores/podman.js'
import { isEmptyObj, firstLower } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const podmanStore = usePodmanStore()

const service = inject("service")
const serviceCmd = ref('')

let notify = ref(null)

const hintNote = ref('')
const hintMessage = ref('')

const isOK = ref(false)

const composeFile = reactive({
  folderPath: null,
  filePath: null
})

const onSelectFile = async () => {

  const files = await window.myWindowAPI.selectFiles()
  try {
    if (files.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  if (files[0].indexOf(' ') !== -1) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.containers.pathIncludeSpace')}`
    })
  }

  composeFile.filePath = files[0]
}

const onSelectFolder = async () => {
  const folders = await window.myWindowAPI.selectFolders()
  try {
    if (folders.length === 0) {
      return
    }
  } catch (err) {
    return
  }
  if (folders[0].indexOf(' ') !== -1) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.containers.pathIncludeSpace')}`
    })
  }

  composeFile.folderPath = folders[0]
}

const onCreate = () => {
  if (composeFile.folderPath === '') {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('verifyMessage.dataNotNull')}`
    })
  }

  let file = ''
  if (!isEmptyObj(composeFile.filePath)) {
    file = `-f ${composeFile.filePath.name}`
  }

  let cmd = ''
  if (serviceCmd.value === "docker-compose") {
    cmd = `bash -c "cd /mnt/${firstLower(composeFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} ${file} up -d"`
  } else {
    let env = ''
    if (podmanStore.getENV.length > 0) {
      env = `export ${podmanStore.getENV.join(' && ')}`
    }

    cmd = `bash -c "${env}  cd /mnt/${firstLower(composeFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} ${file} up -d"`
  }

  router.push({
    path: 'logs',
    query: {
      tab: "logs",
      data: JSON.stringify({
        label: "DockerDesk",
        icon: 'terminal',
        data: {
          serviceName: "DockerDesk",
          serviceType: 'WSL',
          user: 'root',
          disableStdin: true,
          command: cmd
        }
      })
    }
  })

  composeFile.folderPath  = null
  composeFile.filePath  = null

  props.onClose()

  // window.wslTerminal.execWSL([
  //   '-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', cmd
  // ]).then((result) => {
  //   if (result.success) {
  //     notify.value({
  //       type: 'positive',
  //       group: false,
  //       icon: 'done',
  //       spinner: false,
  //       message: `${t('panel.container.composeSuccess')}`,
  //       timeout: 10000
  //     })
  //
  //   } else {
  //     notify.value({
  //       type: 'negative',
  //       icon: 'done',
  //       spinner: false,
  //       message: `${t('panel.container.composeFail')}`,
  //       timeout: 10000
  //     })
  //   }
  // })
  //
  // notify.value = $q.notify({
  //   type: 'info',
  //   group: false,
  //   timeout: 0,
  //   spinner: true,
  //   position: 'bottom-right',
  //   message: t('panel.container.composing'),
  // })
}


const init = async () => {
  await setTimeout(() => {}, 500)

  serviceCmd.value = `${service.serviceType}-compose`
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  await window.wslTerminal.execWSL([
    '-d', 'DockerDesk', '--user', 'root', '-e', `${serviceCmd.value} -v`
  ]).then((result) => {
    console.log(result)
    if (result.success) {
      hintMessage.value = result.data
    } else {
      hintMessage.value = t('panel.containers.hintError', [serviceCmd.value])
      isOK.value= true
    }
  })

  hintNote.value = t('panel.containers.hintNote', [serviceCmd.value, service.serviceType])
}

onMounted(() => {
  init()

})

onUnmounted(() => {

})

</script>


<style scoped>

</style>
