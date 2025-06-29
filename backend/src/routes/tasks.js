const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateToken } = require('../middleware/auth');

// Get all tasks for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;
    
    // Build query
    const query = {
      $or: [
        { owner: req.user.userId },
        { 'sharedWith.user': req.user.userId }
      ]
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = await Task.find(query)
      .populate('owner', 'name username avatar')
      .populate('sharedWith.user', 'name username avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        hasNextPage: page * limit < totalTasks,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.userId },
        { 'sharedWith.user': req.user.userId }
      ]
    }).populate('owner', 'name username avatar')
      .populate('sharedWith.user', 'name username avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, isPublic } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      tags,
      isPublic,
      owner: req.user.userId
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate, tags, isPublic } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;
    if (isPublic !== undefined) task.isPublic = isPublic;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share task with user
router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const { userId, permission = 'view' } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is already shared
    const existingShare = task.sharedWith.find(share => share.user.toString() === userId);
    if (existingShare) {
      return res.status(400).json({ message: 'User is already shared with this task' });
    }

    // Add user to shared list
    task.sharedWith.push({ user: userId, permission });
    await task.save();
    
    res.json({ message: 'Task shared successfully' });
  } catch (error) {
    console.error('Share task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user from shared task
router.delete('/:id/share/:userId', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove user from shared list
    task.sharedWith = task.sharedWith.filter(share => share.user.toString() !== req.params.userId);
    await task.save();
    
    res.json({ message: 'User removed from shared task' });
  } catch (error) {
    console.error('Remove shared user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          $or: [
            { owner: req.user.userId },
            { 'sharedWith.user': req.user.userId }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalTasks = stats.reduce((sum, stat) => sum + stat.count, 0);
    const completedTasks = stats.find(stat => stat._id === 'completed')?.count || 0;
    const pendingTasks = stats.find(stat => stat._id === 'pending')?.count || 0;
    const inProgressTasks = stats.find(stat => stat._id === 'in-progress')?.count || 0;

    res.json({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 