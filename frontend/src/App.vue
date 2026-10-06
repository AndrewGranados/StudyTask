<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <div class="app-main">
      <AppSidebar />
      <main class="app-content" role="main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  min-width: 0;
}

@media (max-width: 768px) {
  .app-content {
    padding: var(--space-4);
  }
}
</style>