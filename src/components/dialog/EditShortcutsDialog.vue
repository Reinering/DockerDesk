<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 60%; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 ">{{ t('index.editShortcuts') }}</div>
        <q-space />
<!--        <q-btn-->
<!--          icon="close"-->
<!--          flat-->
<!--          round-->
<!--          dense-->
<!--          v-close-popup-->
<!--        />-->
        <div class="text-caption text-deep-purple">{{ nodeName }}</div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <!-- 网站地址 -->
          <q-input
            v-model="formData.website"
            :label="t('index.editShortcuts')"
            outlined
            dense
            hide-bottom-space
          />

          <!-- 网站名称 -->
          <q-input
            v-model="formData.websiteName"
            :label="t('index.websiteName')"
            outlined
            dense
            hide-bottom-space
          />

          <!-- 选择图标 -->
          <div>
            <div class="text-subtitle2 q-mb-sm text-grey-7">{{t('index.selectIcon')}}</div>
            <div class="row q-gutter-lg">
              <div class="col-2">
                <q-card
                  flat
                  bordered
                  class="cursor-pointer"
                  :class="{ 'bg-blue-1 border-primary': selectedIconType === 'color' }"
                  @click="selectedIconType = 'color'"
                  style="width: 70px; height: 70px"
                >
                  <div
                    class="text-white text-h6 rounded text-center flex flex-center"
                    :style="{ backgroundColor: formData.iconColor, fontSize: formData.fontSize + 'px', width: '70px', height: '70px' }"
                  >
                    {{ formData.iconText }}
                  </div>
                </q-card>
                <div class="text-caption text-center q-mt-xs text-grey-6">{{t('index.solidColor')}}</div>
              </div>

              <div class="col-2">
                <q-card
                  flat
                  bordered
                  class="cursor-pointer"
                  :class="{ 'bg-blue-1 border-primary': selectedIconType === 'online' }"
                  @click="onSelectOnline"
                  style="width: 70px; height: 70px"
                >
                  <q-card-section class="flex flex-center q-pa-md" style="min-height: 60px;">
                    <div class="text-grey-5 text-h6">{{onlineText}}</div>
                    <img v-if="isShowOnlineIcon" :src="selectedOnlineIcon" alt="logo" />
                  </q-card-section>
                </q-card>
                <div class="text-caption text-center q-mt-xs text-grey-6">{{t('index.getOnline')}}</div>
              </div>

              <div class="col-2">
                <q-card
                  flat
                  bordered
                  class="cursor-pointer"
                  :class="{ 'bg-blue-1 border-primary': selectedIconType === 'local' }"
                  @click="onSelectLocal"
                  style="width: 70px; height: 70px"
                >
                  <q-card-section class="flex flex-center q-pa-md" style="min-height: 60px;">
                    <q-icon :name="addIcon" size="md" color="grey-5" >
                      <img v-if="isShowLocalIcon" :src="selectedLocalIcon" alt="logo" />
                    </q-icon>
                  </q-card-section>
                </q-card>
                <div class="text-caption text-center q-mt-xs text-grey-6">{{t('index.localIcon')}}</div>
              </div>
            </div>
          </div>

          <!-- 图标文字 -->
          <q-input
            v-model="formData.iconText"
            :label="t('index.iconText')"
            outlined
            dense
            maxlength="20"
            hide-bottom-space
          />

          <!-- 字体大小 -->
          <div>
            <div class="text-subtitle2 q-mb-sm text-grey-7">{{t('index.fontSize')}}</div>
            <div class="items-center q-px-lg">
              <q-slider
                v-model="formData.fontSize"
                :min="12"
                :max="64"
                :step="1"
                color="primary"
                track-color="grey-3"
                :label-value="formData.fontSize + 'px'"
                label-always
              />
            </div>
          </div>

          <!-- 颜色选择 -->
          <div>
            <div class="text-subtitle2 q-mb-sm text-grey-7">{{t('index.color')}}</div>
            <div class="row q-gutter-xs">
              <q-btn
                v-for="(color, index) in colors"
                :key="index"
                round
                size="sm"
                :style="{ backgroundColor: color, width: '32px', height: '32px' }"
                :border-color="formData.iconColor === color ? 'grey-6' : 'grey-3'"
                @click="formData.iconColor = color"
              />
              <q-btn
                round
                size="sm"
                :style="{ backgroundColor: color, width: '32px', height: '32px' }"
                :border-color="formData.iconColor === color ? 'grey-6' : 'grey-3'"
                @click="showColorPickerDialog = !showColorPickerDialog"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="editShortcuts" />
      </q-card-actions>

    </q-card>

    <q-dialog v-if="showColorPickerDialog" v-model="showColorPickerDialog">
      <q-card >
        <q-color v-model="formData.iconColor" no-header-tabs class="my-picker" />
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
      id: '',
      nodeId: 0,
      templateId: 0,
      websiteName: '',
      website: '',
      iconText: '',
      iconColor: '',
      icon: null,
      fontSize: '',
    }),
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

import { ref, reactive, inject, onMounted, onUnmounted } from 'vue'
import { isEmptyObj, isEmptyStr } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const showColorPickerDialog = ref(false)

const isOK = ref(true)

// 响应式数据
const showDialog = ref(false)
const selectedIconType = ref('color')
const addIcon = ref('add')
const isShowLocalIcon = ref(false)
const selectedLocalIcon = ref('')

const onlineText = ref('Ca')
const isShowOnlineIcon = ref(false)
const selectedOnlineIcon = ref('')

const nodeName = ref('')

const colors = [
  '#FF5722', '#FF9800', '#FFC107', '#4CAF50',
  '#00BCD4', '#2196F3', '#673AB7', '#E91E63',
  '#9C27B0'
]

const formData = ref({
  id: '',
  nodeId: 0,
  templateId: 0,
  websiteName: '',
  website: '',
  iconText: '',
  iconColor: '',
  icon: null,
  fontSize: '',
})

const formData1 = reactive({
  url: 'https://spiderbox.cn/',
  siteName: 'spiderbox',
  iconText: 'sp',
  fontSize: 18,
  selectedColor: '#FF5722'
})

const onSelectLocal = async () => {
  selectedIconType.value = 'local'
  const fileData = await window.client.readFileIcon()

  if (!isEmptyObj(fileData)) {
    selectedLocalIcon.value = fileData
    isShowLocalIcon.value = true
    addIcon.value = null
  }
}

const onSelectOnline = () => {
  selectedIconType.value = 'online'

  $q.dialog({
    title: t('index.getOnline'),
    message: t('index.inputUrlMessage'),
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(async data => {
    const fileData = await window.client.readFileIconByUrl(data)

    if (!isEmptyObj(fileData)) {
      selectedOnlineIcon.value = fileData
      isShowOnlineIcon.value = true
      onlineText.value = ''
    }
  })
}

const editShortcuts = () => {
  if (isEmptyStr(formData.value.id) || isEmptyStr(formData.value.nodeId) || isEmptyStr(formData.value.websiteName) || isEmptyStr(formData.value.website)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: t('verifyMessage.dataNotNull')
    })
  }

  if (isShowLocalIcon.value) {
    formData.value.icon = selectedLocalIcon.value
  } else if (isShowOnlineIcon.value) {
    formData.value.icon = selectedOnlineIcon.value
  }

  window.shortcuts.editShortcuts(JSON.stringify(formData.value)).then((result) => {
    if (result.success) {
      $q.notify({
        type: 'positive',
        position: clientConfig.quasar.notify.position,
        message: t('index.editSuccess')
      })

      props.onUpdate()
      props.onClose()
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('index.editFail') + ': ' + result.error
      })
    }
  })
}


const init = () => {
  formData.value = JSON.parse(JSON.stringify(props.data))

  if (!isEmptyObj(formData.value.icon)) {
    selectedLocalIcon.value = formData.value.icon
    isShowLocalIcon.value = true
    addIcon.value = null
  }

  window.nodes.getNode(props.data.nodeId).then((result) => {
    if (result.success) {
      nodeName.value = result.data.serviceName
    }
  })

  isOK.value = false

}

onMounted(() => {
  init()
})

onUnmounted(() => {

})

</script>

<style scoped>
.border-primary {
  border-color: var(--q-primary) !important;
}
</style>
