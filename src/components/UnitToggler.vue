<script setup>
import { useConfigStore } from '../stores/configStore.js'
const configStore = useConfigStore()
</script>

<template>
  <div
    class="unit-toggler"
    :class="{
      'is-fahrenheit': configStore.unit === 'fahrenheit',
      'is-dark': configStore.isDarkMode,
    }"
    role="group"
    aria-label="날씨 온도 단위 선택"
  >
    <button
      type="button"
      class="unit-option"
      :class="{
        'is-active': configStore.unit === 'celsius',
      }"
      :aria-pressed="configStore.unit === 'celsius'"
      @click="configStore.setUnit('celsius')"
    >
      °C
    </button>

    <button
      type="button"
      class="unit-option"
      :class="{
        'is-active': configStore.unit === 'fahrenheit',
      }"
      :aria-pressed="configStore.unit === 'fahrenheit'"
      @click="configStore.setUnit('fahrenheit')"
    >
      °F
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  position: relative;
  isolation: isolate;

  display: inline-grid;
  grid-template-columns: repeat(2, 44px);
  align-items: center;
  gap: 2px;

  flex-shrink: 0;

  padding: 3px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    0 7px 18px rgba(70, 110, 145, 0.11);

  backdrop-filter: blur(15px) saturate(135%);
  -webkit-backdrop-filter: blur(15px) saturate(135%);
}

/* 좌우로 움직이는 선택 글라스 */
.unit-toggler::before {
  position: absolute;
  top: 50%;
  left: 3px;
  z-index: 0;

  width: 44px;
  height: 34px;

  pointer-events: none;
  content: '';

  background: rgba(255, 255, 255, 0.27);
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.68),
    0 5px 12px rgba(70, 110, 145, 0.1);

  backdrop-filter: blur(10px) saturate(135%);
  -webkit-backdrop-filter: blur(10px) saturate(135%);

  transform: translate(0, -50%);

  transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.unit-toggler.is-fahrenheit::before {
  /* 버튼 너비 44px + 간격 2px */
  transform: translate(46px, -50%);
}

.unit-option {
  position: relative;
  z-index: 1;

  display: grid;
  place-items: center;

  width: 44px;
  height: 34px;
  padding: 0;

  color: rgba(49, 83, 106, 0.55);
  font-size: 0.84rem;
  font-weight: 750;

  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;

  transition:
    color 180ms ease,
    transform 180ms ease;
}

.unit-option:hover:not(.is-active) {
  color: #315f80;
}

.unit-option.is-active {
  color: #274f69;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.unit-option:active {
  transform: scale(0.94);
}

.unit-option:focus-visible {
  outline: 2px solid rgba(70, 125, 161, 0.65);
  outline-offset: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .unit-toggler::before {
    transition: none;
  }
}

/*=======================================*/
/*              다크모드 스타일              */
/*=======================================*/

.unit-toggler.is-dark {
  background: rgba(3, 15, 24, 0.5);
  border-color: rgba(190, 220, 237, 0.2);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 7px 18px rgba(1, 8, 14, 0.3);
}

/* 선택된 단위 뒤의 글라스 */
.unit-toggler.is-dark::before {
  background: linear-gradient(135deg, rgba(90, 139, 168, 0.58), rgba(31, 65, 87, 0.72));

  border-color: rgba(216, 235, 245, 0.32);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.18),
    0 5px 14px rgba(0, 5, 10, 0.36);
}

/* 선택되지 않은 단위 */
.unit-toggler.is-dark .unit-option {
  color: rgba(213, 233, 243, 0.65);
}

/* 선택되지 않은 단위에 마우스를 올렸을 때 */
.unit-toggler.is-dark .unit-option:hover:not(.is-active) {
  color: #e5f2f8;
}

/* 현재 선택된 단위 */
.unit-toggler.is-dark .unit-option.is-active {
  color: #ffffff;
  text-shadow: 0 1px 7px rgba(0, 0, 0, 0.65);
}
</style>
