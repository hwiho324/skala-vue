import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('weather-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const theme = ref(loadTheme())

  const isDarkMode = computed(() => {
    return theme.value === 'dark'
  })

  const toggleTheme = () => {
    theme.value = isDarkMode.value ? 'light' : 'dark'
  }

  watch(
    theme,
    (newTheme) => {
      document.documentElement.dataset.theme = newTheme
      localStorage.setItem('weather-theme', newTheme)
    },
    {
      immediate: true,
    },
  )
  // 온도 단위 저장 변수(초기값 'celsius')
  const unit = ref('celsius')
  // 온도 단위 기호 계산
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '°C' : '°F'
  })

  const convertTemp = (temp) => {
    if (typeof temp !== 'number') {
      return '-'
    }

    if (unit.value === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32)
    }

    return Math.round(temp)
  }

  // 버튼 클릭 시 온도 단위 토글 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function setUnit(newUnit) {
    if (newUnit !== 'celsius' && newUnit !== 'fahrenheit') {
      return
    }

    unit.value = newUnit
  }

  return {
    theme,
    isDarkMode,
    toggleTheme,

    unit,
    unitSymbol,
    convertTemp,
    toggleUnit,
    setUnit,
  }
})
