import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const cityList = ref([])
  const isLoading = ref(false)
  const errorMessage = ref(false)

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
  const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast'

  const DETAIL_CACHE_TIME = 10 * 60 * 1000

  const detailForecasts = ref({})
  const isDetailLoading = ref(false)
  const detailError = ref('')

  // gps 기반 현재 내 위치 데이터로 날씨 송출
  const myLocateWeather = ref([])
  const isMyLocationLoading = ref(false)
  const myLocationError = ref('')

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('현재 브라우저는 위치 기능을 지원하지 않습니다.'))
        return
      }
      // 빠른 위치 조회 x, 최대 10초 대기, 5분 이내 정보 재사용
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      })
    })
  }

  const fetchKoreanAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        params: {
          latitude,
          longitude,
          localityLanguage: 'ko',
        },
        timeout: 5000,
      })

      const data = response.data

      const administrativeNames =
        data.localityInfo?.administrative
          ?.map((item) => item.name)
          .filter((name) => /(시|군|구|읍|면|동)$/.test(name)) ?? []

      const uniqueNames = [...new Set(administrativeNames)]

      if (uniqueNames.length > 0) {
        return uniqueNames.join(' ')
      }

      // 상세 행정구역 데이터가 없을 때 대체
      return [...new Set([data.city, data.locality])].filter(Boolean).join(' ') || null
    } catch (error) {
      console.error('한글 위치 변환 실패:', error)
      return null
    }
  }

  const fetchMyLocationWeather = async () => {
    isMyLocationLoading.value = true
    myLocationError.value = ''

    try {
      const position = await getCurrentPosition()

      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      const [weatherResponse, districtName] = await Promise.all([
        axios.get(API_URL, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: 'metric',
            lang: 'kr',
          },
          timeout: 5000,
        }),

        fetchKoreanAddress(latitude, longitude),
      ])

      const data = weatherResponse.data

      const weather = {
        id: 'my_city',
        name: districtName || data.name || '현재 위치',

        temp: Math.round(data.main.temp),
        tempMax: Math.round(data.main.temp_max),
        tempMin: Math.round(data.main.temp_min),
        feelsLike: Math.round(data.main.feels_like),

        status: data.weather[0].description,
        humid: data.main.humidity,
        ws: Math.round(data.wind.speed),

        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        updatedAt: data.dt,
        timezone: data.timezone,

        lat: data.coord.lat,
        lon: data.coord.lon,

        hasError: false,
        errorMessage: '',
      }

      myLocateWeather.value = [weather]

      return weather
    } catch (error) {
      console.error('현재 위치 날씨 요청 실패:', error)

      let message = '현재 위치의 날씨를 불러오지 못했습니다.'

      if (error.code === 1) {
        message = '위치 권한이 거부되었습니다.'
      } else if (error.code === 2) {
        message = '현재 위치를 확인할 수 없습니다.'
      } else if (error.code === 3) {
        message = '위치 확인 시간이 초과되었습니다.'
      }

      myLocationError.value = message
      myLocateWeather.value = []

      return null
    } finally {
      isMyLocationLoading.value = false
    }
  }

  const cities = [
    { id: 'city_01', query: 'Seoul,KR', name: '서울' },
    { id: 'city_02', query: 'Chuncheon,KR', name: '춘천' },
    { id: 'city_03', query: 'Incheon,KR', name: '인천' },
    { id: 'city_04', query: 'Suwon,KR', name: '수원' },
    { id: 'city_05', query: 'Cheonan,KR', name: '천안' },
    { id: 'city_06', query: 'Cheongju,KR', name: '청주' },
    { id: 'city_07', query: 'Sejong,KR', name: '세종' },
    { id: 'city_08', query: 'Andong,KR', name: '안동' },
    { id: 'city_09', query: 'Daejeon,KR', name: '대전' },
    { id: 'city_10', query: 'Daegu,KR', name: '대구' },
    { id: 'city_11', query: 'Jeonju,KR', name: '전주' },
    { id: 'city_12', query: 'Ulsan,KR', name: '울산' },
    { id: 'city_13', query: 'Gwangju,KR', name: '광주' },
    { id: 'city_14', query: 'Changwon,KR', name: '창원' },
    { id: 'city_15', query: 'Mokpo,KR', name: '목포' },
    { id: 'city_16', query: 'Busan,KR', name: '부산' },
    { id: 'city_17', query: 'Jeju,KR', name: '제주' },
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
        tempMax: Math.round(data.main.temp_max),
        tempMin: Math.round(data.main.temp_min),
        feelsLike: Math.round(data.main.feels_like),

        status: data.weather[0].description,
        humid: data.main.humidity,
        ws: Math.round(data.wind.speed),

        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        updatedAt: data.dt,
        timezone: data.timezone,

        lat: data.coord.lat,
        lon: data.coord.lon,

        hasError: false,
        errorMessage: '',
      }

      // API 호출이 되지 않은 도시 따로 표시
    } catch (error) {
      console.error(`${city.name} 날씨 요청 실패:`, error)

      let message = '데이터를 불러오지 못했습니다.'

      if (error.response?.status === 404) {
        message = '도시 정보를 찾지 못했습니다.'
      } else if (error.response?.status === 401) {
        message = '날씨 API 인증에 실패했습니다.'
      } else if (error.response?.status === 429) {
        message = 'API 요청 횟수를 초과했습니다.'
      } else if (error.code === 'ECONNABORTED') {
        message = '날씨 요청 시간이 초과되었습니다.'
      }

      return {
        id: city.id,
        name: city.name,
        hasError: true,
        errorMessage: message,
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

  const fetchDetailForecast = async (cityId) => {
    detailError.value = ''

    const cachedDetail = detailForecasts.value[cityId]

    if (cachedDetail && Date.now() - cachedDetail.fetchedAt < DETAIL_CACHE_TIME) {
      return cachedDetail
    }

    const city =
      cityList.value.find((item) => item.id === cityId) ??
      myLocateWeather.value.find((item) => item.id === cityId)

    if (!city || city.hasError) {
      detailError.value = '도시 날씨 정보를 찾을 수 없습니다.'
      return null
    }

    if (typeof city.lat !== 'number' || typeof city.lon !== 'number') {
      detailError.value = '도시 좌표 정보가 없습니다.'
      return null
    }

    isDetailLoading.value = true

    try {
      const response = await axios.get(FORECAST_API_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
          cnt: 8,
        },
        timeout: 5000,
      })

      const data = response.data

      const hourlyForecast = data.list.map((forecast) => {
        return {
          timestamp: forecast.dt,
          temp: Math.round(forecast.main.temp),
          feelsLike: Math.round(forecast.main.feels_like),
          pop: Math.round((forecast.pop ?? 0) * 100),
          status: forecast.weather[0].description,
          iconCode: forecast.weather[0].icon,
        }
      })

      const forecastTemperatures = [
        city.temp,
        ...hourlyForecast.map((forecast) => forecast.temp),
      ].filter((temp) => typeof temp === 'number')

      const next24hMax = Math.max(...forecastTemperatures)
      const next24hMin = Math.min(...forecastTemperatures)

      const detail = {
        cityId,
        timezone: data.city?.timezone ?? city.timezone,
        sunrise: data.city?.sunrise ?? city.sunrise,
        sunset: data.city?.sunset ?? city.sunset,

        next24hMax,
        next24hMin,

        hourlyForecast,
        fetchedAt: Date.now(),
      }

      detailForecasts.value = {
        ...detailForecasts.value,
        [cityId]: detail,
      }

      return detail
    } catch (error) {
      console.error(`${city.name} 상세 예보 요청 실패:`, error)

      detailError.value = '시간별 날씨 예보를 불러오지 못했습니다.'

      return null
    } finally {
      isDetailLoading.value = false
    }
  }

  // 상세 주소 열거나 새로고침 시 해당 도시 하나만 요청
  const fetchWeatherById = async (id) => {
    if (id === 'my_city') {
      const savedLocation = myLocateWeather.value[0]

      if (savedLocation) return savedLocation

      return fetchMyLocationWeather()
    }
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
    myLocateWeather,
    isLoading,
    errorMessage,
    isMyLocationLoading,
    myLocationError,

    detailForecasts,
    isDetailLoading,
    detailError,

    fetchRealTimeWeather,
    fetchMyLocationWeather,
    fetchWeatherById,
    fetchDetailForecast,
  }
})
