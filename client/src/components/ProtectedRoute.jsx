"use client"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute() {
  const { token, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return token ? <Outlet /> : <Navigate to="/login" />
}
