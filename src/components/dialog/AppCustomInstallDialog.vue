<template>
  <q-dialog persistent>
    <q-card style="min-width: 90%">
      <q-card-section>
        <q-item-label class="text-h6">{{t('panel.images.createImage')}}</q-item-label>
      </q-card-section>

      <q-separator />

      <q-scroll-area>



      </q-scroll-area>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      storeApis: []
    })
  },

  onUpdate: {
    type: Function,
    default: () => {}
  },

  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

</script>

<style scoped>

</style>
