<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { RouterLink } from 'vue-router'
import { Calendar, Flag, Circle, Square, CheckCircle2, Trash2, Edit2 } from 'lucide-vue-next'
import TaskPriorityBadge from '@/components/TaskPriorityBadge.vue'
import TaskStatusBadge from '@/components/TaskStatusBadge.vue'
import type { Task } from '@/types/task'

interface Props {
  task: Task
}

const { task } = defineProps<Props>()
const emit = defineEmits<{
  delete: [id: string]
  toggle: [id: string]
  edit: [id: string]
}>()

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy', { locale: es })
}

const getPriorityIcon = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return Flag
    case 'medium':
      return Flag
    case 'low':
      return Circle
  }
}
</script>

<template>
  <article class="task-card">
    <div class="task-card-header">
      <h3 class="task-card-title">{{ task.title }}</h3>
      <p class="task-card-subject">{{ task.subject }}</p>
    </div>

    <div class="task-card-meta">
      <div class="task-card-meta-item">
        <Calendar class="icon" :size="14" aria-hidden="true" />
        <span>{{ formatDate(task.dueDate) }}</span>
      </div>
      <div class="task-card-meta-item">
        <component :is="getPriorityIcon(task.priority)" class="icon" :size="14" aria-hidden="true" />
        <TaskPriorityBadge :priority="task.priority" />
      </div>
      <div class="task-card-meta-item">
        <TaskStatusBadge :status="task.status" />
      </div>
    </div>

    <div class="task-card-actions">
      <RouterLink
        :to="`/tasks/${task.id}`"
        class="btn btn-ghost btn-sm btn-icon"
        aria-label="Ver detalle"
      >
        <Circle class="icon" :size="18" aria-hidden="true" />
      </RouterLink>

      <button
        v-if="task.status === 'pending'"
        class="btn btn-ghost btn-sm btn-icon"
        @click="emit('toggle', task.id)"
        aria-label="Marcar como completada"
      >
        <Square class="icon" :size="18" aria-hidden="true" />
      </button>

      <button
        v-else
        class="btn btn-ghost btn-sm btn-icon text-success"
        @click="emit('toggle', task.id)"
        aria-label="Marcar como pendiente"
      >
        <CheckCircle2 class="icon" :size="18" aria-hidden="true" />
      </button>

      <RouterLink
        :to="`/tasks/${task.id}/edit`"
        class="btn btn-ghost btn-sm btn-icon"
        aria-label="Editar tarea"
      >
        <Edit2 class="icon" :size="18" aria-hidden="true" />
      </RouterLink>

      <button
        class="btn btn-ghost btn-sm btn-icon btn-danger"
        @click="emit('delete', task.id)"
        aria-label="Eliminar tarea"
      >
        <Trash2 class="icon" :size="18" aria-hidden="true" />
      </button>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.task-card-header {
  margin-bottom: var(--space-3);
}

.task-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
  line-height: 1.4;
}

.task-card-subject {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

.task-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.task-card-meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.task-card-actions {
  display: flex;
  gap: var(--space-1);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.task-card-actions .btn {
  flex: 1;
  max-width: 44px;
}

.task-card-actions .btn:first-child {
  flex: 2;
  max-width: none;
}

@media (max-width: 480px) {
  .task-card-actions .btn {
    padding: var(--space-2);
  }

  .task-card-actions .btn:first-child {
    flex: 1;
  }
}
</style>