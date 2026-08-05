<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('special')

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <section class="about-page">
    <article class="about-card glass-panel">
      <header class="about-header">
        <p>ABOUT SKY WEATHER</p>
        <h1>서비스 소개</h1>
        <span> 주요 도시와 현재 위치의 날씨를 한눈에 확인할 수 있는 기상 대시보드입니다. </span>
      </header>

      <div
        class="about-tabs"
        :class="{ 'is-tech': activeTab === 'tech' }"
        role="tablist"
        aria-label="서비스 소개 항목"
      >
        <button
          type="button"
          role="tab"
          :class="{ 'is-active': activeTab === 'special' }"
          :aria-selected="activeTab === 'special'"
          @click="activeTab = 'special'"
        >
          특별한 기능
        </button>

        <button
          type="button"
          role="tab"
          :class="{ 'is-active': activeTab === 'tech' }"
          :aria-selected="activeTab === 'tech'"
          @click="activeTab = 'tech'"
        >
          기술 구성
        </button>
      </div>

      <Transition name="about-tab" mode="out-in">
        <ul
          v-if="activeTab === 'special'"
          key="special"
          class="about-features about-features--special"
          role="tabpanel"
        >
          <li>
            <strong>날씨 반응형 글라스 카드</strong>
            <span>
              도시의 실제 날씨에 맞춰 하늘, 구름, 비 배경이 달라지고 마우스를 올리면 자연스럽게
              움직이는 배경을 확인하세요.
            </span>
          </li>

          <li>
            <strong>현재 위치 기반 날씨</strong>
            <span> 나의 위치를 확인해 현재 위치의 실시간 날씨를 확인하세요. </span>
          </li>

          <li>
            <strong>카드에서 이어지는 상세 보기</strong>
            <span>
              별도 페이지로 이동하지 않고 선택한 날씨 카드가 확대되며 상세 날씨를 확인하세요.
            </span>
          </li>

          <li>
            <strong>시간별 날씨 그래프</strong>
            <span>
              약 24시간의 예상 기온을 3시간 간격 막대그래프를 통해 앞으로의 날씨를 확인하세요.
            </span>
          </li>

          <li>
            <strong>도시 즐겨찾기</strong>
            <span> 현재 위치는 가장 위에 표시되고, 관심 도시를 저장해 날씨를 확인하세요. </span>
          </li>

          <li>
            <strong>개인화된 화면 설정</strong>
            <span>
              도시 자동완성 검색, 섭씨·화씨 전환, 라이트·다크 테마를 원하는 상태로 이용하세요.
            </span>
          </li>
        </ul>

        <ul v-else key="tech" class="about-features" role="tabpanel">
          <li>
            <strong>Vue 컴포넌트</strong>
            <span> <code>components/</code> 폴더의 독립적인 화면 부품을 조합합니다. </span>
          </li>

          <li>
            <strong>Vue Router</strong>
            <span> 새로고침 없이 화면을 전환하고 필요한 페이지를 지연 로딩합니다. </span>
          </li>

          <li>
            <strong>검색 상태 관리</strong>
            <span> URL 쿼리 스트링과 검색어를 연결해 검색 상태를 유지합니다. </span>
          </li>

          <li>
            <strong>Pinia 상태 공유</strong>
            <span> 날씨, 즐겨찾기, 온도 단위와 테마 설정을 여러 컴포넌트가 공유합니다. </span>
          </li>
        </ul>
      </Transition>

      <button type="button" class="back-button" @click="goHome">대시보드 홈으로 돌아가기</button>
    </article>
  </section>
</template>

<style scoped>
.about-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 150px);
  padding: 28px 0;
}

.about-card {
  width: min(760px, 100%);
  padding: clamp(28px, 5vw, 48px);
  border-radius: 34px;
}

.about-header p {
  margin: 0 0 8px;

  color: var(--accent-blue);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.about-header h1 {
  margin: 0;

  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.15;
  letter-spacing: -0.05em;
}

.about-header > span {
  display: block;
  max-width: 580px;
  margin-top: 14px;

  color: var(--text-secondary);
  line-height: 1.7;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  margin: 18px 0 32px;
  padding: 0;
  list-style: none;
}

.about-tabs {
  position: relative;
  isolation: isolate;

  display: inline-grid;
  grid-template-columns: repeat(2, 110px);
  gap: 2px;

  margin-top: 30px;
  padding: 3px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 999px;
}

.about-tabs::before {
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 0;

  width: 110px;
  height: 36px;

  pointer-events: none;
  content: '';

  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 5px 12px rgba(71, 105, 130, 0.09);

  transform: translateX(0);
  transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.about-tabs.is-tech::before {
  transform: translateX(112px);
}

.about-tabs button {
  position: relative;
  z-index: 1;

  width: 110px;
  height: 36px;
  padding: 0;

  color: var(--text-secondary);
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

.about-tabs button.is-active {
  color: var(--text-primary);
}

.about-tabs button:active {
  transform: scale(0.96);
}

.about-features--special strong {
  color: var(--accent-blue);
}

.about-tab-enter-active,
.about-tab-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.about-tab-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.about-tab-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.about-features li {
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 18px;

  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 20px;
}

.about-features strong {
  color: var(--text-primary);
}

.about-features span {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.6;
}

.about-features code {
  color: var(--accent-blue);
  font-weight: 700;
}

.back-button {
  padding: 11px 18px;

  color: var(--text-primary);
  font-weight: 700;

  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 999px;
  cursor: pointer;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 7px 16px rgba(71, 105, 130, 0.1);

  transition:
    background-color 180ms ease,
    transform 180ms ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.38);
  transform: translateY(-2px);
}

.back-button:active {
  transform: scale(0.97);
}

:global(html[data-theme='dark']) .about-features li,
:global(html[data-theme='dark']) .back-button {
  background: rgba(168, 204, 224, 0.08);
  border-color: rgba(195, 222, 237, 0.16);
}

:global(html[data-theme='dark']) .back-button:hover {
  background: rgba(168, 204, 224, 0.15);
}

:global(html[data-theme='dark']) .about-tabs {
  background: rgba(168, 204, 224, 0.06);
  border-color: rgba(195, 222, 237, 0.16);
}

:global(html[data-theme='dark']) .about-tabs::before {
  background: rgba(168, 204, 224, 0.13);
  border-color: rgba(205, 229, 241, 0.2);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 5px 14px rgba(1, 8, 14, 0.22);
}

@media (max-width: 620px) {
  .about-page {
    padding: 12px 0;
  }

  .about-card {
    padding: 26px 20px;
    border-radius: 26px;
  }

  .about-features {
    grid-template-columns: 1fr;
  }
}
</style>
