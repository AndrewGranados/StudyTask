<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { RouterLink } from 'vue-router'
import { LayoutDashboard, CheckSquare, Clock, X, Plus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Tareas pendientes', path: '/pending', icon: Clock },
  { name: 'Tareas completadas', path: '/completed', icon: CheckSquare },
  { name: 'Todas las tareas', path: '/tasks', icon: CheckSquare },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
  uiStore.closeSidebar()
}
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{ 'sidebar-open': uiStore.sidebarOpen }"
    role="navigation"
    aria-label="Navegación principal"
  >
    <div class="sidebar-overlay" @click="uiStore.closeSidebar" v-if="uiStore.sidebarOpen" aria-hidden="true" />

    <div class="sidebar-content">
      <div class="sidebar-header">
        <RouterLink to="/" class="sidebar-brand" @click="uiStore.closeSidebar">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>StudyTask</span>
        </RouterLink>
        <button
          class="btn btn-ghost btn-icon sidebar-close"
          @click="uiStore.closeSidebar"
          aria-label="Cerrar menú"
          v-if="uiStore.sidebarOpen"
        >
          <X class="icon" :size="24" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list" role="list">
          <li v-for="item in navItems" :key="item.path">
            <button
              class="nav-link"
              :class="{ 'nav-link-active': isActive(item.path) }"
              @click="navigate(item.path)"
              :aria-current="isActive(item.path) ? 'page' : undefined"
            >
              <component :is="item.icon" class="icon" :size="22" aria-hidden="true" />
              <span>{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <RouterLink to="/tasks/new" class="btn btn-primary btn-block" @click="uiStore.closeSidebar">
          <Plus class="icon" :size="20" aria-hidden="true" />
          <span>Nueva tarea</span>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 280px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  z-index: 30;
  transform: translateX(-100%);
  transition: transform var(--transition);
  display: flex;
  flex-direction: column;
}

.app-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.3);
  z-index: 20;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-4);
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2);
  margin-bottom: var(--space-4);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.125rem;
  padding: var(--space-2);
  border-radius: var(--radius);
  transition: background-color var(--transition-fast);
  flex: 1;
}

.sidebar-brand:hover {
  background-color: var(--color-background);
  color: var(--color-primary);
}

.brand-icon {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.sidebar-close {
  color: var(--color-text-secondary);
}

.sidebar-close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

.sidebar-nav {
  flex: 1;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

.nav-link-active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.nav-link-active:hover {
  color: var(--color-primary-dark);
  background-color: var(--color-primary-light);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.btn-block {
  width: 100%;
  justify-content: center;
}

@media (min-width: 769px) {
  .app-sidebar {
    position: sticky;
    top: 64px;
    transform: none;
    height: calc(100vh - 64px);
    border-right: 1px solid var(--color-border);
    z-index: 10;
  }

  .sidebar-overlay {
    display: none;
  }

  .sidebar-close {
    display: none;
  }

  .sidebar-header {
    justify-content: flex-start;
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-4);
  }
}
</style>