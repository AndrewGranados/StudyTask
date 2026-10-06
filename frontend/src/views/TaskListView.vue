<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTasks } from '@/composables/useTasks'
import { useSubjects } from '@/composables/useTasks'
import TaskCard from '@/components/TaskCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { Search, Filter, X, ChevronDown } from 'lucide-vue-next'
import type { TaskFilters } from '@/types/task'

const route = useRoute()
const { tasks, loading, error, loadTasks, deleteTask, toggleStatus, setFilters, clearFilters, filters } = useTasks()
const { subjects, loadSubjects } = useSubjects()

const searchQuery = ref('')
const showFilters = ref(false)

onMounted(() => {
  if (route.name === 'CompletedTasks') {
    setFilters({ status: 'completed' })
  } else if (route.name === 'PendingTasks') {
    setFilters({ status: 'pending' })
  }
  loadTasks()
  loadSubjects()
})

watch(
  () => filters.value,
  () => {
    loadTasks()
  },
  { deep: true }
)

const handleSearch = () => {
  setFilters({ search: searchQuery.value })
}

const handleFilterChange = (key: keyof TaskFilters, value: string) => {
  if (value) {
    setFilters({ [key]: value })
  } else {
    const newFilters = { ...filters.value }
    delete newFilters[key]
    setFilters(newFilters)
  }
}

const hasActiveFilters = computed(() => {
  return Object.keys(filters.value).length > 0
})

const clearAllFilters = () => {
  clearFilters()
  searchQuery.value = ''
}

const pageTitle = computed(() => {
  if (route.name === 'CompletedTasks') return 'Tareas completadas'
  if (route.name === 'PendingTasks') return 'Tareas pendientes'
  return 'Todas las tareas'
})

const emptyIcon = computed(() => {
  if (route.name === 'CompletedTasks') return 'check'
  return 'clipboard'
})

const emptyTitle = computed(() => {
  if (route.name === 'CompletedTasks') return 'No hay tareas completadas'
  if (route.name === 'PendingTasks') return 'No tienes tareas pendientes'
  return 'No hay tareas'
})

const emptyDescription = computed(() => {
  if (route.name === 'CompletedTasks') return 'Cuando completes tareas aparecerán aquí.'
  if (route.name === 'PendingTasks') return '¡Todo al día! No tienes tareas pendientes.'
  return 'Crea tu primera tarea para empezar.'
})
</script>

<template>
  <div class="task-list-view">
    <div class="view-header">
      <div>
        <h1 class="view-title">{{ pageTitle }}</h1>
        <p class="view-subtitle">{{ tasks.length }} tarea{{ tasks.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="task-list-toolbar">
      <div class="search-box">
        <Search class="icon search-icon" :size="20" aria-hidden="true" />
        <input
          type="search"
          class="input search-input"
          v-model="searchQuery"
          placeholder="Buscar tareas..."
          @input="handleSearch"
          aria-label="Buscar tareas"
        />
      </div>

      <div class="filter-controls">
        <button
          class="btn btn-secondary btn-sm"
          @click="showFilters = !showFilters"
          :aria-expanded="showFilters"
          aria-controls="filter-panel"
        >
          <Filter class="icon" :size="18" aria-hidden="true" />
          <span>Filtros</span>
          <ChevronDown class="icon" :size="16" :class="{ rotated: showFilters }" aria-hidden="true" />
        </button>

        <button
          v-if="hasActiveFilters"
          class="btn btn-ghost btn-sm"
          @click="clearAllFilters"
          aria-label="Limpiar filtros"
        >
          <X class="icon" :size="18" aria-hidden="true" />
          <span>Limpiar</span>
        </button>
      </div>
    </div>

    <div id="filter-panel" class="filter-panel" v-show="showFilters" role="region" aria-label="Filtros">
      <div class="filter-row">
        <div class="filter-group">
          <label for="filter-status" class="label">Estado</label>
          <select
            id="filter-status"
            class="input"
            v-model="filters.status"
            @change="handleFilterChange('status', filters.status ?? '')"
          >
            <option value="">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-priority" class="label">Prioridad</label>
          <select
            id="filter-priority"
            class="input"
            v-model="filters.priority"
            @change="handleFilterChange('priority', filters.priority ?? '')"
          >
            <option value="">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-subject" class="label">Materia</label>
          <select
            id="filter-subject"
            class="input"
            v-model="filters.subject"
            @change="handleFilterChange('subject', filters.subject ?? '')"
          >
            <option value="">Todas</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner" aria-hidden="true"></div>
      <p>Cargando tareas...</p>
    </div>

    <div v-else-if="error" class="error-state" role="alert">
      <p>{{ error }}</p>
      <button class="btn btn-secondary" @click="loadTasks">Reintentar</button>
    </div>

    <div v-else-if="tasks.length === 0" class="empty-state-container">
      <EmptyState
        :icon="emptyIcon"
        :title="emptyTitle"
        :description="emptyDescription"
        actionText="Crear tarea"
        actionPath="/tasks/new"
      />
    </div>

    <div v-else class="task-grid">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete="deleteTask"
        @toggle="toggleStatus"
      />
    </div>
  </div>
</template>

<style scoped>
.task-list-view {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: var(--space-6);
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.view-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.task-list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem;
}

.filter-controls {
  display: flex;
  gap: var(--space-2);
}

.filter-panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  animation: slideDown var(--transition-fast);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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

.task-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-state-container {
  padding: var(--space-8) var(--space-4);
}

@media (max-width: 640px) {
  .task-list-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .filter-controls {
    justify-content: space-between;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>

