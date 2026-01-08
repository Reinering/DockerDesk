<template>
  <q-dialog persistent>
    <q-card style="width: 90% ">
      <q-card-section>
        <q-item-label class="text-h6">{{t('store.defaultInstall')}}</q-item-label>
      </q-card-section>

      <q-separator />

<!--      <q-scroll-area :style="scrollStyle">-->
        <div class="q-pa-md q-gutter-sm">
          <q-item class="bg-grey-2" clickable v-ripple dense>
            <q-item-section class="text-body1">{{ t("store.appName") }}</q-item-section>
            <q-input
              class="text-body1"
              filled
              dense
              readonly
              input-class="text-right"
              v-model="appData.appName"
            />
          </q-item>

          <q-item class="bg-grey-2" clickable v-ripple dense>
            <q-item-section class="text-body2">{{ t("store.port") }}</q-item-section>
            <q-input
              class="text-body1"
              filled
              dense
              readonly
              input-class="text-right"
              :prefix="appData.protocol.toUpperCase() + ' / '"
              v-model="appData.port"
              :rules="[val => !!val || 'Field is required']"
            />
          </q-item>

          <q-item class="bg-grey-2" clickable v-ripple dense>
            <q-item-section class="text-body2">{{ "创建首页快捷方式" }}</q-item-section>

            <q-item-section avatar>
              <q-toggle color="green" v-model="appData.isCreateShorts"/>
            </q-item-section>
          </q-item>

          <q-item class="bg-grey-2" clickable v-ripple dense>
            <q-item-section class="text-body2">{{ "创建首页快捷方式" }}</q-item-section>
          </q-item>
        </div>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },

  onUpdate: {
    type: Function,
    default: () => {}
  },

  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useConfigStore } from 'stores/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const configStore = useConfigStore()

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 - 23 + "px" : window.innerHeight - 149 - 43 + "px",
})

const appData = reactive({
  appName: '',
  protocol: 'tcp',
  port: '',
  isCreateShorts: true
})

const init = () => {

}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    scrollStyle.height = window.innerHeight - 150 - 23 + "px"
  } else {
    scrollStyle.height = window.innerHeight - 149 - 43 + "px"
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
