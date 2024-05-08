// TaskList.vue
<template>
  <div>
    <h1>Список задач</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - {{ task.status }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: []
    };
  },
  async created() {
    try {
      const response = await axios.get('/tasks');
      this.tasks = response.data;
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }
}
</script>
