<script setup>
import { useConfigStore } from '../stores/configStore.js'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span
      >날씨단위: <strong>{{ configStore.unit === 'celsius' ? '°C' : '°F' }} </strong>
    </span>
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>
