"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useTasks } from "../hooks/useTasks"
import { useAuth } from "../hooks/useAuth"
import "../styles/Modal.css"

export default function EditTaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [category, setCategory] = useState(task.category)
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const { updateTask } = useTasks()
  const { token } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.categories && response.data.categories.length > 0) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories(["Daily Tasks", "Office", "Study", "Gym"])
      }
    }
    if (token) {
      fetchCategories()
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    if (!category) {
      setError("Category is required")
      return
    }

    setLoading(true)

    try {
      await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate,
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.length === 0 && <option value={task.category}>{task.category}</option>}
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
