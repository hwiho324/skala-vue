<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

import { useWeatherStore } from '../stores/weatherStore.js'
import { useDetailTransition } from '../composables/useDetailTransition'

// 컴포넌트 임포트
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import WeatherDetailModal from '../components/WeatherDetailModal.vue'
import FavoritePanel from '../components/FavoritePanel.vue'
import UnitToggler from '../components/UnitToggler.vue'

const router = useRouter()
const route = useRoute()

// API 데이터 받아와 채워줄 반응형 배열&로딩 상태
const weatherStore = useWeatherStore()

const { prepareDetailTransition, enterDetail, leaveDetail, afterDetailLeave } =
  useDetailTransition()

const { cityList, myLocateWeather, isLoading, errorMessage, isMyLocationLoading, myLocationError } =
  storeToRefs(weatherStore)

const { fetchRealTimeWeather, fetchMyLocationWeather } = weatherStore

onMounted(() => {
  fetchRealTimeWeather()
  fetchMyLocationWeather()
})

// 검색어 입력
const searchQuery = ref('')

watch(
  () => route.query.search,
  (newSearch) => {
    const nextQuery = typeof newSearch === 'string' ? newSearch : ''

    if (searchQuery.value !== nextQuery) {
      searchQuery.value = nextQuery
    }
  },
  {
    immediate: true,
  },
)

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedCityId = computed(() => {
  const cityId = route.params.city

  return typeof cityId === 'string' ? cityId : null
})

const selectedCity = computed(() => {
  if (!selectedCityId.value) {
    return null
  }

  return (
    cityList.value.find((city) => city.id === selectedCityId.value) ??
    myLocateWeather.value.find((city) => city.id === selectedCityId.value) ??
    null
  )
})

// URL 통한 모달 진입 확인
watch(
  selectedCity,
  (city) => {
    if (!city) {
      return
    }

    if (document.body.style.overflow !== 'hidden') {
      prepareDetailTransition(city.id)
    }
  },
  {
    immediate: true,
  },
)

// 실시간 검색 필터링
const filteredCities = computed(() => {
  // 검색어 공백 제거
  const query = searchQuery.value.trim()
  if (!query) {
    return cityList.value
  }
  // 검색어가 포함된 도시만 필터링
  return cityList.value.filter((city) => city.name.includes(query))
})

const SearchUpdate = (val) => {
  searchQuery.value = val
  router.push({ path: route.path, query: { search: val || undefined } })
}

const DetailJump = (payload) => {
  const cityId = typeof payload === 'string' ? payload : payload.id

  prepareDetailTransition(payload)

  router.push({
    name: 'WeatherCity',
    params: {
      city: cityId,
    },
    query: {
      ...route.query,
    },
  })
}
//  #/weather/city_01?search=서울
//  → 모달 닫기
//  #/?search=서울
const closeDetail = () => {
  router.replace({
    name: 'WeatherHome',
    query: {
      ...route.query,
    },
  })
}

watch(searchQuery, (newQuery) => {
  console.log(`검색어가 업데이트되었습니다: '${newQuery}'`)
})

// watchEffect를 사용한 자동 의존성 API 로그 시뮬, 타이핑 시 변하는 searchQuery를 자동 감지하여 filteredCities를 콘솔에 출력
watchEffect(() => {
  console.log(`검색어: '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})
</script>

<template>
  <!-- 도시 검색 -->
  <div class="search_container">
    <header class="page-header">
      <p>SKY WEATHER</p>
      <h1>오늘의 날씨</h1>
      <span>주요 도시의 현재 하늘을 확인하세요</span>
    </header>

    <div class="search-toolbar">
      <SearchBar
        :current-query="searchQuery"
        :suggestions="filteredCities"
        @update-query="SearchUpdate"
      />

      <div class="search-toolbar__right">
        <div class="status-bar" aria-live="polite" aria-atomic="true">
          <span class="status-bar__dot" aria-hidden="true"></span>

          <span class="status-bar__message">
            {{ selectedCityInfo }}
          </span>
        </div>

        <UnitToggler />
      </div>
    </div>

    <div class="weather-content-layout">
      <div class="weather-content-main">
        <BaseDashboardCard>
          <h2>오늘 나의 날씨</h2>

          <p v-if="isMyLocationLoading">현재 위치 확인 중 입니다...</p>

          <p v-else-if="myLocationError" class="weather-error">
            {{ myLocationError }}
          </p>

          <div v-else class="my-weather-grid">
            <WeatherCard
              v-for="myWea in myLocateWeather"
              :key="myWea.id"
              :city-wea="myWea"
              @select-card="(msg) => (selectedCityInfo = msg)"
              @click-detail="DetailJump"
            />
          </div>
        </BaseDashboardCard>

        <BaseDashboardCard>
          <div class="section-heading">
            <h2>주요 도시</h2>
            <span>{{ filteredCities.length }}개 도시</span>
          </div>

          <div class="weather-gird">
            <div
              v-if="isLoading"
              class="weather-loading-grid"
              aria-label="실시간 기상 데이터를 불러오는 중입니다"
            >
              <div v-for="number in 4" :key="number" class="weather-loading-card glass-panel">
                <ElSkeleton animated>
                  <template #template>
                    <ElSkeletonItem variant="text" class="weather-loading-card__name" />

                    <ElSkeletonItem variant="text" class="weather-loading-card__temperature" />

                    <ElSkeletonItem variant="text" class="weather-loading-card__status" />
                  </template>
                </ElSkeleton>
              </div>
            </div>

            <template v-else>
              <p v-if="errorMessage" class="error-text">일부 도시의 날씨를 불러오지 못했습니다.</p>

              <weatherCard
                v-for="wea in filteredCities"
                :key="wea.id"
                :city-wea="wea"
                @select-card="(msg) => (selectedCityInfo = msg)"
                @click-detail="DetailJump"
              />
              <p v-if="filteredCities.length === 0" class="no-results">
                검색 결과에 해당하는 도시가 없습니다.
              </p>
            </template>
          </div>
        </BaseDashboardCard>
      </div>

      <FavoritePanel @click-detail="DetailJump" />
    </div>
  </div>

  <Teleport to="body">
    <Transition
      :css="false"
      @enter="enterDetail"
      @leave="leaveDetail"
      @after-leave="afterDetailLeave"
    >
      <div v-if="selectedCity" class="weather-detail-backdrop" @click.self="closeDetail">
        <WeatherDetailModal :city="selectedCity" @close="closeDetail" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 40px 40px;
}

.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  min-height: 52px;
  margin-bottom: 10px;
}

.search-toolbar__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  min-width: 0;
  margin-left: auto;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;

  min-height: 38px;
  max-width: 250px;
  padding: 0 12px;

  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;

  background: var(--glass-background);
  border: 1px solid var(--glass-border);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 6px 16px var(--glass-shadow);

  backdrop-filter: blur(14px) saturate(135%);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
}

.status-bar__dot {
  flex-shrink: 0;

  width: 7px;
  height: 7px;

  background: var(--accent-blue);
  border-radius: 50%;

  box-shadow: 0 0 10px var(--accent-blue);
}

.status-bar__message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-weather-grid,
.weather-gird {
  position: relative;
  z-index: 1;
}

.section-heading {
  position: relative;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  min-height: 40px;
  margin-bottom: 20px;
  padding: 14px 0 0;
}

.section-heading h2 {
  margin: 0;

  color: var(--text-primary);
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.035em;
}

.section-heading > span {
  flex-shrink: 0;
  padding: 7px 11px;

  color: var(--text-secondary);
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;

  background: var(--glass-background);
  border: 1px solid var(--glass-border);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 4px 12px var(--glass-shadow);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.weather-content-main {
  display: flex;
  flex-direction: column;
  gap: 10px;

  min-width: 0;
}

:global(html[data-theme='dark']) .section-heading > span {
  color: var(--text-secondary);
  background: rgba(174, 210, 229, 0.09);
  border-color: rgba(190, 220, 237, 0.16);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 4px 12px rgba(1, 8, 14, 0.16);
}

.page-header {
  position: relative;
  isolation: isolate;

  padding: 8px 4px 18px;
}

.page-header p {
  display: inline-flex;
  align-items: center;
  width: fit-content;

  margin: 0 0 10px;
  padding: 6px 10px;

  color: var(--accent-blue);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;

  background: var(--glass-background);
  border: 1px solid var(--glass-border);
  border-radius: 999px;

  box-shadow: inset 0 1px 0 var(--glass-highlight);
}

.page-header h1 {
  width: fit-content;
  margin: 0;

  color: var(--text-primary);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 720;
  line-height: 1.05;
  letter-spacing: -0.055em;

  background: linear-gradient(105deg, var(--text-primary) 15%, var(--accent-blue) 100%);

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header span {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 10px;

  color: var(--text-secondary);
  font-size: 0.92rem;
  font-weight: 600;
}

.page-header span::before {
  flex-shrink: 0;

  width: 7px;
  height: 7px;

  content: '';

  background: var(--accent-blue);
  border-radius: 50%;

  box-shadow: 0 0 12px var(--accent-blue);
}

.weather-loading-grid {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
}

.weather-loading-card {
  min-height: 230px;
  padding: 26px;

  border-radius: 30px;
}

.weather-loading-card :deep(.el-skeleton__item) {
  display: block;

  background: linear-gradient(
    90deg,
    var(--glass-background),
    var(--glass-background-strong),
    var(--glass-background)
  );
}

.weather-loading-card__name {
  width: 42% !important;
  height: 24px !important;
  margin-bottom: 34px;
}

.weather-loading-card__temperature {
  width: 58% !important;
  height: 56px !important;
  margin-bottom: 26px;
}

.weather-loading-card__status {
  width: 30% !important;
  height: 18px !important;
}

@media (max-width: 520px) {
  .section-heading {
    align-items: flex-start;
  }

  .section-heading h2 {
    max-width: 72%;
  }
}

@media (max-width: 620px) {
  .search_container {
    padding: 10px 10px 28px;
  }

  .page-header {
    padding-bottom: 14px;
  }

  .page-header h1 {
    font-size: 2.3rem;
  }
}

@media (max-width: 760px) {
  .search-toolbar__right {
    gap: 6px;
  }

  .status-bar {
    max-width: 145px;
    padding: 0 9px;
    font-size: 0.7rem;
  }
}

@media (max-width: 520px) {
  .status-bar {
    display: none;
  }
}

@media (max-width: 760px) {
  .search_container {
    padding-right: 10px;
    padding-left: 10px;
  }

  /* 기존 search-toolbar__right, status-bar 스타일 유지 */
}
</style>
