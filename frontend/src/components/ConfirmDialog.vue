<script setup lang="ts">
import { computed, ref } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogTitleId = ref('dialog-title')
const dialogMessageId = ref('dialog-message')

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleCancel()
  }
}

const confirmButtonClass = computed(() => {
  return props.variant === 'danger' ? 'btn-danger' : 'btn-primary'
})
</script>

<template>
  <Transition name="dialog">
    <div v-if="isOpen" class="dialog-overlay" @click="handleCancel" @keydown="handleKeydown" tabIndex="-1">
      <div class="dialog" @click.stop role="dialog" aria-modal="true" :aria-labelledby="dialogTitleId" :aria-describedby="dialogMessageId">
        <div class="dialog-header">
          <h2 :id="dialogTitleId" class="dialog-title">{{ title }}</h2>
          <button class="btn btn-ghost btn-icon dialog-close" @click="handleCancel" aria-label="Cerrar">
            <X class="icon" :size="20" />
          </button>
        </div>
        <div class="dialog-body">
          <p :id="dialogMessageId" class="dialog-message">{{ message }}</p>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="handleCancel">{{ cancelText }}</button>
          <button :class="['btn', confirmButtonClass]" @click="handleConfirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 50;
}

.dialog {
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  max-width: 28rem;
  width: 100%;
  animation: slideUp var(--transition);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dialog-close {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.dialog-close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

.dialog-body {
  padding: var(--space-6);
}

.dialog-message {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all var(--transition);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog,
.dialog-leave-to .dialog {
  transform: translateY(1rem);
}
</style>
