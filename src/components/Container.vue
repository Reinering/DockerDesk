<template>
  <q-card
    bordered
    class="container-card"
    :style="templates[data.templateId]"
  >
    <div>
      <q-badge col floating :color="color" rounded/>
    </div>

    <q-card-section>
      <div class="col text-h6 text-center">{{ props.data.servername }}</div>
    </q-card-section>

    <q-card-section>
      <div class="column">
        <div class="col text-h8 text-center">{{ props.data.description }}</div>
        <div class="col text-h8 text-center">{{ props.data.description }}</div>
      </div>
    </q-card-section>

    <q-card-actions align="center">
      <div class="row flex flex-center">
        <q-btn
          :disabled="isStart"
          class="text-h8"
          :text-color="templates[props.data.templateId].btn.color"
          unelevated
          icon="play_arrow"
          size="sm"
          @click="onStart"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{t('panel.container.run')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          :disabled="isStop"
          class="text-h8"
          text-color="teal-9"
          unelevated
          icon="stop"
          size="sm"
          @click="onStop"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{t('panel.container.stop')}}
          </q-tooltip>
        </q-btn>

        <q-btn
          :disabled="isRestart"
          class="text-h8"
          :text-color="templates[props.data.templateId].btn.color"
          unelevated
          icon="restart_alt"
          size="sm"
          @click="onRestart"
        >
          <q-tooltip class="bg-amber text-black shadow-4">
            {{t('panel.container.restart')}}
          </q-tooltip>
        </q-btn>

        <q-btn-dropdown
          :disabled="isMore"
          class="text-h8"
          :text-color="templates[props.data.templateId].btn.color"
          unelevated
          icon="more_horiz"
          size="sm"
        >
          <q-list dense :style="`backgroundColor:${templates[props.data.templateId].backgroundColor}`">
            <q-item clickable v-close-popup size="sm" @click="onDelete">
              <q-item-section>
                <q-icon name="delete" color="red" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.delete')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="onTerminal">
              <q-item-section>
                <q-icon name="terminal" :color="templates[props.data.templateId].btn.color" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.terminal')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="onExport">
              <q-item-section>
                <q-icon name="archive" :color="templates[props.data.templateId].btn.color" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.export')}}
                </q-tooltip>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup size="sm" @click="onSettings">
              <q-item-section>
                <q-icon name="settings" :color="templates[props.data.templateId].btn.color" />
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('panel.container.settings')}}
                </q-tooltip>
              </q-item-section>
            </q-item>
          </q-list>

        </q-btn-dropdown>
      </div>
    </q-card-actions>

  </q-card>

  <q-dialog v-model="isClick">
    <ContainerSetting />
  </q-dialog>
</template>


<script setup>
defineOptions({
  name: 'Container',
})

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  style: {
    type: Object,
    default: () => {}
  }
})

import { inject, reactive, ref, watch } from 'vue'
import ContainerSetting from "./ContainerSetting.vue"

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")


const templates = [
  {
    backgroundColor: "#A2D0EF",
    width: "150px",
    height: "100px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
  {
    backgroundColor: "#A2D0EF",
    width: "200px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
  {
    backgroundColor: "#A2D9CE",
    width: "200px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "teal-9",
    },
  }
]

const color = ref("yellow")

const isStart = ref(false)
const isStop = ref(false)
const isRestart = ref(false)
const isMore = ref(false)

const onStart = () => {}
const onStop = () => {}
const onRestart = () => {}
const onDelete = () => {}
const onTerminal = () => {}
const onExport = () => {}
const onSettings = () => {}



const changeState = (newVal) => {
  if (newVal === "online") {
    color.value = "green"
  } else if (newVal === "offline") {
    color.value = "red"
  } else {
    color.value = "yellow"
  }
}

changeState(props.data.state)

const isClick = ref(false)

const onSub = () => {
  console.log("sub")
}

watch(() => props.data.state, (newVal) => {
  changeState(newVal)
})






</script>



<style scoped>

</style>
