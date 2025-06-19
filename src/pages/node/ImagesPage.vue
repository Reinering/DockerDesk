<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <q-table
        class="images-table"
        :rows="rows"
        :columns="columns"
        row-key="id"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        flat
        bordered
        hide-bottom
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
        :style="tableStyle"
      >
        <template v-slot:top>
          <q-field
            dense
            standout
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{t('panel.images.title')}}</div>
            </template>
          </q-field>
          <q-space />
          <div class="q-gutter-sm">
            <q-btn
              icon="add_task"
              size="xs"
              padding="xs"
              color="pink"
              @click="showCreateImageDialog = !showCreateImageDialog"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.createImage') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="import_export"
              size="xs"
              padding="xs"
              color="blue"
              @click="onImportImage"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.import') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="download"
              size="xs"
              padding="xs"
              color="deep-purple"
              @click="showPullDialog = !showPullDialog"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.pull') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              size="xs"
              padding="xs"
              color="red"
              @click="onDeleteBatch"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.batchDelete') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="refresh"
              size="xs"
              padding="xs"
              color="green"
              @click="onRefresh"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.refresh') }}
              </q-tooltip>
            </q-btn>
          </div>
        </template>

        <template v-slot:body-cell-actions="props" >
          <q-btn
            icon="edit"
            color="primary"
            dense
            flat
            @click="onEdit(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.edit')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="tag"
            color="primary"
            dense
            flat
            @click="onRetag(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.reTag')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            flat
            @click="deleteImage(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.delete')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="save_alt"
            color="blue"
            dense
            flat
            @click="onExportImage(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.export')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="upload"
            size="xs"
            padding="xs"
            color="deep-purple"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('panel.images.push') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="post_add"
            color="green"
            dense
            flat
            @click="onCreateContainer(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.createContainer')}}
            </q-tooltip>
          </q-btn>

        </template>
      </q-table>

    </q-card-section>
  </q-card>

  <q-dialog v-model="showEditImageDialog">
    <q-card class="q-gutter-sm" style="min-width: 60%; height: 330px;" >
      <q-card-section>
        <div class="text-h6">{{editImageDialogTitle}}</div>
      </q-card-section>

      <div class="q-gutter-sm">
        <div class="row justify-center q-gutter-sm">
          <q-input
            filled
            readonly
            v-model="oldTag.repository"
            :label="t('panel.images.oldRepository')"
          />
          <q-input
            filled
            readonly
            v-model="oldTag.tag"
            :label="t('panel.images.oldTag')"
          />
        </div>

        <q-separator />

        <div class="row justify-center q-gutter-sm">
          <q-input
            filled
            v-model="newTag.repository"
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
            filled
            v-model="newTag.tag"
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
      </div>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showEditImageDialog = !showEditImageDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onEditImage" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ImagePullDialog
    v-if="showPullDialog"
    v-model="showPullDialog"
    :rows="pullList"
    :search="onImageSearch"
    :pull="onImagePull"
    style="width: 60%; height: 70%"
  />

  <CreateImageDialog
    v-if="showCreateImageDialog"
    v-model="showCreateImageDialog"
    :onClose="onShowCreateImageDialog"
  />

</template>

<script setup>

import { inject, reactive, ref, onMounted, onUnmounted, onActivated, onDeactivated, watch } from 'vue'
import ImagePullDialog from 'components/dialog/ImagePullDialog.vue'
import CreateImageDialog from 'components/dialog/CreateImageDialog.vue'
import { usePodmanStore } from 'src/stores/podman.js'
import { parseDockerImages, parsePullDockerImages, parsePodmanImages, parsePullPodmanImages } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'
import { firstLower, isEmptyObj } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const podmanStore = usePodmanStore()

const service = inject("service")
const serviceCmd = ref('')

const showCreatePage = inject("showCreatePage")

let notify = ref(null)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 + "px",
})

const tableStyle = reactive({
  height: window.innerHeight - 182 + "px",
})
const visibleColumns = ['repository', 'tag', 'imageId', 'created', 'size', 'port', 'actions']
const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'repository', label: t('panel.images.repository'), sortOrder: 'ad', sortable: true, align: 'left', field: 'repository' },
  { name: 'tag', label: t('panel.images.tag'), align: 'left', field: 'tag' },
  { name: 'imageId', label: t('panel.images.imageId'), sortable: true, align: 'left', field: 'imageId' },
  { name: 'created', label: t('panel.images.created'), sortable: true, align: 'left', field: 'created' },
  { name: 'size', label: t('panel.images.size'), sortable: true, align: 'left', field: 'size' },
  { name: 'actions', label: t('panel.images.action'), align: 'center' }
]

const pagination = ref({
  rowsPerPage: 0,
  sortBy: 'repository', // 初始排序的列名
  descending: false, // true 为降序，false 为升序
})

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}

const showPullDialog = ref(false)

const rows = reactive([])
const selected = ref([])

const pullList = reactive([])

const showEditImageDialog = ref(false)
const editImageDialogTitle = ref('')
const oldTag = reactive({
  repository: '',
  tag: '',
})
const newTag = reactive({
  repository: '',
  tag: '',
  imageId: ''
})
const isEdit = ref(true)

const showCreateImageDialog = ref(false)

const onImageSearch = (text) => {
  let command
  if (serviceCmd.value === "docker") {
    command = ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} search ${text}`]
  } else if (serviceCmd.value === "podman") {
    const env = podmanStore.getENV

    if (env.length > 0) {
      command = ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"export ${env.join(' && ')} ${serviceCmd.value} search ${text}"`]
    } else {
      command = ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} search ${text}`]
    }
  }

  pullList.length = 0
  window.wslTerminal.execWSL(command).then((result) => {
    if (result.success) {
      let data
      if (serviceCmd.value === "podman") {
        data = parsePullPodmanImages(result.data)
      } else {
        data = parsePullDockerImages(result.data)
      }

      if (data.length > 0) {
        pullList.push(...data)
      }
    } else {}
  })
}

const onImagePull = (name) => {
  let command
  if (serviceCmd.value === "docker") {
    command = ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} pull ${name}`]
  } else {
    let env = ''
    if (podmanStore.getENV.length > 0) {
      env = `export ${podmanStore.getENV.join(' && ')}`
    }

    command = ['-d', "DockerDesk", '--user', "root", '-e', "bash", '-c', `"${env} ${serviceCmd.value} pull ${name} 2>&1"`]

  }

  window.wslTerminal.execWSL(command).then((result) => {
    console.log("pull", result)
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        icon: 'done',
        spinner: false,
        message: `${t('panel.images.pullSuccess')}`,
        timeout: 10000
      })

      getImageList()
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('panel.images.pullFail')}: ${result.error}`,
        timeout: 10000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.images.pulling'),
  })
}

const deleteImage = (row) => {
  let name = row.repository
  if (row.repository === "<none>") {
    name = row.imageId
  } else if (row.tag !== "<none>") {
    name += `:${row.tag}`
  }

  $q.dialog({
    title: t('confirm'),
    message: `${t('panel.images.deleteMessage')}\n${name}`,
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    window.wslTerminal.execWSL(
      ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} rmi ${name}`]
    ).then((result) => {
      if (result.success) {
        notify.value({
          type: 'positive',
          group: false,
          icon: 'done',
          spinner: false,
          message: `${t('panel.images.deleteSuccess')}: ${name}`,
          timeout: 10000
        })

        onRefresh()
      } else {
        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('panel.images.deleteFail')}: ${name}: ${result.error}`,
          timeout: 10000
        })
      }
    })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('panel.images.deleting'),
    })
  })
}

const onEdit = (row) => {
  editImageDialogTitle.value = t('panel.images.editImageTitle')
  showEditImageDialog.value = true
  isEdit.value = true

  oldTag.repository = row.repository
  oldTag.tag = row.tag
  oldTag.imageId = row.imageId
  newTag.repository = row.repository
  newTag.tag = 'latest'
  newTag.imageId = row.imageId
}

const onRetag = (row) => {
  editImageDialogTitle.value = t('panel.images.retagImageTitle')
  showEditImageDialog.value = true
  isEdit.value = false

  oldTag.repository = row.repository
  oldTag.tag = row.tag
  oldTag.imageId = row.imageId
  newTag.repository = row.repository
  newTag.tag = 'latest'
  newTag.imageId = row.imageId
}

const onEditImage = () => {
  if (oldTag.repository === newTag.repository && oldTag.tag === newTag.tag) {
    return $q.notify({
      type: 'positive',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.images.unmodified')}`,
    })
  }

  const commands = []

  let newName = newTag.repository
  if (newTag.tag !== "<none>" && newTag.tag !== '') {
    newName += `:${newTag.tag}`
  }
  commands.push(['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} tag ${newTag.imageId} ${newName}`],)

  let oldName = oldTag.repository
  if (oldTag.repository !== "<none>" && newTag.tag !== "<none>" && oldTag.tag !== '') {
    oldName += `:${oldTag.tag}`
    commands.push(['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} rmi ${oldName}`])
  }

  if (isEdit.value) {
    window.wslTerminal.execSWSL(commands).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.images.editImageSuccess')}`,
        })

        showEditImageDialog.value = false
        getImageList()
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.images.editImageFail')}`
        })
      }
    })
    //
    // notify.value = $q.notify({
    //   type: 'info',
    //   group: false,
    //   timeout: 0,
    //   spinner: true,
    //   position: 'bottom-right',
    //   message: t('panel.images.exporting'),
    // })
  } else {
    window.wslTerminal.execWSL(
      ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} tag ${newTag.imageId} ${newName}`]
    ).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.images.editImageSuccess')}`,
        })

        showEditImageDialog.value = false
        getImageList()
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.images.editImageFail')}`
        })
      }
    })
  }
}

const onExportImage = async (row) => {
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
      message: `${t('panel.images.pathIncludeSpace')}`
    })
  }

  let filename = row.repository
  if (row.repository === "<none>") {
    filename = row.imageId
  } else {
    filename = filename.replace('/', '_')
  }

  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', 'bash', '-c',
      `"${serviceCmd.value} save ${row.imageId} > "/mnt/${firstLower(folders[0]).replace(':', '').replace(/\\/g, '/')}/${filename}.tar""`]
  ).then((result) => {
    if (result.success) {
      notify.value({
        type: 'positive',
        group: false,
        icon: 'done',
        spinner: false,
        message: `${t('panel.images.exportSuccess')}`,
        timeout: 10000
      })
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('panel.images.exportFail')}`,
        timeout: 10000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.images.exporting'),
  })
}

const loadImage = async (file) => {
  await window.wslTerminal.execWSL([
    '-d', "DockerDesk", '--user', "root", '-e', 'bash', '-c',
    `"${serviceCmd.value} load < "/mnt/${firstLower(file).replace(':', '').replace(/\\/g, '/')}""`
  ]).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.images.importSuccess')}: ${result.data}`,
      })

      onRefresh()
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.images.importFail')}: ${file}: ${result.error}`
      })
    }
  })
}

const onImportImage = async () => {
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
      message: `${t('panel.images.pathIncludeSpace')}`
    })
  }

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('panel.images.importing'),
  })

  for (const file of files) {
    await loadImage(file)
  }

  notify.value({
    type: 'positive',
    group: false,
    icon: 'done',
    spinner: false,
    message: `${t('panel.images.importSuccess')}`,
    timeout: 10000
  })
}

const onDeleteBatch = async () => {
  if (selected.value.length > 0) {
    $q.dialog({
      title: t('confirm'),
      message: t('panel.images.deleteMessage'),
      ok: {
        push: true
      },
      cancel: {
        push: true,
        color: 'negative'
      },
      persistent: true
    }).onOk(async () => {
      for (const item of selected.value) {
        let name = item.repository
        if (item.repository === "<none>") {
          name = item.imageId
        } else if (item.tag !== "<none>") {
          name += `:${item.tag}`
        }

        await window.wslTerminal.execWSL(
          ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} rmi ${name}`]
        ).then((result) => {
          if (result.success) {
            $q.notify({
              type: 'positive',
              position: clientConfig.quasar.notify.position,
              message: `${t('panel.images.deleteSuccess')}: ${name}`,
            })
          } else {
            $q.notify({
              type: 'negative',
              position: clientConfig.quasar.notify.position,
              message: `${t('panel.images.deleteFail')}: ${name}: ${result.error}`
            })
          }
        })
      }

      selected.value.length = 0
      onRefresh()
    })
  }
}

const onRefresh = () => {
  getImageList()
}

const onShowCreateImageDialog = () => {
  showCreateImageDialog.value = !showCreateImageDialog.value
}

const onCreateContainer = (row) => {
  console.log(row)

  showCreatePage()
  router.push({path: "create", query: {tab: 'create', data: JSON.stringify(row)}})
}


const getImageList = () => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} images`]
  ).then((result) => {
    if (result.success) {
      rows.length = 0
      if (serviceCmd.value === "docker") {
        const data = parseDockerImages(result.data)
        if (data.length > 0)  {
          rows.push(...data)
        }
      } else if (serviceCmd.value === "podman") {
        const data = parsePodmanImages(result.data)
        if (data.length > 0)  {
          rows.push(...data)
        }
      }

    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.images.getImagesError')}: ${result.error}`
      })
    }
  })
}

const init = () => {
  getImageList()
}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 182 + "px"
    tableStyle.height = window.innerHeight - 182 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 + "px"
    tableStyle.height = window.innerHeight - 182 + "px"
  }
}

onMounted(() => {
  serviceCmd.value = service.serviceType
  if (isEmptyObj(serviceCmd.value)) {
    return
  }
  init()

  window.addEventListener('resize', checkScreenSize)
})

onActivated(() => {
  onRefresh()
})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// watch()

</script>

<style scoped>
/* fix table header */
.images-table thead tr th {
  position: sticky;
  z-index: 1;
}
.images-table thead tr:first-child th {
  top: 0;
}

.images-table .q-table__top,
.images-table .q-table__bottom,
.images-table thead tr:first-child th {
  /* set background color for fixed header rows */
  background-color: #aba79d;
}
</style>
