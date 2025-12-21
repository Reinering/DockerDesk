<template>
  <q-card :style="cardStyle">
    <q-card-section>
      <div class="row items-center justify-between">
        <q-separator />
        <q-input v-model="search" dense label="Search" outlined clearable >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-separator />

    <q-scroll-area :style="scrollStyle">
      <div class="q-gutter-x-md q-gutter-y-md q-pa-md row justify-center">

        <DockerApp
          v-for="(item, index) in appDatas"
          :key="index"
        />

      </div>
    </q-scroll-area>

  </q-card>
</template>

<script setup>
import { inject, reactive, onMounted, onUnmounted } from 'vue'
import DockerApp from 'components/DockerApp.vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")





const cardStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 102 + "px" : window.innerHeight - 149 + "px",
})

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 183 - 55 - 48 + "px" : window.innerHeight - 149 - 122 - 48 + "px",
})

const appDatas = reactive([
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
])



const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    cardStyle.height = window.innerHeight - 102 + "px"
    scrollStyle.height = window.innerHeight - 183 - 55 - 48 + "px"
  } else {
    cardStyle.height = window.innerHeight - 149 + "px"
    scrollStyle.height = window.innerHeight - 149 - 122 - 48 + "px"
  }
}

const init =() => {

}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {

  window.removeEventListener('resize', checkScreenSize)
})

</script>

<style scoped>

</style>
