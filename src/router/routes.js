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
      },

      {
        path: 'node',
        name: 'node',
        component: () => import('layouts/NodeLayout.vue'),
        children: [
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
            path: 'dockerNode',
            name: 'dockerNode',
            component: () => import('pages/DockerNodes.vue'),
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
