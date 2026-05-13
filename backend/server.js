const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const Task = require('./models/Task');

app.use(cors());
app.use(express.json());

// Favicon route
app.get('/favicon.ico', (req, res) => res.status(204).end());

// MongoDB Connection and Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// Start server after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
