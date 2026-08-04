<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const GoHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <h1>404 - 페이지를 찾을 수 없습니다.</h1>
    <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
    <button @click="GoHome">홈으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found-container {
  text-align: center;
  padding: 50px;
}
</style>
