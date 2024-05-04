<template>
  <div class="profile-container">
    <h2>Личный кабинет</h2>
      <div class="user-info">
    <!-- Добавьте любую информацию о пользователе -->
    <p>Имя пользователя: {{ username }}</p>
    <p>Роль: {{ role }}</p>
    </div>
    <!-- Другая полезная информация для пользователя -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '', // Имя пользователя, полученное после успешной авторизации
      role: '' // Роль пользователя, полученная после успешной авторизации
      // Другие данные о пользователе, которые могут быть полезны на этой странице
    };
  },
  created() {
    // Здесь вы можете загрузить информацию о пользователе после успешной авторизации
    // Например, сделать запрос к API для получения информации о пользователе
    // Вам нужно использовать данные, полученные после успешной авторизации
    this.username = 'Иван'; // Пример значения имени пользователя
    this.role = 'Разработчик'; // Пример значения роли пользователя
  }
};
</script>
<style scoped>
.profile-container {
  width: 80%; /* Ширина карточки */
  margin: 0 auto; /* Центрирование по горизонтали */
  padding: 20px;
  border-radius: 10px;
  background-color: #f2f2f2; /* Цвет фона */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */
}

.profile-container h2 {
  text-align: center; /* Выравнивание заголовка по центру */
  color: #333; /* Цвет текста заголовка */
  margin-bottom: 20px;
}

.user-info {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info p {
  margin: 10px 0;
  color: #666; /* Цвет текста */
}

.user-info p:first-child {
  margin-top: 0;
}
</style>
