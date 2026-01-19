"use client"
import "../styles/ProgressBar.css"

export default function ProgressBar({ percentage }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="progress-text">{percentage}%</span>
    </div>
  )
}
