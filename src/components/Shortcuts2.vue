<template>
  <div class="btn-wrapper q-pa-sm" style="max-width: 148px; height: 148px">
    <div class="content">
      <q-btn
        class="main-btn shadow-14"
        push
        glossy
        no-caps
        @click="onOpenUrl"
        :style="btnStyle"
      >
        <div :style="textStyle">{{ shortcutsData.iconText }}</div>
        <img
          v-if="isShowImg"
          :src="shortcutsData.icon"
          alt="logo"
          style="width: 48px; height: 48px;"
        />
      </q-btn>

      <div
        class="text-center text-body2"
        style="word-break: break-all; white-space: normal;"
      >
        {{ shortcutsData.websiteName }}
      </div>
    </div>

    <div
      class="overlay"
      v-if="props.data.isShowOverlay"
    >
      <q-btn
        size="20px"
        round
        icon="edit"
        color="primary"
        @click="onEdit"
        class="edit-btn"
      />

      <div class="overlay-label">{{t('edit')}}</div>

      <q-btn
        round
        dense
        size="xs"
        icon="close"
        color="red"
        class="close-btn"
        @click="onDelete"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      id: 0,
      nodeId: 0,
      templateId: 0,
      websiteName: '',
      website: '',
      iconText: '',
      iconColor: '',
      icon: null,
      fontSize: '',
      isShowOverlay: false,
    }),
  },
  onEdit: {
    type: Function,
    default: () => {}
  },
  onDelete: {
    type: Function,
    default: () => {}
  }
})

import { ref, inject, reactive, watch, onMounted, onUnmounted } from 'vue'
import { isEmptyObj, isEmptyStr } from 'src/utils/common.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const btnStyle = ref({
  marginBottom: "8px",
  borderRadius: "20px",
  transition: "transform 0.2s ease",
  width: "72px",
  height: "72px",
})
const textStyle = ref('')

const isShowImg = ref(false)

const shortcutsData = ref({
  id: 0,
  nodeId: 0,
  templateId: 0,
  websiteName: '',
  website: '',
  iconText: '',
  iconColor: '',
  icon: null,
  fontSize: '',
})

const onOpenUrl = () => {
  window.client.openUrlOnBrowser(props.data.website)
}

const onEdit = () => {
  props.onEdit(props.data.id)
}

const onDelete = () => {
  props.onDelete(props.data.id)
}


const init = () => {
  shortcutsData.value = JSON.parse(JSON.stringify(props.data))
  if (isEmptyObj(shortcutsData.value.icon)) {
    // btnStyle.value = {
    //   backgroundColor: props.data.iconColor,
    // }

    btnStyle.value.backgroundColor = props.data.iconColor

    textStyle.value = {
      fontSize: shortcutsData.value.fontSize + 'px'
    }
  } else if (!isEmptyObj(shortcutsData.value.icon)) {
    // shortcutsData.value.icon = `img:${props.data.icon}`
    shortcutsData.value.icon = `${props.data.icon}`
      shortcutsData.value.iconText = ''
    isShowImg.value = true
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {

})


watch(() => props.data, (newVal, oldVal) => {
  init()
})

</script>

<style scoped>
.btn-wrapper {
  position: relative;
  display: inline-block;
  transition: transform 0.2s ease;
}

.btn-wrapper:hover {
  transform: translateY(-2px);
}

.content {
  padding: 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
}

/*
.main-btn {
  margin-bottom: 8px;
  border-radius: 20px;
  transition: transform 0.2s ease;
  width: 72px;
  height: 72px;
}
*/

.main-btn:hover {
  transform: scale(1.1);
}

.label-text {
  font-size: 12px;
  font-weight: 500;
  color: #424242;
  margin-top: 4px;
  word-break: break-all;
  line-height: 1.2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 16px;
}

.btn-wrapper:hover .overlay {
  opacity: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.edit-btn {
  //background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.edit-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  //background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.overlay-label {
  font-size: 11px;
  color: #424242;
  margin-top: 2px;
  font-weight: 500;
}

.close-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 激活状态样式 */
.btn-wrapper.active .overlay {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* 禁用状态样式 */
.btn-wrapper.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.btn-wrapper.disabled .overlay {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .content {
    padding: 12px;
    min-width: 60px;
  }

  .main-btn {
    margin-bottom: 6px;
  }

  .label-text {
    font-size: 11px;
  }

  .edit-btn {
    size: 18px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .overlay {
    background: #2d2d2d;
    border-color: #404040;
    color: #ffffff;
  }

  .btn-wrapper:hover .overlay {
    border-color: #64b5f6;
  }

  .overlay-label {
    color: #e0e0e0;
  }
}
</style>
