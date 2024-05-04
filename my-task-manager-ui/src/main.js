//main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UserProfile from './components/UserProfile.vue'
import store from './store';

createApp(App).use(store).mount('#app');

// Создаем экземпляр маршрутизатора
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/user-profile', component: UserProfile }
    // Добавьте другие маршруты здесь при необходимости
  ]
})

// Создаем экземпляр приложения Vue
const app = createApp(App)
app.use(store) // используем ваше хранилище Vuex

// Используем маршрутизатор в приложении
app.use(router)

// Монтируем приложение в DOM
app.mount('#app')
