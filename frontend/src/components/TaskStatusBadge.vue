<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Circle } from 'lucide-vue-next'
import type { TaskStatus } from '@/types/task'

interface Props {
  status: TaskStatus
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onToggle?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  interactive: false,
  onToggle: () => {},
})

const statusConfig = computed(() => {
  if (props.status === 'completed') {
    return {
      label: 'Completada',
      class: 'status-completed',
      icon: CheckCircle2,
      bgClass: 'bg-success',
      borderClass: 'border-success',
    }
  }
  return {
    label: 'Pendiente',
    class: 'status-pending',
    icon: Circle,
    bgClass: 'bg-transparent',
    borderClass: 'border-secondary',
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-5 h-5 text-xs'
    case 'lg':
      return 'w-8 h-8 text-base'
    default:
      return 'w-6 h-6 text-sm'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 10
    case 'lg':
      return 20
    default:
      return 14
  }
})
</script>

<template>
  <button
    v-if="interactive"
    type="button"
    :class="[
      'status-control',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      statusConfig.bgClass,
      statusConfig.borderClass,
      'hover:opacity-80',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      sizeClasses,
    ]"
    :disabled="!interactive"
    @click="onToggle"
    :aria-label="status === 'pending' ? 'Marcar como completada' : 'Marcar como pendiente'"
    :aria-pressed="status === 'completed'"
    role="switch"
    :aria-checked="status === 'completed'"
  >
    <component
      :is="statusConfig.icon"
      :size="iconSize"
      class="transition-colors"
      :class="status === 'completed' ? 'text-white' : 'text-secondary'"
      aria-hidden="true"
    />
  </button>

  <span
    v-else
    :class="[
      'status-badge',
      'inline-flex',
      'items-center',
      'gap-1.5',
      'rounded',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium',
      statusConfig.class,
    ]"
  >
    <component
      v-if="statusConfig.icon"
      :is="statusConfig.icon"
      class="icon"
      :size="12"
      aria-hidden="true"
      :class="status === 'completed' ? 'text-success' : 'text-secondary'"
    />
    <span>{{ statusConfig.label }}</span>
  </span>
</template>

<style scoped>
.status-control {
  border-width: 2px;
}

.status-control:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.status-completed {
  @apply bg-success border-success;
}

.status-pending {
  @apply bg-transparent border-secondary;
}

.status-badge {
  @apply bg-secondary/10 text-secondary;
}

.status-completed {
  @apply bg-success/10 text-success;
}
</style>