import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    completed: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const tmodel = mongoose.model("Todo", todoSchema);
export default tmodel;
