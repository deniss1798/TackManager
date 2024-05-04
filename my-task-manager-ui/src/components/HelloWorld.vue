<template>
  <div class="auth-container">
    <h1>{{ isLogin ? 'Вход' : 'Регистрация' }}</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input type="text" id="username" v-model="username" placeholder="Введите ваше имя пользователя" required>
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" placeholder="Введите ваш пароль" required>
      </div>
      <div v-if="!isLogin" class="form-group">
        <label for="role">Роль</label>
        <select id="role" v-model="role" required>
          <option value="">Выберите роль</option>
          <option value="Аналитика">Аналитика</option>
          <option value="Разработка">Разработка</option>
          <option value="Тестирование">Тестирование</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit">{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</button>
        <button type="button" @click="toggleAuthMode">{{ isLogin ? 'Переключиться на регистрацию' : 'Переключиться на вход' }}</button>
      </div>
    </form>
 
  </div>
  <div v-if="showSuccessMessage" class="success-message">
    Успешная регистрация
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showSuccessMessage: false,
      isLogin: true,
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
      registrationSuccess: false
    };
  },
  methods: {
async submitForm() {
  try {
   // console.log('submitForm вызван');

    if (this.isLogin) {
      const response = await axios.post('http://localhost:5000/login', {
        username: this.username,
        password: this.password
      });

      const { token, user } = response.data; // Получаем токен и данные о пользователе из ответа

      // Сохраняем токен в localStorage для последующих запросов
      localStorage.setItem('token', token);

      // Сохраняем данные о пользователе в состоянии компонента
      this.$store.commit('setUser', user);

      // Перенаправляем на страницу пользователя после успешного входа
      this.$router.push('/user-profile');
    } else {
      const response = await axios.post('http://localhost:5000/register', {
        username: this.username,
        password: this.password,
        role: this.role
      });

      console.log('Успешная регистрация:', response.data);

      // Показываем сообщение об успешной регистрации
      this.showSuccessMessage = true;

      // Через 3 секунды скрываем сообщение
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
},





    toggleAuthMode() {
      this.isLogin = !this.isLogin;
    }
  }
};
</script>


<style scoped>

.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50; /* зеленый цвет */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000; /* чтобы сообщение отображалось поверх других элементов */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* тень */
  animation: slideIn 0.5s forwards; /* анимация для появления */
}

@keyframes slideIn {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
}

.auth-container h1 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  appearance: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #007bff;
  color: #fff;
}

button:hover {
  background-color: #0056b3;
}
</style>