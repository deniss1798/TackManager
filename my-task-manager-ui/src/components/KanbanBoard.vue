<template>
  <div class="container">
    <div class="filters-section">
      <button @click="toggleFilters" class="filter-toggle-button">
        <i class="fas fa-filter"></i>
      </button>
      <transition name="slide">
        <div v-if="filtersVisible" class="filters-container">
          <button @click="filterOverdueTasks" class="filter-button">
            Просроченные задачи
          </button>
        </div>
      </transition>
    </div>
    <div class="kanban-board">
      <div class="kanban-column" v-for="status in statuses" :key="status.key" :class="status.key">
<h2 class="column-header"><i class="fas fa-circle-notch"></i> {{ status.name }}</h2>

<div v-for="task in filteredTasks(status.key)" :key="task.id" :class="['kanban-task', taskClasses(task)]">
  <h3 class="task-title">{{ task.title }}</h3>
  <p class="task-content">{{ task.description }}</p>
  <p class="task-deadline">
    <i class="fas fa-calendar-alt"></i> Срок: {{ new Date(task.deadline).toLocaleDateString() }}
  </p>
  <p class="task-author">
    <i class="fas fa-user"></i> Автор: {{ task.authorname || 'не известно' }}
  </p>
</div>



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
      showOnlyOverdue: false
    };
  },
  methods: {
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
    },
    filterOverdueTasks() {
      this.showOnlyOverdue = !this.showOnlyOverdue;
    },
    filteredTasks(statusKey) {
      let tasks = this.tasks.filter(task => task.status === statusKey);
      if (this.showOnlyOverdue) {
        tasks = tasks.filter(task => new Date(task.deadline) < new Date());
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
        authorName: task.authorName || 'Неизвестно' // Обработка возможных неопределенных имен
      })) : [];
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  }
}
</script>




<style scoped>

.container {
  padding: 20px;
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
  background: linear-gradient(145deg, rgba(233, 236, 239, 0.9), rgba(233, 236, 239, 0.7)); /* Градиент с прозрачностью */
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Мягкая тень для создания эффекта объема */
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid #ced4da; /* Тонкая граница для добавления глубины */
}



.kanban-task {
  background: white;
  border-radius: 5px;
  margin-bottom: 10px; /* Отступ между задачами */
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 5px solid; /* Полоса слева, цвет изменяется динамически */
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s; /* Плавное изменение цвета и тени */
}

.kanban-task:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.2); /* Увеличиваем тень при наведении */
  transform: translateY(-3px); /* Слегка поднимаем карточку */
  background-color: #f0f0f0; /* Светлый серый фон при наведении */
}

.open .kanban-task {
  border-color: #007bff;
}

.in_progress .kanban-task {
  border-color: #ffc107;
}

.completed .kanban-task {
  border-color: #28a745;
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
  background-color: #007bff; /* Синий */
}

.in_progress .column-header {
  background-color: #ffc107; /* Желтый */
}

.completed .column-header {
  background-color: #28a745; /* Зеленый */
}

.filter-title {
  margin-right: 20px;
  font-size: 18px; /* Увеличение размера шрифта */
  color: #007bff; /* Яркий синий цвет для выделения */
  font-weight: bold; /* Жирное начертание */
  text-transform: uppercase; /* Текст заглавными буквами */
  padding: 5px 10px; /* Добавление внутренних отступов */
  border-bottom: 2px solid #007bff; /* Горизонтальная линия под текстом для акцента */
}
.filters-section {
  margin-bottom: 20px;
}




.filter-toggle-button {
  position: fixed; /* Фиксируем кнопку на странице */
  left: 270px; /* Отступ слева */
  top: 10px; /* Отступ сверху */
  background-color: #007bff; /* Цвет фона кнопки */
  color: white; /* Цвет текста и иконки */
  border: none;
  border-radius: 50%; /* Круглая кнопка */
  padding: 10px;
  cursor: pointer;
  z-index: 1000; /* Выше всех элементов */
}

.filter-button {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.filters-container {
  padding: 10px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.filter-options {
  position: absolute; /* Позиционируем выпадающий список фильтров */
  top: 40px;
  right: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100; /* Убедитесь, что фильтры будут поверх других элементов */
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
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
  gap: 8px; /* Расстояние между иконкой и текстом */
}

/* Стили для иконок внутри кнопок */
.filter-button i, .button i {
  font-size: 1.2em; /* Размер иконок */
}

.column-header i {
  margin-right: 5px; /* Отступ иконки от текста */
}

.kanban-task i {
  margin-right: 8px; /* Расстояние между иконкой и текстом */
  color: #666; /* Цвет иконок, соответствующий цвету текста */
}

.task-title, .task-content, .task-deadline, .task-author {
  display: flex;
  align-items: center; /* Выравнивание иконок по центру с текстом */
}

.task-title i, .task-content i, .task-deadline i, .task-author i {
  min-width: 20px; /* Минимальная ширина, чтобы иконка не сжималась */
  text-align: center;
}

/* Небольшое улучшение визуальной привлекательности */
.kanban-task:hover {
  background-color: #f9f9f9; /* Светлее при наведении */
}

</style>
