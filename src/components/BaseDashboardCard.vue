<template>
  <div class="base-dashboard-card glass-panel">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  padding: 5px 22px 22px;
  margin-bottom: 10px;

  border-radius: 30px;
}

.base-dashboard-card :slotted(h3) {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}
</style>
