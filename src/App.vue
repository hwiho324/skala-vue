<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <!-- 모든 페이지에 공통으로 표시되는 내비게이션 -->
    <header class="app-header">
      <RouterLink to="/" class="app-title"> Weather Dashboard </RouterLink>

      <nav class="navigation">
        <RouterLink to="/" class="nav-link"> 날씨 홈 </RouterLink>

        <RouterLink to="/about" class="nav-link"> 서비스 소개 </RouterLink>
        <UnitToggler />
      </nav>
    </header>

    <!-- 주소에 맞는 View 컴포넌트가 표시되는 자리 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(14px);
}

.app-title {
  color: #1e3a5f;
  font-size: 22px;
  font-weight: 700;
  text-decoration: none;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  padding: 9px 14px;
  color: #475569;
  font-weight: 600;
  text-decoration: none;
  border-radius: 10px;
}

.nav-link:hover {
  background-color: rgba(219, 234, 254, 0.7);
}

.nav-link.router-link-exact-active {
  color: #2563eb;
  background-color: #dbeafe;
}

.main-content {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}
</style>
