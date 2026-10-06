<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle2, ClipboardList, Plus } from 'lucide-vue-next'

interface Props {
  icon?: 'check' | 'clipboard'
  title: string
  description: string
  actionText?: string
  actionPath?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'clipboard',
  actionText: 'Crear tarea',
  actionPath: '/tasks/new',
})

const icons = {
  check: CheckCircle2,
  clipboard: ClipboardList,
}

const iconColor = computed(() => {
  return props.icon === 'check' ? 'var(--color-success)' : 'var(--color-text-secondary)'
})
</script>

<template>
  <div class="empty-state" role="status">
    <component
      :is="icons[props.icon]"
      class="empty-state-icon"
      aria-hidden="true"
      :style="{ color: iconColor }"
    />
    <h3 class="empty-state-title">{{ title }}</h3>
    <p class="empty-state-description">{{ description }}</p>
    <RouterLink v-if="actionPath" :to="actionPath" class="btn btn-primary">
      <Plus class="icon" :size="20" aria-hidden="true" />
      <span>{{ actionText }}</span>
    </RouterLink>
  </div>
</template>