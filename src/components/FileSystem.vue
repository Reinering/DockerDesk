
<template>
  <q-card style="min-width: 90%">
    <q-card-section>
      <div class="text-h6">{{t('filesystem.title')}}</div>
    </q-card-section>

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
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
      @row-dblclick="enterFolder"
    >
      <template v-slot:top="props">
        <q-space />
        <div class="q-gutter-sm">
          <q-btn icon="arrow_upward" size="xs" padding="xs" color="deep-purple" @click="onParentFolder">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.parentFolder')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="create_new_folder" size="xs" padding="xs" color="deep-purple" @click="onCreateFolder">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.createFolder')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="note_add" size="xs" padding="xs" color="purple" @click="onCreateFile">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.createFile')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="cloud_upload" size="xs" padding="xs" color="indigo" @click="onUploadFolder">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.uploadFolder')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="file_upload" size="xs" padding="xs" color="blue" @click="onUploadFile">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.uploadFile')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="refresh" size="xs" padding="xs" color="green" @click="onRefresh">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.refresh')}}
            </q-tooltip>
          </q-btn>
          <q-btn icon="delete" size="xs" padding="xs" color="red" @click="onDeleteBatch">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.batchDelete')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            size="xs" padding="xs"
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('filesystem.fullWidth')}}
            </q-tooltip>
          </q-btn>
        </div>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div
            :class="props.row.isDir ? 'text-indigo' : ''"
          >
            {{ props.row.name }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-btn
          icon="edit"
          color="primary"
          dense
          flat
          @click="showEdit(props.row)"
        >
          <q-tooltip class="bg-amber text-black shadow-4" @click="onRename(props.row)">
            {{t('filesystem.rename')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          icon="edit_document"
          color="primary"
          dense
          flat
          @click="showEdit(props.row)"
        >
          <q-tooltip class="bg-amber text-black shadow-4" @click="onEditFile(props.row)">
            {{t('edit')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          icon="download"
          color="blue"
          dense
          flat
          @click="connectTerminal(props.row)"
        >
          <q-tooltip class="bg-amber text-black shadow-4" @click="onDownload(props.row)">
            {{t('download')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          icon="delete"
          color="negative"
          dense
          flat
          @click="deleteService(props.row.id)"
        >
          <q-tooltip class="bg-amber text-black shadow-4" @click="onDelete(props.row)">
            {{t('delete')}}
          </q-tooltip>
        </q-btn>
      </template>
    </q-table>

  </q-card>
</template>

<script setup>
import { clientConfig } from 'src/common/config.js'

defineOptions({
  name: 'FileSystem',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  }
})

import { ref, inject, reactive, onMounted, onUnmounted } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const tableStyle = reactive({
  height: window.innerHeight - 210 + "px",
})
const pagination = ref({
  rowsPerPage: 0
})

const columns = [
  { name: 'name', label: t('filesystem.name'), align: 'left', sortable: true, style: 'max-width: 150px', classes: 'ellipsis', field: 'name' },
  { name: 'attribute', label: t('filesystem.attr'), align: 'left', field: 'permString' },
  { name: 'modifyTime', label: t('filesystem.modifyTime'), align: 'left', sortable: true, field: 'mtime' },
  { name: 'size', label: t('filesystem.size'), align: 'left', sortable: true, field: 'size' },
  { name: 'actions', label: t('filesystem.action'), align: 'center' }
]

const visibleColumns = ['name', 'attribute', 'modifyTime', 'size', 'actions']

const rows = reactive([])

const selected = ref([])

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}

const isSftp = ref(false)

const currentPath = ref(null)

const init = () => {
  console.log("init", props.data)
  if (props.data.data.connectionType === t('node.remoteNode')  && props.data.data.protocol === 'SSH') {
    window.sshTerminal.detect(props.data.id)
      .then((result) => {
        isSftp.value = result.success

        createTerminal()
        listDir('/home/reiner')
      })
  } else {
    $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('filesystem.initError')
    })
  }

}

const createTerminal = () => {
  if (isSftp.value) {
    window.sftpTerminal.create(props.data.id)
      .then((result) => {
        if (result.success) {

        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.initError') + ':' + result.error,
          })
        }
      })
  } else {

  }
}

const listDir = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.listDir(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
      console.log(result)
      if (result.success) {
        rows.length = 0

        rows.push(...result.data)

        currentPath.value = path
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.initError') + ':' + result.error,
        })
      }
    })
  } else {
    // window.scpTerminal
  }


}

const enterFolder = (event, row, index) => {
  if (!row.isDir) {
    return
  }

  listDir(currentPath.value + '/' + row.name)
}

const onRename = (row) => {
  console.log(row)
}

const onEditFile = () => {

}

const onDownload = () => {

}

const onDelete = () => {

}

const onParentFolder = () => {
  const parentFolder = currentPath.value.split('/').slice(0, -1).join('/')
  listDir(parentFolder)
}

const onCreateFolder = () => {

}

const onCreateFile = () => {

}

const onUploadFolder = () => {

}

const onUploadFile = () => {

}

const onRefresh = () => {

}

const onDeleteBatch = () => {

}

onMounted(() => {
  init()

})

onUnmounted(() => {

})


</script>

<style scoped>

</style>
