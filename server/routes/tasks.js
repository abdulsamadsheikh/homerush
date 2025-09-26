
const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  completeTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.delete('/:id', auth, completeTask);

module.exports = router;
