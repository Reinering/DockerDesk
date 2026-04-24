<template>
  <q-card style="min-width: 100%">
    <q-card-section>
      <div class="row">
        <div class="text-h6">{{ t('filesystem.title') }}</div>

        <q-space />

        <q-btn round dense flat icon="minimize" @click="props.minimized" />
        <q-btn round dense flat icon="crop_square" @click="props.maximized" />
        <q-btn flat round dense icon="close" @click="props.closed" />
      </div>
    </q-card-section>

    <q-linear-progress size="2px" :value="lineProgress" color="accent" />

    <q-table
      class="filesystem-table"
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
          <q-btn icon="cloud_upload" size="xs" padding="xs" color="indigo" @click="triggerUploadFolder">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.uploadFolder') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="file_upload" size="xs" padding="xs" color="blue" @click="triggerUploadFilesRef">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.uploadFile') }}
            </q-tooltip>
<!--            <q-file-->
<!--              ref="uploadFilesRef"-->
<!--              v-model="uploadFiles"-->
<!--              filled-->
<!--              multiple-->
<!--              style="display: none;"-->
<!--              @update:modelValue="onUploadFiles"-->
<!--            />-->
          </q-btn>
          <q-btn
            icon="arrow_downward"
            size="xs"
            padding="xs"
            color="teal"
            @click="onDownloadBatch">
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
          <div :class="props.row.isDir ? 'text-blue' : ''">
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
</template>

<script setup>
defineOptions({
  name: 'FileSystem',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },

  minimized: {
    type: Function,
    deault: () => {}
  },

  maximized: {
    type: Function,
    deault: () => {}
  },

  closed: {
    type: Function,
    deault: () => {}
  }
})

import { ref, inject, reactive, onMounted, onUnmounted, onActivated, watch } from 'vue'
import { clientConfig } from 'src/common/config.js'

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

let notify = ref(null)

const rootPath = '/'

const columns = [
  { name: 'name', label: t('filesystem.name'), align: 'left', sortOrder: 'ad', sortable: true, style: 'max-width: 150px', classes: 'ellipsis', field: 'name' },
  { name: 'attribute', label: t('filesystem.attr'), align: 'center', field: 'permString' },
  { name: 'modifyTime', label: t('filesystem.modifyTime'), align: 'center', sortable: true, field: 'mtime' },
  { name: 'size', label: t('filesystem.size'), align: 'right', sortable: true, field: 'size' },
  { name: 'actions', label: t('filesystem.action'), align: 'center' }
]

const visibleColumns = ['name', 'attribute', 'modifyTime', 'size', 'actions']

const rows = reactive([])

const selected = ref([])

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}

const isSftp = ref(false)
const isSFTPBusying = ref(false)

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

const createTerminal = async () => {
  if (isSftp.value) {
    await window.sftpTerminal.create(props.data.id)
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
    await window.scpTerminal.create(props.data.id)
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
    window.scpTerminal.listDir(JSON.stringify({
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
  }
}

const listDirs = (path) => {
  if (isSftp.value) {
    return window.sftpTerminal.listDir(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    }))
  } else {
    return window.scpTerminal.listDir(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    }))
  }
}

const createFolder = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.cteateFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
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
    window.scpTerminal.cteateFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
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
  }
}

const createFile = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.cteateFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
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
    window.scpTerminal.cteateFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
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
    window.scpTerminal.rename(JSON.stringify({
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
  }
}

const downloadSFile = (path) => {
  const filename = path.split('/').slice(-1)
  if (isSftp.value) {
    window.sftpTerminal.downloadSFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.downloadFileSuccess')}:${filename}`
        })
      } else {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: `${t('filesystem.downloadFileError')}:${filename}:${result.error}`,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('filesystem.downloadFileError')}:${filename}:${result.error}`,
          timeout: 10000
        })
      }
    })
  } else {
    window.scpTerminal.downloadSFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.downloadFileSuccess')}:${filename}`
        })
      } else {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: `${t('filesystem.downloadFileError')}:${filename}:${result.error}`,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('filesystem.downloadFileError')}:${filename}:${result.error}`,
          timeout: 10000
        })
      }
    })
  }
}

const downloadStream = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.downloadStream({
      uuid: props.data.id,
      remotePath: path,
    }).then((result) => {
      if (!result.success) {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: `${t('filesystem.downloadFileError')}:${path.split('/').slice(-1)}:${result.error}`,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('filesystem.downloadFileError')}:${path.split('/').slice(-1)}:${result.error}`,
          timeout: 10000
        })
      }
    })
  } else {
    window.scpTerminal.downloadStream(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
      if (!result.success) {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: `${t('filesystem.downloadFileError')}:${path.split('/').slice(-1)}:${result.error}`,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: `${t('filesystem.downloadFileError')}:${path.split('/').slice(-1)}:${result.error}`,
          timeout: 10000
        })
      }
    })
  }

  lineProgress.value = 0

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('filesystem.downloadingFile'),
    caption: '0%'
  })
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
    window.scpTerminal.deleteFile(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
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
    window.scpTerminal.deleteFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
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
  }
}

const downloadFolder = (path) => {
  if (isSftp.value) {
    window.sftpTerminal.downloadFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path,
    })).then((result) => {
      if (!result.success) {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: t('filesystem.downloadFolderError') + ':' + result.error,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: t('filesystem.downloadFolderError') + ':' + result.error,
          timeout: 10000
        })
      }
    })
  } else {
    window.scpTerminal.downloadFolder(JSON.stringify({
      uuid: props.data.id,
      remotePath: path
    })).then((result) => {
      if (!result.success) {
        // $q.notify({
        //   type: 'negative',
        //   position: clientConfig.quasar.notify.position,
        //   message: t('filesystem.downloadFolderError') + ':' + result.error,
        // })

        notify.value({
          type: 'negative',
          icon: 'done',
          spinner: false,
          message: t('filesystem.downloadFolderError') + ':' + result.error,
          timeout: 10000
        })
      }
    })
  }

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('filesystem.downloadingFolder'),
    caption: '0%'
  })
}

const enterFolder = (event, row, index) => {
  if (!row.isDir) {
    return
  }

  let nextDir
  if (currentPath.value.charAt(currentPath.value.length-1) === '/') {
    nextDir = currentPath.value + row.name
  } else {
    nextDir = currentPath.value + '/' + row.name
  }

  listDirs(nextDir)
    .then((result) => {
      if (result.success) {
        rows.length = 0

        rows.push(...result.data)

        currentPath.value = nextDir

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

const totalBytesRead = ref(0)
const lastProgress = ref(0)
const lineProgress = ref(0.0)

const uploadFile1 = async (file) => {
  if (isSftp.value) {
    if (file.size <= clientConfig.file.limitSize) {
      const buffer = await file.arrayBuffer()
      await window.sftpTerminal.uploadSFile({
        uuid: props.data.id,
        remotePath: currentPath.value + '/' + file.name,
        // fileData: file
        fileData: {
          name: file.name,
          buffer: buffer,
        },
      }).then((result) => {
        // console.log('Original file size:', file.size); // 打印原始文件大小
        // console.log('ArrayBuffer size:', buffer.byteLength); // 打印 ArrayBuffer 大小

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
      await window.sftpTerminal.uploadStreamStart({
        uuid: props.data.id,
        remotePath: currentPath.value + '/' + file.name
      }).then(async (result) => {
        if (!result.success) {
          return $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('filesystem.uploadFileError')}:${file.name}:${result.error}`,
          })
        }

        $q.notify({
          type: 'info',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.uploadFileStart')}:${file.name}`,
        })

        // file.size
        $q.loadingBar.start()
        totalBytesRead.value = 0
        lastProgress.value = 0
        lineProgress.value = 0.0

        const stream = file.stream()
        const reader = stream.getReader()

        await uploadFileChunk(file, reader)

      })
    }
  } else {

  }
}


const uploadSFile = async (file) => {
  if (isSftp.value) {
    return await window.sftpTerminal.uploadSFile({
      uuid: props.data.id,
      remotePath: currentPath.value + '/' + file.name,
      fileData: file
    }).then((result) => {
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
    return await window.scpTerminal.uploadStream({
      uuid: props.data.id,
      remotePath: currentPath.value,
      localPath: file
    })
  }
}

const uploadFile = async (file) => {
  lineProgress.value = 0.0

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('filesystem.uploadingFile'),
    caption: '0%'
  })

  if (isSftp.value) {
    window.sftpTerminal.uploadStream({
      uuid: props.data.id,
      remotePath: currentPath.value,
      localPath: file.path
    })

    isSFTPBusying.value = true
  } else {
    window.scpTerminal.uploadStream({
      uuid: props.data.id,
      remotePath: currentPath.value,
      localPath: file.path
    })

    isSFTPBusying.value = true
  }
}

const uploadFileChunk = async (file, reader) => {
  const { done, value } = await reader.read()
  if (done) {
    return window.sftpTerminal.uploadStreamEnd({
      uuid: props.data.id,
      remotePath: currentPath.value + '/' + file.name,
    }).then(async (result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.uploadFileSuccess')}:${file.name}`,
        })

        listDir(currentPath.value)
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.uploadFileError')}:${file.name}:${result.error}`,
        })
      }

      $q.loadingBar.stop()
    })
  }

  totalBytesRead.value += value.byteLength
  const progress = parseInt((totalBytesRead.value / file.size).toFixed(2))
  if (progress - lastProgress.value >= 0.01) { // 每增加1%更新一次
    // console.log('progress', progress, Object.prototype.toString.call(progress))
    lineProgress.value = progress
    $q.loadingBar.increment(progress - lastProgress.value)
    lastProgress.value = progress
  }

  window.sftpTerminal.uploadStreamChunk({
    uuid: props.data.id,
    remotePath: currentPath.value + '/' + file.name,
    chunk: value,
  }).then(async (result) => {
    if (!result.success) {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('filesystem.uploadFileError')}:${file.name}:${result.error}`,
      })
    }
  })

  uploadFileChunk(file, reader)
}

const uploadFolder = async (folder, ) => {
  if (isSftp.value) {
    window.sftpTerminal.uploadFolder({
      uuid: props.data.id,
      remotePath: currentPath.value,
      localPath: folder,
    }).then(async (result) => {
      isSFTPBusying.value = false

      if (result.success) {
        // $q.notify({
        //   type: 'positive',
        //   position: clientConfig.quasar.notify.position,
        //   message: `${t('filesystem.uploadFolderSuccess')}:${folder.split('\\').slice(-1)}`,
        // })

        // listDir(currentPath.value)
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.uploadFolderError')}:${folder.split('\\').slice(-1)}:${result.error}`,
        })
      }
    })
  } else {
    window.scpTerminal.uploadFolder({
      uuid: props.data.id,
      remotePath: currentPath.value,
      localPath: folder,
    }).then(async (result) => {
      isSFTPBusying.value = true

      if (!result.success) {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('filesystem.uploadFolderError')}:${folder.split('\\').slice(-1)}:${result.error}`,
        })
      }
    })
  }

  isSFTPBusying.value = true

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('filesystem.uploadingFolder'),
    caption: '0%'
  })
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
  }).onDismiss(() => {
  })
}

const onDownload = (row) => {
  if (row.isDir) {
    downloadFolder(currentPath.value + '/' + row.name)
  } else {
    if (row.size <= clientConfig.file.limitSize) {
      downloadSFile(currentPath.value + '/' + row.name)
    } else {
      downloadStream(currentPath.value + '/' + row.name)
    }
  }
}

const onDelete = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: `${t('filesystem.deleteMessage')}\n${row.name}`,
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

  let parentFolder = currentPath.value.split('/').slice(0, -1).join('/')
  if (parentFolder.length === 0) {
    parentFolder = '/'
  }

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
  // $q.loadingBar.start()
  $q.loadingBar.stop()
}

const triggerUploadFilesRef = async () => {
  // if (uploadFilesRef.value) {
  //   uploadFilesRef.value.pickFiles() // 调用目标按钮的 click 方法
  // }

  const files = await window.myWindowAPI.selectFiles()
  try {
    if (files.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  for (const file of files) {
    if (file.size <= clientConfig.file.limitSize) {
      await uploadSFile(file)
    } else {
      // 大文件：先等待上一个任务结束
      console.log("等待中...")
      await waitUntilReady()

      console.log("开始上传大文件:", file.name)
      // 务必使用 await，确保这个文件传完才进入下一个循环迭代
      await uploadFile(file)
    }
  }
}

const waitUntilReady = () => {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (!isSFTPBusying.value) {
        clearInterval(timer)
        resolve()
      }
    }, 3000) // 每 500ms 检查一次状态
  })
}

const triggerUploadFolder = async () => {
  const folders = await window.myWindowAPI.selectFolders()
  try {
    if (folders.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  // console.log(folders)
  for (const folder of folders) {
    await waitUntilReady()

    await uploadFolder(folder)
  }
}

const onUploadFiles = async (files) => {
  const tmpFiles = files.slice(0)
  files.length = 0

  for (const file of tmpFiles) {
    await uploadFile(file)
  }
}

const onDownloadBatch = async () => {
  if (selected.value.length === 0) {
    return
  }

  if (isSftp.value) {
    for (const file of selected.value) {
      if (file.isDir) {
        downloadFolder(currentPath.value + '/' + file.name)
      } else {
        downloadSFile(currentPath.value + '/' + file.name)
      }
    }
  } else {
    window.scpTerminal.downloadBatch(JSON.stringify({
      uuid: props.data.id,
      remotePath: currentPath.value,
      files: selected.value
    })).then((result) => {
      if (result.success) {

      } else {

      }
    })

    notify.value = $q.notify({
      type: 'info',
      group: false,
      timeout: 0,
      spinner: true,
      position: 'bottom-right',
      message: t('filesystem.downloadingFolder'),
      caption: '0%'
    })
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

    selected.value.length = 0
  })
}

const onEditFile = (row) => {
  if (row.isDir) {
    return
  }

  window.sftpTerminal.openFile({
      uuid: props.data.id,
      remotePath: currentPath.value + '/' + row.name,
    }).then((result) => {
    if (!result.success) {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('filesystem.openFileError')}:${result.error}`,
      })
    }
  })
}


const init = async () => {
  // console.log("init", props.data)
  if (props.data.data.connectionType === t('node.remoteNode')  && props.data.data.protocol === 'SSH') {
    await window.sshTerminal.detect(props.data.id)
      .then(async (result) => {
        isSftp.value = result.success

        await createTerminal()
        listDir(rootPath)
      })

    if (isSftp.value) {
      window.sftpTerminal.receive(
        (result) => {
          // const { uuid, data } = JSON.parse(result)
          const { uuid, data } = result

          if (props.data.id === uuid) {
            $q.notify({
              type: 'negative',
              position: clientConfig.quasar.notify.position,
              message: `${t('filesystem.sftpError')}:${data}`,
            })
          }
        }
      )

      // window.sftpTerminal.uploadFile((result) => {
      //   // const { uuid, data, error } = JSON.parse(result)
      //   const { uuid, data, error } = result
      //
      //   if (props.data.id === uuid) {
      //     $q.notify({
      //       type: 'negative',
      //       position: clientConfig.quasar.notify.position,
      //       message: `${t('filesystem.uploadFileError')}:${error}`,
      //     })
      //   }
      // })
    }

  } else if (props.data.data.connectionType === t('node.localNode')) {
    $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('filesystem.initError')
    })
  } else {
    $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('filesystem.initError')
    })
  }
}

const receive = () => {
  window.sftpTerminal.onProgress((result) => {
    const { uuid, type, file, progress, status, error } = result
    if (props.data.id === uuid ) {
      if (status === "doing") {
        lineProgress.value = parseFloat(progress)

        notify.value({
          caption: `${parseInt(progress*100)}%`
        })
      } else if (status === "done"  && type === "upload") {
        if (error) {
          notify.value({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: `${t('filesystem.uploadFileSuccess')}: ${file}: ${error}`,
            timeout: 10000
          })
        } else {
          notify.value({
            type: 'positive',
            icon: 'done',
            spinner: false,
            message: `${t('filesystem.uploadFileSuccess')}: ${file}`,
            timeout: 3000
          })

          if (!isBatch.value) {
            listDir(currentPath.value)
          }
        }

        isSFTPBusying.value = false
      } else if (status === "done"  && type === "download") {
        if (error) {
          notify.value({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: `${t('filesystem.downloadFileSuccess')}: ${file}: ${error}`,
            timeout: 10000
          })
        } else {
          notify.value({
            type: 'positive',
            icon: 'done',
            spinner: false,
            message: `${t('filesystem.downloadFileSuccess')}: ${file}`,
            timeout: 3000
          })
        }

        isSFTPBusying.value = false
      }
    }
  })
}

onMounted( () => {
  init()

  receive()
})

onActivated(() => {
})

onUnmounted(() => {

})

watch(() => props.data, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  init()

})
</script>

<style>
/* fix table header */
.filesystem-table thead tr th {
  position: sticky;
  z-index: 1;
}
.filesystem-table thead tr:first-child th {
  top: 0;
}

.filesystem-table .q-table__top,
.filesystem-table .q-table__bottom,
.filesystem-table thead tr:first-child th {
  /* set background color for fixed header rows */
  background-color: #aba79d;
}

:deep(.q-editor-content pre) {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  margin: 10px 0;
}

:deep(.q-editor-content code) {
  font-family: 'Courier New', monospace;
  background: transparent;
}
</style>
