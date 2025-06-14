import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todos.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
dotenv.config();

const __dirname = path.resolve();
app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
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
