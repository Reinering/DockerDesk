<template>
  <q-layout container :style="background" class="shadow-2 rounded-borders">
    <q-page class="flex flex-center" padding>
  <!--    <img-->
  <!--      alt="Quasar logo"-->
  <!--      src="~assets/quasar-logo-vertical.svg"-->
  <!--      style="width: 200px; height: 200px"-->
  <!--    >-->

      <q-card class="my-card" style="width: 100%; max-width: 500px; height: 300px">
        <q-parallax
          src="https://cdn.quasar.dev/img/parallax1.jpg"
          :height="150"
        />

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>
      </q-card>

      <div class="flex flex-center ">
        <Shortcuts
          v-for="(item, index) in shortcutsData"
          :key="index"
          :data="item"
          :onEdit="onEditShortcuts"
          :onDelete="onDeleteShortcuts"
        />

      </div>

      <q-menu context-menu auto-close>
        <q-item clickable @click="onEdit">
          <q-item-section>
            {{ t(editBtnHint)}}
          </q-item-section>
        </q-item>
      </q-menu>

<!--      <q-dialog-->
<!--        v-if="showEditShortcutsDialog"-->
<!--        v-model="showEditShortcutsDialog"-->
<!--      >-->
<!--        <q-card style="min-width: 80%">-->
<!--          <q-card-section>-->
<!--            <div class="text-subtitle1 text-weight-bold" >{{t('index.editShortcuts')}}</div>-->
<!--          </q-card-section>-->

<!--          <q-separator />-->
<!--        </q-card>-->
<!--      </q-dialog>-->

      <EditShortcutsDialog
        v-if="showEditShortcutsDialog"
        v-model="showEditShortcutsDialog"
      />

    </q-page>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, inject, reactive } from 'vue'
import Shortcuts from 'src/components/Shortcuts.vue'
import EditShortcutsDialog from 'components/dialog/EditShortcutsDialog.vue'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
})

const isEdit = ref(false)
const editBtnHint = ref('edit')

const editShortcuts = ref({
  nodeId: 0,
  templateId: 0,
  label: '',
  icon: '',
  isShowOverlay: false,
  url: {}
})
const showEditShortcutsDialog = ref(false)

const shortcutsData = reactive([
  {
    nodeId: 0,
    templateId: 0,
    label: '',
    icon: '',
    isShowOverlay: false,
    url: {}
  }
])


const onEdit = () => {
  isEdit.value = !isEdit.value

  if (isEdit.value) {
    editBtnHint.value = 'cancel'
  } else {
    editBtnHint.value = 'edit'
  }

  for (const item of shortcutsData) {
    item.isShowOverlay = isEdit.value
  }
}

const onEditShortcuts = (id) => {
  for (let i=0; i <= shortcutsData.length; i++) {
    if (shortcutsData[i].nodeId === id) {
      editShortcuts.value = JSON.parse(JSON.stringify(shortcutsData[i]))

      break
    }
  }

  showEditShortcutsDialog.value = !showEditShortcutsDialog.value
}

const onDeleteShortcuts = (id) => {
  $q.dialog({
    title: t('confirm'),
    message: t('index.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    for (let i=0; i <= shortcutsData.length; i++) {
      if (shortcutsData[i].nodeId === id) {
        console.log("mark")
        window.shortcuts.deleteShortcuts(id)
          .then((result) => {
            console.log(result)
            if (result.success) {
              $q.notify({
                type: 'positive',
                position: clientConfig.quasar.notify.position,
                message: `${t('index.deleteSuccess')}`,
              })

              shortcutsData.splice(i, 1)
            } else {
              $q.notify({
                type: 'negative',
                position: clientConfig.quasar.notify.position,
                message: `${t('index.deleteFail')}`
              })
            }
          })

        return
      }
    }
  })
}

const init = () => {

  window.shortcuts.getShortcutss().then((result) => {
    if (result.success) {
      shortcutsData.length = 0
      result.data.forEach(item => {
        shortcutsData.push({
          nodeId: item.id,
          templateId: 0,
          name: item.name,
          label: item.name,
          icon: '',
          isShowOverlay: false,
          url: item.url
        })
      })
    } else {
      console.log("get shortcuts error")
    }
  })

}

const checkScreenHeightSize = () => {
  background.height = window.innerHeight - 70 + "px"
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenHeightSize)
})

onActivated(() => {
  init()
})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenHeightSize)
})


</script>

<style scoped>



</style>
