import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useWeatherStore } from '../stores/weatherStore'
import { useConfigStore } from '../stores/configStore'
import { getWeatherIcon } from '../utils/weatherIcons'

export const useWeatherDetail = (city) => {
  const weatherStore = useWeatherStore()
  const configStore = useConfigStore()

  const { detailForecasts, isDetailLoading, detailError } = storeToRefs(weatherStore)

  const { fetchDetailForecast } = weatherStore

  const detail = computed(() => {
    return detailForecasts.value[city.value.id] ?? null
  })

  const timezone = computed(() => {
    return detail.value?.timezone ?? city.value.timezone ?? 0
  })

  const formatCityTime = (timestamp, includeDate = false) => {
    if (typeof timestamp !== 'number') {
      return '-'
    }

    const cityTimestamp = timestamp + timezone.value
    const date = new Date(cityTimestamp * 1000)

    const options = includeDate
      ? {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        }
      : {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        }

    return new Intl.DateTimeFormat('ko-KR', options).format(date)
  }

  const displayTemp = computed(() => {
    return configStore.convertTemp(city.value.temp)
  })

  const displayFeelsLike = computed(() => {
    return configStore.convertTemp(city.value.feelsLike)
  })

  const displayTempMax = computed(() => {
    return configStore.convertTemp(city.value.tempMax)
  })

  const displayTempMin = computed(() => {
    return configStore.convertTemp(city.value.tempMin)
  })

  const sunriseTime = computed(() => {
    const timestamp = detail.value?.sunrise ?? city.value.sunrise

    return formatCityTime(timestamp)
  })

  const sunsetTime = computed(() => {
    const timestamp = detail.value?.sunset ?? city.value.sunset

    return formatCityTime(timestamp)
  })

  const updatedTime = computed(() => {
    return formatCityTime(city.value.updatedAt, true)
  })

  const currentPop = computed(() => {
    return detail.value?.hourlyForecast?.[0]?.pop ?? '-'
  })

  const chartForecasts = computed(() => {
    const forecasts = detail.value?.hourlyForecast ?? []

    if (forecasts.length === 0) {
      return []
    }

    const chartItems = [
      {
        timestamp: city.value.updatedAt,
        temp: city.value.temp,
        pop: forecasts[0]?.pop ?? 0,
        status: city.value.status,
        isCurrent: true,
      },

      ...forecasts.slice(0, 7).map((forecast) => {
        return {
          ...forecast,
          isCurrent: false,
        }
      }),
    ]

    const temperatures = chartItems.map((item) => item.temp)
    const minTemp = Math.min(...temperatures)
    const maxTemp = Math.max(...temperatures)
    const temperatureRange = maxTemp - minTemp || 1

    return chartItems.map((forecast) => {
      const barHeight = 36 + ((forecast.temp - minTemp) / temperatureRange) * 64

      return {
        ...forecast,
        timeLabel: forecast.isCurrent ? '현재' : formatCityTime(forecast.timestamp),

        displayTemp: configStore.convertTemp(forecast.temp),
        weatherIcon: getWeatherIcon(forecast.status),
        barHeight,
      }
    })
  })

  const forecastTempMax = computed(() => {
    return configStore.convertTemp(detail.value?.next24hMax ?? city.value.tempMax)
  })

  const forecastTempMin = computed(() => {
    return configStore.convertTemp(detail.value?.next24hMin ?? city.value.tempMin)
  })

  watch(
    () => city.value.id,
    (cityId) => {
      if (cityId) {
        fetchDetailForecast(cityId)
      }
    },
    { immediate: true },
  )

  return {
    detail,
    isDetailLoading,
    detailError,

    displayTemp,
    displayFeelsLike,
    displayTempMax,
    displayTempMin,

    sunriseTime,
    sunsetTime,
    updatedTime,
    currentPop,
    chartForecasts,

    forecastTempMax,
    forecastTempMin,
  }
}
