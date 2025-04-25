const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'dockerNodes',
        name: 'dockerNodes',
        component: () => import('pages/DockerNodes.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/Settings.vue'),
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
