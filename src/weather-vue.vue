<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 현재 내 위치 기반 날씨 데이터 제공
const mylocateweather = [
  { id: 'my_city', name: '성남', temp: 31, status: '흐림', humid: 76, pop: 10, ws: 2 },
]

// API 연동 현재 날씨 표기
const citylist = ref([
  { id: 'city_01', name: '서울', temp: 32, status: '맑음', humid: 82, pop: 0, ws: 4 },
  { id: 'city_02', name: '화성', temp: 24, status: '비', humid: 91, pop: 80, ws: 6 },
  { id: 'city_03', name: '광주', temp: 29, status: '맑음', humid: 64, pop: 0, ws: 3 },
  { id: 'city_04', name: '부산', temp: 27, status: '흐림', humid: 77, pop: 20, ws: 4 },
])

// 검색어 및 알림창 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 실시간 검색 필터링
const filteredcities = computed(() => {
  // 검색어 공백 제거
  const query = searchQuery.value.trim()
  if (!query) {
    return citylist.value
  }
  // 검색어가 포함된 도시만 필터링
  return citylist.value.filter((city) => city.name.includes(query))
})

watch(searchQuery, (newQuery) => {
  console.log(`검색어가 업데이트되었습니다: '${newQuery}'`)
})

// watchEffect를 사용한 자동 의존성 API 로그 시뮬, 타이핑 시 변하는 searchQuery를 자동 감지하여 filteredcities를 콘솔에 출력
watchEffect(() => {
  console.log(`검색어: '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// 알림 대행 함수
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
    <section class="search-bar">
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="도시명 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
      </p>
    </section>

    <section class="myweather">
      <h3>현재 나의 도시 현황</h3>
      <div
        v-for="mywe in mylocateweather"
        :key="mywe.id"
        class="myweather-box"
        @click="selectedCityInfo = `${mywe.name}이 선택되었습니다.`"
      >
        <h4>{{ mywe.name }}</h4>
        <p>현재기온: {{ mywe.temp }}°C</p>

        <span v-if="mywe.temp >= 25" class="hotline">더움 (25°C 이상)</span>
        <span v-else class="cool line">시원 (25°C 미만) </span>
        <!--수정-->
        <button
          class="we-detail"
          @click.stop="showDetail(mywe.name, mywe.temp, mywe.status, mywe.humid, mywe.pop, mywe.ws)"
        >
          상세 보기
        </button>
      </div>
    </section>

    <section class="regionallist">
      <div
        v-for="we in filteredcities"
        :key="we.id"
        class="weather-box"
        @click="selectedCityInfo = `${we.name}이 선택되었습니다.`"
      >
        <h4>{{ we.name }}</h4>
        <p>현재기온: {{ we.temp }}°C</p>

        <span v-if="we.temp >= 25" class="hotline">더움 (25°C 이상)</span>
        <span v-else class="cool line">시원 (25°C 미만) </span>
        <!--수정-->
        <button
          class="we-detail"
          @click.stop="showDetail(we.name, we.temp, we.status, we.humid, we.pop, we.ws)"
        >
          상세 보기
        </button>
      </div>
      <p v-if="filteredcities.length === 0" style="text-align: center" padding="10px 0">
        검색 결과에 해당하는 도시가 없습니다.
      </p>
    </section>

    <!--수정 할 것-->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
