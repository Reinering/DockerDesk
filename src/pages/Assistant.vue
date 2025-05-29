<template>
  <q-page q-pa-md padding >
    <div class="text-h4 q-mb-md">引导</div>

    <div class="q-pa-md row q-gutter-md justify-evenly">
      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px;">
        <q-card-section align="center">
          <div class="text-h5">本地Docker/Podman</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          添加本地
        </q-card-section>

        <q-card-actions class="q-mt-none" align="center">
          <q-btn label="添加服务" color="primary" size="lg" @click="gotoAss2"/>
        </q-card-actions>

      </q-card>


      <q-card class="bg-blue-grey-6" style="width: 40%; height: 250px;">
        <q-card-section align="center">
          <div class="text-h5">远程Docker/Podman</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          添加本地
        </q-card-section>

        <q-card-actions class="q-mt-none" align="center">
          <q-btn label="添加服务" color="primary" size="lg" @click="gotoAss2"/>
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md row q-gutter-md justify-center">
      <q-card class="bg-primary " style="width: 80%; height: 250px;">

      </q-card>
    </div>



  </q-page>
</template>

<script setup>

import { inject } from 'vue'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const gotoAss2 = () => {
  router.push("/assistant/asslocal")
}


</script>

<style scoped>

</style>
