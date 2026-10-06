const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Error en la petición'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error?.message || errorData.message || errorMessage
    } catch {
      errorMessage = `Error HTTP ${response.status}: ${response.statusText}`
    }
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  async getAllTasks(filters?: Record<string, string>): Promise<any[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.subject) params.append('subject', filters.subject)

    const url = `${API_BASE_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    const data = await handleResponse<{ success: boolean; data: any[] }>(response)
    return data.data
  },

  async getTaskById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`)
    const data = await handleResponse<{ success: boolean; data: any }>(response)
    return data.data
  },

  async createTask(taskData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    const data = await handleResponse<{ success: boolean; data: any }>(response)
    return data.data
  },

  async updateTask(id: string, taskData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    const data = await handleResponse<{ success: boolean; data: any }>(response)
    return data.data
  },

  async toggleTaskStatus(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
    })
    const data = await handleResponse<{ success: boolean; data: any }>(response)
    return data.data
  },

  async deleteTask(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    })
    await handleResponse(response)
    return true
  },

  async getDashboardStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks`)
    const data = await handleResponse<{ success: boolean; data: any[] }>(response)
    const tasks = data.data
    const now = new Date()
    const upcomingThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
      total: tasks.length,
      pending: tasks.filter((t: any) => t.status === 'pending').length,
      completed: tasks.filter((t: any) => t.status === 'completed').length,
      highPriority: tasks.filter((t: any) => t.priority === 'high' && t.status === 'pending').length,
      upcoming: tasks.filter(
        (t: any) => t.status === 'pending' && new Date(t.dueDate) <= upcomingThreshold
      ).length,
    }
  },

  async getUpcomingTasks(limit = 5): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`)
    const data = await handleResponse<{ success: boolean; data: any[] }>(response)
    const tasks = data.data
    const now = new Date()
    return tasks
      .filter((t: any) => t.status === 'pending' && new Date(t.dueDate) >= now)
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit)
  },

  async getSubjects(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`)
    const data = await handleResponse<{ success: boolean; data: any[] }>(response)
    return [...new Set(data.data.map((t: any) => t.subject))].sort()
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      return data.success === true
    } catch {
      return false
    }
  },
}