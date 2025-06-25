const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          keepAlive: true,
        }
      },

      { path: 'assistant',
        name: 'assistant',
        component: () => import('layouts/AssistantLayout.vue'),
        children: [
          { path: '',
            component: () => import('pages/Assistant.vue'),
            meta: {
              keepAlive: true,
            }
          },
          { path: 'asslocal',
            name: 'asslocal',
            component: () => import('pages/AssLocal.vue'),
            meta: {
              keepAlive: true,
            }
          },
          { path: 'assremote',
            name: 'assremote',
            component: () => import('pages/AssRemote.vue'),
            meta: {
              keepAlive: true,
            }
          },
        ],
        meta: {
          keepAlive: true,
        }
      },

      {
        path: 'node',
        name: 'node',
        component: () => import('layouts/NodeLayout.vue'),
        children: [
          { path: 'create',
            name: 'create',
            component: () => import('pages/node/CreatePage.vue'),
          },
          { path: 'containers',
            name: 'containers',
            component: () => import('pages/node/ContainersPage.vue'),
          },
          { path: 'images',
            name: 'images',
            component: () => import('pages/node/ImagesPage.vue'),
          },
          { path: 'volumes',
            name: 'volumes',
            component: () => import('pages/node/VolumesPage.vue'),
          },
          { path: 'networks',
            name: 'networks',
            component: () => import('pages/node/NetworksPage.vue'),
          },
          { path: 'logs',
            name: 'logs',
            component: () => import('pages/node/LogsPage.vue'),
          },
          { path: 'dockerSettings',
            name: 'dockerSettings',
            component: () => import('pages/node/DockerSettings.vue'),
          },
          { path: 'podmanSettings',
            name: 'podmanSettings',
            component: () => import('pages/node/PodmanSettings.vue'),
          },
        ],
      },

      {
        path: 'wsl',
        name: 'wsl',
        component: () => import('pages/WSL.vue'),
        meta: {
          keepAlive: true,
        }
      },

      {
        path: 'nodes',
        name: 'nodes',
        component: () => import('pages/Nodes.vue'),
        meta: {
          keepAlive: true,
        }
      },

      {
        path: 'nodesMg',
        name: 'nodesMg',
        children: [
          {
            path: 'panel',
            name: 'panel',
            component: () => import('pages/NodePanels.vue'),
            children: [
              {
                path: '',
                name: '',
                component: () => import('layouts/PanelLayout.vue'),
                children: [
                  { path: 'create',
                    name: 'create1',
                    component: () => import('pages/panel/CreatePage.vue'),
                  },
                  { path: 'containers',
                    name: 'containers1',
                    component: () => import('pages/panel/ContainersPage.vue'),
                  },
                  { path: 'images',
                    name: 'images1',
                    component: () => import('pages/panel/ImagesPage.vue'),
                  },
                  { path: 'volumes',
                    name: 'volumes1',
                    component: () => import('pages/panel/VolumesPage.vue'),
                  },
                  { path: 'networks',
                    name: 'networks1',
                    component: () => import('pages/panel/NetworksPage.vue'),
                  },
                  { path: 'logs',
                    name: 'logs1',
                    component: () => import('pages/panel/LogsPage.vue'),
                  },
                  { path: 'dockerSettings',
                    name: 'dockerSettings1',
                    component: () => import('pages/panel/DockerSettings.vue'),
                  },
                  { path: 'podmanSettings',
                    name: 'podmanSettings1',
                    component: () => import('pages/panel/PodmanSettings.vue'),
                  },
                ],
              }
            ],
            meta: {
              keepAlive: true,
            }
          },
          {
            path: 'terminal',
            name: 'terminal',
            component: () => import('pages/Terminals.vue'),
            meta: {
              keepAlive: true,
            }
          },
        ]
      },

      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/Settings.vue'),
        meta: {
          keepAlive: true,
        }
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
