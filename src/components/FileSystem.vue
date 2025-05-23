<template>
  <q-card style="min-width: 90%">
    <q-card-section>
      <div class="text-h6">{{ t('filesystem.title') }}</div>
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
        <q-breadcrumbs gutter="xs" class="text-orange" >
          <q-breadcrumbs-el
            v-for="(item, index ) in breadcrumbs"
            :key="index"
            :label="item.label"
            :icon="item.icon"
            @click="onBreadcrumbs(item)"
          />
        </q-breadcrumbs>
        <q-space />
        <div class="q-gutter-sm">
          <q-btn
            icon="arrow_upward"
            size="xs"
            padding="xs"
            color="deep-purple"
            @click="onParentFolder"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.parentFolder') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="create_new_folder"
            size="xs"
            padding="xs"
            color="deep-purple"
            @click="onCreateFolder"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.createFolder') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="note_add" size="xs" padding="xs" color="purple" @click="onCreateFile">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.createFile') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="cloud_upload" size="xs" padding="xs" color="indigo" @click="onUploadFolder">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.uploadFolder') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="file_upload" size="xs" padding="xs" color="blue" @click="triggerUploadFilesRef">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.uploadFile') }}
            </q-tooltip>
            <q-file
              ref="uploadFilesRef"
              v-model="uploadFiles"
              filled
              multiple
              style="display: none;"
              @update:modelValue="onUploadFiles"
            />
          </q-btn>
          <q-btn icon="arrow_downward" size="xs" padding="xs" color="teal" @click="onDownloadBatch">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.batchDownload') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="refresh" size="xs" padding="xs" color="green" @click="onRefresh">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.refresh') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="delete" size="xs" padding="xs" color="red" @click="onDeleteBatch">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.batchDelete') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            size="xs"
            padding="xs"
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.fullWidth') }}
            </q-tooltip>
          </q-btn>
        </div>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div :class="props.row.isDir ? 'text-indigo' : ''">
            {{ props.row.name }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-btn icon="edit" color="primary" dense flat @click="onRename(props.row)">
          <q-tooltip class="bg-amber text-black shadow-4">
            {{ t('filesystem.rename') }}
          </q-tooltip>
        </q-btn>

        <q-btn icon="download" color="blue" dense flat @click="onDownload(props.row)">
          <q-tooltip class="bg-amber text-black shadow-4">
            {{ t('download') }}
          </q-tooltip>
        </q-btn>

        <q-btn icon="delete" color="negative" dense flat @click="onDelete(props.row)">
          <q-tooltip class="bg-amber text-black shadow-4">
            {{ t('delete') }}
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="!props.row.isDir"
          icon="edit_document"
          color="primary"
          dense
          flat
          @click="onEditFile(props.row)"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{ t('edit') }}
          </q-tooltip>
        </q-btn>
      </template>
    </q-table>
  </q-card>

  <q-dialog v-model="isShowEditorDialog" style="width: 90%; height: 90%" persistent>
    <q-card>
      <q-card-actions>
        <Editor />
      </q-card-actions>

      <q-card-actions align="right">
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="addService" />
        <q-btn :label="t('cancel')" class="q-mt-md" color="negative" @click="closeEditorDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject, reactive, onMounted, onUnmounted } from 'vue'
import { clientConfig } from 'src/common/config.js'
import Editor from 'src/components/Editor.vue'

defineOptions({
  name: 'FileSystem',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  }
})

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const tableStyle = reactive({
  height: window.innerHeight - 210 + "px",
})
const pagination = ref({
  rowsPerPage: 0,
  sortBy: 'name', // 初始排序的列名
  descending: false, // true 为降序，false 为升序
})

const rootPath = '/'

const columns = [
  { name: 'name', label: t('filesystem.name'), align: 'left', sortOrder: 'ad', sortable: true, style: 'max-width: 150px', classes: 'ellipsis', field: 'name' },
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

const breadcrumbs = reactive([
  {
    label: rootPath,
    icon: "navigation",
    path: rootPath
  },
])

const uploadFilesRef = ref(null);
const uploadFiles = reactive([])

const isBatch = ref(false)

const init = () => {
  console.log("init", props.data)
  if (props.data.data.connectionType === t('node.remoteNode')  && props.data.data.protocol === 'SSH') {
    window.sshTerminal.detect(props.data.id)
      .then((result) => {
        isSftp.value = result.success

        createTerminal()
        listDir(rootPath)
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

const listDirs = (path) => {
  if (isSftp.value) {
    return window.sftpTerminal.listDir(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    }))
  } else {
    // window.scpTerminal
  }
}

const createFolder = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.cteateFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    }))
      .then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.createFolderSuccess')
          })

          listDir(currentPath.value)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.createFolderError') + ':' + result.error,
          })
        }
      })
  } else {

  }
}

const createFile = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.cteateFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    }))
      .then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.createFileSuccess')
          })

          listDir(currentPath.value)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.createFileError') + ':' + result.error,
          })
        }
      })
  } else {

  }
}

const rename = (newValue, oldValue) => {
  if (isSftp.value) {
    window.sftpTerminal.rename(JSON.stringify({
      uuid: props.data.id,
      newValue: newValue,
      oldValue: oldValue
    })).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.renameSuccess')
          })

          listDir(currentPath.value)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.renameError') + ':' + result.error,
          })
        }
      })
  } else {

  }
}

const downloadFile = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.downloadFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.downloadFileSuccess')
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.downloadFileError')}:${path}:${result.error}`,
        })
      }
    })
  } else {

  }
}

const deleteFile = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.deleteFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.deleteFileSuccess')
        })

        if (!isBatch.value) {
          listDir(currentPath.value)
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.deleteFileError')}:${path}:${result.error}`,
        })
      }
    })
  } else {

  }
}

const deleteFolder = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.deleteFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.deleteFolderSuccess')
        })

        if (!isBatch.value) {
          listDir(currentPath.value)
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.deleteFolderError')}:${path}:${result.error}`,
        })
      }
    })
  } else {

  }
}

const downloadFolder = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.downloadFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.downloadFolderSuccess')
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.downloadFolderError') + ':' + result.error,
        })
      }
    })
  } else {

  }
}

const enterFolder = (event, row, index) => {
  if (!row.isDir) {
    return
  }

  listDirs(currentPath.value + '/' + row.name)
    .then((result) => {
      if (result.success) {
        rows.length = 0

        rows.push(...result.data)

        currentPath.value = currentPath.value + '/' + row.name

        breadcrumbs.push({
          label: row.name,
          path: currentPath.value,
        })

        if (breadcrumbs.length === 2) {
          breadcrumbs[0].label = ''
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.initError') + ':' + result.error,
        })
      }
  })
}

const uploadFile = async (file) => {
  console.log("mark", file)
  if (isSftp.value) {
    if (file.size <= clientConfig.file.limitSize) {
      const buffer = await file.arrayBuffer()
      await window.sftpTerminal.uploadSFile({
        uuid: props.data.id,
        remotePath: currentPath.value + '/' + file.name,
        fileData: {
          name: file.name,
          buffer: buffer,
        },
      }).then((result) => {
        console.log('Original file size:', file.size); // 打印原始文件大小
        console.log('ArrayBuffer size:', buffer.byteLength); // 打印 ArrayBuffer 大小
        if (buffer.byteLength !== file.size) {
          console.error('ArrayBuffer size does not match file size!');
        }

        console.log(result)
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('filesystem.uploadFileSuccess')
          })

          listDir(currentPath.value)
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('filesystem.uploadFileError')}:${file.name}:${result.error}`,
          })
        }
      })
    } else {

    }


  } else {

  }
}

const onBreadcrumbs = (item) => {
  listDir(item.path)

  const itemPath = item.path
  for (let i = 0; i <= breadcrumbs.length; i++) {
    if (breadcrumbs[i].path === itemPath ) {
      breadcrumbs.splice(i+1)
      break
    }
  }
  if (breadcrumbs.length === 1) {
    breadcrumbs[0].label = rootPath
  }
}

const onRename = (row) => {
  $q.dialog({
    title: t('filesystem.rename'),
    message: row.isDir ? t('filesystem.modify') + t('filesystem.folderName') : t('filesystem.modify') + t('filesystem.fileName'),
    prompt: {
      model: row.name,
      type: 'text' // optional
    },
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk((data) => {
    if (row.name === data) {
      return $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('filesystem.modifyNameHint'),
      })
    }

    rename(currentPath.value + '/' + data, currentPath.value + '/' + row.name)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

const isShowEditorDialog = ref(false)

const closeEditorDialog = () => {
  isShowEditorDialog.value = false
}

const onEditFile = () => {
  isShowEditorDialog.value = !isShowEditorDialog.value
}

const onDownload = (row) => {
  if (row.isDir) {
    downloadFolder(currentPath.value + '/' + row.name)
  } else {
    downloadFile(currentPath.value + '/' + row.name)
  }
}

const onDelete = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: t('filesystem.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    if (row.isDir) {
      deleteFolder(currentPath.value + '/' + row.name)
    } else {
      deleteFile(currentPath.value + '/' + row.name)
    }
  })
}

const onParentFolder = () => {
  if (currentPath.value === rootPath) {
    return
  }
  const parentFolder = currentPath.value.split('/').slice(0, -1).join('/')

  listDirs(parentFolder)
    .then((result) => {
      if (result.success) {
        rows.length = 0

        rows.push(...result.data)

        currentPath.value = parentFolder

        breadcrumbs.pop()
        if (breadcrumbs.length === 1) {
          breadcrumbs[0].label = rootPath
        }
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('filesystem.initError') + ':' + result.error,
        })
      }
    })
}

const onCreateFolder = () => {
  $q.dialog({
    title: t('filesystem.createFolder'),
    message: t('filesystem.enter') + t('filesystem.folderName'),
    prompt: {
      model: '',
      type: 'text' // optional
    },
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk((data) => {
    createFolder(currentPath.value + '/' + data)
  }).onCancel(() => {
  }).onDismiss(() => {
  })
}

const onCreateFile = () => {
  $q.dialog({
    title: t('filesystem.createFile'),
    message: t('filesystem.enter') + t('filesystem.fileName'),
    prompt: {
      model: '',
      type: 'text' // optional
    },
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk((data) => {
    createFile(currentPath.value + '/' + data)
  }).onCancel(() => {
  }).onDismiss(() => {
  })
}

const onUploadFolder = () => {
  console.log("mark")
  // $q.loadingBar.start()
  $q.loadingBar.stop()
}

const triggerUploadFilesRef = () => {
  if (uploadFilesRef.value) {
    uploadFilesRef.value.pickFiles() // 调用目标按钮的 click 方法
  }
}

const onUploadFiles = async (files) => {
  const tmpFiles = files.slice(0)
  files.length = 0

  for (const file of tmpFiles) {
    await uploadFile(file)
  }
}

const onDownloadBatch = () => {
  if (selected.value.length === 0) {
    return
  }

  for (const file of selected.value) {
    if (file.isDir) {
      downloadFolder(currentPath.value + '/' + file.name)
    } else {
      downloadFile(currentPath.value + '/' + file.name)
    }
  }

  selected.value.length = 0
}

const onRefresh = () => {
  listDir(currentPath.value)
}

const onDeleteBatch = () => {
  if (selected.value.length === 0) {
    return
  }

  $q.dialog({
    title: t('confirm'),
    message: t('filesystem.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {

    isBatch.value = true
    for (const file of selected.value) {
      if (file.isDir) {
        deleteFolder(currentPath.value + '/' + file.name)
      } else {
        deleteFile(currentPath.value + '/' + file.name)
      }
    }

    isBatch.value = false
    listDir(currentPath.value)
  })

  selected.value.length = 0
}

onMounted(() => {
  init()

})

onUnmounted(() => {

})
</script>

<style scoped></style>
