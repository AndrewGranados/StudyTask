import { defineStore } from 'pinia'
import { ref, computed, watchEffect, toValue } from 'vue'
import type { Task, TaskFormData, TaskFilters, DashboardStats } from '@/types/task'
import { taskService } from '@/services/taskService'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TaskFilters>({})

  const filteredTasks = computed(() => [...tasks.value])

  async function loadTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskService.getAll(filters.value)
    } catch (e) {
      error.value = 'Error al cargar las tareas'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function createTask(data: TaskFormData) {
    loading.value = true
    error.value = null
    try {
      const newTask = await taskService.create(data)
      tasks.value = [newTask, ...tasks.value]
      return newTask
    } catch (e) {
      error.value = 'Error al crear la tarea'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, data: Partial<TaskFormData> & { status?: Task['status'] }) {
    loading.value = true
    error.value = null
    try {
      const updated = await taskService.update(id, data)
      if (updated) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value = tasks.value.map((t, i) => i === index ? updated : t)
        }
      }
      return updated
    } catch (e) {
      error.value = 'Error al actualizar la tarea'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null
    try {
      const success = await taskService.delete(id)
      if (success) {
        tasks.value = tasks.value.filter(t => t.id !== id)
      }
      return success
    } catch (e) {
      error.value = 'Error al eliminar la tarea'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleStatus(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      return updateTask(id, { status: task.status === 'pending' ? 'completed' : 'pending' })
    }
    return null
  }

  function setFilters(newFilters: TaskFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    tasks: filteredTasks,
    loading,
    error,
    filters,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    setFilters,
    clearFilters,
  }
})

export function useTask(id: string | null | (() => string | null)) {
  const task = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadTask() {
    const currentId = toValue(id)
    if (!currentId) return
    loading.value = true
    error.value = null
    try {
      task.value = await taskService.getById(currentId)
    } catch (e) {
      error.value = 'Error al cargar la tarea'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    loadTask()
  })

  return {
    task,
    loading,
    error,
    loadTask,
  }
}

export function useDashboard() {
  const stats = ref<DashboardStats>({
    total: 0,
    pending: 0,
    completed: 0,
    highPriority: 0,
    upcoming: 0,
  })
  const upcomingTasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      stats.value = await taskService.getDashboardStats()
      upcomingTasks.value = await taskService.getUpcomingTasks(5)
    } catch (e) {
      error.value = 'Error al cargar el dashboard'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    upcomingTasks,
    loading,
    error,
    loadDashboard,
  }
}

export function useSubjects() {
  const subjects = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadSubjects() {
    loading.value = true
    error.value = null
    try {
      const apiSubjects = await taskService.getSubjects()
      // Always include default subjects, merged with API subjects
      const defaultSubjects: string[] = [
        'Programación',
        'Bases de Datos',
        'Desarrollo Web',
        'Desarrollo Móvil',
        'Arquitectura de Software',
        'Redes',
        'Sistemas Operativos',
        'Ingeniería de Software',
        'Seguridad Informática',
        'Inteligencia Artificial'
      ]
      // Merge API subjects with default subjects, removing duplicates
      const allSubjects = [...new Set([...apiSubjects, ...defaultSubjects])]
      subjects.value = allSubjects
    } catch (e) {
      error.value = 'Error al cargar las materias'
      console.error(e)
      const defaultSubjects: string[] = [
        'Programación',
        'Bases de Datos',
        'Desarrollo Web',
        'Desarrollo Móvil',
        'Arquitectura de Software',
        'Redes',
        'Sistemas Operativos',
        'Ingeniería de Software',
        'Seguridad Informática',
        'Inteligencia Artificial'
      ]
      subjects.value = defaultSubjects
    } finally {
      loading.value = false
    }
  }

  return {
    subjects,
    loading,
    error,
    loadSubjects,
  }
}