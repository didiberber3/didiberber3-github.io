import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../pages/Notes.vue'),
  },
  {
    path: '/note/:slug',
    name: 'note',
    component: () => import('../pages/ArticleView.vue'),
  },
  {
    path: '/docs/:category/:slug',
    name: 'docs-article',
    component: () => import('../pages/ArticleView.vue'),
  },
  {
    path: '/docs/:category?',
    name: 'docs',
    component: () => import('../pages/DocsPage.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/About.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
  },
]

export default routes
