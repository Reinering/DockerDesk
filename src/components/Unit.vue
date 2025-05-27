<!--
cardData: {
  title: {
    text: '基本设置',
    style: {}
  },
  expand: {
    isShow: true
  },
  style: {
    width: '80%',
    maxWidth: "800px",
    margin: "30px"
  }
}
-->
<template>
  <q-card class="q-my-lg no-shadow" :style="style">
    <q-toolbar class="no-wrap items-center">
      <section>
        <div class="doc-card-title text-h6" :style="props.cardData.title.style">
          {{ props.cardData.title.text }}
        </div>
      </section>
      <q-space />
      <div class="q-gutter-lg">
        <slot name="toolbar"></slot>
        <q-btn flat v-show="props.cardData.expand.isShow" :icon="setting.icon" @click="setting.onclick"/>
      </div>

    </q-toolbar>

    <q-separator />

    <div>
      <slot name="content"></slot>
    </div>
  </q-card>
</template>
<!--

-->
<script setup>
defineOptions({
  name: 'Unit',
})

const props = defineProps({
  cardData: {
    type: Object,
    default: () => {},
  }
})

import { reactive, toRefs } from 'vue'
import { changeExpansionIcon } from 'src/utils/common'



const setting = reactive({
  icon: "expand_more",
  onclick: () => {
    props.cardData.click(props.cardData)
    changeExpansionIcon(setting)
  }
})


</script>

<style scoped>

.doc-card-title {
  margin-left: -24px;
  padding: 2px 10px 2px 24px;
  background: #e0e0e0;
  color: #616161;
  position: relative;
  border-radius: 3px 5px 5px 0;
}

.doc-card-title::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-top-color: #bebebe;
  border-width: 9px 0 0 11px;
}

</style>
