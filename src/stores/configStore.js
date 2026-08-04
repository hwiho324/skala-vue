import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 온도 단위 저장 변수(초기값 'celsius')
  const unit = ref('celsius')
  // 온도 단위 기호 계산
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '°C' : '°F'
  })
  // 버튼 클릭 시 온도 단위 토글 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
  }
})
