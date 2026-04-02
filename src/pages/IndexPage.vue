<template>
  <q-layout container :style="background" >
    <q-page>
<!--      <img-->
<!--        alt="Quasar logo"-->
<!--        src="~assets/quasar-logo-vertical.svg"-->
<!--        style="width: 200px; height: 200px"-->
<!--      >-->

      <div
        class="q-pa-md q-gutter-y-md"
        :style="{height: background.height}"
      >
        <Carousel v-if="displaySettings.isShowCarousel" />

        <SearchBar1 class="search-bar-center" v-if="displaySettings.isShowSearchBar" style="width: 70%; margin-top: 16px; display: flex; justify-content: center; align-items: center;"/>

        <ShortcutsList ref="shortcutsListRef" />
      </div>

<!--      <q-parallax-->
<!--        :height="pHeight"-->
<!--      >-->
<!--        <template v-slot:media>-->
<!--          <img alt src="https://cdn.quasar.dev/img/parallax1.jpg" :style="background">-->
<!--        </template>-->

<!--        -->
<!--      </q-parallax>-->
    </q-page>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, inject, reactive, computed } from 'vue'
import ShortcutsList from 'components/ShortcutsList.vue'
import Carousel from 'components/Carousel.vue'
import SearchBar from 'components/SearchBar.vue'
import SearchBar1 from 'components/SearchBar1.vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const shortcutsListRef = ref(null)

const windowHeight = ref(window.innerHeight)

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: computed(() => {
    return windowHeight.value - 50 + "px"
  })
})

const SCHeight = computed(() => {
  let height = windowHeight.value - 50 - 32
  if (displaySettings.isShowCarousel) {
    height = height - 200 - 16
  }

  if (displaySettings.isShowSearchBar) {
    height = height - 56 - 16
  }
  return height + "px"
})



const pHeight = computed(() => {
  return innerHeight.value - 34 - 16
})

const displaySettings = reactive({
  isShowCarousel: true,
  isShowSearchBar: true
})

const getDisplaySettings = () => {
  window.client.getSettings("display_settings").then((result) => {
    if (result.success) {
      const data = JSON.parse(result.data.value)
      if (Object.prototype.hasOwnProperty.call(data, "isShowCarousel")) {
        displaySettings.isShowCarousel = data.isShowCarousel
      }
      if (Object.prototype.hasOwnProperty.call(data, "isShowSearchBar")) {
        displaySettings.isShowSearchBar = data.isShowSearchBar
      }
    }
  })
}

const init = () => {


}

const checkScreenHeightSize = () => {
  windowHeight.value = window.innerHeight

  shortcutsListRef.value.updateHeight(displaySettings, window.innerHeight)
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenHeightSize)
})

onActivated(() => {
  getDisplaySettings()

})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})


</script>

<style scoped>
.search-bar-center {
  margin: 0 auto;
}


</style>
