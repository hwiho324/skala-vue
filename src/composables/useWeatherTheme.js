import { computed } from 'vue'

export const useWeatherTheme = (cityWea) => {
  return computed(() => {
    const weather = cityWea.value

    if (weather.hasError) {
      return 'weather-card--error'
    }

    const status = weather.status ?? ''

    if (status.includes('뇌우') || status.includes('천둥')) {
      return 'weather-card--storm'
    }

    if (status.includes('비') || status.includes('이슬비')) {
      return 'weather-card--rain'
    }

    if (status.includes('눈')) {
      return 'weather-card--snow'
    }

    if (status.includes('구름') || status.includes('흐림')) {
      return 'weather-card--cloudy'
    }

    if (status.includes('안개') || status.includes('박무')) {
      return 'weather-card--fog'
    }

    return 'weather-card--clear'
  })
}
