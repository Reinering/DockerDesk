<template>
  <q-dialog persistent>
    <q-card style="min-width: 90%">
      <q-card-section>
        <q-item-label class="text-h6">{{t('store.defaultInstall')}}</q-item-label>
      </q-card-section>

      <q-separator />

      <q-scroll-area :style="scrollStyle">
        <!--    image-->
        <div class="q-pa-md">
          <q-item class="bg-grey-2" dense clickable v-ripple>
            <q-item-section class="text-grey-6 text-body1">{{ t('panel.create.image') }}</q-item-section>
            <q-input
              class="text-body1"
              filled
              dense
              readonly
              input-class="text-right"
              v-model="composition.image"
            />
          </q-item>
        </div>

        <!--    basic-->
        <div class="q-pa-md">
          <q-expansion-item
            expand-separator
            flat
            bordered
            :label="t('panel.create.basic')"
            header-class="text-grey-6 text-body1 bg-grey-2"
          >
            <!--        --name-->
            <q-item class="bg-grey-2" dense>
              <q-item-section class="text-body2">{{ t('panel.create.containerName') }}</q-item-section>

              <q-item-section
                top
                side
              >
                <q-input
                  class="text-body1"
                  outlined
                  clearable
                  dense
                  input-class="text-right"
                  v-model="composition.containerName"
                  :label="t('panel.create.nameLabel')"
                />
              </q-item-section>

            </q-item>
          </q-expansion-item>
        </div>

        <!--    ports-->
        <div class="q-pa-md">
          <q-expansion-item
            expand-separator
            flat
            bordered
            :label="t('panel.create.ports')"
            header-class="text-grey-6 text-body1 bg-grey-2"
          >

            <q-item class="bg-grey-2" dense>
              <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>

              <q-select
                class="bg-grey-3"
                color="blue"
                bg-color="cyan-14"
                v-model="composition.ports.portMode"
                :options="portModes"
                filled
                dense
                borderless
                multiple
                emit-value
                transition-show="flip-up"
                transition-hide="flip-down"
                style="min-width: 150px"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle :model-value="scope.selected" @update:model-value="scope.toggleOption(scope.opt)" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-item-section
                v-if="composition.ports.portMode.indexOf('manual') > -1 || composition.ports.portMode.indexOf('expose') > -1"
                side
              >
                <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddNewPort">
                  <q-tooltip class="bg-amber text-black shadow-4">
                    {{ t('panel.create.new') }}
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-list
              v-if="composition.ports.portMode.indexOf('manual') > -1"
            >
              <q-item
                v-for="(item, index) in composition.ports.mapping"
                :key="index"
                class="bg-grey-2"
                dense
              >
                <q-item-section dense class="text-body2" >{{ t('panel.create.portMapping') }}</q-item-section>

                <q-item-section
                  top
                  side
                >
                  <q-input
                    class="text-body1"
                    outlined
                    dense
                    v-model="item.host"
                    :label="t('panel.create.hostPort')"
                    type="number"
                    style="width: 150px"
                    :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => (val > 0 && val <= 65535) || t('verifyMessage.portRange')
                ]"
                  />
                </q-item-section>

                <q-item-section top side>
                  <q-input
                    class="text-body1"
                    outlined
                    dense
                    v-model="item.container"
                    :label="t('panel.create.containerPort')"
                    type="number"
                    style="width: 150px"
                    :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => (val > 0 && val <= 65535) || t('verifyMessage.portRange')
                ]"
                  />
                </q-item-section>

                <q-item-section top side>
                  <q-select
                    class="bg-grey-3"
                    color="blue"
                    bg-color="cyan-14"
                    v-model="item.protocol"
                    :options="portMapProtocols"
                    filled
                    dense
                    borderless
                    emit-value
                    style="width: 80px"
                  >
                  </q-select>
                </q-item-section>

                <q-item-section top side>
                  <q-btn dense flat icon="delete" color="red" @click="onDeletePortMapping(index)">
                    <q-tooltip class="bg-amber text-black shadow-4">
                      {{t('delete')}}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

            <q-list
              v-if="composition.ports.portMode.indexOf('expose') > -1"
            >
              <q-item
                v-for="(item, index) in composition.ports.expose"
                :key="index"
                class="bg-grey-2"
                dense
              >
                <q-item-section dense class="text-body2" >{{ t('panel.create.exposeContainer') }}</q-item-section>

                <q-item-section top side>
                  <q-input
                    class="text-body1"
                    outlined
                    dense
                    v-model="item.container"
                    :label="t('panel.create.containerPort')"
                    type="number"
                    style="width: 150px"
                    :rules="[
                  val => !!val || t('verifyMessage.dataNotNull'),
                  val => (val > 0 && val <= 65535) || t('verifyMessage.portRange')
                ]"
                  />
                </q-item-section>

                <q-item-section top side>
                  <q-select
                    class="bg-grey-3"
                    color="blue"
                    bg-color="cyan-14"
                    v-model="item.protocol"
                    :options="portMapProtocols"
                    filled
                    dense
                    borderless
                    emit-value
                    style="width: 80px"
                  >
                  </q-select>
                </q-item-section>

                <q-item-section top side>
                  <q-btn dense flat icon="delete" color="red" @click="onDeletePortExpose(index)">
                    <q-tooltip class="bg-amber text-black shadow-4">
                      {{t('delete')}}
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

          </q-expansion-item>
        </div>

<!--        &lt;!&ndash;    environment&ndash;&gt;-->
<!--        <div class="q-pa-md">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.environment')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>-->
<!--              <q-select-->
<!--                class="bg-grey-3"-->
<!--                color="blue"-->
<!--                bg-color="cyan-14"-->
<!--                v-model="composition.environments.envMode"-->
<!--                :options="envModes"-->
<!--                filled-->
<!--                dense-->
<!--                borderless-->
<!--                emit-value-->
<!--                transition-show="flip-up"-->
<!--                transition-hide="flip-down"-->
<!--                style="min-width: 150px"-->
<!--              >-->
<!--                <template v-slot:option="scope">-->
<!--                  <q-item v-bind="scope.itemProps">-->
<!--                    <q-item-section>-->
<!--                      <q-item-label>{{ scope.opt.label }}</q-item-label>-->
<!--                      <q-item-label caption>{{ scope.opt.desc }}</q-item-label>-->
<!--                    </q-item-section>-->
<!--                  </q-item>-->
<!--                </template>-->
<!--              </q-select>-->

<!--              <q-item-section-->
<!--                v-if="composition.environments.envMode === 'manual'"-->
<!--                side-->
<!--              >-->
<!--                <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddNewEnv">-->
<!--                  <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                    {{ t('panel.create.new') }}-->
<!--                  </q-tooltip>-->
<!--                </q-btn>-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            <q-item-->
<!--              v-if="composition.environments.envMode === 'file' && configStore.userMode === 'professional'"-->
<!--              dense-->
<!--              class="bg-grey-2"-->
<!--            >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.envFile') }}</q-item-section>-->

<!--              <q-input-->
<!--                filled-->
<!--                dense-->
<!--                bottom-slots-->
<!--                input-class="text-right"-->
<!--                v-model="composition.environments.envFile"-->
<!--                :label="t('panel.create.envFileLabel')"-->
<!--                style="min-width: 300px"-->
<!--              >-->
<!--                <template v-slot:append>-->
<!--                  <q-icon-->
<!--                    v-if="composition.environments.envFile !== ''"-->
<!--                    name="close"-->
<!--                    @click="composition.environments.envFile = ''"-->
<!--                    class="cursor-pointer"-->
<!--                  />-->
<!--                </template>-->

<!--                <template v-slot:after>-->
<!--                  <q-btn round dense flat icon="add_circle_outline" @click="onSelectEnvFile" />-->
<!--                </template>-->
<!--              </q-input>-->
<!--            </q-item>-->

<!--            <q-list-->
<!--              v-if="composition.environments.envMode === 'manual'"-->
<!--            >-->
<!--              <q-item-->
<!--                v-for="(item, index) in composition.environments.evns"-->
<!--                :key="index"-->
<!--                dense-->
<!--                class="bg-grey-2"-->
<!--              >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.envKeyValue') }}</q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.key"-->
<!--                    :label="t('panel.create.envKey')"-->
<!--                    style="width: 150px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.value"-->
<!--                    :label="t('panel.create.envValue')"-->
<!--                    style="width: 200px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-btn dense flat icon="delete" color="red" @click="onDeleteENV(index)">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('delete')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->


<!--          </q-expansion-item>-->
<!--        </div>-->

<!--        &lt;!&ndash;    volumes&ndash;&gt;-->
<!--        <div class="q-pa-md">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.volumes')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->

<!--            &lt;!&ndash;        mapping&ndash;&gt;-->
<!--            <q-list>-->
<!--              <q-item class="bg-grey-2" dense >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.volumeMapping') }}</q-item-section>-->

<!--                <q-item-section side>-->
<!--                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddVolumeMapping">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{ t('panel.create.new') }}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

<!--              <q-item-->
<!--                v-for="(item, index) in composition.volumes.mappings"-->
<!--                :key="index"-->
<!--                dense-->
<!--                class="bg-grey-2"-->
<!--              >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.volumeMapping1') }}</q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.host"-->
<!--                    :label="t('panel.create.hostVolume')"-->
<!--                    style="width: 150px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.container"-->
<!--                    :label="t('panel.create.containerVolume')"-->
<!--                    style="width: 200px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-select-->
<!--                  class="bg-grey-3"-->
<!--                  color="blue"-->
<!--                  bg-color="cyan-14"-->
<!--                  v-model="item.fileMode"-->
<!--                  :options="volumeFileModes"-->
<!--                  filled-->
<!--                  dense-->
<!--                  borderless-->
<!--                  emit-value-->
<!--                  transition-show="flip-up"-->
<!--                  transition-hide="flip-down"-->
<!--                  style="min-width: 70px"-->
<!--                >-->
<!--                  <template v-slot:option="scope">-->
<!--                    <q-item v-bind="scope.itemProps">-->
<!--                      <q-item-section>-->
<!--                        <q-item-label>{{ scope.opt.label }}</q-item-label>-->
<!--                        <q-item-label caption>{{ scope.opt.desc }}</q-item-label>-->
<!--                      </q-item-section>-->
<!--                    </q-item>-->
<!--                  </template>-->
<!--                </q-select>-->

<!--                <q-item-section top side>-->
<!--                  <q-btn dense flat icon="delete" color="red" @click="onDeleteVolumeMapping(index)">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('delete')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->

<!--            &lt;!&ndash;        mount&ndash;&gt;-->
<!--            <q-list v-if="configStore.userMode === 'professional'" >-->
<!--              <q-item class="bg-grey-2" dense >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.mount') }}</q-item-section>-->

<!--                <q-item-section side>-->
<!--                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddMount">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{ t('panel.create.new') }}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

<!--              <q-item-->
<!--                v-for="(item, index) in composition.volumes.mounts"-->
<!--                :key="index"-->
<!--                dense-->
<!--                class="bg-grey-2"-->
<!--              >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.volumeMapping1') }}</q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.host"-->
<!--                    :label="t('panel.create.hostVolume')"-->
<!--                    style="width: 150px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.container"-->
<!--                    :label="t('panel.create.containerVolume')"-->
<!--                    style="width: 200px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-select-->
<!--                  class="bg-grey-3"-->
<!--                  color="blue"-->
<!--                  bg-color="cyan-14"-->
<!--                  v-model="item.mountMode"-->
<!--                  :options="mountModes"-->
<!--                  filled-->
<!--                  dense-->
<!--                  borderless-->
<!--                  emit-value-->
<!--                  transition-show="flip-up"-->
<!--                  transition-hide="flip-down"-->
<!--                  style="min-width: 70px"-->
<!--                />-->

<!--                <q-item-section top side>-->
<!--                  <q-btn dense flat icon="delete" color="red" @click="onDeleteMount(index)">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('delete')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->

<!--            &lt;!&ndash;        tmpfs&ndash;&gt;-->
<!--            <q-list v-if="configStore.userMode === 'professional'" >-->
<!--              <q-item class="bg-grey-2" dense >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.temporary') }}</q-item-section>-->

<!--                <q-item-section side>-->
<!--                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddTmpfs">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{ t('panel.create.new') }}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

<!--              <q-item-->
<!--                v-for="(item, index) in composition.volumes.tmpfs"-->
<!--                :key="index"-->
<!--                dense-->
<!--                class="bg-grey-2"-->
<!--              >-->
<!--                <q-item-section class="text-body2">tmpfs</q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="composition.volumes.tmpfs[index]"-->
<!--                    :label="t('panel.create.containerVolume')"-->
<!--                    style="width: 200px"-->
<!--                  />-->
<!--                </q-item-section>-->


<!--                <q-item-section top side>-->
<!--                  <q-btn dense flat icon="delete" color="red" @click="onDeleteTmpfs(index)">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('delete')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->

<!--            &lt;!&ndash;        workdir&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense v-if="configStore.userMode === 'professional'" >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.workDir') }}</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  clearable-->
<!--                  outlined-->
<!--                  dense-->
<!--                  input-class="text-right"-->
<!--                  v-model="composition.volumes.workDir"-->
<!--                  :label="t('panel.create.workDir1')"-->
<!--                  style="width: 300px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--          </q-expansion-item>-->
<!--        </div>-->

<!--        &lt;!&ndash;    networks&ndash;&gt;-->
<!--        <div class="q-pa-md">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.networks')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->

<!--            &lt;!&ndash;        &#45;&#45;network &ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>-->

<!--              <q-select-->
<!--                class="bg-grey-3"-->
<!--                color="blue"-->
<!--                bg-color="cyan-14"-->
<!--                v-model="composition.networks.network"-->
<!--                :options="networks"-->
<!--                filled-->
<!--                dense-->
<!--                borderless-->
<!--                emit-value-->
<!--                transition-show="flip-up"-->
<!--                transition-hide="flip-down"-->
<!--                style="min-width: 200px"-->
<!--              >-->
<!--                <template v-slot:option="scope">-->
<!--                  <q-item v-bind="scope.itemProps">-->
<!--                    <q-item-section>-->
<!--                      <q-item-label>{{ scope.opt.label }}</q-item-label>-->
<!--                      <q-item-label caption>{{ scope.opt.desc }}</q-item-label>-->
<!--                    </q-item-section>-->
<!--                  </q-item>-->
<!--                </template>-->
<!--              </q-select>-->

<!--              <q-item-section top side>-->
<!--                <div class="row">-->
<!--                  <q-btn dense flat icon="add" color="blue" @click="onToNetworks">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('add')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                  <q-btn dense flat icon="refresh" color="purple" @click="onRefreshNetwork">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('refresh')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </div>-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            &lt;!&ndash;        static IP&ndash;&gt;-->
<!--            <q-item-->
<!--              v-if="composition.networks.network !== ''"-->
<!--              class="bg-grey-2"-->
<!--              dense-->
<!--            >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.staticIP1') }}</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  outlined-->
<!--                  dense-->
<!--                  input-class="text-right"-->
<!--                  v-model="composition.networks.staticIP"-->
<!--                  :label="t('panel.create.staticIP')"-->
<!--                  hint="#.#.#.#"-->
<!--                  style="width: 200px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            &lt;!&ndash;        DNS&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">DNS</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  outlined-->
<!--                  dense-->
<!--                  input-class="text-right"-->
<!--                  v-model="composition.networks.dns"-->
<!--                  label="DNSs"-->
<!--                  hint="#.#.#.#,#.#.#.#"-->
<!--                  style="width: 200px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            &lt;!&ndash;        hostname&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.containerHostname1') }}</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  outlined-->
<!--                  dense-->
<!--                  input-class="text-right"-->
<!--                  v-model="composition.networks.hostname"-->
<!--                  :label="t('panel.create.containerHostname')"-->
<!--                  style="width: 200px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            &lt;!&ndash;        container host&ndash;&gt;-->
<!--            <q-list v-if="configStore.userMode === 'professional'" >-->
<!--              <q-item class="bg-grey-2" dense >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.containerHost') }}</q-item-section>-->

<!--                <q-item-section side>-->
<!--                  <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddHostMapping">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{ t('panel.create.new') }}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

<!--              <q-item-->
<!--                v-for="(item, index) in composition.networks.host"-->
<!--                :key="index"-->
<!--                class="bg-grey-2"-->
<!--                dense-->
<!--              >-->
<!--                <q-item-section class="text-body2">{{ t('panel.create.containerHostMapping') }}</q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    input-class="text-right"-->
<!--                    v-model="item.hostname"-->
<!--                    :label="t('panel.create.hostname')"-->
<!--                    style="width: 150px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-input-->
<!--                    class="text-body1"-->
<!--                    outlined-->
<!--                    dense-->
<!--                    v-model="item.ip"-->
<!--                    label="IP"-->
<!--                    hint="#.#.#.#"-->
<!--                    style="width: 200px"-->
<!--                  />-->
<!--                </q-item-section>-->

<!--                <q-item-section top side>-->
<!--                  <q-btn dense flat icon="delete" color="red" @click="onDeleteHostMapping(index)">-->
<!--                    <q-tooltip class="bg-amber text-black shadow-4">-->
<!--                      {{t('delete')}}-->
<!--                    </q-tooltip>-->
<!--                  </q-btn>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

<!--            </q-list>-->

<!--            &lt;!&ndash;        mac-address&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense v-if="configStore.userMode === 'professional'">-->
<!--              <q-item-section class="text-body2">MAC Address</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  outlined-->
<!--                  dense-->
<!--                  v-model="composition.networks.mac"-->
<!--                  :label="t('panel.create.macAddress')"-->
<!--                  hint="##:##:##:##:##:##"-->
<!--                  style="width: 200px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--          </q-expansion-item>-->
<!--        </div>-->

<!--        &lt;!&ndash;    security&ndash;&gt;-->
<!--        <div class="q-pa-md">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.security')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->

<!--            &lt;!&ndash;        privileged&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.privileged') }}</q-item-section>-->

<!--              <q-item-section avatar>-->
<!--                <q-checkbox-->
<!--                  v-model="composition.security.privileged"-->
<!--                  val="orange"-->
<!--                  color="orange"-->
<!--                  :label="t('panel.create.enable')"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--            &lt;!&ndash;        user/uuid&ndash;&gt;-->
<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.user') }}</q-item-section>-->

<!--              <q-item-section top side>-->
<!--                <q-input-->
<!--                  class="text-body1"-->
<!--                  outlined-->
<!--                  dense-->
<!--                  input-class="text-right"-->
<!--                  v-model="composition.security.user"-->
<!--                  :label="t('panel.create.user1')"-->
<!--                  style="width: 200px"-->
<!--                />-->
<!--              </q-item-section>-->
<!--            </q-item>-->

<!--          </q-expansion-item>-->
<!--        </div>-->

<!--        &lt;!&ndash;    Logging and Monitoring&ndash;&gt;-->
<!--        <div class="q-pa-md">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.loggingAndMonitoring')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->


<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.loggingAndMonitoring') }}</q-item-section>-->


<!--            </q-item>-->


<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.loggingAndMonitoring') }}</q-item-section>-->


<!--            </q-item>-->
<!--          </q-expansion-item>-->
<!--        </div>-->

<!--        &lt;!&ndash;    resources&ndash;&gt;-->
<!--        <div class="q-pa-md" v-if="configStore.userMode === 'professional'">-->
<!--          <q-expansion-item-->
<!--            expand-separator-->
<!--            flat-->
<!--            bordered-->
<!--            :label="t('panel.create.resources')"-->
<!--            header-class="text-grey-6 text-body1 bg-grey-2"-->
<!--          >-->


<!--            <q-item class="bg-grey-2" dense >-->
<!--              <q-item-section class="text-body2">{{ t('panel.create.user') }}</q-item-section>-->


<!--            </q-item>-->

<!--          </q-expansion-item>-->
<!--        </div>-->


      </q-scroll-area>

      <q-card-actions align="right">
        <q-btn :label="t('cancel')" class="q-mt-md"  color="negative" @click="onClose" />
        <q-btn :disable="isOK" :label="t('ok')" class="q-mt-md" type="submit" color="blue" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      storeApis: []
    })
  },

  onUpdate: {
    type: Function,
    default: () => {}
  },

  onClose: {
    type: Function,
    default: () => {}
  }
})

import { inject, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useConfigStore } from 'stores/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const configStore = useConfigStore()

const composition = ref({
  image: '',

  // basic
  containerName: '',

  //
  runtime: {
    cmd: '',
    entrypoint: '',
    runtimePolicy: "",
    restartPolicy: {
      policy: '',
      maxRetries: null
    },
    runtime: '',
  },

  ports: {
    portMode: [],
    mapping: [],
    expose: [],
  },

  environments: {
    envMode: '',
    envFile: '',
    evns: []
  },

  volumes: {
    mappings: [],
    mounts: [],
    tmpfs: [],
    workDir: ''
  },

  networks: {
    network: '',
    staticIP: '',
    dns: '',
    hostname: '',
    host: [],
    mac: ''
  },

  security: {
    privileged: null,
    user: ''
  }


})

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 - 23 + "px" : window.innerHeight - 149 - 43 + "px",
})





const init = () => {

}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    scrollStyle.height = window.innerHeight - 150 - 23 + "px"
  } else {
    scrollStyle.height = window.innerHeight - 149 - 43 + "px"
  }
}

onMounted(() => {
  init()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})


</script>

<style scoped>

</style>
