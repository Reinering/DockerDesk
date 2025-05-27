
<template>
  <q-card class="out-card q-gutter-x-md q-gutter-y-md column" style="width: 700px; max-width: 80vw;">
    <q-card-section class="scroll" style="max-width: 50vh; max-height: 50vh">
      <Unit :cardData="basicSetting" >
        <template v-slot:content>
          <q-card-section class="items-center q-gutter-sm" v-show=basicSetting.isShow>

          </q-card-section>
        </template>
      </Unit>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineOptions({
  name: 'ContainerSetting',
})

import { inject, reactive } from "vue"
import Unit from 'src/components/Unit.vue'


const basicSetting = reactive({
  title: {
    text: '节点设置',
    style: {}
  },
  expand: {
    isShow: false
  },
  style: {
    width: '80%',
    maxWidth: "800px",
    margin: "30px"
  },
  isShow: false,
  click: () => {
    basicSetting.isShow = !basicSetting.isShow
  }
})



</script>


<style scoped>

</style>
