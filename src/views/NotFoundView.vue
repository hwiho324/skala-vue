<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCloud, faHouse } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const route = useRoute()

const invalidCityId = computed(() => {
  return typeof route.query.invalidCity === 'string' ? route.query.invalidCity : ''
})

const GoHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="not-found-page">
    <div class="not-found-container glass-panel">
      <div class="not-found-icon" aria-hidden="true">
        <FontAwesomeIcon :icon="faCloud" />
      </div>

      <p class="not-found-code">404</p>

      <h1>길을 잃은 구름이에요</h1>

      <p class="not-found-message">
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        주소가 올바른지 다시 확인해 주세요.
      </p>

      <p v-if="invalidCityId" class="invalid-city">
        존재하지 않는 도시 ID:
        <strong>{{ invalidCityId }}야호</strong>
      </p>

      <button type="button" class="home-button" @click="GoHome">
        <FontAwesomeIcon :icon="faHouse" />
        <span>날씨 홈으로 돌아가기</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 108px);

  display: grid;
  place-items: center;

  padding: 36px 16px 64px;
}

.not-found-container {
  width: min(620px, 100%);
  padding: clamp(42px, 7vw, 72px) 28px;

  overflow: hidden;
  text-align: center;

  border-radius: 38px;
}

.not-found-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 10px;

  display: grid;
  place-items: center;

  color: var(--accent-blue);
  font-size: 38px;

  background: rgba(255, 255, 255, 0.22);
  border: 1px solid var(--glass-border);
  border-radius: 26px;

  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 12px 28px var(--glass-shadow);

  animation: cloud-float 3.2s ease-in-out infinite;
}

.not-found-code {
  margin: 8px 0 0;

  color: var(--accent-blue);
  font-size: clamp(72px, 14vw, 118px);
  font-weight: 650;
  line-height: 1;
  letter-spacing: -0.07em;
}

h1 {
  margin: 18px 0 10px;

  color: var(--text-primary);
  font-size: clamp(25px, 4vw, 34px);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.not-found-message {
  margin: 0;

  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.7;
}

.invalid-city {
  width: fit-content;
  margin: 20px auto 0;
  padding: 8px 14px;

  color: var(--text-secondary);
  font-size: 13px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid var(--glass-border);
  border-radius: 999px;
}

.invalid-city strong {
  color: var(--text-primary);
}

.home-button {
  margin-top: 30px;
  padding: 12px 20px;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  color: var(--text-primary);
  font-weight: 700;

  cursor: pointer;

  background: rgba(255, 255, 255, 0.28);
  border: 1px solid var(--glass-border);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 10px 24px var(--glass-shadow);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  transition:
    transform 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.home-button:hover {
  background: var(--glass-background-strong);

  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 14px 30px var(--glass-shadow);

  transform: translateY(-2px);
}

.home-button:active {
  transform: translateY(0) scale(0.97);
}

.home-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent-blue) 55%, transparent);
  outline-offset: 4px;
}

@keyframes cloud-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-7px);
  }
}

@media (max-width: 640px) {
  .not-found-page {
    min-height: calc(100vh - 92px);
    padding: 24px 4px 40px;
  }

  .not-found-container {
    padding: 42px 20px;
    border-radius: 30px;
  }

  .not-found-icon {
    width: 66px;
    height: 66px;
    font-size: 32px;
    border-radius: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .not-found-icon {
    animation: none;
  }

  .home-button {
    transition: none;
  }
}
</style>
