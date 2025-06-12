import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
const router = express.Router();
const saltR = 10;

// Login route
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    // Validate inputs
    if (!(userName && password)) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    // Find user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(404).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        userAvatar: user.profilePicture,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        userName: user.userName,
        id: user._id,
        userAvatar: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { userName, email, password, avatar } = req.body;
    // Validate inputs
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "userName, email, and password are required" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User email already exists" });
    }
    const hashP = await bcrypt.hash(password, saltR);
    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashP,
      profilePicture: avatar,
    });
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: savedUser._id,
        userName: savedUser.userName,
        avatar: savedUser.profilePicture || "",
      },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        userName: savedUser.userName,
        avatar: savedUser.profilePicture || "",
      },
      success: true,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

export default router;
