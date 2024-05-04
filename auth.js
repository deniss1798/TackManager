// auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
 
});


// Функция для регистрации пользователя
async function registerUser(req, res) {
  try {
    const { username, password, role } = req.body;
    // Проверяем, что значение роли не пустое и не равно null
    if (!role) {
      return res.status(400).send('Role is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(username, hashedPassword, role); // дополнительная отладка
    const newUser = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error in registerUser:', error); // Логирует ошибки
    res.status(500).send('Server error');
  }
}


// Функция для входа пользователя
async function loginUser(req, res) {
  const { username, password } = req.body;
  const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = userResult.rows[0];

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.userid, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token,
      user: { 
        userId: user.userid,
        username: user.username,
        role: user.role
      }
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
}

// Middleware для аутентификации токена JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  registerUser,
  loginUser,
  authenticateToken
};


