"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import "../styles/Navbar.css"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          Progresso
        </Link>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/reports" className="nav-link">
            Reports
          </Link>
          <Link to="/profile" className="nav-link">
            {user?.name}
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
