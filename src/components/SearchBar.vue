<script setup>
import { ref, computed, nextTick } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update-query'])

const isExpanded = ref(false)
const isSuggestionOpen = ref(false)
const inputRef = ref(null)
const searchBarRef = ref(null)

const visibleSuggestions = computed(() => {
  if (!props.currentQuery.trim()) {
    return []
  }

  return props.suggestions.slice(0, 5)
})

const openSearch = async () => {
  isExpanded.value = true

  await nextTick()
  inputRef.value?.focus()
}

const handleInput = (event) => {
  const value = event.target.value

  emit('update-query', value)
  isSuggestionOpen.value = value.trim().length > 0
}

const clearSearch = async () => {
  emit('update-query', '')
  isSuggestionOpen.value = false

  await nextTick()
  inputRef.value?.focus()
}

const selectCity = (cityName) => {
  emit('update-query', cityName)
  isSuggestionOpen.value = false
}

const selectFirstSuggestion = () => {
  const firstCity = visibleSuggestions.value[0]

  if (firstCity) {
    selectCity(firstCity.name)
  }
}

const handleFocusOut = async () => {
  await nextTick()

  const focusedElement = document.activeElement

  if (searchBarRef.value?.contains(focusedElement)) {
    return
  }

  isSuggestionOpen.value = false
  isExpanded.value = false
}
</script>

<template>
  <div
    ref="searchBarRef"
    class="search-bar"
    :class="{ 'is-expanded': isExpanded }"
    @focusout="handleFocusOut"
  >
    <Transition name="search-expand">
      <button
        v-if="!isExpanded"
        key="search-closed"
        type="button"
        class="search-bar__open"
        aria-label="도시 검색 열기"
        @click="openSearch"
      >
        <FontAwesomeIcon :icon="faMagnifyingGlass" />
      </button>

      <div v-else key="search-opened" class="search-bar__field">
        <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-bar__icon" />

        <input
          ref="inputRef"
          type="text"
          :value="currentQuery"
          placeholder="도시명 입력"
          autocomplete="off"
          aria-label="도시명 검색"
          @input="handleInput"
          @focus="isSuggestionOpen = currentQuery.trim().length > 0"
          @keydown.enter.prevent="selectFirstSuggestion"
          @keydown.esc="isSuggestionOpen = false"
        />

        <button
          v-if="currentQuery"
          type="button"
          class="search-bar__clear"
          aria-label="검색어 지우기"
          @mousedown.prevent
          @click="clearSearch"
        >
          <FontAwesomeIcon :icon="faXmark" />
        </button>
      </div>
    </Transition>

    <ul
      v-if="isExpanded && isSuggestionOpen && visibleSuggestions.length"
      class="search-suggestions"
    >
      <li v-for="city in visibleSuggestions" :key="city.id">
        <button type="button" @mousedown.prevent @click="selectCity(city.name)">
          <FontAwesomeIcon :icon="faMagnifyingGlass" />
          <span>{{ city.name }}</span>
          <small>{{ city.temp ?? '-' }}℃</small>
        </button>
      </li>
    </ul>
  </div>
</template>
