<template>
  <q-card :style="cardStyle">
<!--    <q-card-section>-->
<!--      <div class="q-gutter-sm row items-center justify-between">-->
<!--        <div class="text-h6">{{t('panel.networks.title')}}</div>-->
<!--        <q-space />-->
<!--        <q-btn :label="t('panel.networks.create')" color="primary" @click="showDialog = true" />-->
<!--        <q-btn :label="t('panel.networks.create')" color="primary" @click="showDialog = true" />-->
<!--      </div>-->
<!--    </q-card-section>-->

<!--    <q-separator />-->

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
              <div class="self-center full-width no-outline" tabindex="0">{{t('panel.volumes.title')}}</div>
            </template>
          </q-field>
          <q-space />
          <div class="q-gutter-sm">
            <q-btn
              icon="import_export"
              size="xs"
              padding="xs"
              color="deep-purple"
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
            <q-btn icon="delete" size="xs" padding="xs" color="red" @click="onDeleteBatch">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.images.batchDelete') }}
              </q-tooltip>
            </q-btn>
            <q-btn icon="refresh" size="xs" padding="xs" color="green" @click="onRefresh">
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
            @click="connectPanel(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.createContainer')}}
            </q-tooltip>
          </q-btn>

        </template>
      </q-table>
    </q-card-section>

  </q-card>
</template>

<script setup>

import { inject, onActivated, onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import { isEmptyObj } from 'src/utils/common.js'
import { parseDockerVolume } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")
const serviceCmd = ref('')

let notify = ref(null)

const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 + "px",
})

const tableStyle = reactive({
  height: window.innerHeight - 182 + "px",
})
const visibleColumns = ['volumeName', 'driver', 'actions']
const columns = [
  { name: 'volumeName', label: t('panel.volumes.volumeName'), sortOrder: 'ad', sortable: true, align: 'left', field: 'volumeName' },
  { name: 'driver', label: t('panel.volumes.driver'), align: 'left', field: 'tag' },
  { name: 'actions', label: t('panel.volumes.action'), align: 'center' }
]

const pagination = ref({
  rowsPerPage: 0,
  sortBy: 'repository', // 初始排序的列名
  descending: false, // true 为降序，false 为升序
})

const rows = reactive([])

const getVolumeList = () => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} volume ls`]
  ).then((result) => {
    if (result.success) {
      rows.length = 0
      const data = parseDockerVolume(result.data)
      if (data.length > 0)  {
        rows.push(...data)
      }
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.networks.getVolumesError')}: ${result.error}`
      })
    }
  })
}

const init = () => {
  getVolumeList()
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

})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// watch()

</script>
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
<style scoped>

</style>
