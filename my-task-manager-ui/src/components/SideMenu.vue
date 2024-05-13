<template>
  <div>
    <div class="side-menu" :class="{ closed: !isMenuOpen }">
      <button @click.stop="toggleMenu" class="menu-button">&#9776;</button>
      <ul>
        <li><router-link to="/user-profile"><i class="fas fa-user-circle"></i> Профиль</router-link></li>
        <li><router-link to="/tasks"><i class="fas fa-tasks"></i> Задачи</router-link></li>
        <li><router-link to="/dashboard"><i class="fas fa-columns"></i> Доска</router-link></li>
<li class="logout-button" @click="logout"><i class="fas fa-sign-out-alt"></i> Выйти</li>
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
      this.$emit('openCreateTaskModal');
    },
 logout() {
    localStorage.removeItem('userToken');
    this.isMenuOpen = false; // Закрываем меню
    this.$nextTick(() => {
      this.$router.push('/login'); // Переход на страницу входа
    });
  },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
</script>


<style scoped>

/* Добавленные стили для кнопки "Выйти" */
.logout-button {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: block;
  padding: 10px 20px;
  transition: background-color 0.3s, color 0.3s;
}

.logout-button:hover {
  background-color: #dc3545; /* Красный цвет фона при наведении для выделения действия "выход" */
  color: white; /* Белый текст при наведении */
}

/* Стилизация иконки выхода */
.logout-button i {
  margin-right: 5px; /* Отступ иконки от текста */
}
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

.menu-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
  position: absolute;
  top: 12px;
  right: -40px; /* Регулировка позиции кнопки для доступности */
  z-index: 2; /* Убедитесь, что кнопка всегда находится поверх всех элементов */
}

.create-task-button {
  width: 100%;
 margin-top: auto; /* Это автоматически поднимет кнопку вверх */
  margin-bottom: 20px; /* Добавим немного места снизу */
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  border-radius: 0 5px 5px 0;
  display: block; /* Гарантируем, что кнопка растягивается на всю ширину */
}

ul {
  list-style: n3ne;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

li {
  margin: 10px 0;
  background-color: #495057;
  border-radius: 5px;
}

li:hover {
  background-color: #adb5bd;
}

a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: block;
  padding: 10px 20px;
  transition: background-color 0.3s;
}

</style>
