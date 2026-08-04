import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const cityList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref(false)

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '81dc079eb0ed0028123885f783beab16'
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

  // API 연동 현재 날씨 표기
  // 북쪽에서 남쪽, 각 행에서는 서쪽 도시 우선
  // 고정 2열 안에서 국내 도시의 상대 위치 자연스럽게
  const cities = [
    { id: 'city_01', query: 'Seoul,KR', name: '서울' },
    { id: 'city_02', query: 'Suwon,KR', name: '수원' },
    { id: 'city_03', query: 'Incheon,KR', name: '인천' },
    { id: 'city_04', query: 'Daejeon,KR', name: '대전' },
    { id: 'city_05', query: 'Daegu,KR', name: '대구' },
    { id: 'city_06', query: 'Gwangju,KR', name: '광주' },
    { id: 'city_07', query: 'Ulsan,KR', name: '울산' },
    { id: 'city_08', query: 'Busan,KR', name: '부산' },
    { id: 'city_09', query: 'Jeju City,KR', name: '제주' },
    { id: 'city_10', query: 'Gangneung,KR', name: '강릉' },
  ]

  const fetchCityWeather = async (city) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city.query,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
        timeout: 5000,
      })

      const data = response.data

      return {
        id: city.id,
        name: city.name,
        temp: Math.round(data.main.temp),
        status: data.weather[0].description,
        humid: data.main.humidity,
        pop: 0,
        ws: Math.round(data.wind.speed),
        hasError: false,
        errorMessage: '',
      }
    } catch (error) {
      console.error(`${city.name} 날씨 요청 실패:`, error)

      return {
        id: city.id,
        name: city.name,
        hasError: true,
        errorMessage: '데이터를 불러오지 못했습니다.',
      }
    }
  }

  const fetchRealTimeWeather = async () => {
    // 이미 데이터가 있으면 API를 다시 호출하지 않음
    if (cityList.value.length > 0) return

    isLoading.value = true
    errorMessage.value = false

    try {
      cityList.value = await Promise.all(cities.map((city) => fetchCityWeather(city)))

      errorMessage.value = cityList.value.some((weather) => weather.hasError)
    } finally {
      isLoading.value = false
    }
  }

  // 상세 주소 열거나 새로고침 시 해당 도시 하나만 요청
  const fetchWeatherById = async (id) => {
    const savedCity = cityList.value.find((city) => city.id === id)

    // store에 이미 있으면 즉시 반환
    if (savedCity) return savedCity

    const city = cities.find((item) => item.id === id)
    if (!city) return null

    // 상세 주소로 직접 들어온 경우 해당 도시만 요청
    const weather = await fetchCityWeather(city)
    cityList.value.push(weather)

    return weather
  }

  return {
    cityList,
    isLoading,
    errorMessage,
    fetchRealTimeWeather,
    fetchWeatherById,
  }
})
