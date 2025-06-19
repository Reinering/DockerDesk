<template>
  <q-scroll-area  class="q-pa-md" :style="scrollStyle">
    <div class="q-gutter-x-sm row items-center justify-between">
      <q-field
        dense
        standout
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{firstUpper(service.serviceType) + t('panel.create.title')}}</div>
        </template>
      </q-field>
      <q-space />
      <q-btn color="red" :label="t('panel.create.clear')" @click="onClearContainer"/>
      <q-btn color="blue" :label="t('panel.create.create')" @click="onCreateContainer"/>
    </div>

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

<!--        CMD-->
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">CMD</q-item-section>

          <q-item-section
            top
            side
          >
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.runtime.cmd"
              :label="t('panel.create.cmd')"
              style="width: 300px"
            />
          </q-item-section>
        </q-item>

<!--        entrypoint-->
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">Entrypoint</q-item-section>

          <q-item-section
            top
            side
          >
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.runtime.entrypoint"
              :label="t('panel.create.entrypoint')"
              style="width: 300px"
            />
          </q-item-section>
        </q-item>

      </q-expansion-item>
    </div>

<!--    runtime-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.runtime')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
<!--        -d / --it-->
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>

          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.runtime.runtimePolicy"
            :options="runtimes"
            filled
            dense
            borderless
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
              </q-item>
            </template>
          </q-select>
        </q-item>

<!--        --restart=always-->
        <q-item class="bg-grey-2" dense>
          <q-item-section class="text-body2">{{ t('panel.create.restartPolicy') }}</q-item-section>

          <q-item-section
            v-if="composition.runtime.restartPolicy.policy === 'on-failure'"
            top
            side
          >
            <q-input
              class="text-body1"
              outlined
              dense
              type="number"
              v-model="composition.runtime.restartPolicy.maxRetries"
              :label="t('panel.create.maxRetries')"
              style="width: 120px"
            />
          </q-item-section>

          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.runtime.restartPolicy.policy"
            :options="restartPolicies"
            filled
            dense
            borderless
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
              </q-item>
            </template>
          </q-select>
        </q-item>

<!--        --runtime nvidia-->
        <q-item class="bg-grey-2" dense v-if="configStore.userMode === 'professional'">
          <q-item-section class="text-body2">{{ t('panel.create.runtime') }}</q-item-section>

          <q-item-section
            top
            side
          >
            <q-input
              class="text-body1"
              outlined
              dense
              type="number"
              v-model="composition.runtime.runtime"
              :label="t('panel.create.runtime1')"
              style="width: 200px"
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

<!--    environment-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.environment')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>
          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.environments.envMode"
            :options="envModes"
            filled
            dense
            borderless
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
              </q-item>
            </template>
          </q-select>

          <q-item-section
            v-if="composition.environments.envMode === 'manual'"
            side
          >
            <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddNewEnv">
              <q-tooltip class="bg-amber text-black shadow-4">
                {{ t('panel.create.new') }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item
          v-if="composition.environments.envMode === 'file' && configStore.userMode === 'professional'"
          dense
          class="bg-grey-2"
        >
          <q-item-section class="text-body2">{{ t('panel.create.envFile') }}</q-item-section>

          <q-input
            filled
            dense
            bottom-slots
            input-class="text-right"
            v-model="composition.environments.envFile"
            :label="t('panel.create.envFileLabel')"
            style="min-width: 300px"
          >
            <template v-slot:append>
              <q-icon
                v-if="composition.environments.envFile !== ''"
                name="close"
                @click="composition.environments.envFile = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="add_circle_outline" @click="onSelectEnvFile" />
            </template>
          </q-input>
        </q-item>

        <q-list
          v-if="composition.environments.envMode === 'manual'"
        >
          <q-item
            v-for="(item, index) in composition.environments.evns"
            :key="index"
            dense
            class="bg-grey-2"
          >
            <q-item-section class="text-body2">{{ t('panel.create.envKeyValue') }}</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.key"
                :label="t('panel.create.envKey')"
                style="width: 150px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.value"
                :label="t('panel.create.envValue')"
                style="width: 200px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteENV(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>


      </q-expansion-item>
    </div>

<!--    volumes-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.volumes')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

<!--        mapping-->
        <q-list>
          <q-item class="bg-grey-2" dense >
            <q-item-section class="text-body2">{{ t('panel.create.volumeMapping') }}</q-item-section>

            <q-item-section side>
              <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddVolumeMapping">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{ t('panel.create.new') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item
            v-for="(item, index) in composition.volumes.mappings"
            :key="index"
            dense
            class="bg-grey-2"
          >
            <q-item-section class="text-body2">{{ t('panel.create.volumeMapping1') }}</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.host"
                :label="t('panel.create.hostVolume')"
                style="width: 150px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.container"
                :label="t('panel.create.containerVolume')"
                style="width: 200px"
              />
            </q-item-section>

            <q-select
              class="bg-grey-3"
              color="blue"
              bg-color="cyan-14"
              v-model="item.fileMode"
              :options="volumeFileModes"
              filled
              dense
              borderless
              emit-value
              transition-show="flip-up"
              transition-hide="flip-down"
              style="min-width: 70px"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.desc }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteVolumeMapping(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

<!--        mount-->
        <q-list v-if="configStore.userMode === 'professional'" >
          <q-item class="bg-grey-2" dense >
            <q-item-section class="text-body2">{{ t('panel.create.mount') }}</q-item-section>

            <q-item-section side>
              <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddMount">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{ t('panel.create.new') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item
            v-for="(item, index) in composition.volumes.mounts"
            :key="index"
            dense
            class="bg-grey-2"
          >
            <q-item-section class="text-body2">{{ t('panel.create.volumeMapping1') }}</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.host"
                :label="t('panel.create.hostVolume')"
                style="width: 150px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.container"
                :label="t('panel.create.containerVolume')"
                style="width: 200px"
              />
            </q-item-section>

            <q-select
              class="bg-grey-3"
              color="blue"
              bg-color="cyan-14"
              v-model="item.mountMode"
              :options="mountModes"
              filled
              dense
              borderless
              emit-value
              transition-show="flip-up"
              transition-hide="flip-down"
              style="min-width: 70px"
            />

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteMount(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

<!--        tmpfs-->
        <q-list v-if="configStore.userMode === 'professional'" >
          <q-item class="bg-grey-2" dense >
            <q-item-section class="text-body2">{{ t('panel.create.temporary') }}</q-item-section>

            <q-item-section side>
              <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddTmpfs">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{ t('panel.create.new') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item
            v-for="(item, index) in composition.volumes.tmpfs"
            :key="index"
            dense
            class="bg-grey-2"
          >
            <q-item-section class="text-body2">tmpfs</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="composition.volumes.tmpfs[index]"
                :label="t('panel.create.containerVolume')"
                style="width: 200px"
              />
            </q-item-section>


            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteTmpfs(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

<!--        workdir-->
        <q-item class="bg-grey-2" dense v-if="configStore.userMode === 'professional'" >
          <q-item-section class="text-body2">{{ t('panel.create.workDir') }}</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              clearable
              outlined
              dense
              input-class="text-right"
              v-model="composition.volumes.workDir"
              :label="t('panel.create.workDir1')"
              style="width: 300px"
            />
          </q-item-section>
        </q-item>

      </q-expansion-item>
    </div>

<!--    networks-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.networks')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

<!--        --network -->
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.mode') }}</q-item-section>

          <q-select
            class="bg-grey-3"
            color="blue"
            bg-color="cyan-14"
            v-model="composition.networks.network"
            :options="networks"
            filled
            dense
            borderless
            emit-value
            transition-show="flip-up"
            transition-hide="flip-down"
            style="min-width: 200px"
          />

          <q-item-section top side>
            <div class="row">
              <q-btn dense flat icon="add" color="blue" @click="onToNetworks">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('add')}}
                </q-tooltip>
              </q-btn>
              <q-btn dense flat icon="refresh" color="purple" @click="onRefreshNetwork">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('refresh')}}
                </q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>

<!--        static IP-->
        <q-item
          v-if="composition.networks.network !== ''"
          class="bg-grey-2"
          dense
        >
          <q-item-section class="text-body2">{{ t('panel.create.staticIP1') }}</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.networks.staticIP"
              :label="t('panel.create.staticIP')"
              hint="#.#.#.#"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>

<!--        DNS-->
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">DNS</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.networks.dns"
              label="DNSs"
              hint="#.#.#.#,#.#.#.#"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>

<!--        hostname-->
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.containerHostname1') }}</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.networks.hostname"
              :label="t('panel.create.containerHostname')"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>

<!--        container host-->
        <q-list v-if="configStore.userMode === 'professional'" >
          <q-item class="bg-grey-2" dense >
            <q-item-section class="text-body2">{{ t('panel.create.containerHost') }}</q-item-section>

            <q-item-section side>
              <q-btn icon="add_circle_outline" size="xs" padding="xs" color="blue" @click.stop="onAddHostMapping">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{ t('panel.create.new') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item
            v-for="(item, index) in composition.networks.host"
            :key="index"
            class="bg-grey-2"
            dense
          >
            <q-item-section class="text-body2">{{ t('panel.create.containerHostMapping') }}</q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                input-class="text-right"
                v-model="item.hostname"
                :label="t('panel.create.hostname')"
                style="width: 150px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-input
                class="text-body1"
                outlined
                dense
                v-model="item.ip"
                label="IP"
                hint="#.#.#.#"
                style="width: 200px"
              />
            </q-item-section>

            <q-item-section top side>
              <q-btn dense flat icon="delete" color="red" @click="onDeleteHostMapping(index)">
                <q-tooltip class="bg-amber text-black shadow-4">
                  {{t('delete')}}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

        </q-list>

<!--        mac-address-->
        <q-item class="bg-grey-2" dense v-if="configStore.userMode === 'professional'">
          <q-item-section class="text-body2">MAC Address</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              outlined
              dense
              v-model="composition.networks.mac"
              :label="t('panel.create.macAddress')"
              hint="##:##:##:##:##:##"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>

      </q-expansion-item>
    </div>

<!--    security-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.security')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >

<!--        privileged-->
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.privileged') }}</q-item-section>

          <q-item-section avatar>
            <q-checkbox
              v-model="composition.security.privileged"
              val="orange"
              color="orange"
              :label="t('panel.create.enable')"
            />
          </q-item-section>
        </q-item>

<!--        user/uuid-->
        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.user') }}</q-item-section>

          <q-item-section top side>
            <q-input
              class="text-body1"
              outlined
              dense
              input-class="text-right"
              v-model="composition.security.user"
              :label="t('panel.create.user1')"
              style="width: 200px"
            />
          </q-item-section>
        </q-item>

      </q-expansion-item>
    </div>

<!--    Logging and Monitoring-->
    <div class="q-pa-md">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.loggingAndMonitoring')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >


        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.loggingAndMonitoring') }}</q-item-section>


        </q-item>


        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.loggingAndMonitoring') }}</q-item-section>


        </q-item>
      </q-expansion-item>
    </div>

<!--    resources-->
    <div class="q-pa-md" v-if="configStore.userMode === 'professional'">
      <q-expansion-item
        expand-separator
        flat
        bordered
        :label="t('panel.create.resources')"
        header-class="text-grey-6 text-body1 bg-grey-2"
      >


        <q-item class="bg-grey-2" dense >
          <q-item-section class="text-body2">{{ t('panel.create.user') }}</q-item-section>


        </q-item>

      </q-expansion-item>
    </div>

  </q-scroll-area>
</template>

<script setup>

import { inject, onMounted, onUnmounted, reactive, ref, watch, onActivated, onDeactivated } from 'vue'
import { useConfigStore } from 'stores/config.js'
import { useComponentsStore } from 'stores/components.js'
import { firstUpper, isEmptyObj, isEmptyStr, firstLower } from 'src/utils/common.js'
import { parseDockerNetwork } from 'src/utils/wsl.js'
import { clientConfig } from 'src/common/config.js'

const $q = inject("$q")
const router = inject("router")
const route = inject("route")
const t = inject("t")

const configStore = useConfigStore()
const componentsStore = useComponentsStore()

const service = inject("service")
const serviceCmd = ref('')

const scrollStyle = reactive({
  height: process.env.MODE === 'electron' ? window.innerHeight - 150 + "px" : window.innerHeight - 149 - 20 + "px",
})

const image = ref('nginx:latest')

const runtimes = [
  { label: t('panel.create.bgRun'), value: 'bg', desc: 'bg' },
  { label: t('panel.create.itRun'), value: 'it', desc: 'it' },
  { label: t('panel.create.rmRun'), value: 'rm', desc: 'rm' },
]

const portModes = [
  { label: t('panel.create.randomMapping'), value: 'random', desc: 'Random' },
  { label: t('panel.create.manualMapping'), value: 'manual', desc: 'Manual' },
  { label: t('panel.create.exposeContainer'), value: 'expose', desc: 'Expose' },
]

const portMapProtocols = [
  { label: 'TCP', value: 'tcp', desc: 'TCP' },
  { label: 'UDP', value: 'udp', desc: 'UDP' },
]

const envModes = [
  { label: t('panel.create.envFileMode'), value: 'file', desc: 'File' },
  { label: t('panel.create.envManualMode'), value: 'manual', desc: 'Manual' },
]

const volumeFileModes = [
  { label: t('panel.create.rw'), value: 'rw', desc: 'RW' },
  { label: t('panel.create.ro'), value: 'ro', desc: 'RO' },
]

const mountModes = [
  { label: "bind", value: 'bind', desc: 'bind' },
  { label: "volume", value: 'volume', desc: 'volume' },
  { label: "tmpfs", value: 'tmpfs', desc: 'tmpfs' },
]

const restartPolicies = [
  { label: t('panel.create.no'), value: 'no', desc: 'no' },
  { label: t('panel.create.always'), value: 'always', desc: 'always' },
  { label: t('panel.create.onFailure'), value: 'on-failure', desc: 'on-failure' },
  { label: t('panel.create.unlessStopped'), value: 'unless-stopped', desc: 'unless-stopped' },
]

const networks = reactive([])

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

const envDefault = {
  key: '',
  value: ''
}

const portMappingDefault = {
  host: null,
  container: null,
  protocol: 'tcp'
}

const portExposeDefault = {
  container: null,
  protocol: 'tcp'
}

const volumeMappingDefault = {
  host: null,
  container: null,
  fileMode: 'rw'
}

const mountDefault = {
  host: null,
  container: null,
  mountMode: 'bind'
}

const hostDefault = {
  hostname: '',
  ip: ''
}

const defaultComposition = {
  image: '',
  containerName: '',
  runtime: {
    cmd: '',
    entrypoint: '',
    runtimePolicy: "bg",
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
  networks:{
    network: '',
    staticIP: '',
    dns: '',
    host: [],
    mac: ''
  },
  security: {
    privileged: false,
    user: ''
  }
}

const onAddNewPort = () => {
  if (composition.value.ports.portMode.indexOf("manual") > -1) {
    composition.value.ports.mapping.push(JSON.parse(JSON.stringify(portMappingDefault)))
  }

  if (composition.value.ports.portMode.indexOf("expose") > -1) {
    composition.value.ports.expose.push(JSON.parse(JSON.stringify(portExposeDefault)))
  }
}

const onDeletePortMapping = (index) => {
  composition.value.ports.mapping.splice(index, 1)
}

const onDeletePortExpose = (index) => {
  composition.value.ports.expose.splice(index, 1)
}

const onAddNewEnv = () => {
  composition.value.environments.evns.push(JSON.parse(JSON.stringify(envDefault)))
}

const onSelectEnvFile = async () => {
  const files = await window.myWindowAPI.selectFiles()
  try {
    if (files.length === 0) {
      return
    }
  } catch (err) {
    return
  }

  composition.value.environments.envFile = files[0]
}

const onDeleteENV = (index) => {
  composition.value.environments.evns.splice(index, 1)
}

const onAddVolumeMapping = () => {
  composition.value.volumes.mappings.push(JSON.parse(JSON.stringify(volumeMappingDefault)))
}

const onDeleteVolumeMapping = (index) => {
  composition.value.volumes.mappings.splice(index, 1)
}

const onAddMount = () => {
  composition.value.volumes.mounts.push(JSON.parse(JSON.stringify(mountDefault)))
}

const onDeleteMount = (index) => {
  composition.value.volumes.mounts.splice(index, 1)
}

const onAddTmpfs = () => {
  composition.value.volumes.tmpfs.push('')
}

const onDeleteTmpfs = (index) => {
  composition.value.volumes.tmpfs.splice(index, 1)
}

const onRefreshNetwork = () => {
  getNetworkList()
}

const onToNetworks = () => {
  router.push({path: "networks", query: {tab: 'networks'}})

}

const onAddHostMapping = () => {
  composition.value.networks.host.push(JSON.parse(JSON.stringify(hostDefault)))
}

const onDeleteHostMapping = (index) => {
  composition.value.networks.host.splice(index, 1)
}

const onClearContainer = () => {
  composition.value = JSON.parse(JSON.stringify(defaultComposition))
}


const generateCmd = () => {
  const command = [serviceCmd.value, 'run']

  if (composition.value.containerName !== '') {
    command.push(...['--name', composition.value.containerName])
  }

  // runtime
  if (composition.value.runtime.runtimePolicy === 'bg') {
    command.push('-d')
  } else if (composition.value.runtime.runtimePolicy === 'it') {
    command.push('-it')
  } else if (composition.value.runtime.runtimePolicy === 'rm') {
    command.push('--rm')
  }

  if (composition.value.runtime.restartPolicy.policy === 'no') {
    command.push('--restart no')
  } else if (composition.value.runtime.restartPolicy.policy === 'always') {
    command.push('--restart always')
  } else if (composition.value.runtime.restartPolicy.policy === 'on-failure') {
    if (!isEmptyObj(composition.value.runtime.restartPolicy .maxRetries) && composition.value.runtime.restartPolicy .maxRetries > 0) {
      command.push(`--restart on-failure:${composition.value.runtime.restartPolicy .maxRetries}`)
    } else {
      command.push('--restart on-failure:')
    }
  } else if (composition.value.runtime.restartPolicy.policy === 'unless-stopped') {
    command.push('--restart=unless-stopped')
  }

  // env
  if (composition.value.environments.envMode === 'file' && !isEmptyStr(composition.value.environments.envFile)) {
    command.push(`--env-file /mnt/${firstLower(composition.value.environments.envFile).replace(':', '').replace(/\\/g, '/')}`)
  } else if (composition.value.environments.envMode === 'manual') {
    for (const item of composition.value.environments.evns) {
      if (!isEmptyStr(item.key) && !isEmptyStr(item.value)) {
        command.push(`-e ${item.key}=${item.value}`)
      }
    }
  }

  // ports
  if (composition.value.ports.portMode.indexOf("random") > -1) {
    command.push("--publish-all")
  } else {
    if (composition.value.ports.portMode.indexOf("manual") > -1) {
      for (const item of composition.value.ports.mapping) {
        if (!isEmptyStr(item.host) && !isEmptyStr(item.container)) {
          command.push(`--publish ${item.host}:${item.container}/${item.protocol}`)
        }
      }
    }

    if (composition.value.ports.portMode.indexOf("expose") > -1) {
      for (const item of composition.value.ports.expose) {
        if (!isEmptyStr(item.container)) {
          command.push(`--expose ${item.container}/${item.protocol}`)
        }
      }
    }
  }

  // volumes
  if (composition.value.volumes.mappings.length > 0) {
    for (const item of composition.value.volumes.mappings) {
      if (!isEmptyStr(item.host) && !isEmptyStr(item.container)) {
        command.push(`--volume ${item.host}:${item.container}:${item.fileMode}`)
      }
    }
  }

  if (composition.value.volumes.mounts.length > 0) {
    for (const item of composition.value.volumes.mounts) {
      if (!isEmptyStr(item.host) && !isEmptyStr(item.container)) {
        command.push(`--mount type=${item.mountMode},source=${item.host},destination=${item.container}`)
      }
    }
  }

  if (composition.value.volumes.tmpfs.length > 0) {
    for (const item of composition.value.volumes.tmpfs) {
      if (!isEmptyStr(item)) {
        command.push(`--tmpfs ${item}`)
      }
    }
  }

  if (!isEmptyStr(composition.value.volumes.workDir)) {
    command.push(`-w ${composition.value.volumes.workDir}`)
  }

  // network
  if (!isEmptyStr(composition.value.networks.network)) {
    command.push(`--network ${composition.value.networks.network}`)
  }

  if (!isEmptyStr(composition.value.networks.dns)) {
    for(const item of composition.value.networks.dns.split(',')) {
      if (!isEmptyStr(item.trim())) {
        command.push(`--dns ${item.trim()}`)
      }
    }
  }

  if (!isEmptyStr(composition.value.networks.hostname)) {
    command.push(`--hostname ${composition.value.networks.hostname}`)
  }

  if (!isEmptyStr(composition.value.networks.staticIP)) {
    command.push(`--ip ${composition.value.networks.staticIP}`)
  }

  if (!isEmptyStr(composition.value.networks.mac)) {
    command.push(`--mac-address ${composition.value.networks.mac}`)
  }

  if (composition.value.networks.host.length > 0) {
    for(const item of composition.value.networks.host) {
      if (!isEmptyStr(item.hostname.trim()) && !isEmptyStr(item.ip.trim())) {
        command.push(`--add-host ${item.hostname.trim()}:${item.ip.trim()}`)
      }
    }
  }

  // security
  if (!isEmptyObj(composition.value.security.privileged) && composition.value.security.privileged) {
    command.push("--privileged")
  }

  // user
  if (!isEmptyStr(composition.value.security.user)) {
    command.push(`--user ${composition.value.security.user}`)
  }

  // entrypoint
  if (!isEmptyStr(composition.value.runtime.entrypoint)) {
    command.push(`--entrypoint ${composition.value.image}`)
  }

  // image
  if (!isEmptyStr(composition.value.image)) {
    command.push(composition.value.image)
  }

  // cmd
  if (!isEmptyStr(composition.value.runtime.cmd)) {
    command.push(composition.value.runtime.cmd)
  }

  return command
}

const onCreateContainer = () => {
  if (isEmptyStr(composition.value.image)) {
    return $q.notify({
      type: 'negative',
      position: clientConfig.quasar.notify.position,
      message: `${t('panel.create.paramsError')}: image`,
    })
  }

  const command = `bash -c "${generateCmd().join(' ')}"`
  console.log(command)

  router.push({
    path: 'logs',
    query: {
      tab: "logs",
      data: JSON.stringify({
        label: "DockerDesk",
        icon: 'terminal',
        data: {
          serviceName: "DockerDesk",
          serviceType: 'WSL',
          user: 'root',
          disableStdin: true,
          command
        }
      })
    }
  })

  setTimeout(() => {
    componentsStore.refreshContainers()
  }, 10000)
}

const getNetworkList = async () => {
  await window.wslTerminal
    .execWSL(['-d', 'DockerDesk', '--user', 'root', '-e', `${serviceCmd.value} network ls`])
    .then((result) => {
      if (result.success) {
        $q.notify({
          type: 'positive',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworksSuccess')}`,
        })

        networks.length = 0
        const data = parseDockerNetwork(result.data)

        data.forEach(item => {
          networks.push(`${item.name} - ${item.network_id}`)
        })
      } else {
        $q.notify({
          type: 'negative',
          position: clientConfig.quasar.notify.position,
          message: `${t('panel.networks.getNetworksError')}: ${result.error}`,
        })
      }
    })
}

const routeParam = () => {
  try {
    const data = JSON.parse(route.query.data)
    if (data) {
      let name = data.repository
      if (data.repository === "<none>") {
        name = data.imageId
      } else if (data.tag !== "<none>") {
        name += `:${data.tag}`
      }

      composition.value = JSON.parse(JSON.stringify(defaultComposition))
      composition.value.image = name
    }
  } catch (e) {
    // console.error(e)
  }
}

const init = () => {
  composition.value = JSON.parse(JSON.stringify(defaultComposition))

}

const checkScreenSize = () => {
  if (process.env.MODE === 'electron') {
    scrollStyle.height = window.innerHeight - 150 + "px"
  } else {
    scrollStyle.height = window.innerHeight - 149 - 20 + "px"
  }
}

onMounted(() => {
  serviceCmd.value = service.serviceType
  if (isEmptyObj(serviceCmd.value)) {
    return
  }

  init()

  window.addEventListener('resize', checkScreenSize)
})

onActivated(() => {
  routeParam()
})

onDeactivated(() => {

})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

watch(() =>composition.value.ports.portMode, (newVal, oldVal) => {
  // if (composition.value.ports.portMode.indexOf("random") > -1) {
  //   composition.value.ports.portMode = ["random"]
  // }

})

</script>

<style scoped>

</style>
