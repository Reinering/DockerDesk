<template>
  <q-toolbar style="height: 50px;">
    <q-btn dense flat round icon="menu" @click="props.toggle" />

    <q-avatar>
      <img
        alt="logo"
        :src="props.logoSrc"
      />
    </q-avatar>

    <q-toolbar-title>
      App for Docker
    </q-toolbar-title>

    <q-space />

    <div class="row q-gutter-x-sm">
      <q-btn dense flat size="sm" icon="minimize" @click="minimize" />
      <q-btn dense flat size="sm" icon="crop_square" @click="maximize" />
      <q-btn dense flat size="sm" icon="close" @click="closeApp" />
    </div>

  </q-toolbar>

  <!-- 菜单栏 -->
  <div class="q-pa-sm q-pl-md row items-center" v-if="false">
    <q-btn flat color="blue" label="File">
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
    </q-btn>

    <q-btn flat color="blue" label="Edit">
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
    </q-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  logoSrc: {
    type: String,
    default: ''
  },

  toggle: {
    type: Function,
    default: () => {}
  }
})



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
