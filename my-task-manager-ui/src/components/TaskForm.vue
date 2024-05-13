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
            <input type="datetime-local" id="deadline" v-model="task.deadline">
          </div>

          <button type="submit" class="modal-default-button">{{ taskId ? 'Сохранить изменения' : 'Создать задачу' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  props: {
    taskId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      task: {
        title: '',
        description: '',
        task_type: '',
        priority: '',
        deadline: null
      }
    };
  },
  methods: {
    async createTask() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire('Ошибка', 'Аутентификация необходима для создания задач.', 'error');
        return;
      }

      try {
        const response = await axios.post('/tasks', this.task, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$emit('taskCreated', response.data); // Emit event to parent component
        Swal.fire('Успешно!', 'Задача создана.', 'success');
        this.resetForm();
      } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        Swal.fire('Ошибка', 'Не удалось создать задачу.', 'error');
      }
    },
    async updateTask() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire('Ошибка', 'Аутентификация необходима для редактирования задач.', 'error');
        return;
      }

      try {
        const response = await axios.put(`/tasks/${this.taskId}`, this.task, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.$emit('taskUpdated', response.data); // Emit event to parent component
        Swal.fire('Успешно!', 'Задача обновлена.', 'success');
        this.resetForm();
      } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        Swal.fire('Ошибка', 'Не удалось обновить задачу.', 'error');
      }
    },
    resetForm() {
      this.task = {
        title: '',
        description: '',
        task_type: '',
        priority: '',
        deadline: null
      };
    },
    async loadTaskDetails(taskId) {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire('Ошибка', 'Аутентификация необходима для загрузки деталей задачи.', 'error');
        return;
      }

      try {
        const response = await axios.get(`/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.task = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке деталей задачи:', error);
        Swal.fire('Ошибка', 'Не удалось загрузить детали задачи.', 'error');
      }
    }
  },
  watch: {
    taskId(newTaskId) {
      if (newTaskId) {
        this.loadTaskDetails(newTaskId);
      } else {
        this.resetForm();
      }
    }
  },
  created() {
    if (this.taskId) {
      this.loadTaskDetails(this.taskId);
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  width: 400px;
}

.modal-container {
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
