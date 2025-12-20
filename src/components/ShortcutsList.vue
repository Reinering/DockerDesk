<template>
  <q-carousel
    ref="carouselRef"
    v-model="slide"
    swipeable
    animated
    infinite
    control-color="primary"
    navigation
    padding
    arrows
    transition-prev="slide-right"
    transition-next="slide-left"
    :height="props.height"
    @dblclick="onDBClick"
    style="background-color: transparent;"
  >
    <q-carousel-slide
      v-for="(page, index) in shortcutsData"
      :key="'page-' + index"
      :name="index"
    >
      <VueDraggableNext
        v-model="shortcutsData[index]"
        class="flex flex-center q-gutter-x-md"
        group="{ name: 'shortcuts-group', put: true }"
        itemKey="id"
        :animation="200"
        :move="onDragMove"
        @start="onDragStart"
        @end="onDragEnd"
        @drag="onDrag"
        @remove="onRemove"
        @change="onChange"
        @mousedown.stop
        @touchstart.stop
        style="padding-bottom: 40px; min-height: 150px; width: 100%;"
      >
<!--        <Shortcuts2-->
<!--          v-for="(item) in page"-->
<!--          :key="item.id"-->
<!--          :data="item"-->
<!--          :onEdit="onEditShortcuts"-->
<!--          :onDelete="onDeleteShortcuts"-->
<!--        />-->

        <component
          :is="templateMap[templateId]"
          v-for="(item) in page"
          :key="item.id"
          :data="item"
          :onEdit="onEditShortcuts"
          :onDelete="onDeleteShortcuts"
        />
      </VueDraggableNext>
    </q-carousel-slide>

  </q-carousel>

  <q-menu context-menu auto-close>
    <q-item clickable @click="onEdit">
      <q-item-section>
        {{ t(editBtnHint) }}
      </q-item-section>
    </q-item>
    <q-item clickable @click="onSettings">
      <q-item-section>
        {{ t("settings") }}
      </q-item-section>
    </q-item>
  </q-menu>

  <EditShortcutsDialog
    v-if="showEditShortcutsDialog"
    v-model="showEditShortcutsDialog"
    :data="editShortcuts"
    :onUpdate="onUpdate"
    :onClose="onEditClose"
  />

  <ShortcutsSettingsDialog
    v-if="showShortcutsSettingsDialog"
    v-model="showShortcutsSettingsDialog"
    :data="{
      templateId: templateId,
      templates: Object.keys(templateMap)
    }"
    :onSetTemplate="onSetTemplate"
    :onClose="onSettingsClose"
  />
</template>

<script setup>
const props = defineProps({
  height: {
    type: String,
    default: '500px'
  },
})


import {
  provide,
  inject,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  nextTick,
} from 'vue'
import Shortcuts1 from 'components/Shortcuts1.vue'
import Shortcuts2 from 'components/Shortcuts2.vue'
import EditShortcutsDialog from 'components/dialog/EditShortcutsDialog.vue'
import ShortcutsSettingsDialog from 'components/dialog/ShortcutsSettingsDialog.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { clientConfig } from 'src/common/config.js'
import { useShortcutsStore } from 'stores/shortcuts.js'


const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const shortcutsStore = useShortcutsStore()

const background = reactive({
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: window.innerHeight - 70 + "px"
})

const templateMap = {
  1: Shortcuts1,
  2: Shortcuts2,
}

const templateId = ref(1)

const slide = ref(0)
const carouselRef = ref(null)
const THRESHOLD = 50
const SCROLL_DELAY = 600
let isScrollingLocked = false

const isDrag = ref(false)

const isEdit = ref(false)
const editBtnHint = ref('edit')

const showEditShortcutsDialog = ref(false)

const editShortcuts = ref({
  nodeId: 0,
  templateId: 0,
  label: '',
  icon: '',
  isShowOverlay: false,
  url: {}
})

const showShortcutsSettingsDialog = ref(false)

const shortcutsData = reactive([
  [
    {
      nodeId: 0,
      templateId: 0,
      label: '',
      icon: '',
      isShowOverlay: false,
      url: {}
    }
  ]
])

const onSetTemplate = (id) => {
  console.log("onSetTemplate", id)
  templateId.value = id

  shortcutsStore.shortcutTemplate = id
}

const onEditClose = () => {
  showEditShortcutsDialog.value = !showEditShortcutsDialog.value
}

const onSettingsClose = () => {
  showShortcutsSettingsDialog.value = !showShortcutsSettingsDialog.value
}

const onSettings = () => {
  showShortcutsSettingsDialog.value = true
}

const onDBClick = () => {
  if (!isEdit.value) {
    return
  }

  isEdit.value = false
  editBtnHint.value = 'edit'

  for (const item of shortcutsData) {
    item.isShowOverlay = false
  }
}

const onEdit = () => {
  isEdit.value = !isEdit.value

  if (isEdit.value) {
    editBtnHint.value = 'cancel'
  } else {
    editBtnHint.value = 'edit'
  }

  for (const page of shortcutsData) {
    for (const item of page) {
      item.isShowOverlay = isEdit.value
    }
  }
}

const onEditShortcuts = (id) => {
  const page = shortcutsData[slide.value]
  for (let i=0; i <= page.length; i++) {
    if (page[i].id === id) {
      editShortcuts.value = JSON.parse(JSON.stringify(page[i]))

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
    const page = shortcutsData[slide.value]
    for (let i=0; i <= page.length; i++) {
      if (page[i].id === id) {
        window.shortcuts.deleteShortcuts(id)
          .then((result) => {
            if (result.success) {
              $q.notify({
                type: 'positive',
                position: clientConfig.quasar.notify.position,
                message: `${t('index.deleteSuccess')}`,
              })

              page.splice(i, 1)
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

  shortcutsStore.shortcutsData = shortcutsData
}

const onUpdate = () => {
  getShortcutsList()
}

const onDragMove = (event) => {
  console.log("move")

}

const onDragStart = async (event) => {
  console.log("start")

  shortcutsData.push([])

  isDrag.value = true
  await checkDrag()
}

const onDragEnd = (event) => {
  console.log("end")

}

const onDrag = (event) => {
  console.log("drag")

  isDrag.value = true

  if (!carouselRef.value || isScrollingLocked || shortcutsData.length <= 0) return

  const carouselElement = carouselRef.value.$el
  const rect = carouselElement.getBoundingClientRect()

  const clientX = event.clientX
  if (clientX > rect.right - THRESHOLD) {
    lockScrolling()
    carouselRef.value.next()
  } else if (clientX < rect.left + THRESHOLD) {
    lockScrolling()
    carouselRef.value.previous()
  }

  shortcutsStore.shortcutsData = shortcutsData
}

const onChange = (event) => {
  console.log("onChange", event)

  const node = JSON.parse(JSON.stringify(event.added.element))

  updatePrevId(event, node)
  updatePageNo(event, node)

  // if (shortcutsData[shortcutsData.length - 1].length === 0) {
  //   shortcutsData.splice(shortcutsData.length - 1, 1)
  // }
}

const onRemove = (event) => {
  console.log("onRemove")
}

// 锁定功能：利用 Quasar 的定时器来实现冷却
const lockScrolling = () => {
  isScrollingLocked = true
  setTimeout(() => {
    isScrollingLocked = false
  }, SCROLL_DELAY)
}

const checkDrag = async () => {
  if (isDrag.value) {
    isDrag.value = false

    setTimeout(checkDrag, 500)
  } else {
    if (shortcutsData[shortcutsData.length - 1].length === 0) {
      if (slide.value === shortcutsData.length - 1) {
        slide.value = shortcutsData.length - 2
      }

      shortcutsData.splice(shortcutsData.length - 1, 1)
    }
  }
}

const updatePrevId = (event, node) => {
  const sqlList = []

  if (event.removed) console.log('从旧页面移除了:', event.removed.element)

  if (event.added) {
    console.log('添加到了新页面:', event.added.element)
    let page

    if (node.pageNo === slide.value) {  // 同页拖拽
      page = shortcutsData[node.pageNo]
      for (let i=0; i < page.length; i++) {
        if (page[i].id === node.id) {
          if (i === 0) {
            page[i].prevId = "0"

            sqlList.push({
              id: page[i].id,
              prevId: "0"
            })
          } else {
            page[i].prevId = page[i-1].id

            sqlList.push({
              id: page[i].id,
              prevId: page[i-1].id
            })
          }

          if (i+1 < page.length) {
            page[i+1].prevId = node.id

            sqlList.push({
              id: page[i+1].id,
              prevId: node.id
            })
          }

        } else if (node.prevId === page[i].id) {
          if (i === 0) {
            page[i].prevId = "0"

            sqlList.push({
              id: page[i].id,
              prevId: "0"
            })
          } else {
            page[i].prevId = page[i-1].id

            sqlList.push({
              id: page[i].id,
              prevId: page[i-1].id
            })
          }
        }
      }
    } else {  // 不同页拖拽
      // 目标页面
      page = shortcutsData[slide.value]
      for (let i=0; i < page.length; i++) {
        if (page[i].id !== node.id) {
          continue
        }

        if (i === 0) {
          page[i].prevId = "0"

          sqlList.push({
            id: page[i].id,
            prevId: "0"
          })
        } else {
          page[i].prevId =page[i-1].id

          sqlList.push({
            id: page[i].id,
            prevId: page[i-1].id
          })
        }

        if (i !== page.length - 1) {
          page[i+1].prevId = node.id

          sqlList.push({
            id: page[i+1].id,
            prevId: node.id
          })
        }

        page[i].pageNo = slide.value
        sqlList.push({
          id: page[i].id,
          pageNo: slide.value
        })

        break
      }

      // 原页面
      page = shortcutsData[node.pageNo]
      for (let i = 0; i < page.length; i++) {
        if (page[i].id !== node.id) {
          continue
        }

        if(i === 0 && page.length > 1) {
          page[i + 1].prevId = "0"

          sqlList.push({
            id: page[i + 1].id,
            prevId: "0"
          })
        } else if (page.length > 1 && i < page.length - 1) {
          page[i+1].prevId = page[i-1].id

          sqlList.push({
            id: page[i+1].id,
            prevId: page[i-1].id
          })
        }

        page.splice(i, 1)

        break
      }
      // shortcutsData[node.pageNo] = shortcutsData[node.pageNo].filter(item => item.id !== node.id)
    }
  }

  if (event.moved) {
    console.log('从页面移动:', event.moved.element)

    let page
    const node = JSON.parse(JSON.stringify(event.moved.element))

    if (node.pageNo === slide.value) {  // 同页拖拽
      page = shortcutsData[node.pageNo]
      for (let i=0; i < page.length; i++) {
        if (page[i].id === node.id) {
          if (i === 0) {
            page[i].prevId = "0"

            sqlList.push({
              id: page[i].id,
              prevId: "0"
            })
          } else {
            page[i].prevId = page[i-1].id

            sqlList.push({
              id: page[i].id,
              prevId: page[i-1].id
            })
          }

          if (i+1 < page.length) {
            page[i+1].prevId = node.id

            sqlList.push({
              id: page[i+1].id,
              prevId: node.id
            })
          }

        } else if (node.prevId === page[i].id) {
          if (i === 0) {
            page[i].prevId = "0"

            sqlList.push({
              id: page[i].id,
              prevId: "0"
            })
          } else {
            page[i].prevId = page[i-1].id

            sqlList.push({
              id: page[i].id,
              prevId: page[i-1].id
            })
          }
        }
      }
    }

  }

  if (sqlList.length > 0) {
    window.shortcuts.updatesShortcutsById(sqlList).then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('index.updateSuccess')
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('index.updateFail')}: ${result.error}`
        })
      }
    })
  }
}

const updatePageNo = (event, node) => {
  const sqlList = []

  if (event.added) {
    console.log('添加到了新页面:', event.added.element)

    const page = shortcutsData[node.pageNo]

    // 删除空白页
    if (page.length === 0) {
      const nextPage = shortcutsData[node.pageNo + 1]

      for (let i=node.pageNo+1; i < shortcutsData.length; i++) {

        for (const item of shortcutsData[i]) {
          item.pageNo = item.pageNo - 1
        }

        sqlList.push({
          oldPage: i,
          newPage: i-1
        })
      }

      window.shortcuts.updatesPageShortcutsByPage(sqlList).then((result) => {
        if (result.success) {
          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('index.updateSuccess')
          })
        } else {
          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: `${t('index.updateFail')}: ${result.error}`
          })
        }
      })

      if (slide.value > node.pageNo) {
        slide.value = slide.value -1
      }

      shortcutsData.splice(node.pageNo, 1)
    }
  }
}

const getShortcutsList = () => {
  window.shortcuts.getShortcutss().then((result) => {
    if (result.success) {
      shortcutsData.length = 0
      result.data.forEach(page => {
        const tmp = []
        for (const item of page) {
          item["templateId"] = 0
          item["isShowOverlay"] = isEdit.value

          tmp.push(item)
        }

        shortcutsData.push(tmp)
      })
    } else {
      console.log("get shortcuts error")
    }
  })

  shortcutsStore.shortcutsData = shortcutsData
}

const init = () => {

  getShortcutsList()

  console.log(shortcutsData)


  if (shortcutsStore.shortcutTemplate) {
    templateId.value = shortcutsStore.shortcutTemplate
  }
}

const checkScreenHeightSize = () => {
  background.height = window.innerHeight - 70 + "px"
}

onMounted(() => {
  // init()

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
