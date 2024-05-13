require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Попробуйте один из этих вариантов импорта
//const jwtDecode = require('jwt-decode'); // Вариант 1
//const { default: jwtDecode } = require('jwt-decode'); // Вариант 2
const jwt = require('jwt-decode');
const jwtDecode = jwt.default || jwt;const userRoutes = require('./userRoutes');
const path = require('path');
const { registerUser, loginUser, authenticateToken } = require('./auth');
const { Pool } = require('pg');
const { pool, findTaskById, findUserById } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.post('/login', loginUser);
app.post('/register', registerUser);
app.get('/success', (req, res) => {
  res.send('Это страница после успешной авторизации');
});

app.post('/tasks', authenticateToken, async (req, res) => {
  const { title, description, authorid, assigneeid, deadline, status, task_type, priority } = req.body;
  const userId = req.user.userId; // Получение userId из токена аутентификации
  const username = req.user.username; // Получение username из токена аутентификации

  try {
    const newTask = await pool.query(
      `INSERT INTO tasks (title, description, authorid, assigneeid, deadline, status, task_type, priority) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        title || 'Untitled Task', 
        description || '', 
        authorid, 
        assigneeid, 
        deadline || null, 
        status || 'open', 
        task_type || 'general', 
        priority || 'normal'
      ]
    );

    await pool.query(
      'INSERT INTO task_history (taskid, event, userid, username) VALUES ($1, $2, $3, $4)',
      [newTask.rows[0].taskid, 'Создал задачу', userId, username]
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error); // Более подробное логирование
    res.status(500).send('Server Error');
  }
});


app.get('/tasks/:taskid', async (req, res) => {
  console.log("Requested task ID:", req.params.taskid);
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

app.get('/tasks', async (req, res) => {
  console.log("Запрос к /tasks получен");
  try {
    const query = `
    SELECT tasks.*, a.username as authorName, b.username as assigneeName
    FROM tasks
    JOIN users as a ON tasks.authorid = a.userid
    LEFT JOIN users as b ON tasks.assigneeid = b.userid;
    `;
    const results = await pool.query(query);
    console.log("Tasks with author names:", results.rows);
    res.json(results.rows);
  } catch (error) {
    console.error("Error retrieving tasks with author names:", error);
    res.status(500).send("Server Error");
  }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, authorid, assigneeid, deadline, status, task_type, priority } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const username = decoded.username;

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

    const events = [];
    if (title) events.push('Изменил название');
    if (description) events.push('Изменил описание');
    if (authorid) events.push('Изменил автора');
    if (assigneeid) events.push('Изменил исполнителя');
    if (deadline) events.push('Изменил срок выполнения');
    if (status) events.push('Изменил статус');
    if (task_type) events.push('Изменил тип задачи');
    if (priority) events.push('Изменил приоритет');

    for (const event of events) {
      await pool.query(
        'INSERT INTO task_history (taskid, event, userid, username) VALUES ($1, $2, $3, $4)',
        [id, event, userId, username]
      );
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

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

app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = req.user;
  console.log("User object:", user);

  try {
    const userData = await pool.query(
      'SELECT username, role, registered_at FROM users WHERE userid = $1',
      [user.userId]
    );

    if (userData.rows.length > 0) {
      const userProfile = {
        username: userData.rows[0].username,
        role: userData.rows[0].role,
        registeredAt: userData.rows[0].registered_at
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

app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT userid, username FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Ошибка получения списка пользователей:', error);
    res.status(500).send('Server Error');
  }
});

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

app.get('/tasks/:id/history', async (req, res) => {
  const { id } = req.params;

  try {
    const history = await pool.query('SELECT * FROM task_history WHERE taskid = $1 ORDER BY timestamp DESC', [id]);
    res.json(history.rows);
  } catch (error) {
    console.error('Ошибка получения истории задачи:', error);
    res.status(500).send('Server Error');
  }
});

app.patch('/tasks/:id/start', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  console.log(`Starting task ${id} for user ${userId}`);

  try {
    const task = await findTaskById(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const updatedTask = await updateTaskStatus(id, 'in_progress', userId);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).send('Task update failed');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function updateTaskStatus(taskId, newStatus, userId = null) {
  try {
    let query = 'UPDATE tasks SET status = $1';
    const queryParams = [newStatus];

    if (userId) {
      query += ', assigneeid = $2 WHERE taskid = $3 RETURNING *';
      queryParams.push(userId, taskId);
    } else {
      query += ' WHERE taskid = $2 RETURNING *';
      queryParams.push(taskId);
    }

    const result = await pool.query(query, queryParams);
    if (result.rows.length) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}

app.patch('/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await findTaskById(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const updatedTask = await updateTaskStatus(id, 'completed');
    res.json(updatedTask);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
