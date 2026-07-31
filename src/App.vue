<script setup>
import { ref } from 'vue'

// 현재 내 위치 기반 날씨 데이터 제공
const mylocateweather = [
  { id: 'my_city', name: '성남', temp: 31, status: '흐림', humid: 76, pop: 10, ws: 2 },
]

// API 연동 현재 날씨 표기
const citylist = ref([
  { id: 'city_01', name: '서울', temp: 32, status: '맑음', humid: 82, pop: 0, ws: 4 },
  { id: 'city_02', name: '화성', temp: 25, status: '비', humid: 91, pop: 80, ws: 6 },
  { id: 'city_03', name: '광주', temp: 29, status: '맑음', humid: 64, pop: 0, ws: 3 },
  { id: 'city_04', name: '부산', temp: 27, status: '흐림', humid: 77, pop: 20, ws: 4 },
])

// 검색어 및 알림창 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('탭을 클릭하거나 검색')

// 알림 대행 함수
const showDetail = (cityName, temp, status, humid, pop, ws) => {
  window.alert(
    `${cityName}의 현재 날씨는 [섭씨${temp}]°C,[${status}],습도 [${humid}]%, 강수 확률[${pop}]%, 풍속[${ws}]m/s 입니다.`,
  )
}
</script>

<template>
  // 도시 검색
  <div class="search_container">
    <section class="search-bar">
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="도시명 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="myweather">
      <h3>현재 나의 도시 날씨 현황</h3>
      <div
        v-for="mywe in mylocateweather"
        :key="mywe.id"
        class="myweather-box"
        @click="CityInfo = `${mywe.name}이 선택되었습니다.`"
      >
        <h4>{{ mywe.name }}</h4>
        <p>현재기온:{{ mywe.temp }}°C</p>

        <span v-if="mywe.temp >= 25" class="hotline">더움 (25°C 이상)</span>
        <span v-else class="cool line">시원(25°C 미만) </span>
        // 수정 할 것
        <button class="btn-detail" @click.stop="showDetail(mywe.name, mywe.status)">
          상세보기
        </button>
      </div>
    </section>

    <section class="2x2list">
      <div
        v-for="we in citylist"
        :key="we.id"
        class="weather-box"
        @click="CityInfo = `${we.name}이 선택되었습니다.`"
      >
        <h4>{{ we.name }}</h4>
        <p>현재기온:{{ we.temp }}°C</p>

        <span v-if="we.temp >= 25" class="hotline">더움 (25°C 이상)</span>
        <span v-else class="cool line">시원(25°C 미만) </span>
        // 수정 할 것
        <button class="btn-detail" @click.stop="showDetail(we.name, we.status)">상세보기</button>
      </div>
    </section>

    // 수정 할 것
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
