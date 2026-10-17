import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/note/:slug',
    name: 'note',
    component: () => import('../pages/ArticleView.vue'),
  },
  // 旧链接：分类 / 标签 / 归档页面已合并进首页筛选，统一重定向
  {
    path: '/archive',
    redirect: '/',
  },
  {
    path: '/timeline',
    redirect: '/',
  },
  {
    path: '/docs',
    redirect: '/',
  },
  {
    path: '/docs/:category/:slug',
    redirect: (to) => ({ path: `/note/${to.params.slug}` }),
  },
  {
    path: '/docs/:category',
    redirect: (to) => ({ path: '/', query: { category: String(to.params.category) } }),
  },
  {
    path: '/tags',
    redirect: '/',
  },
  {
    path: '/tags/:tag',
    redirect: (to) => ({ path: '/', query: { tag: String(to.params.tag) } }),
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
