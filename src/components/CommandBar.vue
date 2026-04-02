<template>
  <q-card style="height: 195px; margin-top: 2px">
    <div class="row no-wrap q-pa-md q-gutter-sm no-padding" style="margin-left: 2px;">
      <!--    // menu-->
      <q-menu context-menu auto-close>
        <q-list>
          <q-item clickable @click="onAddButton">
            <q-item-section>
              {{ t('add') + 'Button' }}
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable @click="onAddButtonBar">
            <q-item-section>
              {{ t('add') + 'Button Bar' }}
            </q-item-section>
          </q-item>
          <q-item clickable @click="onEditButtonBar">
            <q-item-section>
              {{ t('edit') + 'Button Bar' }}
            </q-item-section>
          </q-item>
          <q-item clickable @click="onDelButtonBar">
            <q-item-section>
              {{ t('delete') + 'Button Bar' }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>

      <q-btn
        class="square-btn"
        icon="settings"
        padding="none"
        flat
        @click="onShowSettingsDialog"
      />

      <q-select
        color="blue"
        filled
        dense
        v-model="option"
        :options="Object.keys(cmds)"
        size="sm"
        style="width: 150px;"
      />
      <q-scroll-area style="width: 100%; min-height: 50px">
        <div class="row no-wrap q-gutter-sm">
<!--          size=sm-->
          <q-btn
            class="cmd-btn"
            v-for="(cmd, index) in cmds[option]"
            :key="index"
            :label="cmd.label"
            color="green"
            no-caps
            @click="onClickCMD(cmd)"
            style="{min-width: 80px; max-width: 100px; height: 36px; max-height: 36px;}"
          >
            <q-tooltip>
              {{cmd.label}}
            </q-tooltip>
            <q-menu context-menu auto-close>
              <q-list>
                <q-item clickable @click="onAddButton">
                  <q-item-section>
                    {{ t('add') + 'Button' }}
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onEditButton(cmd)">
                  <q-item-section>
                    {{ t('edit') + 'Button' }}
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDelButton(cmd)">
                  <q-item-section>
                    {{ t('delete') + 'Button' }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-scroll-area>
    </div>

    <q-input
      class="cmd-textarea"
      type="textarea"
      v-model="command"
      placeholder="Send commands to active session, press Shift+Enter to line break"
      filled
      clearable
      @keydown="handleKeyDown"
      style="min-height: 150px; max-height: 150px"
    />

<!--    <div>-->
<!--      <q-input-->
<!--        class="cmd-textarea"-->
<!--        type="textarea"-->
<!--        v-model="command"-->
<!--        placeholder="Send commands to active session, press Shift+Enter to line break"-->
<!--        filled-->
<!--        clearable-->
<!--        @keydown="handleKeyDown"-->
<!--        style="min-height: 150px"-->
<!--      />-->
<!--&lt;!&ndash;      autofocus&ndash;&gt;-->
<!--&lt;!&ndash;      @keyup.enter="scope.set"&ndash;&gt;-->
<!--&lt;!&ndash;      onKeyDown={handleKeyDown}&ndash;&gt;-->
<!--    </div>-->
  </q-card>

  <q-dialog v-model="showGroupDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{diaglogGroupTitle}}</div>
      </q-card-section>
      <q-card-section>
        <q-form >
          <q-input
            class="q-mb-sm"
            ref="inputRef"
            v-model="newOption"
            :label="t('cmdBar.groupName')"
            maxlength="30"
            outlined
            dense
            :rules="[
              val => !!val || t('verifyMessage.dataNotNull'),
              val => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20'
            ]"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeGroupDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="primary" @click="submitCmdGroup" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCmdDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{diaglogCmdTitle}}</div>
      </q-card-section>
      <q-card-section>
        <q-form >
          <q-input
            class="q-mb-sm"
            v-model="newCmd.label"
            :label="t('cmdBar.label')"
            maxlength="30"
            outlined
            dense
            :rules="[
              val => !!val || t('verifyMessage.dataNotNull'),
              val => val.length <= 20 || t('verifyMessage.dataLenNotMax') + '20'
            ]"
          />
          <q-input
            class="q-mb-sm"
            v-model="newCmd.text"
            :label="t('cmdBar.sendString')"
            type="textarea"
            outlined
            dense
            :rules="[
              val => val.length <= 200 || t('verifyMessage.dataLenNotMax') + '200'
            ]"
          />
          <q-input
            class="q-mb-sm"
            v-model="newCmd.mark"
            :label="t('cmdBar.mark')"
            outlined
            dense
            :rules="[
              val => val.length <= 200 || t('verifyMessage.dataLenNotMax') + '200'
            ]"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeCmdDialog" />
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="primary" @click="submitCmd" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showSettingsDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{settingDialogTitle}}</div>
      </q-card-section>
      <q-card-section>
        <q-checkbox v-model="isSudo" label="Sudo(enable)" color="teal" />
        <q-checkbox v-model="isSendNow" label="Send Now" color="orange" />
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>

import { inject, onMounted, onActivated, reactive, ref, watch } from 'vue'
import { usePreCmdsStore } from 'stores/precmds.js'
import { clientConfig } from 'src/common/config.js'
import { deepClone, isEmptyObj } from 'src/utils/common.js'

const props = defineProps({
  send: {
    type: Function,
    default: () => {}
  },
})

const $q = inject("$q")
const t = inject("t")
const preCmdsStore = usePreCmdsStore()

const option = ref('')
const command = ref('')
const cmds = reactive({})

const getPreCmds = () => {
  window.precmds.getPreCmds().then((data) => {
    if (Object.keys(data).length > 0) {
      preCmdsStore.preCmds = data

      Object.keys(cmds).forEach(key => {
        delete cmds[key]
      })

      Object.keys(data).forEach(key => {
        cmds[key] = data[key]
      })
    }
  })
}

const diaglogGroupTitle = ref(t('cmdBar.addCmdGroup'))
const diaglogCmdTitle = ref(t('cmdBar.addCmd'))

const showGroupDialog = ref(false)
const showCmdDialog = ref(false)

const newOption = ref('')
const newCmd = reactive({
  label: '',
  text: '',
  mark: ''
})
let selectedItem = {}

const isEdit = ref(false)

const textAreaStyle = reactive({})

const closeGroupDialog = () => {
  showGroupDialog.value = false
  isEdit.value = false

  newOption.value = ''
}

const closeCmdDialog = () => {
  showCmdDialog.value = false
  isEdit.value = false

  newCmd.label = ''
  newCmd.text = ''
  newCmd.mark = ''
  selectedItem = {}
}

const onAddButtonBar = () => {
  showGroupDialog.value = !showGroupDialog.value
}
const onEditButtonBar = () => {
  if (option.value === '') {
    return
  }

  showGroupDialog.value = !showGroupDialog.value
  isEdit.value = true

  newOption.value = option.value
}
const onDelButtonBar = () => {
  if (option.value === '') {
    return
  }

  $q.dialog({
    title: t('confirm'),
    message: t('cmdBar.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    window.precmds.delPreCmdGroup(option.value).then((res) => {
      if (res.success) {
        Reflect.deleteProperty(cmds, option.value)
        option.value = Object.keys(cmds)[0]
        preCmdsStore.option = option.value
        preCmdsStore.preCmds = cmds

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('database.deleteSuccess')
        })
      } else {
        let errMsg = ''
        if (res.error instanceof Error) {
          errMsg = JSON.stringify(res.error)
        } else {
          errMsg = res.error
        }

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.deleteFail') + ': ' + errMsg
        })
      }
    })
  })
}
const onAddButton = () => {
  if (option.value === '') {
    return
  }

  showCmdDialog.value = !showCmdDialog.value
}
const onEditButton = (cmd) => {
  showCmdDialog.value = !showCmdDialog.value
  isEdit.value = true

  newCmd.label = cmd.label
  newCmd.text = cmd.text
  newCmd.mark = cmd.mark

  selectedItem = cmd
}
const onDelButton = (cmd) => {
  $q.dialog({
    title: t('confirm'),
    message: t('cmdBar.deleteMessage'),
    ok: {
      push: true
    },
    cancel: {
      push: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    window.precmds.delPreCmd(JSON.stringify({
      group: option.value,
      label: cmd.label
    })).then((res) => {
      if (res.success) {
        cmds[option.value] = cmds[option.value].filter(item => item["label"] !== cmd["label"])
        preCmdsStore.preCmds = cmds

        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: t('database.deleteSuccess')
        })
      } else {
        let errMsg = ''
        if (res.error instanceof Error) {
          errMsg = JSON.stringify(res.error)
        } else {
          errMsg = res.error
        }

        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: t('database.deleteFail') + ': ' + errMsg
        })
      }
    })
  })
}

const submitCmdGroup = () => {
  if (isEdit.value) {
    if (newOption.value.trim()) {
      window.precmds.editPreCmdGroup(JSON.stringify(
        {
          old: option.value,
          new: newOption.value
        }
      )).then((res) => {
        if (res.success) {
          let tmp = cmds[option.value]
          Reflect.deleteProperty(cmds, option.value)
          cmds[newOption.value] = tmp
          option.value = newOption.value

          preCmdsStore.option = option.value
          preCmdsStore.preCmds = cmds

          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('database.updateSuccess')
          })

          closeGroupDialog()
        } else {
          let errMsg = ''
          if (res.error instanceof Error) {
            errMsg = JSON.stringify(res.error)
          } else {
            errMsg = res.error
          }

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('database.updateError') + ': ' + errMsg
          })
        }
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('verifyMessage.dataNotNull')
      })
    }
  } else {
    if (newOption.value.trim()) {
      cmds[newOption.value] = []

      option.value = newOption.value
      preCmdsStore.option = option.value
      preCmdsStore.preCmds = cmds

      closeGroupDialog()
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('verifyMessage.dataNotNull')
      })
    }
  }
}

const submitCmd = () => {
  if (isEdit.value) {
    if (newCmd.label.trim()) {
      window.precmds.editPreCmd(JSON.stringify({
        old: {
          group: option.value,
          label: selectedItem.label
        },
        new: {
          group: option.value,
          label: newCmd.label,
          text: newCmd.text,
          mark: newCmd.mark,
        }
      })).then((res) => {
        if (res.success) {
          for (let i=0; i<cmds[option.value].length; i++) {
            if (cmds[option.value][i].label === selectedItem.label) {
              cmds[option.value][i].label = newCmd.label
              cmds[option.value][i].text = newCmd.text
              cmds[option.value][i].mark = newCmd.mark
              break
            }
          }

          console.log(cmds[option.value])
          preCmdsStore.preCmds = cmds

          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('database.updateSuccess')
          })

          closeCmdDialog()
        } else {
          let errMsg = ''
          if (res.error instanceof Error) {
            errMsg = JSON.stringify(res.error)
          } else {
            errMsg = res.error
          }

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('database.updateError') + ': ' + errMsg
          })
        }
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('verifyMessage.dataNotNull')
      })
    }
  } else {
    if (newCmd.label.trim()) {
      window.precmds.addPreCmd(JSON.stringify({
        group: option.value,
        label: newCmd.label,
        text: newCmd.text,
        mark: newCmd.mark,
      })).then((res) => {
        if (res.success) {
          cmds[option.value].push(deepClone(newCmd))
          preCmdsStore.preCmds = cmds

          $q.notify({
            type: 'positive',
            position: clientConfig.quasar.notify.position,
            message: t('database.addSuccess')
          })
          closeCmdDialog()
        } else {
          let errMsg = ''
          if (res.error instanceof Error) {
            errMsg = JSON.stringify(res.error)
          } else {
            errMsg = res.error
          }

          $q.notify({
            type: 'negative',
            position: clientConfig.quasar.notify.position,
            message: t('database.accessFail') + ': ' + errMsg
          })
        }
      })
    } else {
      $q.notify({
        type: 'negative',
        position: clientConfig.quasar.notify.position,
        message: t('verifyMessage.dataNotNull')
      })
    }
  }
}

const showSettingsDialog = ref(false)
const settingDialogTitle = ref(t('settings'))
const isSudo = ref(false)
const isSendNow = ref(false)

const onShowSettingsDialog = () => {
  showSettingsDialog.value = !showSettingsDialog.value
}

const onClickCMD = (cmd) => {
  if (command.value === null) {
    command.value = ''
  }

  if (isSendNow.value) {
    if (isSudo.value) {
      props.send("sudo " + cmd["text"] + "\n");
    } else {
      props.send(cmd["text"] + "\n");
    }
  } else {
    command.value = (command.value + cmd["text"]);
  }
}

// 按 Enter 键发送命令
const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // 在这里添加你的逻辑，比如发送命令或处理输入 Shift + Enter 被按下！
      return
    } else {
      // 阻止默认行为（如换行）
      event.preventDefault()
      // const command = event.target.value
      handleSendCommand()
    }
  }
}

// 处理发送命令（这里可以添加实际的发送逻辑）
const handleSendCommand = () => {
  if (command.value.trim()) {
    // 这里可以添加实际的 API 调用或逻辑来发送命令
    if (isSudo.value) {
      props.send("sudo " + command.value + "\n")
    } else {
      props.send(command.value + "\n")
    }
    command.value = '' // 清空输入框
  }
}

onMounted(() => {
  if (preCmdsStore.isSync === "0") {
    preCmdsStore.cleanPreCmds()
    getPreCmds()
  } else {
    if (Object.keys(preCmdsStore.preCmds).length > 0) {
      for (const key of Object.keys(preCmdsStore.preCmds)) {

        cmds[key] = preCmdsStore.preCmds[key]
      }
    } else {
      getPreCmds()
    }
  }
  preCmdsStore.isSync = "1"

  option.value = preCmdsStore.option
  isSudo.value = preCmdsStore.isSudo
  isSendNow.value = preCmdsStore.isSendNow
})

watch(option, (newVal, oldVal) => {
  preCmdsStore.option = newVal
})

watch(isSudo, (newVal, oldVal) => {
  preCmdsStore.isSudo = newVal
})

watch(isSendNow, (newVal, oldVal) => {
  preCmdsStore.isSendNow = newVal
})

</script>

<style scoped>
.cmd-textarea :deep(.q-field__control) {
  //max-height: 100px;
  overflow-y: auto; /* 确保内容超出时显示滚动条 */
}

.square-btn {
  width: 40px; /* 设置固定宽度 */
  height: 40px; /* 设置固定高度 */
  min-width: 40px; /* 防止按钮被内容撑开 */
  padding: 0; /* 移除默认内边距 */
  border-radius: 0; /* 移除圆角，保持正方形 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.cmd-btn {
  /* 强制单行、不换行 */
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;

  /* 文字最多显示多少个字符 → 通过 max-width 间接控制 */
  /* 假设中文字体 ≈ 14px 一个字，180px ≈ 10~12 个中文字 */
  max-width: 180px;           /* ← 核心：控制显示长度 */

  /* 固定高度（和你原来写的一样） */
  height: 36px !important;
  min-height: 36px !important;
  max-height: 36px !important;

  /* 可选：让文字稍微居中、好看一点 */
  padding: 0 8px !important;
  font-size: 13px !important;   /* 根据需求可调 12px~14px */
  line-height: 1.35 !important; /* 避免文字被裁切 */
}

</style>
