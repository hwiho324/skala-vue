<template>
  <section class="base-dashboard-card">
    <slot></slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  padding: 22px;
  margin-bottom: 14px;
  overflow: hidden;
  background: rgb(255 255 255 / 42%);
  border: 1px solid rgb(255 255 255 / 68%);
  border-radius: 26px;
  box-shadow:
    0 18px 45px rgb(43 96 143 / 13%),
    inset 0 1px 0 rgb(255 255 255 / 72%);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
}

.base-dashboard-card :deep(h3) {
  margin: 0 0 18px;
  color: #153d61;
  font-size: 1.15rem;
}

@media (max-width: 640px) {
  .base-dashboard-card {
    padding: 16px;
    border-radius: 22px;
  }
}
</style>
