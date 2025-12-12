import { createRouter, createWebHistory } from 'vue-router'
import bossSelect from '@/component/bossSelect.vue'
import StartPage from '@/component/startPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
            { path: '/', name: 'start', component: StartPage },
            { path: '/bossSelect', name: 'select', component: bossSelect }
          ],
})

export default router
