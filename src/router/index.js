import { createRouter, createWebHistory } from 'vue-router'
import bossSelect from '@/component/bossSelect.vue'
import StartPage from '@/component/startPage.vue'
import mainGamePage from '@/component/mainGamePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
            { path: '/', name: 'start', component: StartPage },
            { path: '/bossSelect', name: 'select', component: bossSelect },
            { path: '/boss/:bossId', name: 'mainGame', component: mainGamePage,props: true  }
          ],
})

export default router
