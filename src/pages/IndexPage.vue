<template>
  <q-layout container :style="background" class="shadow-2 rounded-borders">
    <q-page  padding class="q-gutter-y-md">
<!--      <img-->
<!--        alt="Quasar logo"-->
<!--        src="~assets/quasar-logo-vertical.svg"-->
<!--        style="width: 200px; height: 200px"-->
<!--      >-->
      <Carousel />

      <ShortcutsList :height="SCHeight" />

    </q-page>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, inject, reactive } from 'vue'
import ShortcutsList from 'components/ShortcutsList.vue'
import Carousel from 'components/Carousel.vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 - 16 + "px"
})

const SCHeight = ref(window.innerHeight - 70 -16 - 264 + "px")

const init = () => {

}

const checkScreenHeightSize = () => {
  background.height = window.innerHeight - 70 -16 + "px"

  SCHeight.value = window.innerHeight - 70 -16 - 264 + "px"
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenHeightSize)
})

onActivated(() => {
  init()
})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})


</script>

<style scoped>



</style>
