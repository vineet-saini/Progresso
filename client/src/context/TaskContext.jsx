"use client"

import { createContext, useState, useCallback } from "react"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"
import API_URL from "../config/api"

export const TaskContext = createContext()

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get("/tasks")
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const addTask = useCallback(
    async (taskData) => {
      try {
        const response = await api.post("/tasks", taskData)
        setTasks([response.data, ...tasks])
        return response.data
      } catch (error) {
        console.error("Error adding task:", error)
        throw error
      }
    },
    [tasks, token],
  )

  const updateTask = useCallback(
    async (taskId, updates) => {
      try {
        const response = await api.put(`/tasks/${taskId}`, updates)
        setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)))
        return response.data
      } catch (error) {
        console.error("Error updating task:", error)
        throw error
      }
    },
    [tasks, token],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await api.delete(`/tasks/${taskId}`)
        setTasks(tasks.filter((t) => t._id !== taskId))
      } catch (error) {
        console.error("Error deleting task:", error)
        throw error
      }
    },
    [tasks, token],
  )

  const toggleTaskCompletion = useCallback(
    async (taskId) => {
      const task = tasks.find((t) => t._id === taskId)
      if (task) {
        await updateTask(taskId, { completed: !task.completed })
      }
    },
    [tasks, updateTask],
  )

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
