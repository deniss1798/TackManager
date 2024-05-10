<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <side-menu @openCreateTaskModal="openCreateTaskModal" />
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
  created() {
    this.checkAuthentication(); // Проверка состояния аутентификации при создании компонента
  },

methods: {
  handleLoginSuccess(token) {
    // Сохраняем полученный токен в localStorage
localStorage.setItem('userToken', token);
    this.isAuthenticated = true; // Обновляем состояние аутентификации
    this.$router.push('/user-profile'); // Перенаправляем на страницу профиля
  },
 checkAuthentication() {
  this.isAuthenticated = !!localStorage.getItem('userToken');
  if (!this.isAuthenticated) {
    this.$router.push('/login');
  } else {
    this.$router.push('/user-profile'); // Указать маршрут по умолчанию для аутентифицированных пользователей
  }
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
