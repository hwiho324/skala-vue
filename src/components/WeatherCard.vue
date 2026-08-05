<script setup>
import { computed, toRef } from 'vue'
import { useConfigStore } from '../stores/configStore'
import { rainDrops } from '../data/weatherEffects'
import { useWeatherTheme } from '../composables/useWeatherTheme'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useFavoriteStore } from '../stores/favoriteStore'

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

const props = defineProps({
  cityWea: {
    type: Object,
    required: true,
  },
})

const favorite = computed(() => {
  return favoriteStore.isFavorite(props.cityWea.id)
})

const toggleFavorite = () => {
  favoriteStore.toggleFavorite(props.cityWea.id)
}

const cityWea = toRef(props, 'cityWea')
const weatherTheme = useWeatherTheme(cityWea)

const displayTemp = computed(() => {
  return configStore.convertTemp(props.cityWea.temp)
})

const emit = defineEmits(['select-card', 'click-detail'])
// 조사 판단
const withJosa = (word) => {
  const lastChar = word[word.length - 1]
  const code = lastChar.charCodeAt(0)
  // 마지막 글자가 완성형 한글이 아니면 '를' 사용
  if (code < 0xac00 || code > 0xd7a3) return `${word}를`
  const hasBatchim = (code - 0xac00) % 28 !== 0
  return `${word}${hasBatchim ? '을' : '를'}`
}

// 카드 클릭
const selectCard = () => {
  emit('select-card', `${withJosa(props.cityWea.name)} 선택했습니다.`)
}

// 상세 보기 클릭 - 카드 내부 어디든 클릭 가능
const showDetail = (event) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()

  selectCard()

  emit('click-detail', {
    id: props.cityWea.id,
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
  <article
    class="weather-card glass-panel"
    :class="weatherTheme"
    :data-city-id="cityWea.id"
    role="button"
    tabindex="0"
    @click="showDetail"
  >
    <div class="weather-card__background" aria-hidden="true"></div>

    <button
      type="button"
      class="weather-card__favorite"
      :class="{ 'is-active': favorite }"
      :aria-pressed="favorite"
      :aria-label="favorite ? `${cityWea.name} 즐겨찾기 해제` : `${cityWea.name} 즐겨찾기 추가`"
      @click.stop="toggleFavorite"
    >
      <FontAwesomeIcon :icon="faStar" />
    </button>
    <!--물방울 레이어 추가-->
    <div
      v-if="weatherTheme === 'weather-card--rain' || weatherTheme === 'weather-card--storm'"
      class="weather-card__droplets"
      aria-hidden="true"
    >
      <span
        v-for="(drop, index) in rainDrops"
        :key="index"
        class="weather-card__droplet"
        :style="{
          '--drop-left': drop.left,
          '--drop-top': drop.top,
          '--drop-size': drop.size,
          '--drop-duration': drop.duration,
          '--drop-delay': drop.delay,
          '--drop-drift': drop.drift,
        }"
      ></span>
    </div>

    <!-- 실제 카드 내용 -->
    <div class="weather-card__content">
      <h4>{{ cityWea.name }}</h4>

      <div v-if="cityWea.hasError" class="weather-error">
        <p>{{ cityWea.errorMessage }}</p>
      </div>

      <div v-else>
        <p class="weather-card__temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

        <p class="weather-card__status">
          {{ cityWea.status }}
        </p>

        <span v-if="cityWea.temp >= 25" class="weather-card__feeling"> 더움 </span>

        <span v-else class="weather-card__feeling"> 시원 </span>
      </div>
    </div>
  </article>
</template>
