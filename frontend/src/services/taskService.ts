import type { Task, TaskFormData, TaskFilters, DashboardStats } from '@/types/task'

const STORAGE_KEY = 'studytask_tasks'

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Investigar PWA',
    description: 'Investigar Service Workers, Cache API y Web App Manifest para el proyecto final.',
    subject: 'Desarrollo Web',
    dueDate: '2026-10-10',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Diseñar esquema ER',
    description: 'Crear diagrama entidad-relación para el sistema de gestión académica.',
    subject: 'Bases de Datos',
    dueDate: '2026-10-12',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-10-02T09:30:00Z',
    updatedAt: '2026-10-02T09:30:00Z',
  },
  {
    id: '3',
    title: 'Patrones de diseño',
    description: 'Estudiar Factory, Singleton, Observer y Strategy para el examen parcial.',
    subject: 'Ingeniería de Software',
    dueDate: '2026-10-08',
    priority: 'medium',
    status: 'pending',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-02T14:00:00Z',
  },
  {
    id: '4',
    title: 'Algoritmos de ordenamiento',
    description: 'Implementar QuickSort, MergeSort y HeapSort en Python.',
    subject: 'Programación',
    dueDate: '2026-10-15',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-09-28T11:00:00Z',
    updatedAt: '2026-10-03T16:00:00Z',
  },
  {
    id: '5',
    title: 'Planificación de procesos',
    description: 'Resolver ejercicios de FCFS, SJF, Round Robin y Prioridad.',
    subject: 'Sistemas Operativos',
    dueDate: '2026-10-20',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z',
  },
  {
    id: '6',
    title: 'Configurar VLANs',
    description: 'Practicar configuración de VLANs, trunking y routing inter-VLAN en Packet Tracer.',
    subject: 'Redes',
    dueDate: '2026-10-18',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-09-30T15:00:00Z',
    updatedAt: '2026-10-04T11:00:00Z',
  },
  {
    id: '7',
    title: 'App React Native básica',
    description: 'Crear aplicación de lista de tareas con navegación y estado global.',
    subject: 'Desarrollo Móvil',
    dueDate: '2026-10-25',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-10-04T09:00:00Z',
    updatedAt: '2026-10-04T09:00:00Z',
  },
  {
    id: '8',
    title: 'Normalización 3FN',
    description: 'Ejercicios de normalización hasta tercera forma normal.',
    subject: 'Bases de Datos',
    dueDate: '2026-10-07',
    priority: 'low',
    status: 'completed',
    createdAt: '2026-09-25T12:00:00Z',
    updatedAt: '2026-09-28T14:00:00Z',
  },
  {
    id: '9',
    title: 'Testing unitario con Vitest',
    description: 'Escribir pruebas para componentes Vue y composables.',
    subject: 'Desarrollo Web',
    dueDate: '2026-10-22',
    priority: 'medium',
    status: 'pending',
    createdAt: '2026-10-04T16:00:00Z',
    updatedAt: '2026-10-04T16:00:00Z',
  },
  {
    id: '10',
    title: 'Arquitectura limpia',
    description: 'Leer capítulos 1-5 y hacer resumen de Clean Architecture.',
    subject: 'Ingeniería de Software',
    dueDate: '2026-10-30',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
  },
  {
    id: '11',
    title: 'Memoria virtual y paginación',
    description: 'Entender TLB, page fault, algoritmos de reemplazo de página.',
    subject: 'Sistemas Operativos',
    dueDate: '2026-10-14',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-10-05T11:00:00Z',
    updatedAt: '2026-10-05T11:00:00Z',
  },
  {
    id: '12',
    title: 'Protocolo HTTP/2 y HTTP/3',
    description: 'Comparar características, multiplexación, server push, QUIC.',
    subject: 'Redes',
    dueDate: '2026-10-16',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-10-01T13:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z',
  },
]

function getStoredTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return mockTasks
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const taskService = {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    let tasks = getStoredTasks()

    if (filters) {
      if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status)
      }
      if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority)
      }
      if (filters.subject) {
        tasks = tasks.filter(t => t.subject === filters.subject)
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        tasks = tasks.filter(
          t =>
            t.title.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search) ||
            t.subject.toLowerCase().includes(search)
        )
      }
    }

    return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getById(id: string): Promise<Task | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    const tasks = getStoredTasks()
    return tasks.find(t => t.id === id) || null
  },

  async create(data: TaskFormData): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const tasks = getStoredTasks()
    const now = new Date().toISOString()
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }
    tasks.unshift(newTask)
    saveTasks(tasks)
    return newTask
  },

  async update(id: string, data: Partial<TaskFormData> & { status?: Task['status'] }): Promise<Task | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const tasks = getStoredTasks()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) return null

    tasks[index] = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    saveTasks(tasks)
    return tasks[index]
  },

  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const tasks = getStoredTasks()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) return false

    tasks.splice(index, 1)
    saveTasks(tasks)
    return true
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 50))
    const tasks = getStoredTasks()
    const now = new Date()
    const upcomingThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length,
      upcoming: tasks.filter(
        t => t.status === 'pending' && new Date(t.dueDate) <= upcomingThreshold
      ).length,
    }
  },

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    const tasks = getStoredTasks()
    const now = new Date()
    return tasks
      .filter(t => t.status === 'pending' && new Date(t.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit)
  },

  async getSubjects(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 50))
    const tasks = getStoredTasks()
    return [...new Set(tasks.map(t => t.subject))].sort()
  },
}