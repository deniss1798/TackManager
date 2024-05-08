<template>
  <div class="profile-container">
    <h2>Личный кабинет</h2>
    <div class="user-info">
      <p v-if="username !== null">Имя пользователя: {{ username }}</p>
      <p v-if="role !== null">Роль: {{ role }}</p>
    </div>
    <!-- Удалена кнопка и модальное окно -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: null,
      role: null,
    };
  },
  methods: {
async loadUserProfile() {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      this.username = response.data.username;
      this.role = response.data.role;
    } else {
      console.error('Failed to load user profile');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
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
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f2f2f2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-container h2 {
  text-align: center;
  color: #333;
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
  color: #666;
}

.user-info p:first-child {
  margin-top: 0;
}
</style>
