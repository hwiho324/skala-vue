<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const myLocateWeather = [
  { id: 'my_city', name: '성남', temp: 31, status: '흐림', humid: 76, pop: 10, ws: 2 },
]

// 북쪽에서 남쪽으로 내려오되, 각 행에서는 서쪽 도시를 먼저 두어
// 고정 2열 안에서도 국내 도시의 상대 위치가 자연스럽게 느껴지도록 구성했습니다.
const cityList = ref([
  {
    id: 'city_seoul',
    name: '서울',
    temp: 32,
    status: '맑음',
    humid: 68,
    pop: 0,
    ws: 2,
  },
  {
    id: 'city_chuncheon',
    name: '춘천',
    temp: 28,
    status: '구름 많음',
    humid: 71,
    pop: 20,
    ws: 2,
  },
  {
    id: 'city_incheon',
    name: '인천',
    temp: 29,
    status: '흐림',
    humid: 78,
    pop: 20,
    ws: 4,
  },
  {
    id: 'city_suwon',
    name: '수원',
    temp: 31,
    status: '맑음',
    humid: 65,
    pop: 0,
    ws: 2,
  },
  {
    id: 'city_cheonan',
    name: '천안',
    temp: 30,
    status: '구름 많음',
    humid: 69,
    pop: 20,
    ws: 2,
  },
  {
    id: 'city_cheongju',
    name: '청주',
    temp: 31,
    status: '맑음',
    humid: 63,
    pop: 0,
    ws: 2,
  },
  {
    id: 'city_sejong',
    name: '세종',
    temp: 30,
    status: '맑음',
    humid: 64,
    pop: 0,
    ws: 2,
  },
  {
    id: 'city_andong',
    name: '안동',
    temp: 28,
    status: '흐림',
    humid: 73,
    pop: 30,
    ws: 2,
  },
  {
    id: 'city_daejeon',
    name: '대전',
    temp: 31,
    status: '구름 많음',
    humid: 67,
    pop: 20,
    ws: 2,
  },
  {
    id: 'city_daegu',
    name: '대구',
    temp: 33,
    status: '맑음',
    humid: 59,
    pop: 0,
    ws: 3,
  },
  {
    id: 'city_jeonju',
    name: '전주',
    temp: 30,
    status: '비',
    humid: 84,
    pop: 70,
    ws: 3,
  },
  {
    id: 'city_ulsan',
    name: '울산',
    temp: 29,
    status: '구름 많음',
    humid: 76,
    pop: 20,
    ws: 4,
  },
  {
    id: 'city_gwangju',
    name: '광주',
    temp: 29,
    status: '맑음',
    humid: 64,
    pop: 0,
    ws: 3,
  },
  {
    id: 'city_changwon',
    name: '창원',
    temp: 28,
    status: '흐림',
    humid: 77,
    pop: 30,
    ws: 3,
  },
  {
    id: 'city_mokpo',
    name: '목포',
    temp: 27,
    status: '비',
    humid: 88,
    pop: 80,
    ws: 5,
  },
  {
    id: 'city_busan',
    name: '부산',
    temp: 28,
    status: '구름 많음',
    humid: 79,
    pop: 20,
    ws: 4,
  },
  {
    id: 'city_jeju',
    name: '제주',
    temp: 27,
    status: '소나기',
    humid: 86,
    pop: 70,
    ws: 5,
  },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredCities = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return cityList.value

  return cityList.value.filter((city) => city.name.includes(query))
})

watch(searchQuery, (newQuery) => {
  console.log(`검색어가 업데이트되었습니다: '${newQuery}'`)
})

watchEffect(() => {
  console.log(`검색어: '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// WeatherCard가 보내는 기존 여섯 인자를 그대로 받습니다.
const showDetail = (cityName, temp, status, humid, pop, ws) => {
  window.alert(
    `${cityName}의 현재 날씨는
섭씨 ${temp}°C, ${status}, 습도 ${humid}%, 강수 확률 ${pop}%, 풍속 ${ws}m/s 입니다.`,
  )
}
</script>

<template>
  <main class="weather-dashboard">
    <div class="weather-dashboard__glow weather-dashboard__glow--one" aria-hidden="true"></div>
    <div class="weather-dashboard__glow weather-dashboard__glow--two" aria-hidden="true"></div>

    <div class="search_container">
      <header class="page-heading">
        <p>SKY WEATHER</p>
        <h1>전국 날씨</h1>
        <span>주요 도시의 현재 하늘을 확인하세요.</span>
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

        <div class="weather-grid">
          <WeatherCard
            v-for="wea in filteredCities"
            :key="wea.id"
            :city-wea="wea"
            @select-card="(msg) => (selectedCityInfo = msg)"
            @click-detail="showDetail"
          />
        </div>

        <p v-if="filteredCities.length === 0" class="empty-message">
          검색 결과에 해당하는 도시가 없습니다.
        </p>
      </BaseDashboardCard>

      <div class="status-bar" aria-live="polite">
        <span aria-hidden="true">●</span>
        {{ selectedCityInfo }}
      </div>
    </div>
  </main>
</template>

<style scoped>
.weather-dashboard {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #d8f0ff 0%, #afdafa 42%, #e9f8ff 100%);
}

.weather-dashboard::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    radial-gradient(circle at 14% 12%, rgb(255 255 255 / 75%), transparent 21%),
    radial-gradient(circle at 83% 25%, rgb(255 255 255 / 48%), transparent 25%);
}

.weather-dashboard__glow {
  position: absolute;
  pointer-events: none;
  background: rgb(255 255 255 / 33%);
  border-radius: 50%;
  filter: blur(8px);
}

.weather-dashboard__glow--one {
  top: 320px;
  left: -120px;
  width: 340px;
  height: 340px;
}

.weather-dashboard__glow--two {
  top: 780px;
  right: -170px;
  width: 420px;
  height: 420px;
}

.search_container {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: min(100%, 960px);
  padding: 48px 28px 64px;
  margin: 0 auto;
}

.page-heading {
  margin: 4px 2px 28px;
  color: #153f62;
}

.page-heading p,
.page-heading h1,
.page-heading span {
  margin: 0;
}

.page-heading p {
  margin-bottom: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  opacity: 0.66;
}

.page-heading h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.page-heading span {
  display: block;
  margin-top: 10px;
  color: #47708f;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-heading h3 {
  margin-bottom: 0;
}

.section-heading span {
  padding: 6px 10px;
  color: #386786;
  font-size: 0.75rem;
  font-weight: 800;
  background: rgb(255 255 255 / 43%);
  border-radius: 999px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.my-weather-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  max-width: 450px;
}

.empty-message {
  padding: 28px 0 16px;
  margin: 0;
  color: #416986;
  text-align: center;
}

.status-bar {
  position: sticky;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  max-width: calc(100% - 24px);
  padding: 11px 16px;
  margin: 8px auto 0;
  color: #1d4f70;
  font-size: 0.88rem;
  font-weight: 700;
  background: rgb(255 255 255 / 68%);
  border: 1px solid rgb(255 255 255 / 88%);
  border-radius: 999px;
  box-shadow: 0 10px 28px rgb(48 99 135 / 16%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.status-bar span {
  color: #3a9ed8;
  font-size: 0.58rem;
}

@media (max-width: 640px) {
  .search_container {
    padding: 34px 12px 52px;
  }

  .weather-grid {
    gap: 10px;
  }
}
</style>
