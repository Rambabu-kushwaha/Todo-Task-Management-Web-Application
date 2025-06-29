const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    url: String,
    originalName: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
// Only keep necessary indexes, avoid duplicates
// taskSchema.index({ owner: 1, status: 1 });
// taskSchema.index({ owner: 1, dueDate: 1 });
taskSchema.index({ 'sharedWith.user': 1 });
taskSchema.index({ status: 1, priority: 1 });

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due
taskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to mark task as completed
taskSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to mark task as in progress
taskSchema.methods.markInProgress = function() {
  this.status = 'in-progress';
  return this.save();
};

// Method to share task with user
taskSchema.methods.shareWithUser = function(userId, permission = 'view') {
  const existingShare = this.sharedWith.find(share => share.user.toString() === userId);
  
  if (existingShare) {
    existingShare.permission = permission;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      user: userId,
      permission: permission,
      sharedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove user from shared list
taskSchema.methods.removeSharedUser = function(userId) {
  this.sharedWith = this.sharedWith.filter(share => share.user.toString() !== userId);
  return this.save();
};

// Static method to get tasks with pagination
taskSchema.statics.getTasksWithPagination = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search
  } = options;

  const query = {
    $or: [
      { owner: userId },
      { 'sharedWith.user': userId }
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

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .populate('owner', 'name username avatar')
    .populate('sharedWith.user', 'name username avatar')
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get task statistics
taskSchema.statics.getTaskStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { owner: mongoose.Types.ObjectId(userId) },
          { 'sharedWith.user': mongoose.Types.ObjectId(userId) }
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
};

module.exports = mongoose.model('Task', taskSchema); 