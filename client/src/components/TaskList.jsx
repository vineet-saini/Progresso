"use client"
import TaskCard from "./TaskCard"
import "../styles/TaskList.css"

export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create one to get started!</div>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  )
}
