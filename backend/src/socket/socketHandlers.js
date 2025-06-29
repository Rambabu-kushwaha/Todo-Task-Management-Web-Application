const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

// Store connected users
const connectedUsers = new Map();

const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Add user to connected users map
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Emit user connected event to all connected users
    socket.broadcast.emit('user:connected', {
      userId: socket.userId,
      user: {
        id: socket.user._id,
        name: socket.user.name,
        email: socket.user.email,
        picture: socket.user.picture
      }
    });

    // Handle task creation
    socket.on('task:create', async (taskData) => {
      try {
        const task = new Task({
          ...taskData,
          owner: socket.userId
        });

        await task.save();
        await task.populate('owner', 'name email picture');
        await task.populate('sharedWith.user', 'name email picture');

        // Emit to task owner
        socket.emit('task:created', { task });

        // Emit to shared users if any
        if (task.sharedWith.length > 0) {
          task.sharedWith.forEach(share => {
            const sharedUser = connectedUsers.get(share.user.toString());
            if (sharedUser) {
              io.to(sharedUser.socketId).emit('task:shared', { task });
            }
          });
        }
      } catch (error) {
        console.error('Task creation error:', error);
        socket.emit('error', { message: 'Failed to create task' });
      }
    });

    // Handle task update
    socket.on('task:update', async (data) => {
      try {
        const { taskId, updates } = data;
        const task = await Task.findById(taskId);

        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Check permissions
        if (!task.hasPermission(socket.userId, 'write')) {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        // Update task
        Object.assign(task, updates);
        await task.save();
        await task.populate('owner', 'name email picture');
        await task.populate('sharedWith.user', 'name email picture');

        // Emit to all users with access to this task
        const usersToNotify = [task.owner.toString(), ...task.sharedWith.map(s => s.user.toString())];
        
        usersToNotify.forEach(userId => {
          const connectedUser = connectedUsers.get(userId);
          if (connectedUser) {
            io.to(connectedUser.socketId).emit('task:updated', { task });
          }
        });
      } catch (error) {
        console.error('Task update error:', error);
        socket.emit('error', { message: 'Failed to update task' });
      }
    });

    // Handle task deletion
    socket.on('task:delete', async (taskId) => {
      try {
        const task = await Task.findById(taskId);

        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Check permissions
        if (!task.hasPermission(socket.userId, 'admin')) {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        // Get users to notify before deletion
        const usersToNotify = [task.owner.toString(), ...task.sharedWith.map(s => s.user.toString())];

        // Delete task
        await Task.findByIdAndDelete(taskId);

        // Emit to all users with access to this task
        usersToNotify.forEach(userId => {
          const connectedUser = connectedUsers.get(userId);
          if (connectedUser) {
            io.to(connectedUser.socketId).emit('task:deleted', { taskId });
          }
        });
      } catch (error) {
        console.error('Task deletion error:', error);
        socket.emit('error', { message: 'Failed to delete task' });
      }
    });

    // Handle task sharing
    socket.on('task:share', async (data) => {
      try {
        const { taskId, email, permission = 'read' } = data;
        const task = await Task.findById(taskId);

        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Check permissions
        if (!task.hasPermission(socket.userId, 'write')) {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        // Find user to share with
        const userToShare = await User.findOne({ email: email.toLowerCase() });
        if (!userToShare) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Share task
        await task.shareWithUser(userToShare._id, permission);
        await task.populate('owner', 'name email picture');
        await task.populate('sharedWith.user', 'name email picture');

        // Emit to task owner
        socket.emit('task:shared', { task });

        // Emit to newly shared user if online
        const sharedUser = connectedUsers.get(userToShare._id.toString());
        if (sharedUser) {
          io.to(sharedUser.socketId).emit('task:shared', { task });
        }
      } catch (error) {
        console.error('Task sharing error:', error);
        socket.emit('error', { message: 'Failed to share task' });
      }
    });

    // Handle comment addition
    socket.on('task:comment', async (data) => {
      try {
        const { taskId, content } = data;
        const task = await Task.findById(taskId);

        if (!task) {
          socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Check permissions
        if (!task.hasPermission(socket.userId, 'read')) {
          socket.emit('error', { message: 'Permission denied' });
          return;
        }

        // Add comment
        task.comments.push({
          user: socket.userId,
          content: content.trim()
        });

        await task.save();
        await task.populate('owner', 'name email picture');
        await task.populate('sharedWith.user', 'name email picture');
        await task.populate('comments.user', 'name email picture');

        // Emit to all users with access to this task
        const usersToNotify = [task.owner.toString(), ...task.sharedWith.map(s => s.user.toString())];
        
        usersToNotify.forEach(userId => {
          const connectedUser = connectedUsers.get(userId);
          if (connectedUser) {
            io.to(connectedUser.socketId).emit('task:commented', { task });
          }
        });
      } catch (error) {
        console.error('Task comment error:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Handle user typing indicator
    socket.on('task:typing', (data) => {
      const { taskId } = data;
      socket.to(`task:${taskId}`).emit('user:typing', {
        userId: socket.userId,
        userName: socket.user.name,
        taskId
      });
    });

    // Handle user stop typing
    socket.on('task:stop-typing', (data) => {
      const { taskId } = data;
      socket.to(`task:${taskId}`).emit('user:stop-typing', {
        userId: socket.userId,
        taskId
      });
    });

    // Handle joining task room (for real-time updates)
    socket.on('task:join', (taskId) => {
      socket.join(`task:${taskId}`);
    });

    // Handle leaving task room
    socket.on('task:leave', (taskId) => {
      socket.leave(`task:${taskId}`);
    });

    // Handle user status update
    socket.on('user:status', (status) => {
      const userData = connectedUsers.get(socket.userId);
      if (userData) {
        userData.status = status;
        socket.broadcast.emit('user:status-updated', {
          userId: socket.userId,
          status
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.userId})`);
      
      // Remove from connected users
      connectedUsers.delete(socket.userId);

      // Emit user disconnected event
      socket.broadcast.emit('user:disconnected', {
        userId: socket.userId,
        user: {
          id: socket.user._id,
          name: socket.user.name,
          email: socket.user.email,
          picture: socket.user.picture
        }
      });
    });
  });

  // Helper function to get connected users
  io.getConnectedUsers = () => {
    return Array.from(connectedUsers.values());
  };

  // Helper function to emit to specific user
  io.emitToUser = (userId, event, data) => {
    const userData = connectedUsers.get(userId);
    if (userData) {
      io.to(userData.socketId).emit(event, data);
    }
  };

  // Helper function to emit to multiple users
  io.emitToUsers = (userIds, event, data) => {
    userIds.forEach(userId => {
      io.emitToUser(userId, event, data);
    });
  };
};

module.exports = { setupSocketHandlers }; 