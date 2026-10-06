import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: () => import('@/views/TaskListView.vue'),
    meta: { title: 'Todas las tareas' },
  },
  {
    path: '/tasks/new',
    name: 'TaskCreate',
    component: () => import('@/views/TaskFormView.vue'),
    meta: { title: 'Nueva tarea' },
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('@/views/TaskDetailView.vue'),
    meta: { title: 'Detalle de tarea' },
    props: true,
  },
  {
    path: '/tasks/:id/edit',
    name: 'TaskEdit',
    component: () => import('@/views/TaskFormView.vue'),
    meta: { title: 'Editar tarea' },
    props: true,
  },
  {
    path: '/completed',
    name: 'CompletedTasks',
    component: () => import('@/views/TaskListView.vue'),
    meta: { title: 'Tareas completadas' },
    props: { initialFilters: { status: 'completed' } },
  },
  {
    path: '/pending',
    name: 'PendingTasks',
    component: () => import('@/views/TaskListView.vue'),
    meta: { title: 'Tareas pendientes' },
    props: { initialFilters: { status: 'pending' } },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title as string} | StudyTask`
  next()
})

export default router