<template>
  <div>
    <h2>{{ taskId ? 'Редактировать задачу' : '' }}</h2> <!-- Условно убран текст при создании новой задачи -->
    <form @submit.prevent="taskId ? updateTask() : createTask()">
      <label for="title">Название задачи:</label>
      <input type="text" id="title" v-model="task.title" required>

      <label for="description">Описание:</label>
      <textarea id="description" v-model="task.description" required></textarea>

      <label for="assignee">ID исполнителя:</label>
      <input type="number" id="assignee" v-model="task.assigneeid" required>

      <label for="deadline">Срок выполнения:</label>
      <input type="datetime-local" id="deadline" v-model="task.deadline" required>

      <button type="submit">{{ taskId ? 'Сохранить изменения' : 'Создать задачу' }}</button>
    </form>
  </div>
</template>


<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


export default {
  props: ['taskId'],
  data() {
    return {
      task: {
        title: '',
        description: '',
        assigneeid: null,
        deadline: '',
        status: 'open',
        authorid: null // Добавлено для хранения ID автора
      }
    };
  },



  methods: {

async createTask() {
  this.task.authorid = this.getAuthorId(); // Устанавливаем authorid перед отправкой
  this.task.status = 'open'; // Устанавливаем статус задачи на "Открыта"

  try {
    await axios.post('/tasks', this.task);
    console.log('Task Created:', this.task);

    // Закрытие модального окна перед показом сообщения
    this.$emit('close'); // Убедитесь, что это правильное событие для закрытия вашего модального окна

    // Показываем сообщение об успешном создании задачи
    Swal.fire({
      title: 'Успех!',
      text: 'Задача успешно создана.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.$router.push('/tasks'); // Перенаправление на список задач
      }
    });

  } catch (error) {
    console.error('Error creating task:', error);
    Swal.fire({
      title: 'Ошибка!',
      text: 'Не удалось создать задачу: ' + error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
,


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
        this.task = { ...response.data, authorid: this.getAuthorId() }; // Загрузка данных задачи включает автора
        console.log("Task Data Loaded");
      } catch (error) {
        console.error("Error loading task data:", error);
      }
    },
getAuthorId() {
    const token = localStorage.getItem('userToken');
    if (token) {
        try {
            const decoded = jwtDecode(token); // Используем функцию jwtDecode для декодирования
            return decoded.userId;
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    }
    return null;
},
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
  width: 100%; /* Устанавливаем ширину формы на 100% */
  max-width: 600px; /* Максимальная ширина формы */
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
textarea {
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Поле ввода занимает всю доступную ширину */
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

