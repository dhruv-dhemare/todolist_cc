import './TaskItem.css'

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        <div className="task-text">
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-description">{task.description}</p>}
          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>✏️</button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>🗑️</button>
      </div>
    </div>
  )
}

export default TaskItem
