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

  {
    path: '/terminal',
    component: () => import('layouts/TerminalLayout.vue')

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
