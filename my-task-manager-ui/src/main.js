//main.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import App from './App.vue';
import store from './store';
import TaskForm from '@/components/TaskForm.vue';
import TasksList from '@/components/TasksList.vue';
import UserProfile from '@/components/UserProfile.vue'; // Убедитесь, что путь до компонента верный
import TaskDetails from './components/TaskDetails.vue'; // Импортируем компонент деталей задачи


axios.defaults.baseURL = 'http://localhost:5000';

//таймаут сессии
axios.interceptors.response.use(response => response, error => {
  if (error.response.status === 401 || error.response.status === 403) {
    localStorage.removeItem('userToken');
    router.push('/login');
    alert('Ваша сессия истекла. Пожалуйста, войдите снова.');
  }
  return Promise.reject(error);
});



const routes = [
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },

  {
    path: '/tasks/:id', // Убедитесь, что 'id' здесь совпадает с используемым в компоненте
    name: 'TaskDetails',
    component: TaskDetails,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/HelloWorld.vue'), // Укажите здесь путь к вашему компоненту входа
    meta: { guestOnly: true }
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/KanbanBoard.vue')
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


//Перенаправляем в маршрут /login если пользователь не аутентифицирован
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next('/user-profile'); // Измените на более подходящий маршрут
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.name === 'TaskDetails' && !to.params.id) {
    console.error('ID задачи не передан');
    next('/tasks'); // Верните пользователя на список задач, если ID не передан
  } else {
    next();
  }
});



const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
