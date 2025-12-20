<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 60%; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 ">{{ t('index.settings') }}</div>
        <q-space />
<!--          <q-btn-->
<!--            icon="close"-->
<!--            flat-->
<!--            round-->
<!--            dense-->
<!--            v-close-popup-->
<!--          />-->
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">
          <q-select
            class="q-mb-sm"
            outlined
            dense
            color="blue"
            v-model="templateId"
            :options="props.data.templates"
            :label="t('index.shortcutsTemplate')"
            @update:model-value="updateTemplate"
          />
        </div>
      </q-card-section>



      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" @click="onSettings" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import { inject, ref } from 'vue'

const props = defineProps({

  data: {
    type: Object,
    default: () => ({
      templateId: '',
      templates: []
    })
  },

  onSetTemplate: {
    type: Function,
    default: () => {}
  },

  onClose: {
    type: Function,
    default: () => {}
  }
})

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const isOK = ref(true)

const templateId = ref(props.data.templateId)

const updateTemplate = (id) => {
  props.onSetTemplate(id)
}

const onSettings = () => {

}

</script>

<style scoped>

</style>
