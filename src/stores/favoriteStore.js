import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', () => {
  const STORAGE_KEY = 'weather-favorite-city-ids'

  const loadFavoriteCityIds = () => {
    try {
      const savedIds = localStorage.getItem(STORAGE_KEY)

      if (!savedIds) {
        return []
      }

      const parsedIds = JSON.parse(savedIds)

      return Array.isArray(parsedIds) ? parsedIds : []
    } catch (error) {
      console.error('즐겨찾기 불러오기 실패:', error)
      return []
    }
  }

  const favoriteCityIds = ref(loadFavoriteCityIds())

  const isFavorite = (cityId) => {
    return favoriteCityIds.value.includes(cityId)
  }

  const toggleFavorite = (cityId) => {
    if (isFavorite(cityId)) {
      favoriteCityIds.value = favoriteCityIds.value.filter((savedId) => savedId !== cityId)
      return
    }

    favoriteCityIds.value.push(cityId)
  }

  watch(
    favoriteCityIds,
    (newFavoriteCityIds) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavoriteCityIds))
    },
    { deep: true },
  )

  const clearFavorites = () => {
    favoriteCityIds.value = []
  }

  return {
    favoriteCityIds,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
})
