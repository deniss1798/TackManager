<template>
  <div>
    <div class="side-menu" :class="{ closed: !isMenuOpen }">
      <button @click="toggleMenu" class="menu-button">&#9776; </button>
      <ul>
        <li><router-link to="/user-profile"><i class="fas fa-user-circle"></i> Профиль</router-link></li>
        <li><router-link to="/tasks"><i class="fas fa-tasks"></i> Задачи</router-link></li>
        <li><router-link to="/dashboard"><i class="fas fa-columns"></i> Доска</router-link></li>
      </ul>
      <button @click="showCreateTaskModal" class="create-task-button">Создать задачу</button>
    </div>
  </div>
</template>

<script>


export default {
  name: 'SideMenu',
  data() {
    return {
      isMenuOpen: true,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    showCreateTaskModal() {
      this.$emit('openCreateTaskModal'); // Испускаем событие вверх по иерархии
    }
  }
}

</script>

<style scoped>


.side-menu {
  width: 200px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #343a40; /* Темный фон */
  padding-top: 20px;
  transition: transform 0.3s;
  transform: translateX(0);
  box-shadow: 2px 0 5px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.side-menu.closed {
  transform: translateX(-100%);
}

.side-menu .menu-button, .side-menu .create-task-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
}

.create-task-button {
  width: 100% !important; /* Расширение на всю доступную ширину */
  margin-top: 20px !important; /* Уменьшение отступа сверху для поднятия кнопки */
  padding: 8px 12px !important;
  background-color: #007bff !important;
  color: white !important;
  border: none !important;
  font-size: 18px !important;
  cursor: pointer !important;
  border-radius: 0 5px 5px 0 !important;
}

.side-menu h3 {
  color: white;
  padding-left: 20px;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.side-menu li {
  margin: 10px 0;
  background-color: #495057;
  border-radius: 5px;
}

.side-menu li:hover {
  background-color: #adb5bd;
}

.side-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: block;
  padding: 10px 20px;
  transition: background-color 0.3s;
}

.side-menu .menu-button {
  position: absolute;
  top: 12px;
  right: -40px; /* Регулировка позиции кнопки для доступности */
  z-index: 2; /* Убедитесь, что кнопка всегда находится поверх всех элементов */
}
</style>
