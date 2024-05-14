<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <form @submit.prevent="taskId ? updateTask() : createTask()" class="task-form">
          <div class="form-group">
            <label for="title">Название задачи:</label>
            <input type="text" id="title" v-model="task.title" required>
          </div>
          
          <div class="form-group">
            <label for="description">Описание:</label>
            <textarea id="description" v-model="task.description" required></textarea>
          </div>

          <div class="form-group">
            <label for="type">Тип задачи:</label>
            <select id="type" v-model="task.task_type" required>
              <option disabled value="">Выберите тип</option>
              <option>ОПЗ</option>
              <option>Разработка требований</option>
              <option>Доработка</option>
              <option>Баг</option>
            </select>
          </div>

          <div class="form-group">
            <label for="priority">Приоритет:</label>
            <select id="priority" v-model="task.priority" required>
              <option disabled value="">Выберите приоритет</option>
              <option>Наивысший</option>
              <option>Высокий</option>
              <option>Средний</option>
              <option>Низкий</option>
              <option>Самый низкий</option>
            </select>
          </div>

          <div class="form-group">
            <label for="deadline">Срок выполнения:</label>
            <input type="datetime-local" id="deadline" v-model="task.deadline" required>
          </div>

          <button type="submit" class="modal-default-button">{{ taskId ? 'Сохранить изменения' : 'Создать задачу' }}</button>
          <button type="button" class="modal-default-button" @click="closeForm">Закрыть</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

export default {
  props: ['taskId'],
  data() {
    return {
      task: {
        title: '',
        description: '',
        task_type: '',
        priority: 'Наивысший',
        deadline: '',
        status: 'open',
        authorid: null
      }
    };
  },
  methods: {
    async createTask() {
      this.task.authorid = this.getAuthorId();
      try {
        await axios.post('/tasks', this.task);
        Swal.fire({
          title: 'Успех!',
          text: 'Задача успешно создана.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => this.$router.push('/tasks'));
      } catch (error) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось создать задачу: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
    getAuthorId() {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const decoded = jwt_decode(token);
          return decoded.userId;
        } catch (error) {
          console.error('Failed to decode JWT:', error);
          return null;
        }
      }
      return null;
    },
    closeForm() {
      this.$emit('close');
    }
  },
  created() {
    if (!this.taskId) {
      this.task.authorid = this.getAuthorId();
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 25px;
}
.task-form-container {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #444;
}

input[type="text"],
input[type="datetime-local"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button[type="submit"], .modal-default-button {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  margin-top: 10px;
}

button[type="submit"]:hover, .modal-default-button:hover {
  background-color: #218838;
}
</style>
