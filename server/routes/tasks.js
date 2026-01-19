import express from "express"
import Task from "../models/Task.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Create task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, dueDate } = req.body

    const task = new Task({
      userId: req.userId,
      title,
      description,
      category,
      dueDate,
    })

    await task.save()
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all tasks for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get tasks by category
router.get("/category/:category", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      category: req.params.category,
    }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, dueDate, completed } = req.body

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId })
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    if (title) task.title = title
    if (description !== undefined) task.description = description
    if (category) task.category = category
    if (dueDate) task.dueDate = dueDate
    if (completed !== undefined) {
      task.completed = completed
      task.completedAt = completed ? new Date() : null
    }

    task.updatedAt = new Date()
    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({ message: "Task deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
