<template>
  <q-dialog style="width: 60%; height: 90%">
    <q-card class="q-gutter-sm" style="min-width: 100%; height: 90%" >
      <q-card-section>
        <div class="row items-center justify-between">
          <q-field
            dense
            standout
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{t('panel.images.image') + t('panel.images.pull')}}</div>
            </template>
          </q-field>
          <q-input v-model="searchString" dense label="Search" outlined clearable @keydown.enter="onSearch" style="min-width: 250px">
            <template v-slot:append>
              <q-btn round dense flat icon="search" @click="onSearch" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-table
        class="images-table"
        :rows="props.rows"
        :columns="columns"
        row-key="name"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        flat
        bordered
        hide-bottom
      >
        <template v-slot:body-cell-actions="props">
          <q-btn
            icon="download"
            color="primary"
            dense
            flat
            @click="onPull(props.row)"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              {{t('panel.images.pullDialog.pull')}}
            </q-tooltip>
          </q-btn>
        </template>
      </q-table>

    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      stars: 0,
      official: ''
    }),
  },
  search: {
    type: Function,
    default: () => {},
  },
  pull: {
    type: Function,
    default: () => {},
  },
})


import { inject, ref } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const visibleColumns = ['name', 'description', 'stars', 'official', 'actions']
const columns = [
  { name: 'name', label: t('panel.images.pullDialog.name'), align: 'left', field: 'name' },
  { name: 'description', label: t('panel.images.pullDialog.description'), align: 'left', field: 'description' },
  { name: 'stars', label: t('panel.images.pullDialog.stars'), align: 'right', field: 'stars' },
  { name: 'official', label: t('panel.images.pullDialog.official'), align: 'right', field: 'official' },
  { name: 'actions', label: t('panel.images.pullDialog.action'), align: 'right' }
]

const pagination = ref({
  rowsPerPage: 0
})

const searchString = ref('')

const onSearch = () => {
  if (searchString.value) {
    props.search(searchString.value)
  }
}

const onPull = (row) => {
  if (row.name) {
    props.pull(row.name)
  }
}

</script>

<style scoped>

</style>
