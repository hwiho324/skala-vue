<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <h3>서비스 소개</h3>
  <hr />

  <div class="description-box">
    <p>본 앱은 Vue 3 및 Vue Router 기반으로 제작된 실습용 기상 관측 대시보드입니다.</p>
    <ul>
      <li><code>components/</code>폴더 내부의 독립 부품 연동</li>
      <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환 (지연 로딩 포함)</li>
      <li>URL 쿼리 스트링 매핑를 활용한 실시간 검색 상태 동기화(예정)</li>
      <li>Pinia로 관리하는 섭씨/화씨 단위 전환</li>
    </ul>
  </div>

  <button @click="goHome" class="back-button">대시 보드 홈으로 돌아가기</button>
</template>
