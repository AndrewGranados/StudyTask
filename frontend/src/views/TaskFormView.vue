<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore, useTask, useSubjects } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import TaskForm from '@/components/TaskForm.vue'
import Toast from '@/components/Toast.vue'
import { ArrowLeft } from 'lucide-vue-next'
import type { TaskFormData } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { success: showSuccess, error: showError } = useToast()

const taskId = () => (route.params.id as string) || null
const isEditing = computed(() => route.name === 'TaskEdit')

const { createTask, updateTask } = taskStore
const { task: existingTask, loadTask: loadExistingTaskData } = useTask(taskId)
const { loadSubjects } = useSubjects()

const formData = ref<TaskFormData>({
  title: '',
  description: '',
  subject: '',
  dueDate: '',
  priority: 'medium',
})

const errors = ref<Partial<Record<keyof TaskFormData, string>>>({})
const submitting = ref(false)
const submitError = ref<string | null>(null)

const today = new Date().toISOString().split('T')[0]

const isValid = computed(() =>
  formData.value.title.trim() &&
  formData.value.subject.trim() &&
  formData.value.dueDate &&
  !Object.values(errors.value).some(e => e)
)

function validateField(field: keyof TaskFormData) {
  switch (field) {
    case 'title':
      if (!formData.value.title.trim()) {
        errors.value.title = 'El título es obligatorio'
      } else if (formData.value.title.trim().length < 3) {
        errors.value.title = 'El título debe tener al menos 3 caracteres'
      } else {
        errors.value.title = undefined
      }
      break
    case 'subject':
      if (!formData.value.subject.trim()) {
        errors.value.subject = 'La materia es obligatoria'
      } else {
        errors.value.subject = undefined
      }
      break
    case 'dueDate':
      if (!formData.value.dueDate) {
        errors.value.dueDate = 'La fecha límite es obligatoria'
      } else {
        errors.value.dueDate = undefined
      }
      break
  }
}

function validateForm() {
  validateField('title')
  validateField('subject')
  validateField('dueDate')
  return isValid.value
}

async function loadExistingTask() {
  await loadExistingTaskData()
  if (existingTask.value) {
    formData.value = {
      title: existingTask.value.title,
      description: existingTask.value.description,
      subject: existingTask.value.subject,
      dueDate: existingTask.value.dueDate,
      priority: existingTask.value.priority,
    }
  }
}

async function handleSubmit(data: TaskFormData) {
  if (!validateForm()) return

  submitting.value = true
  submitError.value = null

  try {
    if (isEditing.value && taskId()) {
      await updateTask(taskId()!, data)
      showSuccess('Tarea actualizada correctamente')
    } else {
      await createTask(data)
      showSuccess('Tarea creada correctamente')
    }
    router.push({ name: 'TaskList' })
  } catch (e) {
    const errorMessage = isEditing.value ? 'Error al actualizar la tarea' : 'Error al crear la tarea'
    submitError.value = errorMessage
    showError(errorMessage)
    console.error(e)
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.push({ name: 'TaskList' })
}

onMounted(() => {
  loadSubjects()
  formData.value.dueDate = today

  if (isEditing.value) {
    loadExistingTask()
  }
})
</script>

<template>
  <div class="task-form-view">
    <div class="form-view-header">
      <RouterLink to="/tasks" class="btn btn-ghost btn-icon back-btn" aria-label="Volver">
        <ArrowLeft class="icon" :size="22" />
      </RouterLink>
      <div>
        <h1 class="form-view-title">{{ isEditing ? 'Editar tarea' : 'Nueva tarea' }}</h1>
        <p class="form-view-subtitle">{{ isEditing ? 'Actualiza los detalles de la tarea' : 'Crea una nueva tarea para organizar tu estudio' }}</p>
      </div>
    </div>

    <TaskForm
      :initial-data="formData"
      :is-editing="isEditing"
      :submitting="submitting"
      :submit-error="submitError"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <Toast />
  </div>
</template>

<style scoped>
.task-form-view {
  max-width: 720px;
  margin: 0 auto;
}

.form-view-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.back-btn {
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.form-view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.form-view-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .form-view-header {
    flex-direction: column;
    align-items: stretch;
  }

  .back-btn {
    align-self: flex-start;
  }
}
</style>
