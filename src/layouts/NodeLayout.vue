<template>
  <q-page>
    <q-tabs
      v-model="tab"
      no-caps
      inline-label
      active-color="purple"
      class="text-teal shadow-2"
    >
      <q-route-tab name="containers" icon="border_all" label="Containers" to="containers" exact />
      <q-route-tab name="images" icon="crop_square" label="Images" to="images" exact />
      <q-route-tab name="volumes" icon="noise_aware" label="Volumes" to="volumes" exact />
      <q-route-tab name="networks" icon="router" label="Networks" to="networks" exact />
    </q-tabs>
    <router-view />
  </q-page>
</template>

<script setup>
import { ref, inject, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'

const tab = ref('')

</script>


<style scoped>

</style>
