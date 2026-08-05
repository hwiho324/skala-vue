import { createRouter, createWebHashHistory } from 'vue-router'
import weatherHome from '../views/weather-home.vue'

// 상세보기에 사용할 수 있는 도시 ID
const validWeatherCityIds = new Set([
  'my_city',
  'city_01',
  'city_02',
  'city_03',
  'city_04',
  'city_05',
  'city_06',
  'city_07',
  'city_08',
  'city_09',
  'city_10',
  'city_11',
  'city_12',
  'city_13',
  'city_14',
  'city_15',
  'city_16',
  'city_17',
])

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: weatherHome,
  },

  {
    path: '/weather/:city',
    name: 'WeatherCity',
    component: weatherHome,
  },

  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },

  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,

  // 라우터 이동 시 스크롤 위치 관리
  scrollBehavior(to, from, savedPosition) {
    // 브라우저 뒤로가기와 앞으로가기
    if (savedPosition) {
      return savedPosition
    }

    // 홈 ↔ 상세 모달 이동에서는 현재 스크롤 유지
    const isDetailModalNavigation =
      (to.name === 'WeatherCity' && from.name === 'WeatherHome') ||
      (to.name === 'WeatherHome' && from.name === 'WeatherCity')

    if (isDetailModalNavigation) {
      return false
    }

    // 서비스 소개 등 일반 페이지 이동은 맨 위로
    return {
      top: 0,
      left: 0,
    }
  },
})

router.beforeEach((to) => {
  if (to.name !== 'WeatherCity') {
    return true
  }

  const cityId = to.params.city

  if (typeof cityId === 'string' && validWeatherCityIds.has(cityId)) {
    return true
  }

  return {
    name: 'NotFound',
    query: {
      invalidCity: typeof cityId === 'string' ? cityId : '',
    },
  }
})

export default router
