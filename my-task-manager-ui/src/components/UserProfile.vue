<template>
 <div class="profile-container">
    <h2>Личный кабинет</h2>
    <div class="user-info">
      <!-- Добавьте любую информацию о пользователе -->
      <p v-if="username !== null">Имя пользователя: {{ username }}</p>
      <p v-if="role !== null">Роль: {{ role }}</p>
    </div>
    <!-- Другая полезная информация для пользователя -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      role: null
    };
  },
  created() {
    // Загрузка информации о пользователе после успешной авторизации
    // Например, сделать запрос к API для получения информации о пользователе
    // Вам нужно использовать данные, полученные после успешной авторизации
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        // Здесь делаем запрос на сервер для получения данных пользователя
        // Это может быть запрос к /api/profile или другому эндпоинту, возвращающему информацию о пользователе
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.username = data.user.username;
          this.role = data.user.role;
        } else {
          console.error('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
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
