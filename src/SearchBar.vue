<script setup>
defineEmits(['update-query'])
defineProps({ currentQuery: { type: String, default: '' } })
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="도시명 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery || '전체' }}</strong>
    </p>
  </div>
</template>
