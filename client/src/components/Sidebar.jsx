"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"
import "../styles/Sidebar.css"

export default function Sidebar({ selectedCategory, onCategoryChange, refreshTrigger }) {
  const [categories, setCategories] = useState(["All"])
  const { token } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCategories(["All", ...response.data.categories])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories(["All", "Daily Tasks", "Office", "Study", "Gym"])
      }
    }
    if (token) {
      fetchCategories()
    }
  }, [token, refreshTrigger])

  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
