import express from "express"
import User from "../models/User.js"
import Task from "../models/Task.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const tasks = await Task.find({ userId: req.userId })
    const completedTasks = tasks.filter((t) => t.completed)

    res.json({
      ...user.toObject(),
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body

    const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true, runValidators: true }).select(
      "-password",
    )

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add category
router.post("/categories", authMiddleware, async (req, res) => {
  try {
    const { category } = req.body
    const user = await User.findById(req.userId)
    
    if (!user.categories.includes(category)) {
      user.categories.push(category)
      await user.save()
    }
    
    res.json({ categories: user.categories })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete category
router.delete("/categories/:category", authMiddleware, async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category)
    const user = await User.findById(req.userId)
    
    const defaultCategories = ["Daily Tasks", "Office", "Study", "Gym"]
    if (defaultCategories.includes(category)) {
      return res.status(400).json({ message: "Cannot delete default category" })
    }
    
    user.categories = user.categories.filter(c => c !== category)
    await user.save()
    
    res.json({ categories: user.categories })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get categories
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    res.json({ categories: user.categories })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get progress report
router.get("/report", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const tasks = await Task.find({ userId: req.userId })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.completed).length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Category breakdown using user's categories
    const categoryStats = {}
    user.categories.forEach((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat)
      const catCompleted = catTasks.filter((t) => t.completed).length
      categoryStats[cat] = {
        total: catTasks.length,
        completed: catCompleted,
        percentage: catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0,
      }
    })

    // Last 7 days breakdown
    const last7Days = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayTasks = tasks.filter((t) => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        completedDate.setHours(0, 0, 0, 0)
        return completedDate.toISOString().split("T")[0] === dateStr
      })
      last7Days[dateStr] = dayTasks.length
    }

    // Monthly breakdown (4 weeks)
    const monthlyStats = {}
    for (let week = 1; week <= 4; week++) {
      const startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      startDate.setDate(startDate.getDate() - week * 7)
      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
      endDate.setDate(endDate.getDate() - (week - 1) * 7)

      const weekTasks = tasks.filter((t) => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        return completedDate >= startDate && completedDate <= endDate
      })

      monthlyStats[`Week ${5 - week}`] = weekTasks.length
    }

    res.json({
      totalTasks,
      completedTasks,
      completionRate,
      categoryStats,
      last7Days,
      monthlyStats,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
