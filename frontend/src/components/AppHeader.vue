<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useUIStore } from '@/stores/ui'
import { LayoutDashboard, CheckSquare, Clock, Plus, Menu } from 'lucide-vue-next'

const route = useRoute()
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
</script>

<template>
  <header class="app-header" role="banner">
    <div class="header-content">
      <button
        class="btn btn-ghost btn-icon header-menu-btn"
        @click="uiStore.toggleSidebar"
        :aria-label="uiStore.sidebarOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="uiStore.sidebarOpen"
      >
        <Menu class="icon" :size="24" />
      </button>

      <RouterLink to="/" class="header-brand" aria-label="StudyTask - Inicio">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span class="brand-text">StudyTask</span>
      </RouterLink>

      <nav class="header-nav" aria-label="Navegación principal">
        <ul class="nav-list" role="list">
          <li v-for="item in navItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link-active': isActive(item.path) }"
              :aria-current="isActive(item.path) ? 'page' : undefined"
            >
              <component :is="item.icon" class="icon" :size="20" aria-hidden="true" />
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <RouterLink to="/tasks/new" class="btn btn-primary header-new-task">
          <Plus class="icon" :size="20" aria-hidden="true" />
          <span>Nueva tarea</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  padding: var(--space-2);
  border-radius: var(--radius);
  transition: background-color var(--transition-fast);
}

.header-brand:hover {
  background-color: var(--color-background);
  color: var(--color-primary);
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

.brand-text {
  white-space: nowrap;
}

.header-nav {
  display: none;
  flex: 1;
  justify-content: center;
}

.nav-list {
  display: flex;
  gap: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
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

.header-actions {
  display: flex;
  gap: var(--space-2);
}

.header-menu-btn {
  display: flex;
  color: var(--color-text-secondary);
}

.header-menu-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

@media (min-width: 769px) {
  .header-menu-btn {
    display: none;
  }

  .header-nav {
    display: flex;
  }

  .brand-text {
    display: inline;
  }
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }

  .header-new-task span {
    display: none;
  }
}
</style>