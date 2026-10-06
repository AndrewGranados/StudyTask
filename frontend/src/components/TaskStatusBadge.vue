<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type { TaskStatus } from '@/types/task'

interface Props {
  status: TaskStatus
}

const props = defineProps<Props>()

const statusConfig = computed(() => {
  switch (props.status) {
    case 'completed':
      return { label: 'Completada', class: 'badge-completed', icon: CheckCircle2 }
    case 'pending':
      return { label: 'Pendiente', class: 'badge-pending', icon: null }
  }
})
</script>

<template>
  <span class="badge" :class="statusConfig.class" style="display: inline-flex; align-items: center; gap: 4px;">
    <component v-if="statusConfig.icon" :is="statusConfig.icon" class="icon" :size="12" aria-hidden="true" />
    {{ statusConfig.label }}
  </span>
</template>