<template>
  <q-scroll-area  class="q-pa-md" :style="scrollStyle">
    <div class="row items-center justify-between">
      <q-field
        dense
        standout
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{firstUpper(service.serviceType) + t('panel.create.title')}}</div>
        </template>
      </q-field>

      <q-btn color="blue" :label="t('panel.create.create')" @click="onCreateContainer"/>
    </div>

    <div class="q-pa-md">
      <q-item class="bg-grey-2" dense clickable v-ripple>
        <q-item-section class="text-grey-6 text-body1">{{ t('panel.create.image') }}</q-item-section>
        <q-input
          class="text-body1"
          filled
          dense
          readonly
          v-model="composition.image"
        />
      </q-item>
    </div>

    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.basic')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">{{ t('panel.create.containerName') }}</q-item-section>

          <q-input
            class="text-body1"
            outlined
            clearable
            dense
            v-model="composition.containerName"
            :label="t('panel.create.nameLabel')"
          />

        </q-item>

      </q-expansion-item>
    </div>

<!--    runtime-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.runtime')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>

          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.runtime"
            :options="runtimes"
            filled
            dense
            borderless
            emit-value
            transition-show="flip-up"
            transition-hide="flip-down"
            style="min-width: 150px"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item>
      </q-expansion-item>
    </div>

<!--    ports-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.ports')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
        <template v-slot:header>
          <q-item-section>
            {{t('panel.create.ports')}}
          </q-item-section>


        </template>

        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>

          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.portMappingMode"
            :options="portMapModes"
            filled
            dense
            borderless
            emit-value
            transition-show="flip-up"
            transition-hide="flip-down"
            style="min-width: 150px"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-item-section
            v-if="composition.portMappingMode === 'manual' || composition.portMappingMode === 'expose'"
            side
          >
            <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddNewPortMap">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.create.new') }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-list
          v-if="composition.portMappingMode === 'manual' || composition.portMappingMode === 'expose'"
        >
          <q-item
            v-for="(item, index) in composition.ports"
            :key="index"
            class="bg-grey-2"
            dense
          >
            <q-item-section dense class="text-body2" >{{ t('panel.create.portMapping') }}</q-item-section>

            <q-item-section
              v-if="composition.portMappingMode === 'manual'"
              top
            >
              <q-input
                class="text-body1"
                outlined
                dense
                v-model="item.host"
                :label="t('panel.create.hostPort')"
                type="number"
                style="width: 150px"
                :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => (val > 0 && val <= 65535) || t('verifyMessage.portRange')
                ]"
              />
            </q-item-section>

            <q-item-section top>
              <q-input
                class="text-body1"
                outlined
                dense
                v-model="item.container"
                :label="t('panel.create.containerPort')"
                type="number"
                style="width: 150px"
                :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => (val > 0 && val <= 65535) || t('verifyMessage.portRange')
                ]"
              />
            </q-item-section>

            <q-item-section top side>
              <q-select
                class="bg-grey-3"
                color="blue"
                bg-color="cyan-14"
                v-model="item.protocol"
                :options="portMapProtocols"
                filled
                dense
                borderless
                emit-value
                style="width: 80px"
              >
              </q-select>
            </q-item-section>

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeletePortMap(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

      </q-expansion-item>
    </div>

<!--    environment-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.environment')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>
          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.envMode"
            :options="envModes"
            filled
            dense
            borderless
            emit-value
            transition-show="flip-up"
            transition-hide="flip-down"
            style="min-width: 150px"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-item-section
            v-if="composition.envMode === 'manual'"
            side
          >
            <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddNewEnv">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.create.new') }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item
          v-if="composition.envMode === 'file'"
          dense
          class="bg-grey-2"
        >
          <q-item-section class="text-body2">{{ t('panel.create.envFile') }}</q-item-section>

          <q-input
            filled
            dense
            bottom-slots
            v-model="composition.environments.envFile"
            :label="t('panel.create.envFileLabel')"
            style="min-width: 300px"
          >
            <template v-slot:append>
              <q-icon
                v-if="composition.environments.envFile !== ''"
                name="close"
                @click="composition.environments.envFile = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="add_circle_outline" @click="onSelectEnvFile" />
            </template>
          </q-input>
        </q-item>

        <q-list
          v-if="composition.envMode === 'manual'"
        >
          <q-item
            v-for="(item, index) in composition.environments.evns"
            :key="index"
            dense
            class="bg-grey-2"
          >
            <q-item-section class="text-body2">{{ t('panel.create.envKeyValue') }}</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                v-model="item.key"
                :label="t('panel.create.envKey')"
                style="width: 150px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                v-model="item.value"
                :label="t('panel.create.envValue')"
                style="width: 200px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteENV(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>


      </q-expansion-item>
    </div>

<!--    volumes-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.volumes')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

      </q-expansion-item>
    </div>

<!--    networks-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.networks')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

      </q-expansion-item>
    </div>

<!--    resources-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.resources')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

      </q-expansion-item>
    </div>

  </q-scroll-area>
</template>

<script setup>

import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { firstUpper } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const service = inject("service")

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 - 20 + "px",
})

const image = ref('nginx:latest')
const runtimes = [
  { label: t('panel.create.bgRun'), value: 'bg', desc: 'bg' },
  { label: t('panel.create.itRun'), value: 'it', desc: 'it' },
  { label: t('panel.create.rmRun'), value: 'rm', desc: 'rm' },
]
const portMapModes = [
  { label: t('panel.create.randomMapping'), value: 'random', desc: 'Random' },
  { label: t('panel.create.manualMapping'), value: 'manual', desc: 'Manual' },
  { label: t('panel.create.exposeContainer'), value: 'expose', desc: 'Expose' },
]

const portMapProtocols = [
  { label: 'TCP', value: 'tcp', desc: 'TCP' },
  { label: 'UDP', value: 'udp', desc: 'UDP' },
]

const envModes = [
  { label: t('panel.create.envFileMode'), value: 'file', desc: 'File' },
  { label: t('panel.create.envManualMode'), value: 'manual', desc: 'Manual' },
]

const composition = ref({
  image: '',

  // basic
  containerName: '',

  //
  runtime: '',

  portMappingMode: '',
  ports: [],

  envMode: '',
  environments: {
    envFile: '',
    evns: []
  }

})

const envDefault = {
  key: '',
  value: ''
}

const portMappingDefault = {
  host: null,
  container: null,
  protocol: 'tcp'
}

const defaultComposition = {
  image: '',
  containerName: '',
  runtime: 'bg',
  ports: [],
  environments: {
    envFile: '',
    evns: []
  }
}

const onAddNewPortMap = () => {
  composition.value.ports.push(JSON.parse(JSON.stringify(portMappingDefault)))
}
const onDeletePortMap = (index) => {
  composition.value.ports.splice(index, 1)
}

const onAddNewEnv = () => {
  composition.value.environments.evns.push(JSON.parse(JSON.stringify(envDefault)))
}

const onSelectEnvFile = async () => {
  const files = await window.myWindowAPI.selectFiles()
  try {
    if (files.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  composition.value.environments.envFile = files[0]
}

const onDeleteENV = (index) => {
  composition.value.environments.evns.splice(index, 1)
}


const onCreateContainer = () => {

}



const init = () => {
  composition.value = defaultComposition

}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    scrollStyle.height = window.innerHeight - 150 + "px"
  } else {
    scrollStyle.height = window.innerHeight - 149 - 20 + "px"
  }
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})


</script>

<style scoped>

</style>
