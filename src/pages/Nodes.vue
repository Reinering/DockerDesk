<template>
  <q-layout container :style="background" class="shadow-2 rounded-borders">
    <q-page padding>
      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">{{diaglogTitle}}</div>
          </q-card-section>
          <q-card-section>
            <q-form >
              <q-input
                class="q-mb-sm"
                v-model="newService.serviceName"
                :label="t('node.serviceName')"
                maxlength="20"
                outlined
                dense
                :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20'
                ]"
              />
              <q-select
                class="q-mb-sm"
                v-model="newService.connectionType"
                :options="connectionOptions"
                :label="t('node.serviceType') + '(' + t('node.local') + t('node.remote') + ')'"
                outlined
                dense
              />
              <q-select
                v-model="newService.serviceType"
                :options="serviceTypeOptions"
                :label="t('node.serviceType') + '(Docker/Podman/SSH/Telnet)'"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.address"
                :label="t('node.address')+ '(SSH: localhost)'"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.port"
                :label="t('node.port') + '(SSH: 22)'"
                type="number"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.username"
                :label="t('username') + '(SSH)'"
                type="text"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.password"
                :label="t('password') + '(SSH)'"
                type="password"
                maxlength="50"

                outlined
                dense
                class="q-mb-sm"
              />

              <q-input
                v-model="newService.mark"
                :label="t('node.mark')"
                maxlength="50"
                outlined
                dense
                class="q-mb-sm"
              />

            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="primary" @click="addService" />
            <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeDialog" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6">{{t('node.serviceManagement')}}</div>
            <q-btn :label="t('node.addService')" color="primary" @click="showDialog = true" />
          </div>
        </q-card-section>
        <q-table
          :rows="services"
          :columns="columns"
          row-key="id"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :visible-columns="visibleColumns"
          flat
          bordered
          :style="tableStyle"
        >
          <template v-slot:body-cell-actions="props">
            <q-btn
              icon="edit"
              color="primary"
              dense
              flat
              @click="showEdit(props.row)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('edit')}}
            </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              color="negative"
              dense
              flat
              @click="deleteService(props.row.id)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('delete')}}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.connectionType === t('node.remoteNode')"
              icon="link"
              color="negative"
              dense
              flat
              @click="connectService(props.row)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('connect')}}
              </q-tooltip>
            </q-btn>

          </template>
        </q-table>
      </q-card>
    </q-page>
  </q-layout>
</template>

<script setup>
// 定义组件名称
defineOptions({
  name: 'rNodes',
})

import { inject, ref, onMounted, onUnmounted, onBeforeMount, watch, reactive } from 'vue'
import { deepClone, isEmptyObj } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'
import { useNavigatorStore } from 'stores/navigator.js'
import { changeNavigatorGoto } from "src/utils/router.js"

const name = 'node'

const $q = inject("$q")
const router = inject("router")
const t = inject("t")
const navigatorStore = useNavigatorStore()

const tableStyle = reactive({
  height: window.innerHeight - 210 + "px",
})
const pagination = ref({
  rowsPerPage: 0
})

const diaglogTitle = ref(t('node.addServiceTitle'))

const showDialog = ref(false)

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
})

const services = reactive([
  { id: '111111', serviceName: '本地 Docker', connectionType: '本地节点', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { id: '111112', serviceName: '远程 Podman', connectionType: '远程节点', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
])

const newService = reactive({
  id: '',
  serviceName: '',
  connectionType: '',
  serviceType: '',
  address: '',
  port: '',
  username: '',
  password: '',
  mark: ''
})

const connectionOptions = [t('node.localNode'), t('node.remoteNode')]

const serviceTypeOptions = ['Docker', 'Podman', 'SSH', 'Telnet']

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'serviceName', label: t('node.serviceName'), align: 'left', field: 'serviceName' },
  { name: 'connectionType', label: t('node.connectionType'), align: 'left', field: 'connectionType' },
  { name: 'serviceType', label: t('node.serviceType'), align: 'left', field: 'serviceType' },
  { name: 'address', label: t('node.address'), align: 'left', field: 'address' },
  { name: 'port', label: t('node.port'), align: 'left', field: 'port' },
  { name: 'actions', label: t('node.action'), align: 'center' }
]

const visibleColumns = ['serviceName', 'connectionType', 'serviceType', 'address', 'port', 'actions']

const isEdit = ref(false)

const checkScreenHeightSize = () => {
  background.height = window.innerHeight - 70 + "px"
  tableStyle.height = window.innerHeight - 210 + "px"
}

const cleanService = () => {
  newService.id = ''
  newService.serviceName = ''
  newService.connectionType = ''
  newService.serviceType = ''
  newService.address = ''
  newService.port = ''
  newService.username = ''
  newService.password = ''
  newService.mark = ''
}

const closeDialog = () => {
  cleanService()
  showDialog.value = false
  isEdit.value = false

  diaglogTitle.value = t('node.addServiceTitle')
}

const addService = () => {
  diaglogTitle.value = t('node.addServiceTitle')
  if (
    newService.serviceName &&
    newService.serviceType &&
    newService.connectionType &&
    (newService.connectionType === t('node.localNode') || (newService.address && newService.port && newService.username && newService.password))
  ) {
    const data = deepClone(newService)
    if (data.connectionType === t('node.localNode')) {
      data.connectionType = "local"
    } else if (data.connectionType === t('node.remoteNode')) {
      data.connectionType = "remote"
    }

    console.log('edit data', data)

    // edit
    if (isEdit.value === true) {
      editService(data)
      isEdit.value = false
      return
    }

    // add
    window.nodes.addNode(JSON.stringify(data)).then((res) => {
      if (res.success) {
        newService.id = res.data.id
        newService.password = res.data.password
        services.push({ ...newService })

        cleanService()
        showDialog.value = false

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('database.addSuccess')
        })
      } else {
        let errMsg = ''
        if (res.error instanceof Error) {
          errMsg = JSON.stringify(res.error)
        } else {
          errMsg = res.error
        }

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.addFail') + ': ' + errMsg
        })
      }
    })
  }
  else {
    $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('verifyMessage.dataNotNull')
    })
  }
}

const showEdit = (row) => {
  newService.id = row.id
  newService.serviceName = row.serviceName
  newService.connectionType = row.connectionType
  newService.serviceType = row.serviceType
  newService.address = row.address
  newService.port = row.port
  newService.username = row.username
  newService.password = row.password
  newService.mark = row.mark

  diaglogTitle.value = t('node.editServiceTitle')
  showDialog.value = true
  isEdit.value = true
}

const editService = (data) => {
  window.nodes.editNode(JSON.stringify(data)).then((res) => {
    if (res.success) {
      for (let i = 0; i < services.length; i++) {
        if ( services[i].id === data.id) {
          services[i].serviceName = data.serviceName
          if (services[i].connectionType === "local") {
            services[i].connectionType = t('node.localNode')
          } else if (services[i].connectionType === "remote") {
            services[i].connectionType = t('node.remoteNode')
          }
          services[i].serviceType = data.serviceType
          services[i].address = data.address
          services[i].port = data.port
          services[i].username = data.username
          services[i].password = data.password
          services[i].mark = data.mark
          break
        }
      }

      cleanService()
      showDialog.value = false

      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('database.updateSuccess')
      })
    } else {
      let errMsg = ''
      if (res.error instanceof Error) {
        errMsg = JSON.stringify(res.error)
      } else {
        errMsg = res.error
      }

      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('database.updateError') + ': ' + errMsg
      })
    }
  })

  diaglogTitle.value = t('node.addServiceTitle')
}

const deleteService = (id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('node.deleteMessage'),
    cancel: true,
    persistent: true
  }).onOk(() => {
    window.nodes.delNode(id).then((res) => {
      if (res.success) {
        for (let i = 0; i < services.length; i++) {
          if ( services[i].id === id) {
            services.splice(i, 1)
            break
          }
        }

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('database.deleteSuccess')
        })
      } else {
        if (res.success === false) {
          let errMsg = ''
          if (res.error instanceof Error) {
            errMsg = JSON.stringify(res.error)
          } else {
            errMsg = res.error
          }

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('database.deleteFail') + ': ' + errMsg
          })
        }
      }
    })
  })

}

const connectService = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: t('node.connectMessage'),
    cancel: true,
    persistent: true
  }).onOk(() => {
    if (!row.address || !row.port || !row.username || !row.password) {
      return $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('node.connectError')
      })
    }

    for (let item of navigatorStore.naviItems) {
      if (item.name === "Terminal") {
        return changeNavigatorGoto(router, item, {data: row})
      }
    }

  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })

}

onMounted(() => {
  window.addEventListener('resize', checkScreenHeightSize)

  window.nodes.getNodes().then((result) => {
    if (result instanceof Array) {
      if (!isEmptyObj(result)) {
        for (const node of result) {
          if (node.connectionType === "local") {
            node.connectionType = t('node.localNode')
          } else if (node.connectionType === "remote") {
            node.connectionType = t('node.remoteNode')
          }
          services.push(node)
        }
      }
    } else {
      if (result.success === false) {
        let errMsg = ''
        if (result.error instanceof Error) {
          errMsg = JSON.stringify(result.error)
        } else {
          errMsg = result.error
        }

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.accessFail') + ': ' + errMsg
        })
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})

// watch(newService, (value, oldValue) => {
//   console.log(value, oldValue)
// })

onBeforeMount(() => {
  // console.log('beforeMount')
})

</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>
