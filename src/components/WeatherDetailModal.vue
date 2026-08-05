<script setup>
import { toRef } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDatabase, faXmark } from '@fortawesome/free-solid-svg-icons'

import { useConfigStore } from '../stores/configStore'
import { useWeatherDetail } from '../composables/useWeatherDetail'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const configStore = useConfigStore()
const city = toRef(props, 'city')

const {
  isDetailLoading,
  detailError,

  displayTemp,
  displayFeelsLike,
  forecastTempMax,
  forecastTempMin,

  sunriseTime,
  sunsetTime,
  updatedTime,
  currentPop,
  chartForecasts,
} = useWeatherDetail(city)

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <section
    class="weather-detail-modal glass-panel"
    role="dialog"
    aria-modal="true"
    :aria-label="`${city.name} 날씨 상세 정보`"
    @click.stop
  >
    <button
      class="weather-detail-modal__close"
      type="button"
      aria-label="상세보기 닫기"
      @click="closeModal"
    >
      <FontAwesomeIcon :icon="faXmark" aria-hidden="true" />
    </button>

    <div v-if="city.hasError" class="weather-detail-modal__error">
      <h2>{{ city.name }}</h2>
      <p>{{ city.errorMessage }}</p>
    </div>

    <template v-else>
      <header class="weather-detail-modal__header">
        <div>
          <p class="weather-detail-modal__label">현재 날씨</p>

          <h2>{{ city.name }}</h2>

          <p class="weather-detail-modal__status">
            {{ city.status }}
          </p>

          <div class="weather-detail-modal__temperature-range">
            <span class="is-max">
              24시간 최고
              {{ forecastTempMax }}{{ configStore.unitSymbol }}
            </span>

            <span class="is-min">
              24시간 최저
              {{ forecastTempMin }}{{ configStore.unitSymbol }}
            </span>
          </div>
        </div>

        <p class="weather-detail-modal__temperature">
          {{ displayTemp }}{{ configStore.unitSymbol }}
        </p>
      </header>

      <div class="weather-detail-modal__metrics">
        <div class="weather-detail-modal__metric">
          <span>체감온도</span>
          <strong> {{ displayFeelsLike }}{{ configStore.unitSymbol }} </strong>
        </div>

        <div class="weather-detail-modal__metric">
          <span>강수확률</span>
          <strong> {{ currentPop }}{{ currentPop === '-' ? '' : '%' }} </strong>
        </div>

        <div class="weather-detail-modal__metric">
          <span>습도</span>
          <strong>{{ city.humid }}%</strong>
        </div>

        <div class="weather-detail-modal__metric">
          <span>풍속</span>
          <strong>{{ city.ws }} m/s</strong>
        </div>

        <div class="weather-detail-modal__metric">
          <span>일출</span>
          <strong>{{ sunriseTime }}</strong>
        </div>

        <div class="weather-detail-modal__metric">
          <span>일몰</span>
          <strong>{{ sunsetTime }}</strong>
        </div>
      </div>

      <section class="weather-detail-modal__forecast">
        <div class="weather-detail-modal__forecast-heading">
          <div>
            <p>시간별 예상 날씨</p>
            <h3>앞으로 약 24시간</h3>
          </div>

          <span>3시간 간격</span>
        </div>

        <p
          v-if="isDetailLoading && chartForecasts.length === 0"
          class="weather-detail-modal__loading"
        >
          시간별 예보를 불러오는 중입니다.
        </p>

        <p
          v-else-if="detailError && chartForecasts.length === 0"
          class="weather-detail-modal__forecast-error"
        >
          {{ detailError }}
        </p>

        <div v-else-if="chartForecasts.length" class="weather-hourly-chart">
          <div class="weather-hourly-chart__items">
            <div
              v-for="forecast in chartForecasts"
              :key="`${forecast.timestamp}-${forecast.isCurrent}`"
              class="weather-hourly-chart__item"
              :class="{
                'is-current': forecast.isCurrent,
              }"
            >
              <span class="weather-hourly-chart__time">
                {{ forecast.timeLabel }}
              </span>

              <FontAwesomeIcon
                :icon="forecast.weatherIcon"
                class="weather-hourly-chart__icon"
                aria-hidden="true"
              />

              <div class="weather-hourly-chart__bar-area">
                <div
                  class="weather-hourly-chart__bar"
                  :style="{
                    '--bar-height': `${forecast.barHeight}%`,
                  }"
                ></div>
              </div>

              <strong class="weather-hourly-chart__temperature">
                {{ forecast.displayTemp }}{{ configStore.unitSymbol }}
              </strong>

              <span class="weather-hourly-chart__pop"> 강수 {{ forecast.pop }}% </span>
            </div>
          </div>
        </div>
      </section>

      <footer class="weather-detail-modal__footer">
        <span class="weather-detail-modal__source">
          <FontAwesomeIcon :icon="faDatabase" aria-hidden="true" />
          날씨 데이터 제공 OpenWeather
        </span>

        <span class="weather-detail-modal__updated"> 마지막 갱신 {{ updatedTime }} </span>
      </footer>
    </template>
  </section>
</template>
