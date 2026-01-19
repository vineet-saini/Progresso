"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import ProgressBar from "../components/ProgressBar"
import { useAuth } from "../hooks/useAuth"
import "../styles/Reports.css"

export default function Reports() {
  const { token } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setReport(response.data)
      } catch (error) {
        console.error("Failed to fetch report:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [token])

  if (loading) {
    return (
      <div className="reports-container">
        <Navbar />
        <main className="reports-content">
          <div className="loading">Loading your reports...</div>
        </main>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="reports-container">
        <Navbar />
        <main className="reports-content">
          <div className="error">Failed to load reports</div>
        </main>
      </div>
    )
  }

  const last7DaysArray = Object.entries(report.last7Days).map(([date, count]) => ({
    date,
    count,
  }))

  const monthlyArray = Object.entries(report.monthlyStats).map(([week, count]) => ({
    week,
    count,
  }))

  return (
    <div className="reports-container">
      <Navbar />

      <main className="reports-content">
        <h1>Progress Reports</h1>

        {/* Overall Progress */}
        <div className="report-card">
          <h2>Overall Progress</h2>
          <div className="overall-stats">
            <div className="overall-stat">
              <span className="label">Total Tasks</span>
              <span className="value">{report.totalTasks}</span>
            </div>
            <div className="overall-stat">
              <span className="label">Completed</span>
              <span className="value">{report.completedTasks}</span>
            </div>
            <div className="overall-stat">
              <span className="label">Completion Rate</span>
              <span className="value">{report.completionRate}%</span>
            </div>
          </div>
          <ProgressBar percentage={report.completionRate} />
        </div>

        {/* Category Breakdown */}
        <div className="report-card">
          <h2>Category Breakdown</h2>
          <div className="category-stats">
            {Object.entries(report.categoryStats).map(([category, stats]) => (
              <div key={category} className="category-stat">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-percentage">{stats.percentage}%</span>
                </div>
                <div className="category-info">
                  <span className="category-count">
                    {stats.completed} / {stats.total}
                  </span>
                </div>
                <ProgressBar percentage={stats.percentage} />
              </div>
            ))}
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="report-card">
          <h2>Last 7 Days Activity</h2>
          <div className="daily-chart">
            {last7DaysArray.map(({ date, count }) => (
              <div key={date} className="daily-bar">
                <div className="bar-container">
                  <div className="bar" style={{ height: count > 0 ? Math.min(100, count * 30) : 5 }}></div>
                </div>
                <span className="date-label">{new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="report-card">
          <h2>Monthly Breakdown (Last 4 Weeks)</h2>
          <div className="monthly-stats">
            {monthlyArray.map(({ week, count }) => (
              <div key={week} className="monthly-stat">
                <span className="week-name">{week}</span>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: count > 0 ? Math.min(100, count * 20) : 2 }}>
                    <span className="count-label">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
