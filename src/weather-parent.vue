<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
// 컴포넌트 임포트
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 현재 내 위치 기반 날씨 데이터 제공
const myLocateWeather = [
  { id: 'my_city', name: '성남', temp: 31, status: '흐림', humid: 76, pop: 10, ws: 2 },
]

// API 연동 현재 날씨 표기
// 북쪽에서 남쪽, 각 행에서는 서쪽 도시 우선
// 고정 2열 안에서 국내 도시의 상대 위치 자연스럽게
const cityList = ref([
  { id: 'city_01', name: '서울', temp: 32, status: '맑음', humid: 82, pop: 0, ws: 4 },
  { id: 'city_02', name: '화성', temp: 24, status: '비', humid: 91, pop: 80, ws: 6 },
  { id: 'city_03', name: '광주', temp: 29, status: '맑음', humid: 64, pop: 0, ws: 3 },
  { id: 'city_04', name: '부산', temp: 27, status: '흐림', humid: 77, pop: 20, ws: 4 },
])

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

watch(searchQuery, (newQuery) => {
  console.log(`검색어가 업데이트되었습니다: '${newQuery}'`)
})

// watchEffect를 사용한 자동 의존성 API 로그 시뮬, 타이핑 시 변하는 searchQuery를 자동 감지하여 filteredCities를 콘솔에 출력
watchEffect(() => {
  console.log(`검색어: '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// WeatherCard가 보내는 기존 여섯 인자
const showDetail = (cityName, temp, status, humid, pop, ws) => {
  window.alert(
    `${cityName}의 현재 날씨는
섭씨 ${temp}°C, ${status}, 습도 ${humid}%, 강수 확률 ${pop}%, 풍속 ${ws}m/s 입니다.`,
  )
}
</script>

<template>
  <!-- 도시 검색 -->
  <div class="search_container">
    <header class="page-header">
      <p>SKY WEATHER</p>
      <h1>전국 날씨</h1>
      <span>주요 도시의 현재 하늘을 확인</span>
    </header>

    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        @update-query="(newQuery) => (searchQuery = newQuery)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>현재 나의 도시 현황</h3>
      <div class="my-weather-grid">
        <WeatherCard
          v-for="myWea in myLocateWeather"
          :key="myWea.id"
          :city-wea="myWea"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        />
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="section-heading">
        <h3>지역별 날씨 현황</h3>
        <span>{{ filteredCities.length }}개 도시</span>
      </div>

      <div class="weather-gird">
        <WeatherCard
          v-for="wea in filteredCities"
          :key="wea.id"
          :city-wea="wea"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        />
      </div>

      <p v-if="filteredCities.length === 0" class="no-results">
        검색 결과에 해당하는 도시가 없습니다.
      </p>
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
  padding: 50px;
}
</style>
