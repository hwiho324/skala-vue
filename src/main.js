import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 공통 색상 & 글라스 기반
import './assets/styles/weather-app.css'

// 카드 공통 스타일
import './assets/styles/weather-card.css'

// 상세 모달 스타일
import './assets/styles/weather-detail-modal.css'

// 검색창과 자동완성 스타일
import './assets/styles/weather-search.css'

// 즐겨찾기 패널 스타일
import './assets/styles/weather-favorite.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
