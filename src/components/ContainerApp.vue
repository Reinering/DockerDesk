<template>
  <div class="card">
<!--   glossy-->
    <div
      class="container shadow-14 q-pa-md"
      :style="getStyle()"
      @click="$emit('click', $event)"
    >
      <img
        class="items-center"
        v-if="isShowImg"
        alt="logo"
        :src="props.data.icon"
        @load="onLoad"
        @error="isShowImg = false"
        :style="templates[props.templateId].imgStyle"
      />

      <div
        v-if="!isShowImg"
        class="text-center"
        :style="templates[props.templateId].textStyle"
      >
        {{ props.data.id[0].toUpperCase() }}
      </div>

      <q-tooltip class="text-caption bg-indigo-4">
        <div class="text-center">{{ props.data.description }}</div>
        <div class="text-center">{{ props.storeName }}</div>
      </q-tooltip>
    </div>

    <div
      class="text-center text-body1"
      style="word-break: break-all; white-space: normal;"
    >
      {{ props.data.name }}
    </div>
  </div>

</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      id: 0,
      name: 0,
      icon: '',
      description: '',
      manifest: '',
    }),
  },

  storeName: {
    type: String,
    default: ''
  },

  templateId: {
    type: Number,
    default: 0
  }
})

defineEmits(['click'])

import { ref } from 'vue'

const isShowImg = ref(true)

const showSettingsDialog = ref(false)

const templates = [
  {
    cardStyle: {
      backgroundColor: "#A2D0EF",
      width: "100px",
      height: "100px",
      margin: "20px",
      borderRadius: "32px",
      transition: "transform 0.2s ease",
    },
    imgStyle: {
      width: "68px",
      height: "68px",
    },
    textStyle: {
      width: "68px",
      height: "68px",
      fontSize: "50px"
    },
  },
]

const getStyle = () => {
  const style = templates[props.templateId].cardStyle

  if (props.data['bg_color']) {
    style["backgroundColor"] = props.data['bg_color']
  }

  return style
}

const onLoad = () => {
  console.log("onLoad")
}

const onError = () => {
  console.log("onError")
}

const onclick = () => {
  console.log("onclick")

  showSettingsDialog.value = true
}

const onClose = () => {
  showSettingsDialog.value = false
}


</script>

<style scoped>


</style>
