<template>
  <q-card>
<!--    // menu-->
    <q-menu context-menu auto-close>
      <q-list>
        <q-item clickable @click="onAddButton">
          <q-item-section>
            添加Button
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="onAddButtonBar">
          <q-item-section>
            添加Button Bar
          </q-item-section>
        </q-item>
        <q-item clickable @click="onEditButtonBar">
          <q-item-section>
            编辑Button Bar
          </q-item-section>
        </q-item>
        <q-item clickable @click="onDelButtonBar">
          <q-item-section>
            删除Button Bar
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <div class="row no-wrap q-pa-md q-gutter-sm no-padding">
      <q-select
        filled
        dense
        v-model="option"
        :options="Object.keys(cmds)"
        size="sm"
        style="width: 150px;"
      />
      <q-scroll-area style="height: 50px; width: 100%;">
        <div class="row no-wrap q-gutter-sm">
<!--          size=sm-->
          <q-btn
            class="cmd-btn"
            v-for="(cmd, index) in cmds[option]"
            :key="index"
            :label="cmd.label"
            color="green"
            no-caps
            @click="onClickCMD"
            style="{width: 100px;}"
          >
            <q-tooltip>
              {{cmd.label}}
            </q-tooltip>
            <q-menu context-menu auto-close>
              <q-list>
                <q-item clickable @click="onAddButton">
                  <q-item-section>
                    添加Button
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onEditButton(cmd)">
                  <q-item-section>
                    编辑Button
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDelButton(cmd)">
                  <q-item-section>
                    删除Button
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-scroll-area>
    </div>


    <div>
      <q-input
        class="cmd-textarea"
        type="textarea"
        v-model="command"
        label="Send commands to active session, press Shift+Enter to line break"
        filled
        clearable
      />
<!--      autofocus-->
<!--      @keyup.enter="scope.set"-->
<!--      onChange={handleCommandChange}-->
<!--      onKeyDown={handleKeyDown}-->
    </div>
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
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="primary" @click="submitCmdGroup" />
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeGroupDialog" />
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
        <q-btn :label="t('ok')" class="q-mt-md" type="submit" color="primary" @click="submitCmd" />
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="closeCmdDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>

import { inject, onMounted, onActivated, reactive, ref } from 'vue'
import { usePreCmdsStore } from 'stores/precmds.js'
import { clientConfig } from 'src/common/config.js'
import { deepClone } from 'src/utils/common.js'

// const props = defineProps({
//
// })

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
    cancel: true,
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
    cancel: true,
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

const onClickCMD = () => {

}


// 处理命令输入变化
const handleCommandChange = (event) => {
  // setCommand(event.target.value)
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
  // if (command.trim()) {
  //   // 这里可以添加实际的 API 调用或逻辑来发送命令
  //   if (isSudo) {
  //     props.send("sudo " + command + "\n")
  //   } else {
  //     props.send(command + "\n")
  //   }
  //   setCommand('') // 清空输入框
  // }
}

onMounted(() => {
  if (preCmdsStore.isSync === "0") {
    preCmdsStore.cleanPreCmds()
    getPreCmds()
  } else {
    if (Object.keys(preCmdsStore.preCmds).length > 0) {
      for (let key in Object.keys(preCmdsStore.preCmds)) {
        cmds[key] = preCmdsStore.preCmds[key]
      }
    } else {
      getPreCmds()
    }
  }
  preCmdsStore.isSync = "1"
})


</script>

<style scoped>
.cmd-textarea :deep(.q-field__control) {
  max-height: 100px;
  overflow-y: auto; /* 确保内容超出时显示滚动条 */
}

</style>
