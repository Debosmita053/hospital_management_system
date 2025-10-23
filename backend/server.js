const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their role-based room
  socket.on('join-room', (userRole, userId) => {
    const roomName = `${userRole}-${userId}`;
    socket.join(roomName);
    console.log(`User ${userId} joined room: ${roomName}`);
  });

  // Handle appointment notifications
  socket.on('appointment-update', (data) => {
    // Broadcast to relevant users
    io.to(`doctor-${data.doctorId}`).emit('appointment-updated', data);
    io.to(`patient-${data.patientId}`).emit('appointment-updated', data);
    io.to('admin-room').emit('appointment-updated', data);
  });

  // Handle billing notifications
  socket.on('billing-update', (data) => {
    io.to(`patient-${data.patientId}`).emit('billing-updated', data);
    io.to('admin-room').emit('billing-updated', data);
  });

  // Handle medicine stock alerts
  socket.on('stock-alert', (data) => {
    io.to('admin-room').emit('stock-alert', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to other modules
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
