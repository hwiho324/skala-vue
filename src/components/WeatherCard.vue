<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore'

const configStore = useConfigStore()
const displayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.cityWea.temp * 9) / 5 + 32)
  }
  return props.cityWea.temp
})

const props = defineProps({
  cityWea: {
    type: Object,
    required: true,
  },
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

// 상세 보기 클릭
const showDetail = () => {
  emit('click-detail', props.cityWea.id)
}
</script>

<template>
  <div class="weather-card" @click="selectCard">
    <h4>{{ cityWea.name }}</h4>
    <div v-if="cityWea.hasError" class="weather-error">
      <p>{{ cityWea.errorMessage }}</p>
    </div>
    <div v-else>
      <p>현재기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

      <span v-if="cityWea.temp >= 25" class="hotline">더움</span>
      <span v-else class="cool line">시원</span>
      <p></p>
      <button class="wea-detail" @click.stop="showDetail">상세 보기</button>
    </div>
  </div>
</template>
