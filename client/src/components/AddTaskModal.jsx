"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useTasks } from "../hooks/useTasks"
import { useAuth } from "../hooks/useAuth"
import "../styles/Modal.css"

export default function AddTaskModal({ onClose }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const { addTask } = useTasks()
  const { token } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data.categories && response.data.categories.length > 0) {
          setCategories(response.data.categories)
          setCategory(response.data.categories[0])
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories(["Daily Tasks", "Office", "Study", "Gym"])
        setCategory("Daily Tasks")
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

    if (!dueDate) {
      setError("Due date is required")
      return
    }

    if (!category) {
      setError("Category is required")
      return
    }

    setLoading(true)

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate,
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
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
                {categories.length === 0 && <option value="">Loading...</option>}
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
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
