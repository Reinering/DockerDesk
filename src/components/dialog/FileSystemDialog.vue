<template>
  <q-dialog>
    <q-card style="min-width: 100%">
      <q-card-section>
        <div class="text-h6">{{ t('filesystem.title') }}</div>
      </q-card-section>

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
        :style="tableStyle"
        @row-dblclick="onEnterFolder"
      >
        <template v-slot:top>
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
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-btn
            dense
            flat
            icon="check_box_outline_blank"
            color="blue"
            @click="onSelect(props.row)">
            <q-tooltip class="bg-amber text-black shadow-4">
              {{ t('filesystem.select') }}
            </q-tooltip>
          </q-btn>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup>

import { inject, reactive, ref, onMounted } from 'vue'
import { clientConfig } from 'src/common/config.js'
import { isEmptyObj } from 'src/utils/common.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")
const serviceCmd = ref('')

const connectState = inject('connectState')
const dockerInfo = inject('dockerInfo')
const podmanInfo = inject('podmanInfo')

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

const currentPath = ref(null)

const columns = [
  { name: 'name', label: t('filesystem.name'), align: 'left', sortOrder: 'ad', sortable: true, style: 'max-width: 150px', classes: 'ellipsis', field: 'name' },
  { name: 'attribute', label: t('filesystem.attr'), align: 'center', field: 'permString' },
  { name: 'modifyTime', label: t('filesystem.modifyTime'), align: 'center', sortable: true, field: 'mtime' },
  { name: 'size', label: t('filesystem.size'), align: 'right', sortable: true, field: 'size' },
  { name: 'actions', label: t('filesystem.action'), align: 'center' }
]

const visibleColumns = ['name', 'attribute', 'modifyTime', 'size', 'actions']

const breadcrumbs = reactive([
  {
    label: rootPath,
    icon: "navigation",
    path: rootPath
  },
])

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

const rows = reactive([])


const onEnterFolder = (event, row, index) => {
  if (!row.isDir) {
    return
  }

  let nextDir
  if (currentPath.value.charAt(currentPath.value.length-1) === '/') {
    nextDir = currentPath.value + row.name
  } else {
    nextDir = currentPath.value + '/' + row.name
  }

  window.containerTerminal.listDir({
    connID: service.id,
    remotePath: nextDir
  }).then((result) => {
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

const onParentFolder = () => {
  if (currentPath.value === rootPath) {
    return
  }

  let parentFolder = currentPath.value.split('/').slice(0, -1).join('/')
  if (parentFolder.length === 0) {
    parentFolder = '/'
  }

  window.containerTerminal.listDir({
    connID: service.id,
    remotePath: parentFolder
  }).then((result) => {
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

const onSelect = (row) => {

}

const listDir = (path) => {
  if (!connectState.value) {
    return
  }

  window.containerTerminal.listDir({
    connID: service.id,
    remotePath: path
  }).then((result) => {
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


}

const init = async () => {
  await setTimeout(() => {}, 500)

  serviceCmd.value = service.serviceType
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  listDir(rootPath)
}

onMounted(() => {
  init()

})

</script>

<style scoped>
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
</style>
