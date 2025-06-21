import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todos.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();

// Log environment variables for debugging
// console.log("JWT_TOKEN:", process.env.JWT_TOKEN ? "Loaded" : "Missing");
// console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");
// console.log(
//   "GOOGLE_CLIENT_ID:",
//   process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Missing"
// );

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "prod"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("hello from /");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port: ${PORT}`);
});
