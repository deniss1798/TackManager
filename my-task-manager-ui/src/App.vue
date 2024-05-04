<template>
  <div id="app">
    <!-- Проверяем, авторизован ли пользователь, и отображаем соответствующий компонент -->
    <template v-if="isAuthenticated">
      <UserProfile />
    </template>
    <template v-else>
      <HelloWorld @loginSuccess="handleLoginSuccess" />
    </template>
  </div>
</template>

<script>
import UserProfile from './components/UserProfile.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    UserProfile,
    HelloWorld
  },
  data() {
    return {
      isAuthenticated: false
    };
  },
  methods: {
    handleLoginSuccess() {
      // Устанавливаем флаг авторизации в true при успешной авторизации
      this.isAuthenticated = true;
    }
  }
};
</script>
