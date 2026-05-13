import TaskItem from './TaskItem'
import './TaskList.css'

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p className="empty-text">No tasks yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList
