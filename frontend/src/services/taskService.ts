import type { Task, TaskFormData, TaskFilters, DashboardStats } from '@/types/task'
import { api } from './api'

export const taskService = {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const apiFilters: Record<string, string> = {}
    if (filters?.status) apiFilters.status = filters.status
    if (filters?.priority) apiFilters.priority = filters.priority
    if (filters?.subject) apiFilters.subject = filters.subject
    if (filters?.search) apiFilters.search = filters.search

    const tasks = await api.getAllTasks(apiFilters)

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      return tasks.filter(
        (t: Task) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.subject.toLowerCase().includes(search)
      )
    }

    return tasks
  },

  async getById(id: string): Promise<Task | null> {
    try {
      return await api.getTaskById(id)
    } catch {
      return null
    }
  },

  async create(data: TaskFormData): Promise<Task> {
    return await api.createTask(data)
  },

  async update(id: string, data: Partial<TaskFormData> & { status?: Task['status'] }): Promise<Task | null> {
    return await api.updateTask(id, data)
  },

  async delete(id: string): Promise<boolean> {
    return await api.deleteTask(id)
  },

  async toggleTaskStatus(id: string): Promise<Task | null> {
    return await api.toggleTaskStatus(id)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return await api.getDashboardStats()
  },

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    return await api.getUpcomingTasks(limit)
  },

  async getSubjects(): Promise<string[]> {
    return await api.getSubjects()
  },
}