import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

// Backend URL - centralized configuration
export const BACKEND_URL = 'http://Todolist-backend-env.eba-w9uuqqqw.ap-south-1.elasticbeanstalk.com'

function App() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks`)
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(`Failed to load tasks. Make sure the backend is running on ${BACKEND_URL}`)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (!response.ok) throw new Error('Failed to add task')
      const newTask = await response.json()
      setTasks([newTask, ...tasks])
    } catch (err) {
      console.error('Error adding task:', err)
      alert('Failed to add task')
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      setTasks(tasks.map(t => t._id === id ? updatedTask : t))
      setEditingTask(null)
    } catch (err) {
      console.error('Error updating task:', err)
      alert('Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task')
    }
  }

  const toggleComplete = async (task) => {
    updateTask(task._id, { ...task, completed: !task.completed })
  }

  const handleEdit = (task) => {
    setEditingTask(task)
  }

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      updateTask(editingTask._id, taskData)
    } else {
      addTask(taskData)
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Task Manager</h1>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading-message">Loading tasks...</div>
        ) : (
          <>
            <TaskForm 
              onSubmit={handleFormSubmit} 
              editingTask={editingTask}
              onCancel={() => setEditingTask(null)}
            />
            <TaskList 
              tasks={tasks}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
