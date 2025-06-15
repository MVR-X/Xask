import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Regular username/password login
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!process.env.JWT_TOKEN) {
      throw new Error("JWT_TOKEN is not defined in environment variables");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.json({
      user: { userName: user.userName, email: user.email, avatar: user.avatar },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
});

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { userName, email, password, avatar } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      avatar: avatar || "",
    });
    await user.save();

    if (!process.env.JWT_TOKEN) {
      throw new Error("JWT_TOKEN is not defined in environment variables");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({
        user: {
          userName: user.userName,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

export default router;
