<template>
  <q-layout container :style="background" class="shadow-2 rounded-borders">
    <q-page padding>
      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">{{t('dockerNode.addServiceTitle')}}</div>
          </q-card-section>
          <q-card-section>
            <q-form >
              <q-input
                v-model="newService.serviceName"
                :label="t('dockerNode.serviceName')"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-select
                v-model="newService.connectionType"
                :options="connectionOptions"
                :label="t('dockerNode.serviceType') + '(' + t('dockerNode.local') + t('dockerNode.remote') + ')'"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-select
                v-model="newService.serviceType"
                :options="serviceTypeOptions"
                :label="t('dockerNode.serviceType') + '(Docker/Podman)'"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('dockerNode.remoteNode')"
                v-model="newService.address"
                :label="t('dockerNode.address')+ '(SSH：localhost)'"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('dockerNode.remoteNode')"
                v-model="newService.port"
                :label="t('dockerNode.port') + '(SSH：22)'"
                type="number"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('dockerNode.remoteNode')"
                v-model="newService.username"
                :label="t('username') + '(SSH)'"
                type="number"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />
              <q-input
                v-if="newService.connectionType === t('dockerNode.remoteNode')"
                v-model="newService.password"
                :label="t('password') + '(SSH)'"
                type="password"
                maxlength="30"
                outlined
                dense
                class="q-mb-sm"
              />

              <q-input
                v-model="newService.mark"
                :label="t('dockerNode.mark')"
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
            <div class="text-h6">Docker/Podman {{t('dockerNode.serviceManagement')}}</div>
            <q-btn :label="t('dockerNode.addService')" color="primary" @click="showDialog = true" />
          </div>
        </q-card-section>
        <q-table
          :rows="services"
          :columns="columns"
          row-key="name"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
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
              @click="editService(props.row)"
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
              @click="deleteService(props.row.name)"
            >
              <q-tooltip class="bg-amber text-black shadow-4">
                {{t('delete')}}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="link"
              color="negative"
              dense
              flat
              @click="connectService(props.row.name)"
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

import { inject, ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import { deepClone, isEmptyObj } from 'src/utils/common.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const t = inject("t")

const tableStyle = reactive({
  height: window.innerHeight - 210 + "px",
})
const pagination = ref({
  rowsPerPage: 0
})

const showDialog = ref(false)

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
})

const services = reactive([
  { name: '本地 Docker', connectionType: 'local', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: 'remote', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '本地 Docker', connectionType: '本地', serviceType: 'Docker', address: 'localhost', port: 2375 },
  { name: '远程 Podman', connectionType: '远程', serviceType: 'Podman', address: '192.168.1.100', port: 8080 }

])

const newService = reactive({
  serviceName: '',
  connectionType: '',
  serviceType: '',
  address: '',
  port: '',
  username: '',
  password: '',
  mark: ''
})

const connectionOptions = [t('dockerNode.localNode'), t('dockerNode.remoteNode')]

const serviceTypeOptions = ['Docker', 'Podman']

const columns = [
  { name: 'serviceName', label: t('dockerNode.serviceName'), align: 'left', field: 'name' },
  { name: 'connectionType', label: t('dockerNode.connectionType'), align: 'left', field: 'connectionType' },
  { name: 'serviceType', label: t('dockerNode.serviceType'), align: 'left', field: 'serviceType' },
  { name: 'address', label: t('dockerNode.address'), align: 'left', field: 'address' },
  { name: 'port', label: t('dockerNode.port'), align: 'left', field: 'port' },
  { name: 'actions', label: t('dockerNode.action'), align: 'center' }
]

onMounted(() => {
  window.addEventListener('resize', checkScreenHeightSize)

  const result = window.DB.getDockerNodes()

  if (isEmptyObj(result)) {
    for (const node of result) {
      if (node.connectionType == "local") {
        node.connectionType = t('dockerNode.localNode')
      } else if (node.connectionType == "remote") {
        node.connectionType = t('dockerNode.remoteNode')
      }
    }
    services.push(...result)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})

// watch(newService, (value, oldValue) => {
//   console.log(value, oldValue)
// })

const checkScreenHeightSize = () => {
  background.height = window.innerHeight - 70 + "px"
  tableStyle.height = window.innerHeight - 210 + "px"
}

const closeDialog = () => {
  newService.serviceName = ''
  newService.connectionType = ''
  newService.serviceType = ''
  newService.address = ''
  newService.port = ''
  newService.username = ''
  newService.password = ''

  showDialog.value = false
}

const addService = () => {
  console.log("Adding service:", newService)
  if (
    newService.serviceName &&
    newService.serviceType &&
    newService.connectionType &&
    (newService.connectionType === t('dockerNode.localNode') || (newService.address && newService.port && newService.username && newService.password))
  ) {
    const data = deepClone(newService)
    if (data.connectionType == t('dockerNode.localNode')) {
      data.connectionType = "local"
    } else if (data.connectionType == t('dockerNode.remoteNode')) {
      data.connectionType = "remote"
    }
    const result = window.DB.addDockerNode(JSON.stringify(data))

    result.then((res) => {
      console.log("result", res)
      if (res.success) {
        services.push({ ...newService })

        newService.serviceName = ''
        newService.connectionType = ''
        newService.serviceType = ''
        newService.address = ''
        newService.port = ''
        newService.username = ''
        newService.password = ''
        showDialog.value = false

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: "添加成功"
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message:"添加失败, " + res.error
        })

      }
    })
  }
}

const editService = (service) => {
  const index = services.value.findIndex((s) => s.serviceName === service.serviceName)
  if (index !== -1) {
    services.value[index] = { ...service }
  }
}

const deleteService = (name) => {
  services.value = services.value.filter((service) => service.serviceName !== name)
}

const connectService = (name) => {
  const service = services.value.find((s) => s.serviceName === name)
  if (service) {
    console.log("Linking to service:", service)
    // Implement the linking logic here
  }
}

</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>
