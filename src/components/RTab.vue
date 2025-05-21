<template>
  <div class="tab-wrapper" style="position: relative;">
    <q-tab :name="props.name" :label="props.label" :icon="props.icon" :selected="props.selected">
      <q-tooltip>
        {{props.label}}
      </q-tooltip>
    </q-tab>
    <q-btn
      flat
      round
      dense
      size="xs"
      icon="close"
      style="position: absolute; top: 0; left: 0;"
      @click="onClick"
    >
      <q-tooltip>
        {{t('close')}}
      </q-tooltip>
    </q-btn>
  </div>
</template>


<script setup>
import { inject } from 'vue'

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

const t = inject("t")

const onClick = (e) => {
  e.stopPropagation()

  props.onClick()
}


</script>

<style scoped>
.tab-wrapper {
  display: inline-block; /* 确保包装器紧贴 q-tab 的尺寸 */
}

</style>
