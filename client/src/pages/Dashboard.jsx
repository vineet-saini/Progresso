"use client"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import TaskList from "../components/TaskList"
import AddTaskModal from "../components/AddTaskModal"
import { useTasks } from "../hooks/useTasks"
import "../styles/Dashboard.css"

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { tasks, fetchTasks, loading } = useTasks()

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const handleCategoryUpdate = () => {
      setRefreshTrigger((prev) => prev + 1)
    }
    window.addEventListener("categoryUpdated", handleCategoryUpdate)
    return () => window.removeEventListener("categoryUpdated", handleCategoryUpdate)
  }, [])

  const filteredTasks = selectedCategory === "All" ? tasks : tasks.filter((t) => t.category === selectedCategory)

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} refreshTrigger={refreshTrigger} />

        <main className="main-content">
          <div className="dashboard-header">
            <h1>{selectedCategory === "All" ? "All Tasks" : selectedCategory} Tasks</h1>
            <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
              + Add Task
            </button>
          </div>

          {loading ? <div className="loading">Loading tasks...</div> : <TaskList tasks={filteredTasks} />}
        </main>
      </div>

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
