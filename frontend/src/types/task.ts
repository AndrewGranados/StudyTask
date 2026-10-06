export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  subject: string
  dueDate: string
  priority: TaskPriority
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  subject?: string
  search?: string
}

export interface DashboardStats {
  total: number
  pending: number
  completed: number
  highPriority: number
  upcoming: number
}