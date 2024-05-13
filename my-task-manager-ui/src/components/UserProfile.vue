<template>
  <div class="profile-container">
    <h2>Личный кабинет</h2>
    <div class="user-info">
      <p v-if="username"><i class="fas fa-user"></i> Имя пользователя: {{ username }}</p>
      <p v-if="role"><i class="fas fa-user-tag"></i> Роль: {{ role }}</p>
      <p v-if="registeredAt"><i class="fas fa-clock"></i> Дата регистрации: {{ formattedDate }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: null,
      role: null,
      registeredAt: null,
    };
  },
  computed: {
    formattedDate() {
      return this.registeredAt ? new Date(this.registeredAt).toLocaleString() : '';
    }
  },
  methods: {
    async loadUserProfile() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token available. Redirecting to login.');
        this.$router.push('/login');
        return;
      }

      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          this.username = response.data.username;
          this.role = response.data.role;
          this.registeredAt = response.data.registeredAt; // Предполагается, что сервер отправляет это поле
        } else {
          console.error('Failed to load user profile with status:', response.status);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('userToken');
          this.$router.push('/login');
        }
      }
    }
  },
  created() {
    this.loadUserProfile();
  }
};
</script>

<style scoped>



.profile-container {
  width: 80%;
  margin: 50px auto;
  padding: 40px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.profile-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
}

.user-info {
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-info p {
  margin: 10px 0;
  color: #666;
  font-size: 1.2em;
}

.user-info i {
  margin-right: 10px;
  color: #0056b3;
}
</style>
