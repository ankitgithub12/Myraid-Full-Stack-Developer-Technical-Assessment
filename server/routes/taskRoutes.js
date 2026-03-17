const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { taskValidation } = require('../middleware/validationMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, taskValidation, createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, taskValidation, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
