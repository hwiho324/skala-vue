<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCloudSun, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useConfigStore } from './stores/configStore.js'

const configStore = useConfigStore()
const route = useRoute()
</script>

<template>
  <div class="app-container">
    <!-- 모든 페이지에 공통으로 표시되는 내비게이션 -->
    <header class="app-header" :class="{ 'is-dark': configStore.isDarkMode }">
      <RouterLink to="/" class="app-title">
        <span class="app-title-icon">
          <FontAwesomeIcon :icon="faCloudSun" />
        </span>

        <span>Weather Dashboard</span>
      </RouterLink>

      <div class="app-actions">
        <nav
          class="navigation"
          :class="{
            'is-about': route.path === '/about',
            'is-no-selection': route.name === 'NotFound',
          }"
        >
          <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'is-detail-active': route.name === 'WeatherCity' }"
          >
            날씨 홈
          </RouterLink>

          <RouterLink to="/about" class="nav-link"> 서비스 소개 </RouterLink>
        </nav>

        <button
          type="button"
          class="theme-toggle"
          :class="{ 'is-dark': configStore.isDarkMode }"
          :title="configStore.isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'"
          :aria-label="configStore.isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'"
          :aria-pressed="configStore.isDarkMode"
          @click="configStore.toggleTheme"
        >
          <FontAwesomeIcon :icon="configStore.isDarkMode ? faSun : faMoon" />
        </button>
      </div>
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
  padding-top: 14px;
}

.app-header {
  position: sticky;
  top: 14px;
  z-index: 100;

  width: min(1120px, calc(100% - 112px));
  box-sizing: border-box;
  margin: 0 auto;
  padding: 10px 14px 10px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: var(--header-glass-background);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 22px;

  box-shadow:
    0 14px 35px rgba(71, 105, 130, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);

  backdrop-filter: blur(26px) saturate(130%);
  -webkit-backdrop-filter: blur(26px) saturate(130%);
}

.app-title {
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--text-primary);
  font-size: 18px;
  font-weight: 750;
  text-decoration: none;
  letter-spacing: -0.02em;
}

.app-title-icon {
  width: 38px;
  height: 38px;

  display: grid;
  place-items: center;

  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 14px;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 6px 14px rgba(71, 105, 130, 0.12);
}

.navigation {
  position: relative;
  isolation: isolate;

  display: inline-grid;
  grid-template-columns: repeat(2, 88px);
  align-items: center;
  gap: 2px;

  padding: 3px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    0 7px 18px rgba(70, 110, 145, 0.1);

  backdrop-filter: blur(15px) saturate(135%);
  -webkit-backdrop-filter: blur(15px) saturate(135%);
}

/* 좌우로 움직이는 선택 글라스 */
.navigation::before {
  position: absolute;
  top: 50%;
  left: 3px;
  z-index: 0;

  width: 88px;
  height: 34px;

  pointer-events: none;
  content: '';

  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.64);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.72),
    0 5px 12px rgba(70, 110, 145, 0.11);

  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);

  transform: translate(0, -50%);
  transition:
    transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 180ms ease;
}

.navigation.is-no-selection::before {
  opacity: 0;
}

/* 서비스 소개가 선택되면 오른쪽으로 이동 */
.navigation.is-about::before {
  /* 메뉴 너비 88px + 간격 2px */
  transform: translate(90px, -50%);
}

.nav-link {
  position: relative;
  z-index: 1;

  display: grid;
  place-items: center;

  width: 88px;
  height: 34px;
  padding: 0;

  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;

  background: transparent;
  border: 0;
  border-radius: 999px;

  transition:
    color 180ms ease,
    transform 180ms ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: transparent;
}

.nav-link.router-link-exact-active,
.nav-link.is-detail-active {
  color: var(--text-primary);
  background: transparent;
  border: 0;
  box-shadow: none;
}

.nav-link:active {
  transform: scale(0.96);
}

.nav-link:focus-visible {
  outline: 2px solid rgba(70, 125, 161, 0.65);
  outline-offset: 1px;
}

.main-content {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 12px 0 32px;
}

@media (max-width: 760px) {
  .app-header {
    width: calc(100% - 52px);
  }
}

@media (max-width: 640px) {
  .app-header {
    top: 8px;
    width: calc(100% - 40px);
    padding: 8px 10px;
  }

  .app-title {
    font-size: 0;
    gap: 0;
  }

  .app-title-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .navigation {
    grid-template-columns: repeat(2, 72px);
  }

  .navigation::before {
    width: 72px;
  }

  .navigation.is-about::before {
    /* 모바일 메뉴 너비 72px + 간격 2px */
    transform: translate(74px, -50%);
  }

  .nav-link {
    width: 72px;
    height: 34px;
    padding: 0;
    font-size: 13px;
  }
}

.app-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.theme-toggle {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  width: 36px;
  height: 36px;
  font-size: 0.8rem;
  padding: 0;

  color: var(--text-primary);
  font-size: 0.9rem;

  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 999px;
  cursor: pointer;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 5px 12px rgba(70, 110, 145, 0.09);

  transition:
    color 220ms ease,
    background-color 220ms ease,
    transform 220ms ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.36);
  transform: rotate(8deg);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.theme-toggle.is-dark {
  color: #e5b958;
}

.theme-toggle:focus-visible {
  outline: 2px solid rgba(70, 125, 161, 0.65);
  outline-offset: 2px;
}

/* =======================================
   헤더 다크모드
======================================= */

.app-header.is-dark {
  background: var(--header-glass-background);
  border-color: rgba(185, 218, 236, 0.22);

  box-shadow:
    0 14px 35px rgba(1, 7, 12, 0.52),
    inset 0 1px 0 rgba(255, 255, 255, 0.13);
}

.app-header.is-dark .app-title {
  color: #d2eaf4;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.52);
}

.app-header.is-dark .app-title-icon {
  color: #b8ddeb;
  background: rgba(92, 137, 165, 0.22);
  border-color: rgba(202, 226, 239, 0.24);
}

.app-header.is-dark .navigation {
  background: rgba(3, 15, 24, 0.42);
  border-color: rgba(190, 220, 237, 0.2);
}

.app-header.is-dark .navigation::before {
  background: linear-gradient(135deg, rgba(75, 121, 149, 0.7), rgba(25, 57, 78, 0.82));

  border-color: rgba(190, 220, 237, 0.28);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    0 5px 16px rgba(0, 5, 10, 0.4);
}

/* 선택되지 않은 메뉴 */
.app-header.is-dark .nav-link {
  color: #829eae;
}

/* 선택된 메뉴 */
.app-header.is-dark .nav-link.router-link-exact-active,
.app-header.is-dark .nav-link.is-detail-active {
  color: #acd8ea;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.48);
}

.app-header.is-dark .nav-link:hover {
  color: #c5e5f2;
}

.app-header.is-dark .theme-toggle {
  background: rgba(92, 137, 165, 0.18);
  border-color: rgba(202, 226, 239, 0.22);
}

.app-header.is-dark .theme-toggle:hover {
  background: rgba(92, 137, 165, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .navigation::before {
    transition: none;
  }
}
</style>
