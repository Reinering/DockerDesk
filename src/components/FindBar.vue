<template>
  <q-input
    class="bg-grey-8 text-white"
    dark
    dense
    spellcheck="false"
    v-model="searchText"
    clearable
    placeholder="Search"
    @keydown.enter="onSearch"
  >
    <template v-slot:append>
      <q-btn round flat size="sm" icon="arrow_upward" @click="onSearchPrev" />
      <q-btn round flat size="sm" icon="arrow_downward" @click="onSearchNext" />
      <q-btn round flat icon="search" @click="onSearch" />
      <!--      <q-btn round flat size="sm" icon="closed_caption_off" />-->
<!--      <q-btn round flat size="sm" icon="closed_caption" />-->
    </template>
  </q-input>
</template>

<script setup>
const props = defineProps({
  search: {
    type: Function,
    default: () => {},
  }

})

import { reactive, ref, onMounted, onUnmounted } from 'vue'


const searchText = ref('')

const onSearch = () => {
  if (searchText.value === '') {
    return
  }

  props.search("next", searchText.value)
}
const onSearchNext = () => {
  if (searchText.value === '') {
    return
  }

  props.search("next", searchText.value)
}
const onSearchPrev = () => {
  if (searchText.value === '') {
    return
  }

  props.search("prev", searchText.value)
}

onMounted(() => {

})

onUnmounted(() => {

})

</script>

<style scoped>

</style>
