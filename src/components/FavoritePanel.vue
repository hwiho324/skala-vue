<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { getWeatherIcon } from '../utils/weatherIcons'

import { useWeatherStore } from '../stores/weatherStore'
import { useFavoriteStore } from '../stores/favoriteStore'
import { useConfigStore } from '../stores/configStore'

const emit = defineEmits(['click-detail'])

const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()

const { cityList, myLocateWeather, detailForecasts } = storeToRefs(weatherStore)
const { fetchDetailForecast } = weatherStore

const { favoriteCityIds } = storeToRefs(favoriteStore)

watch(
  [favoriteCityIds, cityList, myLocateWeather],
  () => {
    const allCities = [...myLocateWeather.value, ...cityList.value]

    favoriteCityIds.value.forEach((cityId) => {
      const city = allCities.find((item) => {
        return item.id === cityId
      })

      if (city && !city.hasError) {
        fetchDetailForecast(cityId)
      }
    })
  },
  {
    immediate: true,
    deep: true,
  },
)

const favoriteCities = computed(() => {
  const allCities = [...myLocateWeather.value, ...cityList.value]

  return allCities
    .filter((city) => {
      return favoriteCityIds.value.includes(city.id)
    })
    .map((city) => {
      const detail = detailForecasts.value[city.id]

      return {
        ...city,
        forecastMax: detail?.next24hMax ?? null,
        forecastMin: detail?.next24hMin ?? null,
      }
    })
})

const displayTemp = (temp) => {
  return configStore.convertTemp(temp)
}

const openDetail = (city, event) => {
  const rect = event.currentTarget.getBoundingClientRect()

  emit('click-detail', {
    id: city.id,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
  })
}
</script>

<template>
  <aside class="favorite-panel glass-panel">
    <header class="favorite-panel__header">
      <div class="favorite-panel__title">
        <FontAwesomeIcon :icon="faStar" />
        <h2>즐겨찾기</h2>
      </div>

      <div class="favorite-panel__actions">
        <span class="favorite-panel__count">
          {{ favoriteCities.length }}
        </span>

        <button
          v-if="favoriteCities.length > 0"
          type="button"
          class="favorite-panel__clear"
          title="즐겨찾기 전체 삭제"
          aria-label="즐겨찾기 전체 삭제"
          @click="favoriteStore.clearFavorites"
        >
          <FontAwesomeIcon :icon="faTrashCan" />
        </button>
      </div>
    </header>

    <p v-if="favoriteCities.length === 0" class="favorite-panel__empty">
      날씨 카드의 별을 눌러<br />
      도시를 추가해 보세요.
    </p>

    <ul v-else class="favorite-panel__list">
      <li v-for="city in favoriteCities" :key="city.id">
        <button type="button" class="favorite-panel__city" @click="openDetail(city, $event)">
          <span class="favorite-panel__weather-icon">
            <FontAwesomeIcon :icon="getWeatherIcon(city.status, city.hasError)" />
          </span>

          <span class="favorite-panel__name">
            {{ city.name }}
          </span>

          <strong class="favorite-panel__current">
            {{ displayTemp(city.temp) }}{{ configStore.unitSymbol }}
          </strong>

          <span class="favorite-panel__range">
            <span class="favorite-panel__max" :aria-label="`${city.name} 최고 기온`">
              {{ displayTemp(city.forecastMax) }}°
            </span>

            <span aria-hidden="true">|</span>

            <span class="favorite-panel__min" :aria-label="`${city.name} 최저 기온`">
              {{ displayTemp(city.forecastMin) }}°
            </span>
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>
