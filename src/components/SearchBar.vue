<template>
  <q-input
    class="text-subtitle1"
    v-model="search"
    size="xl"
    clearable
    placeholder="Search"
    @keydown.enter="onSearch"
  >
    <template v-slot:prepend>
      <q-icon :name="currentSE.icon" />
      <q-select
        v-model="currentSE"
        :options="searchEngines"
        style="min-width: 70px;"
      />
    </template>
    <template v-slot:append>
      <q-btn round flat icon="search" @click="onSearch" />
    </template>
  </q-input>
</template>

<script setup>

import { reactive, ref, onMounted, onUnmounted } from 'vue'
import googleSvg from '/src/assets/svg/google-color.svg?url'
import bingSvg   from '/src/assets/svg/bing-color.svg?url'

const search = ref('')

const searchEngines = [
  { label: "Bing", value: 'bing', icon: `img:${bingSvg}`, url: "https://cn.bing.com/search?q=" },
  { label: "Google", value: 'google', icon: `img:${googleSvg}`, url: "https://www.google.com/search?q=" },
]

const currentSE = ref({
  label: "Bing",
  value: 'bing',
  icon: `img:${bingSvg}`,
  url: "https://cn.bing.com/search?q="
})

const onSearch = () => {
  window.client.openUrlOnBrowser(currentSE.value.url + search.value)
  search.value = ''
}

onMounted(() => {

})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
