import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('../pages/Timeline.vue'),
  },
  {
    path: '/note/:slug',
    name: 'note',
    component: () => import('../pages/ArticleView.vue'),
  },
  {
    path: '/docs/:category/:slug',
    redirect: (to) => ({ path: `/note/${to.params.slug}` }),
  },
  {
    path: '/docs/:category?',
    name: 'docs',
    component: () => import('../pages/DocsPage.vue'),
  },
  {
    path: '/about',
    redirect: '/404',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
  },
]

export default routes
