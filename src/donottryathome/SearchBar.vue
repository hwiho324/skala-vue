<script setup>
defineEmits(['update-query'])
defineProps({ currentQuery: { type: String, default: '' } })
</script>

<template>
  <div class="search-bar">
    <label class="search-bar__field">
      <span class="search-bar__icon" aria-hidden="true">⌕</span>
      <span class="sr-only">도시명 검색</span>
      <input
        type="search"
        :value="currentQuery"
        autocomplete="off"
        placeholder="도시명 입력"
        @input="$emit('update-query', $event.target.value)"
      />
    </label>

    <p>
      검색 중인 도시: <strong>{{ currentQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar {
  color: #234d70;
}

.search-bar__field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  background: rgb(255 255 255 / 58%);
  border: 1px solid rgb(255 255 255 / 82%);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 88%);
}

.search-bar__icon {
  color: #47799f;
  font-size: 1.5rem;
  line-height: 1;
}

.search-bar input {
  width: 100%;
  padding: 14px 0;
  color: #173d5e;
  font: inherit;
  background: transparent;
  border: 0;
  outline: 0;
}

.search-bar input::placeholder {
  color: #6888a1;
}

.search-bar__field:focus-within {
  border-color: rgb(76 155 218 / 62%);
  box-shadow:
    0 0 0 4px rgb(80 164 229 / 13%),
    inset 0 1px 0 rgb(255 255 255 / 88%);
}

.search-bar p {
  margin: 12px 4px 0;
  font-size: 0.9rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
