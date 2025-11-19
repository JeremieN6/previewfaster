import { createRouter, createWebHistory } from 'vue-router'

const LandingPage = () => import('../pages/LandingPage.vue')
const BuilderPage = () => import('../pages/BuilderPage.vue')

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
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
