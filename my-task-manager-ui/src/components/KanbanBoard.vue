<template>
  <div class="container">
    <div class="filters-section">
      <button @click="toggleFilters" class="filter-toggle-button">
        <i class="fas fa-filter"></i> Фильтры
      </button>
      <transition name="slide">
        <div v-if="filtersVisible" class="filters-container">
          <button 
            @click="filterOverdueTasks" 
            :class="['filter-button', { active: showOnlyOverdue }]">
            Просроченные задачи
          </button>
          <button 
            @click="toggleTaskTypeFilter('ОПЗ')" 
            :class="['filter-button', { active: taskTypeFilters.includes('ОПЗ') }]">
            ОПЗ
          </button>
          <button 
            @click="toggleTaskTypeFilter('Разработка требований')" 
            :class="['filter-button', { active: taskTypeFilters.includes('Разработка требований') }]">
            Разработка требований
          </button>
          <button 
            @click="toggleTaskTypeFilter('Доработка')" 
            :class="['filter-button', { active: taskTypeFilters.includes('Доработка') }]">
            Доработка
          </button>
          <button 
            @click="toggleTaskTypeFilter('Баг')" 
            :class="['filter-button', { active: taskTypeFilters.includes('Баг') }]">
            Баг
          </button>
          <button 
            @click="clearFilters" 
            class="reset-filters-button">
            Сбросить фильтры
          </button>
        </div>
      </transition>
    </div>
    <div class="kanban-board">
      <div class="kanban-column" v-for="status in statuses" :key="status.key" :class="status.key">
        <h2 class="column-header"><i class="fas fa-circle-notch"></i> {{ status.name }}</h2>
        <router-link v-for="task in filteredTasks(status.key)" :key="task.taskid" :to="{ name: 'TaskDetails', params: { id: task.taskid } }" custom v-slot="{ navigate }">
          <div @click="navigate" :class="['kanban-task', taskClasses(task)]">
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-content">{{ task.description }}</p>
            <p class="task-type">Тип: {{ task.task_type }}</p>
            <p class="task-priority">Приоритет: {{ task.priority }}</p>
            <p class="task-deadline">
              <i class="fas fa-calendar-alt"></i> Срок: {{ task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Нет данных' }}
            </p>
            <p class="task-author">
              <i class="fas fa-user"></i> Автор: {{ task.authorname || 'не известно' }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      statuses: [
        { key: 'open', name: 'Открыто' },
        { key: 'in_progress', name: 'В процессе' },
        { key: 'completed', name: 'Завершено' }
      ],
      filtersVisible: false,
      showOnlyOverdue: false,
      taskTypeFilters: []
    };
  },
  methods: {
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
    },
    filterOverdueTasks() {
      this.showOnlyOverdue = !this.showOnlyOverdue;
    },
    toggleTaskTypeFilter(type) {
      if (this.taskTypeFilters.includes(type)) {
        this.taskTypeFilters = this.taskTypeFilters.filter(t => t !== type);
      } else {
        this.taskTypeFilters.push(type);
      }
    },
    clearFilters() {
      this.showOnlyOverdue = false;
      this.taskTypeFilters = [];
    },
    filteredTasks(statusKey) {
      let tasks = this.tasks.filter(task => task.status === statusKey);
      if (this.showOnlyOverdue) {
        tasks = tasks.filter(task => new Date(task.deadline) < new Date());
      }
      if (this.taskTypeFilters.length > 0) {
        tasks = tasks.filter(task => this.taskTypeFilters.includes(task.task_type));
      }
      return tasks;
    },
    taskClasses(task) {
      return {
        overdue: new Date(task.deadline) < new Date(),
        ontime: new Date(task.deadline) >= new Date()
      };
    }
  },
  async created() {
    try {
      const response = await axios.get('/tasks');
      this.tasks = Array.isArray(response.data) ? response.data.map(task => ({
        ...task,
        authorName: task.authorName || 'Неизвестно'
      })) : [];
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  }
}
</script>

<style scoped>
/* ваш существующий стиль */
.kanban-task-link {
  text-decoration: none; /* Removes underline from links */
  color: inherit; /* Inherits text color from parent elements */
}

.container {
  padding: 20px;
}

.kanban-task p {
  margin-top: 5px;
  line-height: 1.4;
}

.task-type, .task-priority {
  font-weight: bold; /* Highlight type and priority fields */
  color: #555; /* Slightly darker text for better contrast */
}

.kanban-board {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  gap: 20px;
}

.kanban-column {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.column-header {
  font-size: 1.5em;
  color: #343a40;
  padding: 10px 20px;
  background: linear-gradient(145deg, rgba(233, 236, 239, 0.9), rgba(233, 236, 239, 0.7));
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid #ced4da;
}

.kanban-task {
  background: white;
  border-radius: 5px;
  margin-bottom: 10px; /* Space between tasks */
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid; /* Left border color changes based on task status */
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.kanban-task:hover {
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2); /* More prominent shadow on hover */
  transform: translateY(-3px); /* Slightly raise the task card */
  background-color: #f0f0f0; /* Lighter background on hover */
}

.open .kanban-task {
  border-color: #007bff; /* Blue */
}

.in_progress .kanban-task {
  border-color: #ffc107; /* Yellow */
}

.completed .kanban-task {
  border-color: #28a745; /* Green */
}

.ontime {
  background-color: rgba(212, 237, 218, 0.5);
}

.overdue {
  background-color: rgba(248, 215, 218, 0.5);
}

.task-content {
  margin-top: 5px;
}

.task-title {
  font-weight: bold;
}

.task-deadline {
  font-size: 0.9em;
  color: #6c757d;
}

.open .column-header {
  background-color: #007bff;
}

.in_progress .column-header {
  background-color: #ffc107;
}

.completed .column-header {
  background-color: #28a745;
}

.filters-section {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Changed to space-between to space out the filter options */
  padding: 10px 0;
  background-color: #f8f9fa; /* Light grey background */
}

.filter-toggle-button, .filter-button, .reset-filters-button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.filter-toggle-button {
  background-color: #28a745;
  color: white;
}

.filter-button {
  background-color: #e0e0e0;
  color: #333;
}

.reset-filters-button {
  background-color: #dc3545;
  color: white;
  margin-left: auto;
}

.filters-container {
  display: flex;
  flex-wrap: wrap; /* Allows filters to wrap onto the next line on smaller screens */
  gap: 10px; /* Space between filters */
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.filter-options {
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  height: 0;
  opacity: 0;
}

.filter-button, .button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.filter-button:last-child {
  margin-right: 0;
}

.filter-button i, .button i {
  font-size: 1.2em;
}

.column-header i {
  margin-right: 5px;
}

.kanban-task i {
  margin-right: 8px;
  color: #666;
}

.task-title, .task-content, .task-deadline, .task-author {
  display: flex;
  align-items: center;
}

.task-title i, .task-content i, .task-deadline i, .task-author i {
  min-width: 20px;
  text-align: center;
}

.kanban-task:hover {
  background-color: #f9f9f9;
}

/* Новые стили для активных фильтров */
.filter-button.active {
  background-color: #333;
  color: white;
}
</style>
