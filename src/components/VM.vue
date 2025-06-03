<template>
  <q-card
    bordered
    class="vm-card"
    :style="templates[data.templateId]"
  >
    <div>
      <q-badge col floating :color="color" rounded/>
    </div>

    <div class="col text-subtitle1 text-center">{{ props.data.servername }}</div>

<!--    <q-item style="height: 30px">-->
<!--      -->
<!--    </q-item>-->

    <q-separator />

    <q-card-section class="q-gutter-y-sm">
      <div class="text-caption">OS: debian</div>

      <div class="row flex flex-center">
        <q-knob
          readonly
          v-model="wslStatus.cpuValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="light-blue-9"
          track-color="cyan-12"
          class="text-light-blue-9 q-ma-sm"
        >
          <div class="text-caption">CPU</div>

          <!--            {{ cpuValue }}%-->
        </q-knob>

        <q-knob
          readonly
          v-model="wslStatus.memoryValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="orange"
          track-color="orange-3"
          class="text-orange q-ma-sm"
        >
          <div class="text-caption">Memory</div>
          <!--            {{ memoryValue }}%-->
        </q-knob>

        <q-knob
          readonly
          v-model="wslStatus.diskValue"
          show-value
          size="60px"
          :thickness="0.1"
          color="orange"
          track-color="orange-3"
          class="text-orange q-ma-sm"
        >
          <div class="text-caption">Disk</div>
          <!--            {{ memoryValue }}%-->
        </q-knob>
      </div>

      <q-card-actions align="center">
        <div class="row flex flex-center">
          <q-btn
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="play_arrow"
            size="sm"
            @click="isClick = true"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.run')}}
            </q-tooltip>
          </q-btn>

          <q-btn
            class="text-h8"
            text-color="teal-9"
            unelevated
            icon="stop"
            size="sm"
            @click="isClick = true"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.stop')}}
            </q-tooltip>
          </q-btn>

          <q-btn
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="restart_alt"
            size="sm"
            @click="isClick = true"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('wsl.restart')}}
            </q-tooltip>
          </q-btn>

          <q-btn-dropdown
            class="text-h8"
            :text-color="templates[data.templateId].btn.color"
            unelevated
            icon="more_horiz"
            size="sm"
            @click="isClick = true"
          >
            <q-list :style="`backgroundColor:${templates[data.templateId].backgroundColor}`">
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-icon name="delete" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.delete')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-icon name="terminal" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.terminal')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-icon name="archive" />
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{t('wsl.export')}}
                  </q-tooltip>
                </q-item-section>
              </q-item>
            </q-list>

          </q-btn-dropdown>
        </div>

<!--        <q-btn-group rounded>-->
<!--          <q-btn rounded color="primary" icon="play_arrow" size="sm"/>-->
<!--          <q-btn rounded color="primary" icon="pause" size="sm"/>-->
<!--          <q-btn-dropdown auto-close rounded color="primary" icon="restart_alt" split size="sm">-->
<!--            <q-list>-->
<!--              <q-item clickable v-close-popup @click="onItemClick">-->
<!--                <q-item-section>-->
<!--                  <q-item-label>Photos</q-item-label>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->

<!--          </q-btn-dropdown>-->
<!--        </q-btn-group>-->
      </q-card-actions>

    </q-card-section>

  </q-card>
</template>


<script setup>
defineOptions({
  name: 'VM',
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

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const templates = [
  {
    backgroundColor: "#85C1E9",
    width: "200px",
    height: "150px",
    margin: "20px",
    btn: {
      color: "blue-grey-5",
    },
  },
  {
    backgroundColor: "#808B96",
    width: "280px",
    height: "200px",
    margin: "20px",
    btn: {
      color: "teal-9",
    },

  }
]

const wslStatus = reactive({
  cpuValue: '',
  memoryValue: '',
  diskValue: '',
})

const color = ref("yellow")

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
