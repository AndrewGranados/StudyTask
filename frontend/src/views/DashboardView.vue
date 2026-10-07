<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore, useDashboard } from '@/stores/tasks'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { RouterLink } from 'vue-router'
import { Users, CheckCircle2, Clock, Flag, Calendar, TrendingUp, Plus } from 'lucide-vue-next'

const taskStore = useTaskStore()
const { stats, upcomingTasks, loading, error, loadDashboard } = useDashboard()
const { deleteTask, toggleStatus } = taskStore

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Dashboard</h1>
        <p class="dashboard-subtitle">Organiza tus tareas. Enfócate en lo importante.</p>
      </div>
      <RouterLink to="/tasks/new" class="btn btn-primary btn-lg">
        <Plus class="icon" :size="22" aria-hidden="true" />
        <span>Nueva tarea</span>
      </RouterLink>
    </div>

    <div class="dashboard-stats" role="region" aria-label="Estadísticas">
      <StatCard
        :value="stats.total"
        label="Total de tareas"
        :icon="Users"
        variant="primary"
      />
      <StatCard
        :value="stats.pending"
        label="Pendientes"
        :icon="Clock"
        variant="warning"
      />
      <StatCard
        :value="stats.completed"
        label="Completadas"
        :icon="CheckCircle2"
        variant="success"
      />
      <StatCard
        :value="stats.highPriority"
        label="Alta prioridad"
        :icon="Flag"
        variant="warning"
      />
      <StatCard
        :value="stats.upcoming"
        label="Próximas (7 días)"
        :icon="Calendar"
        variant="info"
      />
    </div>

    <section class="dashboard-section" aria-labelledby="upcoming-title">
      <div class="section-header">
        <h2 id="upcoming-title" class="section-title">
          <TrendingUp class="icon" :size="20" aria-hidden="true" />
          Próximas tareas
        </h2>
        <RouterLink to="/pending" class="section-link">Ver todas</RouterLink>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner" aria-hidden="true"></div>
        <p>Cargando tareas...</p>
      </div>

      <div v-else-if="error" class="error-state" role="alert">
        <p>{{ error }}</p>
        <button class="btn btn-secondary" @click="loadDashboard">Reintentar</button>
      </div>

      <div v-else-if="upcomingTasks.length === 0" class="empty-section">
        <EmptyState
          icon="check"
          title="¡Todo al día!"
          description="No tienes tareas próximas a vencer. Disfruta tu tiempo libre."
          actionText="Crear tarea"
          actionPath="/tasks/new"
        />
      </div>

      <div v-else class="task-list">
        <TaskCard
          v-for="task in upcomingTasks"
          :key="task.id"
          :task="task"
          @delete="deleteTask"
          @toggle="toggleStatus"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.dashboard-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.dashboard-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.dashboard-section {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
}

.section-link:hover {
  color: var(--color-primary-dark);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-section {
  padding: var(--space-4);
}

@media (max-width: 640px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-header .btn {
    width: 100%;
    justify-content: center;
  }

  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-section {
    padding: var(--space-4);
  }
}
</style>