<template>
  <q-btn-dropdown
    size="md"
    label="Help"
  >
    <q-list>
      <q-item clickable v-close-popup>
        <q-item-section>
          <q-item-label>Photos</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>
          <q-item-label>Videos</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>
          <q-item-label>关于</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>

</script>

<style scoped>

</style>
