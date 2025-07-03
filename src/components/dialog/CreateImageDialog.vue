<template>
  <q-dialog persistent>
    <q-card style="min-width: 60%">

      <q-card-section>
        <q-item-label class="text-h6">{{t('panel.images.createImage')}}</q-item-label>
        <q-item-label class="text-deep-orange-9" caption lines="1" >{{hintNote}}</q-item-label>
<!--        <q-item-label class="text-pink" caption lines="1" >{{hintMessage}}</q-item-label>-->
      </q-card-section>

      <q-card-section>
        <q-form >
          <q-input
            filled
            bottom-slots
            v-model="DockerFile.folderPath"
            :label="t('panel.images.inputHint1')"
            dense
          >
            <template v-slot:append>
              <q-icon
                v-if="DockerFile.folderPath !== ''"
                name="close"
                @click="DockerFile.folderPath = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="add_circle_outline" @click="onSelectFolder" />
            </template>
          </q-input>

          <q-input
            v-if="service.connectionType === t('node.remoteNode')"
            filled
            bottom-slots
            v-model="DockerFile.filePath"
            :label="t('panel.images.inputHint1')"
            dense
          >
            <template v-slot:append>
              <q-icon
                v-if="DockerFile.folderPath !== ''"
                name="close"
                @click="DockerFile.folderPath = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-file
            v-if="service.connectionType !== t('node.remoteNode')"
            dense
            filled
            v-model="DockerFile.filePath"
            :label="t('panel.images.inputHint2')"
          >
            <template v-if="DockerFile.filePath" v-slot:append>
              <q-icon name="cancel" @click.stop.prevent="DockerFile.filePath = null" class="cursor-pointer" />
            </template>
          </q-file>
        </q-form>

        <div class="row q-pa-md q-gutter-sm">
          <q-input
            dense
            filled
            v-model="newRepository.repository"
            :label="t('panel.images.newRepository')"
            :rules="[
              val => !!val || t('verifyMessage.dataNotNull'),
              val => val.length <= 255 || t('verifyMessage.dataLenNotMax') + '255',
              val => /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*$/.test(val) || t('verifyMessage.invalidRepositoryName'),
              val => !val.startsWith('/') && !val.endsWith('/') || t('verifyMessage.repositoryNameSlash'),
              val => !val.includes('//') || t('verifyMessage.repositoryNameDoubleSlash')
            ]"
          />
          <q-input
            dense
            filled
            v-model="newRepository.tag"
            :label="t('panel.images.newTag')"
            :rules="[
              val => !!val || t('verifyMessage.dataNotNull'),
              val => val.length <= 128 || t('verifyMessage.dataLenNotMax') + '128',
              val => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(val) || t('verifyMessage.invalidImageTag'),
              val => !val.startsWith('.') && !val.startsWith('-') || t('verifyMessage.tagStartChar'),
              val => !val.includes('..') || t('verifyMessage.tagDoubleDot')
            ]"
          />
        </div>
      </q-card-section>
      <q-card-section>

      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onCreate" />
      </q-card-actions>
    </q-card>

    <FileSystemDialog
      v-if="showFileSystemDialog"
      v-model="showFileSystemDialog"
      :onSelect="onSelect"
      :onClose="onCloseSystemDialog"
    />
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
import FileSystemDialog from 'components/dialog/FileSystemDialog.vue'
import { usePodmanStore } from 'src/stores/podman.js'
import { isEmptyObj, isEmptyStr, format, firstLower } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const podmanStore = usePodmanStore()

const service = inject("service")
const serviceCmd = ref('')

const connectState = inject('connectState')
const dockerInfo = inject('dockerInfo')
const podmanInfo = inject('podmanInfo')
const wslInfo = inject('wslInfo')

let notify = ref(null)

const hintNote = ref('')
const hintMessage = ref('')

const isOK = ref(false)

const DockerFile = reactive({
  folderPath: null,
  filePath: null
})

const newRepository = reactive({
  repository: '',
  tag: 'latest',
})

const showFileSystemDialog = ref(false)

const onCloseSystemDialog = () => {
  showFileSystemDialog.value = false
}

const onSelectFolder = async () => {
  if (service.connectionType === t('node.remoteNode')) {
    showFileSystemDialog.value = !showFileSystemDialog.value
  } else {
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

    DockerFile.folderPath = folders[0]
  }
}

const onSelect = (path, row) => {
  if (row.isDir) {
    if (path.charAt(path.length-1) === '/') {
      DockerFile.folderPath = path + row.name
    } else {
      DockerFile.folderPath = path + '/' + row.name
    }
  } else {
    DockerFile.folderPath = path
    DockerFile.filePath = row.name
  }
}

const onCreate = () => {
  if (DockerFile.folderPath === '' || newRepository.repository === '' || newRepository.tag === '') {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('verifyMessage.dataNotNull')}`
    })
  }

  let file = ''
  if (!isEmptyObj(DockerFile.filePath)) {
    if (typeof DockerFile.filePath === "string") {
      file = `-f ${DockerFile.filePath}`
    } else {
      file = `-f ${DockerFile.filePath.name}`
    }
  }

  if (service.connectionType === t('node.remoteNode')) {
    if (!connectState.value) {
      return
    }

    if (serviceCmd.value === "docker" && !dockerInfo.enable) {
      return
    } else if (serviceCmd.value === "podman" && !podmanInfo.enable) {
      return
    }

    let cmd = ''
    if (serviceCmd.value === "docker") {
      cmd = `bash -c "cd ${firstLower(DockerFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} build ${file} -t ${newRepository.repository}:${newRepository.tag} ."`
    } else {
      let env = ''
      if (podmanStore.getENV.length > 0) {
        env = `export ${podmanStore.getENV.join(' && ')}`
      }

      cmd = `bash -c "${env} cd ${firstLower(DockerFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} build ${file} -t ${newRepository.repository}:${newRepository.tag} ."`
    }

    router.push({
      path: 'logs',
      query: {
        tab: "logs",
        data: JSON.stringify({
          label: service.serviceName,
          icon: 'terminal',
          data: {
            id: service.id,
            serviceName: service.serviceName,
            serviceType: service.serviceType,
            connectionType: service.connectionType,
            protocol: service.protocol,
            disableStdin: true,
            command: cmd
          }
        })
      }
    })
  } else {
    if (!wslInfo.enable) {
      return
    }

    let cmd = ''
    if (serviceCmd.value === "docker") {
      cmd = `bash -c "cd /mnt/${firstLower(DockerFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} build ${file} -t ${newRepository.repository}:${newRepository.tag} ."`
    } else {
      let env = ''
      if (podmanStore.getENV.length > 0) {
        env = `export ${podmanStore.getENV.join(' && ')}`
      }

      cmd = `bash -c "${env} cd /mnt/${firstLower(DockerFile.folderPath).replace(':', '').replace(/\\/g, '/')} && ${serviceCmd.value} build ${file} -t ${newRepository.repository}:${newRepository.tag} ."`
    }

    router.push({
      path: 'logs',
      query: {
        tab: "logs",
        data: JSON.stringify({
          label: service.address,
          icon: 'terminal',
          data: {
            serviceName: service.address,
            serviceType: 'WSL',
            user: 'root',
            disableStdin: true,
            command: cmd
          }
        })
      }
    })
  }

  DockerFile.folderPath  = null
  DockerFile.filePath  = null
  newRepository.repository = ''
  newRepository.tag = 'latest'

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
  //       message: `${t('panel.container.composeFail')}: ${result.error}`,
  //       timeout: 10000
  //     })
  //   }
  //
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

  serviceCmd.value = firstLower(service.serviceType)
  if (isEmptyObj(serviceCmd.value)) {
    isOK.value = true
    return
  }
}

onMounted(() => {
  init()

})

onUnmounted(() => {

})

</script>


<style scoped>

</style>
