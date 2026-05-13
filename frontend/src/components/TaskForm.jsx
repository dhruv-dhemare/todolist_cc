import { useState, useEffect } from 'react'
import './TaskForm.css'

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
  }, [editingTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    onSubmit({ title, description })
    setTitle('')
    setDescription('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
        required
      />
      <textarea
        placeholder="Task description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-textarea"
        rows="3"
      />
      <div className="form-buttons">
        <button type="submit" className="btn-submit">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
