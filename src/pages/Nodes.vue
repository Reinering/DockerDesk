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
                color="blue"
                v-model="newService.connectionType"
                :options="connectionOptions"
                :label="t('node.serviceType') + '(' + t('node.local') + '/' + t('node.remote') + ')'"
                outlined
                dense
              />
              <q-select
                class="q-mb-sm"
                color="blue"
                v-model="newService.serviceType"
                :options="serviceTypeOptions"
                :label="t('node.serviceType') + '(Docker/Podman/SSH/Telnet)'"
                outlined
                dense
              />
              <q-select
                class="q-mb-sm"
                color="blue"
                v-if="newService.connectionType === t('node.remoteNode') && (newService.serviceType === 'Docker' || newService.serviceType === 'Podman')"
                v-model="newService.protocol"
                :options="protocolOptions"
                :label="t('node.protocol')"
                outlined
                dense
              />
              <q-input
                class="q-mb-sm"
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.address"
                :label="t('node.address')"
                maxlength="30"
                outlined
                dense
              />
              <q-input
                class="q-mb-sm"
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.port"
                :label="t('node.port')"
                type="number"
                outlined
                dense
                :rules="[
                  val => parseInt(val) > 0 || t('node.portRange') + ': 1 - 65535',
                  val => parseInt(val) <= 65535 || t('node.portRange') + ': 1 - 65535'
                ]"
              />
              <q-input
                class="q-mb-sm"
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.username"
                :label="t('username')"
                type="text"
                maxlength="30"
                outlined
                dense
              />
              <q-select
                class="q-mb-sm"
                color="blue"
                v-if="newService.connectionType === t('node.remoteNode')"
                v-model="newService.authType"
                :options="passwordOptions"
                :label="t('node.authType')"
                outlined
                dense
              />
              <q-input
                class="q-mb-sm"
                v-if="newService.connectionType === t('node.remoteNode') && newService.authType === t('node.password')"
                v-model="newService.password"
                :label="t('node.password')"
                type="password"
                maxlength="50"
                outlined
                dense
              />
              <q-file
                class="q-mb-sm"
                v-if="newService.connectionType === t('node.remoteNode') && newService.authType === t('node.key')"
                v-model="keyFile"
                :label="labelKey"
                outlined
                dense
                clearable
                @update:model-value="onFileSelected"
               />
              <q-input
                class="q-mb-sm"
                v-model="newService.mark"
                :label="t('node.mark')"
                maxlength="50"
                outlined
                dense
              />

            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeDialog" />
            <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="addService" />
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
          class="nodes-table"
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
              v-if="props.row.id !== '11111111' && props.row.id !== '11111112'"
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
              v-if="props.row.id !== '11111111' && props.row.id !== '11111112'"
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
              icon="link"
              color="blue"
              dense
              flat
              @click="connectTerminal(props.row)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('connect')}}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="isShowPanelBtn(props.row)"
              icon="dashboard"
              color="green"
              dense
              flat
              @click="connectPanel(props.row)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('node.dockerPanel')}}
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
  name: 'Nodes',
})

import { inject, ref, onMounted, onUnmounted, onBeforeMount, watch, reactive, computed } from 'vue'
import { deepClone, isEmptyObj, findNaviItemByName } from 'src/utils/common.js'
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
  // { id: '111111', serviceName: '本地 Docker', connectionType: '本地节点', serviceType: 'Docker'},
  // { id: '111112', serviceName: '远程 Docker', connectionType: '远程节点', serviceType: 'Docker', protocol: 'ssh', address: 'localhost', port: 2375 },
  // { id: '111121', serviceName: '本地 Podman', connectionType: '本地节点', serviceType: 'Podman'},
  // { id: '111122', serviceName: '远程 Podman', connectionType: '远程节点', serviceType: 'Podman', protocol: 'ssh', address: '192.168.1.100', port: 8080 },
])

const newService = reactive({
  id: '',
  serviceName: '',
  connectionType: '',
  serviceType: '',
  protocol: '',
  address: '',
  port: '',
  username: '',
  authType: '',
  password: '',
  key: '',
  mark: ''
})

const keyFile = ref('')
const labelKey = ref(t('node.key') + ' | ' + t('node.selectKeyFile'))

const connectionOptions = [t('node.localNode'), t('node.remoteNode')]
const protocolOptions = ['SSH', 'Telnet']
const passwordOptions = [t('node.password'), t('node.key')]

const localServiceTypeOptions = ['Docker', 'Podman']
const remoteServiceTypeOptions = ['Docker', 'Podman', 'SSH', 'Telnet']
const serviceTypeOptions = reactive(['Docker', 'Podman'])

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'serviceName', label: t('node.serviceName'), align: 'left', field: 'serviceName' },
  { name: 'connectionType', label: t('node.connectionType'), align: 'left', field: 'connectionType' },
  { name: 'serviceType', label: t('node.serviceType'), align: 'left', field: 'serviceType' },
  { name: 'protocol', label: t('node.protocol'), align: 'left', field: 'protocol' },
  { name: 'address', label: t('node.address'), align: 'left', field: 'address' },
  { name: 'port', label: t('node.port'), align: 'left', field: 'port' },
  { name: 'actions', label: t('node.action'), align: 'center' }
]

const visibleColumns = ['serviceName', 'connectionType', 'serviceType', 'protocol', 'address', 'port', 'actions']

const isEdit = ref(false)

const isShowPanelBtn = (row) => {
  if (row.serviceType ===  'Docker' || row.serviceType ===  'Podman') {
    return true
  }
  return false
}

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
  newService.protocol= ''
  newService.port = ''
  newService.username = ''
  newService.authType = ''
  newService.password = ''
  newService.key = ''
  newService.mark = ''

  keyFile.value = ''
  labelKey.value = t('node.key') + ' | ' + t('node.selectKeyFile')
}

const closeDialog = () => {
  cleanService()
  showDialog.value = false
  isEdit.value = false

  diaglogTitle.value = t('node.addServiceTitle')
}

const onFileSelected = (file) => {
  if (file) {
    const reader = new FileReader()

    // 当文件读取完成时触发
    reader.onload = (e) => {
      newService.key = e.target.result; // 将读取的内容存储到 fileContent
    }

    // 读取失败
    reader.onerror = () => {
      return $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('node.fileReadError')
      })
    }

    // 以文本形式读取文件
    reader.readAsText(file, 'utf8')
  } else {
    keyFile.value = ''

    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('node.fileReadError')
    })
  }
}

const addService = () => {
  if (
    newService.serviceName &&
    newService.serviceType &&
    newService.connectionType &&
    (newService.connectionType === t('node.localNode') || (newService.address && newService.port && newService.username))
  ) {
    const data = deepClone(newService)
    if (data.connectionType === t('node.localNode')) {
      data.connectionType = "local"
    } else if (data.connectionType === t('node.remoteNode')) {
      data.connectionType = "remote"
    }

    if (data.authType === t('node.password')) {
      data.authType = "password"
      if (isEmptyObj(data.password)) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('verifyMessage.dataNotNull')
        })
      }
    } else if (data.authType === t('node.key')) {
      data.authType = "key"

      if (isEmptyObj(data.key)) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('verifyMessage.dataNotNull')
        })
      }
    }

    if ( data.serviceType === 'SSH' || data.serviceType === 'Telnet' && isEmptyObj(data.protocol) ) {
      data.protocol = data.serviceType
    }
    data.protocol = data.protocol.toLowerCase()

    // edit
    if (isEdit.value === true) {
      editService(data)
      return
    }

    // add
    window.nodes.addNode(JSON.stringify(data)).then((res) => {
      if (res.success) {
        newService.id = res.data.id
        if ( newService.serviceType === 'SSH' || newService.serviceType === 'Telnet' && isEmptyObj(newService.protocol) ) {
          newService.protocol = newService.serviceType
        }

        if (newService.authType === t('node.password')) {
          newService.password = res.data.password
        } else if (newService.authType === t('node.key')) {
          newService.key = res.data.key
        }

        services.push({ ...newService })

        cleanService()
        showDialog.value = false

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('database.addSuccess')
        })
      } else {

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.addFail') + ': ' + res.error
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
  newService.protocol = row.protocol
  newService.address = row.address
  newService.port = row.port
  newService.username = row.username
  newService.authType = row.authType
  newService.password = row.password
  newService.key = row.key
  newService.mark = row.mark

  if (newService.key) {
    labelKey.value = t('node.keyFileHint')
  }

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

          if (data.protocol === "ssh") {
            services[i].protocol = 'SSH'
          } else if (data.protocol === "telnet") {
            services[i].protocol = 'Telnet'
          }

          services[i].serviceType = data.serviceType
          services[i].address = data.address
          services[i].port = data.port
          services[i].username = data.username
          services[i].authType = data.authType
          services[i].password = data.password
          services[i].key = data.key
          services[i].mark = data.mark

          if (services[i].authType === "password") {
            services[i].authType = t('node.password')
          } else if (services[i].authType === "key") {
            services[i].authType = t('node.key')
          }

          break
        }
      }

      closeDialog()

      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('database.updateSuccess')
      })
    } else {

      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('database.updateError') + ': ' + res.error
      })
    }
  })
}

const deleteService = (id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('node.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
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

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('database.deleteFail') + ': ' + res.error
          })
        }
      }
    })
  })
}

const connectTerminal = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: t('node.connectMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    let item
    let data = JSON.parse(JSON.stringify(row))
    if (row.connectionType === t('node.remoteNode')) {
      if (!row.address || !row.port || !row.username || !row.password) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('node.connectError')
        })
      }

      // ssh | telnet
      item = findNaviItemByName(navigatorStore.naviItems, "Terminal")
      if (isEmptyObj(item)) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('node.connectError1')
        })
      }
    } else {
      // bash
      item = findNaviItemByName(navigatorStore.naviItems, "Terminal")
      if (isEmptyObj(item)) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('node.connectError1')
        })
      }
    }

    return changeNavigatorGoto(router, item[0], item[1], {data: data})
  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })

}

const connectPanel = (row) => {
  $q.dialog({
    title: t('confirm'),
    message: t('node.connectMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    let item
    // if (row.connectionType === t('node.remoteNode')) {
    //   if (!row.address || !row.port || !row.username || !row.password) {
    //     return $q.notify({
    //       type: 'negative',
    //       position: clientConfig.quasar.notify.position,
    //       message: t('node.connectError')
    //     })
    //   }
    //   // docker | podman
    //   if (row.serviceType === "Docker" || row.serviceType === "Podman") {
    //     item = findNaviItemByName(navigatorStore.naviItems, "Docker")
    //     if (isEmptyObj(item)) {
    //       return $q.notify({
    //         type: 'negative',
    //         position: clientConfig.quasar.notify.position,
    //         message: t('node.connectError1')
    //       })
    //     }
    //   }
    // } else {
    //   return
    // }

    // docker | podman
    if (row.serviceType === "Docker" || row.serviceType === "Podman") {
      item = findNaviItemByName(navigatorStore.naviItems, "Docker")
      if (isEmptyObj(item)) {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('node.connectError1')
        })
      }
    } else {
      return
    }

    return changeNavigatorGoto(router, item[0], item[1], {data: row})
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

          if (node.protocol === "telnet") {
            node.protocol = "Telnet"
          } else if (node.protocol === "ssh") {
            node.protocol = "SSH"
          }

          if (node.authType === "password") {
            node.authType = t('node.password')
          } else if (node.authType === "key") {
            node.authType = t('node.key')
          }

          services.push(node)
        }
      }
    } else {
      if (result.success === false) {

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.accessFail') + ': ' + result.error
        })
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})

onBeforeMount(() => {
  // console.log('beforeMount')
})

watch(() => newService.connectionType, (newValue, oldValue) => {
  if (oldValue !== '') {
    newService.serviceType = ''
  }

  if (newValue === t('node.localNode')) {
    serviceTypeOptions.length = 0
    serviceTypeOptions.push.apply(serviceTypeOptions, localServiceTypeOptions)

    if (oldValue !== '') {
      newService.protocol = ''
      newService.address = ''
      newService.port = ''
      newService.username = ''
      newService.password = ''
    }
  } else if (newValue === t('node.remoteNode')) {
    serviceTypeOptions.length = 0
    serviceTypeOptions.push.apply(serviceTypeOptions, remoteServiceTypeOptions)
  } else {

  }
})


</script>

<style>
.text-h6 {
  font-weight: bold;
}

.nodes-table .q-table__top,
.nodes-table .q-table__bottom,
.nodes-table thead tr:first-child th {
  /* set background color for fixed header rows */
  background-color: #aba79d;
}

.nodes-table thead tr th {
  position: sticky;
  z-index: 1;
}
.nodes-table thead tr:first-child th {
  top: 0;
}

</style>

