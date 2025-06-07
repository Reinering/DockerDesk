<template>
  <q-page q-pa-md padding>
    <div class="q-pa-md q-gutter-md row justify-center">
      <q-card class="bg-primary" style="width: 90%; height: 250px">
        <div class="text-h5 q-pa-md text-secondary">
          Windows Subsystem for Linux(WSL) 2
          <q-btn
            href="https://learn.microsoft.com/zh-cn/windows/wsl"
            :label="t('wsl.officialTutorial')"
            target="_blank"
            outline
            color="purple"
          />
        </div>

        <q-separator />

        <q-card-section >
          <q-chip square color="orange" text-color="white" icon="star">
            建议升级Windows 10 版本 2004 及更高版本（内部版本 19041 及更高版本）或 Windows 11
          </q-chip>
        </q-card-section>

        <q-card-section>
          <div class="q-pa-md row justify-between">
<!--            <div class="col"><q-badge :color="wslStatusColor" rounded class="q-mr-sm" />{{wslStatus}}</div>-->

            <q-space />

            <q-btn
              :disable="disabledWslStatusBtn"
              color="accent"
              icon="flight_takeoff"
              style="width: 150px"
              @click="onWslStatusBtn"
            >
              {{wslStatusBtn}}
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
                Computing...
              </template>
            </q-btn>
          </div>
        </q-card-section>
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
              <q-menu context-menu auto-close>
<!--                <q-item clickable @click="onAddButtonBar">-->
<!--                  <q-item-section>-->
<!--                    {{ t('add') + 'Button Bar' }}-->
<!--                  </q-item-section>-->
<!--                </q-item>-->
<!--                <q-item clickable @click="onEditButtonBar">-->
<!--                  <q-item-section>-->
<!--                    {{ t('edit') + 'Button Bar' }}-->
<!--                  </q-item-section>-->
<!--                </q-item>-->
              </q-menu>
              <div class="q-gutter-x-md q-gutter-y-md row justify-center">
                <VM
                  v-for="(item, index) in vms"
                  :key="index" :data="item"
                  :onDelete="onDelete"
                  @update:value="updateChild"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="add">
              <div class="q-pa-md row items-center justify-between">
                <div class="text-h6">{{ t('wsl.wslCreate') }}</div>
                <q-btn :label="t('wsl.create')" color="primary" @click="onCreate" />
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

<!--                      <q-input-->
<!--                        class="q-mb-sm"-->
<!--                        v-model="selected"-->
<!--                        :label="t('node.serviceName')"-->
<!--                        maxlength="20"-->
<!--                        outlined-->
<!--                        dense-->
<!--                        :rules="[-->
<!--                          (val) => !!val || t('verifyMessage.dataNotNull'),-->
<!--                          (val) => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20',-->
<!--                        ]"-->
<!--                      />-->

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
                        v-if="newWSL.wslDistribution === 'Custom'"
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
                          <q-btn round dense flat icon="add_circle_outline" @click="onSelect" />
                        </template>
                      </q-input>

                      <q-input
                        class="q-mb-sm"
                        v-if="!newWSL.root && newWSL.startNow"
                        v-model="newWSL.username"
                        :label="t('wsl.username')"
                        maxlength="50"
                        outlined
                        dense
                      />

                      <q-input
                        class="q-mb-sm"
                        v-if="newWSL.startNow"
                        v-model="newWSL.password"
                        :label="t('wsl.password')"
                        maxlength="50"
                        outlined
                        dense
                      />

                    </div>
                  </template>
                </q-splitter>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="settings">
              <div>
                <q-item tag="label" v-ripple dense>
                  <q-item-section>
                    <q-item-label>WSL Debug Console</q-item-label>
                    <q-item-label caption>{{t('wsl.display')}}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-toggle color="green" v-model="isDebugConsole" @update:model-value="changeDebugConsole"/>
                  </q-item-section>
                </q-item>

              </div>
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
import { parseWSLListVersion, parseDistributionList } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'
import { isEmptyStr } from 'src/utils/common.js'

const $q = inject('$q')
const router = inject('router')
const route = inject('route')
const t = inject('t')
const deviceInfo = inject("deviceInfo")

let notify = ref(null)

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

const tab = ref('subsystem')

const tabs = reactive([
  { id: 'subsystem', label: t('wsl.tabs.subSys'), icon: 'settings_system_daydream', data: {} },
  { id: 'add', label: t('wsl.tabs.create'), icon: 'create', data: {} },
  { id: 'settings', label: t('wsl.tabs.settings'), icon: 'settings', data: {} },
])

const vms = reactive([
  // {
  //   nodeId: 1,
  //   templateId: 1,
  //   servername: 'Node 1',
  //   description: 'This is a node',
  //   state: 'offline',
  // },
])

const appxList = reactive([
  { label: 'ubuntu', value: 'Ubuntu', desc: 'Ubuntu' },
  { label: 'debian', value: 'Debian', desc: 'Debian' },
  { label: t('wsl.customImage'), value: 'Custom', desc: 'Custom Image' },
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
  username: 'user',
  password: 'user',
})
const clearNewWSL = () => {
  newWSL.name = ''
  newWSL.root = false
  newWSL.startNow = false
  newWSL.wslDistribution = null
  newWSL.localImagePath = ''
  newWSL.username = 'user'
  newWSL.password = 'user'
}

const updateChild = (data) => {
  vms.forEach((vm) => {
    if (vm.servername === data.name) {
      vm.state = data.state
      return
    }
  })
}

const isDebugConsole = ref(false)
const changeDebugConsole = (value) => {
  window.wslTerminal.modifyWSLDebugConfig({
    wsl2: { debugConsole: value }
  }).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('wsl.configModifySuccess')
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('wsl.configModifyFail')}: ${result.error}`
      })
    }
  })
}

const wslStatusColor = ref('red')
const wslStatus = ref('Stopped')
const wslStatusBtn = ref(t('assistant.notInstalled'))
const disabledWslStatusBtn = ref(false)

const onWslStatusBtn = () => {
  if (wslStatusBtn.value === t('assistant.notInstalled')) {

  } else if (wslStatusBtn.value === t('assistant.needUpgrade')) {
    window.wslTerminal.upgradeWSL().then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('assistant.upgradeSuccess')
        })

        wslStatusBtn.value = t('assistant.installed')
        disabledWslStatusBtn.value = true
      } else {
        return $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('assistant.upgradeError')}: ${result.error}`
        })
      }
    })
  }
}

const onDelete = (name) => {
  for (let index in vms) {
    if (vms[index].servername === name) {
      vms.splice(index, 1)
      break
    }
  }
}

const getWSLList = () => {
  window.wslTerminal.getWSLList().then((result) => {
    if (result.success) {
      const data = parseWSLListVersion(result.data)
      vms.length = 0
      for (let index in data) {
        vms.push({
          nodeId: vms.length + 1,
          templateId: 1,
          servername: data[index].name,
          description: data[index].name,
          state: data[index].state,
        })
      }
    }
  })
}

const getWSLListInterval = setInterval(() => {
  getWSLList()
}, 30000)

const onSelect = async() => {
  const files = await window.myWindowAPI.selectFiles()
  try {
    if (files.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  newWSL.localImagePath = files[0]
}

const onCreate = () => {
  if (isEmptyStr(newWSL.name) || newWSL.name.length > 20) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('wsl.nameNotNull')}`
    })
  }

  if (isEmptyStr(newWSL.wslDistribution)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('wsl.distributionNotNull')}`
    })
  }

  if (newWSL.wslDistribution === "Custom" && isEmptyStr(newWSL.localImagePath)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('wsl.distributionNotNull')}`
    })
  }

  window.wslTerminal.installWSL(JSON.stringify(newWSL)).then((result) => {
    console.log(result)
    if (result.success) {
      notify.value({
        type: 'positive',
        icon: 'done',
        spinner: false,
        message: `${t('assistant.installSuccess')}`,
        timeout: 10000
      })

      clearNewWSL()
      getWSLList()
    } else {
      notify.value({
        type: 'negative',
        icon: 'done',
        spinner: false,
        message: `${t('assistant.installFail')}: ${result.error}`,
        timeout: 10000
      })
    }
  })

  notify.value = $q.notify({
    type: 'info',
    group: false,
    timeout: 0,
    spinner: true,
    position: 'bottom-right',
    message: t('assistant.installing'),
  })
}

const init = () => {
  if (process.env.MODE === 'electron' && deviceInfo.value.platform === "win32") {
    window.wslTerminal.checkWSLInfo().then((result) => {
      if (result.success) {
        const line = result.data.split('\r\n')[0]

        if (line.indexOf('WSL') !== -1) {
          wslStatusBtn.value = t('assistant.installed')
          disabledWslStatusBtn.value = true

          getWSLList()
        } else {
          clearInterval(getWSLListInterval)
          wslStatusBtn.value = t('assistant.needUpgrade')
        }
      } else {
        clearInterval(getWSLListInterval)
        wslStatusBtn.value = t('assistant.notInstalled')
      }
    })

    window.wslTerminal.getDistributionList().then((result) => {
      if (result.success) {
        const tmp = appxList[appxList.length - 1]
        appxList.length = 0
        parseDistributionList(result.data).forEach((item) => {
          appxList.push(item)
        })
        appxList.push(tmp)
      }
    })
  }
}

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

  if (deviceInfo.value.platform !== "win32") {
    return
  }

  init()

})
</script>

<style scoped></style>
