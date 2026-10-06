<script setup lang="ts">
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const typeClasses = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
  warning: 'toast-warning',
}
</script>

<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="typeClasses[toast.type]"
      role="alert"
    >
      <div class="toast-content">
        <component :is="icons[toast.type]" class="toast-icon" :size="20" aria-hidden="true" />
        <span class="toast-message">{{ toast.message }}</span>
      </div>
      <button
        class="toast-close"
        @click="removeToast(toast.id)"
        aria-label="Cerrar notificación"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 360px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  animation: slideIn var(--transition);
  pointer-events: auto;
  min-width: 280px;
  max-width: 100%;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  flex: 1;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-message {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.toast-close {
  flex-shrink: 0;
  padding: var(--space-1);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.toast-close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

/* Type variants */
.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-success .toast-icon {
  color: var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-error .toast-icon {
  color: var(--color-error);
}

.toast-info {
  border-left: 4px solid #3B82F6;
}

.toast-info .toast-icon {
  color: #3B82F6;
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-warning .toast-icon {
  color: var(--color-warning);
}

@media (max-width: 480px) {
  .toast-container {
    left: var(--space-4);
    right: var(--space-4);
    bottom: var(--space-4);
    max-width: none;
  }

  .toast {
    min-width: 0;
  }
}
</style>