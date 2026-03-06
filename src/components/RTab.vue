<template>
  <div class="tab-wrapper">
    <q-tab
      :name="props.name"
      :label="props.label"
      :icon="props.icon"
      :selected="props.selected"
    >
      <q-tooltip>
        {{props.label}}
      </q-tooltip>
    </q-tab>
    <q-btn
      v-if="isShowDelete"
      flat
      round
      dense
      size="xs"
      icon="close"
      style="position: absolute; top: 0; right: 0;"
      @click="onClick"
    >
      <q-tooltip>
        {{t('close')}}
      </q-tooltip>
    </q-btn>
  </div>
</template>


<script setup>
defineOptions({
  name: 'RTab',
})

const props = defineProps({
  name: {
    type: String,
    default: ''
  },

  label: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: ''
  },

  selected: {
    type: Function,
    default: () => {}
  },

  onClick: {
    type: Function,
    default: () => {}
  }
})

import { inject, onMounted, onActivated, onDeactivated, ref } from 'vue'

const t = inject("t")

const isShowDelete = ref(false)

const onClick = (e) => {
  e.stopPropagation()

  props.onClick()
}

// 暴露 resize 方法给父组件
defineExpose({
  showDelete: (state) => {
    isShowDelete.value = state
  }

})

onMounted(() => {
  isShowDelete.value = true
})

onActivated(() => {

})

onDeactivated(() => {

})

</script>

<style scoped>
.tab-wrapper {
  position: relative;
  display: inline-block; /* 确保包装器紧贴 q-tab 的尺寸 */
}

</style>
