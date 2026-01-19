"use client"
import { useState } from "react"
import { useTasks } from "../hooks/useTasks"
import EditTaskModal from "./EditTaskModal"
import "../styles/TaskCard.css"

export default function TaskCard({ task }) {
  const { toggleTaskCompletion, deleteTask } = useTasks()
  const [showEditModal, setShowEditModal] = useState(false)

  const handleToggle = async () => {
    await toggleTaskCompletion(task._id)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id)
    }
  }

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed

  const formatDueDate = (date) => {
    const dueDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays === -1) return "Yesterday"
    if (diffDays > 0) return `in ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  return (
    <>
      <div className={`task-card ${task.completed ? "completed" : ""} ${isOverdue ? "overdue" : ""}`}>
        <div className="task-header">
          <input type="checkbox" checked={task.completed} onChange={handleToggle} className="task-checkbox" />

          <div className="task-info" onClick={() => setShowEditModal(true)} style={{ cursor: "pointer" }}>
            <h3 className={task.completed ? "task-title-completed" : ""}>{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}
          </div>

          <button onClick={handleDelete} className="delete-btn">
            ×
          </button>
        </div>

        <div className="task-footer">
          <span className={`task-category category-${task.category.toLowerCase()}`}>{task.category}</span>
          <span className={`task-due-date ${isOverdue ? "overdue-text" : ""}`}>
            {formatDueDate(task.dueDate)}
          </span>
        </div>
      </div>

      {showEditModal && <EditTaskModal task={task} onClose={() => setShowEditModal(false)} />}
    </>
  )
}
