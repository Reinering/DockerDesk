<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <q-table
        class="volumes-table"
        :rows="rows"
        :columns="columns"
        row-key="volumeName"
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
              icon="auto_delete"
              size="xs"
              padding="xs"
              color="deep-purple"
              @click="onClearVolumes"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.volumes.clearVolumes') }}
              </q-tooltip>
            </q-btn>
<!--            <q-btn-->
<!--              icon="create"-->
<!--              size="xs"-->
<!--              padding="xs"-->
<!--              color="deep-purple"-->
<!--              @click="onImportImage"-->
<!--            >-->
<!--              <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                {{ t('panel.volumes.create') }}-->
<!--              </q-tooltip>-->
<!--            </q-btn>-->
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
            icon="info"
            color="blue"
            dense
            flat
            @click="onDetail(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.volumes.detail')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            flat
            @click="onDelete(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.volumes.delete')}}
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
  height: process.env.MODE === 'electron' ? window.innerHeight - 98 + "px" : window.innerHeight - 97 + "px",
})

const tableStyle = reactive({
  height: window.innerHeight - 130 + "px",
})
const visibleColumns = ['volumeName', 'driver', 'actions']
const columns = [
  { name: 'volumeName', label: t('panel.volumes.volumeName'), sortOrder: 'ad', sortable: true, align: 'left', field: 'volumeName' },
  { name: 'driver', label: t('panel.volumes.driver'), align: 'left', field: 'driver' },
  { name: 'actions', label: t('panel.volumes.action'), align: 'center' }
]

const pagination = ref({
  rowsPerPage: 0,
  sortBy: 'volumeName', // 初始排序的列名
  descending: false, // true 为降序，false 为升序
})

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}

const rows = reactive([])
const selected = ref([])

const onClearVolumes = () => {
  $q.dialog({
    title: t('confirm'),
    message: t('panel.volumes.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    window.wslTerminal.execWSL(
      ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} volume  rm $(${serviceCmd.value} volume ls -qf dangling=true)`]
    ).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.volumes.clearVolumesSuccess')}`,
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.volumes.clearVolumesFail')}: ${result.error}`
        })
      }
    })
  })
}
const onDeleteBatch = () => {
  $q.dialog({
    title: t('confirm'),
    message: t('panel.volumes.deleteMessage'),
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
      await window.wslTerminal.execWSL(
        ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} volume rm ${item.volumeName}`]
      ).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.volumes.deleteSuccess')}: ${item.volumeName}`,
          })
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('panel.volumes.deleteFail')}: ${item.volumeName}: ${result.error}`
          })
        }
      })
    }
  })
}
const onRefresh = () => {
  getVolumeList()
}

const onDelete = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: `${t('panel.volumes.deleteMessage')}`,
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
      ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} volume rm ${row.volumeName}`]
    ).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.volumes.deleteSuccess')}: ${name}`,
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.volumes.deleteFail')}: ${name}: ${result.error}`
        })
      }
    })
  })
}
const onDetail = (row) => {
  window.wslTerminal.execWSL(
    ['-d', "DockerDesk", '--user', "root", '-e', `${serviceCmd.value} volume inspect ${row.volumeName}`]
  ).then((result) => {
    if (result.success) {

    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('panel.volumes.queryDetailFail')}: ${name}: ${result.error}`
      })
    }
  })
}



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
    cardStyle.height = window.innerHeight - 130 + "px"
    tableStyle.height = window.innerHeight - 130 + "px"
  } else {
    cardStyle.height = window.innerHeight - 97 + "px"
    tableStyle.height = window.innerHeight - 130 + "px"
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

<style scoped>
/* fix table header */
.volumes-table thead tr th {
  position: sticky;
  z-index: 1;
}
.volumes-table thead tr:first-child th {
  top: 0;
}

.volumes-table .q-table__top,
.volumes-table .q-table__bottom,
.volumes-table thead tr:first-child th {
  /* set background color for fixed header rows */
  background-color: #aba79d;
}
</style>
