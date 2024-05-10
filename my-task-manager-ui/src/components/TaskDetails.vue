<template>
  <div class="task-details-page">
    <div v-if="task">
      <h1><i class="fas fa-tasks"></i> {{ task.title }}</h1>
      <div class="tab-menu">
        <div class="tab active"><i class="fas fa-info-circle"></i> Детали</div>
        <div class="tab"><i class="fas fa-comments"></i> Комментарии</div>
        <div class="tab"><i class="fas fa-history"></i> История</div>
      </div>
      <div class="details-section">
        <p><i class="fas fa-align-left"></i> {{ task.description }}</p>
        <p><i class="fas fa-user"></i> Автор: {{ task.authorname }}</p>
        <p><i class="fas fa-thermometer-half"></i> Статус: {{ task.status }}</p>
        <p><i class="fas fa-calendar-alt"></i> Срок выполнения: {{ new Date(task.deadline).toLocaleDateString() }}</p>
        <p><i class="fas fa-user-check"></i> Исполнитель: {{ task.assigneeid }}</p>
      </div>
      <div class="action-buttons">
        <button class="button edit"><i class="fas fa-edit"></i> Редактировать</button>
<button class="button delete" @click="deleteTask"><i class="fas fa-trash-alt"></i> Удалить</button>
      </div>
    </div>
    <div v-else>
      <p>Загрузка данных задачи...</p>
    </div>
  </div>
</template>




<script>
import axios from 'axios';
import Swal from 'sweetalert2';


export default {
  props: ['id'],
  data() {
    return {
      task: null
    };
  },
  methods: {
async deleteTask() {
  const token = localStorage.getItem('userToken');
  try {
    const response = await axios.delete(`/tasks/${this.task.taskid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Task Deleted:', response.data);
    Swal.fire({
      title: 'Успешно!',
      text: 'Задача успешно удалена.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    this.$router.push('/tasks'); // Перенаправление на список задач после удаления
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
}


  },
  computed: {
    formattedDeadline() {
      return new Date(this.task.deadline).toLocaleDateString();
    }
  },
  async created() {
    try {
      const response = await axios.get(`/tasks/${this.id}`);
      this.task = response.data;
    } catch (error) {
      console.error('Ошибка загрузки деталей задачи:', error);
    }
  }
};
</script>





<style scoped>

.task-item {
  background-color: #f9f9f9; /* базовый цвет фона */
  border-left: 5px solid #ccc; /* базовый цвет границы */
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: transform 0.3s ease, border-left-color 0.3s ease;
}
.task-details-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h1 {
  color: #0056b3; /* Синий цвет для заголовка */
  padding-bottom: 10px;
  margin-bottom: 20px; /* Больше пространства под заголовком */
  border-bottom: 2px solid #e1e1e1; /* Светло-серый цвет границы */
}

.details-section {
  background: #f4f4f4; /* Светло-серый фон для раздела деталей */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  margin-top: 20px;
}

.tab-menu {
  display: flex;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: #e9ecef; /* Светло-серый фон для вкладок */
  color: #666;
  margin-right: 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.tab.active {
  background-color: #007bff; /* Активная вкладка будет синей */
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.button {
  padding: 10px 20px;
  margin-left: 10px;
  background: #28a745; /* Зеленая кнопка */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.fa {
  margin-right: 8px; /* Добавляем небольшой отступ справа от иконки */
}

.button:hover {
  background: #218838; /* Темно-зеленый при наведении */
}

.button.edit {
  background: #ffc107; /* Желтая кнопка для редактирования */
}

.button.edit:hover {
  background: #e0a800; /* Темно-желтый при наведении */
}

.button.delete {
  background: #dc3545; /* Красная кнопка для удаления */
}

.button.delete:hover {
  background: #c82333; /* Темно-красный при наведении */
}




</style>


