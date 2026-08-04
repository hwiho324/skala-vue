<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '../stores/weatherStore.js'

// 컴포넌트 임포트
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

// 현재 내 위치 기반 날씨 데이터 제공
// API 데이터 받아와 채워줄 반응형 배열&로딩 상태
const myLocateWeather = ref([])
const weatherStore = useWeatherStore()

const { cityList, isLoading, errorMessage } = storeToRefs(weatherStore)

const { fetchRealTimeWeather } = weatherStore

onMounted(() => {
  if (typeof route.query.search === 'string') {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

// 검색어 및 알림창 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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

const DetailJump = (id) => {
  router.push({ name: 'WeatherCity', params: { city: id } })
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
      <span>주요 도시의 현재 하늘을 확인</span>
    </header>

    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="SearchUpdate" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>현재 나의 도시 현황</h3>
      <div class="my-weather-grid">
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
        <h3>지역별 날씨 현황 (실시간 기상청 연동)</h3>
        <span>{{ filteredCities.length }}개 도시</span>
      </div>

      <div class="weather-gird">
        <p v-if="isLoading" class="loading-text">실시간 기상 데이터를 수신 중입니다...</p>

        <p v-else-if="errorMessage" class="error-text">API 호출이 실패했습니다.</p>

        <template v-else>
          <weatherCard
            v-for="wea in filteredCities"
            :key="wea.id"
            :city-wea="wea"
            @select-card="(msg) => (selectedCityInfo = msg)"
            @click-detail="DetailJump(wea.id)"
          />
          <p v-if="filteredCities.length === 0" class="no-results">
            검색 결과에 해당하는 도시가 없습니다.
          </p>
        </template>
      </div>
    </BaseDashboardCard>

    <div class="status-bar" aria-live="polite" aria-atomic="true">
      <span aria-hidden="true">●</span>
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.search_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px;
}
</style>
