"use client"

import { createContext, useState, useCallback, useContext } from "react"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"

export const CategoryContext = createContext()

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { token } = useAuth()

  const fetchCategories = useCallback(async () => {
    if (!token) return
    try {
      const response = await axios.get("http://localhost:5000/api/users/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(response.data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }, [token])

  const refreshCategories = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories, refreshCategories, refreshTrigger }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider")
  }
  return context
}
