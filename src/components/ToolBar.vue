<template>
  <!-- 无边框状态时的标题栏，最小化按钮、最大化按钮、关闭按钮、 -->
  <q-bar class="q-electron-drag" v-if="isBarHide">
    <q-icon name="laptop_chromebook" class="q-electron-drag--exception" />
    <div>Docker Tools</div>

    <q-space />

    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="maximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>

  <!-- 菜单栏 -->
  <!-- <div class="q-pa-sm q-pl-md row items-center">
    <div class="cursor-pointer non-selectable">
    File
    <q-menu>
      <q-list dense style="min-width: 100px">
      <q-item clickable v-close-popup>
        <q-item-section>Open...</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>New</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable>
        <q-item-section>Preferences</q-item-section>
        <q-item-section side>
        <q-icon name="keyboard_arrow_right" />
        </q-item-section>

        <q-menu anchor="top end" self="top start">
        <q-list>
          <q-item
          v-for="n in 3"
          :key="n"
          dense
          clickable
          >
          <q-item-section>Submenu Label</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
          <q-menu auto-close anchor="top end" self="top start">
            <q-list>
            <q-item
              v-for="n in 3"
              :key="n"
              dense
              clickable
            >
              <q-item-section>3rd level Label</q-item-section>
            </q-item>
            </q-list>
          </q-menu>
          </q-item>
        </q-list>
        </q-menu>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup @click="closeApp">
        <q-item-section>Quit</q-item-section>
      </q-item>
      </q-list>
    </q-menu>
    </div>

    <div class="q-ml-md cursor-pointer non-selectable">
    Edit
    <q-menu auto-close>
      <q-list dense style="min-width: 100px">
      <q-item clickable>
        <q-item-section>Cut</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Copy</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Paste</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable>
        <q-item-section>Select All</q-item-section>
      </q-item>
      </q-list>
    </q-menu>
    </div>
  </div> -->
</template>

<script setup>

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
