<template>
  <q-page q-pa-md padding>
    <div class="q-pa-md row q-gutter-md justify-center">
      <q-card class="bg-primary" style="width: 90%; height: 250px">
        <div class="text-h5 q-pa-md text-secondary">
          Windows Subsystem for Linux（WSL）
          <!--          <q-space />-->
          <q-btn
            ref="https://learn.microsoft.com/zh-cn/windows/wsl"
            :label="t('wsl.officialTutorial')"
            target="_blank"
            outline
            color="purple"
          />
        </div>

        <div><q-badge color="blue" rounded class="q-mr-sm" />Status</div>

        <div class="q-pa-md row q-gutter-md justify-end">
          <!--        :loading="progress[0].loading"-->
          <!--        :percentage="progress[0].percentage"-->
          <!--        @click="startComputing(0)"-->
          <q-btn color="accent" icon="flight_takeoff" style="width: 150px">
            未安装
            <template v-slot:loading>
              <q-spinner-gears class="on-left" />
              Computing...
            </template>
          </q-btn>
        </div>
      </q-card>
    </div>

    <div>
      <q-splitter v-model="splitterModel" :limits="[5, 5]" :style="splitterStyle">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical active-color="purple" class="text-teal">
            <q-tab v-for="item in tabs" :key="item.id" :name="item.id" :icon="item.icon">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ item.label }}
              </q-tooltip>
            </q-tab>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
            :style="splitterStyle"
          >
            <q-tab-panel name="subsystem">
              <div class="q-gutter-x-md q-gutter-y-md row justify-center">
                <VM v-for="(item, index) in vms" :key="index" :data="item" />
              </div>
            </q-tab-panel>

            <q-tab-panel name="add">
              <div class="q-pa-md row items-center justify-between">
                <div class="text-h6">{{ t('wsl.wslCreate') }}</div>
                <q-btn :label="t('wsl.create')" color="primary" />
              </div>

              <q-card :style="cardStyle">
                <q-splitter v-model="splitterModel1" :limits="[50, 50]" style="height: 100%">
                  <template v-slot:before>
                    <div class="q-pa-md">
                      <q-input
                        class="q-mb-sm"
                        v-model="newWSL.name"
                        :label="t('wsl.wslName')"
                        maxlength="20"
                        outlined
                        dense
                        :rules="[
                          (val) => !!val || t('verifyMessage.dataNotNull'),
                          (val) => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20',
                        ]"
                      />

                      <q-input
                        class="q-mb-sm"
                        v-model="selected"
                        :label="t('node.serviceName')"
                        maxlength="20"
                        outlined
                        dense
                        :rules="[
                          (val) => !!val || t('verifyMessage.dataNotNull'),
                          (val) => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20',
                        ]"
                      />

                      <q-item tag="label" v-ripple dense>
                        <q-item-section>
                          <q-item-label>Root</q-item-label>
                          <q-item-label caption>{{t('wsl.rootPrivilege')}}</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle color="green" v-model="newWSL.root" val="root" />
                        </q-item-section>
                      </q-item>

                      <q-item tag="label" v-ripple dense>
                        <q-item-section>
                          <q-item-label>Start Now</q-item-label>
                          <q-item-label caption>{{t('wsl.startNow')}}</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-toggle color="green" v-model="newWSL.startNow" val="startNow" />
                        </q-item-section>
                      </q-item>

                    </div>
                  </template>

                  <template v-slot:after>
                    <div class="q-pa-md q-gutter-y-md">
                      <q-select
                        :label="t('wsl.wslDistribution')"
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        filled
                        dense
                        clearable
                        emit-value
                        v-model="newWSL.wslDistribution"
                        :options="appxList"
                        @filter="filterFn"
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

                      <q-input
                        v-if="newWSL.wslDistribution === 'custom'"
                        filled
                        bottom-slots
                        v-model="newWSL.localImagePath"
                        :label="t('wsl.localImagePath')"
                        dense
                      >
                        <template v-slot:append>
                          <q-icon
                            v-if="newWSL.localImagePath !== ''"
                            name="close"
                            @click="newWSL.localImagePath = ''"
                            class="cursor-pointer"
                          />
                        </template>

                        <template v-slot:after>
                          <q-btn round dense flat icon="add_circle_outline" />
                        </template>
                      </q-input>

                      <q-input
                        class="q-mb-sm"
                        v-if="!newWSL.root"
                        v-model="newWSL.username"
                        :label="t('wsl.username')"
                        type="password"
                        maxlength="50"
                        outlined
                        dense
                      />

                      <q-input
                        class="q-mb-sm"
                        v-model="newWSL.password"
                        :label="t('wsl.password')"
                        type="password"
                        maxlength="50"
                        outlined
                        dense
                      />

                    </div>
                  </template>
                </q-splitter>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="movies">
              <div class="text-h4 q-mb-md">Movies</div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                assumenda consectetur culpa fuga nulla ullam. In, libero.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                assumenda consectetur culpa fuga nulla ullam. In, libero.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                assumenda consectetur culpa fuga nulla ullam. In, libero.
              </p>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup>
import { inject, reactive, ref, onMounted } from 'vue'
import VM from 'src/components/VM.vue'

const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')

const splitterStyle = reactive({
  height:
    process.env.MODE === 'electron'
      ? window.innerHeight - 416 + 'px'
      : window.innerHeight - 384 + 'px',
})

const splitterModel = ref(5)

const cardStyle = reactive({
  height:
    process.env.MODE === 'electron'
      ? window.innerHeight - 516 + 'px'
      : window.innerHeight - 484 + 'px',
})

const splitterModel1 = ref(50)

const splitterStyle1 = reactive({
  height:
    process.env.MODE === 'electron'
      ? window.innerHeight - 516 + 'px'
      : window.innerHeight - 484 + 'px',
})

const tab = ref('subsystem')

const tabs = reactive([
  { id: 'subsystem', label: t('wsl.tabs.subSys'), icon: 'settings_system_daydream', data: {} },
  { id: 'add', label: t('wsl.tabs.create'), icon: 'create', data: {} },
])

const vms = reactive([
  {
    templateId: 1,
    nodeId: 1,
    servername: 'Node 1',
    description: 'This is a node',
    state: 'offline',
  },
  {
    templateId: 1,
    nodeId: 2,
    servername: 'Node 1',
    description: 'This is a node',
    state: 'offline',
  },
  {
    templateId: 1,
    nodeId: 2,
    servername: 'Node 1',
    description: 'This is a node',
    state: 'offline',
  },
])

const selected = ref('')
const appxList = reactive([
  { label: 'ubuntu', value: 'ubuntu', desc: 'Ubuntu' },
  { label: 'debian', value: 'debian', desc: 'Debian' },
  { label: t('wsl.customImage'), value: 'custom', desc: 'Custom Image' },
])

const filterFn = (val, update, abort) => {
  if (appxList.length !== 0) {
    // already loaded
    update()
    return
  }

  setTimeout(() => {
    update(() => {})
  }, 2000)
}


const newWSL = reactive({
  name: '',
  root: false,
  startNow: false,
  wslDistribution: null,
  localImagePath: '',
  username: '',
  password: '',
})







const checkScreenHeightSize = () => {
  splitterStyle.height =
    process.env.MODE === 'electron'
      ? window.innerHeight - 416 + 'px'
      : window.innerHeight - 384 + 'px'
  cardStyle.height =
    process.env.MODE === 'electron'
      ? window.innerHeight - 516 + 'px'
      : window.innerHeight - 484 + 'px'
}

onMounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})
</script>

<style scoped></style>
