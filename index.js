// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwtDecode = require('jwt-decode');
const userRoutes = require('./userRoutes');
const path = require('path');
const { registerUser, loginUser, authenticateToken } = require('./auth');
const { Pool } = require('pg');
const { pool, findTaskById, findUserById } = require('./db');
const app = express();

// Разрешить все источники
app.use(cors());
app.use(express.json());

// Подключение маршрутов для пользователей
app.use('/users', userRoutes);

// Маршрут для входа пользователя
app.post('/login', loginUser);

// Маршрут для регистрации нового пользователя
app.post('/register', registerUser);

// Маршрут для успешной авторизации
app.get('/success', (req, res) => {
  res.send('Это страница после успешной авторизации');
});

// Создание задачи с новыми полями
app.post('/tasks', async (req, res) => {
  const { title, description, authorid, assigneeid, deadline, status, task_type, priority } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, authorid, assigneeid, deadline, status, task_type, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, authorid, assigneeid, deadline, status, task_type, priority]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Все задачи с именами авторов
app.get('/tasks', async (req, res) => {
  console.log("Запрос к /tasks получен");
  try {
    const query = `
    SELECT tasks.*, a.username as authorname, b.username as assigneename
    FROM tasks
    JOIN users as a ON tasks.authorid = a.userid
    LEFT JOIN users as b ON tasks.assigneeid = b.userid;
    `;
    const results = await pool.query(query);
    console.log("Tasks with author names:", results.rows); // Логирование данных задач с именами авторов
    res.json(results.rows);
  } catch (error) {
    console.error("Error retrieving tasks with author names:", error);
    res.status(500).send("Server Error");
  }
});

// Получение задачи по ID
app.get('/tasks/:taskid', async (req, res) => {
  console.log("Requested task ID:", req.params.taskid); // Добавьте это для логирования
  try {
      const task = await pool.query(`
      SELECT tasks.*, a.username AS authorname, b.username AS assigneename
      FROM tasks
      JOIN users AS a ON tasks.authorid = a.userid
      LEFT JOIN users AS b ON tasks.assigneeid = b.userid
      WHERE tasks.taskid = $1`, 
          [req.params.taskid]
      );
      if (task.rows.length > 0) {
          res.json(task.rows[0]);
      } else {
          res.status(404).send('Task not found');
      }
  } catch (error) {
      console.error('Error retrieving task:', error);
      res.status(500).send('Server Error');
  }
});

// Обновление задачи
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, authorid, assigneeid, deadline, status, task_type, priority } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  try {
    const updatedTask = await pool.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        authorid = COALESCE($3, authorid),
        assigneeid = COALESCE($4, assigneeid),
        deadline = COALESCE($5, deadline),
        status = COALESCE($6, status),
        task_type = COALESCE($7, task_type),
        priority = COALESCE($8, priority)
      WHERE taskid = $9 RETURNING *`,
      [title, description, authorid, assigneeid, deadline, status, task_type, priority, id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Удаление задачи
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await pool.query('DELETE FROM tasks WHERE taskid = $1 RETURNING *', [id]);

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Маршрут для получения профиля пользователя
app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = req.user; // Пользователь из токена аутентификации
  console.log("User object:", user);

  try {
    // Извлекаем данные пользователя из базы данных, включая дату регистрации
    const userData = await pool.query(
      'SELECT username, role, registered_at FROM users WHERE userid = $1',
      [user.userId]
    );

    if (userData.rows.length > 0) {
      const userProfile = {
        username: userData.rows[0].username,
        role: userData.rows[0].role,
        registeredAt: userData.rows[0].registered_at // Дата регистрации
      };
      res.json(userProfile);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).send('Server Error');
  }
});

// Получение всех пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT userid, username FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Ошибка получения списка пользователей:', error);
    res.status(500).send('Server Error');
  }
});

// Добавление комментария
app.post('/tasks/:id/comments', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { authorid, content } = req.body;

  if (!authorid || !content) {
    return res.status(400).json({ message: "Author ID and content are required." });
  }

  try {
    const newComment = await pool.query(
      'INSERT INTO comments (taskid, authorid, content) VALUES ($1, $2, $3) RETURNING *',
      [id, authorid, content]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.status(500).send('Server Error');
  }
});

// Получение комментария
app.get('/tasks/:id/comments', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await pool.query(
      `SELECT comments.*, users.username as authorname, users.role as authorrole 
      FROM comments 
      JOIN users ON comments.authorid = users.userid 
      WHERE comments.taskid = $1;`,
      [id]
    );
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Удаление комментариев
app.delete('/tasks/:taskId/comments/:commentId', authenticateToken, async (req, res) => {
  const { taskId, commentId } = req.params;

  try {
    const deleteResult = await pool.query(
      'DELETE FROM comments WHERE id = $1 AND taskid = $2 RETURNING *',
      [commentId, taskId]
    );

    if (deleteResult.rows.length > 0) {
      res.json({ message: "Комментарий удалён успешно." });
    } else {
      res.status(404).send('Комментарий не найден или у вас нет прав на его удаление.');
    }
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
    res.status(500).send('Server Error');
  }
});

// Начать выполнение задачи
app.patch('/tasks/:id/start', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const task = await pool.query('SELECT * FROM tasks WHERE taskid = $1', [id]);
    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await pool.query(
      `UPDATE tasks SET status = 'in_progress', assigneeid = $1 WHERE taskid = $2 RETURNING *`,
      [userId, id]
    );

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).send('Server Error');
  }
});

// Завершить выполнение задачи
app.patch('/tasks/:id/complete', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await pool.query('SELECT * FROM tasks WHERE taskid = $1', [id]);
    if (task.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await pool.query(
      `UPDATE tasks SET status = 'completed' WHERE taskid = $1 RETURNING *`,
      [id]
    );

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).send('Server Error');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Экспортируем приложение express для использования в других модулях
module.exports = app;
