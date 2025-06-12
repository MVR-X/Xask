import express from "express";
import Todo from "../models/Todo.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded.id; // Store user ID from token in request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//mytodos
router.get("/mytodos/:id", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.id });
    if (!todos) return res.status(404).json({ message: "No tasks found" });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post("/", async (req, res) => {
  try {
    const {
      text,
      title,
      image,
      category,
      userId,
      userName,
      avatar,
      completed,
    } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ message: "Text and userId are required" });
    }
    const todo = new Todo({
      text,
      title,
      category,
      image,
      userName,
      avatar,
      userId,
      completed,
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      console.log("404todo");

      return res.status(404).json({ message: "Todo not found" });
    }
    if (todo.userId.toString() !== req.userId) {
      console.log("403odo");

      return res.status(403).json({ message: "Unauthorized access" });
    }
    const {
      text,
      title,
      image,
      category,
      userId,
      userName,
      avatar,
      completed,
    } = req.body;
    const upTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        text,
        title,
        category,
        image,
        userName,
        avatar,
        userId,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!upTodo) {
      console.log("uptodo");
      return res.status(404).json({ error: "User not found" });
    }
    res.json(upTodo);
  } catch (err) {
    console.error(err);

    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the todo
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Check if the user owns the todo
    if (todo.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own todos" });
    }

    // Delete the todo
    await todo.deleteOne(); // Modern Mongoose method
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Error deleting todo:", err); // Log for debugging
    res.status(500).json({ message: "Server error, please try again later" });
  }
});
export default router;
