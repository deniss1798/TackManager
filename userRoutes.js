const express = require('express');
const router = express.Router();

// Здесь можно добавить маршруты, связанные с пользователями
router.get('/some-route', (req, res) => {
  res.send('This is a response from some user route.');
});

module.exports = router;
