<template>
  <div class="tasks-container">
    <div class="task-search-bar">
      <input type="text" v-model="searchQuery" placeholder="Поиск задач...">
      <button @click="searchTasks"><i class="fas fa-search"></i> Найти</button>
    </div>
    <h1>Список задач</h1>
    <ul class="task-list">
      <li v-for="task in filteredTasks" :key="task.taskid" :class="{ 'task-item': true, overdue: isOverdue(task.deadline), upcoming: !isOverdue(task.deadline) }">
        <router-link :to="{ name: 'TaskDetails', params: { id: task.taskid } }" class="task-link">
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="task-status" :class="task.status">{{ task.status }}</span>
          </div>
          <div class="task-body">
            <p><i class="fas fa-user"></i> Автор: {{ task.authorname }}</p>
            <p><i class="fas fa-layer-group"></i> Статус: {{ task.status }}</p>
            <p><i class="fas fa-calendar-day"></i> Срок: {{ new Date(task.deadline).toLocaleDateString() }}</p>
            <p><i class="fas fa-user-check"></i> Исполнитель: {{ task.assigneeid }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>




<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      searchQuery: ''
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task => task.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  methods: {
    isOverdue(deadline) {
      const today = new Date();
      const dueDate = new Date(deadline);
      return dueDate < today;
    },
    searchTasks() {
      // Метод для выполнения поиска
      console.log('Searching for:', this.searchQuery);
    }
  },
  async created() {
    try {
      const response = await axios.get('/tasks');
      this.tasks = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  }
};
</script>
<style scoped>
.tasks-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background: #fff; /* Чистый белый фон для контейнера */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Мягкая тень вокруг контейнера */
}

.task-search-bar {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  background: #f8f9fa; /* Слегка серый фон для панели поиска */
  padding: 10px;
  border-radius: 8px; /* Скругление углов */
}

.task-search-bar input {
  flex-grow: 1;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-right: 10px;
}

.task-search-bar button {
  padding: 10px 20px;
  background-color: #0056b3; /* Глубокий синий цвет */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.task-search-bar button:hover {
  background-color: #003975; /* Темно-синий при наведении */
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  background-color: #ffffff;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: box-shadow 0.3s;
  cursor: pointer;
}

.task-item:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.overdue {
  border-left: 5px solid #e53e3e; /* Ярко-красный */
}

.upcoming {
  border-left: 5px solid #38a169; /* Зеленый */
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Отступ между заголовком и телом */
}

.task-status {
  padding: 5px 10px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  text-transform: uppercase;
}

.open .task-status {
  background-color: #3182ce; /* Синий */
}

.in_progress .task-status {
  background-color: #dd6b20; /* Оранжевый */
}

.completed .task-status {
  background-color: #38a169; /* Зеленый */
}

.task-body {
  padding-top: 5px;
  line-height: 1.5;
}

.task-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4a5568; /* Темно-серый */
}

.task-info i {
  margin-right: 5px;
}

.task-link {
  text-decoration: none; /* Убираем подчеркивание у всех ссылок внутри карточек */
  color: inherit; /* Наследуем цвет текста от родительского элемента */
}
</style>
