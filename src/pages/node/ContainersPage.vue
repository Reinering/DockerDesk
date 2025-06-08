<template>
  <Containers
    :container-id="item.id"
    :data="item.data"
  />
</template>

<script setup>
import Containers from 'components/Containers.vue'

const item = { id: 'mails', label: 'Mails', icon: 'check', data: {serviceType: "docker"}}

</script>

<style scoped>

</style>
