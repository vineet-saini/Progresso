"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"
import "../styles/Profile.css"

export default function Profile() {
  const { user, token, updateUser } = useAuth()
  const { tasks } = useTasks()
  const [name, setName] = useState(user?.name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({})
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [showAddCategory, setShowAddCategory] = useState(false)

  useEffect(() => {
    const completedTasks = tasks.filter((t) => t.completed).length
    const totalTasks = tasks.length
    setStats({
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    })
  }, [tasks])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCategories(response.data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories([])
      }
    }
    if (token) {
      fetchCategories()
    }
  }, [token])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      updateUser({ ...user, name: response.data.name })
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/categories",
        { category: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setCategories(response.data.categories)
      setNewCategory("")
      setShowAddCategory(false)
      window.dispatchEvent(new Event("categoryUpdated"))
    } catch (error) {
      console.error("Failed to add category:", error)
    }
  }

  const handleDeleteCategory = async (category) => {
    const defaultCategories = ["Daily Tasks", "Office", "Study", "Gym"]
    if (defaultCategories.includes(category)) {
      alert("Cannot delete default category")
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/categories/${encodeURIComponent(category)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setCategories(response.data.categories)
      window.dispatchEvent(new Event("categoryUpdated"))
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  return (
    <div className="profile-container">
      <Navbar />

      <main className="profile-content">
        <div className="profile-card">
          <h1>My Profile</h1>

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" value={user?.email} disabled className="input-disabled" />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="joinDate">Profile Created</label>
              <input
                id="joinDate"
                type="text"
                value={new Date(user?.createdAt).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
                disabled
                className="input-disabled"
              />
            </div>

            {message && <div className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</div>}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div className="stats-card">
          <h2>Your Task Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{stats.totalTasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.completionRate}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Manage Categories</h2>
            <button onClick={() => setShowAddCategory(!showAddCategory)} className="submit-btn" style={{ padding: "0.5rem 1rem" }}>
              {showAddCategory ? "Cancel" : "+ Add Category"}
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleAddCategory} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  style={{ flex: 1, padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                />
                <button type="submit" className="submit-btn" style={{ padding: "0.5rem 1rem" }}>
                  Add
                </button>
              </div>
            </form>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {categories.length === 0 ? (
              <p style={{ color: "#666" }}>No categories yet. Add one to get started!</p>
            ) : (
              categories.map((category) => {
                const defaultCategories = ["Daily Tasks", "Office", "Study", "Gym"]
                const isDefault = defaultCategories.includes(category)
                return (
                  <div
                    key={category}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      background: isDefault ? "#4CAF50" : "#2196F3",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>{category}</span>
                    {!isDefault && (
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
