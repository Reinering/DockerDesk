
<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 70%; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 ">{{ t('store.settings') }}</div>
        <q-space />
        <!--          <q-btn-->
        <!--            icon="close"-->
        <!--            flat-->
        <!--            round-->
        <!--            dense-->
        <!--            v-close-popup-->
        <!--          />-->
      </q-card-section>

      <div class="q-pa-md">
        <div class="q-pa-md">
          <q-card class="q-mb-md" flat bordered>
            <q-card-section class="row items-center q-py-sm q-px-md" style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
              <div class="col">
                <q-btn
                  flat
                  dense
                  color="grey-6"
                  style="background-color: #e9ecef; border-radius: 4px; font-size: 16px; padding: 4px 12px;"
                >
                  {{t('store.api')}}
                </q-btn>
              </div>
              <div class="q-gutter-sm">
                <q-btn color="grey" :label="t('store.add')" @click="showStoreApisDialog = !showStoreApisDialog" />
              </div>
            </q-card-section>

            <q-list>
              <q-item
                v-for="(item, index) in storeApis"
                :key="index"
              >
                <q-item-section top>
                  <q-input
                    readonly
                    dense
                    v-model="item.url"
                    filled
                    :label="item.name"
                  />
                </q-item-section>

                <q-item-section top side>
                  <div class="row q-gutter-xs">
                    <q-toggle
                      v-model="item.enable"
                      color="green"
                    />
                    <q-btn dense flat icon="delete" color="red" @click="onDeleteApi(index)">
                      <q-tooltip class="bg-amber text-black shadow-4">
                        {{t('delete')}}
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>

            </q-list>
        </q-card>
        </div>
      </div>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="props.onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onSettings" />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="showStoreApisDialog">
      <q-card style="min-width: 60%">
        <q-card-section>
          <div class="text-h6">{{t('store.addStoreApi')}}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="storeApi.name"
            filled
            type="text"
            :label="t('store.storeName')"
            :rules="[ val => val.length > 0 && val.length <= 20 || t('verifyMessage.dataNotNull') + ',' + t('verifyMessage.dataLenNotMax') + '20']"
          >
            <template v-slot:append>
              <q-icon v-if="storeApi.name !== ''" name="close" @click="storeApi.name = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="storeApi.url"
            filled
            type="url"
            :label="t('store.storeApi')"
            :rules="[ val => val.length > 0 || t('verifyMessage.dataNotNull')]"
          >
            <template v-slot:append>
              <q-icon v-if="storeApi.url !== ''" name="close" @click="storeApi.url = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="showStoreApisDialog = false" />
          <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onAddStoreApi" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>

</template>

<script setup>
import { clientConfig } from 'src/common/config.js'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      storeApis: []
    })
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

import { inject, ref, reactive } from 'vue'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const isOK = ref(false)

const storeApis = reactive(JSON.parse(JSON.stringify(props.data.storeApis)))

const storeApi = reactive({
  name: '',
  url: '',
  enable: false
})

const showStoreApisDialog = ref(false)

const onAddStoreApi = () => {
  if (storeApi.name.length <= 0 || storeApi.url.length <=0) {
    return
  }

  storeApis.push(JSON.parse(JSON.stringify(storeApi)))

  showStoreApisDialog.value = false

  storeApi.name = ''
  storeApi.url = ''
  storeApi.enable = false
}

const onDeleteApi = (index) => {
  if (index < 0) {
    return
  }

  storeApis.splice(index, 1)
}

const onSettings = () => {
  window.client.updateSettings({
    field: "storeApis",
    value: JSON.stringify(storeApis)
  }).then((result) => {
    console.log(result)
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('index.updateAPiSuccess')
      })

      props.onClose()
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: `${t('index.updateAPiError')}: ${result.error}`
      })
    }
  })



  props.onUpdate()
}

</script>

<style scoped>

</style>
