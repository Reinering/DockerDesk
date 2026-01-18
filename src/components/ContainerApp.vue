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
        v-show="!isShowImg"
        alt="logo"
        :src="props.data.icon"
        @load="isShowImg = false"
        @error="isShowImg = true"
        :style="templates[props.templateId].imgStyle"
      />

      <div
        v-if="isShowImg"
        class="text-center"
        :style="templates[props.templateId].textStyle"
      >
        {{ props.data.id[0].toUpperCase() }}
      </div>

      <q-tooltip class="text-caption bg-indigo-4">
        <div class="text-center">{{ props.data.description }}</div>
        <div class="text-center">{{ props.storeName }}</div>
      </q-tooltip>

<!--      <q-badge color="red" rounded floating />-->

<!--      <q-menu-->
<!--        touch-position-->
<!--        context-menu-->
<!--        auto-close-->
<!--      >-->
<!--        <q-list dense>-->
<!--          <q-item clickable v-close-popup size="sm" @click="$emit('click', $event)">-->
<!--            <q-item-section>-->
<!--              <q-item-section>-->
<!--                {{ t("store.install") }}-->
<!--              </q-item-section>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable @click="onDetail">-->
<!--            <q-item-section>-->
<!--              {{ t("store.detail") }}-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </q-list>-->
<!--      </q-menu>-->
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

import { inject, ref } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

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

  showSettingsDialog.value = false
}

const onError = () => {
  console.log("onError")
}

const onclick = () => {
  console.log("onclick")

  showSettingsDialog.value = true
}

const onDetail = () => {

}

</script>

<style scoped>
.container:hover {
  transform: scale(1.1);
}



</style>
