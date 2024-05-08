<template>
  <div>
    <h2>{{ taskId ? 'Редактировать задачу' : 'Создать задачу' }}</h2>
    <form @submit.prevent="taskId ? updateTask() : createTask()">
      <label for="title">Название задачи:</label>
      <input type="text" id="title" v-model="task.title" required>

      <label for="description">Описание:</label>
      <textarea id="description" v-model="task.description" required></textarea>

      <label for="assignee">ID исполнителя:</label>
      <input type="number" id="assignee" v-model="task.assigneeid" required>

      <label for="deadline">Срок выполнения:</label>
      <input type="datetime-local" id="deadline" v-model="task.deadline" required>

      <label for="status">Статус:</label>
      <select id="status" v-model="task.status" required>
        <option value="open">Открыта</option>
        <option value="in_progress">В процессе</option>
        <option value="completed">Выполнена</option>
      </select>

      <button type="submit">Сохранить</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['taskId'],
  data() {
    return {
      task: {
        title: '',
        description: '',
        assigneeid: null,
        deadline: '',
        status: 'open'
      }
    };
  },
  methods: {
    async createTask() {
      try {
        const response = await axios.post('/tasks', this.task);
        console.log('Task Created:', response.data);
        // Перенаправление или обновление UI
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    async updateTask() {
      try {
        const response = await axios.put(`/tasks/${this.taskId}`, this.task);
        console.log('Task Updated:', response.data);
        // Перенаправление или обновление UI
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
    async loadTaskData() {
      try {
        const response = await axios.get(`/tasks/${this.taskId}`);
        this.task = response.data;
        console.log("Task Data Loaded");
      } catch (error) {
        console.error("Error loading task data:", error);
      }
    }
  },
  mounted() {
    if (this.taskId) {
      this.loadTaskData();
    }
  }
}
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
textarea,
select {
  padding: 8px;
  margin-bottom: 15px; /* Отступ между полями */
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  cursor: pointer;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
}

button[type="submit"]:hover {
  background-color: #218838;
}
</style>
