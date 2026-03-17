const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');


// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;
  console.log('Creating task for user:', req.user?._id);
  console.log('Payload:', { title, description, status, priority });

  try {
    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      priority,
    });

    const createdTask = await task.save();
    console.log('Task saved successfully:', createdTask._id);
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Save Task ERROR:', error);
    res.status(500);
    throw error;
  }
});

// @desc    Get all user tasks (with pagination, search, filter)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? {
        $or: [
          {
            title: {
              $regex: req.query.search,
              $options: 'i',
            },
          },
          {
            status: {
              $regex: req.query.search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const status = req.query.status ? { status: req.query.status } : {};

  const count = await Task.countDocuments({ user: req.user._id, ...keyword, ...status });
  const tasks = await Task.find({ user: req.user._id, ...keyword, ...status })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdDate: -1 });

  res.json({
    tasks,
    currentPage: page,
    totalPages: Math.ceil(count / pageSize),
    totalTasks: count,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
