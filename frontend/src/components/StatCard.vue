<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  value: number | string
  label: string
  icon: Component
  variant?: 'primary' | 'warning' | 'success' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <div class="stat-card" :class="`stat-card-${props.variant}`">
    <div class="stat-card-header">
      <div class="stat-card-icon">
        <component :is="icon" class="icon" :size="24" aria-hidden="true" />
      </div>
    </div>
    <div class="stat-card-body">
      <div class="stat-card-value">{{ value }}</div>
      <div class="stat-card-label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.stat-card-header {
  display: flex;
  justify-content: flex-start;
}

.stat-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card-primary .stat-card-icon {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.stat-card-warning .stat-card-icon {
  background-color: #FEF3C7;
  color: var(--color-warning);
}

.stat-card-success .stat-card-icon {
  background-color: var(--color-primary-light);
  color: var(--color-success);
}

.stat-card-info .stat-card-icon {
  background-color: #DBEAFE;
  color: #2563EB;
}

.stat-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-card-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-primary);
}

.stat-card-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>