<script setup lang="ts">
import { computed } from 'vue'
import type { TaskPriority } from '@/types/task'

interface Props {
  priority: TaskPriority
}

const props = defineProps<Props>()

const priorityConfig = computed(() => {
  switch (props.priority) {
    case 'high':
      return { label: 'Alta', class: 'badge-high' }
    case 'medium':
      return { label: 'Media', class: 'badge-medium' }
    case 'low':
      return { label: 'Baja', class: 'badge-low' }
  }
})
</script>

<template>
  <span class="badge" :class="priorityConfig.class">
    {{ priorityConfig.label }}
  </span>
</template>