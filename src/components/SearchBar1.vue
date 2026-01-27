<template>
  <q-select
    class="text-subtitle1"
    v-model="search"
    :options="cache"
    clearable
    use-input
    @filter="filterFn"
    @keydown.enter="onSearch"
  >
    <template v-slot:prepend>
      <q-select
        v-model="currentSE"
        :options="searchEngines"
        style="min-width: 100px;"
      >
        <template v-slot:prepend>
          <q-icon :name="currentSE.icon" />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="sm" icon="clear" @click="toggleDelOption(scope.opt)" />
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:append>
      <q-btn round flat icon="search" @click="onSearch" />
    </template>
  </q-select>

</template>

<script setup>

import { reactive, ref, onMounted, onUnmounted } from 'vue'
import googleSvg from '/src/assets/svg/google-color.svg?url'
import bingSvg   from '/src/assets/svg/bing-color.svg?url'
import { useShortcutsStore } from 'stores/shortcuts.js'

const shortcutsStore = useShortcutsStore()

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

const search = ref('')
const _search = ref('')
const cache = reactive([])

const onSearch = () => {
  setTimeout(() => {
    let txt = _search.value
    if (txt.length === 0) {
      txt = search.value
    }

    window.client.openUrlOnBrowser(currentSE.value.url + txt)
    search.value = ''
    _search.value = ''

    if (txt.length === 0) {
      return
    }

    const position = cache.indexOf(txt)

    if (position !== -1) {
      cache.splice(position, 1)
    }

    if (cache.length === 10 ) {
      cache.splice(10, 1)
    }

    cache.unshift(txt)

    shortcutsStore.searchCache = cache
  }, 500)

}

const filterFn = (val, update) => {
  _search.value = val

  update(() => {})
}

const toggleDelOption = (opt) => {
  const position = cache.indexOf(opt)

  if (position !== -1) {
    cache.splice(position, 1)
    shortcutsStore.searchCache = cache
  }
}

const init = () => {
  if (shortcutsStore.searchCache) {
    cache.push(...shortcutsStore.searchCache)
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
