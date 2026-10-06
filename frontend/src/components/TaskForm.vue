<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSubjects } from '@/composables/useTasks'
import type { TaskFormData, TaskPriority } from '@/types/task'

interface Props {
  initialData?: Partial<TaskFormData>
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
})

const emit = defineEmits<{
  submit: [data: TaskFormData]
  cancel: []
}>()

const { subjects, loadSubjects } = useSubjects()

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

const priorityOptions = [
  { value: 'low' as TaskPriority, label: 'Baja' },
  { value: 'medium' as TaskPriority, label: 'Media' },
  { value: 'high' as TaskPriority, label: 'Alta' },
] as const

const isValid = computed(() => {
  return (
    formData.value.title.trim() &&
    formData.value.subject.trim() &&
    formData.value.dueDate &&
    !Object.values(errors.value).some(e => e)
  )
})

const priorityModel = ref<TaskPriority>(formData.value.priority)

watch(priorityModel, (value) => {
  formData.value.priority = value
})

watch(() => formData.value.priority, (value) => {
  priorityModel.value = value
})

const isPrioritySelected = (value: TaskPriority) => priorityModel.value === value

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

async function handleSubmit() {
  if (!validateForm()) return

  submitting.value = true
  submitError.value = null

  emit('submit', { ...formData.value })
}

function handleCancel() {
  emit('cancel')
}

function initForm() {
  if (props.initialData) {
    formData.value = { ...formData.value, ...props.initialData }
  }

  loadSubjects()
  formData.value.dueDate = today
}

watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...formData.value, ...newData }
  }
}, { deep: true })

initForm()
</script>

<template>
  <form @submit.prevent="handleSubmit" class="task-form" novalidate>
    <div v-if="submitError" class="form-alert" role="alert">
      {{ submitError }}
    </div>

    <div class="form-group">
      <label for="title" class="label">Título <span class="required" aria-hidden="true">*</span></label>
      <input
        id="title"
        type="text"
        class="input"
        :class="{ 'input-error': errors.title }"
        v-model="formData.title"
        placeholder="¿Qué necesitas hacer?"
        maxlength="100"
        @blur="validateField('title')"
        @input="validateField('title')"
        aria-required="true"
        :aria-invalid="!!errors.title"
        :aria-describedby="errors.title ? 'title-error' : undefined"
        autocomplete="off"
      />
      <span v-if="errors.title" id="title-error" class="form-error" role="alert">{{ errors.title }}</span>
    </div>

    <div class="form-group">
      <label for="description" class="label">Descripción</label>
      <textarea
        id="description"
        class="input"
        v-model="formData.description"
        placeholder="Detalles adicionales (opcional)"
        rows="4"
        maxlength="500"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="subject" class="label">Materia <span class="required" aria-hidden="true">*</span></label>
      <select
        id="subject"
        class="input"
        :class="{ 'input-error': errors.subject }"
        v-model="formData.subject"
        @blur="validateField('subject')"
        @change="validateField('subject')"
        aria-required="true"
        :aria-invalid="!!errors.subject"
        :aria-describedby="errors.subject ? 'subject-error' : undefined"
      >
        <option value="">Selecciona una materia</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
      </select>
      <span v-if="errors.subject" id="subject-error" class="form-error" role="alert">{{ errors.subject }}</span>
    </div>

    <div class="form-group">
      <label for="dueDate" class="label">Fecha límite <span class="required" aria-hidden="true">*</span></label>
      <input
        id="dueDate"
        type="date"
        class="input"
        :class="{ 'input-error': errors.dueDate }"
        v-model="formData.dueDate"
        :min="today"
        @blur="validateField('dueDate')"
        @change="validateField('dueDate')"
        aria-required="true"
        :aria-invalid="!!errors.dueDate"
        :aria-describedby="errors.dueDate ? 'dueDate-error' : undefined"
      />
      <span v-if="errors.dueDate" id="dueDate-error" class="form-error" role="alert">{{ errors.dueDate }}</span>
    </div>

    <div class="form-group">
      <label class="label">Prioridad <span class="required" aria-hidden="true">*</span></label>
      <div class="priority-options" role="radiogroup" aria-label="Prioridad">
        <label
          v-for="option in priorityOptions"
          :key="option.value"
          class="priority-option"
          :class="{ 'priority-option-selected': isPrioritySelected(option.value) }"
        >
          <input
            type="radio"
            name="priority"
            :value="option.value"
            v-model="priorityModel"
            class="priority-option-input"
            :aria-label="`${option.label} priority`"
          />
          <span class="priority-option-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!isValid || submitting">
        <span v-if="submitting">Guardando...</span>
        <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }}</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  max-width: 48rem;
  margin: 0 auto;
}

.form-alert {
  padding: var(--space-3) var(--space-4);
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: var(--radius);
  color: var(--color-error);
  margin-bottom: var(--space-6);
  font-size: 0.875rem;
}

.required {
  color: var(--color-error);
}

.priority-options {
  display: flex;
  gap: var(--space-3);
}

.priority-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.priority-option:hover {
  border-color: var(--color-text-secondary);
  background-color: var(--color-background);
}

.priority-option-selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.priority-option-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.priority-option-label {
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 480px) {
  .priority-options {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
