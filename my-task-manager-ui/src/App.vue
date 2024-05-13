<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <side-menu @logout="logout" @openCreateTaskModal="openCreateTaskModal" />
      <div class="main-content">
        <router-view />
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
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.checkAuthentication();
      }
    }
  },
  methods: {
    handleLoginSuccess(token) {
      localStorage.setItem('userToken', token);
      this.isAuthenticated = true;
      this.checkAuthentication();
      this.$router.push('/user-profile');
    },
    checkAuthentication() {
      this.isAuthenticated = !!localStorage.getItem('userToken');
      if (!this.isAuthenticated) {
        this.$router.push('/login');
      }
    },
    logout() {
      localStorage.removeItem('userToken');
      this.isAuthenticated = false;
      this.checkAuthentication();
      this.$router.push('/login');
    },
    openCreateTaskModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.taskId = null;
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
