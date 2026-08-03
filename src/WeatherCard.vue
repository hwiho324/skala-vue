<script setup>
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
</script>

<template>
  <div class="weather-card" @click="selectCard">
    <h4>{{ cityWea.name }}</h4>
    <p>현재기온: {{ cityWea.temp }}°C</p>

    <span v-if="cityWea.temp >= 25" class="hotline">더움 (25°C 이상)</span>
    <span v-else class="cool line">시원 (25°C 미만) </span>
    <button
      class="wea-detail"
      @click.stop="
        emit(
          'click-detail',
          cityWea.name,
          cityWea.temp,
          cityWea.status,
          cityWea.humid,
          cityWea.pop,
          cityWea.ws,
        )
      "
    >
      상세 보기
    </button>
  </div>
</template>
