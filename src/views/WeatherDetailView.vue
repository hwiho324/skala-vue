<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'

const weatherStore = useWeatherStore()

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 홈 -> 상세보기
// 상세 주소 직접 접속: 해당 도시 한개만 API 요청
// 상세 페이지 새로 고침: 해당 도시 한 개만 요청
const cityData = computed(() => {
  return (
    weatherStore.cityList.find((city) => city.id === route.params.city) ??
    weatherStore.myLocateWeather.find((city) => city.id === route.params.city) ??
    null
  )
})

onMounted(() => {
  weatherStore.fetchWeatherById(route.params.city)
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="search_container">
    <h3>도시 상세 정보</h3>
    <hr />

    <div v-if="cityData?.hasError">
      <h4>도시: {{ cityData.name }}</h4>
      <p>{{ cityData.errorMessage }}</p>
    </div>

    <div v-else-if="cityData" class="city-info">
      <h4>도시: {{ cityData.name }}</h4>
      <p>온도: {{ displayTemp }}°{{ configStore.unit === 'fahrenheit' ? 'F' : 'C' }}</p>
      <p>날씨 상태: {{ cityData.status }}</p>
      <p>습도: {{ cityData.humid }}%</p>
      <p>풍속: {{ cityData.ws }} m/s</p>
    </div>
    <div v-else>
      <p>도시 정보를 불러오는 중입니다...</p>
    </div>

    <button @click="router.push('/')" class="back-button">메인으로 돌아가기</button>
  </div>
</template>
