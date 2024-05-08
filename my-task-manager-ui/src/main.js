import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import App from './App.vue';
import store from './store';
import TaskForm from '@/components/TaskForm.vue';
import TasksList from '@/components/TasksList.vue';
import UserProfile from '@/components/UserProfile.vue'; // Убедитесь, что путь до компонента верный

axios.defaults.baseURL = 'http://localhost:5000';

const routes = [
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },

  {
    path: '/task/new',
    name: 'NewTask',
    component: TaskForm
  },
  {
    path: '/task/edit/:id',
    name: 'EditTask',
    component: TaskForm,
    props: true
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TasksList
  },
  // другие маршруты
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('userToken')) {
    next('/login');
  } else {
    next();
  }
});

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
