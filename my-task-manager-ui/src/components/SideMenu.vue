<template>
  <div>
    <div class="side-menu" :class="{ closed: !isMenuOpen }">
      <button @click="toggleMenu" class="menu-button">&#9776;</button>
      <h3>Меню</h3>
            <button @click="showCreateTaskModal" class="create-task-button">Создать задачу</button>

  <ul>
<li><router-link to="/user-profile">Профиль</router-link></li>
  <li><router-link to="/tasks">Задачи</router-link></li>
  <li><router-link to="/dashboard">Доска</router-link></li>
</ul>

      <!-- Кнопка создания задачи, расположенная внизу меню -->
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
  margin-top: 10px; /* Уменьшение отступа сверху для более высокого расположения */
  width: calc(100% - 40px);
  padding: 8px 12px;
  left: 20px; /* Отступ слева */
  font-size: 18px;
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 0 5px 5px 0; /* Скругление углов */
  z-index: 2; /* Убедитесь, что кнопка всегда находится поверх всех элементов */
}
</style>
