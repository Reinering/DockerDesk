<template>
  <q-page q-pa-md padding >
<!--    <router-view />-->
    <router-view v-slot="{ Component, route }">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component" />
      </keep-alive>

      <component v-else :is="Component" />
    </router-view>
  </q-page>
</template>

<script setup>

</script>

<style scoped>

</style>
