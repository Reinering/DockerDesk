<template>
  <q-card
    bordered
    class="container-card"
    :style="style"
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

    <q-card-section align="center">
      <q-btn
        class="text-h8"
        text-color="blue-grey-5"
        unelevated
        icon="settings"
        style="width: 40px"
        @click="isClick = true"
      />
    </q-card-section>

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

import { reactive, ref, watch } from 'vue'
import ContainerSetting from "./ContainerSetting.vue"



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
