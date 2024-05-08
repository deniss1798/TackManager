<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <side-menu @openCreateTaskModal="openCreateTaskModal" />
      <div class="main-content">
        <router-view /> <!-- Этот тег отображает компоненты в зависимости от текущего маршрута -->
      </div>
      <modal-window v-if="showModal" @close="closeModal">
        <template #header>
          <h3>{{ taskId ? 'Редактировать задачу' : 'Создать задачу' }}</h3>
        </template>
        <template #body>
          <task-form :task-id="taskId" @task-updated="handleTaskUpdated" @task-created="handleTaskCreated" />
        </template>
      </modal-window>
    </template>
    <template v-else>
      <hello-world @loginSuccess="handleLoginSuccess" />
    </template>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import SideMenu from './components/SideMenu.vue';
import ModalWindow from './components/ModalWindow.vue';
import TaskForm from './components/TaskForm.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    SideMenu,
    ModalWindow,
    TaskForm
  },
  data() {
    return {
      isAuthenticated: false,
      showModal: false,
      taskId: null
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isAuthenticated = true;
    },
    openCreateTaskModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleTaskUpdated() {
      this.closeModal();
    },
    handleTaskCreated() {
      this.closeModal();
    }
  }
};
</script>

<style>
.main-content {
  margin-left: 200px; /* Отступ слева для основного содержимого, чтобы не перекрывать боковое меню */
  padding: 20px;
  min-height: 100vh; /* Минимальная высота вьюпорта */
}
</style>
