<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTask } from '@/composables/useTasks'
import { useTasks } from '@/composables/useTasks'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import TaskStatusBadge from '@/components/TaskStatusBadge.vue'
import TaskPriorityBadge from '@/components/TaskPriorityBadge.vue'
import Toast from '@/components/Toast.vue'
import { RouterLink } from 'vue-router'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, BookOpen, Flag, Circle, Clock, CheckCircle2, Edit2, Trash2, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const taskId = () => route.params.id as string

const { task, loading, error, loadTask } = useTask(taskId)
const { updateTask, deleteTask } = useTasks()
const { success: showSuccess, error: showError } = useToast()

const showDeleteDialog = ref(false)

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
}

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'dd \'de\' MMMM \'de\' yyyy, HH:mm', { locale: es })
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return Flag
    case 'medium':
      return Flag
    case 'low':
      return Circle
  }
}

const handleToggleStatus = async () => {
  if (!task.value) return
  const newStatus = task.value.status === 'pending' ? 'completed' : 'pending'
  try {
    await updateTask(task.value.id, { status: newStatus })
    showSuccess(newStatus === 'completed' ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente')
    loadTask()
  } catch (e) {
    showError('Error al cambiar el estado de la tarea')
    console.error(e)
  }
}

const handleDelete = async () => {
  if (!task.value) return
  try {
    const success = await deleteTask(task.value.id)
    if (success) {
      showSuccess('Tarea eliminada correctamente')
      showDeleteDialog.value = false
      router.push({ name: 'TaskList' })
    }
  } catch (e) {
    showError('Error al eliminar la tarea')
    console.error(e)
  }
}

onMounted(() => {
  loadTask()
})
</script>

<template>
  <div class="task-detail-view">
    <div v-if="loading" class="loading-state">
      <div class="spinner" aria-hidden="true"></div>
      <p>Cargando tarea...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <p>{{ error }}</p>
      <RouterLink to="/tasks" class="btn btn-primary">Volver a la lista</RouterLink>
    </div>

    <div v-else-if="task" class="task-detail">
      <div class="detail-header">
        <RouterLink to="/tasks" class="btn btn-ghost btn-icon back-btn" aria-label="Volver">
          <ArrowLeft class="icon" :size="20" />
        </RouterLink>
        <div class="detail-header-content">
          <h1 class="detail-title">{{ task.title }}</h1>
          <div class="detail-badges">
            <TaskStatusBadge :status="task.status" />
            <TaskPriorityBadge :priority="task.priority" />
          </div>
        </div>
        <div class="detail-actions">
          <RouterLink :to="`/tasks/${task.id}/edit`" class="btn btn-secondary">
            <Edit2 class="icon" :size="18" aria-hidden="true" />
            <span>Editar</span>
          </RouterLink>
          <button
            class="btn"
            :class="task.status === 'pending' ? 'btn-success' : 'btn-secondary'"
            @click="handleToggleStatus"
          >
            <CheckCircle2 class="icon" :size="18" aria-hidden="true" />
            <span>{{ task.status === 'pending' ? 'Completar' : 'Reabrir' }}</span>
          </button>
          <button
            class="btn btn-danger"
            @click="showDeleteDialog = true"
          >
            <Trash2 class="icon" :size="18" aria-hidden="true" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-main">
          <section class="detail-section" aria-labelledby="description-title">
            <h2 id="description-title" class="detail-section-title">
              <BookOpen class="icon" :size="20" aria-hidden="true" />
              Descripción
            </h2>
            <p class="detail-description" v-if="task.description">{{ task.description }}</p>
            <p class="detail-description empty" v-else>Sin descripción</p>
          </section>

          <section class="detail-section" aria-labelledby="info-title">
            <h2 id="info-title" class="detail-section-title">
              <Clock class="icon" :size="20" aria-hidden="true" />
              Información
            </h2>
            <dl class="detail-info">
              <div class="detail-info-item">
                <dt>Materia</dt>
                <dd><BookOpen class="icon" :size="16" aria-hidden="true" /> {{ task.subject }}</dd>
              </div>
              <div class="detail-info-item">
                <dt>Fecha límite</dt>
                <dd><Calendar class="icon" :size="16" aria-hidden="true" /> {{ formatDate(task.dueDate) }}</dd>
              </div>
              <div class="detail-info-item">
                <dt>Prioridad</dt>
                <dd>
                  <component :is="getPriorityIcon(task.priority)" class="icon" :size="16" aria-hidden="true" />
                  <TaskPriorityBadge :priority="task.priority" />
                </dd>
              </div>
              <div class="detail-info-item">
                <dt>Estado</dt>
                <dd><TaskStatusBadge :status="task.status" /></dd>
              </div>
              <div class="detail-info-item">
                <dt>Creada</dt>
                <dd><Clock class="icon" :size="16" aria-hidden="true" /> {{ formatDateTime(task.createdAt) }}</dd>
              </div>
              <div class="detail-info-item">
                <dt>Actualizada</dt>
                <dd><Clock class="icon" :size="16" aria-hidden="true" /> {{ formatDateTime(task.updatedAt) }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="¿Eliminar esta tarea?"
      message="Esta acción no se puede deshacer. La tarea se eliminará permanentemente."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      variant="danger"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />

    <Toast />
  </div>
</template>

<style scoped>
.task-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
  color: var(--color-text-secondary);
  gap: var(--space-4);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.task-detail {
  animation: fadeIn var(--transition);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

.back-btn {
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.detail-header-content {
  flex: 1;
  min-width: 0;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  line-height: 1.3;
}

.detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.detail-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.detail-content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.detail-section {
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border).
}

.detail-section:last-child {
  padding-bottom: 0;
  border-bottom: none.
}

.detail-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4).
}

.detail-description {
  color: var(--color-text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
}

.detail-description.empty {
  font-style: italic;
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.detail-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.detail-info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.detail-info-item dt {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-info-item dd {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.detail-info-item dd .icon {
  color: var(--color-text-secondary);
}

.btn-success {
  background-color: var(--color-success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #15803d;
}

@media (max-width: 640px) {
  .detail-header {
    flex-direction: column;
    align-items: stretch;
  }

  .detail-actions {
    justify-content: stretch;
  }

  .detail-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .detail-content {
    padding: var(--space-4);
  }

  .detail-info {
    grid-template-columns: 1fr;
  }
}
</style>