<template>
  <div class="task-details-page">
    <div v-if="task">
      <h1><i class="fas fa-tasks"></i> {{ task.title }}</h1>
      <div class="tab-menu">
        <div :class="{ tab: true, active: activeTab === 'details' }" @click="activeTab = 'details'"><i class="fas fa-info-circle"></i> Детали</div>
        <div :class="{ tab: true, active: activeTab === 'comments' }" @click="activeTab = 'comments'"><i class="fas fa-comments"></i> Комментарии</div>
      </div>
      <div v-if="activeTab === 'details'" class="details-section">
        <p><i class="fas fa-align-left"></i> Описание: {{ task.description }}</p>
        <p><i class="fas fa-user"></i> Автор: {{ task.authorname }}</p>
        <p><i class="fas fa-thermometer-half"></i> Статус: {{ task.status }}</p>
        <p><i class="fas fa-calendar-alt"></i> Срок выполнения: {{ task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Нет данных' }}</p>
        <p><i class="fas fa-user-check"></i> Исполнитель: {{ task.assigneename || 'Не назначена' }}</p>
      </div>
      <div v-if="activeTab === 'comments'" class="comments-section">
        <h3>Комментарии</h3>
        <ul class="comment-list">
          <li v-for="comment in comments" :key="comment.id" class="comment-item">
            <p class="comment-author">{{ comment.authorname }} ({{ comment.authorrole }})</p>
            <p class="comment-content">{{ comment.content }}</p>
            <p class="comment-date">{{ comment.date }}</p>
            <button class="delete-icon" @click="deleteComment(comment.id)">
              <i class="fas fa-times"></i>
            </button>
          </li>
        </ul>
        <div class="add-comment">
          <textarea v-model="newComment" placeholder="Добавить комментарий..."></textarea>
          <button @click="addComment">Отправить</button>
        </div>
      </div>
      <div v-if="activeTab === 'history'" class="history-section">
        <h3>История</h3>
        <ul class="history-list">
          <li v-for="entry in history" :key="entry.id" class="history-item">
            <p class="history-event">{{ entry.event }}</p>
            <p class="history-user">{{ entry.username }}</p>
            <p class="history-date">{{ new Date(entry.timestamp).toLocaleString() }}</p>
          </li>
        </ul>
      </div>
      <div class="action-buttons">
        <button v-if="task.status === 'open'" class="button start" @click="startTask"><i class="fas fa-play"></i> Взять в работу</button>
        <button v-if="task.status === 'in_progress'" class="button complete" @click="completeTask"><i class="fas fa-check"></i> Завершить</button>
        <button class="button edit" @click="openEditModal"><i class="fas fa-edit"></i> Редактировать</button>
        <button class="button delete" @click="deleteTask"><i class="fas fa-trash-alt"></i> Удалить</button>
      </div>
    </div>
    <div v-else>
      <p>Загрузка данных задачи...</p>
    </div>

    <!-- Модальное окно для редактирования задачи -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal">
        <h2>Редактировать задачу</h2>
        <form @submit.prevent="updateTask">
          <label for="title">Название</label>
          <input type="text" v-model="task.title" id="title">
          
          <label for="description">Описание</label>
          <textarea v-model="task.description" id="description"></textarea>
          
          <label for="status">Статус</label>
          <select v-model="task.status" id="status">
            <option value="open">Открыто</option>
            <option value="in_progress">В процессе</option>
            <option value="completed">Завершено</option>
          </select>
          
          <label for="deadline">Срок выполнения</label>
          <input type="date" v-model="task.deadline" id="deadline">
          
          <label for="assignee">Исполнитель</label>
          <select v-model="task.assigneeid" id="assignee">
            <option v-for="user in users" :value="user.userid" :key="user.userid">{{ user.username }}</option>
          </select>
          
          <div class="button-group">
            <button type="submit" class="button save">Сохранить</button>
            <button type="button" class="button cancel" @click="closeEditModal">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

export default {
  props: ['id'],
  data() {
    return {
      task: null,
      activeTab: 'details',
      comments: [],
      newComment: '',
      showEditModal: false, // Управление видимостью модального окна
      users: [], // Список пользователей
      history: [] // История задач
    };
  },
  methods: {
    openEditModal() {
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async updateTask() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire('Ошибка', 'Вы не авторизованы', 'error');
        return;
      }

      if (!this.task) {
        Swal.fire('Ошибка', 'Задача не загружена', 'error');
        return;
      }

      try {
        const response = await axios.put(
          `/tasks/${this.task.taskid}`,
          this.task,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.task = response.data;
        this.showEditModal = false;
        Swal.fire('Успешно!', 'Задача обновлена.', 'success');
        this.fetchHistory(); // Обновить историю после редактирования задачи
      } catch (error) {
        console.error('Ошибка обновления задачи:', error);
        Swal.fire('Ошибка', 'Не удалось обновить задачу.', 'error');
      }
    },



  async startTask() {
  const userId = this.getAuthorId();
  const token = localStorage.getItem('userToken');
  if (!token) {
    Swal.fire('Ошибка', 'Вы не авторизованы', 'error');
    return;
  }
  if (!userId) {
    Swal.fire('Ошибка', 'Не удалось идентифицировать пользователя.', 'error');
    return;
  }
  try {
    const response = await axios.patch(`/tasks/${this.task.taskid}/start`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.task = response.data;
    Swal.fire('Задача в работе', 'Вы взяли задачу в работу.', 'success');
  } catch (error) {
    console.error('Ошибка при попытке взять задачу в работу:', error);
    Swal.fire('Ошибка', 'Не удалось взять задачу в работу.', 'error');
  }
},

   async completeTask() {
  const token = localStorage.getItem('userToken');
  if (!token) {
    Swal.fire('Ошибка', 'Вы не авторизованы', 'error');
    return;
  }
  try {
    const response = await axios.patch(`/tasks/${this.task.taskid}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.task = response.data;
    Swal.fire('Задача завершена', 'Задача успешно завершена.', 'success');
  } catch (error) {
    console.error('Ошибка при завершении задачи:', error);
    Swal.fire('Ошибка', 'Не удалось завершить задачу.', 'error');
  }
},
    async deleteComment(commentId) {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Аутентификация необходима для удаления комментариев.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      try {
        const response = await axios.delete(`/tasks/${this.id}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
          Swal.fire({
            title: 'Успешно!',
            text: 'Комментарий удален.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось удалить комментарий: ' + (error.response && error.response.data.message ? error.response.data.message : error.message),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
    async fetchComments() {
      try {
        const response = await axios.get(`/tasks/${this.id}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        });
        if (response.data) {
          this.comments = response.data;
        } else {
          console.error('No comments received:', response);
        }
      } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
      }
    },

    async fetchTaskDetails() {
      try {
        const response = await axios.get(`/tasks/${this.id}`);
        this.task = response.data;
      } catch (error) {
        console.error('Ошибка загрузки деталей задачи:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error('Ошибка загрузки списка пользователей:', error);
      }
    },
    async fetchHistory() {
      try {
        const response = await axios.get(`/tasks/${this.id}/history`);
        this.history = response.data;
      } catch (error) {
        console.error('Ошибка загрузки истории задачи:', error);
      }
    },

    async deleteTask() {
      const token = localStorage.getItem('userToken');
      try {
        await axios.delete(`/tasks/${this.task.taskid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: 'Успешно!',
          text: 'Задача успешно удалена.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.$router.push('/tasks'); // Перенаправление на список задач после удаления
        });
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
        if (error.response && error.response.status === 401) {
          Swal.fire({
            title: 'Ошибка!',
            text: 'Ваша сессия истекла. Пожалуйста, войдите снова.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.$router.push('/login');
        }
      }
    },
    getAuthorId() {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const decoded = jwt_decode(token); // Используем jwt_decode для декодирования токена
          return decoded.userId; // Убедитесь, что поле с ID пользователя называется именно так
        } catch (error) {
          console.error('Failed to decode JWT:', error);
          return null;
        }
      }
      return null;
    },

    async addComment() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Аутентификация необходима для добавления комментариев.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      const authorid = this.getAuthorId(); // Получаем ID автора
      if (!authorid) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось определить пользователя.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      if (!this.newComment.trim()) {
        Swal.fire({
          title: 'Ошибка!',
          text: 'Комментарий не может быть пустым.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      try {
        const response = await axios.post(`/tasks/${this.id}/comments`, {
          authorid,
          content: this.newComment
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.comments.push(response.data);
        this.newComment = '';
        Swal.fire('Успешно!', 'Комментарий добавлен.', 'success');
      } catch (error) {
        console.error('Ошибка добавления комментария:', error);
        Swal.fire({
          title: 'Ошибка!',
          text: 'Произошла ошибка при добавлении комментария: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  },
  created() {
    this.fetchTaskDetails();
    this.fetchComments();
    this.fetchUsers();
    this.fetchHistory(); // Загрузить историю задачи при создании компонента
  }
};
</script>

<style scoped>
.task-details-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.tab-menu {
  display: flex;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: #e9ecef;
  color: #666;
  margin-right: 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.tab.active {
  background-color: #007bff;
  color: white;
}

.details-section p {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.button {
  padding: 10px 20px;
  margin-left: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #218838;
}

.button.edit {
  background: #ffc107;
}

.button.edit:hover {
  background: #e0a800;
}

.button.delete {
  background: #dc3545;
}

.button.delete:hover {
  background: #c82333;
}

.comments-section, .history-section {
  margin-top: 20px;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
}

.comment-list, .history-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.comment-item, .history-item {
  position: relative;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.comment-author, .history-user {
  font-weight: bold;
  color: #333;
}

.comment-content, .history-event {
  margin: 5px 0;
  line-height: 1.4;
}

.comment-date, .history-date {
  font-size: 0.85rem;
  color: #666;
}

.add-comment textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.add-comment button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
}

.add-comment button:hover {
  background-color: #0056b3;
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-icon:hover {
  background-color: #c82333;
}

.delete-icon:focus {
  outline: none;
}

/* Стили для модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.modal h2 {
  margin-top: 0;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal label {
  display: block;
  margin-bottom: 5px;
}

.modal input, .modal select, .modal textarea {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal .button {
  margin: 0 5px;
}

.modal .button.save {
  background-color: #007bff;
}

.modal .button.cancel {
  background-color: #6c757d;
}

.modal .button.save:hover {
  background-color: #0056b3;
}

.modal .button.cancel:hover {
  background-color: #5a6268;
}
</style>
