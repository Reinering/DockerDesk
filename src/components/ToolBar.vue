<template>
  <q-toolbar style="height: 50px;">
    <q-btn dense flat round icon="menu" @click="props.toggle" />

    <q-avatar>
      <img
        alt="logo"
        :src="props.logoSrc"
      />
    </q-avatar>

    <q-toolbar-title>
      App for Docker
    </q-toolbar-title>

    <q-space />

    <div class="row q-gutter-x-sm">
      <q-btn dense flat size="sm" icon="minimize" @click="minimize" />
      <q-btn dense flat size="sm" icon="crop_square" @click="maximize" />
      <q-btn dense flat size="sm" icon="close" @click="closeApp" />
    </div>

  </q-toolbar>
</template>

<script setup>
const props = defineProps({
  logoSrc: {
    type: String,
    default: ''
  },

  toggle: {
    type: Function,
    default: () => {}
  }
})



import { ref } from "vue"

const isBarHide = ref(false)

if (process.env.MODE === 'electron') {
  isBarHide.value = true
} else {
  isBarHide.value = false
}

const minimize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.minimize()
  }
}

const maximize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.toggleMaximize()
  }
}

const closeApp = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.close()
  }
}




</script>

<style scoped>

</style>
