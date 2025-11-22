import { createRouter, createWebHistory } from 'vue-router'

const LandingPage = () => import('../pages/LandingPage.vue')
const BuilderPage = () => import('../pages/Builder.vue')
const BuilderManualPage = () => import('../pages/BuilderManual.vue')
const BuilderCatalogPage = () => import('../pages/BuilderCatalog.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/builder',
      name: 'builder',
      component: BuilderPage
    },
    {
      path: '/builder-manual',
      name: 'builder-manual',
      component: BuilderManualPage
    },
    {
      path: '/templates',
      name: 'builder-catalog',
      component: BuilderCatalogPage
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
