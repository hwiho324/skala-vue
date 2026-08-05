import { createRouter, createWebHashHistory } from 'vue-router'
import weatherHome from '../views/weather-home.vue'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: weatherHome,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

// github pages 서브 경로 배포, createWebHistory 대신 해시 라우팅 사용
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
